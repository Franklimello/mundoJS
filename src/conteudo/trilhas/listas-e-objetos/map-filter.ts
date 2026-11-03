import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const mapFilter: Licao = {
  slug: 'map-filter',
  titulo: 'Transformando e filtrando',
  resumo: 'map, filter e funções seta.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Listas vêm com ferramentas prontas. O `map` cria uma lista nova aplicando uma função a cada item. O `filter` cria uma lista nova só com os itens que passam num teste.',
    },
    {
      tipo: 'p',
      texto:
        'Elas usam funções curtas, escritas como **função seta**: `(n) => n * 2` é o mesmo que `function (n) { return n * 2; }`.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const numeros = [1, 2, 3, 4];',
        '',
        'const dobrados = numeros.map((n) => n * 2);',
        'const pares = numeros.filter((n) => n % 2 === 0);',
        '',
        'console.log(dobrados);',
        'console.log(pares);',
        'console.log(numeros);',
      ),
      saida: linhas('[ 2, 4, 6, 8 ]', '[ 2, 4 ]', '[ 1, 2, 3, 4 ]'),
    },
    {
      tipo: 'nota',
      texto:
        '`map` e `filter` não mexem na lista original — a última linha mostra que `numeros` continua igual. Eles devolvem uma lista nova, e por isso podem ser encadeados: `lista.filter(...).map(...)`.',
    },
  ],
  exercicios: [
    {
      titulo: 'Dobrar os pares',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `dobrarPares(numeros)`. Ela devolve uma **lista nova** só com os números pares, cada um já dobrado. Por exemplo, `dobrarPares([1, 2, 3, 4])` devolve `[4, 8]`. A lista original não pode mudar.',
        },
      ],
      codigoInicial: linhas('function dobrarPares(numeros) {', '  // use filter e map', '}', ''),
      testes: [
        {
          descricao: 'dobrarPares([1, 2, 3, 4]) devolve [4, 8]',
          codigo: js`igual(dobrarPares([1, 2, 3, 4]), [4, 8], 'dobrarPares([1, 2, 3, 4])')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(dobrarPares([]), [], 'dobrarPares([])')`,
        },
        {
          descricao: 'Sem números pares, devolve uma lista vazia',
          codigo: js`igual(dobrarPares([1, 3, 5]), [], 'dobrarPares([1, 3, 5])')`,
        },
        {
          descricao: 'dobrarPares([10]) devolve [20]',
          codigo: js`igual(dobrarPares([10]), [20], 'dobrarPares([10])')`,
        },
        {
          descricao: 'A lista original não foi alterada',
          codigo: js`const original = [1, 2, 3, 4];
const resultado = dobrarPares(original);
verdadeiro(Array.isArray(resultado), 'dobrarPares precisa devolver uma lista.');
igual(original, [1, 2, 3, 4], 'A lista original')`,
        },
      ],
      dicas: [
        'Primeiro escolha os pares com `filter`: `(n) => n % 2 === 0`.',
        'Depois, em cima do resultado, use `map` para dobrar: `(n) => n * 2`.',
        'Os dois se encadeiam: `numeros.filter(...).map(...)`.',
      ],
      solucao: linhas(
        'function dobrarPares(numeros) {',
        '  return numeros.filter((n) => n % 2 === 0).map((n) => n * 2);',
        '}',
      ),
    },
    {
      titulo: 'Nomes em maiúsculas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `emMaiusculas(nomes)`, que devolve uma **lista nova** com cada nome em maiúsculas. Por exemplo, `emMaiusculas(["ana", "bia"])` devolve `["ANA", "BIA"]`. A lista original não pode mudar.',
        },
      ],
      codigoInicial: linhas('function emMaiusculas(nomes) {', '  // transforme cada item da lista', '}', ''),
      testes: [
        {
          descricao: 'emMaiusculas(["ana", "bia"]) devolve ["ANA", "BIA"]',
          codigo: js`igual(emMaiusculas(['ana', 'bia']), ['ANA', 'BIA'], 'emMaiusculas(["ana", "bia"])')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(emMaiusculas([]), [], 'emMaiusculas([])')`,
        },
        {
          descricao: 'Quem já está em maiúsculas continua igual',
          codigo: js`igual(emMaiusculas(['José', 'LU']), ['JOSÉ', 'LU'], "emMaiusculas(['José', 'LU'])")`,
        },
        {
          descricao: 'A lista original não foi alterada',
          codigo: js`const original = ['ana', 'bia'];
const resultado = emMaiusculas(original);
verdadeiro(Array.isArray(resultado), 'emMaiusculas precisa devolver uma lista.');
igual(original, ['ana', 'bia'], 'A lista original')`,
        },
      ],
      dicas: [
        'Para transformar cada item, use `map`: `nomes.map((nome) => ...)`.',
        'Dentro da função seta, devolva `nome.toUpperCase()`.',
      ],
      solucao: linhas('function emMaiusculas(nomes) {', '  return nomes.map((nome) => nome.toUpperCase());', '}'),
    },
    {
      titulo: 'Só os textos longos',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `textosLongos(textos, minimo)`, que devolve uma lista nova só com os textos que têm **pelo menos** `minimo` caracteres. Por exemplo, `textosLongos(["oi", "olá", "bom dia"], 3)` devolve `["olá", "bom dia"]`.',
        },
      ],
      codigoInicial: linhas(
        'function textosLongos(textos, minimo) {',
        '  // escolha só os textos que passam no teste',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'textosLongos(["oi", "olá", "bom dia"], 3) devolve ["olá", "bom dia"]',
          codigo: js`igual(textosLongos(['oi', 'olá', 'bom dia'], 3), ['olá', 'bom dia'], 'textosLongos com mínimo 3')`,
        },
        {
          descricao: 'Quem tem exatamente o mínimo entra',
          codigo: js`igual(textosLongos(['abcd', 'abc'], 4), ['abcd'], "textosLongos(['abcd', 'abc'], 4)")`,
        },
        {
          descricao: 'Sem ninguém que passe, devolve uma lista vazia',
          codigo: js`igual(textosLongos(['a', 'b'], 5), [], "textosLongos(['a', 'b'], 5)")`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(textosLongos([], 2), [], 'textosLongos([], 2)')`,
        },
      ],
      dicas: [
        'Para escolher itens, use `filter`: `textos.filter((texto) => ...)`.',
        'A condição é `texto.length >= minimo`.',
      ],
      solucao: linhas(
        'function textosLongos(textos, minimo) {',
        '  return textos.filter((texto) => texto.length >= minimo);',
        '}',
      ),
    },
    {
      titulo: 'Aplicando um desconto',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `aplicarDesconto(precos, percentual)`, que devolve uma lista nova com todos os preços já descontados. Por exemplo, `aplicarDesconto([100, 50], 10)` devolve `[90, 45]`.',
        },
      ],
      codigoInicial: linhas('function aplicarDesconto(precos, percentual) {', '  // transforme cada preço', '}', ''),
      testes: [
        {
          descricao: 'aplicarDesconto([100, 50], 10) devolve [90, 45]',
          codigo: js`igual(aplicarDesconto([100, 50], 10), [90, 45], 'aplicarDesconto([100, 50], 10)')`,
        },
        {
          descricao: 'aplicarDesconto([200], 50) devolve [100]',
          codigo: js`igual(aplicarDesconto([200], 50), [100], 'aplicarDesconto([200], 50)')`,
        },
        {
          descricao: 'Com desconto 0, os preços não mudam',
          codigo: js`igual(aplicarDesconto([30, 60], 0), [30, 60], 'aplicarDesconto([30, 60], 0)')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(aplicarDesconto([], 20), [], 'aplicarDesconto([], 20)')`,
        },
      ],
      dicas: [
        'Cada preço vira outro preço, então é um trabalho para o `map`.',
        'Preço com desconto: `preco - preco * percentual / 100`.',
      ],
      solucao: linhas(
        'function aplicarDesconto(precos, percentual) {',
        '  return precos.map((preco) => preco - preco * percentual / 100);',
        '}',
      ),
    },
    {
      titulo: 'Quadrados grandes',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `quadradosGrandes(numeros)`. Ela eleva cada número ao quadrado e devolve **só** os resultados maiores que 10. Por exemplo, `quadradosGrandes([1, 2, 3, 4, 5])` devolve `[16, 25]`, porque 9 não passa de 10.',
        },
      ],
      codigoInicial: linhas('function quadradosGrandes(numeros) {', '  // encadeie as duas ferramentas', '}', ''),
      testes: [
        {
          descricao: 'quadradosGrandes([1, 2, 3, 4, 5]) devolve [16, 25]',
          codigo: js`igual(quadradosGrandes([1, 2, 3, 4, 5]), [16, 25], 'quadradosGrandes([1, 2, 3, 4, 5])')`,
        },
        { descricao: 'O 9 não passa de 10', codigo: js`igual(quadradosGrandes([3]), [], 'quadradosGrandes([3])')` },
        {
          descricao: 'quadradosGrandes([4]) devolve [16]',
          codigo: js`igual(quadradosGrandes([4]), [16], 'quadradosGrandes([4])')`,
        },
        {
          descricao: 'Números negativos também têm quadrado',
          codigo: js`igual(quadradosGrandes([-5, 1]), [25], 'quadradosGrandes([-5, 1])')`,
        },
        {
          descricao: 'Uma lista vazia dá uma lista vazia',
          codigo: js`igual(quadradosGrandes([]), [], 'quadradosGrandes([])')`,
        },
        {
          descricao: 'Usa map e filter',
          codigo: js`verdadeiro(
  codigoDoAluno.includes('.map(') && codigoDoAluno.includes('.filter('),
  'Resolva encadeando map (para elevar ao quadrado) e filter (para escolher).',
)`,
        },
      ],
      dicas: [
        'Primeiro transforme com `map`: `(n) => n * n`.',
        'Depois escolha com `filter`: `(n) => n > 10`. Os dois se encadeiam.',
      ],
      solucao: linhas(
        'function quadradosGrandes(numeros) {',
        '  return numeros.map((n) => n * n).filter((n) => n > 10);',
        '}',
      ),
    },
    {
      titulo: 'Quantos passaram',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `quantosPassaram(notas)`, que devolve **quantas** notas são `7` ou mais. Por exemplo, `quantosPassaram([7, 5, 9, 3, 8])` devolve `3`.',
        },
        {
          tipo: 'nota',
          texto:
            'Depois de um `filter`, a lista que sobra tem um `.length`: é o jeito de contar quantos passaram no teste.',
        },
      ],
      codigoInicial: linhas('function quantosPassaram(notas) {', '  // filtre e conte', '}', ''),
      testes: [
        {
          descricao: 'quantosPassaram([7, 5, 9, 3, 8]) devolve 3',
          codigo: js`igual(quantosPassaram([7, 5, 9, 3, 8]), 3, 'quantosPassaram([7, 5, 9, 3, 8])')`,
        },
        { descricao: 'Uma lista vazia devolve 0', codigo: js`igual(quantosPassaram([]), 0, 'quantosPassaram([])')` },
        {
          descricao: 'O 7 conta, o 6.9 não',
          codigo: js`igual(quantosPassaram([7, 6.9]), 1, 'quantosPassaram([7, 6.9])')`,
        },
        {
          descricao: 'Todos reprovados devolve 0',
          codigo: js`igual(quantosPassaram([1, 2, 3]), 0, 'quantosPassaram([1, 2, 3])')`,
        },
        {
          descricao: 'Todos aprovados devolve o total',
          codigo: js`igual(quantosPassaram([10, 8, 7, 9]), 4, 'quantosPassaram([10, 8, 7, 9])')`,
        },
      ],
      dicas: ['Escolha as notas com `filter((nota) => nota >= 7)`.', 'Pegue o tamanho do resultado: `.length`.'],
      solucao: linhas('function quantosPassaram(notas) {', '  return notas.filter((nota) => nota >= 7).length;', '}'),
    },
    {
      titulo: 'Etiquetas dos preços selecionados',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `etiquetasDePreco(precos)`, que mantém os preços a partir de 10 e os transforma em textos como `"R$ 12"`. Preserve a ordem e não modifique a lista recebida.',
        },
      ],
      codigoInicial: 'function etiquetasDePreco(precos) {\n  // filtre os preços e transforme os que sobraram\n}\n',
      testes: [
        {
          descricao: 'Seleciona o limite e formata os preços',
          codigo: js`igual(etiquetasDePreco([5, 10, 25, 3]), ['R$ 10', 'R$ 25'], 'Etiquetas')`,
        },
        {
          descricao: 'Não altera a entrada e devolve lista vazia se nada servir',
          codigo: js`const precos = [20, 2]; igual(etiquetasDePreco(precos), ['R$ 20'], 'Seleção'); igual(precos, [20, 2], 'Entrada preservada'); igual(etiquetasDePreco([1, 9]), [], 'Sem preços selecionados')`,
        },
      ],
      dicas: ['Use filter com preco >= 10, seguido de map para montar cada texto.'],
      solucao:
        'function etiquetasDePreco(precos) {\n  return precos.filter((preco) => preco >= 10).map((preco) => "R$ " + preco);\n}',
    },
    {
      titulo: 'O filter sem resposta',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `soMaiores(lista)` deveria selecionar os valores maiores que 10, mas o callback do filter não devolve sua decisão. Corrija o retorno, mantendo o bloco com chaves.',
        },
      ],
      codigoInicial: 'function soMaiores(lista) {\n  return lista.filter((n) => {\n    n > 10;\n  });\n}\n',
      testes: [
        {
          descricao: 'Mantém apenas os valores estritamente maiores que dez',
          codigo: js`igual(soMaiores([1, 10, 11]), [11], 'O limite não entra')`,
        },
        {
          descricao: 'Mantém todos os selecionados na ordem original',
          codigo: js`igual(soMaiores([-2, 30, 20]), [30, 20], 'Ordem preservada'); igual(soMaiores([]), [], 'Lista vazia')`,
        },
      ],
      dicas: ['Com chaves, o callback precisa de return. Uma comparação solta não devolve um valor.'],
      solucao: 'function soMaiores(lista) {\n  return lista.filter((n) => {\n    return n > 10;\n  });\n}',
    },
  ],
};
