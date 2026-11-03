import { headers } from 'next/headers';
import { auth } from './auth';

export async function sessaoAtual() {
  return auth.api.getSession({ headers: await headers() });
}

export function identidadeConta(usuarioId: string): string {
  return `conta:${usuarioId}`;
}
