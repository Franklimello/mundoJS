import type {
  ErroBruto,
  InvestigacaoIndice,
  InvestigacaoPropriedade,
  LinhaSaida,
  PedidoBruto,
  RegistroPassos,
  ResultadoBruto,
  TesteBruto,
  TipoLinha,
} from './tipos';

/**
 * O executor: roda o código do aluno e os testes da lição.
 *
 * `criarExecutor` precisa ser AUTOCONTIDA — nada de importar valores nem usar
 * variáveis de fora dela —, porque o texto dela (`criarExecutor.toString()`) é
 * injetado dentro do iframe isolado (ver `sandbox.ts`). Só os tipos, que somem
 * na compilação, vêm de fora. Há um teste que a recria a partir do texto para
 * garantir isso.
 *
 * O código do aluno roda dentro de uma função assíncrona (então `await` vale
 * no nível de cima) e em modo estrito (variável sem `let`/`const` dá erro, como
 * em qualquer projeto de verdade). `console` e os temporizadores são trocados
 * por versões que o executor controla.
 */
export function criarExecutor() {
  const ARQUIVO_DO_ALUNO = 'codigo-do-aluno.js';
  const ARQUIVO_DO_TESTE = 'teste-da-licao.js';
  const LINHAS_ANTES_DO_CODIGO = 1;
  const MAX_LINHAS = 500;
  const MAX_CARACTERES = 40_000;
  /** Quanto cada teste espera uma resposta, e quanto todos juntos podem esperar. */
  const LIMITE_DO_TESTE_MS = 2_000;
  const ORCAMENTO_DOS_TESTES_MS = 6_000;
  const AJUDANTES_DE_TESTE = ['igual', 'verdadeiro', 'saida', 'codigoDoAluno', 'console'];
  /** Precisa ser igual a `NOME_DA_PROTECAO` de `analisar.ts` (há um teste que confere). */
  const NOME_DA_PROTECAO = '__volta';
  /** Dentro dos testes o `console` não mostra nada: a saída do aluno já foi guardada. */
  const consoleSilencioso = new Proxy({}, { get: () => () => undefined });

  const dormir = (ms: number) => new Promise<void>((resolver) => setTimeout(resolver, ms));

  // ---------------------------------------------------------------- formatação

  function aspas(texto: string): string {
    const escapado = texto.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    if (!escapado.includes("'")) return `'${escapado}'`;
    if (!escapado.includes('"')) return `"${escapado}"`;
    return `'${escapado.replace(/'/g, "\\'")}'`;
  }

  function juntar(abertura: string, itens: string[], fechamento: string): string {
    if (itens.length === 0) return `${abertura}${fechamento}`;
    const emUmaLinha = itens.join(', ');
    if (abertura.length + emUmaLinha.length <= 72 && !itens.some((item) => item.includes('\n'))) {
      return `${abertura} ${emUmaLinha} ${fechamento}`;
    }
    const recuados = itens.map((item) => `  ${item.replace(/\n/g, '\n  ')}`);
    return `${abertura}\n${recuados.join(',\n')}\n${fechamento}`;
  }

  function nomeDoConstrutor(valor: object): string | null {
    const prototipo = Object.getPrototypeOf(valor) as { constructor?: { name?: string } } | null;
    if (prototipo === null) return null;
    return prototipo.constructor?.name ?? 'Object';
  }

  function formatar(valor: unknown, nivel = 0, vistos: unknown[] = [], aninhado = false): string {
    switch (typeof valor) {
      case 'string':
        return aninhado ? aspas(valor) : valor;
      case 'number':
        return Object.is(valor, -0) ? '-0' : String(valor);
      case 'bigint':
        return `${valor}n`;
      case 'boolean':
      case 'undefined':
        return String(valor);
      case 'symbol':
        return valor.toString();
      case 'function': {
        const nome = valor.name;
        if (/^class[\s{]/.test(Function.prototype.toString.call(valor))) return `[class ${nome || '(anonymous)'}]`;
        return nome ? `[Function: ${nome}]` : '[Function (anonymous)]';
      }
    }
    if (valor === null) return 'null';
    const objeto = valor as Record<string, unknown>;
    if (vistos.includes(objeto)) return '[Circular]';

    if (objeto instanceof Error) return `${objeto.name}: ${objeto.message}`;
    if (objeto instanceof Date) return Number.isNaN(objeto.getTime()) ? 'Invalid Date' : objeto.toISOString();
    if (objeto instanceof RegExp) return String(objeto);
    if (objeto instanceof Promise) return 'Promise { <pendente> }';
    if (objeto instanceof WeakMap || objeto instanceof WeakSet) return `[${objeto.constructor.name}]`;

    const profundoDemais = nivel > 2;
    const proximos = [...vistos, objeto];
    const filho = (item: unknown) => formatar(item, nivel + 1, proximos, true);

    if (Array.isArray(objeto)) {
      if (profundoDemais) return '[Array]';
      const itens: string[] = [];
      let vazios = 0;
      const limite = Math.min(objeto.length, 100);
      for (let i = 0; i < limite; i++) {
        if (!(i in objeto)) {
          vazios++;
          continue;
        }
        if (vazios) itens.push(`<${vazios} ${vazios === 1 ? 'item vazio' : 'itens vazios'}>`);
        vazios = 0;
        itens.push(filho(objeto[i]));
      }
      if (vazios) itens.push(`<${vazios} ${vazios === 1 ? 'item vazio' : 'itens vazios'}>`);
      if (objeto.length > 100) itens.push(`... mais ${objeto.length - 100} itens`);
      return juntar('[', itens, ']');
    }

    if (objeto instanceof Map) {
      if (profundoDemais) return '[Map]';
      const itens = [...objeto].map(([chave, item]) => `${filho(chave)} => ${filho(item)}`);
      return juntar(`Map(${objeto.size}) {`, itens, '}');
    }
    if (objeto instanceof Set) {
      if (profundoDemais) return '[Set]';
      return juntar(`Set(${objeto.size}) {`, [...objeto].map(filho), '}');
    }

    const construtor = nomeDoConstrutor(objeto);
    if (profundoDemais) return construtor && construtor !== 'Object' ? `[${construtor}]` : '[Object]';
    const itens: string[] = [];
    for (const chave of Object.keys(objeto)) {
      let texto: string;
      try {
        texto = filho(objeto[chave]);
      } catch {
        texto = '[erro ao ler]';
      }
      itens.push(`${/^[A-Za-z_$][\w$]*$/.test(chave) ? chave : aspas(chave)}: ${texto}`);
    }
    const prefixo = construtor === null ? '[Object: null prototype] ' : construtor === 'Object' ? '' : `${construtor} `;
    return juntar(`${prefixo}{`, itens, '}');
  }

  function formatarArgumentos(argumentos: unknown[]): string {
    if (argumentos.length === 0) return '';
    const [primeiro, ...resto] = argumentos;
    if (typeof primeiro === 'string' && primeiro.includes('%') && resto.length > 0) {
      const inicio = primeiro.replace(/%([sdifoOj%])/g, (_, tipo: string) => {
        if (tipo === '%') return '%';
        if (resto.length === 0) return `%${tipo}`;
        const item = resto.shift();
        if (tipo === 's') return typeof item === 'string' ? item : formatar(item, 0, [], true);
        if (tipo === 'd') return String(Number(item));
        if (tipo === 'i') return String(Math.trunc(Number(item)));
        if (tipo === 'f') return String(parseFloat(String(item)));
        return formatar(item, 0, [], true);
      });
      return [inicio, ...resto.map((item) => formatar(item))].join(' ');
    }
    return argumentos.map((item) => formatar(item)).join(' ');
  }

  function tabela(dados: unknown): string | null {
    if (typeof dados !== 'object' || dados === null) return null;
    const linhas = Array.isArray(dados) ? dados.map((item, i) => [String(i), item] as const) : Object.entries(dados);
    const colunas: string[] = [];
    let temValores = false;
    for (const [, item] of linhas) {
      if (typeof item === 'object' && item !== null) {
        for (const chave of Object.keys(item)) if (!colunas.includes(chave)) colunas.push(chave);
      } else {
        temValores = true;
      }
    }
    const cabecalho = ['(índice)', ...colunas, ...(temValores ? ['Valor'] : [])];
    const corpo = linhas.map(([indice, item]) => {
      const objeto = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : null;
      return [
        indice,
        ...colunas.map((coluna) => (objeto && coluna in objeto ? formatar(objeto[coluna], 1, [], true) : '')),
        ...(temValores ? [objeto ? '' : formatar(item, 1, [], true)] : []),
      ];
    });
    const larguras = cabecalho.map((titulo, i) =>
      Math.max(titulo.length, ...corpo.map((linha) => (linha[i] ?? '').length)),
    );
    const linha = (celulas: string[]) => `│ ${celulas.map((c, i) => c.padEnd(larguras[i] ?? 0)).join(' │ ')} │`;
    const regua = (esq: string, meio: string, dir: string) =>
      `${esq}${larguras.map((l) => '─'.repeat(l + 2)).join(meio)}${dir}`;
    return [
      regua('┌', '┬', '┐'),
      linha(cabecalho),
      regua('├', '┼', '┤'),
      ...corpo.map(linha),
      regua('└', '┴', '┘'),
    ].join('\n');
  }

  // ----------------------------------------------------------------- comparação

  function iguais(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a instanceof RegExp && b instanceof RegExp) return String(a) === String(b);
    if (a instanceof Map && b instanceof Map)
      return a.size === b.size && [...a].every(([k, v]) => b.has(k) && iguais(v, b.get(k)));
    if (a instanceof Set && b instanceof Set) return a.size === b.size && [...a].every((v) => b.has(v));
    const chavesA = Object.keys(a);
    const chavesB = Object.keys(b);
    if (chavesA.length !== chavesB.length) return false;
    return chavesA.every(
      (chave) =>
        Object.prototype.hasOwnProperty.call(b, chave) &&
        iguais((a as Record<string, unknown>)[chave], (b as Record<string, unknown>)[chave]),
    );
  }

  class FalhaDeComparacao extends Error {
    constructor(mensagem: string) {
      super(mensagem);
      this.name = 'FalhaDeComparacao';
    }
  }

  class LacoInfinito extends Error {
    constructor(mensagem: string) {
      super(mensagem);
      this.name = 'LacoInfinito';
    }
  }

  class TempoEsgotado extends Error {}

  /**
   * Um teste que espera uma promessa que nunca termina (esqueceram de chamar
   * `resolver`, por exemplo) não pode prender a conferência inteira.
   */
  function comLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
    let relogio: ReturnType<typeof setTimeout> | undefined;
    const estouro = new Promise<never>((_, rejeitar) => {
      relogio = setTimeout(() => rejeitar(new TempoEsgotado()), ms);
    });
    return Promise.race([promessa, estouro]).finally(() => clearTimeout(relogio));
  }

  function descreverTempo(ms: number): string {
    return ms < 1000 ? `${ms} milissegundos` : `${ms / 1000} segundos`;
  }

  // --------------------------------------------------------------------- erros

  function converterErro(erro: unknown, arquivo: string): ErroBruto {
    if (erro instanceof Error) {
      const achado = new RegExp(`${arquivo.replace('.', '\\.')}:(\\d+):(\\d+)`).exec(erro.stack ?? '');
      const linha = achado ? Number(achado[1]) - LINHAS_ANTES_DO_CODIGO : undefined;
      return {
        nome: erro.name,
        mensagem: erro.message,
        ...(linha !== undefined && linha >= 1 && { linha, coluna: Number(achado?.[2]) }),
      };
    }
    return { nome: 'Error', mensagem: `Foi lançado um valor que não é um erro: ${formatar(erro, 0, [], true)}` };
  }

  // ------------------------------------------------------------------- execução

  return async function executar(pedido: PedidoBruto): Promise<ResultadoBruto> {
    const inicio = Date.now();
    const saida: LinhaSaida[] = [];
    let recuo = '';
    let totalDeCaracteres = 0;
    let cortada = false;
    let primeiroErro: ErroBruto | null = null;
    let voltas = 0;
    const temporizadores = new Set<number>();
    const repeticoes = new Set<number>();
    const investigacoes: InvestigacaoIndice[] = [];
    const investigacoesObjetos: InvestigacaoPropriedade[] = [];
    const propriedadesObservadas = new Set<string>();
    let observando = true;
    const passoAPasso: RegistroPassos | undefined = pedido.observadorPassos
      ? { passos: [], limiteAtingido: false }
      : undefined;
    const lacos: { linha: number; volta: number }[] = [];
    let ultimosValores = new Map<string, string>();
    class LimiteDePassos extends Error {}
    function resumirEstado(item: unknown, nivel = 0): string {
      if (typeof item === 'string') return formatar(item.slice(0, 100), 0, [], true) + (item.length > 100 ? '…' : '');
      if (typeof item === 'function') return '[função]';
      if (!item || typeof item !== 'object') return formatar(item);
      const array = Array.isArray(item);
      if (nivel >= 2) return array ? '[array]' : '[objeto]';
      const chaves = array
        ? Array.from({ length: Math.min(item.length, 8) }, (_, i) => String(i))
        : Object.getOwnPropertyNames(item).slice(0, 8);
      const partes = chaves.map((chave) => {
        const descricao = Object.getOwnPropertyDescriptor(item, chave);
        const valor = !descricao
          ? '(vazio)'
          : !('value' in descricao)
            ? '[acessor]'
            : resumirEstado(descricao.value, nivel + 1);
        return array ? valor : `${chave.slice(0, 50)}: ${valor}`;
      });
      if (array && item.length > 8) partes.push('…');
      return partes.length
        ? `${array ? '[' : '{'} ${partes.join(', ')} ${array ? ']' : '}'}`.slice(0, 300)
        : array
          ? '[]'
          : '{}';
    }
    function registrarPasso(valor: unknown, tipo: string, linha: number, variaveis: Record<string, unknown>) {
      if (!passoAPasso) return valor;
      if (passoAPasso.passos.length >= 160) {
        passoAPasso.limiteAtingido = true;
        throw new LimiteDePassos();
      }
      if (tipo === 'laco') lacos.push({ linha, volta: 0 });
      if (tipo === 'volta' && lacos.at(-1)) lacos[lacos.length - 1]!.volta++;
      if (tipo === 'fim-laco') lacos.pop();
      const atuais = Object.entries(variaveis).map(([nome, item]) => {
        const texto = resumirEstado(item).slice(0, 300);
        const estado = !ultimosValores.has(nome) ? 'nova' : ultimosValores.get(nome) !== texto ? 'mudou' : 'igual';
        return { nome, valor: texto, estado } as const;
      });
      ultimosValores = new Map(atuais.map((item) => [item.nome, item.valor]));
      const descricoes: Record<string, string> = {
        inicio: 'Antes de começar',
        declaracao: 'Variáveis declaradas',
        instrucao: 'Comando executado',
        condicao: valor ? 'Condição verdadeira' : 'Condição falsa',
        decisao: 'Decisão concluída',
        laco: 'Preparou o laço',
        volta: 'Começou uma volta do laço',
        'fim-laco': 'Laço encerrado',
        bloco: 'Saiu do bloco',
        break: 'Vai sair do laço',
        continue: 'Vai para a próxima volta',
        fim: 'Fim da execução',
      };
      passoAPasso.passos.push({
        linha,
        descricao: descricoes[tipo] ?? 'Comando executado',
        variaveis: atuais,
        linhasSaida: saida.length,
        lacos: lacos.filter((laco) => laco.volta > 0).map((laco) => ({ ...laco })),
      });
      return valor;
    }

    function lerIndice(
      objeto: Record<PropertyKey, unknown>,
      chave: PropertyKey,
      linha: number,
      coluna: number,
      nome: string,
      porPonto = false,
    ) {
      // A leitura real acontece uma única vez, antes da observação.
      const valor = objeto[chave];
      if (!observando || valor !== undefined || investigacoes.length + investigacoesObjetos.length >= 3) return valor;
      try {
        if (!['number', 'string'].includes(typeof chave)) return valor;
        if (!Array.isArray(objeto)) {
          if (typeof objeto !== 'object' || objeto === null) return valor;
          const prototipo = Object.getPrototypeOf(objeto);
          if (prototipo !== Object.prototype && prototipo !== null) return valor;
          const propriedade = String(chave);
          if (propriedade in objeto) return valor;
          const chaveDaObservacao = `${linha}:${coluna}:${propriedade}`;
          if (propriedadesObservadas.has(chaveDaObservacao)) return valor;
          const propriedades: InvestigacaoPropriedade['propriedades'] = [];
          const chaves = Object.getOwnPropertyNames(objeto);
          for (const chaveAtual of chaves.slice(0, 8)) {
            const descricao = Object.getOwnPropertyDescriptor(objeto, chaveAtual);
            if (!descricao) continue;
            const item = descricao.value;
            const texto = !('value' in descricao)
              ? '(acessor: valor não lido)'
              : item !== null && (typeof item === 'object' || typeof item === 'function')
                ? Array.isArray(item)
                  ? '[array]'
                  : typeof item === 'function'
                    ? '[função]'
                    : '[objeto]'
                : formatar(item, 0, [], true);
            propriedades.push({ nome: chaveAtual.slice(0, 120), valor: texto.slice(0, 120) });
          }
          const rotulo = nome.slice(0, 80);
          const propriedadeResumida = propriedade.length > 120 ? propriedade.slice(0, 119) + '…' : propriedade;
          investigacoesObjetos.push({
            objeto: rotulo,
            propriedade: propriedadeResumida,
            acesso: porPonto ? `${rotulo}.${propriedadeResumida}` : `${rotulo}[${JSON.stringify(propriedadeResumida)}]`,
            linha,
            coluna,
            propriedades,
            haMais: chaves.length > 8,
          });
          propriedadesObservadas.add(chaveDaObservacao);
          return valor;
        }
        const indice = Number(chave);
        if (!Number.isSafeInteger(indice) || String(indice) !== String(chave)) return valor;
        const tamanho = objeto.length;
        if (indice >= 0 && indice < tamanho) return valor;
        if (investigacoes.some((item) => item.linha === linha && item.coluna === coluna && item.indice === indice))
          return valor;
        const itens: InvestigacaoIndice['itens'] = [];
        for (let i = 0; i < Math.min(tamanho, 8); i++) {
          const descricao = Object.getOwnPropertyDescriptor(objeto, String(i));
          const item = descricao?.value;
          const texto = !descricao
            ? '(posição vazia)'
            : !('value' in descricao)
              ? '(acessor: valor não lido)'
              : item !== null && (typeof item === 'object' || typeof item === 'function')
                ? Array.isArray(item)
                  ? '[array]'
                  : typeof item === 'function'
                    ? '[função]'
                    : '[objeto]'
                : formatar(item, 0, [], true);
          itens.push({ indice: i, valor: texto.slice(0, 120) });
        }
        investigacoes.push({ array: nome.slice(0, 80), indice, tamanho, linha, coluna, itens });
      } catch {
        // Um observador nunca transforma uma leitura válida em erro.
      }
      return valor;
    }

    function emitir(tipo: TipoLinha, texto: string) {
      if (cortada) return;
      if (saida.length >= MAX_LINHAS || totalDeCaracteres > MAX_CARACTERES) {
        cortada = true;
        saida.push({ tipo: 'aviso', texto: '(A saída ficou grande demais e foi cortada aqui.)' });
        return;
      }
      const comRecuo = recuo
        ? texto
            .split('\n')
            .map((l) => recuo + l)
            .join('\n')
        : texto;
      totalDeCaracteres += comRecuo.length;
      saida.push({ tipo, texto: comRecuo });
    }

    function registrarErro(erro: unknown) {
      if (!primeiroErro) primeiroErro = converterErro(erro, ARQUIVO_DO_ALUNO);
    }

    const consoleDoAluno = {
      log: (...a: unknown[]) => emitir('log', formatarArgumentos(a)),
      debug: (...a: unknown[]) => emitir('log', formatarArgumentos(a)),
      info: (...a: unknown[]) => emitir('info', formatarArgumentos(a)),
      warn: (...a: unknown[]) => emitir('aviso', formatarArgumentos(a)),
      error: (...a: unknown[]) => emitir('erro', formatarArgumentos(a)),
      dir: (valor: unknown) => emitir('log', formatar(valor, 0, [], true)),
      table: (dados: unknown) => emitir('log', tabela(dados) ?? formatar(dados)),
      assert: (condicao: unknown, ...a: unknown[]) => {
        if (!condicao) emitir('erro', `Asserção falhou${a.length ? `: ${formatarArgumentos(a)}` : ''}`);
      },
      clear: () => {
        saida.length = 0;
        totalDeCaracteres = 0;
      },
      group: (...a: unknown[]) => {
        if (a.length) emitir('log', formatarArgumentos(a));
        recuo += '  ';
      },
      groupEnd: () => {
        recuo = recuo.slice(2);
      },
    };
    (consoleDoAluno as Record<string, unknown>)['groupCollapsed'] = consoleDoAluno.group;

    function agendar(repetir: boolean) {
      return (funcao: unknown, ms?: number, ...argumentos: unknown[]) => {
        if (typeof funcao !== 'function') {
          throw new TypeError(
            `${repetir ? 'setInterval' : 'setTimeout'} precisa receber uma função como primeiro argumento`,
          );
        }
        const chamar = () => {
          try {
            const retorno = (funcao as (...a: unknown[]) => unknown)(...argumentos);
            if (retorno instanceof Promise) retorno.catch(registrarErro);
          } catch (erro) {
            registrarErro(erro);
          }
        };
        if (repetir) {
          const id = setInterval(chamar, ms) as unknown as number;
          repeticoes.add(id);
          return id;
        }
        const id = setTimeout(() => {
          temporizadores.delete(id);
          chamar();
        }, ms) as unknown as number;
        temporizadores.add(id);
        return id;
      };
    }

    const parar = (id: number) => {
      if (temporizadores.delete(id)) clearTimeout(id);
      else if (repeticoes.delete(id)) clearInterval(id);
    };

    const protecao = () => {
      if (++voltas > pedido.limiteDeVoltas) {
        throw new LacoInfinito(
          `Seu laço rodou mais de ${pedido.limiteDeVoltas.toLocaleString('pt-BR')} vezes sem terminar. Parece um laço infinito.`,
        );
      }
    };

    const aoRejeitar = (evento: { reason?: unknown; preventDefault?: () => void }) => {
      evento.preventDefault?.();
      registrarErro(evento.reason);
    };
    const global = globalThis as {
      addEventListener?: (n: string, f: unknown) => void;
      removeEventListener?: (n: string, f: unknown) => void;
    };
    global.addEventListener?.('unhandledrejection', aoRejeitar);

    const avisar = (tipo: string) => (mensagem?: unknown) => {
      emitir(
        'aviso',
        `${tipo}: ${formatar(mensagem)} (o MundoJS ainda não aceita ${tipo === 'alert' ? 'janelas de aviso' : 'entrada de texto'}.)`,
      );
      return tipo === 'prompt' ? null : tipo === 'confirm' ? false : undefined;
    };

    const nomesDoAluno = pedido.nomes.filter((nome) => !AJUDANTES_DE_TESTE.includes(nome));
    let escopo: Record<string, unknown> = {};
    let rodouSemErro = false;

    try {
      const fonte =
        `(async (console, setTimeout, setInterval, clearTimeout, clearInterval, alert, prompt, confirm, ${NOME_DA_PROTECAO}${pedido.investigador ? `, ${pedido.investigador}` : ''}${pedido.observadorPassos ? `, ${pedido.observadorPassos}` : ''}) => { 'use strict';\n` +
        `${pedido.codigo}\n;return {${nomesDoAluno.join(', ')}};\n})\n//# sourceURL=${ARQUIVO_DO_ALUNO}`;
      const funcao = (0, eval)(fonte) as (...a: unknown[]) => Promise<Record<string, unknown>>;
      escopo = await funcao(
        consoleDoAluno,
        agendar(false),
        agendar(true),
        parar,
        parar,
        avisar('alert'),
        avisar('prompt'),
        avisar('confirm'),
        protecao,
        ...(pedido.investigador ? [lerIndice] : []),
        ...(pedido.observadorPassos ? [registrarPasso] : []),
      );
      rodouSemErro = true;
    } catch (erro) {
      if (!(erro instanceof LimiteDePassos)) registrarErro(erro);
    }

    // Espera os temporizadores que o código deixou armados, até o limite.
    const prazo = Date.now() + pedido.esperaMaximaMs;
    while ((temporizadores.size > 0 || repeticoes.size > 0) && Date.now() < prazo) await dormir(15);
    if (temporizadores.size > 0 || repeticoes.size > 0) {
      const tipo = repeticoes.size > 0 ? 'setInterval' : 'setTimeout';
      emitir(
        'aviso',
        `O programa ainda tinha um ${tipo} ativo e foi encerrado depois de ${pedido.esperaMaximaMs / 1000} segundos.`,
      );
      temporizadores.forEach((id) => clearTimeout(id));
      repeticoes.forEach((id) => clearInterval(id));
      temporizadores.clear();
      repeticoes.clear();
    }

    // --------------------------------------------------------------- os testes
    observando = false;
    const testes: TesteBruto[] = [];
    if (pedido.testes.length > 0) {
      const textoDaSaida = saida.filter((l) => l.tipo === 'log' || l.tipo === 'info').map((l) => l.texto);
      const limiteDoTeste = pedido.limiteDoTesteMs ?? LIMITE_DO_TESTE_MS;
      const orcamento = pedido.orcamentoDosTestesMs ?? ORCAMENTO_DOS_TESTES_MS;
      const inicioDosTestes = Date.now();
      for (const teste of pedido.testes) {
        if (!rodouSemErro || primeiroErro) {
          testes.push({
            descricao: teste.descricao,
            passou: false,
            falhaDeComparacao: true,
            mensagem: 'Seu código deu erro antes de terminar. Corrija o erro mostrado na saída e confira de novo.',
          });
          continue;
        }
        const restante = orcamento - (Date.now() - inicioDosTestes);
        if (restante <= 0) {
          testes.push({
            descricao: teste.descricao,
            passou: false,
            falhaDeComparacao: true,
            mensagem:
              'O corretor parou de esperar: os testes anteriores já usaram todo o tempo. Resolva o primeiro que falhou.',
          });
          continue;
        }
        const esperaDesteTeste = Math.min(limiteDoTeste, restante);
        voltas = 0;
        try {
          const igual = (recebido: unknown, esperado: unknown, rotulo?: string) => {
            if (iguais(recebido, esperado)) return;
            throw new FalhaDeComparacao(
              rotulo
                ? `${rotulo} deveria ser ${formatar(esperado, 0, [], true)}, mas foi ${formatar(recebido, 0, [], true)}.`
                : `Era esperado ${formatar(esperado, 0, [], true)}, mas veio ${formatar(recebido, 0, [], true)}.`,
            );
          };
          const verdadeiro = (condicao: unknown, mensagem?: string) => {
            if (!condicao) throw new FalhaDeComparacao(mensagem ?? 'A condição deveria ser verdadeira.');
          };
          const nomes = nomesDoAluno.filter((nome) => nome in escopo);
          const parametros = [...AJUDANTES_DE_TESTE, ...nomes];
          const fonteDoTeste = `(async (${parametros.join(', ')}) => { 'use strict';\n{${teste.codigo}\n}\n})\n//# sourceURL=${ARQUIVO_DO_TESTE}`;
          const executarTeste = (0, eval)(fonteDoTeste) as (...a: unknown[]) => Promise<void>;
          await comLimite(
            executarTeste(
              igual,
              verdadeiro,
              textoDaSaida,
              pedido.codigoOriginal,
              consoleSilencioso,
              ...nomes.map((nome) => escopo[nome]),
            ),
            esperaDesteTeste,
          );
          testes.push({ descricao: teste.descricao, passou: true, falhaDeComparacao: false });
        } catch (erro) {
          if (erro instanceof TempoEsgotado) {
            testes.push({
              descricao: teste.descricao,
              passou: false,
              falhaDeComparacao: true,
              mensagem: `Sua função não terminou em ${descreverTempo(esperaDesteTeste)}. Se ela devolve uma promessa, confira se ela é resolvida em algum momento.`,
            });
          } else if (erro instanceof FalhaDeComparacao) {
            testes.push({ descricao: teste.descricao, passou: false, falhaDeComparacao: true, mensagem: erro.message });
          } else {
            testes.push({
              descricao: teste.descricao,
              passou: false,
              falhaDeComparacao: false,
              erro: converterErro(erro, ARQUIVO_DO_TESTE),
            });
          }
        }
      }
    }

    // Temporizadores que o código do aluno armou durante os testes não podem sobreviver à execução.
    temporizadores.forEach((id) => clearTimeout(id));
    repeticoes.forEach((id) => clearInterval(id));
    temporizadores.clear();
    repeticoes.clear();

    global.removeEventListener?.('unhandledrejection', aoRejeitar);
    return {
      saida,
      erro: primeiroErro,
      testes,
      duracaoMs: Date.now() - inicio,
      ...(investigacoes.length && { investigacoes }),
      ...(investigacoesObjetos.length && { investigacoesObjetos }),
      ...(passoAPasso && { passoAPasso }),
    };
  };
}
