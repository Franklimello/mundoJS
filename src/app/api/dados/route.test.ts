import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  salvarRascunho: vi.fn(),
  salvarProgresso: vi.fn(),
  carregarDados: vi.fn(),
}));
vi.mock('@/servidor/banco', () => ({ banco: () => ({ query: mocks.query }) }));
vi.mock('@/servidor/visitante', () => ({ visitante: async () => 'visitante-do-teste' }));
vi.mock('@/servidor/persistencia', () => ({
  salvarRascunho: mocks.salvarRascunho,
  salvarProgresso: mocks.salvarProgresso,
  carregarDados: mocks.carregarDados,
}));
import { GET, POST } from './route';

beforeEach(() => vi.clearAllMocks());
const requisicao = (dados: unknown, origem = 'http://localhost:3000') =>
  new Request('http://localhost:3000/api/dados', {
    method: 'POST',
    headers: { origin: origem, 'content-type': 'application/json' },
    body: JSON.stringify({ ...(dados as Record<string, unknown>), identidadeEsperada: 'visitante-do-teste' }),
  });

describe('API de persistência', () => {
  it('recusa gravações pendentes de outra identidade sem salvar nada', async () => {
    const request = new Request('http://localhost:3000/api/dados', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
      body: JSON.stringify({
        tipo: 'rascunho',
        chave: 'rascunho-livre',
        codigo: 'não copiar para outra conta',
        identidadeEsperada: 'conta:anterior',
      }),
    });
    expect((await POST(request)).status).toBe(409);
    expect(mocks.salvarRascunho).not.toHaveBeenCalled();
  });
  it('importa rascunhos sem sobrescrever um rascunho que já existe no banco', async () => {
    const resposta = await POST(requisicao({ tipo: 'importar-rascunho', chave: 'rascunho-livre', codigo: 'antigo' }));
    expect(resposta.status).toBe(200);
    expect(mocks.query).toHaveBeenCalledWith(expect.stringContaining('ON CONFLICT DO NOTHING'), [
      'visitante-do-teste',
      'rascunho-livre',
      'antigo',
    ]);
    expect(mocks.salvarRascunho).not.toHaveBeenCalled();
  });
  it('mantém originais de rascunhos antigos que não podem ser importados', async () => {
    const resposta = await POST(requisicao({ tipo: 'importar-rascunho', chave: 'nao-existe', codigo: 'antigo' }));
    expect(await resposta.json()).toEqual({ importado: false });
    expect(mocks.query).not.toHaveBeenCalled();
  });
  it('rejeita a origem opaca do executor e entradas fora do curso', async () => {
    expect((await POST(requisicao({ tipo: 'rascunho', chave: 'rascunho-livre', codigo: 'x' }, 'null'))).status).toBe(
      403,
    );
    expect((await POST(requisicao({ tipo: 'rascunho', chave: 'nao-existe', codigo: 'x' }))).status).toBe(400);
    expect(mocks.salvarRascunho).not.toHaveBeenCalled();
  });
  it('avisa que o banco está indisponível sem responder como se estivesse vazio', async () => {
    mocks.carregarDados.mockRejectedValueOnce(new Error('banco offline'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const resposta = await GET();
      expect(resposta.status).toBe(503);
      expect(resposta.headers.get('cache-control')).toContain('no-store');
    } finally {
      log.mockRestore();
    }
  });
});
