import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const mathValores: Licao = {
  slug: 'math-valores',
  titulo: 'Math: valores e medidas',
  resumo: 'abs, min, max, pow, sqrt e PI para resolver problemas práticos.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`Math.abs(numero)` dá a distância de um número até zero. Por isso, `Math.abs(-8)` é `8`. Para calcular a distância entre dois valores, use o valor absoluto da diferença.',
    },
    { tipo: 'codigo', codigo: 'console.log(Math.abs(3 - 10));', saida: '7' },
    {
      tipo: 'p',
      texto:
        '`Math.min` escolhe o menor valor e `Math.max` escolhe o maior. Eles recebem números separados por vírgula. Para usar um array pequeno, escreva `...` antes dele: isso entrega seus itens como argumentos.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const temperaturas = [18, 27, 21];',
        'console.log(Math.min(...temperaturas));',
        'console.log(Math.max(...temperaturas));',
      ),
      saida: linhas('18', '27'),
    },
    {
      tipo: 'p',
      texto:
        '`Math.pow(base, expoente)` calcula uma potência; `Math.sqrt(numero)` calcula a raiz quadrada. Por exemplo, elevar 3 ao quadrado produz 9, e a raiz quadrada de 9 é 3.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(Math.pow(3, 2));', 'console.log(Math.sqrt(9));'),
      saida: linhas('9', '3'),
    },
    {
      tipo: 'p',
      texto:
        '`Math.PI` é uma aproximação de pi, usada em cálculos com círculos. É uma constante: escreva sem parênteses. A área de um círculo é pi vezes o raio ao quadrado.',
    },
    {
      tipo: 'nota',
      texto:
        'Nas atividades com medidas, devolva o número calculado, sem transformar em texto com toFixed. A correção aceita pequenas diferenças de precisão. Aqui usamos números finitos e arrays pequenos; no exercício de extremos, a lista sempre terá ao menos um item.',
    },
  ],
  exercicios: [
    {
      titulo: 'A distância entre dois pontos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `distancia(a, b)` para devolver a distância entre dois pontos de uma reta.' },
        {
          tipo: 'lista',
          itens: [
            'Use `Math.abs` na diferença entre os valores.',
            'A distância nunca deve ser negativa.',
            'Exemplos: `distancia(3, 10)` e `distancia(10, 3)` devolvem `7`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const pontos = { inicio: 3, fim: 10 };',
        '',
        'function distancia(a, b) {',
        '}',
        '',
        'console.log(distancia(pontos.inicio, pontos.fim));',
      ),
      testes: [
        {
          descricao: 'Calcula a distância independentemente da ordem',
          codigo: js`igual(distancia(3, 10), 7); igual(distancia(10, 3), 7); igual(distancia(-4, 2), 6); igual(distancia(5, 5), 0);`,
        },
      ],
      dicas: ['Subtraia um ponto do outro.', 'Passe essa diferença para `Math.abs` e devolva o resultado.'],
      solucao: 'function distancia(a, b) {\n  return Math.abs(a - b);\n}',
    },
    {
      titulo: 'O menor e o maior da lista',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Complete `extremos(numeros)` para devolver um objeto com o menor e o maior número da lista.',
        },
        {
          tipo: 'lista',
          itens: [
            'O objeto deve ter as propriedades `menor` e `maior`.',
            'Use `Math.min` e `Math.max` com `...numeros`. A lista sempre terá ao menos um número.',
            'Não altere o array recebido.',
            'Exemplo: `[18, 27, 21]` resulta em `{ menor: 18, maior: 27 }`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const temperaturas = [18, 27, 21];',
        '',
        'function extremos(numeros) {',
        '}',
        '',
        'console.log(extremos(temperaturas));',
      ),
      testes: [
        {
          descricao: 'Encontra extremos, inclusive negativos e listas com um item',
          codigo: js`igual(extremos([18, 27, 21]), { menor: 18, maior: 27 }); igual(extremos([-8, -2, -5]), { menor: -8, maior: -2 }); igual(extremos([4]), { menor: 4, maior: 4 });`,
        },
        {
          descricao: 'Mantém o array original',
          codigo: js`const entrada = [3, 1, 2]; igual(extremos(entrada), { menor: 1, maior: 3 }); igual(entrada, [3, 1, 2]);`,
        },
      ],
      dicas: [
        '`Math.min(numeros)` não entrega cada item separadamente. Use `Math.min(...numeros)`.',
        'Monte um objeto e use um método para cada propriedade.',
      ],
      solucao:
        'function extremos(numeros) {\n  return { menor: Math.min(...numeros), maior: Math.max(...numeros) };\n}',
    },
    {
      titulo: 'A diagonal do retângulo',
      enunciado: [
        { tipo: 'p', texto: 'Complete `diagonal(largura, altura)` para calcular a diagonal de um retângulo.' },
        {
          tipo: 'lista',
          itens: [
            'A fórmula é a raiz quadrada de largura ao quadrado mais altura ao quadrado.',
            'Use `Math.sqrt` e, para as potências, `Math.pow` ou `**`.',
            'As medidas serão números maiores ou iguais a zero. Devolva o resultado sem arredondar.',
            'Exemplo: `diagonal(3, 4)` devolve `5`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const retangulo = { largura: 3, altura: 4 };',
        '',
        'function diagonal(largura, altura) {',
        '}',
        '',
        'console.log(diagonal(retangulo.largura, retangulo.altura));',
      ),
      testes: [
        {
          descricao: 'Calcula a diagonal sem arredondar o resultado',
          codigo: js`igual(diagonal(3, 4), 5); igual(diagonal(5, 12), 13); igual(diagonal(0, 0), 0); verdadeiro(Math.abs(diagonal(1, 1) - Math.SQRT2) < 1e-9, 'A diagonal de 1 por 1 deve ser a raiz de 2, sem arredondar.');`,
        },
      ],
      dicas: [
        'Calcule os dois quadrados antes de tirar a raiz.',
        'A soma inteira deve ficar dentro de `Math.sqrt(...)`.',
      ],
      solucao:
        'function diagonal(largura, altura) {\n  return Math.sqrt(Math.pow(largura, 2) + Math.pow(altura, 2));\n}',
    },
    {
      titulo: 'A área do círculo',
      enunciado: [
        { tipo: 'p', texto: 'Complete `areaCirculo(raio)` para calcular a área de um círculo.' },
        {
          tipo: 'lista',
          itens: [
            'Use `Math.PI` vezes o raio ao quadrado.',
            'O raio será maior ou igual a zero. Devolva um número, sem arredondar.',
            'Exemplo: com raio `2`, a área fica aproximadamente `12.566370614359172`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const raioExemplo = 2;',
        '',
        'function areaCirculo(raio) {',
        '}',
        '',
        'console.log(areaCirculo(raioExemplo));',
      ),
      testes: [
        {
          descricao: 'Usa a precisão de pi e aceita raio zero',
          codigo: js`verdadeiro(Math.abs(areaCirculo(2) - 4 * Math.PI) < 1e-9); verdadeiro(Math.abs(areaCirculo(0.5) - Math.PI / 4) < 1e-9); igual(areaCirculo(0), 0);`,
        },
      ],
      dicas: ['`Math.PI` não recebe parênteses.', 'Multiplique pi por `raio * raio` ou use uma potência.'],
      solucao: 'function areaCirculo(raio) {\n  return Math.PI * raio ** 2;\n}',
    },
  ],
};
