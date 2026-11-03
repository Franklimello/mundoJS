import { betterAuth } from 'better-auth';
import { after } from 'next/server';
import { banco } from './banco';
import { enviarEmailConta } from './email';
import { firebaseGoogle } from './firebase-google';

function agendarEmail(email: string, assunto: string, texto: string) {
  after(async () => {
    try {
      await enviarEmailConta(email, assunto, texto);
    } catch {
      console.error('Falha ao enviar e-mail da conta MundoJS. Verifique o SMTP.');
    }
  });
}

const segredo = process.env.BETTER_AUTH_SECRET;
if (!segredo || segredo.length < 32)
  throw new Error(
    'Configure BETTER_AUTH_SECRET com pelo menos 32 caracteres. Execute pnpm conta:setup no ambiente local.',
  );

export const auth = betterAuth({
  appName: 'MundoJS',
  baseURL: process.env.BETTER_AUTH_URL,
  secret: segredo,
  database: banco(),
  user: { modelName: 'auth_usuario' },
  account: { modelName: 'auth_credencial', accountLinking: { enabled: true, requireLocalEmailVerified: true } },
  plugins: [firebaseGoogle(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mundojs-8787c')],
  verification: { modelName: 'auth_verificacao' },
  session: {
    modelName: 'auth_sessao',
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: false },
  },
  advanced: { cookiePrefix: 'mundojs' },
  rateLimit: {
    enabled: true,
    storage: 'database',
    modelName: 'auth_limite',
    window: 60,
    max: 60,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-in/social': { window: 60, max: 10 },
      '/sign-up/email': { window: 3600, max: 5 },
      '/request-password-reset': { window: 3600, max: 5 },
      '/send-verification-email': { window: 3600, max: 5 },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      agendarEmail(
        user.email,
        'Redefina sua senha no MundoJS',
        `Você pediu para redefinir sua senha no MundoJS.\n\nAbra este link para escolher uma nova senha:\n${url}\n\nSe não foi você, ignore esta mensagem.`,
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      agendarEmail(
        user.email,
        'Confirme seu e-mail no MundoJS',
        `Confirme este e-mail para salvar seu progresso no MundoJS.\n\n${url}\n\nSe não foi você, ignore esta mensagem.`,
      );
    },
  },
});
