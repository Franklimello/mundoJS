import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { eventoValido, salvarEvento } from '@/servidor/eventos-estudo';
import { visitante } from '@/servidor/visitante';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return new NextResponse(null, { status: 403, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return new NextResponse(null, { status: 415, headers });
  let dados: unknown;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) return new NextResponse(null, { status: 400, headers });
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 2000) {
        await leitor.cancel();
        return new NextResponse(null, { status: 413, headers });
      }
      partes.push(value);
    }
    dados = JSON.parse(Buffer.concat(partes).toString('utf8'));
  } catch {
    return new NextResponse(null, { status: 400, headers });
  }
  if (!eventoValido(dados)) return new NextResponse(null, { status: 400, headers });
  try {
    await salvarEvento(banco(), await visitante(), dados);
    return new NextResponse(null, { status: 204, headers });
  } catch {
    return new NextResponse(null, { status: 503, headers });
  }
}
