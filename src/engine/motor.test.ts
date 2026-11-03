import { describe, expect, it, vi } from 'vitest';
import { analisar, NOME_DA_PROTECAO } from './analisar';
import { criarExecutor } from './executor';
import { rodar } from './rodar';
import { documentoDoIframe, scriptDoIframe } from './sandbox';
import type { ResultadoExecucao, TesteDefinicao } from './tipos';

const executor = criarExecutor();

function rodarLocal(
  codigo: string,
  testes: TesteDefinicao[] = [],
  opcoes: { esperaMaximaMs?: number; limiteDeVoltas?: number } = {},
): Promise<ResultadoExecucao> {
  return rodar(codigo, testes, executor, { esperaMaximaMs: 300, limiteDeVoltas: 100_000, ...opcoes });
}

const textos = (r: ResultadoExecucao) => r.saida.map((linha) => linha.texto);

describe('analisar: erros de escrita', () => {
  it('aponta a linha e explica em português', () => {
    const analise = analisar('const a = 1;\nconsole.log("oi);\n');
    expect(analise.ok).toBe(false);
    if (analise.ok) return;
    expect(analise.erro.nome).toBe('SyntaxError');
    expect(analise.erro.linha).toBe(2);
    expect(analise.erro.mensagem).toMatch(/aspas/);
  });

  it('código que termina aberto vira "falta fechar algo"', () => {
    const analise = analisar('function a() {\n  return 1;\n');
    expect(analise.ok).toBe(false);
    if (analise.ok) return;
    expect(analise.erro.mensagem).toMatch(/falta fechar/);
  });

  it('nome repetido e return solto têm mensagem própria', () => {
    const repetido = analisar('let x = 1;\nlet x = 2;');
    const solto = analisar('return 5;');
    expect(repetido.ok || repetido.erro.mensagem).toMatch(/“x” já foi declarada/);
    expect(solto.ok || solto.erro.mensagem).toMatch(/return só funciona dentro de uma função/);
  });

  it('um = no lugar de === é explicado', () => {
    const analise = analisar('if (1 = 1) {}');
    expect(analise.ok || analise.erro.mensagem).toMatch(/guardar/);
  });

  it('aceita await no nível de cima', () => {
    expect(analisar('await Promise.resolve(1);').ok).toBe(true);
  });
});

describe('analisar: nomes declarados', () => {
  it('acha variáveis, funções, classes e desestruturação do nível de cima', () => {
    const analise = analisar(
      [
        'const a = 1, b = 2;',
        'let { c, d: e, ...resto } = {};',
        'var [f, , g = 3] = [];',
        'function h() {}',
        'class I {}',
        'if (true) { const dentro = 1; }',
      ].join('\n'),
    );
    expect(analise.ok && analise.nomes.sort()).toEqual(['a', 'b', 'c', 'e', 'f', 'g', 'h', 'I', 'resto'].sort());
  });
});

describe('analisar: proteção contra laço infinito', () => {
  it('mantém todas as linhas no lugar', () => {
    const original = 'let i = 0;\nwhile (i < 3) {\n  i++;\n}\nfor (;;) break;\ndo i--; while (i > 0)\n';
    const analise = analisar(original);
    expect(analise.ok).toBe(true);
    if (!analise.ok) return;
    expect(analise.codigo.split('\n').length).toBe(original.split('\n').length);
    expect(analise.codigo.match(new RegExp(NOME_DA_PROTECAO, 'g'))).toHaveLength(3);
  });

  it('laços aninhados sem chaves continuam válidos', () => {
    const analise = analisar(
      'let n = 0;\nfor (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) n++;\nconsole.log(n);',
    );
    expect(analise.ok).toBe(true);
  });
});

