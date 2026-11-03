import { acaoCobranca } from '@/servidor/api-cobranca';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  return acaoCobranca(request, 'checkout');
}
