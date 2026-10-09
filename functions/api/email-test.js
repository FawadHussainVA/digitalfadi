
export async function onRequestPost({ request, env }) {
  const suppliedKey = request.headers.get("X-Test-Key");

  if (!env.EMAIL_TEST_KEY || suppliedKey !== env.EMAIL_TEST_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!env.CLOUDFLARE_EMAIL_TOKEN || !env.CLOUDFLARE_ACCOUNT_ID) {
    return new Response("Email configuration missing", { status: 500 });
  }

  const endpoint =
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.CLOUDFLARE_EMAIL_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "fawad@digitalfadi.com",
      to: ["zaheer.geoz@gmail.com"],
      subject: "DigitalFadi Cloudflare Email Test",
      text: "This is a test email from Cloudflare Pages."
    })
  });

  const result = await response.json();

  return Response.json({
    success: response.ok && result.success === true,
    status: response.status,
    queued: result.result?.queued ?? [],
    delivered: result.result?.delivered ?? [],
    errors: result.errors ?? []
  }, {
    status: response.ok ? 200 : 502
  });
}
