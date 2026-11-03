import { randomBytes, randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { historicoDoTutor } from './historico-tutor';

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('histórico adaptativo no Postgres', () => {
  const esquema = `historico_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, options: `-c search_path=${esquema}`, max: 3 });
  const contexto = { trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 };
  async function evento(
    visitante: string,
    tipo: string,
    passou: boolean | null,
    dias = 0,
    indice = 0,
    licao = 'ola-mundo',
  ) {
    await db.query(
      `INSERT INTO estudo_eventos (id, visitante, tipo, trilha, licao, indice, passou, criado_em)
      VALUES ($1,$2,$3,'javascript-do-zero',$4,$5,$6,now() - $7 * interval '1 day')`,
      [randomUUID(), visitante, tipo, licao, indice, passou, dias],
    );
  }
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    await db.query(await readFile('db/migrations/003_eventos_estudo.sql', 'utf8'));
  });
  afterAll(async () => {
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('devolve zeros sem inventar dificuldades e não consulta o banco no editor livre', async () => {
    expect(await historicoDoTutor(db, 'novo', contexto)).toEqual({
      tentativas: 0,
      semAcerto: 0,
      ajudas: 0,
      topicosParaRetomar: [],
    });
    expect(await historicoDoTutor(null as unknown as Pool, 'novo', { livre: true })).toBeNull();
  });
  it('isola por identidade, exercício e janela de 30 dias', async () => {
    await evento('aluno', 'exercicio_conferido', false);
    await evento('aluno', 'exercicio_conferido', true);
    await evento('aluno', 'ajuda_recebida', null);
    await evento('aluno', 'ajuda_pedida', null);
    await evento('outro', 'exercicio_conferido', false);
    await evento('aluno', 'exercicio_conferido', false, 31);
    await evento('aluno', 'exercicio_conferido', false, 0, 1);
    expect(await historicoDoTutor(db, 'aluno', contexto)).toMatchObject({ tentativas: 2, semAcerto: 1, ajudas: 1 });
    expect((await historicoDoTutor(db, 'outro', contexto))?.tentativas).toBe(1);
  });
  it('retoma tópicos com repetição de falhas e deixa de sugeri-los depois do acerto', async () => {
    await evento('retomar', 'exercicio_conferido', false, 3);
    await evento('retomar', 'exercicio_conferido', false, 2);
    expect((await historicoDoTutor(db, 'retomar', contexto))?.topicosParaRetomar).toEqual([
      'JavaScript do zero: Mostrando algo na tela',
    ]);
    await evento('retomar', 'exercicio_conferido', true, 1);
    expect((await historicoDoTutor(db, 'retomar', contexto))?.topicosParaRetomar).toEqual([]);
  });
  it('mantém os sinais de outro exercício ainda pendente na mesma lição', async () => {
    await evento('pendentes', 'exercicio_conferido', false, 3, 0);
    await evento('pendentes', 'exercicio_conferido', false, 2, 0);
    await evento('pendentes', 'exercicio_conferido', true, 1, 1);
    const resumo = await historicoDoTutor(db, 'pendentes', contexto);
    expect(resumo?.topicosParaRetomar).toHaveLength(1);
    expect(JSON.stringify(resumo)).not.toContain('pendentes');
  });
});
