import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { carregarDados, salvarProgresso, salvarRascunho } from './persistencia';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('persistência em Postgres real', () => {
  const db = new Pool({ connectionString: url, max: 3 });
  const aluno = `teste-${randomBytes(16).toString('hex')}`;
  const outro = `teste-${randomBytes(16).toString('hex')}`;
  beforeAll(async () => {
    await db.query(await readFile('db/migrations/001_persistencia.sql', 'utf8'));
    await db.query(await readFile('db/migrations/003_eventos_estudo.sql', 'utf8'));
  });
  afterAll(async () => {
    await db.query('DELETE FROM progresso WHERE visitante = ANY($1)', [[aluno, outro]]);
    await db.query('DELETE FROM rascunhos WHERE visitante = ANY($1)', [[aluno, outro]]);
    await db.end();
  });

  it('mescla gravações concorrentes sem apagar exercícios nem mudar a primeira data', async () => {
    const data = '2026-11-03T10:00:00.000Z';
    await Promise.all(
      [0, 1].map((indice) =>
        salvarProgresso(db, aluno, {
          versao: 1,
          concluidas: {},
          exerciciosConcluidos: { [`t/l#${indice}`]: data },
        }),
      ),
    );
    await salvarProgresso(db, aluno, {
      versao: 1,
      concluidas: { 't/l': data },
      exerciciosConcluidos: { 't/l#0': '2030-01-01T00:00:00.000Z' },
    });
    const salvo = await carregarDados(db, aluno);
    expect(salvo.progresso).toEqual({
      versao: 1,
      concluidas: { 't/l': data },
      exerciciosConcluidos: { 't/l#0': data, 't/l#1': data },
    });
    expect((await carregarDados(db, outro)).progresso.exerciciosConcluidos).toEqual({});
  });

  it('salva texto literalmente, atualiza e apaga apenas o rascunho do visitante', async () => {
    const codigo = "console.log('ação'); -- $1 🖊️";
    await salvarRascunho(db, aluno, 'livre', codigo);
    await salvarRascunho(db, outro, 'livre', 'outro aluno');
    expect((await carregarDados(db, aluno)).rascunhos.livre).toBe(codigo);
    await salvarRascunho(db, aluno, 'livre', 'atualizado');
    expect((await carregarDados(db, aluno)).rascunhos.livre).toBe('atualizado');
    await salvarRascunho(db, aluno, 'livre', null);
    expect((await carregarDados(db, aluno)).rascunhos).toEqual({});
    expect((await carregarDados(db, outro)).rascunhos.livre).toBe('outro aluno');
  });
});
