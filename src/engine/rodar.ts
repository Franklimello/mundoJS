import { analisar } from './analisar';
import { traduzirErroDeExecucao } from './mensagens';
import type {
  PedidoBruto,
  ResultadoBruto,
  ResultadoExecucao,
  ResultadoTeste,
  TesteBruto,
  TesteDefinicao,
} from './tipos';

/** Quantas voltas de laço valem antes de achar que é um laço infinito. */
export const LIMITE_DE_VOLTAS = 5_000_000;
/** Quanto esperar por `setTimeout` e `setInterval` antes de encerrar o programa. */
export const ESPERA_MAXIMA_MS = 3_000;

/** Quem de fato executa: o iframe isolado no navegador, ou o executor direto nos testes. */
export type ExecutarBruto = (pedido: PedidoBruto) => Promise<ResultadoBruto>;

function traduzirTeste(teste: TesteBruto): ResultadoTeste {
  if (teste.passou) return { descricao: teste.descricao, passou: true };
  if (teste.falhaDeComparacao) {
    return { descricao: teste.descricao, passou: false, ...(teste.mensagem && { mensagem: teste.mensagem }) };
  }
  const erro = teste.erro;
  if (!erro) return { descricao: teste.descricao, passou: false };

  // Um teste que usa um nome que o aluno ainda não criou: o recado certo é
  // "crie isto", não "x is not defined".
  const semNome = erro.nome === 'ReferenceError' ? /^(\w+) is not defined$/.exec(erro.mensagem) : null;
  if (semNome) {
    return {
      descricao: teste.descricao,
      passou: false,
      mensagem: `Seu código ainda não tem “${semNome[1]}”. Crie e confira de novo.`,
    };
  }
  const traduzido = traduzirErroDeExecucao({ nome: erro.nome, mensagem: erro.mensagem });
  return {
    descricao: teste.descricao,
    passou: false,
    mensagem: `Ao testar, seu código deu erro: ${traduzido.mensagem}${traduzido.dica ? ` ${traduzido.dica}` : ''}`,
  };
}

export function finalizar(bruto: ResultadoBruto): ResultadoExecucao {
  return {
    saida: bruto.saida,
    erro: bruto.erro ? traduzirErroDeExecucao(bruto.erro) : null,
    testes: bruto.testes.map(traduzirTeste),
    duracaoMs: bruto.duracaoMs,
    ...(bruto.investigacoes?.length && { investigacoes: bruto.investigacoes }),
    ...(bruto.investigacoesObjetos?.length && { investigacoesObjetos: bruto.investigacoesObjetos }),
  };
}

/**
 * Analisa, executa e traduz.
 *
 * Um erro de escrita (aspas sem fechar, parêntese esquecido) é devolvido sem
 * rodar nada: o aluno vê a linha exata em vez de uma mensagem do navegador.
 */
export async function rodar(
  codigo: string,
  testes: TesteDefinicao[],
  executar: ExecutarBruto,
  opcoes: {
    esperaMaximaMs?: number;
    limiteDeVoltas?: number;
    limiteDoTesteMs?: number;
    orcamentoDosTestesMs?: number;
  } = {},
): Promise<ResultadoExecucao> {
  const analise = analisar(codigo);
  if (!analise.ok) {
    return {
      saida: [],
      erro: analise.erro,
      testes: testes.map((teste) => ({
        descricao: teste.descricao,
        passou: false,
        mensagem: 'Seu código tem um erro de escrita. Corrija-o e confira de novo.',
      })),
      duracaoMs: 0,
    };
  }

  const bruto = await executar({
    codigo: analise.codigo,
    codigoOriginal: codigo,
    nomes: analise.nomes,
    ...(analise.investigador && { investigador: analise.investigador }),
    testes,
    esperaMaximaMs: opcoes.esperaMaximaMs ?? ESPERA_MAXIMA_MS,
    limiteDeVoltas: opcoes.limiteDeVoltas ?? LIMITE_DE_VOLTAS,
    ...(opcoes.limiteDoTesteMs !== undefined && { limiteDoTesteMs: opcoes.limiteDoTesteMs }),
    ...(opcoes.orcamentoDosTestesMs !== undefined && { orcamentoDosTestesMs: opcoes.orcamentoDosTestesMs }),
  });
  return finalizar(bruto);
}
