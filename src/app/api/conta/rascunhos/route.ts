import { NextResponse } from 'next/server';
import { banco } from '@/servidor/banco';
import { sessaoAtual } from '@/servidor/sessao';

export const runtime = 'nodejs';
export async function GET() {
  const sessao = await sessaoAtual();
  const headers = { 'Cache-Control': 'private, no-store' };
  if (!sessao) return new NextResponse(null, { status: 401, headers });
  const dados = await banco().query<{ chave: string; codigo: string; original_em: Date }>(
    'SELECT chave, codigo, original_em FROM conta_rascunhos_arquivados WHERE usuario_id = $1 ORDER BY original_em DESC',
    [sessao.user.id],
  );
  const texto = dados.rows
    .map((r) => `=== ${r.chave} — ${r.original_em.toISOString()} ===\n\n${r.codigo}`)
    .join('\n\n');
  return new NextResponse(texto || 'Não há rascunhos anteriores arquivados.', {
    headers: {
      ...headers,
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mundojs-rascunhos-anteriores.txt"',
    },
  });
}
