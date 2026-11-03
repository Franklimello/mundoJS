import { randomUUID, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eventoValido, salvarEvento } from './eventos-estudo';

const posicao = { trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 };
describe('validação dos eventos', () => {
  it('aceita apenas tipos, exercícios e resultados válidos', () => {
    expect(eventoValido({ id: randomUUID(), tipo: 'visita' })).toBe(true);
    expect(eventoValido({ id: randomUUID(), tipo: 'exercicio_aberto', posicao })).toBe(true);
    expect(eventoValido({ id: randomUUID(), tipo: 'exercicio_conferido', posicao, passou: false })).toBe(true);
    expect(eventoValido({ id: randomUUID(), tipo: 'exercicio_conferido', posicao })).toBe(false);
    expect(eventoValido({ id: randomUUID(), tipo: 'exercicio_aberto', posicao: { ...posicao, indice: 99 } })).toBe(
      false,
    );
    expect(eventoValido({ id: randomUUID(), tipo: 'texto-livre', posicao })).toBe(false);
    expect(eventoValido({ id: 'id-invalido', tipo: 'visita' })).toBe(false);
    expect(eventoValido(null)).toBe(false);
  });
});

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('eventos no Postgres real', () => {
  const db = new Pool({ connectionString: url });
  const aluno = `teste-${randomBytes(16).toString('hex')}`;
  beforeAll(async () => {
    await db.query(await readFile('db/migrations/003_eventos_estudo.sql', 'utf8'));
  });
  afterAll(async () => {
    await db.query('DELETE FROM estudo_eventos WHERE visitante = $1', [aluno]);
    await db.end();
  });
  it('deduplica reenvios e persiste apenas metadados permitidos', async () => {
    const evento = { id: randomUUID(), tipo: 'exercicio_aberto' as const, posicao, codigo: 'NÃO GUARDAR' };
    await Promise.all([salvarEvento(db, aluno, evento), salvarEvento(db, aluno, evento)]);
    const dados = await db.query('SELECT * FROM estudo_eventos WHERE visitante = $1', [aluno]);
    expect(dados.rowCount).toBe(1);
    expect(dados.rows[0]).toMatchObject({
      tipo: 'exercicio_aberto',
      trilha: posicao.trilha,
      licao: posicao.licao,
      indice: 0,
      passou: null,
    });
    expect(JSON.stringify(dados.rows)).not.toContain('NÃO GUARDAR');
  });
});
