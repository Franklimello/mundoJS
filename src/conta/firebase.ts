'use client';

import { getApps, initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  inMemoryPersistence,
  initializeAuth,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';

let autenticacao: Auth | undefined;

function authFirebase(): Auth {
  if (autenticacao) return autenticacao;
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId)
    throw new Error('firebase-nao-configurado');
  const app = getApps().find((app) => app.name === 'mundojs-google') ?? initializeApp(config, 'mundojs-google');
  autenticacao = initializeAuth(app, {
    persistence: inMemoryPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
  });
  return autenticacao;
}

/** O token fica somente em memória e é entregue ao servidor para criar a sessão HttpOnly. */
export async function entrarGoogleFirebase(): Promise<void> {
  const firebase = authFirebase();
  const provedor = new GoogleAuthProvider();
  provedor.setCustomParameters({ prompt: 'select_account' });
  try {
    const resultado = await signInWithPopup(firebase, provedor);
    const token = await resultado.user.getIdToken(true);
    const resposta = await fetch('/api/auth/sign-in/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'firebase-google', idToken: { token }, callbackURL: '/conta' }),
      signal: AbortSignal.timeout(20000),
    });
    if (!resposta.ok) {
      const erro = (await resposta.json().catch(() => null)) as { code?: string } | null;
      if (erro?.code === 'OAUTH_LINK_ERROR') throw new Error('firebase-conta-nao-vinculada');
      if (resposta.status === 429) throw new Error('firebase-muitas-tentativas');
      throw new Error('firebase-sessao-recusada');
    }
  } finally {
    await signOut(firebase).catch(() => {});
  }
}

export function mensagemErroGoogle(erro: unknown): string {
  const codigo =
    erro && typeof erro === 'object' && 'code' in erro ? String(erro.code) : erro instanceof Error ? erro.message : '';
  switch (codigo) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Você fechou a entrada com Google. Pode tentar novamente quando quiser.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela do Google. Permita pop-ups para este site e tente novamente.';
    case 'auth/unauthorized-domain':
      return 'A entrada com Google ainda não está disponível neste endereço. Você pode entrar com e-mail e senha.';
    case 'auth/operation-not-allowed':
    case 'firebase-nao-configurado':
      return 'A entrada com Google está indisponível no momento. Você pode entrar com e-mail e senha.';
    case 'firebase-conta-nao-vinculada':
      return 'Já existe uma conta com esse e-mail. Confirme o e-mail da conta existente e tente novamente, ou entre com sua senha.';
    case 'auth/too-many-requests':
    case 'firebase-muitas-tentativas':
      return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
    case 'auth/network-request-failed':
      return 'Não foi possível conectar ao Google. Confira sua conexão e tente novamente.';
    default:
      return 'Não foi possível entrar com Google. Tente novamente ou use e-mail e senha.';
  }
}
