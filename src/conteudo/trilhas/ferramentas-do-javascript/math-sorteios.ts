import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const mathSorteios: Licao = {
  slug: 'math-sorteios',
  titulo: 'Math: sorteios simples',
  resumo: 'random e floor para sortear números e escolher itens.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`Math.random()` produz um número maior ou igual a 0 e menor que 1. Cada chamada pode produzir outro valor. Por isso, não existe uma saída fixa para um sorteio.',
    },
    {
      tipo: 'p',
      texto:
        'Para obter um inteiro de 0 a 5, multiplique o sorteio por 6 e use `Math.floor`. Somando 1, você passa a ter valores de 1 a 6, como as faces de um dado.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const exemplo = 0.7;',
        'console.log(Math.floor(exemplo * 6));',
        'console.log(Math.floor(exemplo * 6) + 1);',
      ),
      saida: linhas('4', '5'),
    },
    {
      tipo: 'p',
      texto:
        'O exemplo usa um valor fixo só para mostrar a conta. No seu sorteio, troque esse valor por `Math.random()`. Prefira floor a round: arredondar para o inteiro mais próximo deixa as pontas com probabilidades diferentes.',
    },
    {
      tipo: 'p',
      texto:
        'Para escolher um item de um array, sorteie um índice de 0 até um antes do tamanho da lista: `Math.floor(Math.random() * itens.length)`. Depois, leia o item nesse índice.',
    },
    {
      tipo: 'nota',
      texto:
        'Use Math.random em demonstrações e brincadeiras simples. Para senhas ou tokens, use as ferramentas de criptografia da plataforma. A correção destas atividades controla temporariamente o sorteio para conferir os limites; ela não exige que você tenha sorte ao clicar em Conferir.',
    },
  ],
  exercicios: [
    {
      titulo: 'Role um dado',
      enunciado: [
        { tipo: 'p', texto: 'Complete `rolarDado()` para sortear um inteiro de 1 a 6, incluindo os dois limites.' },
        {
          tipo: 'lista',
          itens: [
            'Faça um novo sorteio com `Math.random()` a cada chamada.',
            'Use `Math.floor` para transformar o sorteio em inteiro.',
            'Devolva o número sorteado. Não use um resultado fixo.',
          ],
        },
      ],
      codigoInicial: linhas('function rolarDado() {', '}', '', 'console.log(rolarDado());'),
      testes: [
        {
          descricao: 'Transforma diferentes sorteios em faces de 1 a 6',
          codigo: js`const original = Math.random;
try {
  Math.random = () => 0; igual(rolarDado(), 1, 'Com sorteio zero');
  Math.random = () => 0.5; igual(rolarDado(), 4, 'Com sorteio 0.5');
  Math.random = () => 0.999999; igual(rolarDado(), 6, 'Com sorteio perto de 1');
  Math.random = () => 0.2; igual(rolarDado(), 2, 'Com sorteio 0.2');
  Math.random = () => 0.12; igual(rolarDado(), 1, 'A primeira face ocupa uma faixa completa');
  Math.random = () => 0.89; igual(rolarDado(), 6, 'A última face ocupa uma faixa completa');
} finally { Math.random = original; }`,
        },
      ],
      dicas: ['Multiplicar o sorteio por 6 cria seis faixas: de 0 até antes de 6.', 'Use floor e só depois some 1.'],
      solucao: 'function rolarDado() {\n  return Math.floor(Math.random() * 6) + 1;\n}',
    },
    {
      titulo: 'Escolha um item da lista',
      enunciado: [
        { tipo: 'p', texto: 'Complete `escolherItem(itens)` para sortear e devolver um item do array.' },
        {
          tipo: 'lista',
          itens: [
            'A lista sempre terá ao menos um item. Ela pode conter textos ou números.',
            'Use o tamanho da lista para sortear um índice válido com `Math.random` e `Math.floor`.',
            'Devolva o item, sem alterar o array recebido.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const temas = ["Arrays", "Objetos", "Funções"];',
        '',
        'function escolherItem(itens) {',
        '}',
        '',
        'console.log(escolherItem(temas));',
      ),
      testes: [
        {
          descricao: 'Alcança o primeiro, o último e os itens intermediários',
          codigo: js`const original = Math.random;
try {
  const itens = ['A', 'B', 'C'];
  Math.random = () => 0; igual(escolherItem(itens), 'A');
  Math.random = () => 0.3; igual(escolherItem(itens), 'A');
  Math.random = () => 0.5; igual(escolherItem(itens), 'B');
  Math.random = () => 0.999999; igual(escolherItem(itens), 'C');
  igual(escolherItem([42]), 42); igual(escolherItem([10, 20, 30, 40]), 40);
  igual(itens, ['A', 'B', 'C']);
} finally { Math.random = original; }`,
        },
      ],
      dicas: [
        'Arrays começam no índice 0. O maior índice é `itens.length - 1`.',
        'Primeiro calcule o índice sorteado; depois devolva `itens[indice]`.',
      ],
      solucao:
        'function escolherItem(itens) {\n  const indice = Math.floor(Math.random() * itens.length);\n  return itens[indice];\n}',
    },
  ],
};
