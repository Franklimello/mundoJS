import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const mathArredondamentos: Licao = {
  slug: 'math-arredondamentos',
  titulo: 'Math: arredondar números',
  resumo: 'round, floor, ceil e trunc em situações do dia a dia.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Você não precisa criar toda conta do zero. **Math** reúne ferramentas de matemática que já vêm no JavaScript. Use o nome com M maiúsculo, um ponto e o método desejado. Não precisa instalar uma biblioteca nem escrever import.',
    },
    {
      tipo: 'p',
      texto:
        '`Math.round(numero)` escolhe o inteiro mais próximo. No empate, escolhe o maior: `Math.round(2.5)` é `3` e `Math.round(-2.5)` é `-2`.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(Math.round(7.2));', 'console.log(Math.round(7.5));'),
      saida: linhas('7', '8'),
    },
    {
      tipo: 'p',
      texto:
        '`Math.floor(numero)` arredonda para baixo. `Math.ceil(numero)` arredonda para cima. Use floor para contar grupos completos e ceil quando qualquer sobra exige mais um grupo.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(Math.floor(9 / 2));', 'console.log(Math.ceil(25 / 12));'),
      saida: linhas('4', '3'),
    },
    {
      tipo: 'p',
      texto:
        '`Math.trunc(numero)` retira a parte decimal. Com números negativos, ele se comporta de forma diferente de floor.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(Math.trunc(-8.9));', 'console.log(Math.floor(-8.9));'),
      saida: linhas('-8', '-9'),
    },
    {
      tipo: 'nota',
      texto:
        'Nesta trilha, complete funções e devolva o resultado com return. Os dados e uma chamada de exemplo já estão no editor. Rodar mostra a tentativa; Conferir avalia outros valores também.',
    },
  ],
  exercicios: [
    {
      titulo: 'A nota inteira mais próxima',
      enunciado: [
        { tipo: 'p', texto: 'Complete `arredondarNota(nota)` para devolver o inteiro mais próximo da nota.' },
        {
          tipo: 'lista',
          itens: [
            'Use `Math.round` e devolva um número.',
            'A nota será um número de 0 a 10.',
            'Exemplos: `7.2` vira `7`; `7.5` vira `8`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const notas = [7.2, 7.5, 8.9];',
        '',
        'function arredondarNota(nota) {',
        '}',
        '',
        'console.log(arredondarNota(notas[0]));',
      ),
      testes: [
        {
          descricao: 'Arredonda notas abaixo, acima e no meio do intervalo',
          codigo: js`igual(arredondarNota(7.2), 7); igual(arredondarNota(7.5), 8); igual(arredondarNota(8.9), 9); igual(arredondarNota(0), 0);`,
        },
        {
          descricao: 'Usa a ferramenta Math.round',
          codigo: js`verdadeiro(/\bMath\s*\.\s*round\s*\(/.test(codigoDoAluno), 'Use Math.round para arredondar a nota.');`,
        },
      ],
      dicas: [
        'Passe a nota recebida para `Math.round`.',
        'Devolva o resultado com `return`, em vez de apenas mostrar com console.log.',
      ],
      solucao: 'function arredondarNota(nota) {\n  return Math.round(nota);\n}',
    },
    {
      titulo: 'Quantos pares completos?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `paresCompletos(quantidade)` para contar pares de peças.' },
        {
          tipo: 'lista',
          itens: [
            'Cada par usa duas peças. Uma peça que sobrar não forma um novo par.',
            'Use `Math.floor`. A quantidade será um inteiro maior ou igual a zero.',
            'Exemplo: com `9` peças, devolva `4`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const pecas = 9;',
        '',
        'function paresCompletos(quantidade) {',
        '}',
        '',
        'console.log(paresCompletos(pecas));',
      ),
      testes: [
        {
          descricao: 'Conta somente os pares completos',
          codigo: js`igual(paresCompletos(9), 4); igual(paresCompletos(10), 5); igual(paresCompletos(1), 0); igual(paresCompletos(0), 0);`,
        },
        {
          descricao: 'Usa Math.floor',
          codigo: js`verdadeiro(/\bMath\s*\.\s*floor\s*\(/.test(codigoDoAluno), 'Use Math.floor depois de dividir por dois.');`,
        },
      ],
      dicas: ['Divida a quantidade de peças por dois.', 'Arredonde a divisão para baixo e devolva o resultado.'],
      solucao: 'function paresCompletos(quantidade) {\n  return Math.floor(quantidade / 2);\n}',
    },
    {
      titulo: 'Caixas para o pedido',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Complete `caixasNecessarias(total, porCaixa)` para calcular quantas caixas acomodam todos os itens.',
        },
        {
          tipo: 'lista',
          itens: [
            'Use `Math.ceil`: qualquer sobra precisa de mais uma caixa.',
            '`total` será um inteiro maior ou igual a zero; `porCaixa` será um inteiro maior que zero.',
            'Exemplos: `caixasNecessarias(25, 12)` devolve `3`; sem itens, devolve `0`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const pedido = { total: 25, porCaixa: 12 };',
        '',
        'function caixasNecessarias(total, porCaixa) {',
        '}',
        '',
        'console.log(caixasNecessarias(pedido.total, pedido.porCaixa));',
      ),
      testes: [
        {
          descricao: 'Inclui uma caixa para a sobra, sem acrescentar caixas desnecessárias',
          codigo: js`igual(caixasNecessarias(25, 12), 3); igual(caixasNecessarias(24, 12), 2); igual(caixasNecessarias(1, 8), 1); igual(caixasNecessarias(0, 8), 0);`,
        },
        {
          descricao: 'Usa Math.ceil',
          codigo: js`verdadeiro(/\bMath\s*\.\s*ceil\s*\(/.test(codigoDoAluno), 'Use Math.ceil para incluir a caixa da sobra.');`,
        },
      ],
      dicas: ['Calcule `total / porCaixa`.', 'Arredonde essa divisão para cima com `Math.ceil`.'],
      solucao: 'function caixasNecessarias(total, porCaixa) {\n  return Math.ceil(total / porCaixa);\n}',
    },
    {
      titulo: 'Retire as casas decimais',
      enunciado: [
        { tipo: 'p', texto: 'Complete `parteInteira(numero)` usando `Math.trunc`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva o número sem a parte decimal, aproximando-o de zero.',
            'A função deve aceitar números positivos e negativos.',
            'Exemplos: `8.9` vira `8`; `-8.9` vira `-8`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const valores = [8.9, -8.9, 4];',
        '',
        'function parteInteira(numero) {',
        '}',
        '',
        'console.log(parteInteira(valores[1]));',
      ),
      testes: [
        {
          descricao: 'Retira os decimais também em números negativos',
          codigo: js`igual(parteInteira(8.9), 8); igual(parteInteira(-8.9), -8); igual(parteInteira(-1.2), -1); igual(parteInteira(4), 4);`,
        },
        {
          descricao: 'Usa Math.trunc',
          codigo: js`verdadeiro(/\bMath\s*\.\s*trunc\s*\(/.test(codigoDoAluno), 'Use Math.trunc; Math.floor tem outro resultado para negativos.');`,
        },
      ],
      dicas: [
        'Você não precisa separar o número em texto.',
        '`Math.trunc` já retira a parte decimal e devolve um número.',
      ],
      solucao: 'function parteInteira(numero) {\n  return Math.trunc(numero);\n}',
    },
  ],
};
