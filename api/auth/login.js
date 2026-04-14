export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método não permitido' });
  }

  const { email, senha } = req.body;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
      'apikey': process.env.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: email, 
        password: senha 
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ ok: true, redirect: 'dashboard2f.html' });
    } else {
      return res.status(401).json({ ok: false, message: data.message || 'Erro no login' });
    }
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
}
