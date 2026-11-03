import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { sessaoAtual, identidadeConta } from './sessao';

export function hashVisitante(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function tokenVisitanteValido(token: string | undefined): token is string {
  return Boolean(token && /^[a-f0-9]{64}$/.test(token));
}

export async function renovarVisitante(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  (await cookies()).set('rabisco_visitante', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  return token;
}

/** O cookie é uma credencial aleatória; apenas seu hash chega ao banco. */
export async function visitante(): Promise<string> {
  const sessao = await sessaoAtual();
  if (sessao) return identidadeConta(sessao.user.id);
  const jar = await cookies();
  let token = jar.get('rabisco_visitante')?.value;
  if (!tokenVisitanteValido(token)) token = await renovarVisitante();
  return hashVisitante(token);
}
