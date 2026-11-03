import Stripe from 'stripe';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ processar: vi.fn(), indisponivel: false }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/cobranca', () => ({
  stripe: () => {
    if (mocks.indisponivel) throw new Error('Sem chave');
    return new Stripe('sk_test_local');
  },
  processarEvento: mocks.processar,
}));
import { POST } from './route';

const api = new Stripe('sk_test_local');
const segredo = 'whsec_apenas_teste';
function pedido({ adulterar = false, live = false, assinar = true } = {}) {
  const texto = JSON.stringify({
    id: 'evt_teste',
    type: 'invoice.paid',
    livemode: live,
    data: { object: { customer: 'cus_teste' } },
  });
  const assinatura = api.webhooks.generateTestHeaderString({ payload: texto, secret: segredo });
  return new Request('http://localhost:3001/api/stripe/webhook', {
    method: 'POST',
    headers: assinar ? { 'stripe-signature': assinatura } : {},
    body: adulterar ? texto + ' ' : texto,
  });
}
beforeEach(() => {
  vi.stubEnv('STRIPE_WEBHOOK_SECRET', segredo);
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_local');
  mocks.indisponivel = false;
  mocks.processar.mockReset().mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());
describe('webhook Stripe', () => {
  it('aceita apenas o corpo original com assinatura válida', async () => {
    expect((await POST(pedido())).status).toBe(200);
    expect(mocks.processar).toHaveBeenCalledOnce();
    expect((await POST(pedido({ adulterar: true }))).status).toBe(400);
    expect((await POST(pedido({ assinar: false }))).status).toBe(400);
    expect(mocks.processar).toHaveBeenCalledOnce();
  });
  it('não mistura eventos de teste e produção', async () => {
    expect((await POST(pedido({ live: true }))).status).toBe(400);
    expect(mocks.processar).not.toHaveBeenCalled();
  });
  it('solicita reentrega em falha do banco', async () => {
    mocks.processar.mockRejectedValue(new Error('Banco indisponível'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await POST(pedido())).status).toBe(503);
    log.mockRestore();
  });
  it('falha fechado sem configuração', async () => {
    mocks.indisponivel = true;
    expect((await POST(pedido())).status).toBe(503);
    expect(mocks.processar).not.toHaveBeenCalled();
  });
});
