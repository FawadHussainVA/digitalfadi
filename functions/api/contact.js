
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

    // Cloudflare Email Sending REST API. No SMTP socket or third-party forms.
    if (!env.CLOUDFLARE_ACCOUNT_ID || !env.CLOUDFLARE_EMAIL_TOKEN) {
      console.error("Cloudflare Email Sending credentials missing");
      return json({ success: false, error: "Email sending not configured" }, 503);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let response;
    try {
      response = await fetch(
        "https://api.cloudflare.com/client/v4/accounts/" +
          encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID) + "/email/sending/send",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + env.CLOUDFLARE_EMAIL_TOKEN,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          signal: controller.signal,
          body: JSON.stringify({
            from: "fawad@digitalfadi.com",
            to: ["zaheer.geoz@gmail.com"],
            subject,
            text: ["New enquiry: " + subject, "", ...lines].join("\n")
          })
        }
      );
    } catch (error) {
      console.error("Cloudflare Email Sending request failed", error?.name || String(error));
      return json({ success: false, error: "Email service unavailable" }, 502);
    } finally {
      clearTimeout(timer);
    }

    let result;
    try { result = await response.json(); } catch (_) { result = null; }
    if (!response.ok || result?.success !== true) {
      const details = Array.isArray(result?.errors)
        ? result.errors.map(e => ({ code: e.code, message: String(e.message || "").slice(0, 160) }))
        : [];
      console.error("Cloudflare Email Sending rejected", response.status, JSON.stringify(details));
      return json({ success: false, error: "Email service rejected request" }, 502);
    }
    if (result.result?.permanent_bounces?.length || result.result?.suppressed_recipients?.length) {
      console.error("Cloudflare Email Sending recipient rejected");
      return json({ success: false, error: "Email recipient unavailable" }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Contact form failed", error.message);
    return json({ success: false, error: "Request failed" }, 500);
  }
}
