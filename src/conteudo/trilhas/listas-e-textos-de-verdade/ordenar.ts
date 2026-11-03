import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const ordenar: Licao = {
  slug: 'ordenar',
  titulo: 'Ordenando listas',
  resumo: 'sort, a função de comparação e como não mexer na original.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`sort` ordena uma lista, mas tem uma pegadinha: sem ajuda, ele ordena como **texto**, mesmo quando os itens são números.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('const numeros = [10, 9, 1, 100];', 'console.log([...numeros].sort());'),
      saida: '[ 1, 10, 100, 9 ]',
    },
    {
      tipo: 'p',
      texto:
        'Para números, passe uma **função de comparação**. Ela recebe dois itens, `a` e `b`, e devolve um número: negativo se `a` vem antes, positivo se `b` vem antes, zero se tanto faz. Para números, `a - b` faz exatamente isso:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'console.log([...numeros].sort((a, b) => a - b));',
        'console.log([...numeros].sort((a, b) => b - a));',
      ),
      saida: linhas('[ 1, 9, 10, 100 ]', '[ 100, 10, 9, 1 ]'),
    },
    {
      tipo: 'p',
      texto:
        'Os exemplos copiam a lista com `[...numeros]` antes de ordenar, por um motivo: `sort` **muda a própria lista**.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const copia = [...numeros];',
        'copia.sort((a, b) => a - b);',
        'console.log(copia);',
        'console.log(numeros);',
      ),
      saida: linhas('[ 1, 9, 10, 100 ]', '[ 10, 9, 1, 100 ]'),
    },
    { tipo: 'p', texto: 'Para ordenar objetos, compare a propriedade que importa:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const itens = [',
        '  { nome: "Caderno", preco: 20 },',
        '  { nome: "Caneta", preco: 3 },',
        '  { nome: "Borracha", preco: 5 },',
        '];',
        '',
        'const baratosPrimeiro = [...itens].sort((a, b) => a.preco - b.preco);',
        'console.log(baratosPrimeiro.map((item) => item.nome));',
      ),
      saida: "[ 'Caneta', 'Borracha', 'Caderno' ]",
    },
    {
      tipo: 'p',
      texto:
        'Para ordenar **textos**, use `localeCompare`, que conhece o alfabeto e os acentos. Sem ele, "Édson" iria para o fim da lista:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const nomes = ["Édson", "Bia", "Ana"];',
        'console.log([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));',
      ),
      saida: "[ 'Ana', 'Bia', 'Édson' ]",
    },
  ],
  exercicios: [
    {
      titulo: 'Números e preços',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Escreva duas funções. As duas devolvem uma lista **nova** e não alteram a original.',
        },
        {
          tipo: 'lista',
          itens: [
            '`ordenarNumeros(numeros)` devolve os números do menor para o maior.',
            '`maisBaratosPrimeiro(itens)` devolve os itens `{ nome, preco }` do menor para o maior preço.',
          ],
        },
      ],
      codigoInicial: linhas(
        'function ordenarNumeros(numeros) {',
        '  // copie, depois ordene',
        '}',
        '',
        'function maisBaratosPrimeiro(itens) {',
        '  // copie, depois ordene pelo preço',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'ordenarNumeros ordena como número, não como texto',
          codigo: js`igual(ordenarNumeros([10, 9, 1, 100]), [1, 9, 10, 100], 'ordenarNumeros([10, 9, 1, 100])')`,
        },
        {
          descricao: 'ordenarNumeros funciona com negativos',
          codigo: js`igual(ordenarNumeros([3, -1, 2]), [-1, 2, 3], 'ordenarNumeros([3, -1, 2])')`,
        },
        {
          descricao: 'ordenarNumeros não altera a lista original',
          codigo: js`const original = [3, 1, 2];
const resultado = ordenarNumeros(original);
verdadeiro(Array.isArray(resultado), 'ordenarNumeros precisa devolver uma lista.');
igual(original, [3, 1, 2], 'A lista original')`,
        },
        {
          descricao: 'maisBaratosPrimeiro ordena pelo preço',
          codigo: js`const itens = [
  { nome: 'Caderno', preco: 20 },
  { nome: 'Caneta', preco: 3 },
  { nome: 'Borracha', preco: 5 },
];
igual(maisBaratosPrimeiro(itens).map((item) => item.nome), ['Caneta', 'Borracha', 'Caderno'], 'A ordem dos nomes')`,
        },
        {
          descricao: 'maisBaratosPrimeiro não altera a lista original',
          codigo: js`const itens = [{ nome: 'b', preco: 9 }, { nome: 'a', preco: 1 }];
const resultado = maisBaratosPrimeiro(itens);
verdadeiro(Array.isArray(resultado), 'maisBaratosPrimeiro precisa devolver uma lista.');
igual(itens.map((item) => item.nome), ['b', 'a'], 'A ordem da lista original')`,
        },
      ],
      dicas: [
        'Copie antes de ordenar: `[...numeros]`.',
        'A função de comparação para números é `(a, b) => a - b`; para itens, `(a, b) => a.preco - b.preco`.',
      ],
      solucao: linhas(
        'function ordenarNumeros(numeros) {',
        '  return [...numeros].sort((a, b) => a - b);',
        '}',
        '',
        'function maisBaratosPrimeiro(itens) {',
        '  return [...itens].sort((a, b) => a.preco - b.preco);',
        '}',
      ),
    },
    {
      titulo: 'Do maior para o menor',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `maioresPrimeiro(numeros)`, que devolve uma lista nova com os números do **maior para o menor**. A original não pode mudar.',
        },
      ],
      codigoInicial: linhas('function maioresPrimeiro(numeros) {', '  // copie e ordene ao contrário', '}', ''),
      testes: [
        {
          descricao: 'maioresPrimeiro([10, 9, 1, 100]) devolve [100, 10, 9, 1]',
          codigo: js`igual(maioresPrimeiro([10, 9, 1, 100]), [100, 10, 9, 1], 'maioresPrimeiro([10, 9, 1, 100])')`,
        },
        {
          descricao: 'Funciona com negativos',
          codigo: js`igual(maioresPrimeiro([-3, 5, 0]), [5, 0, -3], 'maioresPrimeiro([-3, 5, 0])')`,
        },
        {
          descricao: 'Uma lista vazia devolve uma lista vazia',
          codigo: js`igual(maioresPrimeiro([]), [], 'maioresPrimeiro([])')`,
        },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [1, 3, 2];
const resultado = maioresPrimeiro(original);
verdadeiro(Array.isArray(resultado) && resultado.length === 3, 'maioresPrimeiro precisa devolver uma lista com 3 itens.');
igual(original, [1, 3, 2], 'A lista original')`,
        },
      ],
      dicas: [
        'Copie com `[...numeros]` e ordene com `sort`.',
        'Para o maior vir primeiro, inverta a subtração: `(a, b) => b - a`.',
      ],
      solucao: linhas('function maioresPrimeiro(numeros) {', '  return [...numeros].sort((a, b) => b - a);', '}'),
    },
    {
      titulo: 'Em ordem alfabética',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `emOrdemAlfabetica(nomes)`, que devolve uma lista nova com os nomes em ordem alfabética, **respeitando os acentos**: `["Édson", "Bia", "Ana"]` vira `["Ana", "Bia", "Édson"]`. A original não pode mudar.',
        },
      ],
      codigoInicial: linhas('function emOrdemAlfabetica(nomes) {', '  // copie e ordene os textos', '}', ''),
      testes: [
        {
          descricao: 'Põe o “Édson” entre os nomes, e não no fim',
          codigo: js`igual(emOrdemAlfabetica(['Édson', 'Bia', 'Ana']), ['Ana', 'Bia', 'Édson'], "emOrdemAlfabetica(['Édson', 'Bia', 'Ana'])")`,
        },
        {
          descricao: 'Ordena nomes comuns',
          codigo: js`igual(emOrdemAlfabetica(['Caio', 'Ana', 'Beto']), ['Ana', 'Beto', 'Caio'], 'Três nomes comuns')`,
        },
        {
          descricao: 'Uma lista vazia devolve uma lista vazia',
          codigo: js`igual(emOrdemAlfabetica([]), [], 'emOrdemAlfabetica([])')`,
        },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = ['b', 'a'];
const resultado = emOrdemAlfabetica(original);
verdadeiro(Array.isArray(resultado) && resultado.length === 2, 'emOrdemAlfabetica precisa devolver uma lista com 2 itens.');
igual(original, ['b', 'a'], 'A lista original')`,
        },
        {
          descricao: 'Usa localeCompare',
          codigo: js`verdadeiro(codigoDoAluno.includes('localeCompare'), 'Compare os textos com localeCompare.')`,
        },
      ],
      dicas: [
        'Textos se comparam com `a.localeCompare(b, "pt-BR")`.',
        'Resposta: `[...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"))`.',
      ],
      solucao: linhas(
        'function emOrdemAlfabetica(nomes) {',
        '  return [...nomes].sort((a, b) => a.localeCompare(b, "pt-BR"));',
        '}',
      ),
    },
    {
      titulo: 'O pódio',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `podio(pontos)`, que devolve os **três maiores** números da lista, do maior para o menor. Com menos de três números, devolve todos, também do maior para o menor. Por exemplo, `podio([5, 1, 9, 3, 7])` devolve `[9, 7, 5]`.',
        },
        {
          tipo: 'nota',
          texto: '`lista.slice(0, 3)` pega os três primeiros itens (ou menos, se a lista for menor).',
        },
      ],
      codigoInicial: linhas('function podio(pontos) {', '  // ordene uma cópia e pegue os três primeiros', '}', ''),
      testes: [
        {
          descricao: 'podio([5, 1, 9, 3, 7]) devolve [9, 7, 5]',
          codigo: js`igual(podio([5, 1, 9, 3, 7]), [9, 7, 5], 'podio([5, 1, 9, 3, 7])')`,
        },
        { descricao: 'Com dois números, devolve os dois', codigo: js`igual(podio([2, 8]), [8, 2], 'podio([2, 8])')` },
        {
          descricao: 'Com exatamente três, devolve os três ordenados',
          codigo: js`igual(podio([1, 3, 2]), [3, 2, 1], 'podio([1, 3, 2])')`,
        },
        { descricao: 'Uma lista vazia devolve uma lista vazia', codigo: js`igual(podio([]), [], 'podio([])')` },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [4, 1, 3, 2];
const resultado = podio(original);
verdadeiro(Array.isArray(resultado) && resultado.length === 3, 'podio precisa devolver uma lista com 3 itens.');
igual(original, [4, 1, 3, 2], 'A lista original')`,
        },
      ],
      dicas: [
        'Ordene uma cópia do maior para o menor: `[...pontos].sort((a, b) => b - a)`.',
        'Depois, `.slice(0, 3)`.',
      ],
      solucao: linhas('function podio(pontos) {', '  return [...pontos].sort((a, b) => b - a).slice(0, 3);', '}'),
    },
    {
      titulo: 'Idade e, no empate, nome',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `ordenarPessoas(pessoas)`, que devolve uma lista nova de objetos `{ nome, idade }` do mais novo para o mais velho. Quando duas pessoas têm a mesma idade, vem primeiro quem tem o **nome** antes na ordem alfabética. A original não pode mudar.',
        },
        {
          tipo: 'nota',
          texto:
            'A função de comparação devolve um número. Se as idades são diferentes, devolva a diferença; se são iguais, a diferença é `0`, e aí vale a comparação dos nomes. O `||` ajuda: `0 || outroValor` devolve `outroValor`.',
        },
      ],
      codigoInicial: linhas('function ordenarPessoas(pessoas) {', '  // copie e ordene por dois critérios', '}', ''),
      testes: [
        {
          descricao: 'Ordena pela idade',
          codigo: js`const pessoas = [
  { nome: 'Ana', idade: 30 },
  { nome: 'Bia', idade: 20 },
  { nome: 'Caio', idade: 25 },
];
igual(ordenarPessoas(pessoas).map((p) => p.nome), ['Bia', 'Caio', 'Ana'], 'A ordem por idade')`,
        },
        {
          descricao: 'No empate de idade, ordena pelo nome',
          codigo: js`const pessoas = [
  { nome: 'Zeca', idade: 20 },
  { nome: 'Ana', idade: 20 },
  { nome: 'Mia', idade: 20 },
];
igual(ordenarPessoas(pessoas).map((p) => p.nome), ['Ana', 'Mia', 'Zeca'], 'A ordem no empate')`,
        },
        {
          descricao: 'Mistura os dois critérios',
          codigo: js`const pessoas = [
  { nome: 'Duda', idade: 30 },
  { nome: 'Caio', idade: 20 },
  { nome: 'Ana', idade: 30 },
  { nome: 'Bia', idade: 20 },
];
igual(ordenarPessoas(pessoas).map((p) => p.nome), ['Bia', 'Caio', 'Ana', 'Duda'], 'Idade e nome juntos')`,
        },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [{ nome: 'B', idade: 2 }, { nome: 'A', idade: 1 }];
const resultado = ordenarPessoas(original);
verdadeiro(Array.isArray(resultado) && resultado.length === 2, 'ordenarPessoas precisa devolver uma lista com 2 pessoas.');
igual(original.map((p) => p.nome), ['B', 'A'], 'A ordem da lista original')`,
        },
      ],
      dicas: [
        'Primeiro critério: `a.idade - b.idade`. Segundo: `a.nome.localeCompare(b.nome, "pt-BR")`.',
        'Junte os dois com `||`: o segundo só é usado quando o primeiro dá `0`.',
      ],
      solucao: linhas(
        'function ordenarPessoas(pessoas) {',
        '  return [...pessoas].sort((a, b) => a.idade - b.idade || a.nome.localeCompare(b.nome, "pt-BR"));',
        '}',
      ),
    },
    {
      titulo: 'A mediana',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A **mediana** é o valor do meio de uma lista ordenada. Quando a lista tem tamanho par, é a média dos dois valores do meio. Escreva a função `mediana(numeros)` (a lista nunca vem vazia): `mediana([3, 1, 2])` devolve `2`, e `mediana([4, 1, 3, 2])` devolve `2.5`. A lista original não pode mudar.',
        },
      ],
      codigoInicial: linhas('function mediana(numeros) {', '  // ordene uma cópia e ache o meio', '}', ''),
      testes: [
        { descricao: 'mediana([3, 1, 2]) devolve 2', codigo: js`igual(mediana([3, 1, 2]), 2, 'mediana([3, 1, 2])')` },
        {
          descricao: 'mediana([4, 1, 3, 2]) devolve 2.5',
          codigo: js`igual(mediana([4, 1, 3, 2]), 2.5, 'mediana([4, 1, 3, 2])')`,
        },
        { descricao: 'Um número só é a própria mediana', codigo: js`igual(mediana([5]), 5, 'mediana([5])')` },
        {
          descricao: 'Ordena como número, e não como texto',
          codigo: js`igual(mediana([10, 9, 100]), 10, 'mediana([10, 9, 100])')`,
        },
        { descricao: 'Dois números dão a média deles', codigo: js`igual(mediana([10, 20]), 15, 'mediana([10, 20])')` },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [9, 1, 5];
const resultado = mediana(original);
verdadeiro(resultado === 5, 'mediana([9, 1, 5]) deveria ser 5.');
igual(original, [9, 1, 5], 'A lista original')`,
        },
      ],
      dicas: [
        'Ordene uma cópia: `[...numeros].sort((a, b) => a - b)`. O meio está no índice `Math.floor(tamanho / 2)`.',
        'Se o tamanho é ímpar, devolva o item do meio. Se é par, some o do meio com o anterior (`indice - 1`) e divida por 2.',
      ],
      solucao: linhas(
        'function mediana(numeros) {',
        '  const ordenados = [...numeros].sort((a, b) => a - b);',
        '  const meio = Math.floor(ordenados.length / 2);',
        '  if (ordenados.length % 2 === 1) {',
        '    return ordenados[meio];',
        '  }',
        '  return (ordenados[meio - 1] + ordenados[meio]) / 2;',
        '}',
      ),
    },
    {
      titulo: 'Palavras por tamanho e nome',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `ordenarPorTamanho(palavras)`, que devolve uma lista nova ordenada por tamanho crescente. Em empate, use a ordem alfabética com localeCompare. Não altere a lista recebida.',
        },
      ],
      codigoInicial: 'function ordenarPorTamanho(palavras) {\n  // copie antes de ordenar e defina o desempate\n}\n',
      testes: [
        {
          descricao: 'O tamanho vem primeiro e o nome desempata',
          codigo: js`igual(ordenarPorTamanho(['sol', 'ar', 'lua', 'mar']), ['ar', 'lua', 'mar', 'sol'], 'Palavras ordenadas')`,
        },
        {
          descricao: 'Preserva a entrada e trata uma lista vazia',
          codigo: js`const entrada = ['aaaa', 'b']; igual(ordenarPorTamanho(entrada), ['b', 'aaaa'], 'Por tamanho'); igual(entrada, ['aaaa', 'b'], 'Original'); igual(ordenarPorTamanho([]), [], 'Vazia')`,
        },
      ],
      dicas: ['Compare a.length - b.length. Se der zero, use a.localeCompare(b).'],
      solucao:
        'function ordenarPorTamanho(palavras) {\n  return [...palavras].sort((a, b) => a.length - b.length || a.localeCompare(b));\n}',
    },
    {
      titulo: 'Uma ordem própria de prioridades',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `ordenarPrioridades(tarefas)`, que devolve uma cópia ordenada por prioridade: alta, depois media, depois baixa. As prioridades sempre têm um desses três valores. Em empate, mantenha a ordem de entrada.',
        },
      ],
      codigoInicial:
        'function ordenarPrioridades(tarefas) {\n  // transforme cada prioridade em um peso para comparar\n}\n',
      testes: [
        {
          descricao: 'Usa a ordem de prioridade, não a alfabética',
          codigo: js`igual(ordenarPrioridades([{ nome: 'A', prioridade: 'baixa' }, { nome: 'B', prioridade: 'alta' }, { nome: 'C', prioridade: 'media' }]).map((t) => t.nome), ['B', 'C', 'A'], 'Ordem das tarefas')`,
        },
        {
          descricao: 'Preserva empates e não altera a lista original',
          codigo: js`const entrada = [{ nome: 'A', prioridade: 'baixa' }, { nome: 'B', prioridade: 'alta' }, { nome: 'C', prioridade: 'alta' }]; igual(ordenarPrioridades(entrada).map((t) => t.nome), ['B', 'C', 'A'], 'Empate preservado'); igual(entrada[0].nome, 'A', 'Entrada preservada')`,
        },
      ],
      dicas: ['Um objeto como { alta: 0, media: 1, baixa: 2 } fornece os pesos. Compare os pesos das duas tarefas.'],
      solucao:
        'function ordenarPrioridades(tarefas) {\n  const pesos = { alta: 0, media: 1, baixa: 2 };\n  return [...tarefas].sort((a, b) => pesos[a.prioridade] - pesos[b.prioridade]);\n}',
    },
  ],
};
