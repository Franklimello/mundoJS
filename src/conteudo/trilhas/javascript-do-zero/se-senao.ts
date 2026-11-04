import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const seSenao: Licao = {
  slug: 'se-senao',
  titulo: 'Tomando decisões',
  resumo: 'if, else e else if.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Programas precisam decidir. O `if` roda um bloco só quando a condição é verdadeira; o `else` cuida de todo o resto.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const temperatura = 31;',
        '',
        'if (temperatura > 30) {',
        '  console.log("Está calor.");',
        '} else {',
        '  console.log("Está agradável.");',
        '}',
      ),
      saida: 'Está calor.',
    },
    { tipo: 'p', texto: 'A condição usa operadores de comparação:' },
    {
      tipo: 'lista',
      itens: [
        '`>` maior que, `<` menor que, `>=` maior ou igual, `<=` menor ou igual',
        '`===` igual a, `!==` diferente de',
      ],
    },
    {
      tipo: 'nota',
      texto:
        'Um `=` só **guarda** um valor. Para **comparar**, use três: `===`. Confundir os dois é um dos erros mais comuns de quem está começando.',
      tom: 'cuidado',
    },
    {
      tipo: 'p',
      texto: 'Para mais de duas saídas, encadeie com `else if`. Dentro de uma função, o `return` já encerra tudo:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function classificar(nota) {',
        '  if (nota >= 7) {',
        '    return "Aprovado";',
        '  } else if (nota >= 5) {',
        '    return "Recuperação";',
        '  } else {',
        '    return "Reprovado";',
        '  }',
        '}',
        '',
        'console.log(classificar(6));',
      ),
      saida: 'Recuperação',
    },
  ],
  exercicios: [
    {
      titulo: 'Faixas de idade',
      enunciado: [
        { tipo: 'p', texto: 'Complete `situacao(idade)` e devolva um destes textos:' },
        {
          tipo: 'lista',
          itens: [
            '`"Criança"` se a idade for menor que `12`.',
            '`"Adolescente"` se a idade for de `12` até `17`.',
            '`"Adulto"` se a idade for `18` ou mais.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const idade = 5;',
        '',
        'function situacao(idade) {',
        '',
        '}',
        '',
        'console.log(situacao(idade));',
        '',
      ),
      testes: [
        {
          descricao: 'situacao(5) devolve “Criança”',
          codigo: js`igual(situacao(5), 'Criança', 'situacao(5)')`,
        },
        {
          descricao: 'situacao(11) devolve “Criança”',
          codigo: js`igual(situacao(11), 'Criança', 'situacao(11)')`,
        },
        {
          descricao: 'situacao(12) devolve “Adolescente”',
          codigo: js`igual(situacao(12), 'Adolescente', 'situacao(12)')`,
        },
        {
          descricao: 'situacao(17) devolve “Adolescente”',
          codigo: js`igual(situacao(17), 'Adolescente', 'situacao(17)')`,
        },
        {
          descricao: 'situacao(18) devolve “Adulto”',
          codigo: js`igual(situacao(18), 'Adulto', 'situacao(18)')`,
        },
        {
          descricao: 'situacao(40) devolve “Adulto”',
          codigo: js`igual(situacao(40), 'Adulto', 'situacao(40)')`,
        },
      ],
      dicas: [
        'Comece pela faixa mais baixa: `if (idade < 12)`.',
        'Se a idade passou do primeiro `if`, ela já é 12 ou mais — então o `else if` só precisa perguntar se é menor que 18.',
        'Cuidado com as bordas: 12 já é adolescente e 18 já é adulto.',
      ],
      solucao: linhas(
        'function situacao(idade) {',
        '  if (idade < 12) {',
        '    return "Criança";',
        '  } else if (idade < 18) {',
        '    return "Adolescente";',
        '  } else {',
        '    return "Adulto";',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Par ou ímpar',
      enunciado: [
        { tipo: 'p', texto: 'Complete `parOuImpar(numero)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva `"par"` quando o resto da divisão por `2` for zero.',
            'Nos outros casos, devolva `"ímpar"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const numero = 4;',
        '',
        'function parOuImpar(numero) {',
        '',
        '}',
        '',
        'console.log(parOuImpar(numero));',
        '',
      ),
      testes: [
        { descricao: '4 é par', codigo: js`igual(parOuImpar(4), 'par', 'parOuImpar(4)')` },
        { descricao: '7 é ímpar', codigo: js`igual(parOuImpar(7), 'ímpar', 'parOuImpar(7)')` },
        { descricao: '0 é par', codigo: js`igual(parOuImpar(0), 'par', 'parOuImpar(0)')` },
        { descricao: '99 é ímpar', codigo: js`igual(parOuImpar(99), 'ímpar', 'parOuImpar(99)')` },
        { descricao: '100 é par', codigo: js`igual(parOuImpar(100), 'par', 'parOuImpar(100)')` },
      ],
      dicas: [
        'A condição é `numero % 2 === 0`. Lembre-se: três iguais para comparar.',
        'Se a condição for verdadeira, devolva `"par"`; no `else`, devolva `"ímpar"`.',
      ],
      solucao: linhas(
        'function parOuImpar(numero) {',
        '  if (numero % 2 === 0) {',
        '    return "par";',
        '  } else {',
        '    return "ímpar";',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Faixas de frete',
      enunciado: [
        { tipo: 'p', texto: 'Complete `frete(valorDaCompra)` e devolva o valor do frete:' },
        {
          tipo: 'lista',
          itens: [
            '`0` para compras de `200` reais ou mais.',
            '`15` para compras de `100` até menos de `200` reais.',
            '`25` para compras abaixo de `100` reais.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const valorDaCompra = 250;',
        '',
        'function frete(valorDaCompra) {',
        '',
        '}',
        '',
        'console.log(frete(valorDaCompra));',
        '',
      ),
      testes: [
        { descricao: 'Compra de 250 tem frete grátis', codigo: js`igual(frete(250), 0, 'frete(250)')` },
        { descricao: 'Compra de exatamente 200 tem frete grátis', codigo: js`igual(frete(200), 0, 'frete(200)')` },
        { descricao: 'Compra de 199.9 paga 15', codigo: js`igual(frete(199.9), 15, 'frete(199.9)')` },
        { descricao: 'Compra de exatamente 100 paga 15', codigo: js`igual(frete(100), 15, 'frete(100)')` },
        { descricao: 'Compra de 99.99 paga 25', codigo: js`igual(frete(99.99), 25, 'frete(99.99)')` },
        { descricao: 'Compra de 0 paga 25', codigo: js`igual(frete(0), 25, 'frete(0)')` },
      ],
      dicas: [
        'Comece pela faixa mais alta: `if (valorDaCompra >= 200)`.',
        'No `else if`, basta perguntar se é `>= 100`: quem chegou ali já é menor que 200.',
        'Cuidado com as bordas: exatamente 200 e exatamente 100 entram na faixa de cima.',
      ],
      solucao: linhas(
        'function frete(valorDaCompra) {',
        '  if (valorDaCompra >= 200) {',
        '    return 0;',
        '  } else if (valorDaCompra >= 100) {',
        '    return 15;',
        '  } else {',
        '    return 25;',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'O maior dos dois',
      enunciado: [
        { tipo: 'p', texto: 'Complete `maior(a, b)`.' },
        { tipo: 'lista', itens: ['Compare os dois números com `if` e devolva o maior usando `return`.'] },
      ],
      codigoInicial: linhas(
        'const a = 3;',
        'const b = 9;',
        '',
        'function maior(a, b) {',
        '',
        '}',
        '',
        'console.log(maior(a, b));',
        '',
      ),
      testes: [
        { descricao: 'maior(3, 9) devolve 9', codigo: js`igual(maior(3, 9), 9, 'maior(3, 9)')` },
        { descricao: 'maior(9, 3) devolve 9', codigo: js`igual(maior(9, 3), 9, 'maior(9, 3)')` },
        { descricao: 'maior(5, 5) devolve 5', codigo: js`igual(maior(5, 5), 5, 'maior(5, 5)')` },
        { descricao: 'maior(-1, -7) devolve -1', codigo: js`igual(maior(-1, -7), -1, 'maior(-1, -7)')` },
        {
          descricao: 'Usa um if para decidir',
          codigo: js`verdadeiro(/\bif\s*\(/.test(codigoDoAluno), 'Use um if para comparar os dois números.')`,
        },
      ],
      dicas: [
        'A pergunta é: `a > b`? Se sim, o maior é `a`; senão, é `b`.',
        'Com `return` dentro de cada ramo, a função já termina na hora.',
      ],
      solucao: linhas(
        'function maior(a, b) {',
        '  if (a > b) {',
        '    return a;',
        '  } else {',
        '    return b;',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Positivo, negativo ou zero',
      enunciado: [
        { tipo: 'p', texto: 'Complete `sinal(numero)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva `"positivo"` para valores maiores que zero.',
            'Devolva `"negativo"` para valores menores que zero.',
            'Para zero, devolva `"zero"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const numero = 5;',
        '',
        'function sinal(numero) {',
        '',
        '}',
        '',
        'console.log(sinal(numero));',
        '',
      ),
      testes: [
        { descricao: '5 é positivo', codigo: js`igual(sinal(5), 'positivo', 'sinal(5)')` },
        { descricao: '-3 é negativo', codigo: js`igual(sinal(-3), 'negativo', 'sinal(-3)')` },
        { descricao: '0 é zero', codigo: js`igual(sinal(0), 'zero', 'sinal(0)')` },
        { descricao: '0.1 é positivo', codigo: js`igual(sinal(0.1), 'positivo', 'sinal(0.1)')` },
        { descricao: '-0.5 é negativo', codigo: js`igual(sinal(-0.5), 'negativo', 'sinal(-0.5)')` },
      ],
      dicas: [
        'São três saídas, então use `if`, `else if` e `else`.',
        'Para o zero, compare com três iguais: `numero === 0`.',
      ],
      solucao: linhas(
        'function sinal(numero) {',
        '  if (numero > 0) {',
        '    return "positivo";',
        '  } else if (numero < 0) {',
        '    return "negativo";',
        '  } else {',
        '    return "zero";',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Desconto por quantidade',
      enunciado: [
        { tipo: 'p', texto: 'Complete `totalPorQuantidade(preco, quantidade)`.' },
        {
          tipo: 'lista',
          itens: [
            'Calcule o total multiplicando o preço pela quantidade.',
            'Com `10` itens ou mais, aplique `10%` de desconto ao total.',
            'Devolva o total final. Com menos de `10` itens, não aplique desconto.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const preco = 10;',
        'const quantidade = 9;',
        '',
        'function totalPorQuantidade(preco, quantidade) {',
        '',
        '}',
        '',
        'console.log(totalPorQuantidade(preco, quantidade));',
        '',
      ),
      testes: [
        {
          descricao: 'Abaixo do limite não aplica desconto',
          codigo: js`igual(totalPorQuantidade(10, 9), 90, 'Nove itens'); igual(totalPorQuantidade(20, 0), 0, 'Nenhum item')`,
        },
        {
          descricao: 'O limite e quantidades maiores recebem desconto',
          codigo: js`igual(totalPorQuantidade(10, 10), 90, 'Dez itens'); igual(totalPorQuantidade(10, 11), 99, 'Onze itens')`,
        },
      ],
      dicas: ['Calcule o total antes da decisão. Para retirar 10%, multiplique o total por 0.9.'],
      solucao:
        'function totalPorQuantidade(preco, quantidade) {\n  const total = preco * quantidade;\n  if (quantidade >= 10) return total * 0.9;\n  return total;\n}',
    },
    {
      titulo: 'Comprimento mínimo da senha',
      enunciado: [
        { tipo: 'p', texto: 'Complete `avaliarComprimento(texto)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva `"aceita"` se o texto tiver pelo menos `8` caracteres.',
            'Caso contrário, devolva `"curta"`.',
            'Avalie apenas o tamanho do texto; não é uma validação de segurança de senha.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const texto = "abcdefgh";',
        '',
        'function avaliarComprimento(texto) {',
        '',
        '}',
        '',
        'console.log(avaliarComprimento(texto));',
        '',
      ),
      testes: [
        {
          descricao: 'Oito caracteres já atingem o mínimo',
          codigo: js`igual(avaliarComprimento('abcdefgh'), 'aceita', 'Exatamente oito'); igual(avaliarComprimento('abcdefghi'), 'aceita', 'Acima de oito')`,
        },
        {
          descricao: 'Sete caracteres e texto vazio ficam abaixo do mínimo',
          codigo: js`igual(avaliarComprimento('abcdefg'), 'curta', 'Sete caracteres'); igual(avaliarComprimento(''), 'curta', 'Texto vazio')`,
        },
      ],
      dicas: ['Pelo menos oito inclui o próprio oito. Compare texto.length usando >=.'],
      solucao: 'function avaliarComprimento(texto) {\n  if (texto.length >= 8) return "aceita";\n  return "curta";\n}',
    },
  ],
};
