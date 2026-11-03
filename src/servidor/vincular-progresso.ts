import type { Pool } from 'pg';

/** A origem vem do cookie; o destino vem da sessão autenticada, nunca do corpo da requisição. */
export async function vincularProgresso(db: Pool, visitante: string, usuarioId: string): Promise<boolean> {
  const destino = `conta:${usuarioId}`;
  const cliente = await db.connect();
  try {
    await cliente.query('BEGIN');
    await cliente.query('SELECT pg_advisory_xact_lock(hashtext($1))', [visitante]);
    const anterior = await cliente.query<{ usuario_id: string }>(
      'SELECT usuario_id FROM conta_importacoes WHERE visitante = $1',
      [visitante],
    );
    if (anterior.rows[0] && anterior.rows[0].usuario_id !== usuarioId) {
      await cliente.query('ROLLBACK');
      return false;
    }
    const existe = await cliente.query<{ existe: boolean }>(
      `SELECT EXISTS(
      SELECT 1 FROM progresso WHERE visitante = $1 UNION ALL
      SELECT 1 FROM rascunhos WHERE visitante = $1 UNION ALL
      SELECT 1 FROM estudo_eventos WHERE visitante = $1 UNION ALL
      SELECT 1 FROM tutor_uso WHERE escopo = $2
    ) AS existe`,
      [visitante, `visitante:${visitante}`],
    );
    if (!existe.rows[0]?.existe) {
      await cliente.query('COMMIT');
      return false;
    }
    await cliente.query(
      `INSERT INTO conta_importacoes (visitante, usuario_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [visitante, usuarioId],
    );
    await cliente.query(
      `INSERT INTO progresso (visitante, tipo, chave, concluido_em)
      SELECT $2, tipo, chave, concluido_em FROM progresso WHERE visitante = $1
      ON CONFLICT (visitante, tipo, chave) DO UPDATE SET concluido_em = LEAST(progresso.concluido_em, EXCLUDED.concluido_em)`,
      [visitante, destino],
    );
    // Preserva a versão anterior de rascunhos diferentes antes de escolher a mais recente.
    await cliente.query(
      `INSERT INTO conta_rascunhos_arquivados (usuario_id, chave, codigo, original_em)
      SELECT $3, origem.chave,
        CASE WHEN origem.atualizado_em > conta.atualizado_em THEN conta.codigo ELSE origem.codigo END,
        LEAST(origem.atualizado_em, conta.atualizado_em)
      FROM rascunhos origem JOIN rascunhos conta ON conta.visitante = $2 AND conta.chave = origem.chave
      WHERE origem.visitante = $1 AND origem.codigo <> conta.codigo`,
      [visitante, destino, usuarioId],
    );
    await cliente.query(
      `INSERT INTO rascunhos (visitante, chave, codigo, atualizado_em)
      SELECT $2, chave, codigo, atualizado_em FROM rascunhos WHERE visitante = $1
      ON CONFLICT (visitante, chave) DO UPDATE SET codigo = EXCLUDED.codigo, atualizado_em = EXCLUDED.atualizado_em
      WHERE EXCLUDED.atualizado_em > rascunhos.atualizado_em`,
      [visitante, destino],
    );
    await cliente.query('UPDATE estudo_eventos SET visitante = $2 WHERE visitante = $1', [visitante, destino]);
    await cliente.query(
      `INSERT INTO tutor_uso (escopo, periodo, quantidade)
      SELECT $2, periodo, quantidade FROM tutor_uso WHERE escopo = $1
      ON CONFLICT (escopo, periodo) DO UPDATE SET quantidade = tutor_uso.quantidade + EXCLUDED.quantidade`,
      [`visitante:${visitante}`, `visitante:${destino}`],
    );
    await cliente.query('DELETE FROM tutor_uso WHERE escopo = $1', [`visitante:${visitante}`]);
    await cliente.query('DELETE FROM progresso WHERE visitante = $1', [visitante]);
    await cliente.query('DELETE FROM rascunhos WHERE visitante = $1', [visitante]);
    await cliente.query('COMMIT');
    return true;
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}
