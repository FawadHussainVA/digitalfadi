import { connect } from "cloudflare:sockets";

/* SMTP connection implementation for Cloudflare Pages Functions.
 * Secure Hostinger submission, no third-party service.
 * Avoid eager cancellation of the stream during STARTTLS and report the stage.
 */
export async function smtpSend(o, connectFn = connect) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const b64 = value => {
    const bytes = encoder.encode(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  let socket, reader, writer, pending = "", stage = "connect";
  const release = () => {
    try { reader?.releaseLock(); } catch (_) {}
    try { writer?.releaseLock(); } catch (_) {}
    reader = undefined; writer = undefined;
  };
  const attach = s => { socket = s; reader = s.readable.getReader(); writer = s.writable.getWriter(); };
  async function response() {
    while (true) {
      const lines = pending.split("\r\n");
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i])) {
          const result = { code: Number(lines[i].slice(0, 3)), text: lines.slice(0, i + 1).join(" | ") };
          pending = lines.slice(i + 1).join("\r\n");
          return result;
        }
      }
      const chunk = await reader.read();
      if (chunk.done) throw new Error("SMTP server closed connection");
      pending += decoder.decode(chunk.value, { stream: true });
      if (pending.length > 65536) throw new Error("SMTP response exceeded limit");
    }
  }
  async function command(label, line, expected) {
    stage = label;
    if (line !== null) await writer.write(encoder.encode(line + "\r\n"));
    const reply = await response();
    if (!expected.includes(reply.code)) throw new Error(`SMTP ${reply.code}: ${reply.text.slice(0, 160)}`);
    return reply;
  }
  const task = async () => {
    attach(connectFn({ hostname: o.host, port: o.port }, {
      secureTransport: o.port === 465 ? "on" : "starttls"
    }));
    // Let the runtime complete the socket connection before first read.
    stage = "socket open";
    await socket.opened;
    await command("greeting", null, [220]);
    await command("EHLO", "EHLO digitalfadi.com", [250]);
    if (o.port === 587) {
      await command("STARTTLS command", "STARTTLS", [220]);
      // Cloudflare requires releasing locks before startTls().
      release();
      stage = "STARTTLS handshake";
      const upgraded = socket.startTls();
      attach(upgraded);
      await socket.opened;
      pending = "";
      await command("secure EHLO", "EHLO digitalfadi.com", [250]);
    }
    await command("AUTH LOGIN", "AUTH LOGIN", [334]);
    await command("AUTH user", b64(o.user), [334]);
    await command("AUTH password", b64(o.pass), [235]);
    await command("MAIL FROM", `MAIL FROM:<${o.from}>`, [250]);
    await command("RCPT TO", `RCPT TO:<${o.to}>`, [250, 251]);
    await command("DATA", "DATA", [354]);
    stage = "message body";
    const textBody = b64(o.text).match(/.{1,76}/g)?.join("\r\n") || "";
    const header = [
      `From: DigitalFadi website <${o.from}>`,
      `To: <${o.to}>`,
      `Reply-To: <${o.replyTo}>`,
      `Subject: =?UTF-8?B?${b64(o.subject)}?=`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${crypto.randomUUID()}@digitalfadi.com>`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64", "", textBody
    ].join("\r\n");
    await writer.write(encoder.encode(header + "\r\n.\r\n"));
    await command("message accepted", null, [250]);
    // Sending is complete once SMTP server acknowledges DATA with 250.
    try { await command("QUIT", "QUIT", [221]); } catch (_) {}
  };
  let timer;
  try {
    await Promise.race([
      task(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("SMTP timeout")), 12000); })
    ]);
    return true;
  } catch (error) {
    throw new Error(`${o.port}/${stage}: ${error?.message || String(error)}`);
  } finally {
    clearTimeout(timer);
    release();
    try { socket?.close(); } catch (_) {}
  }
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

    if (Number(request.headers.get("content-length") || 0) > 12000) {
      return json({ success: false, error: "Payload too large" }, 413);
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

    // The currently deployed contact form does not include a Turnstile widget.
    // Honeypot remains in place. Add proper server-side anti-spam controls
    // before exposing a high-volume production endpoint.

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

    const LEAD_TO = "fawad@digitalfadi.com";
    if (!env.HOSTINGER_SMTP_PASS) {
      console.error("Hostinger SMTP secret missing");
      return json({ success: false, error: "SMTP not configured" }, 503);
    }

    const body = [
      `New enquiry: ${subject}`,
      "",
      ...lines
    ].join("\n");

    // Try implicit TLS first, then STARTTLS. Both are Hostinger SMTP.
    let sent = false;
    for (const port of [465, 587]) {
      try {
        await smtpSend({
          host: "smtp.hostinger.com", port,
          user: LEAD_TO, pass: env.HOSTINGER_SMTP_PASS,
          from: LEAD_TO, to: LEAD_TO, replyTo: email,
          subject, text: body
        });
        sent = true;
        break;
      } catch (e) {
        console.error("Hostinger SMTP failed", e?.message || String(e));
        // Authentication rejection will not be fixed by a different port.
        if (/SMTP (535|534|530):/.test(String(e?.message))) break;
      }
    }
    if (!sent) return json({ success: false, error: "SMTP delivery failed" }, 502);

    return json({ success: true });
  } catch (error) {
    console.error("Contact form failed", error.message);
    return json({ success: false, error: "Request failed" }, 500);
  }
}
