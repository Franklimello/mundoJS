import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { reservarPergunta } from './limites-tutor';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('cotas do tutor em Postgres real', () => {
  const esquema = `tutor_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, max: 5, options: `-c search_path=${esquema}` });
  beforeAll(async () => {
    // Nome gerado exclusivamente de prefixo fixo + bytes hexadecimais.
    await admin.query(`CREATE SCHEMA ${esquema}`);
    await db.query(await readFile('db/migrations/002_limites_tutor.sql', 'utf8'));
    vi.stubEnv('TUTOR_LIMITE_HORA', '2');
    vi.stubEnv('TUTOR_LIMITE_DIARIO', '4');
  });
  afterAll(async () => {
    vi.unstubAllEnvs();
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('limita chamadas concorrentes e desfaz a reserva global se o visitante exceder a cota', async () => {
    const resultados = await Promise.allSettled(Array.from({ length: 5 }, () => reservarPergunta(db, 'aluno-a')));
    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(2);
    const global = await db.query("SELECT quantidade FROM tutor_uso WHERE escopo = 'global'");
    expect(global.rows[0].quantidade).toBe(2);
    await reservarPergunta(db, 'aluno-b');
    await reservarPergunta(db, 'aluno-b');
    await expect(reservarPergunta(db, 'aluno-c')).rejects.toMatchObject({ status: 429 });
    expect((await db.query('SELECT quantidade FROM tutor_uso WHERE escopo = $1', ['visitante:aluno-c'])).rowCount).toBe(
      0,
    );
  });
});
