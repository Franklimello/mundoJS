import { randomBytes } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { vincularProgresso } from './vincular-progresso';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('incorporação de dados no Postgres real', () => {
  const esquema = `conta_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, options: `-c search_path=${esquema}`, max: 3 });
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    for (const arquivo of (await readdir('db/migrations')).filter((nome) => nome.endsWith('.sql')).sort()) {
      await db.query(await readFile(`db/migrations/${arquivo}`, 'utf8'));
    }
    for (const id of ['a', 'b', 'rollback'])
      await db.query('INSERT INTO auth_usuario (id, name, email, "emailVerified") VALUES ($1, $1, $2, true)', [
        id,
        `${id}@example.invalid`,
      ]);
  });
  afterAll(async () => {
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('mescla conclusões, mantém a primeira data e preserva o rascunho anterior', async () => {
    await db.query(
      `INSERT INTO progresso VALUES ('anonimo-a', 'exercicio', 't/l#0', '2026-01-01'), ('conta:a', 'exercicio', 't/l#0', '2026-02-01'), ('conta:a', 'exercicio', 't/l#1', '2026-02-01')`,
    );
    await db.query(
      `INSERT INTO rascunhos VALUES ('anonimo-a', 'livre', 'versão mais nova', '2026-02-01'), ('conta:a', 'livre', 'versão anterior', '2026-01-01')`,
    );
    expect(await vincularProgresso(db, 'anonimo-a', 'a')).toBe(true);
    const progresso = await db.query("SELECT * FROM progresso WHERE visitante = 'conta:a' ORDER BY chave");
    expect(progresso.rowCount).toBe(2);
    expect(progresso.rows[0].concluido_em.toISOString()).toBe('2026-01-01T00:00:00.000Z');
    expect((await db.query("SELECT codigo FROM rascunhos WHERE visitante = 'conta:a'")).rows[0].codigo).toBe(
      'versão mais nova',
    );
    expect(
      (await db.query("SELECT codigo FROM conta_rascunhos_arquivados WHERE usuario_id = 'a'")).rows[0].codigo,
    ).toBe('versão anterior');
    expect(await vincularProgresso(db, 'anonimo-a', 'a')).toBe(false);
    expect((await db.query("SELECT 1 FROM conta_rascunhos_arquivados WHERE usuario_id = 'a'")).rowCount).toBe(1);
    expect((await db.query("SELECT 1 FROM progresso WHERE visitante = 'anonimo-a'")).rowCount).toBe(0);
  });
  it('não reaproveita a mesma identidade anônima em outra conta', async () => {
    await db.query("INSERT INTO progresso VALUES ('anonimo-a', 'exercicio', 'privado#0', now())");
    expect(await vincularProgresso(db, 'anonimo-a', 'b')).toBe(false);
    expect((await db.query("SELECT 1 FROM progresso WHERE visitante = 'conta:b'")).rowCount).toBe(0);
  });
  it('preserva a versão anônima quando o rascunho da conta é mais recente', async () => {
    await db.query(
      `INSERT INTO rascunhos VALUES ('anonimo-b', 'livre', 'anônimo anterior', '2026-01-01'), ('conta:b', 'livre', 'conta mais recente', '2026-03-01')`,
    );
    await db.query(
      `INSERT INTO tutor_uso VALUES ('visitante:anonimo-b', date_trunc('hour', now()), 2), ('visitante:conta:b', date_trunc('hour', now()), 3)`,
    );
    await vincularProgresso(db, 'anonimo-b', 'b');
    expect((await db.query("SELECT codigo FROM rascunhos WHERE visitante = 'conta:b'")).rows[0].codigo).toBe(
      'conta mais recente',
    );
    expect(
      (await db.query("SELECT codigo FROM conta_rascunhos_arquivados WHERE usuario_id = 'b'")).rows[0].codigo,
    ).toBe('anônimo anterior');
    expect(
      (await db.query("SELECT quantidade FROM tutor_uso WHERE escopo = 'visitante:conta:b'")).rows[0].quantidade,
    ).toBe(5);
  });
  it('desfaz toda a incorporação se uma etapa falhar', async () => {
    await db.query("INSERT INTO progresso VALUES ('anonimo-falha', 'exercicio', 't/l#0', now())");
    await db.query("INSERT INTO rascunhos (visitante, chave, codigo) VALUES ('anonimo-falha', 'livre', 'preservar')");
    await db.query(`CREATE FUNCTION barrar_teste() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.visitante = 'conta:rollback' THEN RAISE EXCEPTION 'falha deliberada'; END IF; RETURN NEW; END $$;
      CREATE TRIGGER barrar_teste BEFORE INSERT ON rascunhos FOR EACH ROW EXECUTE FUNCTION barrar_teste()`);
    await expect(vincularProgresso(db, 'anonimo-falha', 'rollback')).rejects.toThrow('falha deliberada');
    expect((await db.query("SELECT 1 FROM progresso WHERE visitante = 'anonimo-falha'")).rowCount).toBe(1);
    expect((await db.query("SELECT 1 FROM rascunhos WHERE visitante = 'anonimo-falha'")).rowCount).toBe(1);
    expect((await db.query("SELECT 1 FROM progresso WHERE visitante = 'conta:rollback'")).rowCount).toBe(0);
    expect((await db.query("SELECT 1 FROM conta_importacoes WHERE visitante = 'anonimo-falha'")).rowCount).toBe(0);
  });
});
