import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desafioFinal: Licao = {
  slug: 'desafio-final',
  titulo: 'Desafio: problemas clássicos',
  resumo: 'Cinco problemas famosos de lógica, resolvidos com o que você já sabe.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Não há ferramenta nova nesta lição: só o que você aprendeu até aqui, `if`, `else`, `for`, `while`, `%` e funções, combinado para resolver problemas que quem programa conhece de cor. Eles aparecem em entrevistas e em aulas do mundo todo, e resolvê-los é um ótimo treino de raciocínio.',
    },
    {
      tipo: 'p',
      texto: 'A maioria deles é uma mistura de um laço com uma decisão. Um exemplo, para esquentar:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'for (let i = 1; i <= 4; i++) {',
        '  if (i % 2 === 0) {',
        '    console.log(i + " é par");',
        '  } else {',
        '    console.log(i + " é ímpar");',
        '  }',
        '}',
      ),
      saida: linhas('1 é ímpar', '2 é par', '3 é ímpar', '4 é par'),
    },
    {
      tipo: 'nota',
      texto:
        'Se travar, escreva à mão o que a função deve fazer para um valor pequeno, passo a passo, e só depois traduza para código. Quase sempre o laço e o `if` aparecem sozinhos.',
    },
  ],
  exercicios: [
    {
      titulo: 'FizzBuzz',
      enunciado: [
        { tipo: 'p', texto: 'Escreva a função `fizzBuzz(n)`, que devolve:' },
        {
          tipo: 'lista',
          itens: [
            '`"FizzBuzz"` se `n` é divisível por 3 **e** por 5;',
            '`"Fizz"` se é divisível só por 3;',
            '`"Buzz"` se é divisível só por 5;',
            'o próprio número `n`, nos demais casos.',
          ],
        },
      ],
      codigoInicial: linhas('const n = 3;', '', 'function fizzBuzz(n) {', '', '}', '', 'console.log(fizzBuzz(n));', ''),
      testes: [
        { descricao: 'fizzBuzz(3) devolve “Fizz”', codigo: js`igual(fizzBuzz(3), 'Fizz', 'fizzBuzz(3)')` },
        { descricao: 'fizzBuzz(10) devolve “Buzz”', codigo: js`igual(fizzBuzz(10), 'Buzz', 'fizzBuzz(10)')` },
        { descricao: 'fizzBuzz(15) devolve “FizzBuzz”', codigo: js`igual(fizzBuzz(15), 'FizzBuzz', 'fizzBuzz(15)')` },
        { descricao: 'fizzBuzz(30) devolve “FizzBuzz”', codigo: js`igual(fizzBuzz(30), 'FizzBuzz', 'fizzBuzz(30)')` },
        { descricao: 'fizzBuzz(7) devolve o próprio 7', codigo: js`igual(fizzBuzz(7), 7, 'fizzBuzz(7)')` },
        { descricao: 'fizzBuzz(1) devolve o próprio 1', codigo: js`igual(fizzBuzz(1), 1, 'fizzBuzz(1)')` },
      ],
      dicas: [
        'Confira primeiro o caso mais específico: divisível por 3 **e** por 5, com `&&`.',
        'Se você perguntar só “divisível por 3?” antes, o 15 vira “Fizz”. Por isso o `FizzBuzz` vem primeiro.',
      ],
      solucao: linhas(
        'function fizzBuzz(n) {',
        '  if (n % 3 === 0 && n % 5 === 0) {',
        '    return "FizzBuzz";',
        '  } else if (n % 3 === 0) {',
        '    return "Fizz";',
        '  } else if (n % 5 === 0) {',
        '    return "Buzz";',
        '  }',
        '  return n;',
        '}',
      ),
    },
    {
      titulo: 'Número primo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Um número é **primo** quando é maior que 1 e só é divisível por 1 e por ele mesmo: 2, 3, 5, 7, 11... Escreva a função `ehPrimo(n)`, que devolve `true` ou `false`. O 1, o 0 e os negativos não são primos.',
        },
      ],
      codigoInicial: linhas('const n = 2;', '', 'function ehPrimo(n) {', '', '}', '', 'console.log(ehPrimo(n));', ''),
      testes: [
        {
          descricao: '2 e 3 são primos',
          codigo: js`igual(ehPrimo(2), true, 'ehPrimo(2)');
igual(ehPrimo(3), true, 'ehPrimo(3)')`,
        },
        {
          descricao: '17 e 97 são primos',
          codigo: js`igual(ehPrimo(17), true, 'ehPrimo(17)');
igual(ehPrimo(97), true, 'ehPrimo(97)')`,
        },
        {
          descricao: '4, 9 e 25 não são primos',
          codigo: js`igual(ehPrimo(4), false, 'ehPrimo(4)');
igual(ehPrimo(9), false, 'ehPrimo(9)');
igual(ehPrimo(25), false, 'ehPrimo(25)')`,
        },
        {
          descricao: '1 e 0 não são primos',
          codigo: js`igual(ehPrimo(1), false, 'ehPrimo(1)');
igual(ehPrimo(0), false, 'ehPrimo(0)')`,
        },
        { descricao: 'Um negativo não é primo', codigo: js`igual(ehPrimo(-7), false, 'ehPrimo(-7)')` },
        { descricao: '91 não é primo (7 vezes 13)', codigo: js`igual(ehPrimo(91), false, 'ehPrimo(91)')` },
      ],
      dicas: [
        'Primeiro, quem é menor que 2 não é primo: um `if (n < 2)` que devolve `false`.',
        'Depois, um laço de 2 até `n - 1`: se `n % i === 0` para algum `i`, o número tem um divisor a mais e não é primo.',
        'Se o laço terminar sem achar divisor, devolva `true`.',
      ],
      solucao: linhas(
        'function ehPrimo(n) {',
        '  if (n < 2) {',
        '    return false;',
        '  }',
        '  for (let i = 2; i < n; i++) {',
        '    if (n % i === 0) {',
        '      return false;',
        '    }',
        '  }',
        '  return true;',
        '}',
      ),
    },
    {
      titulo: 'Sequência de Fibonacci',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Na sequência de Fibonacci, cada número é a soma dos dois anteriores: `0, 1, 1, 2, 3, 5, 8, 13...`. Escreva a função `fibonacci(n)`, que devolve o número da **posição** `n`, começando a contar do zero: `fibonacci(0)` é `0`, `fibonacci(1)` é `1`, `fibonacci(6)` é `8`.',
        },
      ],
      codigoInicial: linhas(
        'const n = 0;',
        '',
        'function fibonacci(n) {',
        '',
        '}',
        '',
        'console.log(fibonacci(n));',
        '',
      ),
      testes: [
        { descricao: 'fibonacci(0) devolve 0', codigo: js`igual(fibonacci(0), 0, 'fibonacci(0)')` },
        { descricao: 'fibonacci(1) devolve 1', codigo: js`igual(fibonacci(1), 1, 'fibonacci(1)')` },
        { descricao: 'fibonacci(2) devolve 1', codigo: js`igual(fibonacci(2), 1, 'fibonacci(2)')` },
        { descricao: 'fibonacci(6) devolve 8', codigo: js`igual(fibonacci(6), 8, 'fibonacci(6)')` },
        { descricao: 'fibonacci(10) devolve 55', codigo: js`igual(fibonacci(10), 55, 'fibonacci(10)')` },
        { descricao: 'fibonacci(20) devolve 6765', codigo: js`igual(fibonacci(20), 6765, 'fibonacci(20)')` },
      ],
      dicas: [
        'Guarde dois valores, `anterior = 0` e `atual = 1`. A cada volta, o próximo é a soma dos dois.',
        'Para trocar os dois valores sem perder nenhum, use uma variável auxiliar: `const proximo = anterior + atual; anterior = atual; atual = proximo;`.',
        'Depois de `n` voltas, `anterior` é o número da posição `n`.',
      ],
      solucao: linhas(
        'function fibonacci(n) {',
        '  let anterior = 0;',
        '  let atual = 1;',
        '  for (let i = 0; i < n; i++) {',
        '    const proximo = anterior + atual;',
        '    anterior = atual;',
        '    atual = proximo;',
        '  }',
        '  return anterior;',
        '}',
      ),
    },
    {
      titulo: 'Contando vogais',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `contarVogais(texto)`, que devolve quantas vogais (`a`, `e`, `i`, `o`, `u`) o texto tem, **sem ligar para maiúsculas**. Ignore as vogais com acento. Por exemplo, `contarVogais("JavaScript")` devolve `3`.',
        },
        {
          tipo: 'nota',
          texto:
            'Um texto também responde se **contém** outro: `"aeiou".includes("e")` devolve `true`, e `"aeiou".includes("z")` devolve `false`. Use isso para saber se uma letra é vogal.',
        },
      ],
      codigoInicial: linhas(
        'const texto = "JavaScript";',
        '',
        'function contarVogais(texto) {',
        '',
        '}',
        '',
        'console.log(contarVogais(texto));',
        '',
      ),
      testes: [
        {
          descricao: 'contarVogais("JavaScript") devolve 3',
          codigo: js`igual(contarVogais('JavaScript'), 3, "contarVogais('JavaScript')")`,
        },
        {
          descricao: 'contarVogais("banana") devolve 3',
          codigo: js`igual(contarVogais('banana'), 3, "contarVogais('banana')")`,
        },
        {
          descricao: 'Conta as maiúsculas: "AEIOU" tem 5',
          codigo: js`igual(contarVogais('AEIOU'), 5, "contarVogais('AEIOU')")`,
        },
        { descricao: 'Sem vogais, devolve 0', codigo: js`igual(contarVogais('rhythm'), 0, "contarVogais('rhythm')")` },
        { descricao: 'Um texto vazio devolve 0', codigo: js`igual(contarVogais(''), 0, "contarVogais('')")` },
        {
          descricao: 'Funciona com uma frase',
          codigo: js`igual(contarVogais('Bom dia, pessoal'), 6, "contarVogais('Bom dia, pessoal')")`,
        },
      ],
      dicas: [
        'Deixe o texto em minúsculas e percorra as letras com um `for`: `texto[i]`.',
        'Para saber se uma letra é vogal, procure-a no texto `"aeiou"`: `"aeiou".includes(letra)`.',
      ],
      solucao: linhas(
        'function contarVogais(texto) {',
        '  const minusculo = texto.toLowerCase();',
        '  let total = 0;',
        '  for (let i = 0; i < minusculo.length; i++) {',
        '    if ("aeiou".includes(minusculo[i])) {',
        '      total = total + 1;',
        '    }',
        '  }',
        '  return total;',
        '}',
      ),
    },
    {
      titulo: 'O troco em notas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Existem notas de `100`, `50`, `20`, `10`, `5` e `1`. Escreva a função `contarNotas(valor)`, que devolve **quantas notas, no mínimo,** são necessárias para formar o valor inteiro. A estratégia é pegar sempre a maior nota possível. Por exemplo, `contarNotas(187)` devolve `7`: 100 + 50 + 20 + 10 + 5 + 1 + 1.',
        },
        {
          tipo: 'nota',
          texto:
            'Para cada nota, da maior para a menor, `Math.floor(restante / 100)` diz quantas notas de 100 cabem (troque o 100 pela nota da vez). O que sobra é `restante % 100`. Repita o mesmo par de linhas para cada nota.',
        },
      ],
      codigoInicial: linhas(
        'const valor = 187;',
        '',
        'function contarNotas(valor) {',
        '',
        '}',
        '',
        'console.log(contarNotas(valor));',
        '',
      ),
      testes: [
        { descricao: 'contarNotas(187) devolve 7', codigo: js`igual(contarNotas(187), 7, 'contarNotas(187)')` },
        { descricao: 'contarNotas(0) devolve 0', codigo: js`igual(contarNotas(0), 0, 'contarNotas(0)')` },
        { descricao: 'contarNotas(5) devolve 1', codigo: js`igual(contarNotas(5), 1, 'contarNotas(5)')` },
        { descricao: 'contarNotas(99) devolve 8', codigo: js`igual(contarNotas(99), 8, 'contarNotas(99)')` },
        { descricao: 'contarNotas(300) devolve 3', codigo: js`igual(contarNotas(300), 3, 'contarNotas(300)')` },
        { descricao: 'contarNotas(4) devolve 4', codigo: js`igual(contarNotas(4), 4, 'contarNotas(4)')` },
      ],
      dicas: [
        'Guarde o que ainda falta em uma variável `restante`, começando em `valor`. Use `let` para poder mudá-la.',
        'Para cada nota (100, 50, 20, 10, 5, 1), some a quantidade que cabe e tire o que já foi usado do `restante`.',
        'A última nota, a de 1, é a mais simples: o que sobrar no fim é a quantidade de notas de 1.',
      ],
      solucao: linhas(
        'function contarNotas(valor) {',
        '  let restante = valor;',
        '  let notas = 0;',
        '  notas = notas + Math.floor(restante / 100);',
        '  restante = restante % 100;',
        '  notas = notas + Math.floor(restante / 50);',
        '  restante = restante % 50;',
        '  notas = notas + Math.floor(restante / 20);',
        '  restante = restante % 20;',
        '  notas = notas + Math.floor(restante / 10);',
        '  restante = restante % 10;',
        '  notas = notas + Math.floor(restante / 5);',
        '  restante = restante % 5;',
        '  return notas + restante;',
        '}',
      ),
    },
  ],
};
