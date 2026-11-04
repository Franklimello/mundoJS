import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const funcoes: Licao = {
  slug: 'funcoes',
  titulo: 'Criando funções',
  resumo: 'Um bloco de código com nome, que recebe valores e devolve um resultado.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Uma função é um bloco de código com nome, que você escreve uma vez e usa quantas vezes quiser. Ela recebe valores (os *parâmetros*) e pode devolver um resultado, com `return`.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function dobro(numero) {',
        '  return numero * 2;',
        '}',
        '',
        'console.log(dobro(4));',
        'console.log(dobro(10));',
      ),
      saida: linhas('8', '20'),
    },
    {
      tipo: 'p',
      texto:
        'Repare nas três partes: o nome (`dobro`), o que ela recebe (`numero`, entre parênteses) e o que ela devolve (`return`). Escrever o nome com parênteses, `dobro(4)`, é **chamar** a função.',
    },
    { tipo: 'p', texto: 'Uma função pode receber vários parâmetros, separados por vírgula:' },
    {
      tipo: 'codigo',
      codigo: linhas('function somar(a, b) {', '  return a + b;', '}', '', 'console.log(somar(2, 3));'),
      saida: '5',
    },
    {
      tipo: 'nota',
      texto:
        '`return` entrega o valor e encerra a função: o que vem depois dele não roda. E `console.log` só *mostra* na tela — não devolve nada. Para usar o resultado em outra conta, a função precisa de `return`.',
      tom: 'cuidado',
    },
    {
      tipo: 'nota',
      texto:
        'A partir daqui, a maioria dos exercícios pede que você escreva uma função. O corretor chama a sua função com vários valores e confere o que ela devolve.',
    },
  ],
  exercicios: [
    {
      titulo: 'Área do retângulo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `areaDoRetangulo(largura, altura)`, que **devolve** a área: a largura vezes a altura.',
        },
      ],
      codigoInicial: linhas(
        'const largura = 3;',
        'const altura = 4;',
        '',
        'function areaDoRetangulo(largura, altura) {',
        '',
        '}',
        '',
        'console.log(areaDoRetangulo(largura, altura));',
        '',
      ),
      testes: [
        {
          descricao: 'areaDoRetangulo(3, 4) devolve 12',
          codigo: js`igual(areaDoRetangulo(3, 4), 12, 'areaDoRetangulo(3, 4)')`,
        },
        {
          descricao: 'areaDoRetangulo(10, 2.5) devolve 25',
          codigo: js`igual(areaDoRetangulo(10, 2.5), 25, 'areaDoRetangulo(10, 2.5)')`,
        },
        {
          descricao: 'areaDoRetangulo(0, 7) devolve 0',
          codigo: js`igual(areaDoRetangulo(0, 7), 0, 'areaDoRetangulo(0, 7)')`,
        },
      ],
      dicas: [
        'A função precisa de uma linha com `return`.',
        'O que vem depois do `return` é a conta: `largura * altura`.',
      ],
      solucao: linhas('function areaDoRetangulo(largura, altura) {', '  return largura * altura;', '}'),
    },
    {
      titulo: 'Uma saudação que volta',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `saudar(nome)`, que **devolve** o texto `"Olá, "` seguido do nome e de um `"!"`. Por exemplo, `saudar("Ana")` devolve `Olá, Ana!`.',
        },
      ],
      codigoInicial: linhas(
        'const nome = "Ana";',
        '',
        'function saudar(nome) {',
        '',
        '}',
        '',
        'console.log(saudar(nome));',
        '',
      ),
      testes: [
        {
          descricao: 'A função devolve um texto, e não só o mostra',
          codigo: js`verdadeiro(typeof saudar('Ana') === 'string', 'A função precisa devolver o texto com return, e não só mostrá-lo.')`,
        },
        {
          descricao: 'saudar("Ana") devolve “Olá, Ana!”',
          codigo: js`igual(saudar('Ana'), 'Olá, Ana!', 'saudar("Ana")')`,
        },
        {
          descricao: 'saudar("João") devolve “Olá, João!”',
          codigo: js`igual(saudar('João'), 'Olá, João!', 'saudar("João")')`,
        },
      ],
      dicas: [
        'Pode ser com crases: `Olá, ${nome}!`, ou juntando textos com `+`.',
        'Com crases, a função cabe numa linha: `return` seguido do texto entre crases, com `${nome}` no lugar do nome.',
      ],
      solucao: linhas('function saudar(nome) {', '  return `Olá, ${nome}!`;', '}'),
    },
    {
      titulo: 'Celsius para Fahrenheit',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `paraFahrenheit(celsius)`. A conta é: multiplique por 9, divida por 5 e some 32. Por exemplo, `paraFahrenheit(100)` devolve `212`.',
        },
      ],
      codigoInicial: linhas(
        'const celsius = 0;',
        '',
        'function paraFahrenheit(celsius) {',
        '',
        '}',
        '',
        'console.log(paraFahrenheit(celsius));',
        '',
      ),
      testes: [
        { descricao: '0 °C são 32 °F', codigo: js`igual(paraFahrenheit(0), 32, 'paraFahrenheit(0)')` },
        { descricao: '100 °C são 212 °F', codigo: js`igual(paraFahrenheit(100), 212, 'paraFahrenheit(100)')` },
        { descricao: '20 °C são 68 °F', codigo: js`igual(paraFahrenheit(20), 68, 'paraFahrenheit(20)')` },
        { descricao: '-40 °C são -40 °F', codigo: js`igual(paraFahrenheit(-40), -40, 'paraFahrenheit(-40)')` },
      ],
      dicas: [
        'A ordem das contas importa: `celsius * 9 / 5 + 32` já funciona, porque vezes e dividido vêm antes da soma.',
        'Resposta: `return celsius * 9 / 5 + 32;`.',
      ],
      solucao: linhas('function paraFahrenheit(celsius) {', '  return celsius * 9 / 5 + 32;', '}'),
    },
    {
      titulo: 'Preço com desconto',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `comDesconto(preco, percentual)`, que devolve o preço depois de tirar o desconto em porcentagem. Por exemplo, `comDesconto(100, 10)` devolve `90`: dez por cento de 100 é 10, e 100 menos 10 dá 90.',
        },
      ],
      codigoInicial: linhas(
        'const preco = 100;',
        'const percentual = 10;',
        '',
        'function comDesconto(preco, percentual) {',
        '',
        '}',
        '',
        'console.log(comDesconto(preco, percentual));',
        '',
      ),
      testes: [
        {
          descricao: 'comDesconto(100, 10) devolve 90',
          codigo: js`igual(comDesconto(100, 10), 90, 'comDesconto(100, 10)')`,
        },
        {
          descricao: 'comDesconto(80, 25) devolve 60',
          codigo: js`igual(comDesconto(80, 25), 60, 'comDesconto(80, 25)')`,
        },
        { descricao: 'comDesconto(50, 0) devolve 50', codigo: js`igual(comDesconto(50, 0), 50, 'comDesconto(50, 0)')` },
        {
          descricao: 'comDesconto(200, 50) devolve 100',
          codigo: js`igual(comDesconto(200, 50), 100, 'comDesconto(200, 50)')`,
        },
      ],
      dicas: [
        'Primeiro ache o valor do desconto: `preco * percentual / 100`.',
        'Depois, subtraia do preço: `return preco - preco * percentual / 100;`.',
      ],
      solucao: linhas('function comDesconto(preco, percentual) {', '  return preco - preco * percentual / 100;', '}'),
    },
    {
      titulo: 'Função que chama função',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `quadrado` já está pronta. Escreva `somaDeQuadrados(a, b)`, que devolve o quadrado de `a` mais o quadrado de `b`, **chamando** `quadrado` nas duas parcelas. Por exemplo, `somaDeQuadrados(3, 4)` devolve `25`.',
        },
      ],
      codigoInicial: linhas(
        'const a = 3;',
        'const b = 4;',
        '',
        'function quadrado(numero) {',
        '  return numero * numero;',
        '}',
        '',
        'function somaDeQuadrados(a, b) {',
        '',
        '}',
        '',
        'console.log(somaDeQuadrados(a, b));',
        '',
      ),
      testes: [
        {
          descricao: 'somaDeQuadrados(3, 4) devolve 25',
          codigo: js`igual(somaDeQuadrados(3, 4), 25, 'somaDeQuadrados(3, 4)')`,
        },
        {
          descricao: 'somaDeQuadrados(1, 1) devolve 2',
          codigo: js`igual(somaDeQuadrados(1, 1), 2, 'somaDeQuadrados(1, 1)')`,
        },
        {
          descricao: 'somaDeQuadrados(0, 5) devolve 25',
          codigo: js`igual(somaDeQuadrados(0, 5), 25, 'somaDeQuadrados(0, 5)')`,
        },
        {
          descricao: 'Usa a função quadrado, em vez de repetir a conta',
          codigo: js`verdadeiro(
  (codigoDoAluno.match(/quadrado\s*\(/g) ?? []).length >= 3,
  'Chame quadrado(a) e quadrado(b) dentro de somaDeQuadrados.',
)`,
        },
      ],
      dicas: ['Uma função pode chamar outra, como em `quadrado(a)`.', 'Resposta: `return quadrado(a) + quadrado(b);`.'],
      solucao: linhas(
        'function quadrado(numero) {',
        '  return numero * numero;',
        '}',
        '',
        'function somaDeQuadrados(a, b) {',
        '  return quadrado(a) + quadrado(b);',
        '}',
      ),
    },
    {
      titulo: 'O estoque depois da venda',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `estoqueRestante(quantidade, vendidos)`, que devolve quantos itens sobram depois da venda. Considere quantidades não negativas e vendas que não ultrapassam o estoque.',
        },
      ],
      codigoInicial: linhas(
        'const quantidade = 12;',
        'const vendidos = 5;',
        '',
        'function estoqueRestante(quantidade, vendidos) {',
        '',
        '}',
        '',
        'console.log(estoqueRestante(quantidade, vendidos));',
        '',
      ),
      testes: [
        {
          descricao: 'Desconta a quantidade vendida',
          codigo: js`igual(estoqueRestante(12, 5), 7, 'estoqueRestante(12, 5)'); igual(estoqueRestante(20, 3), 17, 'Outra venda')`,
        },
        {
          descricao: 'Trata venda total e nenhuma venda',
          codigo: js`igual(estoqueRestante(4, 4), 0, 'Venda total'); igual(estoqueRestante(4, 0), 4, 'Sem venda')`,
        },
      ],
      dicas: [
        'Receber parâmetros permite usar a mesma conta com estoques diferentes. O resultado precisa sair com return.',
      ],
      solucao: 'function estoqueRestante(quantidade, vendidos) {\n  return quantidade - vendidos;\n}',
    },
    {
      titulo: 'O resultado que não sai da função',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `triplo(n)` calcula o resultado, mas quem a chama recebe undefined. Corrija a função para devolver o triplo do número recebido.',
        },
      ],
      codigoInicial: linhas(
        'const n = 4;',
        '',
        'function triplo(n) {',
        '  const resultado = n * 3;',
        '}',
        '',
        'console.log(triplo(n));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o triplo de valores positivos',
          codigo: js`igual(triplo(4), 12, 'triplo(4)'); igual(triplo(7), 21, 'triplo(7)')`,
        },
        {
          descricao: 'Também devolve resultados com zero e negativos',
          codigo: js`igual(triplo(0), 0, 'triplo(0)'); igual(triplo(-2), -6, 'triplo(-2)')`,
        },
      ],
      dicas: ['Uma variável dentro da função não é devolvida automaticamente. Falta o comando return.'],
      solucao: 'function triplo(n) {\n  const resultado = n * 3;\n  return resultado;\n}',
    },
  ],
};
