import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { banco } from '@/servidor/banco';
import { sessaoAtual } from '@/servidor/sessao';
import { vincularProgresso } from '@/servidor/vincular-progresso';
import { hashVisitante, renovarVisitante, tokenVisitanteValido } from '@/servidor/visitante';

const headers = { 'Cache-Control': 'private, no-store' };
export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin)
    return new NextResponse(null, { status: 403, headers });
  try {
    const sessao = await sessaoAtual();
    if (!sessao || !sessao.user.emailVerified) return new NextResponse(null, { status: 401, headers });
    if (request.headers.get('x-mundojs-conta') !== sessao.user.id)
      return NextResponse.json(
        { erro: 'Sua sessão mudou. Recarregue a página para continuar.' },
        { status: 409, headers },
      );
    const token = (await cookies()).get('rabisco_visitante')?.value;
    let incorporados = false;
    if (tokenVisitanteValido(token)) {
      incorporados = await vincularProgresso(banco(), hashVisitante(token), sessao.user.id);
      await renovarVisitante();
    }
    const arquivados = await banco().query(
      'SELECT count(*)::int AS total FROM conta_rascunhos_arquivados WHERE usuario_id = $1',
      [sessao.user.id],
    );
    return NextResponse.json({ salvo: true, incorporados, arquivados: arquivados.rows[0].total }, { headers });
  } catch {
    return NextResponse.json(
      { erro: 'Não foi possível incorporar o progresso deste navegador. Tente novamente antes de sair.' },
      { status: 503, headers },
    );
  }
}
