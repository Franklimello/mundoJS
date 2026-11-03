import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Pool } from 'pg';
const mocks = vi.hoisted(() => ({ assinatura: vi.fn(), sessao: vi.fn() }));
vi.mock('./cobranca', () => ({ lerAssinatura: mocks.assinatura }));
vi.mock('./sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('./banco', () => ({ banco: () => ({}) }));
import { podeAcessarContexto, temProAtual } from './acesso-conteudo';

const db = {} as Pool;
beforeEach(() => {
  vi.clearAllMocks();
  mocks.assinatura.mockResolvedValue({ pro: false });
  mocks.sessao.mockResolvedValue(null);
});
describe('acesso ao conteúdo por plano', () => {
  it('mantém a primeira trilha e o rascunho acessíveis sem conta nem consulta de assinatura', async () => {
    expect(
      await podeAcessarContexto(db, 'anonimo', { trilha: 'javascript-do-zero', licao: 'variaveis', indice: 0 }),
    ).toBe(true);
    expect(await podeAcessarContexto(db, 'anonimo', { livre: true })).toBe(true);
    expect(mocks.assinatura).not.toHaveBeenCalled();
  });
  it('exige conta Pro para todas as demais trilhas e para todos os projetos', async () => {
    for (const contexto of [
      { trilha: 'listas-e-objetos', licao: 'objetos', indice: 0 },
      { projeto: 'javascript-do-zero' },
    ]) {
      expect(await podeAcessarContexto(db, 'anonimo', contexto)).toBe(false);
      expect(await podeAcessarContexto(db, 'conta:a', contexto)).toBe(false);
      mocks.assinatura.mockResolvedValueOnce({ pro: true });
      expect(await podeAcessarContexto(db, 'conta:a', contexto)).toBe(true);
    }
    expect(mocks.assinatura).toHaveBeenCalledWith(db, 'a');
  });
  it('a página consulta somente a conta da sessão atual', async () => {
    expect(await temProAtual()).toBe(false);
    expect(mocks.assinatura).not.toHaveBeenCalled();
    mocks.sessao.mockResolvedValue({ user: { id: 'a' } });
    expect(await temProAtual()).toBe(false);
    mocks.assinatura.mockResolvedValue({ pro: true });
    expect(await temProAtual()).toBe(true);
    expect(mocks.assinatura).toHaveBeenCalledWith({}, 'a');
  });
});
