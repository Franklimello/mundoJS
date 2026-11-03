import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { visitante } from '@/servidor/visitante';
import { cobrancaConfigurada, lerAssinatura } from '@/servidor/cobranca';
import { usoTutor } from '@/servidor/franquia-tutor';
import { headersCobranca } from '@/servidor/api-cobranca';
export const runtime = 'nodejs';
export async function GET() {
  try {
    const identidade = await visitante();
    const db = banco();
    const assinatura = identidade.startsWith('conta:') ? await lerAssinatura(db, identidade.slice(6)) : null;
    return NextResponse.json(
      { uso: await usoTutor(db, identidade), assinatura, disponivel: cobrancaConfigurada() },
      { headers: headersCobranca },
    );
  } catch {
    return NextResponse.json(
      { erro: 'Não foi possível consultar seu plano. Tente novamente.' },
      { status: 503, headers: headersCobranca },
    );
  }
}
