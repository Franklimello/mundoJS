import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { sessaoAtual } from '@/servidor/sessao';
import { emitirCertificado } from '@/servidor/certificados';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return NextResponse.json({ erro: 'Origem não permitida.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ erro: 'Envie JSON.' }, { status: 415, headers });
  try {
    const sessao = await sessaoAtual();
    if (!sessao?.user.emailVerified)
      return NextResponse.json({ erro: 'Entre na sua conta para emitir.' }, { status: 401, headers });
    if (request.headers.get('x-mundojs-conta') !== sessao.user.id)
      return NextResponse.json({ erro: 'Sua sessão mudou. Recarregue a página.' }, { status: 409, headers });
    // Limite pequeno, incluindo corpos enviados sem Content-Length.
    const leitor = request.body?.getReader();
    let texto = '';
    let tamanho = 0;
    const decoder = new TextDecoder();
    if (!leitor) return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400, headers });
    while (true) {
      const parte = await leitor.read();
      if (parte.done) break;
      tamanho += parte.value.byteLength;
      if (tamanho > 2048) {
        await leitor.cancel();
        return NextResponse.json({ erro: 'Conteúdo muito grande.' }, { status: 413, headers });
      }
      texto += decoder.decode(parte.value, { stream: true });
    }
    texto += decoder.decode();
    let dados;
    try {
      dados = JSON.parse(texto);
    } catch {
      return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400, headers });
    }
    if (typeof dados?.trilha !== 'string' || typeof dados?.nome !== 'string')
      return NextResponse.json({ erro: 'Confira a trilha e o nome.' }, { status: 400, headers });
    const certificado = await emitirCertificado(banco(), sessao.user.id, dados.trilha, dados.nome);
    return NextResponse.json({ id: certificado.id }, { headers });
  } catch (erro) {
    const codigo = erro instanceof Error ? erro.message : '';
    if (codigo === 'trilha-incompleta')
      return NextResponse.json(
        { erro: 'Conclua e sincronize todos os exercícios desta trilha antes de emitir.' },
        { status: 409, headers },
      );
    if (codigo === 'nome-invalido' || codigo === 'trilha-invalida')
      return NextResponse.json(
        { erro: 'Confira a trilha e informe um nome entre 2 e 100 caracteres.' },
        { status: 400, headers },
      );
    return NextResponse.json({ erro: 'Não foi possível emitir agora. Tente novamente.' }, { status: 503, headers });
  }
}
