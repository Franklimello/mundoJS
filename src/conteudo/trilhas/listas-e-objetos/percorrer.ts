import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const percorrer: Licao = {
  slug: 'percorrer',
  titulo: 'Percorrendo uma lista',
  resumo: 'O laço for...of e como calcular uma média.',
  conteudo: [
    {
      tipo: 'p',
      texto: 'Para fazer algo com cada item de uma lista, use `for...of`. Ele pega um item de cada vez:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('const notas = [7, 5, 9];', '', 'for (const nota of notas) {', '  console.log(nota);', '}'),
      saida: linhas('7', '5', '9'),
    },
    { tipo: 'p', texto: 'Junto de uma variável acumuladora, ele calcula somas e médias:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let soma = 0;',
        'for (const nota of notas) {',
        '  soma = soma + nota;',
        '}',
        'console.log(soma / notas.length);',
      ),
      saida: '7',
    },
    {
      tipo: 'nota',
      texto:
        'O `for` clássico também percorre listas: `for (let i = 0; i < notas.length; i++)` e `notas[i]`. Use-o quando precisar saber a **posição** do item; do contrário, `for...of` é mais simples.',
    },
  ],
  exercicios: [
    {
      titulo: 'Média de uma lista',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `media(numeros)`, que devolve a média dos números da lista. Se a lista estiver vazia, devolva `0` — dividir por zero daria um resultado sem sentido.',
        },
      ],
      codigoInicial: linhas(
        'const numeros = [7, 5, 9];',
        '',
        'function media(numeros) {',
        '',
        '}',
        '',
        'console.log(media(numeros));',
        '',
      ),
      testes: [
        { descricao: 'media([7, 5, 9]) devolve 7', codigo: js`igual(media([7, 5, 9]), 7, 'media([7, 5, 9])')` },
        { descricao: 'media([10]) devolve 10', codigo: js`igual(media([10]), 10, 'media([10])')` },
        { descricao: 'media([1, 2]) devolve 1.5', codigo: js`igual(media([1, 2]), 1.5, 'media([1, 2])')` },
        { descricao: 'media([]) devolve 0', codigo: js`igual(media([]), 0, 'media([])')` },
      ],
      dicas: [
        'Percorra a lista com `for (const numero of numeros)` somando em uma variável `let`.',
        'No fim, divida a soma por `numeros.length`. Antes disso, trate a lista vazia com um `if`.',
      ],
      solucao: linhas(
        'function media(numeros) {',
        '  if (numeros.length === 0) {',
        '    return 0;',
        '  }',
        '  let soma = 0;',
        '  for (const numero of numeros) {',
        '    soma = soma + numero;',
        '  }',
        '  return soma / numeros.length;',
        '}',
      ),
    },
    {
      titulo: 'Soma dos pares',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `somaDosPares(numeros)`, que soma só os números **pares** da lista. Em `[1, 2, 3, 4]`, são o 2 e o 4: a soma é `6`. Sem números pares, devolva `0`.',
        },
      ],
      codigoInicial: linhas(
        'const numeros = [1, 2, 3, 4];',
        '',
        'function somaDosPares(numeros) {',
        '',
        '}',
        '',
        'console.log(somaDosPares(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'somaDosPares([1, 2, 3, 4]) devolve 6',
          codigo: js`igual(somaDosPares([1, 2, 3, 4]), 6, 'somaDosPares([1, 2, 3, 4])')`,
        },
        { descricao: 'Sem pares, devolve 0', codigo: js`igual(somaDosPares([1, 3, 5]), 0, 'somaDosPares([1, 3, 5])')` },
        { descricao: 'Lista vazia devolve 0', codigo: js`igual(somaDosPares([]), 0, 'somaDosPares([])')` },
        {
          descricao: 'somaDosPares([2, 4, 6]) devolve 12',
          codigo: js`igual(somaDosPares([2, 4, 6]), 12, 'somaDosPares([2, 4, 6])')`,
        },
        {
          descricao: 'O zero e os negativos pares contam',
          codigo: js`igual(somaDosPares([0, -2, 7, 10]), 8, 'somaDosPares([0, -2, 7, 10])')`,
        },
      ],
      dicas: [
        'Dentro do `for...of`, um `if` decide se o número é par: `numero % 2 === 0`.',
        'Só quando for par, some o número no acumulador.',
      ],
      solucao: linhas(
        'function somaDosPares(numeros) {',
        '  let soma = 0;',
        '  for (const numero of numeros) {',
        '    if (numero % 2 === 0) {',
        '      soma = soma + numero;',
        '    }',
        '  }',
        '  return soma;',
        '}',
      ),
    },
    {
      titulo: 'O maior da lista',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `maiorDaLista(numeros)`, que devolve o maior número de uma lista **que não está vazia**. Resolva com um laço, guardando "o maior até agora".',
        },
        {
          tipo: 'nota',
          texto:
            'Não comece o "maior até agora" em `0`: numa lista só de negativos, como `[-5, -2, -9]`, o `0` ganharia de todos. Comece pelo primeiro item da lista.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas(
        'const numeros = [3, 9, 2];',
        '',
        'function maiorDaLista(numeros) {',
        '',
        '}',
        '',
        'console.log(maiorDaLista(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'maiorDaLista([3, 9, 2]) devolve 9',
          codigo: js`igual(maiorDaLista([3, 9, 2]), 9, 'maiorDaLista([3, 9, 2])')`,
        },
        { descricao: 'Um número só devolve ele mesmo', codigo: js`igual(maiorDaLista([7]), 7, 'maiorDaLista([7])')` },
        {
          descricao: 'Funciona só com negativos',
          codigo: js`igual(maiorDaLista([-5, -2, -9]), -2, 'maiorDaLista([-5, -2, -9])')`,
        },
        {
          descricao: 'O maior pode estar no começo',
          codigo: js`igual(maiorDaLista([10, 4, 6]), 10, 'maiorDaLista([10, 4, 6])')`,
        },
        {
          descricao: 'O maior pode estar no fim',
          codigo: js`igual(maiorDaLista([1, 2, 3, 4, 50]), 50, 'maiorDaLista([1, 2, 3, 4, 50])')`,
        },
        {
          descricao: 'Usa um laço',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Percorra a lista com um laço for.')`,
        },
      ],
      dicas: [
        'Comece com `let maior = numeros[0];`.',
        'Percorra a lista: se o número da vez for maior que `maior`, guarde-o em `maior`.',
      ],
      solucao: linhas(
        'function maiorDaLista(numeros) {',
        '  let maior = numeros[0];',
        '  for (const numero of numeros) {',
        '    if (numero > maior) {',
        '      maior = numero;',
        '    }',
        '  }',
        '  return maior;',
        '}',
      ),
    },
    {
      titulo: 'Quantas vezes aparece',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `contar(lista, valor)`, que devolve quantas vezes `valor` aparece na lista. Por exemplo, `contar([1, 2, 1, 3, 1], 1)` devolve `3`.',
        },
      ],
      codigoInicial: linhas(
        'const lista = [1, 2, 1, 3, 1];',
        'const valor = 1;',
        '',
        'function contar(lista, valor) {',
        '',
        '}',
        '',
        'console.log(contar(lista, valor));',
        '',
      ),
      testes: [
        {
          descricao: 'contar([1, 2, 1, 3, 1], 1) devolve 3',
          codigo: js`igual(contar([1, 2, 1, 3, 1], 1), 3, 'contar([1, 2, 1, 3, 1], 1)')`,
        },
        {
          descricao: 'Um valor que não aparece devolve 0',
          codigo: js`igual(contar(['a', 'b'], 'c'), 0, "contar(['a', 'b'], 'c')")`,
        },
        { descricao: 'Uma lista vazia devolve 0', codigo: js`igual(contar([], 5), 0, 'contar([], 5)')` },
        {
          descricao: 'Funciona com textos',
          codigo: js`igual(contar(['x', 'y', 'x', 'x'], 'x'), 3, "contar(['x', 'y', 'x', 'x'], 'x')")`,
        },
        { descricao: 'Tudo igual conta tudo', codigo: js`igual(contar([4, 4, 4], 4), 3, 'contar([4, 4, 4], 4)')` },
      ],
      dicas: [
        'Use um contador que começa em `0` e um `if (item === valor)` dentro do laço.',
        'Quando o `if` for verdadeiro, some 1 ao contador.',
      ],
      solucao: linhas(
        'function contar(lista, valor) {',
        '  let total = 0;',
        '  for (const item of lista) {',
        '    if (item === valor) {',
        '      total = total + 1;',
        '    }',
        '  }',
        '  return total;',
        '}',
      ),
    },
    {
      titulo: 'Nomes separados por vírgula',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `listaEmTexto(nomes)`, que devolve os nomes num texto só, separados por `", "` (vírgula e espaço): `["Ana", "Bia", "Caio"]` vira `"Ana, Bia, Caio"`. Uma lista de um nome devolve só o nome, e uma lista vazia devolve `""`.',
        },
        {
          tipo: 'nota',
          texto:
            'Existe uma ferramenta pronta para isso, o `join`, mas ela fica para uma lição mais adiante. Aqui, monte o texto com o laço: o difícil é não deixar vírgula sobrando no começo ou no fim.',
        },
      ],
      codigoInicial: linhas(
        'const nomes = ["Ana", "Bia", "Caio"];',
        '',
        'function listaEmTexto(nomes) {',
        '',
        '}',
        '',
        'console.log(listaEmTexto(nomes));',
        '',
      ),
      testes: [
        {
          descricao: 'Três nomes viram “Ana, Bia, Caio”',
          codigo: js`igual(listaEmTexto(['Ana', 'Bia', 'Caio']), 'Ana, Bia, Caio', "listaEmTexto(['Ana', 'Bia', 'Caio'])")`,
        },
        {
          descricao: 'Dois nomes viram “Ana, Bia”',
          codigo: js`igual(listaEmTexto(['Ana', 'Bia']), 'Ana, Bia', "listaEmTexto(['Ana', 'Bia'])")`,
        },
        {
          descricao: 'Um nome só devolve o nome',
          codigo: js`igual(listaEmTexto(['Ana']), 'Ana', "listaEmTexto(['Ana'])")`,
        },
        { descricao: 'Lista vazia devolve texto vazio', codigo: js`igual(listaEmTexto([]), '', 'listaEmTexto([])')` },
        {
          descricao: 'Monta o texto com um laço, sem o join',
          codigo: js`verdadeiro(
  /for\s*[(]/.test(codigoDoAluno) && !codigoDoAluno.includes('.join('),
  'Monte o texto com um laço for; o join vem numa lição mais adiante.',
)`,
        },
      ],
      dicas: [
        'Comece com um texto vazio: `let texto = "";`. A cada nome, junte-o ao texto.',
        'A vírgula vai **antes** de cada nome, menos do primeiro: `if (texto !== "")` diz se já há algo no texto.',
      ],
      solucao: linhas(
        'function listaEmTexto(nomes) {',
        '  let texto = "";',
        '  for (const nome of nomes) {',
        '    if (texto !== "") {',
        '      texto = texto + ", ";',
        '    }',
        '    texto = texto + nome;',
        '  }',
        '  return texto;',
        '}',
      ),
    },
    {
      titulo: 'O primeiro acima do limite',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `primeiroAcima(lista, limite)`, que percorre os números e devolve o primeiro valor maior que limite, na ordem da lista. Se nenhum servir, devolva null. Resolva com um laço.',
        },
      ],
      codigoInicial: linhas(
        'const lista = [3, 12, 8, 20];',
        'const limite = 7;',
        '',
        'function primeiroAcima(lista, limite) {',
        '',
        '}',
        '',
        'console.log(primeiroAcima(lista, limite));',
        '',
      ),
      testes: [
        {
          descricao: 'A ordem da lista decide qual valor é o primeiro',
          codigo: js`igual(primeiroAcima([3, 12, 8, 20], 7), 12, 'Primeiro acima de sete'); igual(primeiroAcima([-5, 0, 2], -1), 0, 'Zero também é resultado')`,
        },
        {
          descricao: 'Devolve null quando não há um valor maior',
          codigo: js`igual(primeiroAcima([1, 5, 5], 5), null, 'Igual não basta'); igual(primeiroAcima([], 0), null, 'Lista vazia')`,
        },
      ],
      dicas: ['Um return dentro do laço encerra a busca. Deixe return null depois do laço para o caso sem resultado.'],
      solucao:
        'function primeiroAcima(lista, limite) {\n  for (const valor of lista) {\n    if (valor > limite) return valor;\n  }\n  return null;\n}',
    },
    {
      titulo: 'Multiplicando os valores',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `multiplicarValores(lista)`, que multiplica todos os números da lista e devolve o produto. Para uma lista vazia, devolva 1. Use um acumulador em um laço.',
        },
      ],
      codigoInicial: linhas(
        'const lista = [2, 3, 4];',
        '',
        'function multiplicarValores(lista) {',
        '',
        '}',
        '',
        'console.log(multiplicarValores(lista));',
        '',
      ),
      testes: [
        {
          descricao: 'Multiplica positivos e negativos',
          codigo: js`igual(multiplicarValores([2, 3, 4]), 24, 'Produto positivo'); igual(multiplicarValores([-2, 3]), -6, 'Produto negativo')`,
        },
        {
          descricao: 'Trata zero e a lista vazia',
          codigo: js`igual(multiplicarValores([4, 0, 7]), 0, 'Zero no produto'); igual(multiplicarValores([]), 1, 'Produto vazio')`,
        },
      ],
      dicas: ['A soma começa em zero, mas o produto começa em um. A cada volta, multiplique pelo próximo valor.'],
      solucao:
        'function multiplicarValores(lista) {\n  let produto = 1;\n  for (const valor of lista) produto = produto * valor;\n  return produto;\n}',
    },
  ],
};
