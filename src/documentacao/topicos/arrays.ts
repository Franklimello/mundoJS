import { metodo, propriedade, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const arrays: TopicoDoc = {
  slug: 'arrays',
  titulo: 'Manipulação de arrays',
  resumo:
    'Os métodos de lista mais usados em JavaScript: map, filter, reduce, push, slice, find e outros, com exemplos e treinos interativos.',
  introducao: [
    'Um *array* (ou lista) guarda uma sequência ordenada de valores entre colchetes `[ ]`. Ele pode guardar números, textos, objetos ou até outros arrays.',
    'A maioria dos métodos modernos como `map()`, `filter()` e `slice()` devolve um array novo sem alterar o original. Métodos clássicos como `push()`, `pop()`, `sort()` e `reverse()` alteram a lista no próprio lugar.',
  ],
  secoes: [
    {
      titulo: 'Tamanho e acesso',
      descricao: 'Descubra quantos itens existem na lista e pegue itens em posições específicas.',
      metodos: [
        {
          id: 'length',
          nome: 'length',
          resumo:
            'Informa quantos itens o array possui. É uma propriedade, portanto vai sem parênteses. Também permite esvaziar o array definindo `lista.length = 0`.',
          sintaxe: 'lista.length',
          retorno: 'Um número: a quantidade de elementos.',
          exemplos: [
            {
              codigo:
                "const frutas = ['maçã', 'banana', 'laranja'];\nconsole.log(frutas.length);\nconsole.log([].length);",
              saida: '3\n0',
            },
          ],
          treino: treino({
            enunciado: [
              'Descubra quantos itens tem a lista `tarefas`. Guarde a quantidade em `total` e mostre com `console.log`.',
            ],
            inicial: ["const tarefas = ['estudar', 'almoçar', 'treinar', 'ler'];"],
            esperados: { total: 4 },
            usa: [propriedade('length')],
            mostra: '4',
            dicas: ['`length` vai sem parênteses, logo depois do nome da lista.', '`const total = tarefas.length;`'],
            resposta: ['const total = tarefas.length;', 'console.log(total);'],
          }),
        },
        {
          id: 'at',
          nome: 'at()',
          resumo:
            'Pega o elemento em uma posição. Aceita índices negativos para contar a partir do final (`-1` é o último item).',
          sintaxe: 'lista.at(posicao)',
          retorno: 'O elemento naquela posição, ou `undefined` se a posição não existir.',
          exemplos: [
            {
              codigo:
                "const letras = ['a', 'b', 'c', 'd'];\nconsole.log(letras.at(0));\nconsole.log(letras.at(-1));\nconsole.log(letras[1]);",
              saida: 'a\nd\nb',
            },
          ],
          cuidado:
            'Acessar com colchetes negativos (`lista[-1]`) devolve `undefined`. Para pegar o último com índice negativo, use `at(-1)`.',
          treino: treino({
            enunciado: [
              'Pegue o último item da lista `compras` usando `at()` com índice negativo. Guarde em `ultimo` e mostre.',
            ],
            inicial: ["const compras = ['arroz', 'feijão', 'azeite', 'café'];"],
            esperados: { ultimo: 'café' },
            usa: [{ padrao: '\\.at\\s*\\(\\s*-', nome: 'at() com número negativo' }],
            mostra: 'café',
            dicas: [
              'Números negativos contam a partir do fim: `-1` representa o último elemento.',
              '`const ultimo = compras.at(-1);`',
            ],
            resposta: ['const ultimo = compras.at(-1);', 'console.log(ultimo);'],
          }),
        },
      ],
    },
    {
      titulo: 'Adicionar e remover nas pontas',
      descricao: 'Operações rápidas no início e no fim da lista. Todas modificam o array original.',
      metodos: [
        {
          id: 'push',
          nome: 'push()',
          resumo: 'Adiciona um ou mais itens ao final do array. Modifica o array original e devolve o novo tamanho.',
          sintaxe: 'lista.push(item1, item2)',
          retorno: 'O novo tamanho (`length`) do array.',
          exemplos: [
            {
              codigo:
                "const fila = ['Ana', 'Bruno'];\nconst tamanho = fila.push('Carla');\nconsole.log(fila);\nconsole.log(tamanho);",
              saida: "[ 'Ana', 'Bruno', 'Carla' ]\n3",
            },
          ],
          cuidado: 'O retorno de `push()` é o novo comprimento do array, e não o array modificado.',
          treino: treino({
            enunciado: [
              "Adicione `'verde'` ao final da lista `cores` usando `push()`. Depois mostre `cores` com `console.log`.",
            ],
            inicial: ["const cores = ['azul', 'amarelo'];"],
            esperados: { cores: ['azul', 'amarelo', 'verde'] },
            usa: [metodo('push')],
            mostra: "[ 'azul', 'amarelo', 'verde' ]",
            dicas: ["Chame `cores.push('verde');` e depois mostre a lista com `console.log(cores);`."],
            resposta: ["cores.push('verde');", 'console.log(cores);'],
          }),
        },
        {
          id: 'pop',
          nome: 'pop()',
          resumo: 'Remove o **último** elemento do array e o devolve. Modifica o array original.',
          sintaxe: 'lista.pop()',
          retorno: 'O elemento removido, ou `undefined` se o array estiver vazio.',
          exemplos: [
            {
              codigo:
                'const pilha = [10, 20, 30];\nconst tirado = pilha.pop();\nconsole.log(pilha);\nconsole.log(tirado);',
              saida: '[ 10, 20 ]\n30',
            },
          ],
          treino: treino({
            enunciado: [
              'Remova o último número da lista `numeros` com `pop()`. Guarde o número removido na variável `tirado` e mostre.',
            ],
            inicial: ['const numeros = [5, 10, 15, 20];'],
            esperados: { tirado: 20, numeros: [5, 10, 15] },
            usa: [metodo('pop')],
            mostra: '20',
            dicas: ['`pop()` retira o último item e o devolve.', '`const tirado = numeros.pop();`'],
            resposta: ['const tirado = numeros.pop();', 'console.log(tirado);'],
          }),
        },
        {
          id: 'unshift',
          nome: 'unshift()',
          resumo:
            'Adiciona um ou mais itens no **início** do array e empurra os outros para frente. Devolve o novo tamanho.',
          sintaxe: 'lista.unshift(item1, item2)',
          retorno: 'O novo tamanho (`length`) do array.',
          exemplos: [
            {
              codigo: "const podium = ['Prata', 'Bronze'];\npodium.unshift('Ouro');\nconsole.log(podium);",
              saida: "[ 'Ouro', 'Prata', 'Bronze' ]",
            },
          ],
          treino: treino({
            enunciado: [
              'Adicione `0` no início da lista `contagem` usando `unshift()`. Mostre a lista com `console.log`.',
            ],
            inicial: ['const contagem = [1, 2, 3];'],
            esperados: { contagem: [0, 1, 2, 3] },
            usa: [metodo('unshift')],
            mostra: '[ 0, 1, 2, 3 ]',
            dicas: [
              'É o equivalente do `push()`, só que no começo.',
              '`contagem.unshift(0);` e depois mostre a lista.',
            ],
            resposta: ['contagem.unshift(0);', 'console.log(contagem);'],
          }),
        },
        {
          id: 'shift',
          nome: 'shift()',
          resumo: 'Remove o **primeiro** elemento do array e o devolve. Modifica o array original.',
          sintaxe: 'lista.shift()',
          retorno: 'O elemento removido, ou `undefined` se o array estiver vazio.',
          exemplos: [
            {
              codigo:
                "const clientes = ['Lucas', 'Marina', 'Pedro'];\nconst atendido = clientes.shift();\nconsole.log(atendido);\nconsole.log(clientes);",
              saida: "Lucas\n[ 'Marina', 'Pedro' ]",
            },
          ],
          treino: treino({
            enunciado: [
              'Atenda o primeiro paciente da `fila` removendo-o com `shift()`. Guarde o nome em `proximo` e mostre.',
            ],
            inicial: ["const fila = ['Carlos', 'Daniela', 'Eduardo'];"],
            esperados: { proximo: 'Carlos', fila: ['Daniela', 'Eduardo'] },
            usa: [metodo('shift')],
            mostra: 'Carlos',
            dicas: ['`shift()` retira o elemento da posição 0.', '`const proximo = fila.shift();`'],
            resposta: ['const proximo = fila.shift();', 'console.log(proximo);'],
          }),
        },
      ],
    },
    {
      titulo: 'Transformar e filtrar',
      descricao: 'Os métodos funcionais mais poderosos: não modificam o array original e devolvem uma nova lista.',
      metodos: [
        {
          id: 'map',
          nome: 'map()',
          resumo: 'Aplica uma função em cada item e cria um **novo array** com os resultados transformados.',
          sintaxe: 'lista.map((item, indice) => novoItem)',
          retorno: 'Um novo array com todos os itens transformados.',
          exemplos: [
            {
              codigo:
                'const numeros = [1, 2, 3, 4];\nconst dobrados = numeros.map((n) => n * 2);\nconsole.log(dobrados);\nconsole.log(numeros);',
              saida: '[ 2, 4, 6, 8 ]\n[ 1, 2, 3, 4 ]',
            },
          ],
          treino: treino({
            enunciado: [
              'Use `map()` para transformar a lista `precos` aplicando 10% de desconto (multiplicando cada valor por `0.9`). Guarde a nova lista em `comDesconto` e mostre.',
            ],
            inicial: ['const precos = [100, 50, 20];'],
            esperados: { comDesconto: [90, 45, 18] },
            usa: [metodo('map')],
            mostra: '[ 90, 45, 18 ]',
            dicas: [
              'Dentro do `map`, passe uma função de seta: `p => p * 0.9`.',
              '`const comDesconto = precos.map((p) => p * 0.9);`',
            ],
            resposta: ['const comDesconto = precos.map((p) => p * 0.9);', 'console.log(comDesconto);'],
          }),
        },
        {
          id: 'filter',
          nome: 'filter()',
          resumo: 'Cria um **novo array** com apenas os itens que passaram no teste (onde a função devolveu `true`).',
          sintaxe: 'lista.filter((item, indice) => condicao)',
          retorno: 'Um novo array contendo os elementos aprovados.',
          exemplos: [
            {
              codigo:
                'const idades = [12, 18, 25, 15, 30];\nconst maiores = idades.filter((i) => i >= 18);\nconsole.log(maiores);',
              saida: '[ 18, 25, 30 ]',
            },
          ],
          treino: treino({
            enunciado: [
              'Filtre a lista `pontos` deixando apenas as pontuações maiores ou iguais a 60. Guarde em `aprovados` e mostre.',
            ],
            inicial: ['const pontos = [45, 78, 92, 50, 60, 30];'],
            esperados: { aprovados: [78, 92, 60] },
            usa: [metodo('filter')],
            mostra: '[ 78, 92, 60 ]',
            dicas: [
              'A função deve devolver `true` para manter o item.',
              '`const aprovados = pontos.filter((p) => p >= 60);`',
            ],
            resposta: ['const aprovados = pontos.filter((p) => p >= 60);', 'console.log(aprovados);'],
          }),
        },
        {
          id: 'reduce',
          nome: 'reduce()',
          resumo:
            'Reduz a lista inteira a um **único valor** (uma soma, uma média ou um objeto agrupado) acumulando os resultados.',
          sintaxe: 'lista.reduce((acumulador, item) => novoAcumulador, valorInicial)',
          retorno: 'O valor final acumulado.',
          exemplos: [
            {
              codigo:
                'const valores = [10, 20, 30];\nconst soma = valores.reduce((total, valor) => total + valor, 0);\nconsole.log(soma);',
              saida: '60',
            },
          ],
          cuidado:
            'Sempre passe o valor inicial (como `0` ou `[]`). Sem ele, o primeiro elemento é usado como acumulador inicial, o que quebra se o array estiver vazio.',
          treino: treino({
            enunciado: [
              'Some todos os números da lista `gastos` usando `reduce()` começando em `0`. Guarde a soma em `total` e mostre.',
            ],
            inicial: ['const gastos = [15, 35, 50, 20];'],
            esperados: { total: 120 },
            usa: [metodo('reduce')],
            mostra: '120',
            dicas: [
              'O primeiro parâmetro é o acumulador e o segundo é o item atual.',
              '`const total = gastos.reduce((soma, item) => soma + item, 0);`',
            ],
            resposta: ['const total = gastos.reduce((soma, item) => soma + item, 0);', 'console.log(total);'],
          }),
        },
        {
          id: 'flat',
          nome: 'flat()',
          resumo: 'Achata sub-arrays aninhados em um único array plano. Por padrão achata 1 nível.',
          sintaxe: 'lista.flat(profundidade)',
          retorno: 'Um novo array com os sub-arrays descompactados.',
          exemplos: [
            {
              codigo:
                'const caixas = [[1, 2], [3, 4], [5]];\nconsole.log(caixas.flat());\nconsole.log([1, [2, [3]]].flat(2));',
              saida: '[ 1, 2, 3, 4, 5 ]\n[ 1, 2, 3 ]',
            },
          ],
          treino: treino({
            enunciado: [
              'A lista `turmas` tem alunos agrupados por sala. Use `flat()` para juntar todos em uma lista única chamada `todos` e mostre.',
            ],
            inicial: ["const turmas = [['Ana', 'Bia'], ['Caio', 'Davi']];"],
            esperados: { todos: ['Ana', 'Bia', 'Caio', 'Davi'] },
            usa: [metodo('flat')],
            mostra: "[ 'Ana', 'Bia', 'Caio', 'Davi' ]",
            dicas: ['`flat()` sem argumentos achata um nível de profundidade.', '`const todos = turmas.flat();`'],
            resposta: ['const todos = turmas.flat();', 'console.log(todos);'],
          }),
        },
        {
          id: 'flatmap',
          nome: 'flatMap()',
          resumo: 'Combina um `map()` com um `flat(1)`. Ideal quando cada item gera uma lista interna de elementos.',
          sintaxe: 'lista.flatMap((item) => subLista)',
          retorno: 'Um novo array mapeado e achatado.',
          exemplos: [
            {
              codigo:
                "const frases = ['bom dia', 'boa tarde'];\nconst palavras = frases.flatMap((f) => f.split(' '));\nconsole.log(palavras);",
              saida: "[ 'bom', 'dia', 'boa', 'tarde' ]",
            },
          ],
          treino: treino({
            enunciado: [
              'Cada pedido traz uma lista de tags. Use `flatMap()` para extrair todas as tags de `pedidos` em uma lista única chamada `tags` e mostre.',
            ],
            inicial: ["const pedidos = [{ tags: ['urgente', 'fragil'] }, { tags: ['eletronico'] }];"],
            esperados: { tags: ['urgente', 'fragil', 'eletronico'] },
            usa: [metodo('flatMap')],
            mostra: "[ 'urgente', 'fragil', 'eletronico' ]",
            dicas: [
              'Acesse a propriedade `p.tags` dentro da função de seta.',
              '`const tags = pedidos.flatMap((p) => p.tags);`',
            ],
            resposta: ['const tags = pedidos.flatMap((p) => p.tags);', 'console.log(tags);'],
          }),
        },
      ],
    },
    {
      titulo: 'Buscar e testar',
      descricao: 'Encontre elementos ou teste se os dados atendem a critérios.',
      metodos: [
        {
          id: 'find',
          nome: 'find()',
          resumo:
            'Devolve o **primeiro elemento** que satisfaz a condição da função. Se ninguém atender, devolve `undefined`.',
          sintaxe: 'lista.find((item) => condicao)',
          retorno: 'O elemento encontrado, ou `undefined`.',
          exemplos: [
            {
              codigo:
                "const usuarios = [{ id: 1, nome: 'Ana' }, { id: 2, nome: 'Beto' }];\nconst achado = usuarios.find((u) => u.id === 2);\nconsole.log(achado);",
              saida: "{ id: 2, nome: 'Beto' }",
            },
          ],
          treino: treino({
            enunciado: [
              'Encontre o primeiro número maior que 100 na lista `leituras`. Guarde em `alerta` e mostre com `console.log`.',
            ],
            inicial: ['const leituras = [40, 85, 120, 95, 140];'],
            esperados: { alerta: 120 },
            usa: [metodo('find')],
            mostra: '120',
            dicas: [
              'A função para na primeira ocorrência que devolver `true`.',
              '`const alerta = leituras.find((n) => n > 100);`',
            ],
            resposta: ['const alerta = leituras.find((n) => n > 100);', 'console.log(alerta);'],
          }),
        },
        {
          id: 'findindex',
          nome: 'findIndex()',
          resumo:
            'Devolve o **índice** do primeiro elemento que satisfaz a condição. Se ninguém atender, devolve `-1`.',
          sintaxe: 'lista.findIndex((item) => condicao)',
          retorno: 'O índice numérico, ou `-1`.',
          exemplos: [
            {
              codigo:
                'const notas = [6, 4, 8, 3];\nconst indice = notas.findIndex((n) => n < 5);\nconsole.log(indice);',
              saida: '1',
            },
          ],
          treino: treino({
            enunciado: [
              'Descubra o índice do primeiro número negativo na lista `saldos` usando `findIndex()`. Guarde em `indiceNegativo` e mostre.',
            ],
            inicial: ['const saldos = [150, 40, -25, 80];'],
            esperados: { indiceNegativo: 2 },
            usa: [metodo('findIndex')],
            mostra: '2',
            dicas: ['Procure por `n < 0`.', '`const indiceNegativo = saldos.findIndex((n) => n < 0);`'],
            resposta: ['const indiceNegativo = saldos.findIndex((n) => n < 0);', 'console.log(indiceNegativo);'],
          }),
        },
        {
          id: 'includes',
          nome: 'includes()',
          resumo: 'Diz se um determinado valor está presente no array. Faz comparação estrita (`===`).',
          sintaxe: 'lista.includes(valorProcurado)',
          retorno: '`true` se o valor estiver na lista, senão `false`.',
          exemplos: [
            {
              codigo:
                "const convidados = ['Lucas', 'Carla', 'Tiago'];\nconsole.log(convidados.includes('Carla'));\nconsole.log(convidados.includes('Marcos'));",
              saida: 'true\nfalse',
            },
          ],
          cuidado:
            'Não use com objetos ou arrays internos (`[{ id: 1 }].includes({ id: 1 })`), pois objetos diferentes na memória não são iguais com `===`. Para objetos, use `some()` ou `find()`.',
          treino: treino({
            enunciado: [
              "Verifique se `'maçã'` está na lista `carrinho`. Guarde o resultado booleano em `temMaca` e mostre.",
            ],
            inicial: ["const carrinho = ['banana', 'laranja', 'maçã', 'uva'];"],
            esperados: { temMaca: true },
            usa: [metodo('includes')],
            mostra: 'true',
            dicas: ['`includes` devolve `true` ou `false`.', "`const temMaca = carrinho.includes('maçã');`"],
            resposta: ["const temMaca = carrinho.includes('maçã');", 'console.log(temMaca);'],
          }),
        },
        {
          id: 'some',
          nome: 'some()',
          resumo:
            'Testa se **pelo menos um** elemento satisfaz a condição. Devolve `true` assim que encontra um caso favorável.',
          sintaxe: 'lista.some((item) => condicao)',
          retorno: '`true` se houver pelo menos um correspondente, senão `false`.',
          exemplos: [
            {
              codigo:
                'const notas = [5, 4, 8, 3];\nconst temAprovado = notas.some((n) => n >= 6);\nconsole.log(temAprovado);',
              saida: 'true',
            },
          ],
          treino: treino({
            enunciado: [
              'Use `some()` para testar se há algum número menor que 0 na lista `temperaturas`. Guarde em `teveNegativa` e mostre.',
            ],
            inicial: ['const temperaturas = [18, 22, -2, 15, 20];'],
            esperados: { teveNegativa: true },
            usa: [metodo('some')],
            mostra: 'true',
            dicas: [
              'A condição deve testar se o valor é negativo (`t < 0`).',
              '`const teveNegativa = temperaturas.some((t) => t < 0);`',
            ],
            resposta: ['const teveNegativa = temperaturas.some((t) => t < 0);', 'console.log(teveNegativa);'],
          }),
        },
        {
          id: 'every',
          nome: 'every()',
          resumo:
            'Testa se **todos** os elementos satisfazem a condição. Devolve `false` assim que encontra a primeira falha.',
          sintaxe: 'lista.every((item) => condicao)',
          retorno: '`true` se todos passarem no teste, senão `false`.',
          exemplos: [
            {
              codigo:
                'const idades = [20, 25, 19, 30];\nconsole.log(idades.every((i) => i >= 18));\nconsole.log([18, 15, 22].every((i) => i >= 18));',
              saida: 'true\nfalse',
            },
          ],
          treino: treino({
            enunciado: [
              'Use `every()` para conferir se todos os números de `notas` são maiores ou iguais a 5. Guarde em `todasBoas` e mostre.',
            ],
            inicial: ['const notas = [7, 8, 5, 9, 6];'],
            esperados: { todasBoas: true },
            usa: [metodo('every')],
            mostra: 'true',
            dicas: ['`every` exige que 100% dos itens passem.', '`const todasBoas = notas.every((n) => n >= 5);`'],
            resposta: ['const todasBoas = notas.every((n) => n >= 5);', 'console.log(todasBoas);'],
          }),
        },
        {
          id: 'indexof',
          nome: 'indexOf() e lastIndexOf()',
          resumo: '`indexOf()` devolve a primeira posição onde um item simples aparece; `lastIndexOf()`, a última.',
          sintaxe: 'lista.indexOf(valor)\nlista.lastIndexOf(valor)',
          retorno: 'O índice numérico, ou `-1` se o elemento não for encontrado.',
          exemplos: [
            {
              codigo:
                "const cores = ['azul', 'vermelho', 'verde', 'vermelho'];\nconsole.log(cores.indexOf('vermelho'));\nconsole.log(cores.lastIndexOf('vermelho'));\nconsole.log(cores.indexOf('preto'));",
              saida: '1\n3\n-1',
            },
          ],
          treino: treino({
            enunciado: [
              "Encontre a primeira posição de `'café'` na lista `itens` usando `indexOf()`. Guarde em `posicaoCafe` e mostre.",
            ],
            inicial: ["const itens = ['leite', 'pão', 'café', 'manteiga'];"],
            esperados: { posicaoCafe: 2 },
            usa: [metodo('indexOf')],
            mostra: '2',
            dicas: [
              'A contagem começa em 0: leite é 0, pão é 1, café é 2.',
              "`const posicaoCafe = itens.indexOf('café');`",
            ],
            resposta: ["const posicaoCafe = itens.indexOf('café');", 'console.log(posicaoCafe);'],
          }),
        },
      ],
    },
    {
      titulo: 'Recortar e juntar',
      descricao: 'Crie fatias ou junte itens em novas listas ou em strings.',
      metodos: [
        {
          id: 'slice',
          nome: 'slice()',
          resumo:
            'Copia uma fatia do array do `inicio` até antes do `fim`. Não altera o array original e aceita índices negativos.',
          sintaxe: 'lista.slice(inicio, fim)',
          retorno: 'Um novo array contendo a fatia selecionada.',
          exemplos: [
            {
              codigo:
                "const letras = ['a', 'b', 'c', 'd', 'e'];\nconsole.log(letras.slice(1, 4));\nconsole.log(letras.slice(-2));",
              saida: "[ 'b', 'c', 'd' ]\n[ 'd', 'e' ]",
            },
          ],
          cuidado: 'O item na posição `fim` **não** entra na fatia: `slice(0, 3)` pega os índices 0, 1 e 2.',
          treino: treino({
            enunciado: [
              'Pegue os 3 primeiros colocados da corrida na lista `pilotos` usando `slice(0, 3)`. Guarde em `podio` e mostre.',
            ],
            inicial: ["const pilotos = ['Senna', 'Prost', 'Mansell', 'Piquet', 'Berger'];"],
            esperados: { podio: ['Senna', 'Prost', 'Mansell'] },
            usa: [metodo('slice')],
            mostra: "[ 'Senna', 'Prost', 'Mansell' ]",
            dicas: ['O índice 3 não é incluído, pegando exatamente 0, 1 e 2.', '`const podio = pilotos.slice(0, 3);`'],
            resposta: ['const podio = pilotos.slice(0, 3);', 'console.log(podio);'],
          }),
        },
        {
          id: 'concat',
          nome: 'concat()',
          resumo: 'Junta dois ou mais arrays em um novo array, sem modificar os originais.',
          sintaxe: 'lista.concat(outraLista, maisUma)',
          retorno: 'Um novo array com todos os elementos combinados.',
          exemplos: [
            {
              codigo:
                'const pares = [2, 4];\nconst impares = [1, 3];\nconst todos = pares.concat(impares);\nconsole.log(todos);',
              saida: '[ 2, 4, 1, 3 ]',
            },
          ],
          treino: treino({
            enunciado: [
              'Junte as listas `manha` e `tarde` usando `concat()`. Guarde a lista combinada em `diaTodo` e mostre.',
            ],
            inicial: ["const manha = ['reunião', 'emails'];", "const tarde = ['relatório', 'alinhamento'];"],
            esperados: { diaTodo: ['reunião', 'emails', 'relatório', 'alinhamento'] },
            usa: [metodo('concat')],
            mostra: "[ 'reunião', 'emails', 'relatório', 'alinhamento' ]",
            dicas: [
              '`manha.concat(tarde)` cria um novo array com os itens de ambos.',
              '`const diaTodo = manha.concat(tarde);`',
            ],
            resposta: ['const diaTodo = manha.concat(tarde);', 'console.log(diaTodo);'],
          }),
        },
        {
          id: 'join',
          nome: 'join()',
          resumo: 'Transforma o array em uma **string**, juntando todos os elementos com o separador escolhido.',
          sintaxe: 'lista.join(separador)',
          retorno: 'Uma string com os itens unidos.',
          exemplos: [
            {
              codigo:
                "const palavras = ['Aprender', 'JavaScript', 'é', 'legal'];\nconsole.log(palavras.join(' '));\nconsole.log([1, 2, 3].join('-'));",
              saida: 'Aprender JavaScript é legal\n1-2-3',
            },
          ],
          treino: treino({
            enunciado: [
              "Transforme a lista `palavras` em uma frase separada por espaços usando `join(' ')`. Guarde em `frase` e mostre.",
            ],
            inicial: ["const palavras = ['MundoJS', 'ensina', 'na', 'prática'];"],
            esperados: { frase: 'MundoJS ensina na prática' },
            usa: [metodo('join')],
            mostra: 'MundoJS ensina na prática',
            dicas: [
              "O separador vai entre aspas dentro dos parênteses: `join(' ')`.",
              "`const frase = palavras.join(' ');`",
            ],
            resposta: ["const frase = palavras.join(' ');", 'console.log(frase);'],
          }),
        },
      ],
    },
    {
      titulo: 'Ordenar e inverter',
      descricao: 'Altere a ordem dos elementos numéricos e textuais.',
      metodos: [
        {
          id: 'sort',
          nome: 'sort() e toSorted()',
          resumo:
            'Ordena os elementos. `sort()` altera o array original no lugar; `toSorted()` devolve um novo array ordenado sem alterar o original.',
          sintaxe: 'lista.sort((a, b) => a - b)\nlista.toSorted((a, b) => a - b)',
          retorno: 'O array ordenado.',
          exemplos: [
            {
              codigo: 'const numeros = [10, 5, 40, 25];\nnumeros.sort((a, b) => a - b);\nconsole.log(numeros);',
              saida: '[ 5, 10, 25, 40 ]',
            },
          ],
          cuidado:
            'Sem função de comparação, `sort()` converte tudo para texto e ordena alfabeticamente (`10` vem antes de `2`!). Para ordenar números do menor ao maior, sempre use `(a, b) => a - b`.',
          treino: treino({
            enunciado: [
              'Ordene a lista `precos` do menor para o maior usando `sort((a, b) => a - b)`. Mostre a lista com `console.log`.',
            ],
            inicial: ['const precos = [80, 15, 120, 45];'],
            esperados: { precos: [15, 45, 80, 120] },
            usa: [metodo('sort')],
            mostra: '[ 15, 45, 80, 120 ]',
            dicas: [
              'Passe a função de comparação numérica `(a, b) => a - b`.',
              '`precos.sort((a, b) => a - b);` e depois `console.log(precos);`.',
            ],
            resposta: ['precos.sort((a, b) => a - b);', 'console.log(precos);'],
          }),
        },
        {
          id: 'reverse',
          nome: 'reverse() e toReversed()',
          resumo:
            'Inverte a ordem dos itens. `reverse()` modifica o array original; `toReversed()` devolve um novo array invertido.',
          sintaxe: 'lista.reverse()\nlista.toReversed()',
          retorno: 'O array com os itens invertidos.',
          exemplos: [
            {
              codigo: 'const ordem = [1, 2, 3, 4];\nordem.reverse();\nconsole.log(ordem);',
              saida: '[ 4, 3, 2, 1 ]',
            },
          ],
          treino: treino({
            enunciado: ['Inverta a ordem da lista `mensagens` usando `reverse()`. Mostre o resultado no console.'],
            inicial: ["const mensagens = ['primeira', 'segunda', 'terceira'];"],
            esperados: { mensagens: ['terceira', 'segunda', 'primeira'] },
            usa: [metodo('reverse')],
            mostra: "[ 'terceira', 'segunda', 'primeira' ]",
            dicas: ['`reverse()` inverte a lista no próprio lugar.', '`mensagens.reverse();` e depois mostre a lista.'],
            resposta: ['mensagens.reverse();', 'console.log(mensagens);'],
          }),
        },
      ],
    },
  ],
};
