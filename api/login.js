// api/auth/login.js
// Vercel Serverless Function
// Rota: POST /api/auth/login

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Método não permitido.' });
  }

  const { email, senha } = req.body;

  // Validação básica
  if (!email || !senha) {
    return res.status(400).json({ ok: false, message: 'E-mail e senha são obrigatórios.' });
  }

  // Busca o usuário pelo e-mail
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('nome, username, email, senha_hash, escola')
    .eq('email', email.toLowerCase().trim())
    .single();

  // Usuário não encontrado ou erro no banco
  if (error || !usuario) {
    return res.status(401).json({ ok: false, message: 'E-mail ou senha incorretos.' });
  }

  // Verifica a senha com bcrypt
  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

  if (!senhaCorreta) {
    return res.status(401).json({ ok: false, message: 'E-mail ou senha incorretos.' });
  }

  // ─────────────────────────────────────────────────────────────
  // Login bem-sucedido.
  // Retorna os dados que o front-end salvará no LocalStorage.
  // Nunca retorne senha_hash para o cliente.
  // ─────────────────────────────────────────────────────────────
  return res.status(200).json({
    ok: true,
    usuario: {
      nome:     usuario.nome,
      username: usuario.username,
      escola:   usuario.escola ?? 'Não informada',
    }
  });
}
