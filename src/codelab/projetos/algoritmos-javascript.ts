import type { ProjetoCodeLab } from '../tipos';

export const projetoAlgoritmos: ProjetoCodeLab = {
  id: 'algoritmos-javascript',
  slug: 'algoritmos-javascript',
  nome: 'Biblioteca de Algoritmos e Estruturas',
  descricao:
    'Coleção essencial de algoritmos, utilitários puros e estruturas de dados em JavaScript/TypeScript para o dia a dia: ordenação, paginação, deep clone, filtros e validações.',
  icone: 'algoritmos',
  tags: ['Algoritmos', 'TypeScript', 'Estruturas de Dados', 'Clean Code', 'Utilitários', 'Performance'],
  versao: '1.0.0',
  arquivoPadrao: 'ordenacao/quicksort.ts',
  estrutura: {
    pastas: [
      {
        nome: 'ordenacao',
        caminho: 'ordenacao',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:ordenacao/quicksort.ts',
            caminho: 'ordenacao/quicksort.ts',
            nome: 'quicksort.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Implementação do algoritmo Quicksort em TypeScript com complexidade O(n log n).
 * Utiliza o método de divisão e conquista com pivô mediano para evitar degradação O(n²).
 */

export type Comparador<T> = (a: T, b: T) => number;

const comparadorPadrao = <T>(a: T, b: T): number => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

/**
 * Ordena um array utilizando o algoritmo Quicksort (não muta o array original).
 *
 * @param array - Coleção a ser ordenada
 * @param comparador - Função opcional de comparação customizada
 * @returns Novo array ordenado
 */
export function quicksort<T>(array: readonly T[], comparador: Comparador<T> = comparadorPadrao): T[] {
  if (array.length <= 1) {
    return [...array];
  }

  const copia = [...array];
  executarQuicksort(copia, 0, copia.length - 1, comparador);
  return copia;
}

function executarQuicksort<T>(array: T[], inicio: number, fim: number, comparador: Comparador<T>): void {
  if (inicio >= fim) return;

  const indicePivo = particionar(array, inicio, fim, comparador);
  executarQuicksort(array, inicio, indicePivo - 1, comparador);
  executarQuicksort(array, indicePivo + 1, fim, comparador);
}

function particionar<T>(array: T[], inicio: number, fim: number, comparador: Comparador<T>): number {
  // Escolha do pivô (mediana entre início, meio e fim)
  const meio = Math.floor((inicio + fim) / 2);
  trocar(array, meio, fim);

  const pivo = array[fim]!;
  let i = inicio;

  for (let j = inicio; j < fim; j++) {
    if (comparador(array[j]!, pivo) <= 0) {
      trocar(array, i, j);
      i++;
    }
  }

  trocar(array, i, fim);
  return i;
}

function trocar<T>(array: T[], i: number, j: number): void {
  const temp = array[i]!;
  array[i] = array[j]!;
  array[j] = temp;
}
`,
            documentacao: {
              resumo: 'Algoritmo Quicksort O(n log n) com pivô mediano e imutabilidade do array original.',
              responsabilidade:
                'Ordenar coleções de qualquer tipo com alta eficiência utilizando divisão e conquista in-place internamente em uma cópia segura.',
              comoFunciona:
                'Seleciona um pivô mediano para reduzir o pior caso O(n²). Particiona o array colocando elementos menores à esquerda e maiores à direita do pivô, e chama recursivamente para os sub-arrays.',
              porQueEssaAbordagem:
                'O Array.prototype.sort do V8 usa TimSort. Implementar Quicksort puro ajuda a compreender divisão e conquista, complexidade assintótica e algoritmos fundamentais de ciência da computação.',
              metodos: [
                {
                  nome: 'quicksort',
                  assinatura: 'quicksort<T>(array: readonly T[], comparador?: Comparador<T>): T[]',
                  descricao: 'Ordena coleções sem mutar a lista original.',
                  parametros: [
                    { nome: 'array', tipo: 'readonly T[]', descricao: 'Array de elementos a ordenar' },
                    { nome: 'comparador', tipo: '(a: T, b: T) => number', descricao: 'Função de comparação opcional' },
                  ],
                  retorno: 'T[] novo array ordenado',
                  exemploUso: 'quicksort([5, 2, 9, 1, 5, 6]); // [1, 2, 5, 5, 6, 9]',
                },
              ],
              relacionamentos: {
                usadoPor: [{ arquivo: 'paginacao/paginar-colecao.ts', motivo: 'Ordenação prévia antes do fatiamento' }],
              },
            },
          },
        ],
      },
      {
        nome: 'strings',
        caminho: 'strings',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:strings/slugify.ts',
            caminho: 'strings/slugify.ts',
            nome: 'slugify.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Converte qualquer texto em um slug amigável para URLs e identificadores.
 * Remove acentuação via normalização Unicode NFD, caracteres especiais e espaços duplicados.
 */
export function slugify(texto: string): string {
  if (!texto) return '';

  return texto
    .toString()
    .normalize('NFD') // Separa caracteres base de seus acentos (ex: "é" vira "e" + acento)
    .replace(/[\\u0300-\\u036f]/g, '') // Remove marcas diacríticas
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '') // Remove caracteres que não sejam letras, números ou hífens
    .replace(/[\\s_]+/g, '-') // Converte espaços e underscores para hífen
    .replace(/-+/g, '-') // Remove múltiplos hífens consecutivos
    .replace(/^-+|-+$/g, ''); // Remove hífens nas extremidades
}
`,
            documentacao: {
              resumo: 'Geração de slugs seguros para URLs com normalização Unicode NFD.',
              responsabilidade: 'Transformar títulos como "Aprenda Node.js & Express!" em "aprenda-nodejs-express".',
              comoFunciona:
                'Utiliza String.prototype.normalize("NFD") para desmembrar acentos de letras bases e regex para higienização.',
              porQueEssaAbordagem:
                'A normalização Unicode é muito mais abrangente e confiável do que listas manuais de substituição de letras com acentos.',
            },
          },
          {
            id: 'algoritmos-javascript:strings/validar-cpf.ts',
            caminho: 'strings/validar-cpf.ts',
            nome: 'validar-cpf.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Validação algorítmica completa de CPF com cálculo dos dois dígitos verificadores (DV).
 */
export function validarCpf(cpf: string): boolean {
  if (!cpf) return false;

  // Remove pontuação e espaços
  const digitos = cpf.replace(/\\D/g, '');

  // CPF deve ter exatamente 11 dígitos
  if (digitos.length !== 11) return false;

  // Bloqueia CPFs com todos os dígitos iguais (ex: 111.111.111-11)
  if (/^(\\d)\\1{10}$/.test(digitos)) return false;

  // 1º Dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(digitos[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  const digito1 = resto === 10 || resto === 11 ? 0 : resto;

  if (digito1 !== Number(digitos[9])) return false;

  // 2º Dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(digitos[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  const digito2 = resto === 10 || resto === 11 ? 0 : resto;

  return digito2 === Number(digitos[10]);
}
`,
            documentacao: {
              resumo: 'Validação matemática oficial dos dois dígitos verificadores de CPF.',
              responsabilidade: 'Verificar a autenticidade estrutural de números de CPF no Brasil.',
              comoFunciona:
                'Calcula a soma ponderada dos 9 primeiros dígitos e depois dos 10 primeiros dígitos, checando restos da divisão por 11.',
            },
          },
        ],
      },
      {
        nome: 'arrays',
        caminho: 'arrays',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:arrays/chunk.ts',
            caminho: 'arrays/chunk.ts',
            nome: 'chunk.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Divide um array em grupos menores (chunks) de tamanho especificado.
 *
 * @param array - Array original a ser particionado
 * @param tamanho - Tamanho de cada bloco (mínimo 1)
 * @returns Matriz de chunks
 */
export function chunk<T>(array: readonly T[], tamanho: number): T[][] {
  if (!array || array.length === 0) return [];
  const tam = Math.max(1, Math.floor(tamanho));
  const resultado: T[][] = [];

  for (let i = 0; i < array.length; i += tam) {
    resultado.push(array.slice(i, i + tam));
  }

  return resultado;
}
`,
            documentacao: {
              resumo: 'Fatiamento de arrays em lotes para processamento concorrente em batch.',
              responsabilidade:
                'Dividir grandes coleções de IDs ou dados para chamadas de banco ou APIs externas em blocos controlados.',
              comoFunciona: 'Percorre a lista em saltos iguais a tamanho utilizando slice(i, i + tamanho).',
            },
          },
          {
            id: 'algoritmos-javascript:arrays/remover-duplicados.ts',
            caminho: 'arrays/remover-duplicados.ts',
            nome: 'remover-duplicados.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Remove duplicatas de um array com suporte a função seletora de chave e preservação de ordem.
 */
export function removerDuplicados<T, K = T>(
  array: readonly T[],
  seletorChave?: (item: T) => K
): T[] {
  if (!array || array.length === 0) return [];

  const visitados = new Set<unknown>();
  const resultado: T[] = [];

  for (const item of array) {
    const chave = seletorChave ? seletorChave(item) : item;
    if (!visitados.has(chave)) {
      visitados.add(chave);
      resultado.push(item);
    }
  }

  return resultado;
}
`,
            documentacao: {
              resumo: 'Deduplicação de elementos com complexidade O(n) utilizando Set.',
              responsabilidade: 'Garantir unicidade de itens em listas sem degradar performance para O(n²).',
              comoFunciona: 'Utiliza um Set auxiliar para lookup O(1) de chaves já visualizadas.',
            },
          },
        ],
      },
      {
        nome: 'objetos',
        caminho: 'objetos',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:objetos/deep-clone.ts',
            caminho: 'objetos/deep-clone.ts',
            nome: 'deep-clone.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Clona profundamente um valor de qualquer tipo, preservando Date, RegExp, Map, Set
 * e prevenindo estouro de pilha por referências circulares via WeakMap.
 */
export function deepClone<T>(alvo: T, cache = new WeakMap<object, unknown>()): T {
  // Primitivos e funções imutáveis
  if (alvo === null || typeof alvo !== 'object') {
    return alvo;
  }

  // Previne loops em referências circulares
  if (cache.has(alvo as object)) {
    return cache.get(alvo as object) as T;
  }

  // Tratamento de tipos especiais
  if (alvo instanceof Date) {
    return new Date(alvo.getTime()) as unknown as T;
  }

  if (alvo instanceof RegExp) {
    return new RegExp(alvo.source, alvo.flags) as unknown as T;
  }

  if (alvo instanceof Map) {
    const copiaMapa = new Map();
    cache.set(alvo, copiaMapa);
    alvo.forEach((valor, chave) => {
      copiaMapa.set(deepClone(chave, cache), deepClone(valor, cache));
    });
    return copiaMapa as unknown as T;
  }

  if (alvo instanceof Set) {
    const copiaSet = new Set();
    cache.set(alvo, copiaSet);
    alvo.forEach((valor) => {
      copiaSet.add(deepClone(valor, cache));
    });
    return copiaSet as unknown as T;
  }

  // Arrays
  if (Array.isArray(alvo)) {
    const copiaArray: unknown[] = [];
    cache.set(alvo, copiaArray);
    for (let i = 0; i < alvo.length; i++) {
      copiaArray[i] = deepClone(alvo[i], cache);
    }
    return copiaArray as unknown as T;
  }

  // Objetos literais comuns
  const copiaObjeto = Object.create(Object.getPrototypeOf(alvo));
  cache.set(alvo, copiaObjeto);

  for (const chave of Object.keys(alvo)) {
    (copiaObjeto as Record<string, unknown>)[chave] = deepClone(
      (alvo as Record<string, unknown>)[chave],
      cache
    );
  }

  return copiaObjeto as T;
}
`,
            documentacao: {
              resumo: 'Clonagem profunda segura de estruturas complexas com suporte a referências circulares.',
              responsabilidade: 'Garantir imutabilidade estrita sem as limitações do JSON.parse(JSON.stringify()).',
              comoFunciona: 'Utiliza recursão protegida com WeakMap de rastreio de objetos já clonados.',
            },
          },
          {
            id: 'algoritmos-javascript:objetos/deep-merge.ts',
            caminho: 'objetos/deep-merge.ts',
            nome: 'deep-merge.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Mescla recursivamente múltiplos objetos sem mutar os argumentos de entrada.
 */
function ehObjeto(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, any>>(alvo: T, ...fontes: Partial<T>[]): T {
  if (!fontes.length) return alvo;
  const resultado: Record<string, unknown> = { ...alvo };

  for (const fonte of fontes) {
    if (!ehObjeto(fonte)) continue;

    for (const [chave, valor] of Object.entries(fonte)) {
      if (ehObjeto(valor) && ehObjeto(resultado[chave])) {
        resultado[chave] = deepMerge(
          resultado[chave] as Record<string, unknown>,
          valor as Record<string, unknown>
        );
      } else {
        resultado[chave] = valor;
      }
    }
  }

  return resultado as T;
}
`,
            documentacao: {
              resumo: 'Fusão profunda recursiva de objetos e configurações de sistema.',
              responsabilidade:
                'Sobrepor configurações padrão com opções customizadas mantendo objetos aninhados intactos.',
            },
          },
        ],
      },
      {
        nome: 'filtros',
        caminho: 'filtros',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:filtros/filtro-multiplo.ts',
            caminho: 'filtros/filtro-multiplo.ts',
            nome: 'filtro-multiplo.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Pipeline flexível de filtragem combinando múltiplos predicados com lógica AND ou OR.
 */
export type Predicado<T> = (item: T) => boolean;

export function criarFiltroComposto<T>(
  predicados: Predicado<T>[],
  modo: 'AND' | 'OR' = 'AND'
): Predicado<T> {
  if (modo === 'AND') {
    return (item: T) => predicados.every((p) => p(item));
  }
  return (item: T) => predicados.some((p) => p(item));
}
`,
            documentacao: {
              resumo: 'Composição declarativa de predicados booleanos para buscas ricas.',
              responsabilidade: 'Permitir que usuários filtrem relatórios por múltiplos critérios dinâmicos.',
            },
          },
        ],
      },
      {
        nome: 'paginacao',
        caminho: 'paginacao',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:paginacao/paginar-colecao.ts',
            caminho: 'paginacao/paginar-colecao.ts',
            nome: 'paginar-colecao.ts',
            linguagem: 'typescript',
            conteudo: `export interface OpcoesPaginacao {
  pagina?: number;
  limite?: number;
}

export interface ResultadoPaginado<T> {
  dados: T[];
  metadados: {
    paginaAtual: number;
    itensPorPagina: number;
    totalItens: number;
    totalPaginas: number;
    temAnterior: boolean;
    temProxima: boolean;
  };
}

export function paginarColecao<T>(
  itens: readonly T[],
  opcoes: OpcoesPaginacao = {}
): ResultadoPaginado<T> {
  const totalItens = itens.length;
  const limite = Math.max(1, Math.floor(opcoes.limite ?? 10));
  const totalPaginas = Math.max(1, Math.ceil(totalItens / limite));
  const paginaAtual = Math.min(Math.max(1, Math.floor(opcoes.pagina ?? 1)), totalPaginas);

  const inicio = (paginaAtual - 1) * limite;
  const fim = inicio + limite;
  const dados = itens.slice(inicio, fim);

  return {
    dados,
    metadados: {
      paginaAtual,
      itensPorPagina: limite,
      totalItens,
      totalPaginas,
      temAnterior: paginaAtual > 1,
      temProxima: paginaAtual < totalPaginas,
    },
  };
}
`,
            documentacao: {
              resumo: 'Utilitário puro de paginação com cálculo de offsets e metadados de navegação.',
              responsabilidade: 'Entregar fatias de dados acompanhadas de flags temProxima e temAnterior.',
            },
          },
        ],
      },
      {
        nome: 'validacoes',
        caminho: 'validacoes',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:validacoes/schema-validator.ts',
            caminho: 'validacoes/schema-validator.ts',
            nome: 'schema-validator.ts',
            linguagem: 'typescript',
            conteudo: `export interface RegraValidacao<T> {
  campo: keyof T;
  validador: (valor: unknown) => boolean;
  mensagem: string;
}

export function validarObjeto<T extends Record<string, unknown>>(
  objeto: T,
  regras: RegraValidacao<T>[]
): { valido: boolean; erros: { campo: string; mensagem: string }[] } {
  const erros: { campo: string; mensagem: string }[] = [];

  for (const regra of regras) {
    const valor = objeto[regra.campo];
    if (!regra.validador(valor)) {
      erros.push({ campo: String(regra.campo), mensagem: regra.mensagem });
    }
  }

  return { valido: erros.length === 0, erros };
}
`,
            documentacao: {
              resumo: 'Motor declarativo de validação de esquemas de dados.',
              responsabilidade: 'Validar objetos de negócios sem dependências externas.',
            },
          },
        ],
      },
      {
        nome: 'manipulacao-dados',
        caminho: 'manipulacao-dados',
        pastas: [],
        arquivos: [
          {
            id: 'algoritmos-javascript:manipulacao-dados/agrupar-por.ts',
            caminho: 'manipulacao-dados/agrupar-por.ts',
            nome: 'agrupar-por.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Agrupa itens de um array com base no resultado de uma função extratora de chave.
 */
export function agruparPor<T, K extends PropertyKey>(
  colecao: readonly T[],
  extratorChave: (item: T) => K
): Record<K, T[]> {
  const resultado = {} as Record<K, T[]>;

  for (const item of colecao) {
    const chave = extratorChave(item);
    if (!resultado[chave]) {
      resultado[chave] = [];
    }
    resultado[chave].push(item);
  }

  return resultado;
}
`,
            documentacao: {
              resumo: 'Agrupamento tipo GROUP BY em memória com tipagem estrita de chaves.',
              responsabilidade: 'Organizar listas em dicionários indexados por chave.',
            },
          },
          {
            id: 'algoritmos-javascript:manipulacao-dados/debounce.ts',
            caminho: 'manipulacao-dados/debounce.ts',
            nome: 'debounce.ts',
            linguagem: 'typescript',
            conteudo: `/**
 * Cria uma versão com atraso controlado (debounce) de uma função alvo.
 * A execução da função é adiada até que passem N milissegundos sem novas invocações.
 */
export function debounce<Args extends unknown[], R>(
  funcaoAlvo: (...args: Args) => R,
  esperaMs: number,
  opcoes?: { imediato?: boolean }
): {
  (...args: Args): void;
  cancelar: () => void;
  executarAgora: (...args: Args) => void;
} {
  let temporizador: ReturnType<typeof setTimeout> | null = null;
  let ultimosArgs: Args | null = null;

  function cancelador() {
    if (temporizador !== null) {
      clearTimeout(temporizador);
      temporizador = null;
    }
    ultimosArgs = null;
  }

  function funcaoDebounced(this: unknown, ...args: Args) {
    ultimosArgs = args;
    const invocarImediatamente = opcoes?.imediato && temporizador === null;

    if (temporizador !== null) {
      clearTimeout(temporizador);
    }

    temporizador = setTimeout(() => {
      temporizador = null;
      if (!opcoes?.imediato && ultimosArgs) {
        funcaoAlvo.apply(this, ultimosArgs);
        ultimosArgs = null;
      }
    }, esperaMs);

    if (invocarImediatamente) {
      funcaoAlvo.apply(this, args);
      ultimosArgs = null;
    }
  }

  funcaoDebounced.cancelar = cancelador;
  funcaoDebounced.executarAgora = function (this: unknown, ...args: Args) {
    cancelador();
    funcaoAlvo.apply(this, args);
  };

  return funcaoDebounced;
}
`,
            documentacao: {
              resumo: 'Utilitário de limitação de taxa (debounce) com suporte a cancelamento e execução imediata.',
              responsabilidade:
                'Evitar sobrecarga em eventos de alta frequência (digitação em inputs de busca, redimensionamento de janela, scroll).',
              comoFunciona:
                'Reinicia o timer com clearTimeout() a cada nova chamada. Apenas quando o timer conclui os N ms de inatividade a função original é disparada.',
              porQueEssaAbordagem:
                'Economiza requisições de rede e renderizações custosas de UI ao aguardar o usuário pausar a digitação.',
              metodos: [
                {
                  nome: 'debounce',
                  assinatura: 'debounce<Args, R>(funcaoAlvo, esperaMs, opcoes?): DebouncedFunction',
                  descricao: 'Cria invólucro com debounce sobre a função alvo.',
                  retorno: 'Função decorada com métodos .cancelar() e .executarAgora()',
                },
              ],
              exemplos: [
                {
                  titulo: 'Autocompletar de pesquisa com debounce de 300ms',
                  descricao: 'Dispara consulta à API apenas quando o usuário para de digitar',
                  codigo: `const buscarApi = (termo: string) => console.log('Buscando:', termo);
const buscarComDebounce = debounce(buscarApi, 300);

input.addEventListener('input', (e) => buscarComDebounce(e.target.value));`,
                  saida: 'Executado 1x após 300ms de inatividade',
                },
              ],
              boasPraticas: [
                'Sempre limpar o temporizador chamando debounced.cancelar() no desmonte de componentes React (useEffect cleanup).',
                'Definir intervalos confortáveis: 250ms a 400ms para inputs de texto.',
              ],
            },
          },
        ],
      },
    ],
    arquivosRaiz: [
      {
        id: 'algoritmos-javascript:package.json',
        caminho: 'package.json',
        nome: 'package.json',
        linguagem: 'json',
        conteudo: `{
  "name": "algoritmos-javascript",
  "version": "1.0.0",
  "description": "Biblioteca moderna de algoritmos e utilitários puros em TypeScript",
  "main": "ordenacao/quicksort.ts",
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vitest": "^2.1.4"
  }
}
`,
        documentacao: {
          resumo: 'Manifesto da biblioteca de algoritmos.',
          responsabilidade: 'Declarar scripts de teste e tipagem.',
        },
      },
    ],
  },
};
