import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { reservarPergunta } from '@/servidor/limites-tutor';
import { ErroTutor, responderTutor, validarPedidoTutor } from '@/servidor/tutor';
import { visitante } from '@/servidor/visitante';
import { historicoDoTutor } from '@/servidor/historico-tutor';
import { reservarFranquia } from '@/servidor/franquia-tutor';
import { podeAcessarContexto } from '@/servidor/acesso-conteudo';

export const runtime = 'nodejs';
export const maxDuration = 40;
const headers = { 'Cache-Control': 'private, no-store' };

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ erro: 'Origem não permitida.' }, { status: 403, headers });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({ erro: 'Envie JSON.' }, { status: 415, headers });
  }
  let dados: unknown;
  try {
    const leitor = request.body?.getReader();
    if (!leitor) throw new Error('Corpo vazio');
    const partes: Uint8Array[] = [];
    let tamanho = 0;
    while (true) {
      const { done, value } = await leitor.read();
      if (done) break;
      tamanho += value.byteLength;
      if (tamanho > 160000) {
        await leitor.cancel();
        return NextResponse.json(
          { erro: 'A conversa ficou muito grande. Comece uma nova conversa.' },
          { status: 413, headers },
        );
      }
      partes.push(value);
    }
    dados = JSON.parse(Buffer.concat(partes).toString('utf8'));
  } catch {
    return NextResponse.json({ erro: 'Não foi possível ler sua pergunta.' }, { status: 400, headers });
  }
  if (!validarPedidoTutor(dados)) {
    return NextResponse.json(
      {
        erro: 'Confira sua pergunta e o exercício selecionado. Use até 2.000 caracteres na pergunta e 20.000 no código.',
      },
      { status: 400, headers },
    );
  }
  if (!process.env.GEMINI_API_KEY?.trim()) {
    return NextResponse.json(
      { erro: 'O tutor está indisponível no momento. Você pode continuar estudando e tentar depois.' },
      { status: 503, headers },
    );
  }
  try {
    const db = banco();
    const identidade = await visitante();
    if (!(await podeAcessarContexto(db, identidade, dados.contexto))) {
      return NextResponse.json(
        { erro: 'Esta trilha ou projeto faz parte do Pro. Conheça os planos para continuar.' },
        { status: 403, headers },
      );
    }
    await reservarPergunta(db, identidade);
    const devolver = await reservarFranquia(db, identidade);
    let resposta: string;
    // A ausência do histórico não impede uma ajuda contextual sobre o exercício atual.
    const historico = await historicoDoTutor(db, identidade, dados.contexto).catch(() => null);
    try {
      resposta = await responderTutor(dados, request.signal, historico);
    } catch (erro) {
      await devolver();
      throw erro;
    }
    return NextResponse.json(
      {
        resposta,
        apoio: { nivel: dados.nivelAjuda ?? 'pista', historico },
      },
      { headers },
    );
  } catch (erro) {
    if (erro instanceof ErroTutor) {
      return NextResponse.json(
        { erro: erro.message },
        { status: erro.status, headers: { ...headers, ...(erro.status === 429 ? { 'Retry-After': '60' } : {}) } },
      );
    }
    // Não registra perguntas, código nem credenciais no log.
    console.error('Falha no tutor MundoJS. Verifique o banco e a configuração do serviço.');
    return NextResponse.json(
      { erro: 'Não foi possível acessar o tutor. Tente novamente em instantes.' },
      { status: 503, headers },
    );
  }
}
