export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
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
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ 
        email: email, 
        password: senha
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ ok: true, redirect: 'dashboard.html' });
    } else {
      return res.status(400).json({ message: data.message || 'Erro nos dados enviados.' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
