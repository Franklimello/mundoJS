import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desafioFinal: Licao = {
  slug: 'desafio-final',
  titulo: 'Desafio: o estoque da lojinha',
  resumo: 'Junte listas, objetos, for...of, filter e map num estoque de verdade.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Aqui não há ferramenta nova: é a hora de juntar tudo o que você viu nesta trilha. Os quatro exercícios usam a mesma lojinha, cujo estoque é uma lista de produtos:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const produtos = [',
        '  { nome: "Caneta", preco: 3, quantidade: 10 },',
        '  { nome: "Caderno", preco: 20, quantidade: 0 },',
        '];',
        '',
        'console.log(produtos.length);',
        'console.log(produtos[0].nome);',
        'console.log(produtos[1].quantidade);',
      ),
      saida: linhas('2', 'Caneta', '0'),
    },
    {
      tipo: 'nota',
      texto:
        'Cada exercício pede uma função que **não altera** a lista original, a não ser que o enunciado diga o contrário. Se travar, releia a lição de `filter` e `map` e a de listas de objetos.',
    },
  ],
  exercicios: [
    {
      titulo: 'Quanto vale o estoque',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `valorEmEstoque(produtos)`, que soma `preco * quantidade` de todos os produtos. Uma lista vazia vale `0`.',
        },
      ],
      codigoInicial: linhas(
        'function valorEmEstoque(produtos) {',
        '  // some preco * quantidade de cada produto',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Soma o valor de todos os produtos',
          codigo: js`const produtos = [
  { nome: 'Caneta', preco: 3, quantidade: 10 },
  { nome: 'Caderno', preco: 20, quantidade: 2 },
];
igual(valorEmEstoque(produtos), 70, 'valorEmEstoque(produtos)')`,
        },
        {
          descricao: 'Produto sem estoque não soma nada',
          codigo: js`igual(valorEmEstoque([{ nome: 'Lápis', preco: 2, quantidade: 0 }]), 0, 'Um produto com quantidade 0')`,
        },
        {
          descricao: 'Uma lista vazia vale 0',
          codigo: js`igual(valorEmEstoque([]), 0, 'valorEmEstoque([])')`,
        },
        {
          descricao: 'Aceita preços com centavos',
          codigo: js`igual(valorEmEstoque([{ nome: 'Bala', preco: 0.5, quantidade: 4 }]), 2, 'Uma bala de 0.5, quatro vezes')`,
        },
      ],
      dicas: [
        'É o mesmo raciocínio do total do carrinho: um acumulador e um `for...of`.',
        'A cada produto, some `produto.preco * produto.quantidade`.',
      ],
      solucao: linhas(
        'function valorEmEstoque(produtos) {',
        '  let total = 0;',
        '  for (const produto of produtos) {',
        '    total = total + produto.preco * produto.quantidade;',
        '  }',
        '  return total;',
        '}',
      ),
    },
    {
      titulo: 'O que acabou',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `semEstoque(produtos)`, que devolve uma lista com os **nomes** dos produtos cuja `quantidade` é `0`, na mesma ordem em que aparecem.',
        },
      ],
      codigoInicial: linhas(
        'function semEstoque(produtos) {',
        '  // escolha os produtos zerados e pegue os nomes',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve só os nomes dos produtos zerados',
          codigo: js`const produtos = [
  { nome: 'Caneta', preco: 3, quantidade: 10 },
  { nome: 'Caderno', preco: 20, quantidade: 0 },
  { nome: 'Lápis', preco: 2, quantidade: 0 },
];
igual(semEstoque(produtos), ['Caderno', 'Lápis'], 'semEstoque(produtos)')`,
        },
        {
          descricao: 'Se tudo tem estoque, a lista é vazia',
          codigo: js`igual(semEstoque([{ nome: 'Caneta', preco: 3, quantidade: 1 }]), [], 'Nenhum produto zerado')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(semEstoque([]), [], 'semEstoque([])')`,
        },
      ],
      dicas: [
        'Primeiro `filter` pelos produtos com `quantidade === 0`.',
        'Depois `map` para ficar só com `produto.nome`.',
      ],
      solucao: linhas(
        'function semEstoque(produtos) {',
        '  return produtos.filter((produto) => produto.quantidade === 0).map((produto) => produto.nome);',
        '}',
      ),
    },
    {
      titulo: 'Repor um produto',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `repor(produtos, nome, quantidade)`. Ela devolve uma **lista nova**, igual à original, mas em que o produto com aquele `nome` tem a `quantidade` somada ao estoque. Os outros produtos ficam como estão, e a lista original **não pode mudar**.',
        },
        {
          tipo: 'nota',
          texto:
            'Dentro do `map`, devolva o próprio produto quando não for o procurado e, quando for, um objeto novo com os mesmos campos e a quantidade atualizada.',
        },
      ],
      codigoInicial: linhas('function repor(produtos, nome, quantidade) {', '  // devolva uma lista nova', '}', ''),
      testes: [
        {
          descricao: 'Soma a quantidade ao produto certo',
          codigo: js`const produtos = [
  { nome: 'Caneta', preco: 3, quantidade: 10 },
  { nome: 'Caderno', preco: 20, quantidade: 0 },
];
const esperado = [
  { nome: 'Caneta', preco: 3, quantidade: 10 },
  { nome: 'Caderno', preco: 20, quantidade: 5 },
];
igual(repor(produtos, 'Caderno', 5), esperado, "repor(produtos, 'Caderno', 5)")`,
        },
        {
          descricao: 'Se o produto não existe, a lista continua igual',
          codigo: js`const produtos = [{ nome: 'Caneta', preco: 3, quantidade: 10 }];
const resultado = repor(produtos, 'Régua', 5);
verdadeiro(Array.isArray(resultado), 'repor precisa devolver uma lista.');
igual(resultado, [{ nome: 'Caneta', preco: 3, quantidade: 10 }], 'O resultado sem o produto')`,
        },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const produtos = [{ nome: 'Caneta', preco: 3, quantidade: 10 }];
const resultado = repor(produtos, 'Caneta', 5);
verdadeiro(Array.isArray(resultado) && resultado.length === 1, 'repor precisa devolver uma lista com um produto.');
igual(produtos, [{ nome: 'Caneta', preco: 3, quantidade: 10 }], 'A lista original')`,
        },
        {
          descricao: 'Só o produto escolhido muda, mesmo havendo vários',
          codigo: js`const produtos = [
  { nome: 'A', preco: 1, quantidade: 1 },
  { nome: 'B', preco: 2, quantidade: 2 },
  { nome: 'C', preco: 3, quantidade: 3 },
];
igual(repor(produtos, 'B', 10).map((p) => p.quantidade), [1, 12, 3], 'As quantidades depois de repor B')`,
        },
      ],
      dicas: [
        'Use `produtos.map((produto) => ...)`: para cada produto, uma decisão.',
        'Se `produto.nome === nome`, devolva `{ nome: produto.nome, preco: produto.preco, quantidade: produto.quantidade + quantidade }`; senão, devolva o próprio `produto`.',
      ],
      solucao: linhas(
        'function repor(produtos, nome, quantidade) {',
        '  return produtos.map((produto) => {',
        '    if (produto.nome === nome) {',
        '      return { nome: produto.nome, preco: produto.preco, quantidade: produto.quantidade + quantidade };',
        '    }',
        '    return produto;',
        '  });',
        '}',
      ),
    },
    {
      titulo: 'Relatório do estoque',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `relatorio(produtos)`, que devolve uma lista de textos, um por produto e na mesma ordem, no formato `Caneta: 10 un.` (o nome, dois-pontos, a quantidade, um espaço e `un.`).',
        },
      ],
      codigoInicial: linhas('function relatorio(produtos) {', '  // transforme cada produto num texto', '}', ''),
      testes: [
        {
          descricao: 'Cada produto vira uma linha “nome: quantidade un.”',
          codigo: js`const produtos = [
  { nome: 'Caneta', preco: 3, quantidade: 10 },
  { nome: 'Caderno', preco: 20, quantidade: 0 },
];
igual(relatorio(produtos), ['Caneta: 10 un.', 'Caderno: 0 un.'], 'relatorio(produtos)')`,
        },
        {
          descricao: 'Um produto só gera uma linha só',
          codigo: js`igual(relatorio([{ nome: 'Régua', preco: 5, quantidade: 7 }]), ['Régua: 7 un.'], 'relatorio com um produto')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(relatorio([]), [], 'relatorio([])')`,
        },
      ],
      dicas: [
        'Cada produto vira um texto: trabalho para o `map`.',
        'O texto pode ser um template literal: `${produto.nome}: ${produto.quantidade} un.`.',
      ],
      solucao: linhas(
        'function relatorio(produtos) {',
        '  return produtos.map((produto) => `${produto.nome}: ${produto.quantidade} un.`);',
        '}',
      ),
    },
  ],
};
