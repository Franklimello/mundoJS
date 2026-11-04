WITH primeiras_entradas AS (
  SELECT DISTINCT ON (visitante) visitante, criado_em AS entrada, canal
  FROM estudo_eventos
  WHERE tipo = 'visita' AND pagina IS NOT NULL
    AND criado_em >= $2::timestamptz - interval '90 days'
    AND criado_em <= $2::timestamptz
  ORDER BY visitante, criado_em, id
), coorte AS (
  SELECT * FROM primeiras_entradas
  WHERE entrada >= $2::timestamptz - $1 * interval '1 day'
), passos AS (
  SELECT c.visitante, c.canal, inicio.iniciou, acerto.concluiu,
    acerto.concluiu <= $2::timestamptz - interval '7 days' AS periodo_completo,
    EXISTS (
      SELECT 1 FROM estudo_eventos e
      WHERE e.visitante = c.visitante AND e.tipo IN ('codigo_rodado', 'exercicio_conferido')
        AND e.criado_em > acerto.concluiu
        AND e.criado_em <= acerto.concluiu + interval '7 days'
        AND e.criado_em <= $2::timestamptz
        AND (e.criado_em AT TIME ZONE 'America/Sao_Paulo')::date >
            (acerto.concluiu AT TIME ZONE 'America/Sao_Paulo')::date
    ) AS retornou
  FROM coorte c
  LEFT JOIN LATERAL (
    SELECT min(e.criado_em) AS iniciou FROM estudo_eventos e
    WHERE e.visitante = c.visitante AND e.tipo = 'exercicio_aberto'
      AND e.trilha = 'javascript-do-zero' AND e.licao = 'ola-mundo' AND e.indice = 0
      AND e.criado_em >= c.entrada AND e.criado_em <= $2::timestamptz
  ) inicio ON true
  LEFT JOIN LATERAL (
    SELECT min(e.criado_em) AS concluiu FROM estudo_eventos e
    WHERE e.visitante = c.visitante AND e.tipo = 'exercicio_conferido' AND e.passou
      AND e.trilha = 'javascript-do-zero' AND e.licao = 'ola-mundo' AND e.indice = 0
      AND e.criado_em >= inicio.iniciou AND e.criado_em <= $2::timestamptz
  ) acerto ON true
)
SELECT coalesce(canal, 'TOTAL') AS origem,
  count(*) AS entradas,
  count(iniciou) AS iniciaram,
  count(concluiu) AS concluiram,
  round(100.0 * count(iniciou) / nullif(count(*), 0), 1) AS entrada_para_inicio_pct,
  round(100.0 * count(concluiu) / nullif(count(iniciou), 0), 1) AS inicio_para_conclusao_pct,
  count(*) FILTER (WHERE periodo_completo) AS concluintes_com_7_dias,
  count(*) FILTER (WHERE periodo_completo AND retornou) AS voltaram_ate_7_dias,
  round(100.0 * count(*) FILTER (WHERE periodo_completo AND retornou) /
    nullif(count(*) FILTER (WHERE periodo_completo), 0), 1) AS retorno_7_dias_pct
FROM passos
GROUP BY GROUPING SETS ((canal), ())
ORDER BY GROUPING(canal) DESC, canal;
