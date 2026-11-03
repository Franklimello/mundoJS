import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { stripe, processarEvento } from '@/servidor/cobranca';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  const assinatura = request.headers.get('stripe-signature');
  if (!assinatura) return NextResponse.json({ erro: 'Assinatura ausente.' }, { status: 400 });
  let api;
  try {
    api = stripe();
  } catch {
    return NextResponse.json({ erro: 'Serviço não configurado.' }, { status: 503 });
  }
  let evento;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) throw new Error('Corpo ausente');
    let tamanho = 0;
    const partes: Uint8Array[] = [];
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 1000000) {
        await leitor.cancel();
        return NextResponse.json({ erro: 'Evento muito grande.' }, { status: 413 });
      }
      partes.push(value);
    }
    evento = api.webhooks.constructEvent(Buffer.concat(partes), assinatura, process.env.STRIPE_WEBHOOK_SECRET!);
    if (evento.livemode !== process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_'))
      throw new Error('Ambiente incorreto');
  } catch {
    return NextResponse.json({ erro: 'Evento inválido.' }, { status: 400 });
  }
  try {
    await processarEvento(banco(), evento, api);
    return NextResponse.json({ recebido: true });
  } catch {
    // Resposta não-2xx solicita reentrega. Não registra dados pessoais da cobrança.
    console.error('Falha ao sincronizar assinatura Stripe.');
    return NextResponse.json({ erro: 'Tente novamente.' }, { status: 503 });
  }
}
