# Finish setting up DigitalFadi's free form emails

The website forms now POST to /api/contact, which validates Turnstile and invokes a private Cloudflare Worker named `digitalfadi-contact-mailer`. It sends only to the verified Email Routing destination `zaheer.geoz@gmail.com`, using sender `fawad@digitalfadi.com`.

**The GitHub code is not enough by itself. Complete these Cloudflare dashboard steps.**

1. Confirm **Email Routing** is active for `digitalfadi.com` and destination `zaheer.geoz@gmail.com` is **Verified**. Do not change the MX records again.
2. In **Workers & Pages**, create a new Worker named **digitalfadi-contact-mailer**. Deploy the JavaScript from `cloudflare/contact-mailer/src/index.js` (or use Wrangler from `cloudflare/contact-mailer/`). The Worker has no public URL when deployed with `workers_dev = false`; it should be accessed through the Pages service binding only.
3. Attach a **Send Email** binding to that Worker with name **EMAIL** and the verified destination `zaheer.geoz@gmail.com`. Wrangler users can deploy with the provided `wrangler.toml`, which already defines the binding. This is the verified-destination sending route described by Cloudflare, not paid arbitrary-recipient Email Sending.
4. Go to **Workers & Pages > digitalfadi > Settings > Bindings**. Add a **Service** binding: **Variable name CONTACT_MAILER**, **Service digitalfadi-contact-mailer**. Save for **Production**.
5. Redeploy `digitalfadi` so Pages gets the new binding. Check deployment Functions bindings if possible.
6. Send exactly one fresh submission. Check the Gmail inbox and spam. If it fails, see the Pages Function logs for `CONTACT_MAILER Worker service binding missing` or `Private contact mailer rejected`; and the mailer Worker's own logs for `Cloudflare verified-destination email failed`.

**Important:** A verified destination being free does not mean the account is automatically authorized to send. If Cloudflare reports `email.sending_disabled` for the send_email binding as well, Cloudflare account-side access is still needed. Do not switch plans or change DNS without reviewing the requirement.

The form's current homepage and styles are unchanged. The old Cloudflare REST token and Hostinger SMTP password are not used by this path.
