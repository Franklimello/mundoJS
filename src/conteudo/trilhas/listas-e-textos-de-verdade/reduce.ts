import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const reduce: Licao = {
  slug: 'reduce',
  titulo: 'Juntando tudo num valor só',
  resumo: 'reduce e o acumulador.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`map` e `filter` devolvem outra lista. O `reduce` faz diferente: percorre a lista acumulando **um valor só** — uma soma, um total, o maior número.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const numeros = [1, 2, 3, 4];',
        'const soma = numeros.reduce((total, n) => total + n, 0);',
        'console.log(soma);',
      ),
      saida: '10',
    },
    {
      tipo: 'p',
      texto:
        'Ele recebe uma função e o **valor inicial** (`0`). A função recebe o acumulado até agora (`total`) e o item da vez (`n`), e devolve o novo acumulado. Para ver cada volta:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'numeros.reduce((total, n) => {',
        '  console.log("total:", total, "item:", n);',
        '  return total + n;',
        '}, 0);',
      ),
      saida: linhas('total: 0 item: 1', 'total: 1 item: 2', 'total: 3 item: 3', 'total: 6 item: 4'),
    },
    {
      tipo: 'p',
      texto: 'É o mesmo laço que você já escreveu, só que o acumulador ganha nome e lugar dentro do próprio `reduce`:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let total = 0;',
        'for (const n of numeros) {',
        '  total = total + n;',
        '}',
        'console.log(total);',
      ),
      saida: '10',
    },
    {
      tipo: 'p',
      texto:
        'O acumulador não precisa ser um número. Pode ser um objeto, para contar quantas vezes cada coisa aparece:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const animais = ["gato", "pato", "gato", "rato", "gato"];',
        '',
        'const contagem = animais.reduce((acc, animal) => {',
        '  acc[animal] = (acc[animal] ?? 0) + 1;',
        '  return acc;',
        '}, {});',
        '',
        'console.log(contagem);',
      ),
      saida: '{ gato: 3, pato: 1, rato: 1 }',
    },
    {
      tipo: 'nota',
      texto:
        'O `?? 0` quer dizer "se ainda não existe, comece do zero". Na primeira vez que um animal aparece, `acc[animal]` não existe — então vale `0`, e somamos 1.',
    },
  ],
  exercicios: [
    {
      titulo: 'Quadrados e maior',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções, as duas com `reduce`:' },
        {
          tipo: 'lista',
          itens: [
            '`somaDosQuadrados(numeros)` devolve a soma de cada número vezes ele mesmo: `somaDosQuadrados([1, 2, 3])` devolve `14` (1 + 4 + 9). Para uma lista vazia, devolve `0`.',
            '`maiorNumero(numeros)` devolve o maior número da lista. A lista nunca vem vazia.',
          ],
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const numeros = [3, 9, 2];',
        '',
        'function somaDosQuadrados(numeros) {',
        '  // use reduce',
        '}',
        '',
        'function maiorNumero(numeros) {',
        '  // use reduce',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(somaDosQuadrados(numeros));',
        'console.log(maiorNumero(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'somaDosQuadrados([1, 2, 3]) devolve 14',
          codigo: js`igual(somaDosQuadrados([1, 2, 3]), 14, 'somaDosQuadrados([1, 2, 3])')`,
        },
        {
          descricao: 'somaDosQuadrados funciona com negativos',
          codigo: js`igual(somaDosQuadrados([-2, 3]), 13, 'somaDosQuadrados([-2, 3])')`,
        },
        {
          descricao: 'somaDosQuadrados([]) devolve 0',
          codigo: js`igual(somaDosQuadrados([]), 0, 'somaDosQuadrados([])')`,
        },
        {
          descricao: 'maiorNumero([3, 9, 2]) devolve 9',
          codigo: js`igual(maiorNumero([3, 9, 2]), 9, 'maiorNumero([3, 9, 2])')`,
        },
        {
          descricao: 'maiorNumero funciona com um número só',
          codigo: js`igual(maiorNumero([7]), 7, 'maiorNumero([7])')`,
        },
        {
          descricao: 'maiorNumero funciona só com negativos',
          codigo: js`igual(maiorNumero([-5, -2, -9]), -2, 'maiorNumero([-5, -2, -9])')`,
        },
        {
          descricao: 'Usa reduce nas duas funções',
          codigo: js`verdadeiro((codigoDoAluno.match(/\.reduce\(/g) ?? []).length >= 2, 'Use reduce nas duas funções.')`,
        },
      ],
      dicas: [
        'Em `somaDosQuadrados`, o valor inicial é `0` e, a cada volta, você soma `n * n` ao acumulado.',
        'Em `maiorNumero`, use `numeros[0]` como valor inicial. A cada item, fique com o maior entre o acumulado e o item: `n > maior ? n : maior`.',
      ],
      solucao: linhas(
        'function somaDosQuadrados(numeros) {',
        '  return numeros.reduce((total, n) => total + n * n, 0);',
        '}',
        '',
        'function maiorNumero(numeros) {',
        '  return numeros.reduce((maior, n) => (n > maior ? n : maior), numeros[0]);',
        '}',
      ),
    },
    {
      titulo: 'O total do carrinho, com reduce',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Você já somou o carrinho com um laço. Agora faça com `reduce`: escreva `totalDoCarrinho(itens)`, que soma `preco * quantidade` de cada item `{ nome, preco, quantidade }`. Um carrinho vazio vale `0`.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const itens = [',
        '  { nome: "Caneta", preco: 3, quantidade: 2 },',
        '  { nome: "Caderno", preco: 20, quantidade: 1 },',
        '];',
        '',
        'function totalDoCarrinho(itens) {',
        '  // use reduce',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(totalDoCarrinho(itens));',
        '',
      ),
      testes: [
        {
          descricao: 'Soma preço vezes quantidade de todos os itens',
          codigo: js`const itens = [
  { nome: 'Caneta', preco: 3, quantidade: 2 },
  { nome: 'Caderno', preco: 20, quantidade: 1 },
];
igual(totalDoCarrinho(itens), 26, 'totalDoCarrinho(itens)')`,
        },
        { descricao: 'Um carrinho vazio vale 0', codigo: js`igual(totalDoCarrinho([]), 0, 'totalDoCarrinho([])')` },
        {
          descricao: 'Um item só',
          codigo: js`igual(totalDoCarrinho([{ nome: 'Régua', preco: 5, quantidade: 3 }]), 15, 'Uma régua de 5, três vezes')`,
        },
        { descricao: 'Usa reduce', codigo: js`verdadeiro(codigoDoAluno.includes('.reduce('), 'Resolva com reduce.')` },
      ],
      dicas: [
        'O valor inicial é `0`, e a função recebe o total até agora e o item da vez.',
        'Resposta: `itens.reduce((total, item) => total + item.preco * item.quantidade, 0)`.',
      ],
      solucao: linhas(
        'function totalDoCarrinho(itens) {',
        '  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);',
        '}',
      ),
    },
    {
      titulo: 'Frase a partir de palavras',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `montarFrase(palavras)`, que junta as palavras numa frase separadas por um espaço, **usando `reduce`** (sem o `join`). `montarFrase(["um", "dois", "três"])` devolve `"um dois três"`. Uma lista vazia devolve `""`.',
        },
        {
          tipo: 'nota',
          texto:
            'O acumulador aqui é um texto, que começa vazio. Na primeira volta ele ainda está vazio e não precisa de espaço antes da palavra: `texto === "" ? palavra : texto + " " + palavra`.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const palavras = ["um", "dois", "três"];',
        '',
        'function montarFrase(palavras) {',
        '  // um reduce com um texto como acumulador',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(montarFrase(palavras));',
        '',
      ),
      testes: [
        {
          descricao: 'montarFrase(["um", "dois", "três"]) devolve “um dois três”',
          codigo: js`igual(montarFrase(['um', 'dois', 'três']), 'um dois três', "montarFrase(['um', 'dois', 'três'])")`,
        },
        { descricao: 'Uma palavra só', codigo: js`igual(montarFrase(['olá']), 'olá', "montarFrase(['olá'])")` },
        { descricao: 'Uma lista vazia devolve texto vazio', codigo: js`igual(montarFrase([]), '', 'montarFrase([])')` },
        {
          descricao: 'Usa reduce, e não o join',
          codigo: js`verdadeiro(
  codigoDoAluno.includes('.reduce(') && !codigoDoAluno.includes('.join('),
  'Resolva com reduce, sem usar o join.',
)`,
        },
      ],
      dicas: [
        'O valor inicial do `reduce` é o texto vazio: `""`.',
        'A função é `(texto, palavra) => (texto === "" ? palavra : texto + " " + palavra)`.',
      ],
      solucao: linhas(
        'function montarFrase(palavras) {',
        '  return palavras.reduce((texto, palavra) => (texto === "" ? palavra : texto + " " + palavra), "");',
        '}',
      ),
    },
    {
      titulo: 'Contando as letras',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `contarLetras(texto)`, que devolve um objeto dizendo quantas vezes cada letra aparece. `contarLetras("banana")` devolve `{ b: 1, a: 3, n: 2 }`. Um texto vazio devolve `{}`.',
        },
        {
          tipo: 'nota',
          texto: 'É o mesmo molde da contagem de animais: separe o texto em letras e use um objeto como acumulador.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const texto = "banana";',
        '',
        'function contarLetras(texto) {',
        '  // separe em letras e use reduce com um objeto',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(contarLetras(texto));',
        '',
      ),
      testes: [
        {
          descricao: 'contarLetras("banana") devolve { b: 1, a: 3, n: 2 }',
          codigo: js`igual(contarLetras('banana'), { b: 1, a: 3, n: 2 }, "contarLetras('banana')")`,
        },
        { descricao: 'Uma letra só', codigo: js`igual(contarLetras('a'), { a: 1 }, "contarLetras('a')")` },
        {
          descricao: 'Um texto vazio devolve um objeto vazio',
          codigo: js`igual(contarLetras(''), {}, "contarLetras('')")`,
        },
        {
          descricao: 'Maiúscula e minúscula são letras diferentes',
          codigo: js`igual(contarLetras('aA'), { a: 1, A: 1 }, "contarLetras('aA')")`,
        },
        { descricao: 'Usa reduce', codigo: js`verdadeiro(codigoDoAluno.includes('.reduce('), 'Resolva com reduce.')` },
      ],
      dicas: [
        'Separe as letras com `texto.split("")` e use `reduce` com `{}` como valor inicial.',
        'A cada letra: `acc[letra] = (acc[letra] ?? 0) + 1;` e `return acc;`.',
      ],
      solucao: linhas(
        'function contarLetras(texto) {',
        '  return texto.split("").reduce((acc, letra) => {',
        '    acc[letra] = (acc[letra] ?? 0) + 1;',
        '    return acc;',
        '  }, {});',
        '}',
      ),
    },
    {
      titulo: 'O menor e o maior de uma vez',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `limites(numeros)`, que devolve um objeto `{ menor, maior }` com o menor e o maior número da lista (que nunca vem vazia). `limites([3, 9, 2])` devolve `{ menor: 2, maior: 9 }`. Faça tudo num único `reduce`, com um objeto como acumulador.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const numeros = [3, 9, 2];',
        '',
        'function limites(numeros) {',
        '  // o acumulador guarda o menor e o maior até agora',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(limites(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'limites([3, 9, 2]) devolve { menor: 2, maior: 9 }',
          codigo: js`igual(limites([3, 9, 2]), { menor: 2, maior: 9 }, 'limites([3, 9, 2])')`,
        },
        {
          descricao: 'Um número só é o menor e o maior',
          codigo: js`igual(limites([5]), { menor: 5, maior: 5 }, 'limites([5])')`,
        },
        {
          descricao: 'Funciona só com negativos',
          codigo: js`igual(limites([-5, -2, -9]), { menor: -9, maior: -2 }, 'limites([-5, -2, -9])')`,
        },
        {
          descricao: 'Funciona com a lista em ordem',
          codigo: js`igual(limites([1, 2, 3, 4]), { menor: 1, maior: 4 }, 'limites([1, 2, 3, 4])')`,
        },
        { descricao: 'Usa reduce', codigo: js`verdadeiro(codigoDoAluno.includes('.reduce('), 'Resolva com reduce.')` },
      ],
      dicas: [
        'O valor inicial é `{ menor: numeros[0], maior: numeros[0] }`.',
        'A cada número, devolva um objeto novo: `{ menor: n < acc.menor ? n : acc.menor, maior: n > acc.maior ? n : acc.maior }`.',
      ],
      solucao: linhas(
        'function limites(numeros) {',
        '  return numeros.reduce(',
        '    (acc, n) => ({',
        '      menor: n < acc.menor ? n : acc.menor,',
        '      maior: n > acc.maior ? n : acc.maior,',
        '    }),',
        '    { menor: numeros[0], maior: numeros[0] },',
        '  );',
        '}',
      ),
    },
    {
      titulo: 'Um resumo dos sinais',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `resumirNumeros(numeros)`, usando reduce para contar valores positivos, negativos e zeros. Devolva um objeto com essas três propriedades, incluindo contagens zeradas.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const numeros = [3, -2, 0, 8, -1, 0];',
        '',
        'function resumirNumeros(numeros) {',
        '  // o acumulador é um objeto de contagens',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(resumirNumeros(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'Conta os três tipos de valor',
          codigo: js`igual(resumirNumeros([3, -2, 0, 8, -1, 0]), { positivos: 2, negativos: 2, zeros: 2 }, 'Resumo')`,
        },
        {
          descricao: 'Começa com contagens zeradas e trata lista vazia',
          codigo: js`igual(resumirNumeros([]), { positivos: 0, negativos: 0, zeros: 0 }, 'Vazia'); igual(resumirNumeros([-4]), { positivos: 0, negativos: 1, zeros: 0 }, 'Só negativo')`,
        },
      ],
      dicas: [
        'Passe um objeto de zeros como valor inicial do reduce. Atualize uma propriedade por número e devolva o acumulador.',
      ],
      solucao:
        'function resumirNumeros(numeros) {\n  return numeros.reduce((resumo, n) => {\n    if (n > 0) resumo.positivos++;\n    else if (n < 0) resumo.negativos++;\n    else resumo.zeros++;\n    return resumo;\n  }, { positivos: 0, negativos: 0, zeros: 0 });\n}',
    },
    {
      titulo: 'Acumulando sem repetições',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `unicosComReduce(numeros)`, que usa reduce para devolver uma lista sem números repetidos, mantendo a primeira ocorrência de cada valor. Não modifique a lista de entrada.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const numeros = [3, 1, 3, 2, 1];',
        '',
        'function unicosComReduce(numeros) {',
        '  // acumule apenas os valores que ainda não entraram',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(unicosComReduce(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'Mantém a ordem da primeira ocorrência',
          codigo: js`igual(unicosComReduce([3, 1, 3, 2, 1]), [3, 1, 2], 'Valores únicos'); verdadeiro(/\.reduce\s*\(/.test(codigoDoAluno), 'Use reduce para acumular a lista.')`,
        },
        {
          descricao: 'Inclui zero e negativos sem alterar a entrada',
          codigo: js`const entrada = [0, -1, 0, -1]; igual(unicosComReduce(entrada), [0, -1], 'Zero e negativo'); igual(entrada, [0, -1, 0, -1], 'Entrada'); igual(unicosComReduce([]), [], 'Vazia')`,
        },
      ],
      dicas: ['O acumulador começa como []. Antes de usar push, confira se ele já includes o número.'],
      solucao:
        'function unicosComReduce(numeros) {\n  return numeros.reduce((unicos, n) => {\n    if (!unicos.includes(n)) unicos.push(n);\n    return unicos;\n  }, []);\n}',
    },
  ],
};
