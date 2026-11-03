import { banco } from '@/servidor/banco';
import { sessaoAtual } from '@/servidor/sessao';
import { lerCertificado } from '@/servidor/certificados';
import { gerarPdfCertificado } from '@/servidor/certificado-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' };
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessao = await sessaoAtual();
    if (!sessao?.user.emailVerified) return new Response(null, { status: 401, headers });
    const certificado = await lerCertificado(banco(), sessao.user.id, (await params).id);
    if (!certificado) return new Response(null, { status: 404, headers });
    const pdf = await gerarPdfCertificado(certificado);
    return new Response(new Uint8Array(pdf), {
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="mundojs-certificado-${certificado.trilha}.pdf"`,
      },
    });
  } catch {
    return Response.json({ erro: 'Não foi possível gerar o PDF agora. Tente novamente.' }, { status: 503, headers });
  }
}
