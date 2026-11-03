import { NextResponse } from 'next/server';
import { catalogoProjetos } from '@/projetos/catalogo';
import { banco } from '@/servidor/banco';
import { sessaoAtual, identidadeConta } from '@/servidor/sessao';
import { publicacaoDoProjeto, publicarProjeto, retirarProjeto } from '@/servidor/projetos';
import { lerAssinatura } from '@/servidor/cobranca';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'private, no-store' };
const valida = (slug: unknown): slug is string =>
  typeof slug === 'string' && catalogoProjetos.some((projeto) => projeto.trilha === slug);
function falha() {
  return NextResponse.json(
    { erro: 'Não foi possível acessar o compartilhamento. Tente novamente.' },
    { status: 503, headers },
  );
}

export async function GET(request: Request) {
  const trilha = new URL(request.url).searchParams.get('trilha');
  if (!valida(trilha)) return NextResponse.json({ erro: 'Projeto não encontrado.' }, { status: 400, headers });
  try {
    const sessao = await sessaoAtual();
    if (!sessao) return NextResponse.json({ erro: 'Entre na sua conta para compartilhar.' }, { status: 401, headers });
    if (request.headers.get('X-MundoJS-Conta') !== sessao.user.id)
      return NextResponse.json({ erro: 'Sua sessão mudou. Recarregue o projeto.' }, { status: 409, headers });
    return NextResponse.json({ publicacao: await publicacaoDoProjeto(banco(), sessao.user.id, trilha) }, { headers });
  } catch {
    return falha();
  }
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return NextResponse.json({ erro: 'Origem não permitida.' }, { status: 403, headers });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return NextResponse.json({ erro: 'Envie JSON.' }, { status: 415, headers });
  let dados: { trilha?: unknown; codigo?: unknown; acao?: unknown; identidadeEsperada?: unknown } | null;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) throw new Error('Sem dados');
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 1300000) {
        await leitor.cancel();
        return NextResponse.json({ erro: 'Código muito grande para compartilhar.' }, { status: 413, headers });
      }
      partes.push(value);
    }
    dados = JSON.parse(Buffer.concat(partes).toString('utf8'));
  } catch {
    return NextResponse.json({ erro: 'Não foi possível ler o projeto.' }, { status: 400, headers });
  }
  if (
    !valida(dados?.trilha) ||
    !['publicar', 'retirar'].includes(String(dados?.acao)) ||
    typeof dados?.acao !== 'string' ||
    (dados.acao === 'publicar' &&
      (typeof dados.codigo !== 'string' || !dados.codigo.trim() || Buffer.byteLength(dados.codigo, 'utf8') > 200000))
  )
    return NextResponse.json({ erro: 'Confira o projeto e use até 200 KB de código.' }, { status: 400, headers });
  try {
    const sessao = await sessaoAtual();
    if (!sessao) return NextResponse.json({ erro: 'Entre na sua conta para compartilhar.' }, { status: 401, headers });
    if (dados.identidadeEsperada !== identidadeConta(sessao.user.id))
      return NextResponse.json(
        { erro: 'Sua sessão mudou. Recarregue o projeto antes de compartilhar.' },
        { status: 409, headers },
      );
    if (dados.acao === 'retirar') {
      await retirarProjeto(banco(), sessao.user.id, dados.trilha);
      return NextResponse.json({ publicacao: null }, { headers });
    }
    if (!(await lerAssinatura(banco(), sessao.user.id)).pro)
      return NextResponse.json(
        { erro: 'Publicar projetos faz parte do Pro. Seu rascunho continua salvo.' },
        { status: 403, headers },
      );
    return NextResponse.json(
      { publicacao: await publicarProjeto(banco(), sessao.user.id, dados.trilha, dados.codigo as string) },
      { headers },
    );
  } catch {
    return falha();
  }
}
