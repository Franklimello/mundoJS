import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), checkout: vi.fn(), portal: vi.fn() }));
vi.mock('./sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('./banco', () => ({ banco: () => ({}) }));
vi.mock('./cobranca', async (original) => ({
  ...(await original<typeof import('./cobranca')>()),
  criarCheckout: mocks.checkout,
  criarPortal: mocks.portal,
}));
import { acaoCobranca } from './api-cobranca';
function pedido(corpo: unknown = { identidade: 'a' }, origin = 'http://localhost:3001') {
  return new Request('http://localhost:3001/api/cobranca/checkout', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(corpo),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'a', email: 'a@example.test', emailVerified: true } });
  mocks.checkout.mockResolvedValue('https://checkout.stripe.com/teste');
  mocks.portal.mockResolvedValue('https://billing.stripe.com/teste');
});
describe('ações de cobrança autenticadas', () => {
  it('recusa corpos grandes antes de abrir o pagamento', async () => {
    expect((await acaoCobranca(pedido({ identidade: 'a', extra: 'x'.repeat(2001) }), 'checkout')).status).toBe(413);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it('bloqueia CSRF e iframe antes de criar cobrança', async () => {
    for (const origin of ['null', 'https://invasor.test'])
      expect((await acaoCobranca(pedido({}, origin), 'checkout')).status).toBe(403);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it('exige conta verificada', async () => {
    mocks.sessao.mockResolvedValue(null);
    expect((await acaoCobranca(pedido(), 'checkout')).status).toBe(401);
    mocks.sessao.mockResolvedValue({ user: { id: 'a', emailVerified: false } });
    expect((await acaoCobranca(pedido(), 'portal')).status).toBe(401);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it('rejeita ação de aba com outra identidade', async () => {
    expect((await acaoCobranca(pedido({ identidade: 'b' }), 'checkout')).status).toBe(409);
    expect(mocks.checkout).not.toHaveBeenCalled();
  });
  it('ignora preço, cliente e redirecionamento enviados pelo navegador', async () => {
    const r = await acaoCobranca(
      pedido({ identidade: 'a', customer: 'cus_invasor', price: 'gratis', return_url: 'https://invasor.test' }),
      'checkout',
    );
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toContain('no-store');
    expect(mocks.checkout).toHaveBeenCalledWith({}, { id: 'a', email: 'a@example.test', emailVerified: true });
    await acaoCobranca(pedido(), 'portal');
    expect(mocks.portal).toHaveBeenCalledWith({}, 'a');
  });
});
