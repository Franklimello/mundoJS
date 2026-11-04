import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import pg from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('entrada e retorno no Postgres real', () => {
  const db = new pg.Client({ connectionString: url });
  const agora = '2026-11-30T15:00:00Z';
  let consulta: string;
  async function evento(
    visitante: string,
    tipo: string,
    criado: string,
    canal?: string,
    passou?: boolean,
    primeiro = true,
  ) {
    await db.query(
      `INSERT INTO estudo_eventos (id, visitante, tipo, criado_em, pagina, canal, trilha, licao, indice, passou)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        randomUUID(),
        visitante,
        tipo,
        criado,
        canal ? 'comecar' : null,
        canal ?? null,
        tipo === 'visita' ? null : 'javascript-do-zero',
        tipo === 'visita' ? null : primeiro ? 'ola-mundo' : 'variaveis',
        tipo === 'visita' ? null : 0,
        passou ?? null,
      ],
    );
  }
  async function jornada(nome: string, dia: string, canal: string, concluiu = true) {
    await evento(nome, 'visita', `${dia}T12:00:00Z`, canal);
    await evento(nome, 'exercicio_aberto', `${dia}T12:01:00Z`);
    await evento(nome, 'exercicio_conferido', `${dia}T12:02:00Z`, undefined, concluiu);
  }
  beforeAll(async () => {
    await db.connect();
    consulta = await readFile('scripts/metricas-entrada.sql', 'utf8');
    await db.query(`CREATE TEMP TABLE estudo_eventos (
      id uuid PRIMARY KEY, visitante text, tipo text, criado_em timestamptz,
      pagina text, canal text, trilha text, licao text, indice integer, passou boolean
    )`);
    await jornada('a', '2026-11-10', 'youtube');
    await evento('a', 'codigo_rodado', '2026-11-11T12:00:00Z');
    await evento('a', 'visita', '2026-11-20T12:00:00Z', 'instagram');
    await jornada('b', '2026-11-12', 'youtube', false);
    await evento('c', 'visita', '2026-11-13T12:00:00Z', 'instagram');
    await evento('c', 'exercicio_conferido', '2026-11-13T12:02:00Z', undefined, true);
    await evento('c', 'exercicio_aberto', '2026-12-01T12:00:00Z');
    await jornada('d', '2026-11-29', 'google');
    await evento('d', 'codigo_rodado', '2026-11-30T12:00:00Z');
    await evento('e', 'visita', '2026-11-08T23:00:00Z', 'whatsapp');
    await evento('e', 'exercicio_aberto', '2026-11-08T23:15:00Z');
    await evento('e', 'exercicio_conferido', '2026-11-08T23:30:00Z', undefined, true);
    await evento('e', 'codigo_rodado', '2026-11-09T01:00:00Z');
    await jornada('f', '2026-11-10', 'tiktok');
    await evento('f', 'codigo_rodado', '2026-11-19T12:00:00Z');
    await evento('g', 'visita', '2026-10-01T12:00:00Z', 'outro');
    await evento('g', 'visita', '2026-11-20T12:00:00Z', 'youtube');
    await evento('legado', 'visita', '2026-11-20T12:00:00Z');
    await evento('i', 'exercicio_conferido', '2026-11-16T12:00:00Z', undefined, true);
    await evento('i', 'visita', '2026-11-17T12:00:00Z', 'direto');
    await evento('i', 'exercicio_aberto', '2026-11-17T12:01:00Z', undefined, undefined, false);
    await evento('i', 'exercicio_conferido', '2026-11-17T12:02:00Z', undefined, true);
    await evento('i', 'exercicio_aberto', '2026-11-18T12:00:00Z');
    await evento('futuro', 'visita', '2026-12-01T12:00:00Z', 'youtube');
  });
  afterAll(async () => {
    await db.end();
  });
  it('conta trajetos em ordem, preserva a primeira origem e considera a janela completa de retorno', async () => {
    const dados = await db.query(consulta, [30, agora]);
    expect(dados.rows.find((linha) => linha.origem === 'TOTAL')).toMatchObject({
      entradas: '7',
      iniciaram: '6',
      concluiram: '4',
      entrada_para_inicio_pct: '85.7',
      inicio_para_conclusao_pct: '66.7',
      concluintes_com_7_dias: '3',
      voltaram_ate_7_dias: '1',
      retorno_7_dias_pct: '33.3',
    });
    expect(dados.rows.find((linha) => linha.origem === 'youtube')).toMatchObject({
      entradas: '2',
      concluiram: '1',
      retorno_7_dias_pct: '100.0',
    });
    expect(dados.rows.find((linha) => linha.origem === 'google')).toMatchObject({
      concluiram: '1',
      concluintes_com_7_dias: '0',
      retorno_7_dias_pct: null,
    });
    expect(dados.rows.find((linha) => linha.origem === 'whatsapp')).toMatchObject({ voltaram_ate_7_dias: '0' });
    expect(dados.rows.find((linha) => linha.origem === 'tiktok')).toMatchObject({ voltaram_ate_7_dias: '0' });
  });
  it('não transforma visitas recorrentes em novas entradas nem divide por zero', async () => {
    const dados = await db.query(consulta, [1, agora]);
    expect(dados.rows).toEqual([
      {
        origem: 'TOTAL',
        entradas: '0',
        iniciaram: '0',
        concluiram: '0',
        entrada_para_inicio_pct: null,
        inicio_para_conclusao_pct: null,
        concluintes_com_7_dias: '0',
        voltaram_ate_7_dias: '0',
        retorno_7_dias_pct: null,
      },
    ]);
  });
});
