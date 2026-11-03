import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { carregarDados, salvarProgresso, salvarRascunho } from '@/servidor/persistencia';
import { filtrarProgressoLegado, progressoValido, rascunhoValido } from '@/servidor/validacao';
import { visitante } from '@/servidor/visitante';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store' };

function falha(erro: unknown) {
  console.error('Falha na persistência do MundoJS:', erro);
  return NextResponse.json({ erro: 'Não foi possível acessar seus dados. Tente novamente.' }, { status: 503, headers });
}

export async function GET() {
  try {
    const identidade = await visitante();
    return NextResponse.json({ ...(await carregarDados(banco(), identidade)), identidade }, { headers });
  } catch (erro) {
    return falha(erro);
  }
}

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ erro: 'Origem não permitida.' }, { status: 403, headers });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({ erro: 'Envie JSON.' }, { status: 415, headers });
  }
  let dados;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) throw new Error('Corpo vazio');
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 1000000) {
        await leitor.cancel();
        return NextResponse.json({ erro: 'Conteúdo muito grande.' }, { status: 413, headers });
      }
      partes.push(value);
    }
    dados = JSON.parse(Buffer.concat(partes).toString('utf8')) as Record<string, unknown> | null;
  } catch {
    return NextResponse.json({ erro: 'JSON inválido.' }, { status: 400, headers });
  }
  const ehProgresso = dados?.tipo === 'progresso' && progressoValido(dados.progresso);
  const ehRascunho = dados?.tipo === 'rascunho' && rascunhoValido(dados.chave, dados.codigo);
  const ehImportacao = dados?.tipo === 'importar-progresso' || dados?.tipo === 'importar-rascunho';
  if (dados?.tipo === 'importar-rascunho' && !rascunhoValido(dados.chave, dados.codigo)) {
    return NextResponse.json({ importado: false }, { headers });
  }
  if (!ehProgresso && !ehRascunho && !ehImportacao) {
    return NextResponse.json({ erro: 'Dados inválidos.' }, { status: 400, headers });
  }
  try {
    const id = await visitante();
    if (dados?.identidadeEsperada !== id) {
      return NextResponse.json(
        { erro: 'Sua sessão mudou. Recarregue a página antes de salvar.' },
        { status: 409, headers },
      );
    }
    if (dados?.tipo === 'importar-progresso') {
      await salvarProgresso(banco(), id, filtrarProgressoLegado(dados.progresso));
    } else if (
      dados?.tipo === 'importar-rascunho' &&
      rascunhoValido(dados.chave, dados.codigo) &&
      typeof dados.codigo === 'string'
    ) {
      await banco().query(
        'INSERT INTO rascunhos (visitante, chave, codigo) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [id, dados.chave, dados.codigo],
      );
    }
    if (dados?.tipo === 'progresso' && progressoValido(dados.progresso)) {
      await salvarProgresso(banco(), id, dados.progresso);
    } else if (dados?.tipo === 'rascunho' && rascunhoValido(dados.chave, dados.codigo)) {
      await salvarRascunho(banco(), id, dados.chave, dados.codigo as string | null);
    }
    return NextResponse.json({ salvo: true }, { headers });
  } catch (erro) {
    return falha(erro);
  }
}
