import type { TesteDefinicao } from '@/engine/tipos';

/**
 * O formato de uma lição.
 *
 * É só dado (texto, listas), sem funções nem JSX: hoje as lições moram em
 * arquivos TypeScript, mas o mesmo formato cabe num banco de dados ou num CMS
 * no dia em que um professor quiser escrever lições sem mexer no código.
 */

/** Um pedaço do texto de uma lição. */
export type Bloco =
  /** Parágrafo. Aceita `código`, **negrito** e *itálico* no meio do texto. */
  | { tipo: 'p'; texto: string }
  /** Exemplo de código; `saida` é o que ele mostra quando roda. */
  | { tipo: 'codigo'; codigo: string; saida?: string }
  | { tipo: 'lista'; itens: string[] }
  /** Um aviso à margem. `cuidado` é para o erro que todo mundo comete. */
  | { tipo: 'nota'; texto: string; tom?: 'cuidado' };

export interface Exercicio {
  /** Um nome curto, mostrado quando a lição tem mais de um exercício. */
  titulo?: string;
  enunciado: Bloco[];
  /** Orientação opcional para a narração, sem entregar a solução. */
  explicacaoAudio?: string;
  /** O que aparece no editor quando o aluno abre a lição. */
  codigoInicial: string;
  /**
   * Cada teste roda junto do código do aluno, dentro do iframe isolado. Ele
   * enxerga os nomes que o aluno declarou e estes ajudantes: `igual`,
   * `verdadeiro`, `saida` (as linhas impressas) e `codigoDoAluno` (o texto).
   */
  testes: TesteDefinicao[];
  /** Da mais leve para a mais direta. */
  dicas: string[];
  /** Uma solução de referência. Os testes da lição são validados contra ela. */
  solucao: string;
}

export interface Licao {
  slug: string;
  titulo: string;
  /** Uma frase, usada no índice. */
  resumo: string;
  conteudo: Bloco[];
  /**
   * Da mais simples para a mais difícil. A lição só conta como concluída
   * quando todos os exercícios estiverem certos. Pelo menos um.
   */
  exercicios: Exercicio[];
}

export interface Modulo {
  titulo: string;
  licoes: Licao[];
}

export interface Trilha {
  slug: string;
  titulo: string;
  descricao: string;
  modulos: Modulo[];
}
