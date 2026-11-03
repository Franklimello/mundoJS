import type { Pool } from 'pg';
import type { Progresso } from '@/progresso/tipos';
import type { PosicaoEstudo } from '@/estudo/tipos';

export async function carregarDados(db: Pool, visitante: string) {
  const [progresso, rascunhos, atividade] = await Promise.all([
    db.query<{ tipo: string; chave: string; concluido_em: Date }>(
      'SELECT tipo, chave, concluido_em FROM progresso WHERE visitante = $1',
      [visitante],
    ),
    db.query<{ chave: string; codigo: string }>('SELECT chave, codigo FROM rascunhos WHERE visitante = $1', [
      visitante,
    ]),
    db.query<PosicaoEstudo>(
      "SELECT trilha, licao, indice FROM estudo_eventos WHERE visitante = $1 AND tipo = 'exercicio_aberto' ORDER BY criado_em DESC LIMIT 1",
      [visitante],
    ),
  ]);
  const salvo: Progresso = { versao: 1, concluidas: {}, exerciciosConcluidos: {} };
  for (const linha of progresso.rows) {
    const mapa = linha.tipo === 'licao' ? salvo.concluidas : salvo.exerciciosConcluidos;
    mapa[linha.chave] = linha.concluido_em.toISOString();
  }
  return {
    progresso: salvo,
    rascunhos: Object.fromEntries(rascunhos.rows.map(({ chave, codigo }) => [chave, codigo])),
    ultimaAtividade: atividade.rows[0] ?? null,
  };
}

/** Inserções aditivas: duas abas não apagam exercícios umas das outras. */
export async function salvarProgresso(db: Pool, visitante: string, progresso: Progresso) {
  const entradas = [
    ...Object.entries(progresso.concluidas).map(([chave, data]) => ({ tipo: 'licao', chave, data })),
    ...Object.entries(progresso.exerciciosConcluidos).map(([chave, data]) => ({ tipo: 'exercicio', chave, data })),
  ];
  await db.query(
    `INSERT INTO progresso (visitante, tipo, chave, concluido_em)
     SELECT $1, tipo, chave, data::timestamptz
     FROM jsonb_to_recordset($2::jsonb) AS entrada(tipo text, chave text, data text)
     ON CONFLICT (visitante, tipo, chave) DO NOTHING`,
    [visitante, JSON.stringify(entradas)],
  );
}

export async function salvarRascunho(db: Pool, visitante: string, chave: string, codigo: string | null) {
  if (codigo === null) {
    await db.query('DELETE FROM rascunhos WHERE visitante = $1 AND chave = $2', [visitante, chave]);
  } else {
    await db.query(
      `INSERT INTO rascunhos (visitante, chave, codigo) VALUES ($1, $2, $3)
       ON CONFLICT (visitante, chave) DO UPDATE SET codigo = EXCLUDED.codigo, atualizado_em = now()`,
      [visitante, chave, codigo],
    );
  }
}
