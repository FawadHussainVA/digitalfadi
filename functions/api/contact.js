
const json = (body, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" }
  });

export async function onRequestPost({ request, env }) {
  try {
    const origin = request.headers.get("Origin");
    const site = new URL(request.url).origin;

    if (origin && origin !== site) {
      return json({ success: false, error: "Invalid origin" }, 403);
    }

    const data = await request.json();
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return json({ success: false }, 400);
    }

    // Honeypot: ignore automated spam.
    if (data["bot-field"]) {
      return json({ success: true });
    }

    const form = String(data["form-name"] || "");
    if (!["contact-hero", "account-analysis"].includes(form)) {
      return json({ success: false, error: "Invalid form" }, 400);
    }

    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();

    if (!name || name.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254) {
      return json({ success: false, error: "Invalid details" }, 400);
    }

    // Verify Cloudflare Turnstile before sending email.
    const token = String(data["cf-turnstile-response"] || "");

    if (!env.TURNSTILE_SECRET_KEY) {
      return json({ success: false, error: "Turnstile not configured" }, 503);
    }

    if (!token || token.length > 2048) {
      return json({ success: false, error: "Verification required" }, 403);
    }

    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: request.headers.get("CF-Connecting-IP")
        })
      }
    );

    if (!verification.ok) {
      return json({ success: false, error: "Verification unavailable" }, 502);
    }

    const verificationResult = await verification.json();

    if (
      verificationResult.success !== true ||
      !["digitalfadi.com", "www.digitalfadi.com"].includes(verificationResult.hostname)
    ) {
      // Never log the token, the secret, or the visitor's personal details.
      console.error("Turnstile verification rejected", JSON.stringify({
        verified: verificationResult.success === true,
        codes: Array.isArray(verificationResult["error-codes"]) ? verificationResult["error-codes"] : [],
        hostname: verificationResult.hostname || null
      }));
      return json({ success: false, error: "Verification failed" }, 403);
    }

   
const excluded = new Set([
  "access_key", "bot-field", "form-name",
  "subject", "from_name", "cf-turnstile-response"
]);

    const lines = Object.entries(data)
      .filter(([key]) => !excluded.has(key))
      .map(([key, value]) => {
        const safeKey = String(key).slice(0, 60);
        const safeValue = String(value).slice(0, 2000);
        return `${safeKey}: ${safeValue}`;
      });

    const subject = form === "account-analysis"
      ? "DigitalFadi - Free Google Ads Audit"
      : "DigitalFadi - Contact Enquiry";

    // Send through a private Worker service binding with a verified-recipient
    // Cloudflare Email Routing send_email binding. No paid arbitrary-recipient API.
    if (!env.CONTACT_MAILER || typeof env.CONTACT_MAILER.fetch !== "function") {
      console.error("CONTACT_MAILER Worker service binding missing");
      return json({ success: false, error: "Email service not configured" }, 503);
    }

    let response;
    try {
      response = await env.CONTACT_MAILER.fetch("https://contact-mailer.internal/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replyTo: email,
          subject,
          text: ["New DigitalFadi enquiry:", "", ...lines].join("\n")
        })
      });
    } catch (error) {
      console.error("Private contact mailer failed", String(error?.message || error).slice(0,180));
      return json({ success: false, error: "Email service unavailable" }, 502);
    }
    let result;
    try { result = await response.json(); } catch (_) { result = null; }
    if (!response.ok || result?.success !== true) {
      console.error("Private contact mailer rejected", response.status, result?.error || "Unknown");
      return json({ success: false, error: "Email delivery failed" }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Contact form failed", error.message);
    return json({ success: false, error: "Request failed" }, 500);
  }
}
