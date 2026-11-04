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
        { tipo: 'p', texto: 'Complete `dobrarPares(numeros)`.' },
        {
          tipo: 'lista',
          itens: [
            'Selecione os números pares e multiplique cada um por `2`.',
            'Devolva os resultados em uma nova lista, sem alterar a original.',
            'Exemplo: `[1, 2, 3, 4]` deve resultar em `[4, 8]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const numeros = [1, 2, 3, 4];',
        '',
        'function dobrarPares(numeros) {',
        '',
        '}',
        '',
        'console.log(dobrarPares(numeros));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete `emMaiusculas(nomes)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva uma nova lista com todos os nomes em maiúsculas.',
            'Não altere a lista recebida.',
            'Exemplo: `["ana", "bia"]` deve resultar em `["ANA", "BIA"]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const nomes = ["ana", "bia"];',
        '',
        'function emMaiusculas(nomes) {',
        '',
        '}',
        '',
        'console.log(emMaiusculas(nomes));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete `textosLongos(textos, minimo)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva uma nova lista apenas com os textos que têm pelo menos `minimo` caracteres.',
            'Textos com tamanho igual ao mínimo também entram.',
            'Exemplo: com `["oi", "olá", "bom dia"]` e mínimo `3`, devolva `["olá", "bom dia"]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const textos = ["oi", "olá", "bom dia"];',
        'const minimo = 3;',
        '',
        'function textosLongos(textos, minimo) {',
        '',
        '}',
        '',
        'console.log(textosLongos(textos, minimo));',
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
        { tipo: 'p', texto: 'Complete `aplicarDesconto(precos, percentual)`.' },
        {
          tipo: 'lista',
          itens: [
            'Aplique a porcentagem de desconto a cada preço.',
            'Devolva os preços finais em uma nova lista.',
            'Exemplo: `[100, 50]` com desconto de `10%` deve resultar em `[90, 45]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const precos = [100, 50];',
        'const percentual = 10;',
        '',
        'function aplicarDesconto(precos, percentual) {',
        '',
        '}',
        '',
        'console.log(aplicarDesconto(precos, percentual));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete `quadradosGrandes(numeros)`.' },
        {
          tipo: 'lista',
          itens: [
            'Calcule o quadrado de cada número e mantenha apenas os resultados maiores que `10`.',
            'Devolva esses resultados em uma lista.',
            'Exemplo: `[1, 2, 3, 4, 5]` deve resultar em `[16, 25]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const numeros = [1, 2, 3, 4, 5];',
        '',
        'function quadradosGrandes(numeros) {',
        '',
        '}',
        '',
        'console.log(quadradosGrandes(numeros));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete `quantosPassaram(notas)`.' },
        {
          tipo: 'lista',
          itens: [
            'Conte as notas maiores ou iguais a `7` e devolva a quantidade, não a lista de notas.',
            'Exemplo: `[7, 5, 9, 3, 8]` deve resultar em `3`.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Depois de um `filter`, a lista que sobra tem um `.length`: é o jeito de contar quantos passaram no teste.',
        },
      ],
      codigoInicial: linhas(
        'const notas = [7, 5, 9, 3, 8];',
        '',
        'function quantosPassaram(notas) {',
        '',
        '}',
        '',
        'console.log(quantosPassaram(notas));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete `etiquetasDePreco(precos)`.' },
        {
          tipo: 'lista',
          itens: [
            'Mantenha apenas os preços maiores ou iguais a `10`.',
            'Transforme cada preço selecionado em um texto no formato `"R$ 12"`.',
            'Devolva a nova lista na ordem recebida, sem alterar a original.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const precos = [5, 10, 25, 3];',
        '',
        'function etiquetasDePreco(precos) {',
        '',
        '}',
        '',
        'console.log(etiquetasDePreco(precos));',
        '',
      ),
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
        { tipo: 'p', texto: 'Corrija o retorno do callback de `filter` em `soMaiores(lista)`.' },
        {
          tipo: 'lista',
          itens: [
            'A função deve selecionar apenas os valores maiores que `10`.',
            'Mantenha as chaves do callback e devolva a decisão com `return`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const lista = [1, 10, 11];',
        '',
        'function soMaiores(lista) {',
        '  return lista.filter((n) => {',
        '    n > 10;',
        '  });',
        '}',
        '',
        'console.log(soMaiores(lista));',
        '',
      ),
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
