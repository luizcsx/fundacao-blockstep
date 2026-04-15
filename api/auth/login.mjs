import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY || !process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Erro de configuração no servidor (Variáveis ausentes)." });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    if (req.method !== 'POST') return res.status(405).end();

    const { email, senha } = req.body;

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ ok: false, message: 'Usuário não encontrado.' });
    if (!user.senha_hash) return res.status(401).json({ ok: false, message: 'Use login via Google.' });

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ ok: false, message: 'Senha incorreta.' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.setHeader('Set-Cookie', `cei_token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
    return res.status(200).json({ 
        ok: true, 
        redirect: '/dashboard.html', 
        usuario: { nome: user.nome, username: user.username, escola: user.escola } 
    });

  } catch (err) {
    // 2. Isso vai mostrar o erro real nos Logs da Vercel
    console.error("ERRO CRÍTICO NO LOGIN:", err);
    return res.status(500).json({ message: "Erro interno: " + err.message });
  }
}
