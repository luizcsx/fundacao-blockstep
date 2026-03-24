import { createPool } from '@vercel/postgres';

export default async function handler(request, response) {
  const pool = createPool();

  try {
    const { rows } = await pool.sql`
      SELECT nome, email, perfil, genero, data_cadastro 
      FROM usuarios 
      ORDER BY data_cadastro DESC;
    `;

    return response.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Erro ao buscar usuários no banco.' });
  }
}
