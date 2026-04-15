import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).end();

  const { email, senha } = req.body;

  const { data: user } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (!user || !user.senha_hash)
    return res.status(401).json({ ok: false, message: 'Credenciais inválidas.' });

  const ok = await bcrypt.compare(senha, user.senha_hash);
  if (!ok)
    return res.status(401).json({ ok: false, message: 'Credenciais inválidas.' });

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.setHeader('Set-Cookie', `cei_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
  return res.status(200).json({ ok: true, redirect: '/dashboard.html' });
}