describe('executar: saída', () => {
  it('mostra o que o aluno imprime, como o navegador mostraria', async () => {
    const r = await rodarLocal(
      [
        'console.log("Olá", 42, true, null, undefined);',
        'console.log([1, "dois", [3]]);',
        'console.log({ nome: "Ana", idade: 25, "a-b": 1 });',
        'console.log(-0, 10n, [1, , 3]);',
        'function soma() {}',
        'class Gato {}',
        'console.log(soma, Gato, () => 1);',
        'console.log(new Map([["a", 1]]), new Set([1, 2]));',
        'console.log("%s tem %d anos", "Ana", 25);',
        'console.log(new Error("x"));',
      ].join('\n'),
    );
    expect(r.erro).toBeNull();
    expect(textos(r)).toEqual([
      'Olá 42 true null undefined',
      "[ 1, 'dois', [ 3 ] ]",
      "{ nome: 'Ana', idade: 25, 'a-b': 1 }",
      '-0 10n [ 1, <1 item vazio>, 3 ]',
      '[Function: soma] [class Gato] [Function (anonymous)]',
      "Map(1) { 'a' => 1 } Set(2) { 1, 2 }",
      'Ana tem 25 anos',
      'Error: x',
    ]);
  });

  it('não trava com objeto circular e quebra linhas longas', async () => {
    const r = await rodarLocal(
      'const a = { nome: "x" };\na.eu = a;\nconsole.log(a);\nconsole.log(Array.from({ length: 30 }, (_, i) => "item numero " + i));',
    );
    expect(textos(r)[0]).toBe("{ nome: 'x', eu: [Circular] }");
    expect(textos(r)[1]).toContain("\n  'item numero 0',");
  });

  it('warn e error ganham tipos próprios, e console.table desenha uma tabela', async () => {
    const r = await rodarLocal('console.warn("a");\nconsole.error("b");\nconsole.table([{ x: 1 }, { x: 2 }]);');
    expect(r.saida.map((l) => l.tipo)).toEqual(['aviso', 'erro', 'log']);
    expect(r.saida[2]?.texto).toContain('(índice)');
  });

  it('corta uma saída enorme', async () => {
    const r = await rodarLocal('for (let i = 0; i < 2000; i++) console.log(i);');
    expect(r.saida.length).toBeLessThanOrEqual(501);
    expect(r.saida.at(-1)?.texto).toMatch(/cortada/);
  });
});

describe('executar: erros', () => {
  it('traduz o erro e diz a linha do código do aluno', async () => {
    const r = await rodarLocal('const a = 1;\n\nconsole.log(a);\nconsole.log(nomeQueNaoExiste);');
    expect(r.erro).toMatchObject({ nome: 'ReferenceError', linha: 4 });
    expect(r.erro?.mensagem).toBe('Não existe nada chamado “nomeQueNaoExiste”.');
    expect(textos(r)).toEqual(['1']);
  });

  it('const reatribuída e propriedade de undefined têm mensagem própria', async () => {
    const a = await rodarLocal('const x = 1;\nx = 2;');
    const b = await rodarLocal('const p = undefined;\nconsole.log(p.nome);');
    expect(a.erro?.mensagem).toMatch(/mudar o valor de uma const/);
    expect(b.erro?.mensagem).toBe('Você tentou ler “nome” de algo que é undefined.');
    expect(b.erro?.linha).toBe(2);
  });

  it('variável sem let/const dá erro, como em projeto de verdade', async () => {
    const r = await rodarLocal('valor = 5;');
    expect(r.erro?.nome).toBe('ReferenceError');
  });

  it('erro dentro de uma função diz a linha do erro, não a da chamada', async () => {
    const r = await rodarLocal('function a() {\n  return b.c;\n}\na();');
    expect(r.erro?.linha).toBe(2);
  });

  it('recursão sem parada vira aviso, não trava', async () => {
    const r = await rodarLocal('function f() { return f(); }\nf();');
    expect(r.erro?.mensagem).toMatch(/chamou a si mesma/);
  });

  it('erro lançado dentro de um setTimeout é capturado', async () => {
    const r = await rodarLocal('setTimeout(() => { throw new Error("dentro"); }, 10);');
    expect(r.erro?.mensagem).toBe('dentro');
  });

  it('promessa rejeitada sem tratamento no nível de cima é capturada', async () => {
    const r = await rodarLocal('await Promise.reject(new Error("falhou"));');
    expect(r.erro?.mensagem).toBe('falhou');
  });
});

