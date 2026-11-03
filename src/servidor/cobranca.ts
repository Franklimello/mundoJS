import Stripe from 'stripe';
import { randomUUID } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { PLANO_PRO } from '@/conta/planos';

export class ErroCobranca extends Error {
  constructor(
    public status: number,
    mensagem: string,
  ) {
    super(mensagem);
  }
}

export function cobrancaConfigurada() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() &&
    process.env.STRIPE_PRICE_PRO_MENSAL?.trim() &&
    process.env.STRIPE_WEBHOOK_SECRET?.trim(),
  );
}
export function stripe() {
  if (!cobrancaConfigurada())
    throw new ErroCobranca(503, 'As assinaturas ainda não estão disponíveis. Continue estudando gratuitamente.');
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { timeout: 10000, maxNetworkRetries: 1 });
}
function origem() {
  const url = new URL(process.env.BETTER_AUTH_URL || 'http://localhost:3001');
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)))
    throw new Error('Origem de cobrança inválida');
  return url.origin;
}

interface ContaCobranca {
  usuario_id: string;
  cliente_id: string | null;
  cliente_chave: string;
  checkout_chave: string | null;
  checkout_expira: string | null;
  assinatura_id: string | null;
  status: string;
  inicio: Date | null;
  fim: Date | null;
  cancelar_no_fim: boolean;
}

// Um bloqueio por conta serializa criação de cliente, checkout e sincronização.
// As chaves são persistidas ANTES de chamadas externas, para sobreviver a timeouts.
async function comConta<T>(db: Pool, usuario: string, acao: (c: PoolClient, conta: ContaCobranca) => Promise<T>) {
  const c = await db.connect();
  let bloqueado = false;
  let destruir = false;
  try {
    await c.query('SELECT pg_advisory_lock(hashtextextended($1, 730032))', [usuario]);
    bloqueado = true;
    await c.query('INSERT INTO cobranca_contas(usuario_id, cliente_chave) VALUES ($1,$2) ON CONFLICT DO NOTHING', [
      usuario,
      randomUUID(),
    ]);
    const { rows } = await c.query<ContaCobranca>('SELECT * FROM cobranca_contas WHERE usuario_id=$1', [usuario]);
    if (!rows[0]) throw new Error('Conta de cobrança ausente');
    return await acao(c, rows[0]);
  } finally {
    if (bloqueado) {
      try {
        await c.query('SELECT pg_advisory_unlock(hashtextextended($1, 730032))', [usuario]);
      } catch {
        destruir = true;
      }
    }
    c.release(destruir);
  }
}

export function precoValido(preco: Stripe.Price, exigirAtivo = true) {
  return (
    preco.id === process.env.STRIPE_PRICE_PRO_MENSAL &&
    (!exigirAtivo || preco.active) &&
    preco.currency === PLANO_PRO.moeda &&
    preco.unit_amount === PLANO_PRO.centavos &&
    preco.transform_quantity == null &&
    preco.custom_unit_amount == null &&
    preco.recurring?.interval === 'month' &&
    preco.recurring.interval_count === 1 &&
    preco.recurring.usage_type === 'licensed'
  );
}

export async function criarCheckout(db: Pool, usuario: { id: string; email: string }, api = stripe()) {
  const preco = await api.prices.retrieve(process.env.STRIPE_PRICE_PRO_MENSAL!);
  if (!precoValido(preco)) throw new ErroCobranca(503, 'O pagamento está em preparação. Tente novamente mais tarde.');
  return comConta(db, usuario.id, async (c, conta) => {
    let cliente = conta.cliente_id;
    if (!cliente) {
      const novo = await api.customers.create(
        { email: usuario.email, metadata: { mundojsUsuario: usuario.id } },
        { idempotencyKey: `mundojs-cliente-${conta.cliente_chave}` },
      );
      cliente = novo.id;
      await c.query('UPDATE cobranca_contas SET cliente_id=$2 WHERE usuario_id=$1', [usuario.id, cliente]);
    }
    const assinaturas = await api.subscriptions.list({ customer: cliente, status: 'all', limit: 100 });
    if (assinaturas.has_more || assinaturas.data.some((s) => !['canceled', 'incomplete_expired'].includes(s.status)))
      throw new ErroCobranca(409, 'Você já tem uma assinatura ou pagamento em andamento. Use “Gerenciar assinatura”.');
    const abertas = await api.checkout.sessions.list({ customer: cliente, status: 'open', limit: 100 });
    const existente = abertas.data.find(
      (s) => s.metadata?.mundojsUsuario === usuario.id && s.metadata?.preco === preco.id && s.mode === 'subscription',
    );
    if (existente?.url) return existente.url;
    if (abertas.has_more || abertas.data.length)
      throw new ErroCobranca(409, 'Já existe um pagamento em andamento. Aguarde ou entre em contato.');
    const agora = Math.floor(Date.now() / 1000);
    let chave = conta.checkout_chave;
    let expira = Number(conta.checkout_expira);
    if (!chave || expira <= agora + 60) {
      chave = randomUUID();
      expira = agora + 3600;
      await c.query('UPDATE cobranca_contas SET checkout_chave=$2, checkout_expira=$3 WHERE usuario_id=$1', [
        usuario.id,
        chave,
        expira,
      ]);
    }
    const sessao = await api.checkout.sessions.create(
      {
        mode: 'subscription',
        customer: cliente,
        line_items: [{ price: preco.id, quantity: 1 }],
        allowed_payment_method_types: ['card'],
        success_url: `${origem()}/conta/plano?retorno=checkout`,
        cancel_url: `${origem()}/planos?retorno=cancelado`,
        expires_at: expira,
        metadata: { mundojsUsuario: usuario.id, preco: preco.id },
        subscription_data: { metadata: { mundojsUsuario: usuario.id } },
        allow_promotion_codes: false,
      },
      { idempotencyKey: `mundojs-checkout-${chave}` },
    );
    if (!sessao.url) throw new Error('Checkout sem URL');
    return sessao.url;
  });
}

