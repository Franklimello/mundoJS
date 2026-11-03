import type { Pool } from 'pg';
import type { PosicaoEstudo } from '@/estudo/tipos';
import type { Progresso } from '@/progresso/tipos';
import { resumirAprendizado } from '@/estudo/painel';
import { lerAssinatura } from './cobranca';

export async function carregarPainelAprendizado(db: Pool, usuarioId: string) {
  const identidade = `conta:${usuarioId}`;
  const [progresso, ultima, certificados, dias, assinatura] = await Promise.all([
    db.query<{ chave: string; concluido_em: Date }>(
      "SELECT chave, concluido_em FROM progresso WHERE visitante=$1 AND tipo='exercicio'",
      [identidade],
    ),
    db.query<PosicaoEstudo>(
      "SELECT trilha, licao, indice FROM estudo_eventos WHERE visitante=$1 AND tipo='exercicio_aberto' ORDER BY criado_em DESC, id DESC LIMIT 1",
      [identidade],
    ),
    db.query<{ trilha: string; id: string }>('SELECT trilha, id FROM conta_certificados WHERE usuario_id=$1', [
      usuarioId,
    ]),
    db.query<{ dia: string; ativo: boolean }>(
      `SELECT to_char(dia, 'YYYY-MM-DD') AS dia, EXISTS (
        SELECT 1 FROM estudo_eventos e WHERE e.visitante=$1
          AND e.tipo IN ('codigo_rodado', 'exercicio_conferido')
          AND e.criado_em >= dia AT TIME ZONE 'America/Sao_Paulo'
          AND e.criado_em < (dia + interval '1 day') AT TIME ZONE 'America/Sao_Paulo'
      ) AS ativo FROM generate_series(
        ((now() AT TIME ZONE 'America/Sao_Paulo')::date - 6)::timestamp,
        ((now() AT TIME ZONE 'America/Sao_Paulo')::date)::timestamp, interval '1 day'
      ) AS dias(dia) ORDER BY dia`,
      [identidade],
    ),
    lerAssinatura(db, usuarioId),
  ]);
  const salvo: Progresso = { versao: 1, concluidas: {}, exerciciosConcluidos: {} };
  for (const linha of progresso.rows) salvo.exerciciosConcluidos[linha.chave] = linha.concluido_em.toISOString();
  return {
    ...resumirAprendizado(salvo, ultima.rows[0] ?? null, assinatura.pro, certificados.rows),
    dias: dias.rows,
  };
}
