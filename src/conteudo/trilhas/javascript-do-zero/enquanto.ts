import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const enquanto: Licao = {
  slug: 'enquanto',
  titulo: 'Repetindo com while',
  resumo: 'Repetir enquanto uma condição for verdadeira.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'O `while` repete **enquanto** a condição for verdadeira. Ele serve quando você não sabe de antemão quantas voltas serão — só sabe quando parar.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let contagem = 3;',
        '',
        'while (contagem > 0) {',
        '  console.log(contagem);',
        '  contagem = contagem - 1;',
        '}',
        '',
        'console.log("Já!");',
      ),
      saida: linhas('3', '2', '1', 'Já!'),
    },
    {
      tipo: 'p',
      texto:
        '`for` e `while` fazem o mesmo trabalho. Use `for` quando sabe quantas voltas serão, e `while` quando só sabe a condição de parada.',
    },
    {
      tipo: 'p',
      texto:
        'Laços com `while` costumam usar `Math.floor`, que arredonda para baixo e descarta a parte decimal. Dividir um número por 10 e arredondar para baixo "corta" o último dígito dele:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(Math.floor(7 / 2));', 'console.log(Math.floor(1234 / 10));'),
      saida: linhas('3', '123'),
    },
    {
      tipo: 'nota',
      texto:
        'Dentro do `while`, alguma coisa precisa mudar a condição. Se esquecer `contagem = contagem - 1`, ela nunca chega a zero e o laço não termina.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Quantas vezes dobrar',
      enunciado: [
        { tipo: 'p', texto: 'Complete `quantasVezesDobrar(inicio, limite)` usando `while`.' },
        {
          tipo: 'lista',
          itens: [
            'Comece em `inicio` e dobre o valor até ele alcançar ou ultrapassar `limite`.',
            'Devolva a quantidade de vezes que o valor foi dobrado.',
            'Exemplo: de `3` até `10`, os valores são `3`, `6` e `12`. O resultado é `2`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const inicio = 3;',
        'const limite = 10;',
        '',
        'function quantasVezesDobrar(inicio, limite) {',
        '',
        '}',
        '',
        'console.log(quantasVezesDobrar(inicio, limite));',
        '',
      ),
      testes: [
        {
          descricao: 'De 3 até 10, dobra 2 vezes',
          codigo: js`igual(quantasVezesDobrar(3, 10), 2, 'quantasVezesDobrar(3, 10)')`,
        },
        {
          descricao: 'De 1 até 100, dobra 7 vezes',
          codigo: js`igual(quantasVezesDobrar(1, 100), 7, 'quantasVezesDobrar(1, 100)')`,
        },
        {
          descricao: 'De 50 até 100, dobra 1 vez',
          codigo: js`igual(quantasVezesDobrar(50, 100), 1, 'quantasVezesDobrar(50, 100)')`,
        },
        {
          descricao: 'Se já está no limite, não dobra nenhuma vez',
          codigo: js`igual(quantasVezesDobrar(100, 100), 0, 'quantasVezesDobrar(100, 100)')`,
        },
        {
          descricao: 'De 5 até 5000, dobra 10 vezes',
          codigo: js`igual(quantasVezesDobrar(5, 5000), 10, 'quantasVezesDobrar(5, 5000)')`,
        },
        {
          descricao: 'Usa um laço while',
          codigo: js`verdadeiro(/\bwhile\s*\(/.test(codigoDoAluno), 'Resolva com um laço while.')`,
        },
      ],
      dicas: [
        'Guarde o valor atual em uma variável com `let` e conte as vezes em outra.',
        'A condição do laço é: o valor ainda é menor que o limite. Dentro do laço, dobre o valor e some 1 às vezes.',
      ],
      solucao: linhas(
        'function quantasVezesDobrar(inicio, limite) {',
        '  let valor = inicio;',
        '  let vezes = 0;',
        '  while (valor < limite) {',
        '    valor = valor * 2;',
        '    vezes = vezes + 1;',
        '  }',
        '  return vezes;',
        '}',
      ),
    },
    {
      titulo: 'Quantos dígitos?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `quantosDigitos(n)` usando `while`.' },
        {
          tipo: 'lista',
          itens: [
            '`n` será um inteiro não negativo. Devolva a quantidade de dígitos dele.',
            'O número `0` tem um dígito e deve devolver `1`.',
            'Enquanto o valor tiver dois dígitos ou mais, retire o último dígito e conte.',
            'Exemplo: `quantosDigitos(1234)` deve devolver `4`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const n = 7;',
        '',
        'function quantosDigitos(n) {',
        '',
        '}',
        '',
        'console.log(quantosDigitos(n));',
        '',
      ),
      testes: [
        { descricao: 'quantosDigitos(7) devolve 1', codigo: js`igual(quantosDigitos(7), 1, 'quantosDigitos(7)')` },
        { descricao: 'quantosDigitos(42) devolve 2', codigo: js`igual(quantosDigitos(42), 2, 'quantosDigitos(42)')` },
        {
          descricao: 'quantosDigitos(1000) devolve 4',
          codigo: js`igual(quantosDigitos(1000), 4, 'quantosDigitos(1000)')`,
        },
        {
          descricao: 'quantosDigitos(98765) devolve 5',
          codigo: js`igual(quantosDigitos(98765), 5, 'quantosDigitos(98765)')`,
        },
        { descricao: 'quantosDigitos(0) devolve 1', codigo: js`igual(quantosDigitos(0), 1, 'quantosDigitos(0)')` },
        {
          descricao: 'Usa um laço while',
          codigo: js`verdadeiro(/\bwhile\s*\(/.test(codigoDoAluno), 'Resolva com um laço while.')`,
        },
      ],
      dicas: [
        'Todo número tem pelo menos 1 dígito, então comece a contagem em 1. Enquanto `n >= 10`, ainda há mais de um dígito.',
        'Dentro do laço: `n = Math.floor(n / 10);` corta o último dígito, e a contagem aumenta em 1.',
      ],
      solucao: linhas(
        'function quantosDigitos(n) {',
        '  let digitos = 1;',
        '  while (n >= 10) {',
        '    n = Math.floor(n / 10);',
        '    digitos = digitos + 1;',
        '  }',
        '  return digitos;',
        '}',
      ),
    },
    {
      titulo: 'Soma dos dígitos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `somaDosDigitos(n)`.' },
        {
          tipo: 'lista',
          itens: [
            '`n` será um inteiro não negativo. Some seus dígitos e devolva o total.',
            'Exemplo: `somaDosDigitos(123)` deve devolver `6`.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'O último dígito de um número é o resto da divisão por 10: `123 % 10` dá `3`. E `Math.floor(123 / 10)` joga fora esse último dígito, sobrando `12`.',
        },
      ],
      codigoInicial: linhas(
        'const n = 123;',
        '',
        'function somaDosDigitos(n) {',
        '',
        '}',
        '',
        'console.log(somaDosDigitos(n));',
        '',
      ),
      testes: [
        {
          descricao: 'somaDosDigitos(123) devolve 6',
          codigo: js`igual(somaDosDigitos(123), 6, 'somaDosDigitos(123)')`,
        },
        { descricao: 'somaDosDigitos(9) devolve 9', codigo: js`igual(somaDosDigitos(9), 9, 'somaDosDigitos(9)')` },
        {
          descricao: 'somaDosDigitos(1000) devolve 1',
          codigo: js`igual(somaDosDigitos(1000), 1, 'somaDosDigitos(1000)')`,
        },
        {
          descricao: 'somaDosDigitos(98765) devolve 35',
          codigo: js`igual(somaDosDigitos(98765), 35, 'somaDosDigitos(98765)')`,
        },
        { descricao: 'somaDosDigitos(0) devolve 0', codigo: js`igual(somaDosDigitos(0), 0, 'somaDosDigitos(0)')` },
        {
          descricao: 'Usa um laço while',
          codigo: js`verdadeiro(/\bwhile\s*\(/.test(codigoDoAluno), 'Resolva com um laço while.')`,
        },
      ],
      dicas: [
        'Repita enquanto o número for maior que zero: `while (n > 0)`.',
        'A cada volta: some `n % 10` na soma e depois faça `n = Math.floor(n / 10);`.',
      ],
      solucao: linhas(
        'function somaDosDigitos(n) {',
        '  let soma = 0;',
        '  while (n > 0) {',
        '    soma = soma + (n % 10);',
        '    n = Math.floor(n / 10);',
        '  }',
        '  return soma;',
        '}',
      ),
    },
    {
      titulo: 'Passos até chegar a 1',
      enunciado: [
        { tipo: 'p', texto: 'Complete `passosAteUm(n)` para um inteiro positivo.' },
        {
          tipo: 'lista',
          itens: [
            'Repita até chegar a `1`: se o número for par, divida por `2`; se for ímpar, multiplique por `3` e some `1`.',
            'Devolva a quantidade de passos realizados.',
            'Exemplos: começando em `6`, são `8` passos. Começando em `1`, são `0` passos.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const n = 1;',
        '',
        'function passosAteUm(n) {',
        '',
        '}',
        '',
        'console.log(passosAteUm(n));',
        '',
      ),
      testes: [
        { descricao: 'passosAteUm(1) devolve 0', codigo: js`igual(passosAteUm(1), 0, 'passosAteUm(1)')` },
        { descricao: 'passosAteUm(2) devolve 1', codigo: js`igual(passosAteUm(2), 1, 'passosAteUm(2)')` },
        { descricao: 'passosAteUm(6) devolve 8', codigo: js`igual(passosAteUm(6), 8, 'passosAteUm(6)')` },
        { descricao: 'passosAteUm(7) devolve 16', codigo: js`igual(passosAteUm(7), 16, 'passosAteUm(7)')` },
        { descricao: 'passosAteUm(27) devolve 111', codigo: js`igual(passosAteUm(27), 111, 'passosAteUm(27)')` },
        {
          descricao: 'Usa um laço while',
          codigo: js`verdadeiro(/\bwhile\s*\(/.test(codigoDoAluno), 'Resolva com um laço while.')`,
        },
      ],
      dicas: [
        'Você não sabe de antemão quantos passos serão. Por isso, o `while` cabe bem: `while (n !== 1)`.',
        'Dentro do laço, um `if` decide o passo: `n % 2 === 0` é par. Em qualquer dos dois casos, some 1 aos passos.',
      ],
      solucao: linhas(
        'function passosAteUm(n) {',
        '  let passos = 0;',
        '  while (n !== 1) {',
        '    if (n % 2 === 0) {',
        '      n = n / 2;',
        '    } else {',
        '      n = n * 3 + 1;',
        '    }',
        '    passos = passos + 1;',
        '  }',
        '  return passos;',
        '}',
      ),
    },
    {
      titulo: 'Quantas parcelas faltam',
      enunciado: [
        { tipo: 'p', texto: 'Complete `quantasParcelas(divida, parcela)`.' },
        {
          tipo: 'lista',
          itens: [
            'Retire uma parcela da dívida a cada pagamento e conte os pagamentos até quitar tudo.',
            'A última parcela pode ser menor. Devolva a quantidade de pagamentos.',
            'A dívida será um inteiro não negativo e a parcela, um inteiro positivo.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const divida = 10;',
        'const parcela = 3;',
        '',
        'function quantasParcelas(divida, parcela) {',
        '',
        '}',
        '',
        'console.log(quantasParcelas(divida, parcela));',
        '',
      ),
      testes: [
        {
          descricao: 'Conta a última parcela mesmo quando ela é menor',
          codigo: js`igual(quantasParcelas(10, 3), 4, 'Dez em parcelas de três'); igual(quantasParcelas(12, 4), 3, 'Divisão exata')`,
        },
        {
          descricao: 'Sem dívida não há parcela e uma parcela pode quitar tudo',
          codigo: js`igual(quantasParcelas(0, 5), 0, 'Sem dívida'); igual(quantasParcelas(2, 5), 1, 'Uma parcela')`,
        },
      ],
      dicas: [
        'Use um contador começando em zero e um while que termina quando a dívida chega a zero ou fica negativa.',
      ],
      solucao:
        'function quantasParcelas(divida, parcela) {\n  let quantidade = 0;\n  while (divida > 0) {\n    divida = divida - parcela;\n    quantidade = quantidade + 1;\n  }\n  return quantidade;\n}',
    },
    {
      titulo: 'Dígitos de trás para frente',
      enunciado: [
        { tipo: 'p', texto: 'Complete `inverterNumero(n)` usando `while` e operações numéricas.' },
        {
          tipo: 'lista',
          itens: [
            '`n` será um inteiro não negativo. Devolva seus dígitos na ordem inversa.',
            'Não converta o número em texto. Zeros à esquerda não aparecem no resultado.',
            'Exemplo: `120` deve resultar em `21`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const n = 1234;',
        '',
        'function inverterNumero(n) {',
        '',
        '}',
        '',
        'console.log(inverterNumero(n));',
        '',
      ),
      testes: [
        {
          descricao: 'Inverte números com vários dígitos',
          codigo: js`igual(inverterNumero(1234), 4321, '1234 invertido'); igual(inverterNumero(907), 709, 'Zero no meio')`,
        },
        {
          descricao: 'Trata zero e zeros no final',
          codigo: js`igual(inverterNumero(0), 0, 'Zero'); igual(inverterNumero(120), 21, 'Zero final')`,
        },
      ],
      dicas: [
        'O último dígito é n % 10. Multiplique o resultado anterior por 10 antes de acrescentá-lo. Use Math.floor(n / 10) para tirar esse dígito de n.',
      ],
      solucao:
        'function inverterNumero(n) {\n  let invertido = 0;\n  while (n > 0) {\n    invertido = invertido * 10 + n % 10;\n    n = Math.floor(n / 10);\n  }\n  return invertido;\n}',
    },
  ],
};
