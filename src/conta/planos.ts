export const PLANO_PRO = { centavos: 999, moeda: 'brl', perguntas: 100 } as const;
export const PERGUNTAS_GRATIS = 3;
export const PERGUNTAS_VISITANTE = 1;
export const TRILHA_GRATUITA = 'javascript-do-zero';

export function trilhaGratuita(slug: string) {
  return slug === TRILHA_GRATUITA;
}

export interface UsoPlano {
  plano: 'gratuito' | 'pro';
  limite: number;
  usadas: number;
  restantes: number;
  renovaEm: string;
}
