import type { Pool } from 'pg';
import type { ContextoTutor } from '@/tutor/tipos';
import { trilhaGratuita } from '@/conta/planos';
import { banco } from './banco';
import { lerAssinatura } from './cobranca';
import { sessaoAtual } from './sessao';

export async function temProAtual() {
  const sessao = await sessaoAtual();
  return sessao ? (await lerAssinatura(banco(), sessao.user.id)).pro : false;
}

/** A identidade vem da sessão/cookie validado pelo servidor, nunca do corpo do pedido. */
export async function podeAcessarContexto(db: Pool, identidade: string, contexto: ContextoTutor) {
  if ('livre' in contexto || ('trilha' in contexto && trilhaGratuita(contexto.trilha))) return true;
  if (!identidade.startsWith('conta:')) return false;
  return (await lerAssinatura(db, identidade.slice(6))).pro;
}