describe('executar: laço infinito', () => {
  it.each([
    ['while (true) {}'],
    ['for (;;) {}'],
    ['let i = 0; do { i++; } while (true);'],
    ['for (const x of { [Symbol.iterator]: () => ({ next: () => ({ done: false, value: 1 }) }) }) {}'],
    ['while (true) ;'],
  ])('interrompe %s', async (codigo) => {
    const inicio = Date.now();
    const r = await rodarLocal(codigo, [], { limiteDeVoltas: 50_000 });
    expect(r.erro?.nome).toBe('LacoInfinito');
    expect(r.erro?.mensagem).toMatch(/Parece um laço infinito/);
    expect(r.erro?.dica).toBeDefined();
    expect(Date.now() - inicio).toBeLessThan(2000);
  });

  it('um laço comprido, mas finito, roda normalmente', async () => {
    const r = await rodarLocal('let s = 0;\nfor (let i = 0; i < 20000; i++) s += i;\nconsole.log(s);');
    expect(r.erro).toBeNull();
    expect(textos(r)).toEqual(['199990000']);
  });
});

describe('executar: temporizadores', () => {
  it('espera os setTimeout terminarem antes de dar a saída por completa', async () => {
    const r = await rodarLocal('setTimeout(() => console.log("depois"), 50);\nconsole.log("antes");');
    expect(textos(r)).toEqual(['antes', 'depois']);
  });

  it('um setInterval que o código mesmo para termina sozinho', async () => {
    const r = await rodarLocal(
      'let n = 0;\nconst id = setInterval(() => {\n  n++;\n  console.log(n);\n  if (n === 3) clearInterval(id);\n}, 10);',
    );
    expect(textos(r)).toEqual(['1', '2', '3']);
  });

  it('um setInterval esquecido é encerrado com um aviso', async () => {
    const r = await rodarLocal('setInterval(() => console.log("tic"), 20);', [], { esperaMaximaMs: 120 });
    expect(r.saida.at(-1)).toMatchObject({ tipo: 'aviso' });
    expect(r.saida.at(-1)?.texto).toMatch(/setInterval ativo/);
  });

  it('await de uma pausa funciona no nível de cima', async () => {
    const r = await rodarLocal('await new Promise((ok) => setTimeout(ok, 30));\nconsole.log("passou");');
    expect(textos(r)).toEqual(['passou']);
  });
});

describe('testes da lição', () => {
  const dobro = 'function dobro(n) {\n  return n * 2;\n}\n';

  it('passam quando o código está certo', async () => {
    const r = await rodarLocal(dobro, [
      { descricao: 'dobro(2)', codigo: "igual(dobro(2), 4, 'dobro(2)')" },
      { descricao: 'tem return', codigo: "verdadeiro(codigoDoAluno.includes('return'), 'Use return.')" },
    ]);
    expect(r.testes.map((t) => t.passou)).toEqual([true, true]);
  });

  it('falham com a mensagem do que veio e do que era esperado', async () => {
    const r = await rodarLocal('function dobro(n) {\n  return n + 2;\n}', [
      { descricao: 'dobro(5)', codigo: "igual(dobro(5), 10, 'dobro(5)')" },
      { descricao: 'sem rótulo', codigo: 'igual("Aprovado", "Reprovado")' },
    ]);
    expect(r.testes[0]).toMatchObject({ passou: false, mensagem: 'dobro(5) deveria ser 10, mas foi 7.' });
    expect(r.testes[1]?.mensagem).toBe("Era esperado 'Reprovado', mas veio 'Aprovado'.");
  });

  it('comparam listas e objetos pelo conteúdo, não pela identidade', async () => {
    const r = await rodarLocal('const lista = [1, { a: [2] }];', [
      { descricao: 'a', codigo: 'igual(lista, [1, { a: [2] }])' },
      { descricao: 'b', codigo: 'igual(lista, [1, { a: [3] }])' },
    ]);
    expect(r.testes.map((t) => t.passou)).toEqual([true, false]);
  });

  it('enxergam a saída do aluno', async () => {
    const r = await rodarLocal('console.log("Olá, mundo!");', [
      { descricao: 'saida', codigo: "igual(saida[0], 'Olá, mundo!', 'A primeira linha')" },
    ]);
    expect(r.testes[0]?.passou).toBe(true);
  });

  it('pedem para criar o que ainda não existe, em vez de mostrar "is not defined"', async () => {
    const r = await rodarLocal('const outra = 1;', [{ descricao: 'x', codigo: 'igual(soma(1, 2), 3)' }]);
    expect(r.testes[0]?.mensagem).toBe('Seu código ainda não tem “soma”. Crie e confira de novo.');
  });

  it('um teste não passa por cima de um erro no código do aluno', async () => {
    const r = await rodarLocal('function a() {}\nnaoExiste();', [{ descricao: 'x', codigo: 'igual(1, 1)' }]);
    expect(r.erro?.linha).toBe(2);
    expect(r.testes[0]?.passou).toBe(false);
    expect(r.testes[0]?.mensagem).toMatch(/deu erro antes de terminar/);
  });

  it('a função do aluno com laço infinito falha o teste em vez de travar', async () => {
    const r = await rodarLocal('function f() { while (true) {} }', [{ descricao: 'x', codigo: 'f()' }], {
      limiteDeVoltas: 10_000,
    });
    expect(r.testes[0]?.passou).toBe(false);
    expect(r.testes[0]?.mensagem).toMatch(/laço rodou mais de/);
  });

  it('erro de escrita não roda nada e marca os testes como não feitos', async () => {
    const r = await rodarLocal('console.log("oi', [{ descricao: 'x', codigo: 'igual(1, 1)' }]);
    expect(r.erro?.nome).toBe('SyntaxError');
    expect(r.testes[0]?.passou).toBe(false);
  });

  it('um nome do aluno igual ao de um ajudante não quebra o teste', async () => {
    const r = await rodarLocal('const igual = 5;\nconsole.log(igual);', [{ descricao: 'x', codigo: 'igual(1, 1)' }]);
    expect(r.testes[0]?.passou).toBe(true);
  });
});

