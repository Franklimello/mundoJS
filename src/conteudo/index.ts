import { errosEAssincrono } from './trilhas/erros-e-assincrono';
import { javascriptDoZero } from './trilhas/javascript-do-zero';
import { listasEObjetos } from './trilhas/listas-e-objetos';
import { listasETextosDeVerdade } from './trilhas/listas-e-textos-de-verdade';
import type { Licao, Modulo, Trilha } from './tipos';

/** Na ordem em que aparecem no site. Para criar uma trilha nova, acrescente aqui. */
export const trilhas: Trilha[] = [javascriptDoZero, listasEObjetos, listasETextosDeVerdade, errosEAssincrono];

export interface LicaoNaTrilha {
  trilha: Trilha;
  modulo: Modulo;
  licao: Licao;
  /** Posição da lição na trilha inteira, a partir de 1. */
  numero: number;
  anterior: { trilha: Trilha; licao: Licao } | null;
  proxima: { trilha: Trilha; licao: Licao } | null;
}

export function todasAsLicoes(trilha: Trilha): Licao[] {
  return trilha.modulos.flatMap((modulo) => modulo.licoes);
}

export function buscarTrilha(slug: string): Trilha | undefined {
  return trilhas.find((trilha) => trilha.slug === slug);
}

export function buscarLicao(trilhaSlug: string, licaoSlug: string): LicaoNaTrilha | undefined {
  const trilha = buscarTrilha(trilhaSlug);
  if (!trilha) return undefined;
  const licoes = todasAsLicoes(trilha);
  const indice = licoes.findIndex((licao) => licao.slug === licaoSlug);
  const licao = licoes[indice];
  if (!licao) return undefined;
  const modulo = trilha.modulos.find((m) => m.licoes.includes(licao));
  if (!modulo) return undefined;
  const anterior = licoes[indice - 1];
  const proxima = licoes[indice + 1];
  return {
    trilha,
    modulo,
    licao,
    numero: indice + 1,
    anterior: anterior ? { trilha, licao: anterior } : null,
    proxima: proxima ? { trilha, licao: proxima } : null,
  };
}

/** Para cada lição de cada trilha: os endereços que o Next precisa gerar. */
export function todosOsCaminhos(): Array<{ trilha: string; licao: string }> {
  return trilhas.flatMap((trilha) =>
    todasAsLicoes(trilha).map((licao) => ({ trilha: trilha.slug, licao: licao.slug })),
  );
}
