import { parse, type Node, type Token } from 'acorn';
import { traduzirErroDeSintaxe } from './mensagens';
import type { ErroExecucao } from './tipos';

/**
 * Lê o código do aluno antes de rodar.
 *
 * Faz três coisas:
 *  1. acha erros de escrita e diz a linha exata, em português;
 *  2. descobre os nomes declarados no nível de cima (variáveis, funções,
 *     classes), que os testes da lição precisam enxergar;
 *  3. põe um contador no começo de cada laço (`for`, `while`, `do`), para um
 *     laço infinito virar uma mensagem em vez de travar a aba.
 *
 * A proteção é inserida na mesma linha, sem quebrar linha nenhuma: o número da
 * linha de um erro continua sendo o do código que o aluno escreveu.
 */

/** Nome da função de proteção; o executor a entrega ao código do aluno. */
export const NOME_DA_PROTECAO = '__volta';

export type Analise =
  { ok: true; codigo: string; nomes: string[]; investigador?: string } | { ok: false; erro: ErroExecucao };

type NoGenerico = Node & Record<string, unknown>;

const TIPOS_DE_LACO = new Set([
  'ForStatement',
  'WhileStatement',
  'DoWhileStatement',
  'ForInStatement',
  'ForOfStatement',
]);

function ehNo(valor: unknown): valor is NoGenerico {
  return typeof valor === 'object' && valor !== null && typeof (valor as { type?: unknown }).type === 'string';
}

/** Percorre a árvore inteira, sem depender de uma biblioteca de caminhada. */
function visitar(no: NoGenerico, aoEntrar: (no: NoGenerico) => void): void {
  aoEntrar(no);
  for (const chave of Object.keys(no)) {
    if (chave === 'type' || chave === 'start' || chave === 'end' || chave === 'loc') continue;
    const valor = no[chave];
    if (Array.isArray(valor)) {
      for (const item of valor) if (ehNo(item)) visitar(item, aoEntrar);
    } else if (ehNo(valor)) {
      visitar(valor, aoEntrar);
    }
  }
}

/** Nomes que um padrão de declaração cria: `a`, `{ a, b: c }`, `[x, ...resto]`. */
function nomesDoPadrao(padrao: unknown, nomes: string[]): void {
  if (!ehNo(padrao)) return;
  switch (padrao.type) {
    case 'Identifier':
      nomes.push(padrao['name'] as string);
      break;
    case 'ObjectPattern':
      for (const propriedade of padrao['properties'] as unknown[]) {
        if (!ehNo(propriedade)) continue;
        nomesDoPadrao(propriedade.type === 'RestElement' ? propriedade['argument'] : propriedade['value'], nomes);
      }
      break;
    case 'ArrayPattern':
      for (const elemento of padrao['elements'] as unknown[]) nomesDoPadrao(elemento, nomes);
      break;
    case 'AssignmentPattern':
      nomesDoPadrao(padrao['left'], nomes);
      break;
    case 'RestElement':
      nomesDoPadrao(padrao['argument'], nomes);
      break;
  }
}

function declaracoesDoNivelDeCima(programa: NoGenerico): string[] {
  const nomes: string[] = [];
  for (const instrucao of programa['body'] as unknown[]) {
    if (!ehNo(instrucao)) continue;
    if (instrucao.type === 'VariableDeclaration') {
      for (const declarador of instrucao['declarations'] as unknown[]) {
        if (ehNo(declarador)) nomesDoPadrao(declarador['id'], nomes);
      }
    } else if (instrucao.type === 'FunctionDeclaration' || instrucao.type === 'ClassDeclaration') {
      if (ehNo(instrucao['id'])) nomes.push(instrucao['id']['name'] as string);
    }
  }
  return [...new Set(nomes)];
}

interface Insercao {
  posicao: number;
  texto: string;
  remover?: number;
}

/** Só transforma leituras: alvos de escrita, chamadas e cadeias opcionais ficam intactos. */
function investigacoesDeIndice(programa: NoGenerico, aberturas: Map<number, number>) {
  const nomes = new Set<string>();
  visitar(programa, (no) => {
    if (no.type === 'Identifier') nomes.add(no['name'] as string);
  });
  let nome = '__mundojsLerIndice';
  while (nomes.has(nome)) nome += '_';
  const insercoes: Insercao[] = [];
  function percorrer(no: NoGenerico) {
    if (no.type === 'ChainExpression') return;
    const objeto = no['object'];
    if (no.type === 'MemberExpression' && no['computed'] && ehNo(objeto) && objeto.type === 'Identifier') {
      const abre = aberturas.get(objeto.end);
      if (abre !== undefined && no.start === objeto.start) {
        insercoes.push(
          { posicao: no.start, texto: `${nome}(` },
          { posicao: abre, remover: 1, texto: ', (' },
          {
            posicao: no.end - 1,
            remover: 1,
            texto: `), ${no.loc!.start.line}, ${no.loc!.start.column + 1}, ${JSON.stringify(objeto['name'])})`,
          },
        );
      }
    }
    for (const [chave, valor] of Object.entries(no)) {
      if (
        ((no.type === 'AssignmentExpression' || no.type === 'ForInStatement' || no.type === 'ForOfStatement') &&
          chave === 'left') ||
        ((no.type === 'UpdateExpression' || (no.type === 'UnaryExpression' && no['operator'] === 'delete')) &&
          chave === 'argument') ||
        ((no.type === 'CallExpression' || no.type === 'NewExpression') && chave === 'callee') ||
        (no.type === 'TaggedTemplateExpression' && chave === 'tag')
      )
        continue;
      if (Array.isArray(valor)) {
        for (const item of valor) if (ehNo(item)) percorrer(item);
      } else if (ehNo(valor)) percorrer(valor);
    }
  }
  percorrer(programa);
  return { insercoes, ...(insercoes.length > 0 && { nome }) };
}

