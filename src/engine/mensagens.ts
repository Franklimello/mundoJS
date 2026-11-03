import type { ErroBruto, ErroExecucao } from './tipos';

/**
 * Traduz os erros do JavaScript para quem está começando.
 *
 * A mensagem original fica em inglês e fala de "tokens" e "bindings". Aqui ela
 * vira uma frase que diz o que aconteceu e, quando dá, o que fazer.
 */

interface Traducao {
  mensagem: string;
  dica?: string;
}

type Regra = [RegExp, (achado: RegExpMatchArray) => Traducao];

const REGRAS_DE_EXECUCAO: Regra[] = [
  [
    /^(\w+) is not defined$/,
    (m) => ({
      mensagem: `Não existe nada chamado “${m[1]}”.`,
      dica: 'Confira se escreveu o nome igual ao que declarou (maiúsculas e minúsculas contam) e se declarou com let ou const antes de usar.',
    }),
  ],
  [
    /^Cannot access '(\w+)' before initialization$/,
    (m) => ({
      mensagem: `Você usou “${m[1]}” antes de criá-la.`,
      dica: 'Declare a variável com let ou const em uma linha acima do primeiro uso.',
    }),
  ],
  [
    /^Assignment to constant variable\.?$/,
    () => ({
      mensagem: 'Você tentou mudar o valor de uma const.',
      dica: 'Use let no lugar de const quando o valor precisa mudar depois.',
    }),
  ],
  [
    /^(.+) is not a function$/,
    (m) => ({
      mensagem: `“${m[1]}” não é uma função, então não dá para chamar com ().`,
      dica: 'Confira o nome e se ele realmente guarda uma função.',
    }),
  ],
  [
    // `.then` em algo que não é promessa: quase sempre a função esqueceu o return.
    /^Cannot read propert(?:y|ies) of (undefined|null) \(reading '(then|catch|finally)'\)$/,
    (m) => ({
      mensagem: `Você usou .${m[2]} em algo que não é uma promessa (veio ${m[1]}).`,
      dica: 'A função que você chamou precisa devolver a promessa com return.',
    }),
  ],
  [
    /^Cannot read propert(?:y|ies) of (undefined|null) \(reading '(.+)'\)$/,
    (m) => ({
      mensagem: `Você tentou ler “${m[2]}” de algo que é ${m[1]}.`,
      dica: 'Antes do ponto precisa existir um valor. Confira se a variável foi preenchida e se o nome está certo.',
    }),
  ],
  [
    /^Cannot set propert(?:y|ies) of (undefined|null) \(setting '(.+)'\)$/,
    (m) => ({
      mensagem: `Você tentou guardar “${m[2]}” em algo que é ${m[1]}.`,
      dica: 'Antes do ponto precisa existir um objeto. Confira se a variável foi criada.',
    }),
  ],
  [
    /^(.+) is not iterable$/,
    (m) => ({
      mensagem: `“${m[1]}” não é uma lista nem um texto, então não dá para percorrer.`,
      dica: 'O for...of funciona com listas e textos.',
    }),
  ],
  [
    /^Maximum call stack size exceeded$/,
    () => ({
      mensagem: 'Uma função chamou a si mesma sem parar.',
      dica: 'Toda função que chama a si mesma precisa de uma condição que a faça parar.',
    }),
  ],
  [
    /^Invalid array length$/,
    () => ({ mensagem: 'O tamanho da lista não é válido.', dica: 'Use um número inteiro, zero ou maior.' }),
  ],
];

