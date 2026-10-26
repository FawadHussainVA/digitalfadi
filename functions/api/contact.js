import { connect } from "cloudflare:sockets";

/* Send one plain-text email through an SMTP server over implicit TLS (port 465).
   Used to deliver leads straight into the Hostinger mailbox. */
export async function smtpSend(o, connectFn = connect) {
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (str) => { const bytes = enc.encode(str); let bin = ""; for (const b of bytes) bin += String.fromCharCode(b); return btoa(bin); };
  const socket = connectFn({ hostname: o.host, port: o.port }, { secureTransport: "on", allowHalfOpen: false });
  const writer = socket.writable.getWriter();
  const reader = socket.readable.getReader();
  let buf = "";
  async function reply() {
    for (;;) {
      const lines = buf.split("\r\n");
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i])) {
          const out = { code: Number(lines[i].slice(0, 3)), text: lines.slice(0, i + 1).join(" | ") };
          buf = lines.slice(i + 1).join("\r\n");
          return out;
        }
      }
      const { value, done } = await reader.read();
      if (done) throw new Error("SMTP connection closed");
      buf += dec.decode(value, { stream: true });
    }
  }
  async function step(line, ok) {
    if (line !== null) await writer.write(enc.encode(line + "\r\n"));
    const r = await reply();
    if (!ok.includes(r.code)) throw new Error("SMTP " + r.code + ": " + r.text.slice(0, 200));
    return r;
  }
  const run = (async () => {
    await step(null, [220]);
    await step("EHLO digitalfadi.com", [250]);
    await step("AUTH LOGIN", [334]);
    await step(b64(o.user), [334]);
    await step(b64(o.pass), [235]);
    await step("MAIL FROM:<" + o.from + ">", [250]);
    await step("RCPT TO:<" + o.to + ">", [250, 251]);
    await step("DATA", [354]);
    const body = b64(o.text).replace(/.{1,76}/g, "$&\r\n");
    const msg = [
      "From: DigitalFadi website <" + o.from + ">",
      "To: <" + o.to + ">",
      "Reply-To: <" + o.replyTo + ">",
      "Subject: =?UTF-8?B?" + b64(o.subject) + "?=",
      "Date: " + new Date().toUTCString().replace("GMT", "+0000"),
      "Message-ID: <" + crypto.randomUUID() + "@digitalfadi.com>",
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      body
    ].join("\r\n");
    await writer.write(enc.encode(msg + "\r\n.\r\n"));
    await step(null, [250]);
    try { await step("QUIT", [221]); } catch (e) {}
  })();
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("SMTP timeout")), 10000));
  try { await Promise.race([run, timeout]); }
  finally { try { socket.close(); } catch (e) {} }
  return true;
}


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
      verificationResult.hostname !== "digitalfadi.com"
    ) {
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

    const endpoint =
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`;

    if (!env.CLOUDFLARE_ACCOUNT_ID ||
        !env.CLOUDFLARE_EMAIL_TOKEN) {
      return json({ success: false, error: "Not configured" }, 503);
    }

    // Leads go only to the Hostinger mailbox: first through Hostinger's own
    // SMTP server (needs the HOSTINGER_SMTP_PASS secret), then through
    // Cloudflare Email Sending to the same address. Reply goes to the visitor.
    const LEAD_TO = "fawad@digitalfadi.com";

    const body = [
      `New enquiry: ${subject}`,
      "",
      ...lines
    ].join("\n");

    async function send(to, subjectLine) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "fawad@digitalfadi.com",
            to: [to],
            reply_to: email,
            subject: subjectLine,
            text: body
          })
        });
        const out = await res.json().catch(() => ({}));
        if (!res.ok || out.success !== true) {
          console.error("Email API refused", to, res.status, JSON.stringify(out.errors || []));
          return false;
        }
        // "success" only means Cloudflare accepted the request. The result
        // says whether the address was delivered, queued or bounced.
        const r = out.result || {};
        const has = (list) => Array.isArray(list) &&
          list.some((x) => String(x && x.address ? x.address : x).toLowerCase() === to);
        if (has(r.permanent_bounces)) {
          console.error("Email bounced", to, JSON.stringify(r.permanent_bounces));
          return false;
        }
        if (Array.isArray(r.delivered) || Array.isArray(r.queued)) {
          return has(r.delivered) || has(r.queued);
        }
        return true;
      } catch (e) {
        console.error("Email request failed", to, e.message);
        return false;
      }
    }

    let delivered = false;
    if (env.HOSTINGER_SMTP_PASS) {
      try {
        delivered = await smtpSend({
          host: "smtp.hostinger.com", port: 465,
          user: LEAD_TO, pass: env.HOSTINGER_SMTP_PASS,
          from: LEAD_TO, to: LEAD_TO, replyTo: email,
          subject, text: body
        });
      } catch (e) {
        console.error("Hostinger SMTP failed", e.message);
      }
    }
    if (!delivered) delivered = await send(LEAD_TO, subject);

    if (!delivered) {
      console.error("Lead email could not be delivered to " + LEAD_TO);
      return json({ success: false, error: "Email failed" }, 502);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Contact form failed", error.message);
    return json({ success: false, error: "Request failed" }, 500);
  }
}
