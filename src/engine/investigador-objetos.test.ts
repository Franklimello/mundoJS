import { describe, expect, it } from 'vitest';
import { analisar } from './analisar';
import { criarExecutor } from './executor';
import { rodar } from './rodar';

const executor = criarExecutor();
const executar = (codigo: string) => rodar(codigo, [], executor, { esperaMaximaMs: 50 });
const textos = (resultado: Awaited<ReturnType<typeof executar>>) => resultado.saida.map((linha) => linha.texto);

describe('investigador de propriedades de objetos', () => {
  it('deduplica propriedades longas sem expor textos ilimitados na observação', async () => {
    const resultado = await executar(`const aluno = {}; const chave = 'x'.repeat(500);
for (let i = 0; i < 5; i++) console.log(aluno[chave]);`);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoesObjetos).toHaveLength(1);
    expect(resultado.investigacoesObjetos?.[0]?.propriedade.length).toBe(120);
    expect(resultado.investigacoesObjetos?.[0]?.propriedade.endsWith('…')).toBe(true);
    expect(resultado.saida).toHaveLength(5);
  });
  it('mostra a propriedade ausente e os dados no instante de uma leitura por ponto', async () => {
    const resultado = await executar(
      'const aluno = { nome: "Ana", idade: 20 };\nconsole.log(aluno.Nome);\naluno.idade = 21;',
    );
    expect(resultado.erro).toBeNull();
    expect(textos(resultado)).toEqual(['undefined']);
    expect(resultado.investigacoesObjetos).toEqual([
      {
        objeto: 'aluno',
        propriedade: 'Nome',
        acesso: 'aluno.Nome',
        linha: 2,
        coluna: 13,
        propriedades: [
          { nome: 'nome', valor: "'Ana'" },
          { nome: 'idade', valor: '20' },
        ],
        haMais: false,
      },
    ]);
  });

  it('avalia chaves dinâmicas uma vez e mantém a coerção de chaves com efeitos', async () => {
    const resultado = await executar(`const aluno = { nome: 'Ana' }; let vezes = 0;
function campo() { vezes++; return 'idade'; }
console.log(aluno[campo()], vezes);
const chave = { toString() { vezes++; return 'nome'; } };
console.log(aluno[chave], vezes);`);
    expect(resultado.erro).toBeNull();
    expect(textos(resultado)).toEqual(['undefined 1', 'Ana 2']);
    expect(resultado.investigacoesObjetos?.[0]).toMatchObject({ propriedade: 'idade', acesso: 'aluno["idade"]' });
    expect(resultado.investigacoesObjetos).toHaveLength(1);
  });

  it('não acusa campos definidos como undefined nem acessores ou propriedades herdadas', async () => {
    const resultado = await executar(`let leituras = 0;
const aluno = { idade: undefined, get opcional() { leituras++; return undefined; } };
const herdado = Object.create({ opcional: undefined });
console.log(aluno.idade, aluno.opcional, herdado.opcional, typeof aluno.toString, leituras);`);
    expect(resultado.erro).toBeNull();
    expect(textos(resultado)).toEqual(['undefined undefined undefined function 1']);
    expect(resultado.investigacoesObjetos).toBeUndefined();
  });

  it('não confunde instâncias, tipos nativos, símbolos e cadeias opcionais com objetos simples', async () => {
    const resultado = await executar(`class Aluno {} const aluno = new Aluno();
const data = new Date(); const mapa = new Map(); const texto = 'Ana';
const vazio = {}; const nada = null; let i = 0;
console.log(aluno.nome, data.nome, mapa.nome, texto.nome, vazio[Symbol('nome')], nada?.[i++], i);`);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoesObjetos).toBeUndefined();
    expect(textos(resultado)[0]).toMatch(/ 0$/);
  });

  it('fotografa descritores sem invocar acessores nem ler objetos aninhados', async () => {
    const resultado = await executar(`let leituras = 0;
const aluno = { get nome() { leituras++; return 'Ana'; }, dados: { get segredo() { leituras++; return 42; } } };
console.log(aluno.idade, leituras);`);
    expect(textos(resultado)).toEqual(['undefined 0']);
    expect(resultado.investigacoesObjetos?.[0]?.propriedades).toEqual([
      { nome: 'nome', valor: '(acessor: valor não lido)' },
      { nome: 'dados', valor: '[objeto]' },
    ]);
  });

  it('suporta objetos vazios e sem protótipo, inclusive propriedades não enumeráveis', async () => {
    const resultado = await executar(`const vazio = {}; const aluno = Object.create(null);
Object.defineProperty(aluno, 'nome', { value: 'Ana' });
console.log(vazio.idade, aluno.idade);`);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoesObjetos?.[0]?.propriedades).toEqual([]);
    expect(resultado.investigacoesObjetos?.[1]?.propriedades).toEqual([{ nome: 'nome', valor: "'Ana'" }]);
  });

  it('preserva alvos de escrita e receptores de métodos, construtores e tags', async () => {
    const resultado = await executar(`const aluno = { total: 1, mesmo() { return this === aluno; }, Tipo: class {} };
aluno.total++; aluno.idade = 20; ({ idade: aluno.total } = { idade: 30 });
for (aluno.total of [40]) {}
const pessoa = new aluno.Tipo();
const tag = { formatar() { return this === tag; } };
delete aluno.idade; console.log(aluno.mesmo(), aluno.total, pessoa instanceof aluno.Tipo, tag.formatar${'`x`'});`);
    expect(resultado.erro).toBeNull();
    expect(textos(resultado)).toEqual(['true 40 true true']);
    expect(resultado.investigacoesObjetos).toBeUndefined();
  });

  it('mantém linhas, comentários, nomes Unicode e corpos de laço sem chaves ou ponto e vírgula', async () => {
    const codigo = `const aluno = {}; const outro = { preço: 10 };
for (let i = 0; i < 1; i++) aluno.idade
console.log(aluno /* . */ .
  nome, outro.preço);`;
    const analise = analisar(codigo);
    expect(analise.ok && analise.codigo.split('\n').length).toBe(codigo.split('\n').length);
    const resultado = await executar(codigo);
    expect(resultado.erro).toBeNull();
    expect(textos(resultado)).toEqual(['undefined 10']);
    expect(resultado.investigacoesObjetos?.map((item) => item.linha)).toEqual([2, 3]);
  });

  it('mantém o limite conjunto de três observações e limita a fotografia de objetos', async () => {
    const resultado =
      await executar(`const aluno = Object.fromEntries(Array.from({ length: 12 }, (_, i) => ['campo' + i, 'x'.repeat(200)]));
const lista = [];
for (let i = 0; i < 10; i++) console.log(aluno.ausente);
console.log(lista[1], aluno.outro, aluno.ultimo);`);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoesObjetos).toHaveLength(2);
    expect(resultado.investigacoes).toHaveLength(1);
    expect(resultado.investigacoesObjetos?.[0]).toMatchObject({ haMais: true });
    expect(resultado.investigacoesObjetos?.[0]?.propriedades).toHaveLength(8);
    expect(resultado.investigacoesObjetos?.[0]?.propriedades[0]?.valor.length).toBe(120);
    expect(resultado.saida).toHaveLength(11);
  });

  it('não investiga ramos não executados nem chamadas produzidas somente pelo corretor', async () => {
    const resultado = await rodar(
      `function ler(aluno) { return aluno.idade; }
const aluno = {}; if (false) console.log(aluno.nome);`,
      [{ descricao: 'Pode devolver undefined', codigo: 'igual(ler({}), undefined);' }],
      executor,
    );
    expect(resultado.erro).toBeNull();
    expect(resultado.testes[0]?.passou).toBe(true);
    expect(resultado.investigacoesObjetos).toBeUndefined();
  });

  it('conserva os erros reais para null e a leitura por funções de um executor serializado', async () => {
    const falha = await executar('const aluno = null;\nconsole.log(aluno.nome);');
    expect(falha.erro).toMatchObject({ nome: 'TypeError', linha: 2 });
    expect(falha.investigacoesObjetos).toBeUndefined();
    const serializado = (0, eval)(`(${criarExecutor.toString()})`)() as ReturnType<typeof criarExecutor>;
    const resultado = await rodar(
      'function ler(aluno) { return aluno.idade; }\nconsole.log(ler({ nome: "Ana" }));',
      [],
      serializado,
    );
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoesObjetos?.[0]).toMatchObject({ objeto: 'aluno', propriedade: 'idade', linha: 1 });
  });
});
