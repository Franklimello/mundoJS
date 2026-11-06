import type { TesteDefinicao } from '@/engine/tipos';

/**
 * O formato da documentação de referência.
 *
 * Assim como as lições, é só dado: um tópico (strings, arrays...) agrupa
 * seções, e cada seção lista métodos com descrição, sintaxe e exemplos. Os
 * exemplos são executados nos testes (documentacao.test.ts), então a `saida`
 * escrita aqui precisa ser exatamente o que o código mostra.
 */

export interface ExemploDoc {
  /** Código que roda sozinho, sem depender de outros exemplos. */
  codigo: string;
  /** As linhas que o `console.log` do exemplo mostra, separadas por `\n`. */
  saida: string;
}

export interface MetodoDoc {
  /** Usado como âncora na página: `/documentacao/strings#trim`. Minúsculas, números e hífen. */
  id: string;
  /** Como aparece no título, por exemplo `trim()`. */
  nome: string;
  /** Uma frase. Aceita `código`, **negrito** e *itálico*. */
  resumo: string;
  /** A forma de escrever, por exemplo `texto.trim()`. */
  sintaxe: string;
  /** O que o método devolve. Aceita a mesma formatação do resumo. */
  retorno: string;
  exemplos: ExemploDoc[];
  /** Um aviso opcional: a pegadinha mais comum. */
  cuidado?: string;
  /** O exercício do botão "Treine esse método". */
  treino: TreinoDoc;
}

/**
 * Um exercício curto para praticar o método. Os testes rodam junto do código
 * do aluno (com os ajudantes `igual`, `verdadeiro`, `saida` e
 * `codigoDoAluno`); a solução é validada contra eles em documentacao.test.ts.
 */
export interface TreinoDoc {
  /** Parágrafos do enunciado. Aceitam `código`, **negrito** e *itálico*. */
  enunciado: string[];
  /** O que aparece no editor. Não pode passar em nenhum teste. */
  codigoInicial: string;
  testes: TesteDefinicao[];
  /** Da mais leve para a mais direta. */
  dicas: string[];
  solucao: string;
}

export interface SecaoDoc {
  titulo: string;
  /** Uma frase de apoio, opcional. */
  descricao?: string;
  metodos: MetodoDoc[];
}

export interface TopicoDoc {
  slug: string;
  titulo: string;
  /** Uma frase, usada no índice da documentação e na descrição da página. */
  resumo: string;
  /** Parágrafos de abertura. Aceitam a mesma formatação do resumo. */
  introducao: string[];
  secoes: SecaoDoc[];
  /** Indica se o tópico é restrito a assinantes do plano Pro. */
  pro?: boolean;
}
