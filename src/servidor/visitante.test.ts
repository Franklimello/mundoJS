import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), get: vi.fn(), set: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: mocks.get, set: mocks.set }) }));
vi.mock('./sessao', () => ({ sessaoAtual: mocks.sessao, identidadeConta: (id: string) => `conta:${id}` }));
import { visitante } from './visitante';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.sessao.mockResolvedValue(null);
  mocks.get.mockReturnValue({ value: 'a'.repeat(64) });
});
describe('identidade do estudante', () => {
  it('mantém o histórico anônimo usando o hash do cookie existente', async () => {
    expect(await visitante()).toBe(createHash('sha256').update('a'.repeat(64)).digest('hex'));
    expect(mocks.set).not.toHaveBeenCalled();
  });
  it('usa somente o usuário da sessão para acessar dados de uma conta', async () => {
    mocks.sessao.mockResolvedValue({ user: { id: 'usuario-a' } });
    expect(await visitante()).toBe('conta:usuario-a');
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('substitui cookies inválidos por um token aleatório HttpOnly', async () => {
    mocks.get.mockReturnValue({ value: 'cookie-alterado' });
    expect(await visitante()).toMatch(/^[a-f0-9]{64}$/);
    expect(mocks.set).toHaveBeenCalledWith(
      'rabisco_visitante',
      expect.stringMatching(/^[a-f0-9]{64}$/),
      expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
    );
  });
  it('não transforma falha de autenticação em uma visita anônima silenciosamente', async () => {
    mocks.sessao.mockRejectedValue(new Error('sessão indisponível'));
    await expect(visitante()).rejects.toThrow('sessão indisponível');
    expect(mocks.set).not.toHaveBeenCalled();
  });
});
