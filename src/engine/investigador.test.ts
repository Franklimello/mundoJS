import { describe, expect, it } from 'vitest';
import { analisar } from './analisar';
import { criarExecutor } from './executor';
import { rodar } from './rodar';

const executar = criarExecutor();
const executarCodigo = (codigo: string) => rodar(codigo, [], executar, { esperaMaximaMs: 50 });
const saida = (resultado: Awaited<ReturnType<typeof executarCodigo>>) => resultado.saida.map((item) => item.texto);

describe('investigador de índices durante a execução real', () => {
  it('explica o acesso fora do array com a fotografia e a linha originais', async () => {
    const resultado = await executarCodigo('const numeros = [10, 20, 30];\nconsole.log(numeros[3]);');
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['undefined']);
    expect(resultado.investigacoes).toEqual([
      {
        array: 'numeros',
        indice: 3,
        tamanho: 3,
        linha: 2,
        coluna: 13,
        itens: [
          { indice: 0, valor: '10' },
          { indice: 1, valor: '20' },
          { indice: 2, valor: '30' },
        ],
      },
    ]);
  });

  it('usa os valores do instante do acesso, inclusive dentro de funções e laços', async () => {
    const resultado = await executarCodigo(`const frutas = ['laranja', 'mamão'];
function ler(lista, indice) { return lista[indice]; }
for (let i = 0; i <= frutas.length; i++) console.log(ler(frutas, i));
frutas.push('uva');`);
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['laranja', 'mamão', 'undefined']);
    expect(resultado.investigacoes?.[0]).toMatchObject({ array: 'lista', tamanho: 2, indice: 2, linha: 2 });
    expect(resultado.investigacoes?.[0]?.itens.map((item) => item.valor)).toEqual(["'laranja'", "'mamão'"]);
  });

  it('não confunde valores undefined válidos, posições vazias e propriedades de objetos com índices fora do array', async () => {
    const resultado = await executarCodigo(`const lista = [undefined, , 3];
const objeto = {};
console.log(lista[0], lista[1], objeto[4]);
if (false) console.log(lista[10]);`);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoes).toBeUndefined();
    expect(resultado.investigacoesObjetos?.[0]).toMatchObject({ objeto: 'objeto', propriedade: '4' });
  });

  it('trata arrays vazios, índices negativos e índices numéricos em texto', async () => {
    const resultado = await executarCodigo(`const vazia = []; const itens = [5];
console.log(vazia[0], itens[-1], itens['2']);`);
    expect(resultado.investigacoes?.map(({ indice, tamanho }) => ({ indice, tamanho }))).toEqual([
      { indice: 0, tamanho: 0 },
      { indice: -1, tamanho: 1 },
      { indice: 2, tamanho: 1 },
    ]);
  });

  it('avalia o índice uma só vez e preserva a ordem dos efeitos', async () => {
    const resultado = await executarCodigo(`let lista = [1]; let i = 1;
console.log(lista[i++], i);
console.log(lista[(lista = [7, 8, 9], 2)]);
console.log(lista[2]);`);
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['undefined 2', 'undefined', '9']);
    expect(resultado.investigacoes?.map(({ tamanho }) => tamanho)).toEqual([1, 1]);
  });

  it('preserva escritas, atualização, delete, desestruturação e o this de métodos', async () => {
    const resultado = await executarCodigo(`const lista = [1]; lista[0]++; lista[1] = 4;
[lista[2]] = [6]; for (lista[0] of [8]) {}
const metodos = [function () { return this === metodos; }];
console.log(lista, metodos[0]()); delete lista[1]; console.log(lista[0]);`);
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['[ 8, 4, 6 ] true', '8']);
    expect(resultado.investigacoes).toBeUndefined();
  });

  it('preserva a avaliação preguiçosa de cadeias opcionais e a coerção de chaves', async () => {
    const resultado = await executarCodigo(`const nada = null; let vezes = 0;
const lista = [7]; const chave = { toString() { vezes++; return '0'; } };
console.log(nada?.[vezes++], lista[chave], vezes);`);
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['undefined 7 1']);
    expect(resultado.investigacoes).toBeUndefined();
  });

  it('não dispara acessores nem percorre objetos para montar a fotografia', async () => {
    const resultado = await executarCodigo(`let leituras = 0;
const lista = [{ get valor() { leituras++; return 1; } }];
Object.defineProperty(lista, '1', { get() { leituras++; return 2; } });
console.log(lista[4], leituras);`);
    expect(saida(resultado)).toEqual(['undefined 0']);
    expect(resultado.investigacoes?.[0]?.itens).toEqual([
      { indice: 0, valor: '[objeto]' },
      { indice: 1, valor: '(acessor: valor não lido)' },
    ]);
  });

  it('limita e deduplica observações sem cortar a saída ou transformar observações em reprovação', async () => {
    const resultado = await rodar(
      `const itens = Array.from({length: 20}, (_, i) => 'x'.repeat(200));
for (let i = 0; i < 30; i++) console.log(itens[30]);
console.log(itens[31], itens[32], itens[33]);`,
      [{ descricao: 'O programa terminou', codigo: 'verdadeiro(true);' }],
      executar,
    );
    expect(resultado.erro).toBeNull();
    expect(resultado.testes[0]?.passou).toBe(true);
    expect(resultado.investigacoes).toHaveLength(3);
    expect(resultado.investigacoes?.[0]?.itens).toHaveLength(8);
    expect(resultado.investigacoes?.[0]?.itens[0]?.valor.length).toBe(120);
    expect(resultado.saida).toHaveLength(31);
  });

  it('não mostra como execução do aluno os acessos produzidos somente pelos testes', async () => {
    const resultado = await rodar(
      'function buscar(lista) { return lista[9]; }',
      [{ descricao: 'Pode devolver undefined', codigo: 'igual(buscar([1]), undefined);' }],
      executar,
    );
    expect(resultado.testes[0]?.passou).toBe(true);
    expect(resultado.investigacoes).toBeUndefined();
  });

  it('mantém linhas, comentários entre colchetes, leituras aninhadas e await', async () => {
    const codigo = `const itens = [10]; const indices = [2];
console.log(itens /* [ comentário */ [
  await Promise.resolve(indices[0])
]);`;
    const analise = analisar(codigo);
    expect(analise.ok && analise.codigo.split('\n').length).toBe(codigo.split('\n').length);
    const resultado = await executarCodigo(codigo);
    expect(resultado.erro).toBeNull();
    expect(resultado.investigacoes?.[0]).toMatchObject({ array: 'itens', indice: 2, linha: 2 });
  });

  it('escolhe um nome que não colide com declarações do aluno e é autocontido no iframe', async () => {
    const executorSerializado = (0, eval)(`(${criarExecutor.toString()})`)() as ReturnType<typeof criarExecutor>;
    const resultado = await rodar(
      `const __mundojsLerIndice = 42;
const __mundojsLerIndice_ = 43; const itens = [];
console.log(itens[0], __mundojsLerIndice, __mundojsLerIndice_);`,
      [],
      executorSerializado,
    );
    expect(resultado.erro).toBeNull();
    expect(saida(resultado)).toEqual(['undefined 42 43']);
    expect(resultado.investigacoes).toHaveLength(1);
  });
});
