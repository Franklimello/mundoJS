import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), vincular: vi.fn(), renovar: vi.fn(), query: vi.fn() }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({ query: mocks.query }) }));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => ({ value: 'a'.repeat(64) }) }) }));
vi.mock('@/servidor/visitante', () => ({
  hashVisitante: () => 'anonimo-teste',
  tokenVisitanteValido: () => true,
  renovarVisitante: mocks.renovar,
}));
vi.mock('@/servidor/vincular-progresso', () => ({ vincularProgresso: mocks.vincular }));
import { POST } from './route';

const pedido = (conta = 'usuario-a', origin = 'http://localhost:3000') =>
  new Request('http://localhost:3000/api/conta/vincular', {
    method: 'POST',
    headers: { origin, 'x-mundojs-conta': conta },
    body: JSON.stringify({ usuarioId: 'destino-malicioso' }),
  });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'usuario-a', emailVerified: true } });
  mocks.vincular.mockResolvedValue(true);
  mocks.query.mockResolvedValue({ rows: [{ total: 1 }] });
});
describe('incorporação autenticada', () => {
  it('exige sessão verificada, origem permitida e a mesma conta da tela', async () => {
    expect((await POST(pedido('usuario-a', 'null'))).status).toBe(403);
    mocks.sessao.mockResolvedValueOnce(null);
    expect((await POST(pedido())).status).toBe(401);
    mocks.sessao.mockResolvedValueOnce({ user: { id: 'usuario-a', emailVerified: false } });
    expect((await POST(pedido())).status).toBe(401);
    expect((await POST(pedido('conta-anterior'))).status).toBe(409);
    expect(mocks.vincular).not.toHaveBeenCalled();
  });
  it('deriva origem do cookie e destino da sessão, ignorando destinos enviados pelo cliente', async () => {
    const resposta = await POST(pedido());
    expect(resposta.status).toBe(200);
    expect(mocks.vincular).toHaveBeenCalledWith(expect.anything(), 'anonimo-teste', 'usuario-a');
    expect(mocks.renovar).toHaveBeenCalledOnce();
    expect(await resposta.json()).toEqual({ salvo: true, incorporados: true, arquivados: 1 });
    expect(mocks.query).toHaveBeenCalledWith(expect.any(String), ['usuario-a']);
  });
  it('preserva a credencial anônima para tentar novamente se a transação falhar', async () => {
    mocks.vincular.mockRejectedValueOnce(new Error('falha no banco'));
    expect((await POST(pedido())).status).toBe(503);
    expect(mocks.renovar).not.toHaveBeenCalled();
  });
});
