import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
import Stripe from 'stripe';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { criarCheckout, criarPortal, lerAssinatura, precoValido, processarEvento } from './cobranca';
import { reservarFranquia, usoTutor } from './franquia-tutor';

const preco = {
  id: 'price_pro',
  active: true,
  currency: 'brl',
  unit_amount: 999,
  recurring: { interval: 'month', interval_count: 1, usage_type: 'licensed' },
} as Stripe.Price;
function assinatura(opcoes: Record<string, unknown> = {}) {
  const agora = Math.floor(Date.now() / 1000);
  return {
    id: 'sub_pro',
    status: 'active',
    cancel_at_period_end: false,
    latest_invoice: { status: 'paid' },
    items: {
      data: [{ price: preco, quantity: 1, current_period_start: agora - 1000, current_period_end: agora + 86400 }],
    },
    ...opcoes,
  } as unknown as Stripe.Subscription;
}
function evento(id: string, customer = 'cus_a', type = 'customer.subscription.updated') {
  return { id, type, data: { object: { id: 'sub_antiga', customer, status: 'active' } } } as unknown as Stripe.Event;
}

describe('preço do lançamento', () => {
  beforeAll(() => vi.stubEnv('STRIPE_PRICE_PRO_MENSAL', 'price_pro'));
  afterAll(() => vi.unstubAllEnvs());
  it('aceita somente BRL 9,99 mensal fixo', () => {
    expect(precoValido(preco)).toBe(true);
    for (const alteracao of [
      { unit_amount: 9990 },
      { currency: 'usd' },
      { id: 'price_invasor' },
      { active: false },
      { transform_quantity: { divide_by: 100, round: 'down' } },
      { recurring: { ...preco.recurring, interval: 'year' } },
      { recurring: { ...preco.recurring, usage_type: 'metered' } },
    ])
      expect(precoValido({ ...preco, ...alteracao } as Stripe.Price)).toBe(false);
  });
});

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('assinaturas e franquia em Postgres real, Stripe simulado', () => {
  const esquema = `cobranca_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, max: 5, options: `-c search_path=${esquema}` });
  const mock = {
    prices: { retrieve: vi.fn() },
    customers: { create: vi.fn(), retrieve: vi.fn() },
    subscriptions: { list: vi.fn() },
    checkout: { sessions: { list: vi.fn(), create: vi.fn() } },
    billingPortal: { sessions: { create: vi.fn() } },
  };
  const api = mock as unknown as Stripe;
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    await db.query(await readFile('db/migrations/004_contas.sql', 'utf8'));
    await db.query(await readFile('db/migrations/007_assinaturas.sql', 'utf8'));
    vi.stubEnv('STRIPE_PRICE_PRO_MENSAL', 'price_pro');
    vi.stubEnv('BETTER_AUTH_URL', 'http://localhost:3001');
  });
  beforeEach(async () => {
    vi.clearAllMocks();
    await db.query('TRUNCATE auth_usuario, cobranca_contas, cobranca_eventos, tutor_franquias CASCADE');
    await db.query(
      `INSERT INTO auth_usuario(id,name,email,"emailVerified") VALUES ('a','A','a@example.test',true),('b','B','b@example.test',true)`,
    );
    mock.prices.retrieve.mockResolvedValue(preco);
    mock.customers.create.mockResolvedValue({ id: 'cus_a' });
    mock.customers.retrieve.mockResolvedValue({ id: 'cus_a' });
    mock.subscriptions.list.mockResolvedValue({ data: [], has_more: false });
    mock.checkout.sessions.list.mockResolvedValue({ data: [], has_more: false });
    mock.checkout.sessions.create.mockResolvedValue({ id: 'cs_a', url: 'https://checkout.stripe.com/teste' });
    mock.billingPortal.sessions.create.mockResolvedValue({ url: 'https://billing.stripe.com/teste' });
  });
  afterAll(async () => {
    vi.unstubAllEnvs();
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  async function vincular() {
    await db.query(`INSERT INTO cobranca_contas(usuario_id,cliente_id,cliente_chave) VALUES ('a','cus_a','chave')`);
  }
  it('cria checkout no preço do servidor e não concede Pro pelo retorno', async () => {
    expect(await criarCheckout(db, { id: 'a', email: 'a@example.test' }, api)).toContain('checkout.stripe.com');
    const params = mock.checkout.sessions.create.mock.calls[0]![0];
    expect(params.line_items).toEqual([{ price: 'price_pro', quantity: 1 }]);
    expect(params.success_url).toBe('http://localhost:3001/conta/plano?retorno=checkout');
    expect(params.allowed_payment_method_types).toEqual(['card']);
    expect((await lerAssinatura(db, 'a')).pro).toBe(false);
  });
  it('reutiliza checkout aberto e impede assinatura duplicada', async () => {
    await vincular();
    mock.checkout.sessions.list.mockResolvedValue({
      data: [
        {
          url: 'https://checkout.stripe.com/aberto',
          mode: 'subscription',
          metadata: { mundojsUsuario: 'a', preco: 'price_pro' },
        },
      ],
      has_more: false,
    });
    expect(await criarCheckout(db, { id: 'a', email: 'a@example.test' }, api)).toContain('/aberto');
    expect(mock.checkout.sessions.create).not.toHaveBeenCalled();
    mock.subscriptions.list.mockResolvedValue({ data: [assinatura({ status: 'past_due' })], has_more: false });
    await expect(criarCheckout(db, { id: 'a', email: 'a@example.test' }, api)).rejects.toMatchObject({ status: 409 });
  });
  it('persiste a chave idempotente e a reutiliza após timeout', async () => {
    mock.checkout.sessions.create.mockRejectedValueOnce(new Error('timeout'));
    await expect(criarCheckout(db, { id: 'a', email: 'a@example.test' }, api)).rejects.toThrow('timeout');
    await criarCheckout(db, { id: 'a', email: 'a@example.test' }, api);
    expect(mock.customers.create).toHaveBeenCalledOnce();
    expect(mock.checkout.sessions.create.mock.calls[0]![1]).toEqual(mock.checkout.sessions.create.mock.calls[1]![1]);
    expect(mock.checkout.sessions.create.mock.calls[0]![0]).toEqual(mock.checkout.sessions.create.mock.calls[1]![0]);
  });
  it('rejeita preço incorreto antes de criar cliente', async () => {
    mock.prices.retrieve.mockResolvedValue({ ...preco, unit_amount: 1999 });
    await expect(criarCheckout(db, { id: 'a', email: 'a@example.test' }, api)).rejects.toMatchObject({ status: 503 });
    expect(mock.customers.create).not.toHaveBeenCalled();
  });
  it('portal usa apenas o cliente vinculado à própria conta', async () => {
    await vincular();
    await expect(criarPortal(db, 'b', api)).rejects.toMatchObject({ status: 409 });
    await criarPortal(db, 'a', api);
    expect(mock.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: 'cus_a',
      return_url: 'http://localhost:3001/conta/plano',
    });
  });
  it.each(['flag', 'data'])('ativa período pago, deduplica e respeita cancelamento ao fim por %s', async (modo) => {
    await vincular();
    const atual = assinatura({ cancel_at_period_end: modo === 'flag' });
    if (modo === 'data') atual.cancel_at = atual.items.data[0]!.current_period_end;
    mock.subscriptions.list.mockResolvedValue({ data: [atual], has_more: false });
    await processarEvento(db, evento('evt_pago'), api);
    expect(await lerAssinatura(db, 'a')).toMatchObject({ pro: true, cancelarNoFim: true });
    await processarEvento(db, evento('evt_pago'), api);
    expect(mock.subscriptions.list).toHaveBeenCalledOnce();
    expect((await lerAssinatura(db, 'b')).pro).toBe(false);
  });
  it('evento atrasado nunca reativa assinatura cancelada', async () => {
    await vincular();
    mock.subscriptions.list.mockResolvedValueOnce({ data: [assinatura()], has_more: false });
    await processarEvento(db, evento('evt_primeiro'), api);
    await processarEvento(db, evento('evt_antigo'), api);
    expect((await lerAssinatura(db, 'a')).pro).toBe(false);
  });
  it('eventos concorrentes são processados uma vez e falhas podem ser reentregues', async () => {
    await vincular();
    mock.subscriptions.list.mockRejectedValueOnce(new Error('Stripe temporariamente indisponível'));
    await expect(processarEvento(db, evento('evt_retry'), api)).rejects.toThrow();
    expect((await db.query('SELECT 1 FROM cobranca_eventos')).rowCount).toBe(0);
    mock.subscriptions.list.mockResolvedValue({ data: [assinatura()], has_more: false });
    await Promise.all(Array.from({ length: 4 }, () => processarEvento(db, evento('evt_retry'), api)));
    expect((await db.query('SELECT 1 FROM cobranca_eventos')).rowCount).toBe(1);
    expect((await lerAssinatura(db, 'a')).pro).toBe(true);
  });
  it.each([
    { latest_invoice: { status: 'open' } },
    { status: 'past_due' },
    {
      items: {
        data: [
          {
            price: { ...preco, unit_amount: 100 },
            quantity: 1,
            current_period_start: 1,
            current_period_end: 9999999999,
          },
        ],
      },
    },
    { items: { data: [{ price: preco, quantity: 2, current_period_start: 1, current_period_end: 9999999999 }] } },
    { items: { data: [{ price: preco, quantity: 1, current_period_start: 1, current_period_end: 2 }] } },
  ])('não libera Pro para assinatura inválida: %j', async (alteracao) => {
    await vincular();
    mock.subscriptions.list.mockResolvedValue({ data: [assinatura(alteracao)], has_more: false });
    await processarEvento(db, evento('evt_invalido'), api);
    expect((await lerAssinatura(db, 'a')).pro).toBe(false);
  });
  it('não associa cliente desconhecido por metadata', async () => {
    await processarEvento(db, evento('evt_estranho', 'cus_desconhecido'), api);
    expect(mock.subscriptions.list).not.toHaveBeenCalled();
  });
  it('cota gratuita é atômica e uma falha devolve uma pergunta', async () => {
    const resultados = await Promise.allSettled(Array.from({ length: 15 }, () => reservarFranquia(db, 'conta:a')));
    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(3);
    expect(await usoTutor(db, 'conta:a')).toMatchObject({ limite: 3, restantes: 0 });
    const uma = resultados.find((r) => r.status === 'fulfilled');
    if (uma?.status === 'fulfilled') await uma.value();
    expect((await usoTutor(db, 'conta:a')).restantes).toBe(1);
    expect((await usoTutor(db, 'conta:b')).restantes).toBe(3);
  });
  it('visitante tem 1 pergunta e o Pro 100 por ciclo pago', async () => {
    await reservarFranquia(db, 'anonimo');
    await expect(reservarFranquia(db, 'anonimo')).rejects.toMatchObject({ status: 429 });
    await vincular();
    mock.subscriptions.list.mockResolvedValue({ data: [assinatura()], has_more: false });
    await processarEvento(db, evento('evt_pro'), api);
    await reservarFranquia(db, 'conta:a');
    expect(await usoTutor(db, 'conta:a')).toMatchObject({ plano: 'pro', limite: 100, restantes: 99 });
    // Reentrega e nova leitura não recarregam a franquia.
    await processarEvento(db, evento('evt_novo'), api);
    expect((await usoTutor(db, 'conta:a')).restantes).toBe(99);
  });
  it('a redução da franquia não apaga nem reinicia o uso já registrado', async () => {
    await reservarFranquia(db, 'conta:a');
    await db.query("UPDATE tutor_franquias SET quantidade=10 WHERE identidade='conta:a'");
    expect(await usoTutor(db, 'conta:a')).toMatchObject({ limite: 3, usadas: 10, restantes: 0 });
    await expect(reservarFranquia(db, 'conta:a')).rejects.toMatchObject({ status: 429 });
  });
  it('acesso expira pelo relógio, mesmo sem webhook', async () => {
    await vincular();
    await db.query(
      "UPDATE cobranca_contas SET status='active', inicio=now()-interval '1 month', fim=now()-interval '1 second'",
    );
    expect((await usoTutor(db, 'conta:a')).plano).toBe('gratuito');
  });
  it('renovação paga cria nova franquia e mudança de navegador não a altera', async () => {
    await vincular();
    mock.subscriptions.list.mockResolvedValue({ data: [assinatura()], has_more: false });
    await processarEvento(db, evento('evt_ciclo1'), api);
    await reservarFranquia(db, 'conta:a');
    expect((await usoTutor(db, 'conta:a')).restantes).toBe(99);
    const nova = assinatura();
    nova.items.data[0]!.current_period_start += 100;
    mock.subscriptions.list.mockResolvedValue({ data: [nova], has_more: false });
    await processarEvento(db, evento('evt_ciclo2'), api);
    expect((await usoTutor(db, 'conta:a')).restantes).toBe(100);
  });
});
