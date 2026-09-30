// Step 2: swap the GitHub code for a token and hand it back to the CMS window.
export default async (request) => {
  const clientId = process.env.GITHUB_OAUTH_ID;
  const clientSecret = process.env.GITHUB_OAUTH_SECRET;
  const code = new URL(request.url).searchParams.get("code");
  if (!clientId || !clientSecret) return new Response("OAuth env vars are not set", { status: 500 });
  if (!code) return new Response("Missing code", { status: 400 });
  let payload;
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code })
    });
    const data = await res.json();
    payload = data.access_token
      ? { token: data.access_token, provider: "github" }
      : { error: data.error_description || "No token returned" };
  } catch (err) { payload = { error: String(err) }; }
  const state = payload.error ? "error" : "success";
  const body = `<!DOCTYPE html><html><body><script>
    (function () {
      function send() {
        window.opener.postMessage(
          'authorization:github:${state}:' + JSON.stringify(${JSON.stringify(payload)}), '*');
      }
      window.addEventListener('message', send, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script><p>Signing you in, you can close this window.</p></body></html>`;
  return new Response(body, { headers: { "Content-Type": "text/html" } });
};
