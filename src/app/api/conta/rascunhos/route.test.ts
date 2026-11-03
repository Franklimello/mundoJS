import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), query: vi.fn() }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({ query: mocks.query }) }));
import { GET } from './route';

beforeEach(() => {
  vi.clearAllMocks();
});
describe('exportação de rascunhos anteriores', () => {
  it('recusa visitantes sem sessão', async () => {
    mocks.sessao.mockResolvedValue(null);
    expect((await GET()).status).toBe(401);
    expect(mocks.query).not.toHaveBeenCalled();
  });
  it('consulta exclusivamente o dono autenticado e entrega texto para download sem cache', async () => {
    mocks.sessao.mockResolvedValue({ user: { id: 'usuario-a' } });
    mocks.query.mockResolvedValue({
      rows: [{ chave: 'rascunho-livre', codigo: 'código preservado do teste', original_em: new Date('2026-01-01') }],
    });
    const resposta = await GET();
    expect(resposta.status).toBe(200);
    expect(mocks.query).toHaveBeenCalledWith(expect.any(String), ['usuario-a']);
    expect(resposta.headers.get('content-disposition')).toContain('attachment');
    expect(resposta.headers.get('cache-control')).toContain('no-store');
    expect(await resposta.text()).toContain('código preservado do teste');
  });
});
