/**
 * Contratos do motor que roda o código do aluno.
 *
 * Tudo aqui é serializável (só texto, números e listas): o código roda dentro
 * de um iframe isolado e conversa com a página por `postMessage`.
 */

export type TipoLinha = 'log' | 'info' | 'aviso' | 'erro';

export interface LinhaSaida {
  tipo: TipoLinha;
  texto: string;
}

export interface ErroExecucao {
  /** Nome técnico do erro, como `ReferenceError`. */
  nome: string;
  /** Mensagem já em português, pensada para quem está começando. */
  mensagem: string;
  /** Um próximo passo concreto, quando existe. */
  dica?: string;
  /** Exemplo independente da solução do exercício, mostrado só quando solicitado. */
  exemplo?: { codigo: string; explicacao: string };
  /** Linha do código do aluno onde o erro apareceu (a primeira linha é 1). */
  linha?: number;
  coluna?: number;
}

/** Um teste escrito pelo autor da lição; `codigo` roda junto do código do aluno. */
export interface TesteDefinicao {
  descricao: string;
  codigo: string;
}

export interface ResultadoTeste {
  descricao: string;
  passou: boolean;
  mensagem?: string;
}

export interface ResultadoExecucao {
  saida: LinhaSaida[];
  erro: ErroExecucao | null;
  testes: ResultadoTeste[];
  duracaoMs: number;
}

/** O que a página entrega ao executor, depois de analisar o código. */
export interface PedidoBruto {
  /** Código do aluno já com a proteção contra laço infinito. */
  codigo: string;
  /** Código original, que os testes podem consultar. */
  codigoOriginal: string;
  /** Nomes declarados no nível de cima, que os testes enxergam. */
  nomes: string[];
  testes: TesteDefinicao[];
  /** Quanto tempo esperar por `setTimeout`/`setInterval` antes de encerrar. */
  esperaMaximaMs: number;
  /** Quantas voltas de laço valem antes de considerar laço infinito. */
  limiteDeVoltas: number;
  /** Quanto cada teste espera a resposta do código do aluno. Padrão: 2 segundos. */
  limiteDoTesteMs?: number;
  /** Quanto todos os testes juntos podem esperar. Padrão: 6 segundos. */
  orcamentoDosTestesMs?: number;
}

export interface ErroBruto {
  nome: string;
  mensagem: string;
  linha?: number;
  coluna?: number;
}

export interface TesteBruto {
  descricao: string;
  passou: boolean;
  /** Verdadeiro quando o teste falhou por uma comparação (`igual`, `verdadeiro`). */
  falhaDeComparacao: boolean;
  erro?: ErroBruto;
  mensagem?: string;
}

/** O que o executor devolve, antes de traduzir as mensagens. */
export interface ResultadoBruto {
  saida: LinhaSaida[];
  erro: ErroBruto | null;
  testes: TesteBruto[];
  duracaoMs: number;
}
