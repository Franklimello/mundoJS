import type { Pool } from 'pg';
import { PERGUNTAS_GRATIS, PERGUNTAS_VISITANTE, PLANO_PRO, type UsoPlano } from '@/conta/planos';
import { lerAssinatura } from './cobranca';
import { ErroTutor } from './tutor';

async function periodo(db: Pool, identidade: string) {
  const agora = new Date();
  const conta = identidade.startsWith('conta:') ? await lerAssinatura(db, identidade.slice(6)) : null;
  if (conta?.pro && conta.inicio && conta.fim)
    return {
      plano: 'pro' as const,
      limite: PLANO_PRO.perguntas,
      chave: `pro:${conta.inicio.toISOString()}`,
      fim: conta.fim,
    };
  const inicio = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
  return {
    plano: 'gratuito' as const,
    limite: conta ? PERGUNTAS_GRATIS : PERGUNTAS_VISITANTE,
    chave: `mes:${inicio.toISOString()}`,
    fim: new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 1)),
  };
}

export async function usoTutor(db: Pool, identidade: string): Promise<UsoPlano> {
  const p = await periodo(db, identidade);
  const { rows } = await db.query<{ quantidade: number }>(
    'SELECT quantidade FROM tutor_franquias WHERE identidade=$1 AND periodo=$2',
    [identidade, p.chave],
  );
  const usadas = rows[0]?.quantidade ?? 0;
  return {
    plano: p.plano,
    limite: p.limite,
    usadas,
    restantes: Math.max(0, p.limite - usadas),
    renovaEm: p.fim.toISOString(),
  };
}

export async function reservarFranquia(db: Pool, identidade: string) {
  const p = await periodo(db, identidade);
  const { rowCount } = await db.query(
    `INSERT INTO tutor_franquias(identidade,periodo,quantidade) VALUES ($1,$2,1) ON CONFLICT (identidade,periodo) DO UPDATE SET quantidade=tutor_franquias.quantidade+1 WHERE tutor_franquias.quantidade < $3 RETURNING quantidade`,
    [identidade, p.chave, p.limite],
  );
  if (!rowCount)
    throw new ErroTutor(
      429,
      `Você usou as ${p.limite} perguntas deste período. Sua franquia renova em ${p.fim.toLocaleDateString('pt-BR', { timeZone: 'UTC' })}. Consulte seu plano para acompanhar o uso.`,
    );
  return async () => {
    await db.query(
      'UPDATE tutor_franquias SET quantidade=GREATEST(0,quantidade-1) WHERE identidade=$1 AND periodo=$2',
      [identidade, p.chave],
    );
  };
}
