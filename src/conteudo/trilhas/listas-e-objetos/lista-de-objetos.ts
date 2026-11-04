import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const listaDeObjetos: Licao = {
  slug: 'lista-de-objetos',
  titulo: 'Listas de objetos',
  resumo: 'Juntando listas e objetos, como em um carrinho de compras.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Na prática, listas e objetos aparecem juntos: uma lista de produtos, de clientes, de pedidos. Cada item da lista é um objeto.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const itens = [',
        '  { nome: "Caneta", preco: 3, quantidade: 2 },',
        '  { nome: "Caderno", preco: 20, quantidade: 1 },',
        '];',
        '',
        'for (const item of itens) {',
        '  console.log(item.nome + ": " + item.preco * item.quantidade);',
        '}',
      ),
      saida: linhas('Caneta: 6', 'Caderno: 20'),
    },
    {
      tipo: 'p',
      texto: '`filter` e `map` também funcionam com objetos. Para pegar só os nomes dos itens baratos:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const baratos = itens.filter((item) => item.preco < 10).map((item) => item.nome);',
        'console.log(baratos);',
      ),
      saida: "[ 'Caneta' ]",
    },
  ],
  exercicios: [
    {
      titulo: 'Carrinho de compras',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Cada item de um carrinho é um objeto `{ nome, preco, quantidade }`. Escreva duas funções:',
        },
        {
          tipo: 'lista',
          itens: [
            '`totalDoCarrinho(itens)` devolve a soma de `preco * quantidade` de todos os itens (e `0` para um carrinho vazio).',
            '`nomesBaratos(itens, limite)` devolve uma lista com o nome dos itens cujo `preco` é **menor ou igual** ao `limite`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const itens = [',
        '  { nome: "Caneta", preco: 3, quantidade: 2 },',
        '  { nome: "Caderno", preco: 20, quantidade: 1 },',
        '];',
        'const limite = 10;',
        '',
        'function totalDoCarrinho(itens) {',
        '',
        '}',
        '',
        'function nomesBaratos(itens, limite) {',
        '',
        '}',
        '',
        'console.log(totalDoCarrinho(itens));',
        'console.log(nomesBaratos(itens, limite));',
        '',
      ),
      testes: [
        {
          descricao: 'O total de um carrinho vazio é 0',
          codigo: js`igual(totalDoCarrinho([]), 0, 'totalDoCarrinho([])')`,
        },
        {
          descricao: 'O total de um item é preço vezes quantidade',
          codigo: js`igual(totalDoCarrinho([{ nome: 'Caneta', preco: 3, quantidade: 2 }]), 6, 'O total de uma caneta de 3 comprada 2 vezes')`,
        },
        {
          descricao: 'O total soma todos os itens',
          codigo: js`const itens = [
  { nome: 'Caneta', preco: 3, quantidade: 2 },
  { nome: 'Caderno', preco: 20, quantidade: 1 },
];
igual(totalDoCarrinho(itens), 26, 'O total de caneta e caderno')`,
        },
        {
          descricao: 'nomesBaratos devolve só os nomes até o limite',
          codigo: js`const itens = [
  { nome: 'Caneta', preco: 3, quantidade: 2 },
  { nome: 'Caderno', preco: 20, quantidade: 1 },
];
igual(nomesBaratos(itens, 10), ['Caneta'], 'nomesBaratos(itens, 10)');
igual(nomesBaratos(itens, 20), ['Caneta', 'Caderno'], 'nomesBaratos(itens, 20)');
igual(nomesBaratos(itens, 1), [], 'nomesBaratos(itens, 1)')`,
        },
      ],
      dicas: [
        'Em `totalDoCarrinho`, percorra os itens com `for...of` e acumule `item.preco * item.quantidade`.',
        'Em `nomesBaratos`, primeiro `filter` pelo preço, depois `map` para ficar só com `item.nome`.',
      ],
      solucao: linhas(
        'function totalDoCarrinho(itens) {',
        '  let total = 0;',
        '  for (const item of itens) {',
        '    total = total + item.preco * item.quantidade;',
        '  }',
        '  return total;',
        '}',
        '',
        'function nomesBaratos(itens, limite) {',
        '  return itens.filter((item) => item.preco <= limite).map((item) => item.nome);',
        '}',
      ),
    },
    {
      titulo: 'Os adultos da lista',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `nomesDosAdultos(pessoas)`, que recebe uma lista de objetos `{ nome, idade }` e devolve só os **nomes** de quem tem 18 anos ou mais, na mesma ordem.',
        },
      ],
      codigoInicial: linhas(
        'const pessoas = [',
        '  { nome: "Ana", idade: 25 },',
        '  { nome: "Bia", idade: 12 },',
        '  { nome: "Caio", idade: 18 },',
        '];',
        '',
        'function nomesDosAdultos(pessoas) {',
        '',
        '}',
        '',
        'console.log(nomesDosAdultos(pessoas));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve só os nomes de quem tem 18 ou mais',
          codigo: js`const pessoas = [
  { nome: 'Ana', idade: 25 },
  { nome: 'Bia', idade: 12 },
  { nome: 'Caio', idade: 18 },
];
igual(nomesDosAdultos(pessoas), ['Ana', 'Caio'], 'nomesDosAdultos(pessoas)')`,
        },
        {
          descricao: 'Sem adultos, devolve uma lista vazia',
          codigo: js`igual(nomesDosAdultos([{ nome: 'Bia', idade: 12 }]), [], 'nomesDosAdultos com só uma criança')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(nomesDosAdultos([]), [], 'nomesDosAdultos([])')`,
        },
        {
          descricao: 'Mantém a ordem original',
          codigo: js`const pessoas = [
  { nome: 'Zeca', idade: 40 },
  { nome: 'Ana', idade: 30 },
];
igual(nomesDosAdultos(pessoas), ['Zeca', 'Ana'], 'A ordem dos nomes')`,
        },
      ],
      dicas: [
        'Primeiro `filter` pela idade: `(pessoa) => pessoa.idade >= 18`.',
        'Depois `map` para ficar só com `pessoa.nome`.',
      ],
      solucao: linhas(
        'function nomesDosAdultos(pessoas) {',
        '  return pessoas.filter((pessoa) => pessoa.idade >= 18).map((pessoa) => pessoa.nome);',
        '}',
      ),
    },
    {
      titulo: 'Achando pelo código',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `acharPorId(lista, id)`. Cada item da lista é um objeto com uma propriedade `id`. A função devolve o **objeto inteiro** cujo `id` é igual ao pedido, ou `undefined` se não houver nenhum. Use um laço, e devolva assim que achar.',
        },
      ],
      codigoInicial: linhas(
        'const lista = [',
        '  { id: 1, nome: "Caneta" },',
        '  { id: 2, nome: "Caderno" },',
        '  { id: 3, nome: "Lápis" },',
        '];',
        'const id = 2;',
        '',
        'function acharPorId(lista, id) {',
        '',
        '}',
        '',
        'console.log(acharPorId(lista, id));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o objeto que tem o id pedido',
          codigo: js`const lista = [
  { id: 1, nome: 'Caneta' },
  { id: 2, nome: 'Caderno' },
  { id: 3, nome: 'Lápis' },
];
igual(acharPorId(lista, 2), { id: 2, nome: 'Caderno' }, 'acharPorId(lista, 2)');
igual(acharPorId(lista, 3), { id: 3, nome: 'Lápis' }, 'acharPorId(lista, 3)')`,
        },
        {
          descricao: 'Quando o id não existe, devolve undefined (e quando existe, o item)',
          codigo: js`const lista = [{ id: 1, nome: 'Caneta' }];
igual(acharPorId(lista, 1), { id: 1, nome: 'Caneta' }, 'acharPorId(lista, 1)');
igual(acharPorId(lista, 7), undefined, 'acharPorId(lista, 7)')`,
        },
        {
          descricao: 'Numa lista vazia, devolve undefined (e acha o item numa lista com ele)',
          codigo: js`igual(acharPorId([{ id: 5, nome: 'X' }], 5), { id: 5, nome: 'X' }, 'acharPorId com um item');
igual(acharPorId([], 5), undefined, 'acharPorId([], 5)')`,
        },
        {
          descricao: 'Usa um laço',
          codigo: js`verdadeiro(/for\s*[(]/.test(codigoDoAluno), 'Resolva com um laço for...of.')`,
        },
      ],
      dicas: [
        'Percorra com `for (const item of lista)`.',
        'Dentro do laço, `if (item.id === id)` e, nesse caso, `return item;`. Depois do laço, não precisa de nada: sem `return`, a função devolve `undefined`.',
      ],
      solucao: linhas(
        'function acharPorId(lista, id) {',
        '  for (const item of lista) {',
        '    if (item.id === id) {',
        '      return item;',
        '    }',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Total de um cliente',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Uma lista de pedidos tem objetos como `{ cliente: "Ana", valor: 30 }`. Escreva a função `totalDoCliente(pedidos, cliente)`, que soma o `valor` de todos os pedidos daquele cliente. Quem não tem pedidos soma `0`.',
        },
      ],
      codigoInicial: linhas(
        'const pedidos = [',
        '  { cliente: "Ana", valor: 30 },',
        '  { cliente: "Bia", valor: 50 },',
        '  { cliente: "Ana", valor: 20 },',
        '];',
        'const cliente = "Ana";',
        '',
        'function totalDoCliente(pedidos, cliente) {',
        '',
        '}',
        '',
        'console.log(totalDoCliente(pedidos, cliente));',
        '',
      ),
      testes: [
        {
          descricao: 'Soma só os pedidos do cliente pedido',
          codigo: js`const pedidos = [
  { cliente: 'Ana', valor: 30 },
  { cliente: 'Bia', valor: 50 },
  { cliente: 'Ana', valor: 20 },
];
igual(totalDoCliente(pedidos, 'Ana'), 50, "totalDoCliente(pedidos, 'Ana')");
igual(totalDoCliente(pedidos, 'Bia'), 50, "totalDoCliente(pedidos, 'Bia')")`,
        },
        {
          descricao: 'Um cliente sem pedidos soma 0',
          codigo: js`igual(totalDoCliente([{ cliente: 'Ana', valor: 30 }], 'Caio'), 0, "totalDoCliente(..., 'Caio')")`,
        },
        {
          descricao: 'Uma lista vazia soma 0',
          codigo: js`igual(totalDoCliente([], 'Ana'), 0, "totalDoCliente([], 'Ana')")`,
        },
        {
          descricao: 'Aceita valores com centavos',
          codigo: js`igual(totalDoCliente([{ cliente: 'Ana', valor: 10.5 }, { cliente: 'Ana', valor: 4.5 }], 'Ana'), 15, 'Dois pedidos com centavos')`,
        },
      ],
      dicas: [
        'Com `for...of` e um `if (pedido.cliente === cliente)`, some `pedido.valor` num acumulador.',
        'Ou ainda: `filter` pelo cliente e, depois, some os valores.',
      ],
      solucao: linhas(
        'function totalDoCliente(pedidos, cliente) {',
        '  let total = 0;',
        '  for (const pedido of pedidos) {',
        '    if (pedido.cliente === cliente) {',
        '      total = total + pedido.valor;',
        '    }',
        '  }',
        '  return total;',
        '}',
      ),
    },
    {
      titulo: 'O produto mais caro',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `maisCaro(produtos)`, que devolve o **objeto inteiro** do produto de maior `preco` (a lista nunca está vazia). Se houver empate, devolva o primeiro deles.',
        },
      ],
      codigoInicial: linhas(
        'const produtos = [',
        '  { nome: "Caneta", preco: 3 },',
        '  { nome: "Caderno", preco: 20 },',
        '  { nome: "Lápis", preco: 2 },',
        '];',
        '',
        'function maisCaro(produtos) {',
        '',
        '}',
        '',
        'console.log(maisCaro(produtos));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o produto de maior preço',
          codigo: js`const produtos = [
  { nome: 'Caneta', preco: 3 },
  { nome: 'Caderno', preco: 20 },
  { nome: 'Lápis', preco: 2 },
];
igual(maisCaro(produtos), { nome: 'Caderno', preco: 20 }, 'maisCaro(produtos)')`,
        },
        {
          descricao: 'Um produto só devolve ele mesmo',
          codigo: js`igual(maisCaro([{ nome: 'Régua', preco: 5 }]), { nome: 'Régua', preco: 5 }, 'maisCaro com um produto')`,
        },
        {
          descricao: 'O mais caro pode ser o último',
          codigo: js`const produtos = [{ nome: 'A', preco: 1 }, { nome: 'B', preco: 2 }, { nome: 'C', preco: 9 }];
igual(maisCaro(produtos), { nome: 'C', preco: 9 }, 'O mais caro no fim')`,
        },
        {
          descricao: 'Em caso de empate, vale o primeiro',
          codigo: js`const produtos = [{ nome: 'A', preco: 8 }, { nome: 'B', preco: 8 }];
igual(maisCaro(produtos), { nome: 'A', preco: 8 }, 'O primeiro dos empatados')`,
        },
      ],
      dicas: [
        'Comece com `let maisCaroAteAgora = produtos[0];` e compare cada produto com ele.',
        'Só troque quando o preço do produto for **maior** (e não maior ou igual), para o empate ficar com o primeiro.',
      ],
      solucao: linhas(
        'function maisCaro(produtos) {',
        '  let escolhido = produtos[0];',
        '  for (const produto of produtos) {',
        '    if (produto.preco > escolhido.preco) {',
        '      escolhido = produto;',
        '    }',
        '  }',
        '  return escolhido;',
        '}',
      ),
    },
    {
      titulo: 'Reajuste sem mexer no original',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `reajustar(produtos, percentual)`, que devolve uma **lista nova** de produtos `{ nome, preco }` com o preço aumentado pelo percentual. Por exemplo, com `10`, um preço de `100` passa a `110`. Os objetos da lista original **não podem mudar**.',
        },
        {
          tipo: 'nota',
          texto:
            'Se você escrever `produto.preco = ...` dentro do `map`, vai alterar o objeto original, e não uma cópia. Em vez disso, devolva um objeto novo: `{ nome: produto.nome, preco: ... }`.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas(
        'const produtos = [',
        '  { nome: "Caneta", preco: 100 },',
        '  { nome: "Caderno", preco: 50 },',
        '];',
        'const percentual = 10;',
        '',
        'function reajustar(produtos, percentual) {',
        '',
        '}',
        '',
        'console.log(reajustar(produtos, percentual));',
        '',
      ),
      testes: [
        {
          descricao: 'Reajusta o preço de cada produto',
          codigo: js`const produtos = [{ nome: 'Caneta', preco: 100 }, { nome: 'Caderno', preco: 50 }];
igual(reajustar(produtos, 10), [{ nome: 'Caneta', preco: 110 }, { nome: 'Caderno', preco: 55 }], 'reajustar(produtos, 10)')`,
        },
        {
          descricao: 'Com reajuste 0, os preços ficam iguais',
          codigo: js`igual(reajustar([{ nome: 'A', preco: 8 }], 0), [{ nome: 'A', preco: 8 }], 'reajustar com 0')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(reajustar([], 10), [], 'reajustar([], 10)')`,
        },
        {
          descricao: 'Os produtos originais não mudaram',
          codigo: js`const produtos = [{ nome: 'Caneta', preco: 100 }];
const resultado = reajustar(produtos, 10);
verdadeiro(Array.isArray(resultado) && resultado.length === 1, 'reajustar precisa devolver uma lista com um produto.');
igual(produtos, [{ nome: 'Caneta', preco: 100 }], 'A lista original')`,
        },
      ],
      dicas: [
        'Cada produto vira outro produto: é trabalho para o `map`.',
        'Dentro do `map`: `({ nome: produto.nome, preco: produto.preco + produto.preco * percentual / 100 })`. Os parênteses em volta das chaves avisam que é um objeto, não um bloco.',
      ],
      solucao: linhas(
        'function reajustar(produtos, percentual) {',
        '  return produtos.map((produto) => ({',
        '    nome: produto.nome,',
        '    preco: produto.preco + (produto.preco * percentual) / 100,',
        '  }));',
        '}',
      ),
    },
    {
      titulo: 'Códigos disponíveis para venda',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `codigosDisponiveis(produtos)`. Cada produto tem codigo e quantidade. Devolva uma lista dos códigos com quantidade maior que zero, na ordem de entrada. Não modifique os produtos.',
        },
      ],
      codigoInicial: linhas(
        'const produtos = [',
        '  { codigo: "A", quantidade: 2 },',
        '  { codigo: "B", quantidade: 0 },',
        '  { codigo: "C", quantidade: 1 },',
        '];',
        '',
        'function codigosDisponiveis(produtos) {',
        '',
        '}',
        '',
        'console.log(codigosDisponiveis(produtos));',
        '',
      ),
      testes: [
        {
          descricao: 'Ignora os produtos com estoque zerado',
          codigo: js`igual(codigosDisponiveis([{ codigo: 'A', quantidade: 2 }, { codigo: 'B', quantidade: 0 }, { codigo: 'C', quantidade: 1 }]), ['A', 'C'], 'Códigos à venda')`,
        },
        {
          descricao: 'Devolve lista vazia quando não há produtos disponíveis',
          codigo: js`igual(codigosDisponiveis([]), [], 'Sem produtos'); igual(codigosDisponiveis([{ codigo: 'X', quantidade: 0 }]), [], 'Sem estoque')`,
        },
      ],
      dicas: ['Combine filter pela quantidade com map pela propriedade codigo.'],
      solucao:
        'function codigosDisponiveis(produtos) {\n  return produtos.filter((produto) => produto.quantidade > 0).map((produto) => produto.codigo);\n}',
    },
    {
      titulo: 'Resumo das tarefas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `resumirTarefas(tarefas)`, que devolve um objeto com as contagens feitas e pendentes. Cada tarefa tem a propriedade booleana concluida. Uma lista vazia deve resultar nas duas contagens zeradas.',
        },
      ],
      codigoInicial: linhas(
        'const tarefas = [{ concluida: true }, { concluida: false }, { concluida: true }];',
        '',
        'function resumirTarefas(tarefas) {',
        '',
        '}',
        '',
        'console.log(resumirTarefas(tarefas));',
        '',
      ),
      testes: [
        {
          descricao: 'Separa as duas situações',
          codigo: js`igual(resumirTarefas([{ concluida: true }, { concluida: false }, { concluida: true }]), { feitas: 2, pendentes: 1 }, 'Contagens')`,
        },
        {
          descricao: 'Trata lista vazia e tarefas só pendentes',
          codigo: js`igual(resumirTarefas([]), { feitas: 0, pendentes: 0 }, 'Vazia'); igual(resumirTarefas([{ concluida: false }]), { feitas: 0, pendentes: 1 }, 'Uma pendência')`,
        },
      ],
      dicas: ['Comece com um objeto de contagens zeradas e atualize uma propriedade a cada volta do laço.'],
      solucao:
        'function resumirTarefas(tarefas) {\n  const resumo = { feitas: 0, pendentes: 0 };\n  for (const tarefa of tarefas) {\n    if (tarefa.concluida) resumo.feitas = resumo.feitas + 1;\n    else resumo.pendentes = resumo.pendentes + 1;\n  }\n  return resumo;\n}',
    },
  ],
};
