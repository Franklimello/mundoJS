import { NextResponse } from 'next/server';
import { sessaoAtual } from './sessao';
import { banco } from './banco';
import { criarCheckout, criarPortal, ErroCobranca } from './cobranca';

export const headersCobranca = { 'Cache-Control': 'private, no-store' };
export async function acaoCobranca(request: Request, acao: 'checkout' | 'portal') {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return NextResponse.json({ erro: 'Origem não permitida.' }, { status: 403, headers: headersCobranca });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ erro: 'Envie JSON.' }, { status: 415, headers: headersCobranca });
  try {
    const sessao = await sessaoAtual();
    if (!sessao?.user.emailVerified)
      return NextResponse.json(
        { erro: 'Entre em uma conta com e-mail verificado para continuar.' },
        { status: 401, headers: headersCobranca },
      );
    const leitor = request.body?.getReader();
    if (!leitor) throw new ErroCobranca(400, 'Pedido inválido.');
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 2000) {
        await leitor.cancel();
        throw new ErroCobranca(413, 'Pedido muito grande.');
      }
      partes.push(value);
    }
    const texto = Buffer.concat(partes).toString('utf8');
    let corpo;
    try {
      corpo = JSON.parse(texto);
    } catch {
      throw new ErroCobranca(400, 'Pedido inválido.');
    }
    if (corpo?.identidade !== sessao.user.id)
      throw new ErroCobranca(409, 'Sua conta mudou. Atualize esta página antes de continuar.');
    const url =
      acao === 'checkout' ? await criarCheckout(banco(), sessao.user) : await criarPortal(banco(), sessao.user.id);
    return NextResponse.json({ url }, { headers: headersCobranca });
  } catch (erro) {
    return NextResponse.json(
      {
        erro:
          erro instanceof ErroCobranca
            ? erro.message
            : 'Não foi possível abrir o pagamento. Tente novamente em instantes.',
      },
      { status: erro instanceof ErroCobranca ? erro.status : 503, headers: headersCobranca },
    );
  }
}
