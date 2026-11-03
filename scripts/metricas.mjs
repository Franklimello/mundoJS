import nextEnv from '@next/env';
import pg from 'pg';

nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL em .env.local.');
const dias = Number(process.argv[2] || 30);
if (!Number.isInteger(dias) || dias < 1 || dias > 90) throw new Error('Escolha um período entre 1 e 90 dias.');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  const resumo = await client.query(
    `
    WITH periodo AS (SELECT * FROM estudo_eventos WHERE criado_em >= now() - $1 * interval '1 day'),
    visitantes AS (SELECT visitante, count(DISTINCT (criado_em AT TIME ZONE 'UTC')::date) AS dias FROM periodo GROUP BY visitante)
    SELECT
      (SELECT count(*) FROM visitantes) AS visitantes,
      (SELECT count(*) FROM visitantes WHERE dias > 1) AS voltaram_em_outro_dia,
      count(DISTINCT visitante) FILTER (WHERE tipo = 'exercicio_aberto') AS iniciaram_exercicio,
      count(DISTINCT visitante) FILTER (WHERE tipo = 'exercicio_conferido' AND passou) AS acertaram_exercicio,
      count(DISTINCT visitante) FILTER (WHERE tipo = 'exercicio_conferido' AND passou AND trilha = 'javascript-do-zero' AND licao = 'ola-mundo' AND indice = 0) AS acertaram_primeiro_exercicio,
      count(*) FILTER (WHERE tipo = 'ajuda_pedida') AS pedidos_ao_tutor,
      count(*) FILTER (WHERE tipo = 'ajuda_recebida') AS respostas_do_tutor
    FROM periodo`,
    [dias],
  );
  const exercicios = await client.query(
    `
    WITH periodo AS (SELECT * FROM estudo_eventos WHERE criado_em >= now() - $1 * interval '1 day' AND licao IS NOT NULL),
    por_aluno AS (
      SELECT trilha, licao, indice, visitante,
        bool_or(tipo = 'exercicio_aberto') AS abriu,
        count(*) FILTER (WHERE tipo = 'exercicio_conferido') AS tentativas,
        count(*) FILTER (WHERE tipo = 'exercicio_conferido' AND passou) AS acertos,
        count(*) FILTER (WHERE tipo = 'ajuda_pedida') AS ajudas
      FROM periodo GROUP BY trilha, licao, indice, visitante
    )
    SELECT trilha, licao, indice + 1 AS exercicio,
      count(*) FILTER (WHERE abriu) AS abriram,
      sum(tentativas) AS tentativas,
      count(*) FILTER (WHERE acertos > 0) AS alunos_com_acerto,
      count(*) FILTER (WHERE abriu AND acertos = 0) AS sem_acerto_no_periodo,
      sum(ajudas) AS pedidos_ao_tutor
    FROM por_aluno GROUP BY trilha, licao, indice
    ORDER BY count(*) FILTER (WHERE abriu AND acertos = 0) DESC, sum(tentativas) DESC
    LIMIT 20`,
    [dias],
  );
  console.log(`MundoJS — últimos ${dias} dias (datas em UTC)`);
  console.table(resumo.rows);
  console.log('Exercícios para investigar: ausência de acerto no período não prova abandono.');
  console.table(exercicios.rows);
  console.log('Eventos do navegador são sinais de uso, não prova de domínio. Não incluem código nem conversas.');
} finally {
  await client.end();
}