describe('o executor é autocontido', () => {
  it('funciona recriado só a partir do próprio texto', async () => {
    // É assim que ele chega ao iframe: como texto, sem nada do módulo em volta.
    const recriado = new Function(`return (${criarExecutor.toString()})()`)() as ReturnType<typeof criarExecutor>;
    const r = await rodar(
      'function dobro(n) { return n * 2; }\nconsole.log([dobro(2)]);\nfor (let i = 0; i < 3; i++) {}',
      [{ descricao: 'dobro', codigo: 'igual(dobro(3), 6)' }],
      recriado,
    );
    expect(r.erro).toBeNull();
    expect(textos(r)).toEqual(['[ 4 ]']);
    expect(r.testes[0]?.passou).toBe(true);
  });
});

describe('o iframe do executor', () => {
  it('o documento tem um único script, sem rede e sem nada de fora', () => {
    const documento = documentoDoIframe();
    expect(documento.match(/<script>/g)).toHaveLength(1);
    expect(documento.match(/<\/script>/g)).toHaveLength(1);
    expect(documento).toContain("default-src 'none'");
    expect(documento).not.toMatch(/connect-src|http:\/\/|https:\/\//);
  });

  it('avisa que está pronto e responde ao pedido com o resultado', async () => {
    const enviadas: Array<Record<string, unknown>> = [];
    let ouvinte: ((evento: { data: unknown }) => void) | undefined;
    const janela = { addEventListener: (nome: string, f: typeof ouvinte) => nome === 'message' && (ouvinte = f) };
    const pai = { postMessage: (mensagem: Record<string, unknown>) => enviadas.push(mensagem) };
    new Function('window', 'parent', scriptDoIframe())(janela, pai);

    expect(enviadas[0]).toEqual({ tipo: 'pronto' });

    const analise = analisar('console.log("oi");');
    if (!analise.ok) throw new Error('código de exemplo inválido');
    ouvinte?.({
      data: {
        tipo: 'executar',
        id: 'x1',
        pedido: {
          codigo: analise.codigo,
          codigoOriginal: 'console.log("oi");',
          nomes: [],
          testes: [],
          esperaMaximaMs: 50,
          limiteDeVoltas: 1000,
        },
      },
    });
    await vi.waitFor(() => expect(enviadas).toHaveLength(2));
    expect(enviadas[1]).toMatchObject({ tipo: 'resultado', id: 'x1' });
    expect((enviadas[1]?.['resultado'] as { saida: unknown[] }).saida).toEqual([{ tipo: 'log', texto: 'oi' }]);
  });

  it('ignora mensagens que não são pedidos de execução', () => {
    const enviadas: unknown[] = [];
    let ouvinte: ((evento: { data: unknown }) => void) | undefined;
    const janela = { addEventListener: (_: string, f: typeof ouvinte) => (ouvinte = f) };
    new Function('window', 'parent', scriptDoIframe())(janela, { postMessage: (m: unknown) => enviadas.push(m) });
    ouvinte?.({ data: null });
    ouvinte?.({ data: { tipo: 'outra-coisa' } });
    expect(enviadas).toHaveLength(1);
  });
});
