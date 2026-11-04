import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const lacos: Licao = {
  slug: 'lacos',
  titulo: 'Repetindo com for',
  resumo: 'O laço for e como acumular um resultado.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Quando algo precisa se repetir, use um laço. O `for` tem três partes entre os parênteses: onde começa, até quando continua e como avança.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('for (let i = 1; i <= 3; i++) {', '  console.log("Volta número " + i);', '}'),
      saida: linhas('Volta número 1', 'Volta número 2', 'Volta número 3'),
    },
    {
      tipo: 'p',
      texto:
        'Lendo em voz alta: comece com `i` valendo 1; enquanto `i` for menor ou igual a 3, repita o bloco; a cada volta, some 1 em `i` (`i++` é o mesmo que `i = i + 1`).',
    },
    { tipo: 'p', texto: 'Laços são ótimos para ir acumulando um resultado:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let soma = 0;',
        'for (let i = 1; i <= 4; i++) {',
        '  soma = soma + i;',
        '}',
        'console.log(soma);',
      ),
      saida: '10',
    },
    {
      tipo: 'nota',
      texto:
        'Cuidado com o laço infinito: se a condição nunca ficar falsa, o programa nunca termina. Aqui no MundoJS, um laço que passa de milhões de voltas é interrompido e você recebe um aviso — em outros lugares, a aba pode travar.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Soma até n',
      enunciado: [
        { tipo: 'p', texto: 'Complete `somaAte(n)` usando um laço `for`.' },
        {
          tipo: 'lista',
          itens: [
            'Some os números de `1` até `n`, incluindo `n`, e devolva o total.',
            'Exemplo: `somaAte(4)` deve devolver `10`.',
          ],
        },
      ],
      codigoInicial: linhas('const n = 4;', '', 'function somaAte(n) {', '', '}', '', 'console.log(somaAte(n));', ''),
      testes: [
        { descricao: 'somaAte(4) devolve 10', codigo: js`igual(somaAte(4), 10, 'somaAte(4)')` },
        { descricao: 'somaAte(1) devolve 1', codigo: js`igual(somaAte(1), 1, 'somaAte(1)')` },
        { descricao: 'somaAte(100) devolve 5050', codigo: js`igual(somaAte(100), 5050, 'somaAte(100)')` },
        { descricao: 'somaAte(0) devolve 0', codigo: js`igual(somaAte(0), 0, 'somaAte(0)')` },
        {
          descricao: 'Usa um laço for',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Resolva com um laço for.')`,
        },
      ],
      dicas: [
        'Crie uma variável com `let soma = 0;` antes do laço.',
        'O laço vai de 1 até `n`: `for (let i = 1; i <= n; i++)`. A cada volta, some `i` em `soma`.',
        'Depois do laço, devolva `soma` com `return`.',
      ],
      solucao: linhas(
        'function somaAte(n) {',
        '  let soma = 0;',
        '  for (let i = 1; i <= n; i++) {',
        '    soma = soma + i;',
        '  }',
        '  return soma;',
        '}',
      ),
    },
    {
      titulo: 'Contagem regressiva',
      enunciado: [
        { tipo: 'p', texto: 'Faça uma contagem regressiva usando `for`.' },
        {
          tipo: 'lista',
          itens: ['Mostre os números `5`, `4`, `3`, `2` e `1`, um por linha.', 'Depois do laço, mostre o texto `Já!`.'],
        },
        {
          tipo: 'nota',
          texto:
            'Para contar para trás, comece no número maior e use `i--` no lugar de `i++`: ele diminui 1 a cada volta (é o mesmo que `i = i - 1`).',
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Mostra 5, 4, 3, 2, 1 e, por fim, “Já!”',
          codigo: js`igual(saida, ['5', '4', '3', '2', '1', 'Já!'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa um laço for',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Resolva com um laço for.')`,
        },
      ],
      dicas: [
        'O laço começa em 5, continua enquanto `i >= 1` e diminui `i` a cada volta.',
        'O “Já!” fica **fora** do laço, depois da chave que o fecha.',
      ],
      solucao: linhas('for (let i = 5; i >= 1; i--) {', '  console.log(i);', '}', 'console.log("Já!");'),
    },
    {
      titulo: 'Tabuada do 7',
      enunciado: [
        { tipo: 'p', texto: 'Mostre a tabuada do `7`, de `1` até `10`.' },
        {
          tipo: 'lista',
          itens: [
            'Use uma linha para cada multiplicação.',
            'Siga este formato: `7 x 1 = 7`, `7 x 2 = 14` e assim por diante, até `7 x 10 = 70`.',
          ],
        },
      ],
      codigoInicial: linhas('const numero = 7;', ''),
      testes: [
        {
          descricao: 'Mostra as 10 contas, de “7 x 1 = 7” até “7 x 10 = 70”',
          codigo: js`igual(
  saida,
  Array.from({ length: 10 }, (_, i) => '7 x ' + (i + 1) + ' = ' + 7 * (i + 1)),
  'As linhas mostradas',
)`,
        },
        {
          descricao: 'Usa um laço for, em vez de escrever as 10 linhas',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Resolva com um laço for.')`,
        },
      ],
      dicas: [
        'O laço vai de 1 até 10, e a cada volta mostra uma linha.',
        'Cada linha cabe num template literal: `${numero} x ${i} = ${numero * i}`.',
      ],
      solucao: linhas(
        'const numero = 7;',
        '',
        'for (let i = 1; i <= 10; i++) {',
        '  console.log(`${numero} x ${i} = ${numero * i}`);',
        '}',
      ),
    },
    {
      titulo: 'Fatorial',
      enunciado: [
        { tipo: 'p', texto: 'Complete `fatorial(n)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva o produto dos inteiros de `1` até `n`.',
            'Para `0`, devolva `1`.',
            'Exemplo: `fatorial(5)` deve devolver `120`.',
          ],
        },
      ],
      codigoInicial: linhas('const n = 5;', '', 'function fatorial(n) {', '', '}', '', 'console.log(fatorial(n));', ''),
      testes: [
        { descricao: 'fatorial(5) devolve 120', codigo: js`igual(fatorial(5), 120, 'fatorial(5)')` },
        { descricao: 'fatorial(1) devolve 1', codigo: js`igual(fatorial(1), 1, 'fatorial(1)')` },
        { descricao: 'fatorial(0) devolve 1', codigo: js`igual(fatorial(0), 1, 'fatorial(0)')` },
        { descricao: 'fatorial(10) devolve 3628800', codigo: js`igual(fatorial(10), 3628800, 'fatorial(10)')` },
        {
          descricao: 'Usa um laço for',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Resolva com um laço for.')`,
        },
      ],
      dicas: [
        'É como a soma acumulada, mas com multiplicação. E atenção: quem acumula uma multiplicação não pode começar em 0.',
        'Comece com `let produto = 1;` e, a cada volta, faça `produto = produto * i`.',
      ],
      solucao: linhas(
        'function fatorial(n) {',
        '  let produto = 1;',
        '  for (let i = 1; i <= n; i++) {',
        '    produto = produto * i;',
        '  }',
        '  return produto;',
        '}',
      ),
    },
    {
      titulo: 'Contando uma letra',
      enunciado: [
        { tipo: 'p', texto: 'Complete `contarLetra(texto, letra)`.' },
        {
          tipo: 'lista',
          itens: [
            'Percorra o texto e conte quantas vezes a letra recebida aparece.',
            'Diferencie maiúsculas de minúsculas e devolva a contagem.',
            'Exemplo: `contarLetra("banana", "a")` deve devolver `3`.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Um laço pode passar por todos os caracteres de um texto: `i` vai de `0` até antes de `texto.length`, e `texto[i]` é o caractere da vez.',
        },
      ],
      codigoInicial: linhas(
        'const texto = "banana";',
        'const letra = "a";',
        '',
        'function contarLetra(texto, letra) {',
        '',
        '}',
        '',
        'console.log(contarLetra(texto, letra));',
        '',
      ),
      testes: [
        {
          descricao: 'contarLetra("banana", "a") devolve 3',
          codigo: js`igual(contarLetra('banana', 'a'), 3, 'contarLetra("banana", "a")')`,
        },
        {
          descricao: 'contarLetra("banana", "n") devolve 2',
          codigo: js`igual(contarLetra('banana', 'n'), 2, 'contarLetra("banana", "n")')`,
        },
        {
          descricao: 'Uma letra que não aparece devolve 0',
          codigo: js`igual(contarLetra('banana', 'z'), 0, 'contarLetra("banana", "z")')`,
        },
        { descricao: 'Um texto vazio devolve 0', codigo: js`igual(contarLetra('', 'a'), 0, 'contarLetra("", "a")')` },
        {
          descricao: 'Maiúscula e minúscula são diferentes',
          codigo: js`igual(contarLetra('Abacaxi', 'a'), 2, 'contarLetra("Abacaxi", "a")')`,
        },
        {
          descricao: 'A letra maiúscula também conta, sozinha',
          codigo: js`igual(contarLetra('Abacaxi', 'A'), 1, 'contarLetra("Abacaxi", "A")')`,
        },
        {
          descricao: 'Usa um laço for',
          codigo: js`verdadeiro(/\bfor\s*\(/.test(codigoDoAluno), 'Resolva com um laço for.')`,
        },
      ],
      dicas: [
        'Crie um contador com `let total = 0;` e percorra o texto com `for (let i = 0; i < texto.length; i++)`.',
        'Dentro do laço, um `if` compara `texto[i] === letra`. Quando for verdade, some 1 ao contador.',
      ],
      solucao: linhas(
        'function contarLetra(texto, letra) {',
        '  let total = 0;',
        '  for (let i = 0; i < texto.length; i++) {',
        '    if (texto[i] === letra) {',
        '      total = total + 1;',
        '    }',
        '  }',
        '  return total;',
        '}',
      ),
    },
    {
      titulo: 'Somando múltiplos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `somarMultiplos(limite, divisor)`.' },
        {
          tipo: 'lista',
          itens: [
            'Some os números de `1` até `limite`, incluindo o limite, que sejam divisíveis por `divisor`.',
            'Devolva a soma. O limite é um inteiro não negativo e o divisor é um inteiro positivo.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const limite = 10;',
        'const divisor = 3;',
        '',
        'function somarMultiplos(limite, divisor) {',
        '',
        '}',
        '',
        'console.log(somarMultiplos(limite, divisor));',
        '',
      ),
      testes: [
        {
          descricao: 'Soma os múltiplos dentro do intervalo',
          codigo: js`igual(somarMultiplos(10, 3), 18, 'Múltiplos de três'); igual(somarMultiplos(8, 2), 20, 'Múltiplos de dois')`,
        },
        {
          descricao: 'Trata intervalo vazio e divisor maior que o limite',
          codigo: js`igual(somarMultiplos(0, 3), 0, 'Limite zero'); igual(somarMultiplos(2, 5), 0, 'Sem múltiplos')`,
        },
      ],
      dicas: ['Use um acumulador e um if dentro do for. O resto zero indica um múltiplo.'],
      solucao:
        'function somarMultiplos(limite, divisor) {\n  let soma = 0;\n  for (let i = 1; i <= limite; i++) {\n    if (i % divisor === 0) soma = soma + i;\n  }\n  return soma;\n}',
    },
    {
      titulo: 'A última volta que faltava',
      enunciado: [
        { tipo: 'p', texto: 'Corrija o limite do `for` em `contarPassos(n)`.' },
        {
          tipo: 'lista',
          itens: ['O laço deve contar de `1` até `n`, incluindo o último número.', '`n` será um inteiro positivo.'],
        },
      ],
      codigoInicial: linhas(
        'const n = 3;',
        '',
        'function contarPassos(n) {',
        '  let total = 0;',
        '  for (let i = 1; i < n; i++) total = total + 1;',
        '  return total;',
        '}',
        '',
        'console.log(contarPassos(n));',
        '',
      ),
      testes: [
        {
          descricao: 'Inclui a terceira e a sétima voltas',
          codigo: js`igual(contarPassos(3), 3, 'Três passos'); igual(contarPassos(7), 7, 'Sete passos')`,
        },
        { descricao: 'Um passo também precisa ser contado', codigo: js`igual(contarPassos(1), 1, 'Um passo')` },
      ],
      dicas: ['Menor que para antes de n. Para incluir o próprio n, use menor ou igual.'],
      solucao:
        'function contarPassos(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) total = total + 1;\n  return total;\n}',
    },
  ],
};
