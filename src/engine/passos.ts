import { parse, type Node } from 'acorn';

type No = Node & Record<string, unknown>;
type Trecho = { inicio: number; fim: number; texto: string };
type Preparacao =
  { ok: true; codigo: string; observador: string } | { ok: false; mensagem: string; linha?: number; sintaxe?: boolean };

/** Subconjunto explícito: a execução continua sendo JavaScript nativo no iframe. */
export function prepararPassos(codigo: string): Preparacao {
  if (codigo.length > 20_000)
    return { ok: false, mensagem: 'O passo a passo aceita até 20 mil caracteres. Use Rodar para este código.' };
  let programa: No;
  try {
    programa = parse(codigo, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowAwaitOutsideFunction: true,
      locations: true,
    }) as unknown as No;
  } catch (erro) {
    if (!(erro instanceof SyntaxError))
      return {
        ok: false,
        mensagem: 'Não foi possível acompanhar este nível de complexidade. Use Rodar para este código.',
      };
    return { ok: false, sintaxe: true, mensagem: 'Confira a escrita do código.' };
  }
  const no = (valor: unknown) => valor as No;
  const nomes = new Set<string>();
  const identificadores = new Set<string>();
  let quantidade = 0;
  function percorrer(n: No, profundidade = 0) {
    if (++quantidade > 3000 || profundidade > 40)
      throw new Error('O código é grande ou aninhado demais para esta versão do passo a passo. Use Rodar.');
    if (n.type === 'Identifier') identificadores.add(n['name'] as string);
    if (n.type === 'VariableDeclarator' && no(n['id']).type === 'Identifier') nomes.add(no(n['id'])['name'] as string);
    for (const valor of Object.values(n)) {
      if (Array.isArray(valor))
        valor.forEach((item) => {
          if (item?.type) percorrer(item as No, profundidade + 1);
        });
      else if (valor && typeof valor === 'object' && 'type' in valor) percorrer(valor as No, profundidade + 1);
    }
  }
  let linhaFalha: number | undefined;
  const recusar = (n: No, mensagem: string): never => {
    linhaFalha = n.loc?.start.line;
    throw new Error(mensagem);
  };
  function expressao(n: No): void {
    switch (n.type) {
      case 'Literal':
        if (n['regex'] || typeof n['value'] === 'bigint')
          recusar(n, 'Expressões regulares e BigInt ainda não são acompanhados. Use Rodar.');
        return;
      case 'Identifier':
        if (!nomes.has(n['name'] as string) && !['undefined', 'NaN', 'Infinity'].includes(n['name'] as string))
          recusar(
            n,
            `O nome “${n['name']}” não está entre as variáveis declaradas. Use Rodar para conferir nomes ou APIs externas.`,
          );
        return;
      case 'ArrayExpression':
        (n['elements'] as (No | null)[]).forEach((item) => {
          if (item) expressao(item);
        });
        return;
      case 'ObjectExpression':
        for (const p of n['properties'] as No[]) {
          if (p.type !== 'Property' || p['kind'] !== 'init' || p['method'] || p['computed'])
            recusar(
              p,
              'Use objetos com propriedades simples neste modo. Getters, métodos e propriedades calculadas ficam disponíveis em Rodar.',
            );
          expressao(no(p['value']));
        }
        return;
      case 'MemberExpression':
        if (n['optional'] || no(n['property']).type === 'PrivateIdentifier')
          recusar(n, 'Este tipo de acesso ainda não é acompanhado. Use Rodar.');
        expressao(no(n['object']));
        if (n['computed']) expressao(no(n['property']));
        return;
      case 'BinaryExpression':
      case 'LogicalExpression':
        if (
          !['+', '-', '*', '/', '%', '**', '<', '>', '<=', '>=', '==', '!=', '===', '!==', '&&', '||', '??'].includes(
            n['operator'] as string,
          )
        )
          recusar(n, 'Este operador ainda não é acompanhado. Use Rodar.');
        expressao(no(n['left']));
        expressao(no(n['right']));
        return;
      case 'UnaryExpression':
        if (!['!', '+', '-', 'typeof'].includes(n['operator'] as string))
          recusar(n, 'Este operador ainda não é acompanhado. Use Rodar.');
        expressao(no(n['argument']));
        return;
      case 'ConditionalExpression':
        expressao(no(n['test']));
        expressao(no(n['consequent']));
        expressao(no(n['alternate']));
        return;
      case 'TemplateLiteral':
        (n['expressions'] as No[]).forEach(expressao);
        return;
      default:
        recusar(
          n,
          'Este modo acompanha variáveis, cálculos, arrays, objetos simples, if, laços e console.log. Funções, métodos, DOM e código assíncrono continuam disponíveis em Rodar/Conferir.',
        );
    }
  }
  function alteracao(n: No) {
    if (
      n.type === 'AssignmentExpression' &&
      ['=', '+=', '-=', '*=', '/=', '%='].includes(n['operator'] as string) &&
      no(n['left']).type === 'Identifier'
    ) {
      expressao(no(n['left']));
      expressao(no(n['right']));
      return;
    }
    if (n.type === 'UpdateExpression' && no(n['argument']).type === 'Identifier') {
      expressao(no(n['argument']));
      return;
    }
    recusar(
      n,
      'Neste modo, altere variáveis diretamente. Escritas em propriedades, métodos e outras expressões podem ser executadas com Rodar.',
    );
  }
  function declaracao(n: No) {
    if (!['let', 'const'].includes(n['kind'] as string))
      recusar(n, 'O passo a passo acompanha declarações com let e const. Use Rodar para este código com var.');
    for (const d of n['declarations'] as No[]) {
      if (no(d['id']).type !== 'Identifier') recusar(d, 'Desestruturação ainda não é acompanhada. Use Rodar.');
      if (d['init']) expressao(no(d['init']));
    }
  }
  function validar(n: No): void {
    switch (n.type) {
      case 'Program':
      case 'BlockStatement':
        (n['body'] as No[]).forEach(validar);
        return;
      case 'EmptyStatement':
        return;
      case 'VariableDeclaration':
        declaracao(n);
        return;
      case 'ExpressionStatement': {
        const e = no(n['expression']);
        const c = no(e['callee']);
        if (
          e.type === 'CallExpression' &&
          c?.type === 'MemberExpression' &&
          !e['optional'] &&
          !c['computed'] &&
          no(c['object']).type === 'Identifier' &&
          no(c['object'])['name'] === 'console' &&
          no(c['property'])['name'] === 'log'
        ) {
          if (nomes.has('console')) recusar(e, 'O nome console foi redefinido. Use Rodar para este código.');
          (e['arguments'] as No[]).forEach(expressao);
          return;
        }
        alteracao(e);
        return;
      }
      case 'IfStatement':
        expressao(no(n['test']));
        validar(no(n['consequent']));
        if (n['alternate']) validar(no(n['alternate']));
        return;
      case 'ForStatement':
        if (n['init']) {
          const inicio = no(n['init']);
          if (inicio.type === 'VariableDeclaration') declaracao(inicio);
          else alteracao(inicio);
        }
        if (n['test']) expressao(no(n['test']));
        if (n['update']) alteracao(no(n['update']));
        validar(no(n['body']));
        return;
      case 'ForOfStatement': {
        const esquerda = no(n['left']);
        if (n['await'] || esquerda.type !== 'VariableDeclaration' || (esquerda['declarations'] as No[]).length !== 1)
          recusar(n, 'Use for...of com uma variável let ou const neste modo.');
        declaracao(esquerda);
        expressao(no(n['right']));
        validar(no(n['body']));
        return;
      }
      case 'WhileStatement':
        expressao(no(n['test']));
        validar(no(n['body']));
        return;
      case 'BreakStatement':
      case 'ContinueStatement':
        if (n['label']) recusar(n, 'Rótulos de laço ainda não são acompanhados. Use Rodar.');
        return;
      default:
        recusar(
          n,
          'Este modo acompanha let/const, cálculos, if/else, for, for...of, while e console.log. Para outros comandos, use Rodar/Conferir.',
        );
    }
  }
  try {
    percorrer(programa);
    if (nomes.size > 16)
      recusar(programa, 'Esta versão acompanha até 16 nomes de variáveis. Use Rodar para este código.');
    validar(programa);
  } catch (erro) {
    return {
      ok: false,
      mensagem: erro instanceof Error ? erro.message : 'Use Rodar para este código.',
      linha: linhaFalha,
    };
  }
  let observador = '__mundojsPasso';
  while (identificadores.has(observador)) observador += '_';
  const original = (n: No) => codigo.slice(n.start, n.end);
  const campos = (escopo: string[]) =>
    `{${[...new Set(escopo)].map((nome) => `[${JSON.stringify(nome)}]:${nome}`).join(',')}}`;
  function evento(tipo: string, n: No, escopo: string[], valor = 'void 0') {
    const linha = ['fim', 'fim-laco', 'bloco', 'decisao'].includes(tipo) ? n.loc?.end.line : n.loc?.start.line;
    return `${observador}(${valor},${JSON.stringify(tipo)},${linha ?? 1},${campos(escopo)})`;
  }
  function substituir(n: No, trechos: Trecho[]) {
    let texto = original(n);
    for (const t of trechos.sort((a, b) => b.inicio - a.inicio))
      texto = texto.slice(0, t.inicio - n.start) + t.texto + texto.slice(t.fim - n.start);
    return texto;
  }
  const trecho = (n: No, texto: string): Trecho => ({ inicio: n.start, fim: n.end, texto });
  const novos = (n: No) => (n['declarations'] as No[]).map((d) => no(d['id'])['name'] as string);
  function bloco(n: No, escopo: string[], volta?: No) {
    const declaradas = new Set(
      (n['body'] as No[]).filter((item) => item.type === 'VariableDeclaration').flatMap(novos),
    );
    // Nomes locais ocultam os externos desde o começo do bloco, inclusive antes da inicialização.
    const locais = escopo.filter((nome) => !declaradas.has(nome));
    const prefixo = volta ? `${evento('volta', volta, locais)};` : '';
    const partes = (n['body'] as No[]).map((item) => trecho(item, instrucao(item, locais)));
    partes.push({ inicio: n.start + 1, fim: n.start + 1, texto: prefixo });
    return substituir(n, partes);
  }
  function corpo(n: No, escopo: string[], volta?: No): string {
    return n.type === 'BlockStatement'
      ? bloco(n, escopo, volta)
      : `{${volta ? `${evento('volta', volta, escopo)};` : ''}${instrucao(n, [...escopo])}}`;
  }
  function instrucao(n: No, escopo: string[]): string {
    switch (n.type) {
      case 'VariableDeclaration':
        escopo.push(...novos(n));
        return `${original(n)};${evento('declaracao', n, escopo)};`;
      case 'ExpressionStatement':
        return `${original(n)};${evento('instrucao', n, escopo)};`;
      case 'EmptyStatement':
        return original(n);
      case 'BreakStatement':
      case 'ContinueStatement':
        return `${evento(n.type === 'BreakStatement' ? 'break' : 'continue', n, escopo)};${original(n)}`;
      case 'BlockStatement':
        return `${bloco(n, escopo)};${evento('bloco', n, escopo)};`;
      case 'IfStatement': {
        const teste = no(n['test']);
        const sim = no(n['consequent']);
        const nao = n['alternate'] ? no(n['alternate']) : null;
        const partes = [
          trecho(teste, evento('condicao', teste, escopo, `(${original(teste)})`)),
          trecho(sim, corpo(sim, escopo)),
        ];
        if (nao) partes.push(trecho(nao, corpo(nao, escopo)));
        return `${substituir(n, partes)};${evento('decisao', n, escopo)};`;
      }
      default: {
        const locais = [...escopo];
        const inicio = n.type === 'ForOfStatement' ? no(n['left']) : n['init'] ? no(n['init']) : null;
        if (inicio?.type === 'VariableDeclaration') locais.push(...novos(inicio));
        const b = no(n['body']);
        const partes = [trecho(b, corpo(b, locais, n))];
        if (n['test']) {
          const teste = no(n['test']);
          partes.push(trecho(teste, evento('condicao', teste, locais, `(${original(teste)})`)));
        }
        return `${evento('laco', n, escopo)};${substituir(n, partes)};${evento('fim-laco', n, escopo)};`;
      }
    }
  }
  const escopo: string[] = [];
  const partes = (programa['body'] as No[]).map((n) => trecho(n, instrucao(n, escopo)));
  return {
    ok: true,
    observador,
    codigo: `${evento('inicio', programa, [])};${substituir(programa, partes)};${evento('fim', programa, escopo)};`,
  };
}
