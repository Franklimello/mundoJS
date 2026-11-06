import { arrays } from './topicos/arrays';
import { lacos } from './topicos/lacos';
import { objetos } from './topicos/objetos';
import { regex } from './topicos/regex';
import { strings } from './topicos/strings';
import type { TopicoDoc } from './tipos';

/** Na ordem em que aparecem no site. Para documentar um tópico novo, acrescente aqui. */
export const topicos: TopicoDoc[] = [strings, arrays, objetos, lacos, regex];

export function buscarTopico(slug: string): TopicoDoc | undefined {
  return topicos.find((topico) => topico.slug === slug);
}

export function contarMetodos(topico: TopicoDoc): number {
  return topico.secoes.reduce((total, secao) => total + secao.metodos.length, 0);
}

export function chaveDoTreino(topico: string, metodo: string): string {
  return `doc/${topico}/${metodo}`;
}
