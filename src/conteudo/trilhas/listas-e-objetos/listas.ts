import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const listas: Licao = {
  slug: 'listas',
  titulo: 'Guardando vários valores',
  resumo: 'Listas (arrays), posições e push.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Uma lista (em JavaScript, um *array*) guarda vários valores numa só variável. Ela fica entre colchetes, com os itens separados por vírgula.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const frutas = ["maçã", "banana", "uva"];',
        'console.log(frutas);',
        'console.log(frutas.length);',
      ),
      saida: linhas("[ 'maçã', 'banana', 'uva' ]", '3'),
    },
    {
      tipo: 'p',
      texto: 'Cada item tem uma posição, chamada de **índice**. A contagem começa do zero:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(frutas[0]);', 'console.log(frutas[2]);'),
      saida: linhas('maçã', 'uva'),
    },
    { tipo: 'p', texto: 'Para acrescentar um item no fim da lista, use `push`:' },
    {
      tipo: 'codigo',
      codigo: linhas('frutas.push("manga");', 'console.log(frutas.length);'),
      saida: '4',
    },
    {
      tipo: 'nota',
      texto: 'Como a contagem começa em zero, o último item de uma lista está sempre na posição `lista.length - 1`.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'O último item',
      enunciado: [{ tipo: 'p', texto: 'Escreva a função `ultimo(lista)`, que devolve o último item da lista.' }],
      codigoInicial: linhas('function ultimo(lista) {', '  // devolva o último item', '}', ''),
      testes: [
        {
          descricao: 'ultimo([1, 2, 3]) devolve 3',
          codigo: js`igual(ultimo([1, 2, 3]), 3, 'ultimo([1, 2, 3])')`,
        },
        { descricao: 'Funciona com um item só', codigo: js`igual(ultimo(['a']), 'a', "ultimo(['a'])")` },
        { descricao: 'Funciona com textos', codigo: js`igual(ultimo(['x', 'y']), 'y', "ultimo(['x', 'y'])")` },
        {
          descricao: 'Funciona com listas maiores',
          codigo: js`igual(ultimo([5, 4, 3, 2, 1, 0, 9]), 9, 'ultimo([5, 4, 3, 2, 1, 0, 9])')`,
        },
      ],
      dicas: ['O índice do último item é o tamanho da lista menos 1.', 'Fica assim: `lista[lista.length - 1]`.'],
      solucao: linhas('function ultimo(lista) {', '  return lista[lista.length - 1];', '}'),
    },
    {
      titulo: 'As duas pontas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `pontas(lista)`, que devolve uma **nova lista** com dois itens: o primeiro e o último da lista recebida. Por exemplo, `pontas([1, 2, 3])` devolve `[1, 3]`.',
        },
      ],
      codigoInicial: linhas('function pontas(lista) {', '  // devolva uma lista com o primeiro e o último', '}', ''),
      testes: [
        {
          descricao: 'pontas([1, 2, 3]) devolve [1, 3]',
          codigo: js`igual(pontas([1, 2, 3]), [1, 3], 'pontas([1, 2, 3])')`,
        },
        {
          descricao: 'pontas(["x", "y"]) devolve ["x", "y"]',
          codigo: js`igual(pontas(['x', 'y']), ['x', 'y'], 'pontas(["x", "y"])')`,
        },
        {
          descricao: 'Com um item só, ele aparece nas duas pontas',
          codigo: js`igual(pontas(['a']), ['a', 'a'], "pontas(['a'])")`,
        },
        {
          descricao: 'pontas([5, 4, 3, 2, 1, 0, 9]) devolve [5, 9]',
          codigo: js`igual(pontas([5, 4, 3, 2, 1, 0, 9]), [5, 9], 'pontas([5, 4, 3, 2, 1, 0, 9])')`,
        },
      ],
      dicas: [
        'O primeiro item é `lista[0]` e o último é `lista[lista.length - 1]`.',
        'Para devolver os dois numa lista, coloque-os entre colchetes: `[lista[0], lista[lista.length - 1]]`.',
      ],
      solucao: linhas('function pontas(lista) {', '  return [lista[0], lista[lista.length - 1]];', '}'),
    },
    {
      titulo: 'A lista de compras',
      enunciado: [
        {
          tipo: 'lista',
          itens: [
            'Acrescente `"ovos"` e depois `"café"` ao fim da lista `compras`, com `push`.',
            'Mostre quantos itens a lista tem agora.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const compras = ["pão", "leite"];',
        '',
        '// 1. Acrescente ovos e café',
        '',
        '// 2. Mostre o tamanho da lista',
        '',
      ),
      testes: [
        {
          descricao: 'A lista terminou com pão, leite, ovos e café, nesta ordem',
          codigo: js`igual(compras, ['pão', 'leite', 'ovos', 'café'], 'compras')`,
        },
        { descricao: 'Mostrou 4', codigo: js`igual(saida, ['4'], 'As linhas mostradas')` },
        {
          descricao: 'Usou push para acrescentar',
          codigo: js`verdadeiro((codigoDoAluno.match(/[.]push[(]/g) ?? []).length >= 2, 'Acrescente cada item com compras.push(...).')`,
        },
      ],
      dicas: [
        'Cada `push` acrescenta um item: `compras.push("ovos");`.',
        'O tamanho aparece com `console.log(compras.length);`, depois dos dois `push`.',
      ],
      solucao: linhas(
        'const compras = ["pão", "leite"];',
        '',
        'compras.push("ovos");',
        'compras.push("café");',
        'console.log(compras.length);',
      ),
    },
    {
      titulo: 'O item do meio',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `meio(lista)`, que devolve o item do meio de uma lista de **tamanho ímpar**. Em `[10, 20, 30]`, o do meio é `20`. Dica: o índice do meio é metade do tamanho, arredondada para baixo.',
        },
      ],
      codigoInicial: linhas('function meio(lista) {', '  // calcule o índice do meio e devolva o item', '}', ''),
      testes: [
        { descricao: 'meio([10, 20, 30]) devolve 20', codigo: js`igual(meio([10, 20, 30]), 20, 'meio([10, 20, 30])')` },
        {
          descricao: 'meio([1, 2, 3, 4, 5]) devolve 3',
          codigo: js`igual(meio([1, 2, 3, 4, 5]), 3, 'meio([1, 2, 3, 4, 5])')`,
        },
        { descricao: 'Uma lista de um item devolve esse item', codigo: js`igual(meio(['só']), 'só', "meio(['só'])")` },
        {
          descricao: 'meio(["a", "b", "c", "d", "e", "f", "g"]) devolve "d"',
          codigo: js`igual(meio(['a', 'b', 'c', 'd', 'e', 'f', 'g']), 'd', 'meio com 7 itens')`,
        },
      ],
      dicas: [
        'Com 5 itens, o do meio está no índice 2; com 3, no índice 1. É o tamanho dividido por 2, sem a parte decimal.',
        '`Math.floor(lista.length / 2)` dá o índice do meio.',
      ],
      solucao: linhas('function meio(lista) {', '  return lista[Math.floor(lista.length / 2)];', '}'),
    },
    {
      titulo: 'Invertendo a lista',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `inverter(lista)`, que devolve uma **nova lista** com os mesmos itens em ordem contrária. Por exemplo, `inverter([1, 2, 3])` devolve `[3, 2, 1]`. A lista original **não** pode mudar.',
        },
        {
          tipo: 'nota',
          texto:
            'Crie uma lista vazia (`[]`), percorra a original **de trás para frente** (do último índice até o 0) e vá acrescentando os itens com `push`.',
        },
      ],
      codigoInicial: linhas('function inverter(lista) {', '  // monte e devolva uma lista nova', '}', ''),
      testes: [
        {
          descricao: 'inverter([1, 2, 3]) devolve [3, 2, 1]',
          codigo: js`igual(inverter([1, 2, 3]), [3, 2, 1], 'inverter([1, 2, 3])')`,
        },
        {
          descricao: 'Uma lista de um item continua igual',
          codigo: js`igual(inverter(['a']), ['a'], "inverter(['a'])")`,
        },
        { descricao: 'Uma lista vazia devolve uma lista vazia', codigo: js`igual(inverter([]), [], 'inverter([])')` },
        {
          descricao: 'Funciona com 5 itens',
          codigo: js`igual(inverter(['a', 'b', 'c', 'd', 'e']), ['e', 'd', 'c', 'b', 'a'], 'inverter com 5 itens')`,
        },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [1, 2, 3];
const resultado = inverter(original);
verdadeiro(Array.isArray(resultado), 'inverter precisa devolver uma lista.');
igual(original, [1, 2, 3], 'A lista original')`,
        },
      ],
      dicas: [
        'Comece com `const nova = [];` e termine com `return nova;`.',
        'O laço vai de `lista.length - 1` até `0`, diminuindo o `i`, e a cada volta faz `nova.push(lista[i])`.',
      ],
      solucao: linhas(
        'function inverter(lista) {',
        '  const nova = [];',
        '  for (let i = lista.length - 1; i >= 0; i--) {',
        '    nova.push(lista[i]);',
        '  }',
        '  return nova;',
        '}',
      ),
    },
    {
      titulo: 'Acrescentar e contar',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `colocarNoFim(lista, item)`, que acrescenta item ao fim da própria lista com push e devolve o novo tamanho. A lista recebida deve ser modificada.',
        },
      ],
      codigoInicial: 'function colocarNoFim(lista, item) {\n  // acrescente o item e devolva o tamanho\n}\n',
      testes: [
        {
          descricao: 'Acrescenta depois dos itens existentes',
          codigo: js`const itens = ['a', 'b']; igual(colocarNoFim(itens, 'c'), 3, 'Novo tamanho'); igual(itens, ['a', 'b', 'c'], 'Lista modificada')`,
        },
        {
          descricao: 'Também funciona com uma lista vazia',
          codigo: js`const itens = []; igual(colocarNoFim(itens, 7), 1, 'Primeiro item'); igual(itens, [7], 'Lista antes vazia')`,
        },
      ],
      dicas: ['Primeiro use lista.push(item). Depois devolva lista.length.'],
      solucao: 'function colocarNoFim(lista, item) {\n  lista.push(item);\n  return lista.length;\n}',
    },
    {
      titulo: 'Trocando as pontas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `trocarPontas(lista)`, que troca o primeiro item com o último e devolve a própria lista. Listas vazias ou com um item ficam como estão. Use índices e uma variável auxiliar, sem precisar percorrer a lista.',
        },
      ],
      codigoInicial: 'function trocarPontas(lista) {\n  // guarde uma ponta antes de sobrescrevê-la\n}\n',
      testes: [
        {
          descricao: 'Troca as pontas sem mexer nos itens do meio',
          codigo: js`const itens = [1, 2, 3, 4]; const retorno = trocarPontas(itens); igual(retorno, [4, 2, 3, 1], 'Pontas trocadas'); verdadeiro(retorno === itens, 'Devolva a própria lista recebida.'); igual(itens, [4, 2, 3, 1], 'A lista original foi modificada')`,
        },
        {
          descricao: 'Devolve a lista mesmo quando não há duas pontas diferentes',
          codigo: js`igual(trocarPontas([]), [], 'Vazia'); igual(trocarPontas(['x']), ['x'], 'Um item')`,
        },
      ],
      dicas: ['A última posição é lista.length - 1. Guarde o primeiro item numa variável antes de trocar os valores.'],
      solucao:
        'function trocarPontas(lista) {\n  if (lista.length > 1) {\n    const primeiro = lista[0];\n    lista[0] = lista[lista.length - 1];\n    lista[lista.length - 1] = primeiro;\n  }\n  return lista;\n}',
    },
  ],
};
