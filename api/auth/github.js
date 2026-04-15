export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/api/auth/github/callback`,
    scope: 'user:email'
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
