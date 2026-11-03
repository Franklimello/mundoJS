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
        {
          tipo: 'p',
          texto:
            'Escreva a função `quantasVezesDobrar(inicio, limite)`. Começando em `inicio`, ela dobra o valor repetidamente e devolve **quantas vezes** foi preciso dobrar até o valor chegar ao `limite` ou passar dele. Por exemplo, de 3 até 10: 3 → 6 → 12, são 2 vezes. Use um laço `while`.',
        },
      ],
      codigoInicial: linhas('function quantasVezesDobrar(inicio, limite) {', '  // use um laço while', '}', ''),
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
        {
          tipo: 'p',
          texto:
            'Escreva a função `quantosDigitos(n)`, que devolve quantos dígitos tem o número inteiro `n` (zero ou maior). Por exemplo, `quantosDigitos(1234)` devolve `4`. Use um laço `while`: enquanto o número tiver dois dígitos ou mais, corte o último e conte.',
        },
      ],
      codigoInicial: linhas('function quantosDigitos(n) {', '  // corte o último dígito até sobrar um só', '}', ''),
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
        {
          tipo: 'p',
          texto:
            'Escreva a função `somaDosDigitos(n)`, que soma os dígitos de um número inteiro (zero ou maior). Por exemplo, `somaDosDigitos(123)` devolve `6`, porque 1 + 2 + 3 = 6.',
        },
        {
          tipo: 'nota',
          texto:
            'O último dígito de um número é o resto da divisão por 10: `123 % 10` dá `3`. E `Math.floor(123 / 10)` joga fora esse último dígito, sobrando `12`.',
        },
      ],
      codigoInicial: linhas('function somaDosDigitos(n) {', '  // pegue o último dígito, some, e corte-o', '}', ''),
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
        {
          tipo: 'p',
          texto: 'Pegue um número inteiro positivo e repita estes passos até ele chegar a `1`:',
        },
        {
          tipo: 'lista',
          itens: ['se o número é **par**, divida-o por 2;', 'se é **ímpar**, multiplique por 3 e some 1.'],
        },
        {
          tipo: 'p',
          texto:
            'Escreva a função `passosAteUm(n)`, que devolve quantos passos foram necessários. De 6, por exemplo: 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1, são 8 passos. Quem já está no 1 precisa de 0.',
        },
      ],
      codigoInicial: linhas('function passosAteUm(n) {', '  // repita até n chegar a 1, contando os passos', '}', ''),
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
        {
          tipo: 'p',
          texto:
            'Crie `quantasParcelas(divida, parcela)`. Enquanto houver dívida, desconte uma parcela e conte o pagamento. A última pode ser menor. Considere dívida inteira não negativa e parcela inteira positiva.',
        },
      ],
      codigoInicial:
        'function quantasParcelas(divida, parcela) {\n  // repita os pagamentos enquanto houver dívida\n}\n',
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
        {
          tipo: 'p',
          texto:
            'Crie `inverterNumero(n)`, que inverte os dígitos de um inteiro não negativo usando while e contas. Zeros que ficam à esquerda desaparecem: 120 vira 21. Não transforme o número em texto.',
        },
      ],
      codigoInicial: 'function inverterNumero(n) {\n  // retire o último dígito e monte o número invertido\n}\n',
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
