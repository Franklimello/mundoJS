import type { Pool } from 'pg';
import { buscarLicao } from '@/conteudo';
import type { ContextoTutor, HistoricoTutor } from '@/tutor/tipos';

/** Resumo limitado a 30 dias, sempre da identidade validada pelo servidor. Sem código ou conversas. */
export async function historicoDoTutor(
  db: Pool,
  visitante: string,
  contexto: ContextoTutor,
): Promise<HistoricoTutor | null> {
  if (!('trilha' in contexto)) return null;
  const [atual, topicos] = await Promise.all([
    db.query<{ tentativas: number; sem_acerto: number; ajudas: number }>(
      `SELECT count(*) FILTER (WHERE tipo = 'exercicio_conferido')::int AS tentativas,
        count(*) FILTER (WHERE tipo = 'exercicio_conferido' AND passou = false)::int AS sem_acerto,
        count(*) FILTER (WHERE tipo = 'ajuda_recebida')::int AS ajudas
      FROM estudo_eventos WHERE visitante = $1 AND trilha = $2 AND licao = $3 AND indice = $4
        AND criado_em >= now() - interval '30 days'`,
      [visitante, contexto.trilha, contexto.licao, contexto.indice],
    ),
    db.query<{ trilha: string; licao: string }>(
      `WITH exercicios AS (
        SELECT trilha, licao, indice,
          max(criado_em) FILTER (WHERE passou = false) AS ultima_falha,
          max(criado_em) FILTER (WHERE passou = true) AS ultimo_acerto,
          count(*) FILTER (WHERE passou = false) AS falhas
        FROM estudo_eventos WHERE visitante = $1 AND tipo = 'exercicio_conferido'
          AND criado_em >= now() - interval '30 days'
        GROUP BY trilha, licao, indice
      ) SELECT trilha, licao FROM exercicios
        WHERE falhas >= 2 AND (ultimo_acerto IS NULL OR ultima_falha > ultimo_acerto)
        GROUP BY trilha, licao ORDER BY max(ultima_falha) DESC, trilha, licao LIMIT 3`,
      [visitante],
    ),
  ]);
  const resumo = atual.rows[0];
  return {
    tentativas: resumo?.tentativas ?? 0,
    semAcerto: resumo?.sem_acerto ?? 0,
    ajudas: resumo?.ajudas ?? 0,
    topicosParaRetomar: topicos.rows.flatMap((linha) => {
      const licao = buscarLicao(linha.trilha, linha.licao);
      return licao ? [`${licao.trilha.titulo}: ${licao.licao.titulo}`] : [];
    }),
  };
}
