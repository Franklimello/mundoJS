import { randomBytes, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { carregarPainelAprendizado } from './painel-aprendizado';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('painel no Postgres', () => {
  const esquema = `painel_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, options: `-c search_path=${esquema}`, max: 3 });
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    for (const arquivo of (await readdir('db/migrations')).filter((nome) => nome.endsWith('.sql')).sort())
      await db.query(await readFile(`db/migrations/${arquivo}`, 'utf8'));
    for (const id of ['a', 'b'])
      await db.query('INSERT INTO auth_usuario (id,name,email,"emailVerified") VALUES ($1,$1,$2,true)', [
        id,
        `${id}@example.invalid`,
      ]);
  });
  afterAll(async () => {
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('separa progresso, atividade e certificados por conta e só conta prática nos sete dias de Brasília', async () => {
    await db.query(
      "INSERT INTO progresso(visitante,tipo,chave,concluido_em) VALUES ('conta:a','exercicio','javascript-do-zero/ola-mundo#0',now()),('conta:b','exercicio','javascript-do-zero/ola-mundo#1',now())",
    );
    await db.query(
      "INSERT INTO conta_certificados(id,usuario_id,trilha,titulo,nome,licoes,exercicios) VALUES ($1,'b','javascript-do-zero','JavaScript do zero','Aluno B',10,63)",
      [randomUUID()],
    );
    // Duas práticas no mesmo dia contam como um dia ativo. A visita, sozinha, não conta.
    for (const tipo of ['codigo_rodado', 'exercicio_conferido'])
      await db.query(
        "INSERT INTO estudo_eventos(id,visitante,tipo,criado_em) VALUES ($1,'conta:a',$2,((now() AT TIME ZONE 'America/Sao_Paulo')::date + interval '30 minutes') AT TIME ZONE 'America/Sao_Paulo')",
        [randomUUID(), tipo],
      );
    await db.query(
      "INSERT INTO estudo_eventos(id,visitante,tipo,criado_em) VALUES ($1,'conta:a','codigo_rodado',((now() AT TIME ZONE 'America/Sao_Paulo')::date - interval '1 minute') AT TIME ZONE 'America/Sao_Paulo')",
      [randomUUID()],
    );
    await db.query(
      "INSERT INTO estudo_eventos(id,visitante,tipo,criado_em) VALUES ($1,'conta:a','codigo_rodado',now() - interval '8 days')",
      [randomUUID()],
    );
    for (const identidade of ['conta:b', 'visitante'])
      await db.query("INSERT INTO estudo_eventos(id,visitante,tipo) VALUES ($1,$2,'visita')", [
        randomUUID(),
        identidade,
      ]);
    const a = await carregarPainelAprendizado(db, 'a');
    const b = await carregarPainelAprendizado(db, 'b');
    expect(a.feitos).toBe(1);
    expect(a.certificados).toBe(0);
    expect(b.certificados).toBe(1);
    expect(a.dias).toHaveLength(7);
    expect(a.dias.filter((dia) => dia.ativo)).toHaveLength(2);
    expect(a.dias.at(-1)?.ativo).toBe(true);
    expect(a.dias.at(-2)?.ativo).toBe(true);
    expect(b.dias.every((dia) => !dia.ativo)).toBe(true);
    expect(a.pro).toBe(false);
    expect(a.trilhas.filter((t) => t.liberada)).toHaveLength(1);
  });
});
