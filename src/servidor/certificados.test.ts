import { randomBytes } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { trilhas, todasAsLicoes } from '@/conteudo';
import { emitirCertificado, lerCertificado, situacaoCertificados } from './certificados';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('certificados no Postgres', () => {
  const esquema = `certificados_teste_${randomBytes(8).toString('hex')}`;
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
  const trilha = trilhas[0]!;
  const chaves = todasAsLicoes(trilha).flatMap((licao) =>
    licao.exercicios.map((_, i) => `${trilha.slug}/${licao.slug}#${i}`),
  );
  it('bloqueia emissão sem todos os exercícios e não aceita progresso de visitante ou outra conta', async () => {
    for (const id of ['visitante', 'conta:b'])
      await db.query(
        "INSERT INTO progresso (visitante,tipo,chave,concluido_em) SELECT $1,'exercicio',unnest($2::text[]),now()",
        [id, chaves],
      );
    await db.query(
      "INSERT INTO progresso (visitante,tipo,chave,concluido_em) SELECT 'conta:a','licao',unnest($1::text[]),now()",
      [todasAsLicoes(trilha).map((licao) => `${trilha.slug}/${licao.slug}`)],
    );
    expect((await situacaoCertificados(db, 'a'))[0]).toMatchObject({ concluidos: 0, liberado: false });
    await expect(emitirCertificado(db, 'a', trilha.slug, 'Aluna MundoJS')).rejects.toThrow('trilha-incompleta');
    await db.query(
      "INSERT INTO progresso (visitante,tipo,chave,concluido_em) SELECT 'conta:a','exercicio',unnest($1::text[]),now()",
      [chaves.slice(0, -1)],
    );
    await expect(emitirCertificado(db, 'a', trilha.slug, 'Aluna MundoJS')).rejects.toThrow('trilha-incompleta');
  });
  it('valida nome e trilha antes de emitir', async () => {
    await expect(emitirCertificado(db, 'a', '../invalida', 'Aluna')).rejects.toThrow('trilha-invalida');
    await expect(emitirCertificado(db, 'a', trilha.slug, ' ')).rejects.toThrow('nome-invalido');
    await expect(emitirCertificado(db, 'a', trilha.slug, 'a'.repeat(101))).rejects.toThrow('nome-invalido');
    await expect(emitirCertificado(db, 'a', trilha.slug, 'Aluna\u202eInverso')).rejects.toThrow('nome-invalido');
  });
  it('emite uma única vez, inclusive em concorrência, e conserva o nome e o conteúdo originais', async () => {
    await db.query(
      "INSERT INTO progresso (visitante,tipo,chave,concluido_em) VALUES ('conta:a','exercicio',$1,now())",
      [chaves.at(-1)],
    );
    const [a, b] = await Promise.all([
      emitirCertificado(db, 'a', trilha.slug, '  Júlia  Melo '),
      emitirCertificado(db, 'a', trilha.slug, '  Júlia  Melo '),
    ]);
    expect(a.id).toBe(b.id);
    expect(a).toMatchObject({
      nome: 'Júlia Melo',
      titulo: trilha.titulo,
      exercicios: chaves.length,
      licoes: todasAsLicoes(trilha).length,
    });
    expect((await emitirCertificado(db, 'a', trilha.slug, 'Outro Nome')).nome).toBe('Júlia Melo');
    expect((await situacaoCertificados(db, 'a'))[0]?.certificado?.id).toBe(a.id);
    // O documento continua recuperável mesmo se o progresso deixar de estar disponível.
    await db.query('DELETE FROM progresso WHERE visitante=$1', ['conta:a']);
    expect((await emitirCertificado(db, 'a', trilha.slug, 'Júlia Melo')).id).toBe(a.id);
    expect((await lerCertificado(db, 'a', a.id))?.nome).toBe('Júlia Melo');
    expect(await lerCertificado(db, 'b', a.id)).toBeNull();
    expect(await lerCertificado(db, 'a', 'invalido')).toBeNull();
  });
});