function protecoesDeLaco(programa: NoGenerico): Insercao[] {
  const insercoes: Insercao[] = [];
  const chamada = `${NOME_DA_PROTECAO}();`;
  visitar(programa, (no) => {
    if (!TIPOS_DE_LACO.has(no.type)) return;
    const corpo = no['body'];
    if (!ehNo(corpo)) return;
    if (corpo.type === 'BlockStatement') {
      insercoes.push({ posicao: corpo.start + 1, texto: chamada });
    } else {
      // Sem chaves (`for (...) x++;`): embrulha o corpo para caber a proteção.
      insercoes.push({ posicao: corpo.start, texto: `{${chamada}` });
      insercoes.push({ posicao: corpo.end, texto: '}' });
    }
  });
  return insercoes;
}

function aplicarInsercoes(codigo: string, insercoes: Insercao[]): string {
  // De trás para frente, para as posições anteriores continuarem valendo.
  // A ordem de empate importa: a abertura de um corpo vem antes do fechamento
  // de outro que termina no mesmo ponto.
  const ordenadas = insercoes
    .map((insercao, indice) => ({ ...insercao, indice }))
    .sort((a, b) => b.posicao - a.posicao || b.indice - a.indice);
  let resultado = codigo;
  for (const { posicao, texto, remover = 0 } of ordenadas) {
    resultado = resultado.slice(0, posicao) + texto + resultado.slice(posicao + remover);
  }
  return resultado;
}

export function analisar(codigo: string): Analise {
  let programa: NoGenerico;
  const abertos: { abre: string; fecha: string; linha: number }[] = [];
  const pares: Record<string, string> = { '(': ')', '[': ']', '{': '}', '${': '}' };
  let ultimoTipo = '';
  let ultimoFim = -1;
  const aberturasDeIndice = new Map<number, number>();
  const acompanharDelimitador = (token: Token) => {
    const simbolo = token.type.label;
    ultimoTipo = simbolo;
    if (simbolo === '[') aberturasDeIndice.set(ultimoFim, token.start);
    ultimoFim = token.end;
    const fecha = pares[simbolo];
    if (fecha) abertos.push({ abre: simbolo, fecha, linha: token.loc?.start.line ?? 1 });
    else if (simbolo === ')' || simbolo === ']' || simbolo === '}') {
      if (abertos.at(-1)?.fecha === simbolo) abertos.pop();
    }
  };
  try {
    programa = parse(codigo, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowAwaitOutsideFunction: true,
      locations: true,
      onToken: acompanharDelimitador,
    }) as unknown as NoGenerico;
  } catch (erro) {
    const falha = erro as { message?: string; loc?: { line: number; column: number }; pos?: number };
    const posicao = falha.loc ?? { line: 1, column: 0 };
    const noFim = falha.pos !== undefined && falha.pos >= codigo.trimEnd().length;
    const depoisDeAwait = falha.pos !== undefined && /\bawait\s+$/.test(codigo.slice(0, falha.pos));
    const aberto = abertos.at(-1);
    const simbolo = falha.pos === undefined ? '' : codigo[falha.pos];
    const antesDoPontoEVirgula =
      simbolo === ';' &&
      (aberto?.abre === '(' || aberto?.abre === '[') &&
      ['name', 'num', 'string', 'regexp', 'true', 'false', 'null', ')', ']', '}', '`'].includes(ultimoTipo);
    // O parser ignora comentários e textos; só consideramos símbolos reais do código.
    const delimitador =
      aberto && (noFim || antesDoPontoEVirgula || (simbolo && ')]}'.includes(simbolo) && simbolo !== aberto.fecha))
        ? { ...aberto, antesDoPontoEVirgula }
        : undefined;
    return {
      ok: false,
      erro: traduzirErroDeSintaxe(
        falha.message ?? 'SyntaxError',
        { linha: posicao.line, coluna: posicao.column },
        noFim,
        depoisDeAwait,
        delimitador,
      ),
    };
  }

  const investigacao = investigacoesDeIndice(programa, aberturasDeIndice);
  return {
    ok: true,
    codigo: aplicarInsercoes(codigo, [...protecoesDeLaco(programa), ...investigacao.insercoes]),
    nomes: declaracoesDoNivelDeCima(programa),
    ...(investigacao.nome && { investigador: investigacao.nome }),
  };
}
