import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      return res.status(400).json({ ok: false, message: 'E-mail ou senha incorretos.' });
    }

    return res.status(200).json({ 
      ok: true, 
      session: data.session, 
      user: data.user,
      redirect: '/dashboard.html' 
    });

  } catch (err) {
    return res.status(500).json({ ok: false, message: 'Erro interno no servidor.' });
  }
}
