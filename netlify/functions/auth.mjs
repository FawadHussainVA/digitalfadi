// Step 1 of the CMS login: send the editor to GitHub to authorise.
export default async (request) => {
  const clientId = process.env.GITHUB_OAUTH_ID;
  if (!clientId) return new Response("GITHUB_OAUTH_ID is not set", { status: 500 });
  const site = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${site}/api/callback`,
    scope: "repo,user"
  });
  return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
};