export async function criarPortal(db: Pool, usuario: string, api = stripe()) {
  const { rows } = await db.query<ContaCobranca>('SELECT * FROM cobranca_contas WHERE usuario_id=$1', [usuario]);
  if (!rows[0]?.cliente_id) throw new ErroCobranca(409, 'Sua conta ainda não tem uma assinatura para gerenciar.');
  const sessao = await api.billingPortal.sessions.create({
    customer: rows[0].cliente_id,
    return_url: `${origem()}/conta/plano`,
  });
  return sessao.url;
}

export async function lerAssinatura(db: Pool, usuario: string) {
  const { rows } = await db.query<ContaCobranca>('SELECT * FROM cobranca_contas WHERE usuario_id=$1', [usuario]);
  const conta = rows[0];
  return {
    pro: Boolean(
      conta?.status === 'active' && conta.inicio && conta.fim && conta.inicio <= new Date() && conta.fim > new Date(),
    ),
    inicio: conta?.inicio ?? null,
    fim: conta?.fim ?? null,
    cancelarNoFim: conta?.cancelar_no_fim ?? false,
    podeGerenciar: Boolean(conta?.cliente_id),
  };
}

const EVENTOS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.deleted',
]);

export async function processarEvento(db: Pool, evento: Stripe.Event, api = stripe()) {
  if (!EVENTOS.has(evento.type)) return;
  const objeto = evento.data.object as unknown as { id: string; customer?: string | { id: string } | null };
  const cliente =
    evento.type === 'customer.deleted'
      ? objeto.id
      : typeof objeto.customer === 'string'
        ? objeto.customer
        : objeto.customer?.id;
  if (!cliente) return;
  const { rows } = await db.query<{ usuario_id: string }>(
    'SELECT usuario_id FROM cobranca_contas WHERE cliente_id=$1',
    [cliente],
  );
  if (!rows[0]) return;
  await comConta(db, rows[0].usuario_id, async (c, conta) => {
    if (
      conta.cliente_id !== cliente ||
      (await c.query('SELECT 1 FROM cobranca_eventos WHERE id=$1', [evento.id])).rowCount
    )
      return;
    // Não aplica o retrato do evento: entrega pode estar fora de ordem.
    const clienteAtual = await api.customers.retrieve(cliente);
    let assinatura: Stripe.Subscription | undefined;
    if (!clienteAtual.deleted) {
      const atuais = await api.subscriptions.list({
        customer: cliente,
        status: 'active',
        limit: 100,
        expand: ['data.latest_invoice'],
      });
      if (atuais.has_more) throw new Error('Assinaturas em excesso');
      assinatura = atuais.data.find((s) => {
        const item = s.items.data[0];
        const fatura = s.latest_invoice;
        return (
          s.items.data.length === 1 &&
          item &&
          item.quantity === 1 &&
          precoValido(item.price, false) &&
          s.status === 'active' &&
          fatura &&
          typeof fatura !== 'string' &&
          fatura.status === 'paid' &&
          item.current_period_end * 1000 > Date.now()
        );
      });
    }
    const item = assinatura?.items.data[0];
    await c.query('BEGIN');
    try {
      await c.query(
        `UPDATE cobranca_contas SET assinatura_id=$2, status=$3, inicio=$4, fim=$5, cancelar_no_fim=$6, atualizado_em=now(), cliente_id=$7, cliente_chave=$8 WHERE usuario_id=$1`,
        [
          conta.usuario_id,
          assinatura?.id ?? null,
          assinatura ? 'active' : 'gratuito',
          item ? new Date(item.current_period_start * 1000) : null,
          item ? new Date(item.current_period_end * 1000) : null,
          Boolean(
            assinatura?.cancel_at_period_end ||
            (assinatura?.cancel_at != null && assinatura.cancel_at === item?.current_period_end),
          ),
          clienteAtual.deleted ? null : cliente,
          clienteAtual.deleted ? randomUUID() : conta.cliente_chave,
        ],
      );
      await c.query('INSERT INTO cobranca_eventos(id) VALUES ($1)', [evento.id]);
      await c.query('COMMIT');
    } catch (erro) {
      await c.query('ROLLBACK');
      throw erro;
    }
  });
}
