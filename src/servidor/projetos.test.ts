import { randomBytes } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { lerProjetoCompartilhado, publicacaoDoProjeto, publicarProjeto, retirarProjeto } from './projetos';
import { vincularProgresso } from './vincular-progresso';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('projetos no Postgres', () => {
  const esquema = `projetos_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, options: `-c search_path=${esquema}`, max: 3 });
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    for (const arquivo of (await readdir('db/migrations')).filter((nome) => nome.endsWith('.sql')).sort())
      await db.query(await readFile(`db/migrations/${arquivo}`, 'utf8'));
    for (const id of ['a', 'b'])
      await db.query('INSERT INTO auth_usuario (id, name, email, "emailVerified") VALUES ($1,$1,$2,true)', [
        id,
        `${id}@example.invalid`,
      ]);
  });
  afterAll(async () => {
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('cria links independentes e só altera a versão publicada em uma ação explícita', async () => {
    const a = await publicarProjeto(db, 'a', 'listas-e-objetos', 'console.log("versão compartilhada");');
    const b = await publicarProjeto(db, 'b', 'listas-e-objetos', 'console.log("projeto B");');
    expect(a.id).toMatch(/^[a-f0-9]{48}$/);
    expect(a.id).not.toBe(b.id);
    await db.query('INSERT INTO rascunhos (visitante,chave,codigo) VALUES ($1,$2,$3)', [
      'conta:a',
      'projeto/listas-e-objetos',
      'alteração privada',
    ]);
    expect((await lerProjetoCompartilhado(db, a.id))?.codigo).toBe('console.log("versão compartilhada");');
    const atualizada = await publicarProjeto(db, 'a', 'listas-e-objetos', 'versão atualizada');
    expect(atualizada.id).toBe(a.id);
    expect((await lerProjetoCompartilhado(db, b.id))?.codigo).toBe('console.log("projeto B");');
    expect(await publicacaoDoProjeto(db, 'a', 'listas-e-objetos')).not.toHaveProperty('codigo');
    expect(await lerProjetoCompartilhado(db, a.id)).not.toHaveProperty('usuario_id');
  });
  it('revoga apenas o próprio link e não revive o endereço anterior', async () => {
    const a = await publicarProjeto(db, 'a', 'javascript-do-zero', 'projeto A');
    const b = await publicarProjeto(db, 'b', 'javascript-do-zero', 'projeto B');
    await retirarProjeto(db, 'a', 'javascript-do-zero');
    expect(await lerProjetoCompartilhado(db, a.id)).toBeNull();
    expect((await lerProjetoCompartilhado(db, b.id))?.codigo).toBe('projeto B');
    expect((await publicarProjeto(db, 'a', 'javascript-do-zero', 'novo link')).id).not.toBe(a.id);
    expect(await lerProjetoCompartilhado(null as unknown as Pool, '../invalido')).toBeNull();
  });
  it('incorpora o rascunho do projeto à conta sem publicar seu conteúdo', async () => {
    await db.query('INSERT INTO rascunhos (visitante,chave,codigo) VALUES ($1,$2,$3)', [
      'anonimo-projeto',
      'projeto/erros-e-assincrono',
      'meu projeto privado',
    ]);
    await vincularProgresso(db, 'anonimo-projeto', 'a');
    expect(
      (
        await db.query('SELECT codigo FROM rascunhos WHERE visitante=$1 AND chave=$2', [
          'conta:a',
          'projeto/erros-e-assincrono',
        ])
      ).rows[0].codigo,
    ).toBe('meu projeto privado');
    expect(await publicacaoDoProjeto(db, 'a', 'erros-e-assincrono')).toBeNull();
  });
});
