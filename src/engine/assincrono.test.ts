import { describe, expect, it } from 'vitest';
import { analisar } from './analisar';
import { criarExecutor } from './executor';
import { rodar } from './rodar';

const executor = criarExecutor();
const dormir = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms));

describe('código assíncrono do aluno', () => {
  it('await no nível de cima, then e catch funcionam juntos', async () => {
    const r = await rodar(
      [
        'const esperar = (ms, valor) => new Promise((ok) => setTimeout(() => ok(valor), ms));',
        'console.log(await esperar(10, "a"));',
        'await esperar(10).then(() => console.log("then"));',
        'await Promise.reject(new Error("falhou")).catch((erro) => console.log("pegou", erro.message));',
      ].join('\n'),
      [],
      executor,
      { esperaMaximaMs: 300 },
    );
    expect(r.erro).toBeNull();
    expect(r.saida.map((l) => l.texto)).toEqual(['a', 'then', 'pegou falhou']);
  });

  it('try/catch pega a rejeição de um await', async () => {
    const r = await rodar(
      [
        'async function buscar(id) {',
        '  if (id < 1) throw new Error("id inválido");',
        '  return "item " + id;',
        '}',
        'for (const id of [1, 0]) {',
        '  try {',
        '    console.log(await buscar(id));',
        '  } catch (erro) {',
        '    console.log("falhou:", erro.message);',
        '  }',
        '}',
      ].join('\n'),
      [],
      executor,
    );
    expect(r.erro).toBeNull();
    expect(r.saida.map((l) => l.texto)).toEqual(['item 1', 'falhou: id inválido']);
  });

  it('a ordem é: código normal, promessas, e só depois os temporizadores', async () => {
    const r = await rodar(
      [
        'console.log("A");',
        'setTimeout(() => console.log("D"), 0);',
        'Promise.resolve().then(() => console.log("C"));',
        'console.log("B");',
      ].join('\n'),
      [],
      executor,
      { esperaMaximaMs: 300 },
    );
    expect(r.saida.map((l) => l.texto)).toEqual(['A', 'B', 'C', 'D']);
  });
});

describe('testes que esperam promessas', () => {
  const opcoes = { esperaMaximaMs: 100, limiteDoTesteMs: 100, orcamentoDosTestesMs: 1000 };

  it('um teste que espera uma função async confere o valor depois de esperar', async () => {
    const r = await rodar(
      'async function dobrar(n) { await new Promise((ok) => setTimeout(ok, 10)); return n * 2; }',
      [{ descricao: 'dobra', codigo: "igual(await dobrar(4), 8, 'dobrar(4)')" }],
      executor,
      opcoes,
    );
    expect(r.testes[0]?.passou).toBe(true);
  });

  it('uma promessa que nunca termina vira uma mensagem clara, e não trava', async () => {
    const inicio = Date.now();
    const r = await rodar(
      'function parado() { return new Promise(() => {}); }',
      [{ descricao: 'espera', codigo: 'await parado();' }],
      executor,
      opcoes,
    );
    expect(r.testes[0]?.passou).toBe(false);
    expect(r.testes[0]?.mensagem).toBe(
      'Sua função não terminou em 100 milissegundos. Se ela devolve uma promessa, confira se ela é resolvida em algum momento.',
    );
    expect(Date.now() - inicio).toBeLessThan(1500);
  });

  it('o tempo total dos testes é limitado: depois que acaba, os seguintes falham de uma vez', async () => {
    const inicio = Date.now();
    const parado = { descricao: '', codigo: 'await parado();' };
    const r = await rodar(
      'function parado() { return new Promise(() => {}); }',
      [
        { ...parado, descricao: 'um' },
        { ...parado, descricao: 'dois' },
        { ...parado, descricao: 'três' },
      ],
      executor,
      { esperaMaximaMs: 100, limiteDoTesteMs: 100, orcamentoDosTestesMs: 150 },
    );
    expect(r.testes.map((t) => t.passou)).toEqual([false, false, false]);
    expect(r.testes[0]?.mensagem).toMatch(/não terminou em 100 milissegundos/);
    expect(r.testes[2]?.mensagem).toMatch(/parou de esperar/);
    expect(Date.now() - inicio).toBeLessThan(1500);
  });

  it('um teste que espera um erro (rejeição) consegue pegá-lo', async () => {
    const r = await rodar(
      'function falhar() { return Promise.reject(new Error("não achei")); }',
      [
        {
          descricao: 'rejeita',
          codigo: [
            'let erro = null;',
            'try { await falhar(); } catch (e) { erro = e; }',
            "igual(erro?.message, 'não achei', 'A mensagem do erro')",
          ].join('\n'),
        },
      ],
      executor,
      opcoes,
    );
    expect(r.testes[0]?.passou).toBe(true);
  });

  it('temporizadores armados pelo código durante os testes não sobrevivem à execução', async () => {
    const global = globalThis as { __tics?: number };
    delete global.__tics;
    await rodar(
      'function iniciar() { setInterval(() => { globalThis.__tics = (globalThis.__tics ?? 0) + 1; }, 10); }',
      [{ descricao: 'inicia', codigo: 'iniciar(); await new Promise((ok) => setTimeout(ok, 50));' }],
      executor,
      opcoes,
    );
    const ao_terminar = global.__tics;
    await dormir(80);
    expect(ao_terminar).toBeGreaterThan(0);
    expect(global.__tics).toBe(ao_terminar);
    delete global.__tics;
  });
});

describe('mensagens de erro do código assíncrono', () => {
  it('await dentro de função sem async explica o que falta', () => {
    for (const codigo of [
      'function f() {\n  const x = await g();\n}',
      'const f = () => {\n  await g();\n};',
      'function f() { return await g(); }',
    ]) {
      const analise = analisar(codigo);
      expect(analise.ok).toBe(false);
      if (analise.ok) continue;
      expect(analise.erro.mensagem).toBe('Você usou await dentro de uma função que não é async.');
      expect(analise.erro.dica).toMatch(/async antes de function/);
    }
  });

  it('await dentro de async, e no nível de cima, continua válido', () => {
    expect(analisar('async function f() {\n  await g();\n}\nawait f();').ok).toBe(true);
    expect(analisar('const f = async () => { await g(); };').ok).toBe(true);
  });

  it('usar .then no que não é promessa pede o return', async () => {
    const r = await rodar('function buscar() {}\nbuscar().then(() => {});', [], executor);
    expect(r.erro?.mensagem).toBe('Você usou .then em algo que não é uma promessa (veio undefined).');
    expect(r.erro?.dica).toMatch(/return/);
    expect(r.erro?.linha).toBe(2);
  });

  it('uma promessa rejeita sem tratamento no nível de cima: o erro aparece na linha certa', async () => {
    const r = await rodar('const a = 1;\nawait Promise.reject(new Error("quebrou"));', [], executor);
    expect(r.erro?.mensagem).toBe('quebrou');
    expect(r.erro?.linha).toBe(2);
  });
});
