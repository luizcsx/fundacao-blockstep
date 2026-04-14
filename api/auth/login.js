export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, senha } = req.body;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password: senha })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.error_description || data.msg || 'Erro ao logar' });
    }

    return res.status(200).json({ success: true, session: data });

  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor: ' + error.message });
  }
}
