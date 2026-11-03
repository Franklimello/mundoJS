import type { ReactNode } from 'react';

/**
 * Texto de lição com formatação simples no meio da frase:
 * `código`, **negrito** e *itálico*.
 *
 * O `split` com grupo de captura devolve os pedaços alternados: os de posição
 * ímpar são os marcados. Como o código vem primeiro na expressão, um `*` dentro
 * de `` `a * b` `` nunca é confundido com itálico.
 */
const MARCAS = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

export function Texto({ children }: { children: string }): ReactNode {
  const pedacos = children.split(MARCAS);
  return pedacos.map((pedaco, indice) => {
    if (indice % 2 === 0) return pedaco;
    if (pedaco.startsWith('`')) return <code key={indice}>{pedaco.slice(1, -1)}</code>;
    if (pedaco.startsWith('**')) return <strong key={indice}>{pedaco.slice(2, -2)}</strong>;
    return <em key={indice}>{pedaco.slice(1, -1)}</em>;
  });
}
