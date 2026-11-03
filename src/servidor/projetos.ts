import { randomBytes } from 'node:crypto';
import type { Pool } from 'pg';

export async function publicacaoDoProjeto(db: Pool, usuario: string, trilha: string) {
  const resultado = await db.query<{ id: string; atualizado_em: Date }>(
    'SELECT id, atualizado_em FROM projetos_compartilhados WHERE usuario_id = $1 AND trilha = $2',
    [usuario, trilha],
  );
  const linha = resultado.rows[0];
  return linha ? { id: linha.id, atualizadoEm: linha.atualizado_em.toISOString() } : null;
}
export async function publicarProjeto(db: Pool, usuario: string, trilha: string, codigo: string) {
  const resultado = await db.query<{ id: string; atualizado_em: Date }>(
    `INSERT INTO projetos_compartilhados (id, usuario_id, trilha, codigo)
    VALUES ($1,$2,$3,$4) ON CONFLICT (usuario_id, trilha) DO UPDATE SET codigo = EXCLUDED.codigo, atualizado_em = now()
    RETURNING id, atualizado_em`,
    [randomBytes(24).toString('hex'), usuario, trilha, codigo],
  );
  return { id: resultado.rows[0]!.id, atualizadoEm: resultado.rows[0]!.atualizado_em.toISOString() };
}
export async function retirarProjeto(db: Pool, usuario: string, trilha: string) {
  await db.query('DELETE FROM projetos_compartilhados WHERE usuario_id = $1 AND trilha = $2', [usuario, trilha]);
}
export async function lerProjetoCompartilhado(db: Pool, id: string) {
  if (!/^[a-f0-9]{48}$/.test(id)) return null;
  const resultado = await db.query<{ trilha: string; codigo: string; atualizado_em: Date }>(
    'SELECT trilha, codigo, atualizado_em FROM projetos_compartilhados WHERE id = $1',
    [id],
  );
  const linha = resultado.rows[0];
  return linha ? { trilha: linha.trilha, codigo: linha.codigo, atualizadoEm: linha.atualizado_em.toISOString() } : null;
}
