import { afterEach, describe, expect, it, vi } from 'vitest';
import { criarExecutor } from '@/engine/executor';
import { rodar } from '@/engine/rodar';
import { buscarLicao } from './index';

const executar = criarExecutor();
afterEach(() => vi.unstubAllEnvs());

describe('correção dos sorteios', () => {
  const exercicio = buscarLicao('ferramentas-do-javascript', 'math-sorteios')!.licao.exercicios[0]!;
  it.each([
    'function rolarDado() { return 1; }',
    'function rolarDado() { return Math.round(Math.random() * 5) + 1; }',
    'function rolarDado() { return Math.floor(Math.random() * 6); }',
  ])('reprova um erro comum de sorteio sem deixar Math.random alterado: %s', async (codigo) => {
    const original = Math.random;
    const resultado = await rodar(codigo, exercicio.testes, executar);
    expect(resultado.testes.some((teste) => !teste.passou)).toBe(true);
    expect(Math.random).toBe(original);
  });
  it('aceita a solução repetidamente com sorteios controlados', async () => {
    const original = Math.random;
    for (let i = 0; i < 5; i++) {
      const resultado = await rodar(exercicio.solucao, exercicio.testes, executar);
      expect(resultado.erro).toBeNull();
      expect(resultado.testes.every((teste) => teste.passou)).toBe(true);
      expect(Math.random).toBe(original);
    }
  });
});

describe('datas em aparelhos com fusos diferentes', () => {
  const exercicios = buscarLicao('ferramentas-do-javascript', 'date-datas-e-prazos')!.licao.exercicios;
  it.each(['America/Sao_Paulo', 'Pacific/Auckland'])('mantém os resultados em %s', async (fuso) => {
    vi.stubEnv('TZ', fuso);
    for (const exercicio of exercicios) {
      const resultado = await rodar(exercicio.solucao, exercicio.testes, executar);
      expect(resultado.erro).toBeNull();
      expect(
        resultado.testes.every((teste) => teste.passou),
        exercicio.titulo,
      ).toBe(true);
    }
  });
});
