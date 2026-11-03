import { headers } from 'next/headers';
import { auth } from './auth';

export async function sessaoAtual() {
  // A leitura no servidor não envia Set-Cookie ao navegador. A renovação fica
  // com /api/auth/get-session, chamado pelo useSession no cabeçalho do site.
  return auth.api.getSession({ headers: await headers(), query: { disableRefresh: true } });
}

export function identidadeConta(usuarioId: string): string {
  return `conta:${usuarioId}`;
}
