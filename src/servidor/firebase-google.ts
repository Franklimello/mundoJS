import type { BetterAuthPlugin } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import type { OAuthProvider } from 'better-auth/oauth2';
import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey, type JWTPayload } from 'jose';

// Chaves públicas oficiais do emissor Firebase Secure Token; nenhuma chave administrativa é necessária.
const chavesGoogle = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
  { timeoutDuration: 5000 },
);

export async function verificarGoogleFirebase(
  token: string,
  projeto: string,
  chaves: JWTVerifyGetKey = chavesGoogle,
): Promise<JWTPayload> {
  if (!projeto || token.length > 16384) throw new Error('Token Firebase inválido.');
  const { payload } = await jwtVerify(token, chaves, {
    issuer: `https://securetoken.google.com/${projeto}`,
    audience: projeto,
    algorithms: ['RS256'],
    requiredClaims: ['sub', 'iat', 'exp', 'auth_time', 'email', 'email_verified', 'firebase'],
    maxTokenAge: '5m',
    clockTolerance: 30,
  });
  const agora = Math.floor(Date.now() / 1000);
  const firebase = payload.firebase as { sign_in_provider?: unknown } | undefined;
  if (
    typeof payload.sub !== 'string' ||
    !payload.sub ||
    payload.sub.length > 128 ||
    typeof payload.auth_time !== 'number' ||
    payload.auth_time > agora + 30 ||
    payload.auth_time < agora - 300 ||
    payload.email_verified !== true ||
    firebase?.sign_in_provider !== 'google.com' ||
    typeof payload.email !== 'string' ||
    payload.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  ) {
    throw new Error('Identidade Google inválida.');
  }
  return payload;
}

export function criarProvedorGoogleFirebase(
  projeto: string,
  chaves: JWTVerifyGetKey = chavesGoogle,
): OAuthProvider<JWTPayload> {
  const verificar = (token: string) => verificarGoogleFirebase(token, projeto, chaves);
  return {
    id: 'firebase-google',
    name: 'Google via Firebase',
    accountSubject: ({ profile }) => profile.sub || '',
    idToken: {
      verify: async (token) => {
        try {
          await verificar(token);
          return true;
        } catch {
          return false;
        }
      },
    },
    // A autorização é feita exclusivamente pelo SDK Firebase no navegador.
    createAuthorizationURL: async () => {
      throw new Error('Use o botão Google do MundoJS.');
    },
    validateAuthorizationCode: async () => null,
    getUserInfo: async (tokens) => {
      if (!tokens.idToken) return null;
      try {
        const perfil = await verificar(tokens.idToken);
        return {
          user: {
            name: typeof perfil.name === 'string' ? perfil.name.slice(0, 100) : 'Estudante',
            email: String(perfil.email).toLowerCase(),
            emailVerified: true,
          },
          data: perfil,
        };
      } catch {
        return null;
      }
    },
  };
}

export function firebaseGoogle(projeto: string, chaves: JWTVerifyGetKey = chavesGoogle): BetterAuthPlugin {
  return {
    id: 'firebase-google',
    hooks: {
      before: [
        {
          matcher: (contexto) => contexto.path === '/sign-in/social' && contexto.body?.provider === 'firebase-google',
          handler: createAuthMiddleware(async (contexto) => {
            // O fluxo por ID token do Better Auth dispensa a checagem de origem padrão.
            // Neste site só aceitamos a troca iniciada na própria origem do MundoJS.
            if (contexto.headers?.get('origin') !== new URL(contexto.context.baseURL).origin)
              throw new APIError('FORBIDDEN', { message: 'Origem de autenticação inválida.' });
            if (typeof contexto.body?.idToken?.token !== 'string')
              throw new APIError('BAD_REQUEST', { message: 'Identidade Google ausente.' });
          }),
        },
      ],
    },
    init: (contexto) => ({
      context: { socialProviders: [criarProvedorGoogleFirebase(projeto, chaves), ...contexto.socialProviders] },
    }),
  };
}
