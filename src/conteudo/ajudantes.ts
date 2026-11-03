/** Junta linhas de código: deixa o conteúdo das lições legível no arquivo. */
export function linhas(...partes: string[]): string {
  return partes.join('\n');
}

/**
 * Escreve o código de um teste sem precisar dobrar as barras invertidas das
 * expressões regulares: js`/\s+/` vale como o texto `/\s+/`.
 * Não use `${}` dentro: ele seria trocado antes de o teste existir.
 */
export const js = String.raw;
