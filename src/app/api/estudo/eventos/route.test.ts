import { beforeEach, describe, expect, it, vi } from 'vitest';
const salvar = vi.hoisted(() => vi.fn());
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/visitante', () => ({ visitante: async () => 'teste' }));
vi.mock('@/servidor/eventos-estudo', async (original) => ({
  ...(await original<typeof import('@/servidor/eventos-estudo')>()),
  salvarEvento: salvar,
}));
import { POST } from './route';
const requisicao = (valor: unknown, origin = 'http://localhost:3000') =>
  new Request('http://localhost:3000/api/estudo/eventos', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(valor),
  });
beforeEach(() => {
  salvar.mockReset().mockResolvedValue(undefined);
});
describe('API de eventos', () => {
  it('bloqueia origem opaca, payload excessivo e eventos inventados', async () => {
    expect((await POST(requisicao({}, 'null'))).status).toBe(403);
    expect((await POST(requisicao({ texto: 'x'.repeat(2001) }))).status).toBe(413);
    expect((await POST(requisicao({ tipo: 'inventado' }))).status).toBe(400);
    expect(salvar).not.toHaveBeenCalled();
  });
  it('retorna indisponibilidade sem quebrar o restante da página', async () => {
    salvar.mockRejectedValue(new Error('offline'));
    const resposta = await POST(requisicao({ id: '234f19e9-5cc8-4b2f-934b-08b4b0fab849', tipo: 'visita' }));
    expect(resposta.status).toBe(503);
    expect(resposta.headers.get('cache-control')).toContain('no-store');
  });
});