const REGRAS_DE_SINTAXE: Regra[] = [
  [
    /^Unterminated string constant$/,
    () => ({
      mensagem: 'Faltou fechar as aspas deste texto.',
      dica: 'Todo texto abre e fecha com o mesmo tipo de aspas.',
    }),
  ],
  [/^Unterminated template$/, () => ({ mensagem: 'Faltou fechar a crase (`) deste texto.' })],
  [
    /^Identifier '(\w+)' has already been declared$/,
    (m) => ({
      mensagem: `“${m[1]}” já foi declarada antes.`,
      dica: 'Use outro nome, ou tire o let/const da segunda vez para só mudar o valor.',
    }),
  ],
  [
    /^Unexpected character '(.+)'$/,
    (m) => ({
      mensagem: `O caractere “${m[1]}” não pode ser usado aqui.`,
      dica: 'Se for parte de um texto, ele precisa estar entre aspas.',
    }),
  ],
  [/^'return' outside of function$/, () => ({ mensagem: 'O return só funciona dentro de uma função.' })],
  [
    /^Assigning to rvalue$/,
    () => ({
      mensagem: 'Não dá para guardar um valor aqui.',
      dica: 'Para comparar dois valores use ===. Um = só guarda.',
    }),
  ],
  [
    /^The keyword '(\w+)' is reserved$|^Unexpected reserved word$/,
    (m) => ({
      mensagem: m[1] ? `“${m[1]}” é uma palavra reservada do JavaScript.` : 'Esta palavra é reservada do JavaScript.',
      dica: 'Escolha outro nome.',
    }),
  ],
  [
    /^Binding (\w+) in strict mode$/,
    (m) => ({ mensagem: `“${m[1]}” não pode ser usado como nome aqui.`, dica: 'Escolha outro nome.' }),
  ],
];

function aplicar(regras: Regra[], mensagem: string): Traducao | null {
  for (const [padrao, traduzir] of regras) {
    const achado = mensagem.match(padrao);
    if (achado) return traduzir(achado);
  }
  return null;
}

/** Erros que acontecem enquanto o código roda. */
export function traduzirErroDeExecucao(erro: ErroBruto): ErroExecucao {
  // O aviso de laço infinito já vem em português, escrito pelo próprio executor.
  const traducao: Traducao | null =
    erro.nome === 'LacoInfinito'
      ? {
          mensagem: erro.mensagem,
          dica: 'Confira se a condição do laço muda a cada volta e se em algum momento ela fica falsa.',
        }
      : aplicar(REGRAS_DE_EXECUCAO, erro.mensagem);
  return {
    nome: erro.nome,
    mensagem: traducao?.mensagem ?? erro.mensagem,
    ...(traducao?.dica && { dica: traducao.dica }),
    ...(erro.linha !== undefined && { linha: erro.linha }),
    ...(erro.coluna !== undefined && { coluna: erro.coluna }),
  };
}

/**
 * Erros de escrita, achados antes de rodar.
 *
 * `noFim` diz que o erro apareceu no fim do código: quase sempre é um
 * parêntese, chave ou colchete que ficou aberto.
 */
export function traduzirErroDeSintaxe(
  mensagem: string,
  posicao: { linha: number; coluna: number },
  noFim: boolean,
  depoisDeAwait = false,
): ErroExecucao {
  const limpa = mensagem.replace(/\s*\(\d+:\d+\)$/, '');
  // `await` dentro de uma função que não é async: o acorn só reclama do que vem depois dele.
  const traducao: Traducao | null = depoisDeAwait
    ? {
        mensagem: 'Você usou await dentro de uma função que não é async.',
        dica: 'Escreva async antes de function (ou antes dos parênteses de uma função seta) para poder usar await dentro dela.',
      }
    : aplicar(REGRAS_DE_SINTAXE, limpa);
  const semTraducao: Traducao = noFim
    ? {
        mensagem: 'O código termina antes da hora: falta fechar algo.',
        dica: 'Confira se todo parêntese, chave e colchete que abriu foi fechado.',
      }
    : {
        mensagem: 'Tem um símbolo fora do lugar aqui.',
        dica: 'Olhe esta linha e a anterior: pode faltar uma vírgula, um parêntese ou aspas.',
      };
  const final = traducao ?? semTraducao;
  return {
    nome: 'SyntaxError',
    mensagem: final.mensagem,
    ...(final.dica && { dica: final.dica }),
    linha: posicao.linha,
    coluna: posicao.coluna + 1,
  };
}
