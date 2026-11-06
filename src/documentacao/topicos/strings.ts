import { metodo, propriedade, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const strings: TopicoDoc = {
  slug: 'strings',
  titulo: 'Manipulação de strings',
  resumo: 'Os métodos de texto mais usados: trim, toUpperCase, slice, split, replace e outros, com exemplos que rodam.',
  introducao: [
    'Uma *string* é um texto: tudo o que fica entre aspas simples, duplas ou crases. Ela vem com vários métodos prontos para limpar, buscar, cortar e transformar o texto.',
    'Strings são **imutáveis**: nenhum método muda o texto original. Todos devolvem um texto novo, que você guarda numa variável ou usa direto.',
  ],
  secoes: [
    {
      titulo: 'Tamanho e acesso',
      descricao: 'Quantas letras um texto tem e como pegar uma letra específica.',
      metodos: [
        {
          id: 'length',
          nome: 'length',
          resumo:
            'Diz quantos caracteres o texto tem, contando espaços e pontuação. É uma propriedade, por isso vai sem parênteses.',
          sintaxe: 'texto.length',
          retorno: 'Um número: a quantidade de caracteres.',
          exemplos: [
            {
              codigo: "const nome = 'Maria Clara';\nconsole.log(nome.length);\nconsole.log(''.length);",
              saida: '11\n0',
            },
          ],
          treino: treino({
            enunciado: [
              'Descubra quantos caracteres tem a `senha`. Guarde o número em `tamanho` e mostre com `console.log`.',
            ],
            inicial: ["const senha = 'abacaxi123';"],
            esperados: { tamanho: 10 },
            usa: [propriedade('length')],
            mostra: '10',
            dicas: ['`length` vai sem parênteses, logo depois do nome da variável.', '`const tamanho = senha.length;`'],
            resposta: ['const tamanho = senha.length;', 'console.log(tamanho);'],
          }),
        },
        {
          id: 'at',
          nome: 'at()',
          resumo:
            'Pega o caractere numa posição. A contagem começa em `0`, e números negativos contam a partir do fim.',
          sintaxe: 'texto.at(posicao)',
          retorno: 'Uma string com um caractere, ou `undefined` se a posição não existir.',
          exemplos: [
            {
              codigo:
                "const palavra = 'JavaScript';\nconsole.log(palavra.at(0));\nconsole.log(palavra.at(-1));\nconsole.log(palavra[4]);",
              saida: 'J\nt\nS',
            },
          ],
          cuidado:
            'Com colchetes (`palavra[-1]`) o número negativo não funciona e devolve `undefined`. Para pegar a última letra, use `at(-1)`.',
          treino: treino({
            enunciado: [
              'Pegue a **última** letra da `palavra` usando `at()` com um número negativo. Guarde em `ultima` e mostre.',
            ],
            inicial: ["const palavra = 'computador';"],
            esperados: { ultima: 'r' },
            usa: [{ padrao: '\\.at\\s*\\(\\s*-', nome: 'at() com número negativo' }],
            mostra: 'r',
            dicas: ['Números negativos contam a partir do fim: `-1` é o último.', '`const ultima = palavra.at(-1);`'],
            resposta: ['const ultima = palavra.at(-1);', 'console.log(ultima);'],
          }),
        },
      ],
    },
    {
      titulo: 'Maiúsculas e minúsculas',
      metodos: [
        {
          id: 'touppercase',
          nome: 'toUpperCase()',
          resumo: 'Devolve o texto com todas as letras em maiúsculas. Números e símbolos ficam como estão.',
          sintaxe: 'texto.toUpperCase()',
          retorno: 'Uma string nova, em maiúsculas.',
          exemplos: [
            {
              codigo: "const cidade = 'São Paulo';\nconsole.log(cidade.toUpperCase());\nconsole.log(cidade);",
              saida: 'SÃO PAULO\nSão Paulo',
            },
          ],
          treino: treino({
            enunciado: ['Transforme o `aviso` num grito: tudo em maiúsculas. Guarde em `grito` e mostre.'],
            inicial: ["const aviso = 'cuidado: piso molhado';"],
            esperados: { grito: 'CUIDADO: PISO MOLHADO' },
            usa: [metodo('toUpperCase')],
            mostra: 'CUIDADO: PISO MOLHADO',
            dicas: ['O método não recebe nada entre os parênteses.', '`const grito = aviso.toUpperCase();`'],
            resposta: ['const grito = aviso.toUpperCase();', 'console.log(grito);'],
          }),
        },
        {
          id: 'tolowercase',
          nome: 'toLowerCase()',
          resumo:
            'Devolve o texto com todas as letras em minúsculas. Muito útil para comparar textos sem se importar com maiúsculas.',
          sintaxe: 'texto.toLowerCase()',
          retorno: 'Uma string nova, em minúsculas.',
          exemplos: [
            {
              codigo:
                "const digitado = 'SIM';\nconsole.log(digitado.toLowerCase());\nconsole.log(digitado.toLowerCase() === 'sim');",
              saida: 'sim\ntrue',
            },
          ],
          treino: treino({
            enunciado: [
              'A pessoa digitou `SiM`, misturando maiúsculas. Crie `normalizada` com a resposta toda em minúsculas e mostre.',
            ],
            inicial: ["const resposta = 'SiM';"],
            esperados: { normalizada: 'sim' },
            usa: [metodo('toLowerCase')],
            mostra: 'sim',
            dicas: ['É o contrário de `toUpperCase()`.', '`const normalizada = resposta.toLowerCase();`'],
            resposta: ['const normalizada = resposta.toLowerCase();', 'console.log(normalizada);'],
          }),
        },
        {
          id: 'primeira-maiuscula',
          nome: 'Primeira letra maiúscula',
          resumo: 'Não existe um método pronto, mas dá para combinar `at(0)`, `toUpperCase()` e `slice(1)`.',
          sintaxe: 'texto.at(0).toUpperCase() + texto.slice(1)',
          retorno: 'Uma string nova, com a primeira letra maiúscula.',
          exemplos: [
            {
              codigo:
                "const nome = 'ana';\nconst bonito = nome.at(0).toUpperCase() + nome.slice(1);\nconsole.log(bonito);",
              saida: 'Ana',
            },
          ],
          treino: treino({
            enunciado: ['Deixe só a primeira letra da `cidade` maiúscula. Guarde em `titulo` e mostre.'],
            inicial: ["const cidade = 'recife';"],
            esperados: { titulo: 'Recife' },
            usa: [metodo('toUpperCase'), metodo('slice')],
            mostra: 'Recife',
            dicas: [
              'Pegue a primeira letra com `at(0)` e o resto com `slice(1)`.',
              '`const titulo = cidade.at(0).toUpperCase() + cidade.slice(1);`',
            ],
            resposta: ['const titulo = cidade.at(0).toUpperCase() + cidade.slice(1);', 'console.log(titulo);'],
          }),
        },
      ],
    },
    {
      titulo: 'Espaços e preenchimento',
      descricao: 'Nos exemplos, os colchetes só servem para mostrar onde o texto começa e termina.',
      metodos: [
        {
          id: 'trim',
          nome: 'trim()',
          resumo: 'Remove os espaços (e quebras de linha) do começo e do fim do texto. Os espaços do meio ficam.',
          sintaxe: 'texto.trim()',
          retorno: 'Uma string nova, sem espaços nas pontas.',
          exemplos: [
            {
              codigo:
                "const email = '   ana@email.com  ';\nconsole.log(`[${email.trim()}]`);\nconsole.log(`[${'  bom   dia  '.trim()}]`);",
              saida: '[ana@email.com]\n[bom   dia]',
            },
          ],
          treino: treino({
            enunciado: ['A `busca` veio com espaços sobrando nas pontas. Crie `limpa` sem esses espaços e mostre.'],
            inicial: ["const busca = '   tênis azul   ';"],
            esperados: { limpa: 'tênis azul' },
            usa: [metodo('trim')],
            mostra: 'tênis azul',
            dicas: [
              'O espaço do meio deve continuar lá; o `trim()` só mexe nas pontas.',
              '`const limpa = busca.trim();`',
            ],
            resposta: ['const limpa = busca.trim();', 'console.log(limpa);'],
          }),
        },
        {
          id: 'trimstart-trimend',
          nome: 'trimStart() e trimEnd()',
          resumo: 'Como o `trim()`, mas só de um lado: `trimStart()` limpa o começo e `trimEnd()` limpa o fim.',
          sintaxe: 'texto.trimStart()\ntexto.trimEnd()',
          retorno: 'Uma string nova, sem espaços no lado escolhido.',
          exemplos: [
            {
              codigo:
                "const texto = '   olá   ';\nconsole.log(`[${texto.trimStart()}]`);\nconsole.log(`[${texto.trimEnd()}]`);",
              saida: '[olá   ]\n[   olá]',
            },
          ],
          treino: treino({
            enunciado: [
              'Crie duas variáveis a partir de `texto`: `semInicio`, sem os espaços do começo, e `semFim`, sem os espaços do fim.',
            ],
            inicial: ["const texto = '   meio   ';"],
            esperados: { semInicio: 'meio   ', semFim: '   meio' },
            usa: [metodo('trimStart'), metodo('trimEnd')],
            dicas: [
              '*Start* é o começo, *End* é o fim.',
              '`const semInicio = texto.trimStart();` e `const semFim = texto.trimEnd();`',
            ],
            resposta: ['const semInicio = texto.trimStart();', 'const semFim = texto.trimEnd();'],
          }),
        },
        {
          id: 'padstart-padend',
          nome: 'padStart() e padEnd()',
          resumo:
            'Completa o texto até um tamanho, repetindo um preenchimento no começo (`padStart`) ou no fim (`padEnd`).',
          sintaxe: 'texto.padStart(tamanho, preenchimento)\ntexto.padEnd(tamanho, preenchimento)',
          retorno: 'Uma string nova com o tamanho pedido. Se o texto já for maior, ele volta igual.',
          exemplos: [
            {
              codigo:
                "console.log('7'.padStart(2, '0'));\nconsole.log('42'.padStart(5, '*'));\nconsole.log('Total'.padEnd(10, '.') + 'R$ 30');",
              saida: '07\n***42\nTotal.....R$ 30',
            },
          ],
          cuidado: "Funciona só em strings. Para um número, converta antes: `String(7).padStart(2, '0')`.",
          treino: treino({
            enunciado: [
              'Monte o `relogio` no formato `05:07`, completando `hora` e `minuto` com zero à esquerda. Mostre o resultado.',
            ],
            inicial: ['const hora = 5;', 'const minuto = 7;'],
            esperados: { relogio: '05:07' },
            usa: [metodo('padStart')],
            mostra: '05:07',
            dicas: [
              'Números não têm `padStart`: converta antes com `String(hora)`.',
              "`String(hora).padStart(2, '0')` vira `'05'`. Faça o mesmo com o minuto e junte com `':'`.",
            ],
            resposta: [
              "const relogio = String(hora).padStart(2, '0') + ':' + String(minuto).padStart(2, '0');",
              'console.log(relogio);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Buscar dentro do texto',
      metodos: [
        {
          id: 'includes',
          nome: 'includes()',
          resumo: 'Diz se um pedaço de texto aparece em algum lugar da string. Diferencia maiúsculas de minúsculas.',
          sintaxe: 'texto.includes(procurado)',
          retorno: '`true` ou `false`.',
          exemplos: [
            {
              codigo:
                "const frase = 'Eu adoro JavaScript';\nconsole.log(frase.includes('Java'));\nconsole.log(frase.includes('java'));",
              saida: 'true\nfalse',
            },
          ],
          treino: treino({
            enunciado: [
              'Descubra se o `comentario` contém a palavra `ótimo`. Guarde o resultado em `elogio` e mostre.',
            ],
            inicial: ["const comentario = 'Esse produto é ótimo e chegou rápido';"],
            esperados: { elogio: true },
            usa: [metodo('includes')],
            mostra: 'true',
            dicas: ['`includes` devolve `true` ou `false`.', "`const elogio = comentario.includes('ótimo');`"],
            resposta: ["const elogio = comentario.includes('ótimo');", 'console.log(elogio);'],
          }),
        },
        {
          id: 'startswith-endswith',
          nome: 'startsWith() e endsWith()',
          resumo: 'Dizem se o texto começa ou termina com um pedaço específico.',
          sintaxe: 'texto.startsWith(inicio)\ntexto.endsWith(fim)',
          retorno: '`true` ou `false`.',
          exemplos: [
            {
              codigo:
                "const arquivo = 'foto-praia.png';\nconsole.log(arquivo.startsWith('foto'));\nconsole.log(arquivo.endsWith('.jpg'));",
              saida: 'true\nfalse',
            },
          ],
          treino: treino({
            enunciado: [
              'Confira o endereço do `site`. Crie `seguro`, que diz se ele começa com `https`, e `brasileiro`, que diz se ele termina com `.br`.',
            ],
            inicial: ["const site = 'https://mundojs.com.br';"],
            esperados: { seguro: true, brasileiro: true },
            usa: [metodo('startsWith'), metodo('endsWith')],
            dicas: [
              'Um método confere o começo, o outro confere o fim.',
              "`const seguro = site.startsWith('https');` e `const brasileiro = site.endsWith('.br');`",
            ],
            resposta: ["const seguro = site.startsWith('https');", "const brasileiro = site.endsWith('.br');"],
          }),
        },
        {
          id: 'indexof',
          nome: 'indexOf() e lastIndexOf()',
          resumo: '`indexOf()` diz a posição da primeira vez que o pedaço aparece; `lastIndexOf()`, a da última.',
          sintaxe: 'texto.indexOf(procurado)\ntexto.lastIndexOf(procurado)',
          retorno: 'Um número com a posição, ou `-1` se não encontrar.',
          exemplos: [
            {
              codigo:
                "const texto = 'banana';\nconsole.log(texto.indexOf('a'));\nconsole.log(texto.lastIndexOf('a'));\nconsole.log(texto.indexOf('x'));",
              saida: '1\n5\n-1',
            },
          ],
          treino: treino({
            enunciado: ['Encontre a posição do `@` no `email`. Guarde em `posicaoArroba` e mostre.'],
            inicial: ["const email = 'leo@escola.com';"],
            esperados: { posicaoArroba: 3 },
            usa: [metodo('indexOf')],
            mostra: '3',
            dicas: ['A contagem começa em 0: `l` é 0, `e` é 1...', "`const posicaoArroba = email.indexOf('@');`"],
            resposta: ["const posicaoArroba = email.indexOf('@');", 'console.log(posicaoArroba);'],
          }),
        },
      ],
    },
    {
      titulo: 'Recortar e dividir',
      metodos: [
        {
          id: 'slice',
          nome: 'slice()',
          resumo:
            'Recorta um pedaço do texto, do `inicio` até antes do `fim`. Sem o `fim`, vai até o final. Aceita números negativos.',
          sintaxe: 'texto.slice(inicio, fim)',
          retorno: 'Uma string nova com o pedaço recortado.',
          exemplos: [
            {
              codigo:
                "const texto = 'JavaScript';\nconsole.log(texto.slice(0, 4));\nconsole.log(texto.slice(4));\nconsole.log(texto.slice(-3));",
              saida: 'Java\nScript\nipt',
            },
          ],
          cuidado: 'O caractere na posição `fim` **não** entra no recorte: `slice(0, 4)` pega as posições 0, 1, 2 e 3.',
          treino: treino({
            enunciado: [
              'A `data` está no formato ano-mês-dia. Recorte o `ano` (os 4 primeiros caracteres) e o `dia` (os 2 últimos).',
            ],
            inicial: ["const data = '2026-11-06';"],
            esperados: { ano: '2026', dia: '06' },
            usa: [metodo('slice')],
            dicas: [
              'O fim do recorte não entra: `slice(0, 4)` pega as posições 0 a 3. Para os últimos, use número negativo.',
              '`const ano = data.slice(0, 4);` e `const dia = data.slice(-2);`',
            ],
            resposta: ['const ano = data.slice(0, 4);', 'const dia = data.slice(-2);'],
          }),
        },
        {
          id: 'substring',
          nome: 'substring()',
          resumo:
            'Parecido com o `slice()`, mas trata números negativos como `0`. Prefira o `slice()`, que é mais previsível.',
          sintaxe: 'texto.substring(inicio, fim)',
          retorno: 'Uma string nova com o pedaço recortado.',
          exemplos: [
            {
              codigo: "const texto = 'Mundo';\nconsole.log(texto.substring(1, 3));\nconsole.log(texto.substring(-2));",
              saida: 'un\nMundo',
            },
          ],
          treino: treino({
            enunciado: [
              'Tire o `numero` do meio do `codigo`: os 5 dígitos entre os hífens. Use `substring()` e mostre.',
            ],
            inicial: ["const codigo = 'BR-12345-SP';"],
            esperados: { numero: '12345' },
            usa: [metodo('substring')],
            mostra: '12345',
            dicas: [
              'O `1` está na posição 3, e o hífen depois do `5` está na posição 8.',
              '`const numero = codigo.substring(3, 8);`',
            ],
            resposta: ['const numero = codigo.substring(3, 8);', 'console.log(numero);'],
          }),
        },
        {
          id: 'split',
          nome: 'split()',
          resumo:
            "Divide o texto num array, cortando onde aparece o separador. Com `''` como separador, separa letra por letra.",
          sintaxe: 'texto.split(separador)',
          retorno: 'Um array de strings.',
          exemplos: [
            {
              codigo:
                "const frutas = 'maçã,uva,pera';\nconsole.log(frutas.split(','));\nconsole.log('oi'.split(''));\nconsole.log('um dois três'.split(' ').length);",
              saida: "[ 'maçã', 'uva', 'pera' ]\n[ 'o', 'i' ]\n3",
            },
          ],
          treino: treino({
            enunciado: ['Transforme as `tags` num array, separando nas vírgulas. Guarde em `lista` e mostre.'],
            inicial: ["const tags = 'js,html,css';"],
            esperados: { lista: ['js', 'html', 'css'] },
            usa: [metodo('split')],
            mostra: "[ 'js', 'html', 'css' ]",
            dicas: ["O separador vai entre aspas: `split(',')`.", "`const lista = tags.split(',');`"],
            resposta: ["const lista = tags.split(',');", 'console.log(lista);'],
          }),
        },
      ],
    },
    {
      titulo: 'Substituir e montar',
      metodos: [
        {
          id: 'replace',
          nome: 'replace()',
          resumo: 'Troca a **primeira** ocorrência de um pedaço por outro.',
          sintaxe: 'texto.replace(procurado, novo)',
          retorno: 'Uma string nova com a troca feita.',
          exemplos: [
            {
              codigo: "const frase = 'gato preto, gato branco';\nconsole.log(frase.replace('gato', 'cão'));",
              saida: 'cão preto, gato branco',
            },
          ],
          cuidado: 'Só a primeira ocorrência muda. Para trocar todas, use `replaceAll()`.',
          treino: treino({
            enunciado: ['Troque `Python` por `JavaScript` na `frase`. Guarde em `nova` e mostre.'],
            inicial: ["const frase = 'Eu gosto de Python';"],
            esperados: { nova: 'Eu gosto de JavaScript' },
            usa: [metodo('replace')],
            mostra: 'Eu gosto de JavaScript',
            dicas: ['Primeiro o que sai, depois o que entra.', "`const nova = frase.replace('Python', 'JavaScript');`"],
            resposta: ["const nova = frase.replace('Python', 'JavaScript');", 'console.log(nova);'],
          }),
        },
        {
          id: 'replaceall',
          nome: 'replaceAll()',
          resumo: 'Troca **todas** as ocorrências de um pedaço por outro.',
          sintaxe: 'texto.replaceAll(procurado, novo)',
          retorno: 'Uma string nova com todas as trocas feitas.',
          exemplos: [
            {
              codigo:
                "const frase = 'gato preto, gato branco';\nconsole.log(frase.replaceAll('gato', 'cão'));\nconsole.log('123.456.789-00'.replaceAll('.', '').replace('-', ''));",
              saida: 'cão preto, cão branco\n12345678900',
            },
          ],
          treino: treino({
            enunciado: ['Tire **todos** os hífens do `telefone`. Guarde em `soNumeros` e mostre.'],
            inicial: ["const telefone = '31-99999-0000';"],
            esperados: { soNumeros: '31999990000' },
            usa: [metodo('replaceAll')],
            mostra: '31999990000',
            dicas: [
              "Trocar por nada é trocar por texto vazio: `''`.",
              "`const soNumeros = telefone.replaceAll('-', '');`",
            ],
            resposta: ["const soNumeros = telefone.replaceAll('-', '');", 'console.log(soNumeros);'],
          }),
        },
        {
          id: 'repeat',
          nome: 'repeat()',
          resumo: 'Repete o texto um número de vezes.',
          sintaxe: 'texto.repeat(vezes)',
          retorno: 'Uma string nova com o texto repetido.',
          exemplos: [
            {
              codigo: "console.log('ha'.repeat(3));\nconsole.log('-'.repeat(10));",
              saida: 'hahaha\n----------',
            },
          ],
          treino: treino({
            enunciado: ['Mostre a `nota` em estrelas: crie `estrelas` repetindo `★` tantas vezes quanto a nota.'],
            inicial: ['const nota = 4;'],
            esperados: { estrelas: '★★★★' },
            usa: [metodo('repeat')],
            mostra: '★★★★',
            dicas: ['O número de vezes pode vir de uma variável.', "`const estrelas = '★'.repeat(nota);`"],
            resposta: ["const estrelas = '★'.repeat(nota);", 'console.log(estrelas);'],
          }),
        },
        {
          id: 'template-string',
          nome: 'Template string (crases)',
          resumo:
            'Com crases, você coloca valores no meio do texto usando `${ }`. É o jeito mais legível de montar frases.',
          sintaxe: '`texto ${valor} texto`',
          retorno: 'Uma string nova, com os valores no lugar.',
          exemplos: [
            {
              codigo:
                "const nome = 'Leo';\nconst idade = 12;\nconsole.log(`${nome} tem ${idade} anos`);\nconsole.log(`Ano que vem: ${idade + 1}`);",
              saida: 'Leo tem 12 anos\nAno que vem: 13',
            },
          ],
          treino: treino({
            enunciado: [
              'Monte a `etiqueta` com crases, encaixando `produto` e `preco`, para ficar exatamente `Caderno custa R$ 12.5`. Mostre.',
            ],
            inicial: ["const produto = 'Caderno';", 'const preco = 12.5;'],
            esperados: { etiqueta: 'Caderno custa R$ 12.5' },
            usa: [{ padrao: '`[^`]*\\$\\{', nome: 'crases com ${ }' }],
            mostra: 'Caderno custa R$ 12.5',
            dicas: [
              'Cada variável entra com `${nome}` dentro das crases.',
              'O texto todo fica entre crases: o produto entra como `${produto}` e o preço como `${preco}`, com ` custa R$ ` no meio.',
            ],
            resposta: ['const etiqueta = `${produto} custa R$ ${preco}`;', 'console.log(etiqueta);'],
          }),
        },
        {
          id: 'concat',
          nome: 'concat() e o operador +',
          resumo: 'Juntam textos. O `+` é o mais comum; o `concat()` faz o mesmo e aceita vários pedaços.',
          sintaxe: 'texto + outro\ntexto.concat(outro, maisUm)',
          retorno: 'Uma string nova com os textos juntos.',
          exemplos: [
            {
              codigo:
                "const nome = 'Ana';\nconsole.log('Olá, ' + nome + '!');\nconsole.log('Olá, '.concat(nome, '!'));",
              saida: 'Olá, Ana!\nOlá, Ana!',
            },
          ],
          treino: treino({
            enunciado: [
              'Junte `nome` e `sobrenome` com um espaço no meio, usando `+` ou `concat()`. Guarde em `completo` e mostre.',
            ],
            inicial: ["const nome = 'Bia';", "const sobrenome = 'Souza';"],
            esperados: { completo: 'Bia Souza' },
            usa: [{ padrao: '\\+|\\.concat\\s*\\(', nome: '+ ou concat()' }],
            mostra: 'Bia Souza',
            dicas: ["Não esqueça o espaço: `' '`.", "`const completo = nome + ' ' + sobrenome;`"],
            resposta: ["const completo = nome + ' ' + sobrenome;", 'console.log(completo);'],
          }),
        },
      ],
    },
    {
      titulo: 'Comparar e normalizar',
      metodos: [
        {
          id: 'localecompare',
          nome: 'localeCompare()',
          resumo:
            'Compara dois textos na ordem alfabética do idioma, respeitando acentos. Ideal para ordenar listas de nomes.',
          sintaxe: 'texto.localeCompare(outro)',
          retorno: 'Um número negativo se `texto` vem antes, positivo se vem depois e `0` se são iguais.',
          exemplos: [
            {
              codigo:
                "const nomes = ['Érica', 'Bruno', 'Ana'];\nnomes.sort((a, b) => a.localeCompare(b));\nconsole.log(nomes);\nconsole.log('a'.localeCompare('a'));",
              saida: "[ 'Ana', 'Bruno', 'Érica' ]\n0",
            },
          ],
          treino: treino({
            enunciado: [
              'Ordene os `alunos` em ordem alfabética com `sort()` e `localeCompare()`. Repare que `Ângela` precisa vir primeiro. Mostre a lista.',
            ],
            inicial: ["const alunos = ['Carlos', 'Ângela', 'Bruno'];"],
            esperados: { alunos: ['Ângela', 'Bruno', 'Carlos'] },
            usa: [metodo('localeCompare')],
            mostra: "[ 'Ângela', 'Bruno', 'Carlos' ]",
            dicas: [
              'Sem `localeCompare`, o `sort()` joga as letras acentuadas para o fim.',
              '`alunos.sort((a, b) => a.localeCompare(b));`',
            ],
            resposta: ['alunos.sort((a, b) => a.localeCompare(b));', 'console.log(alunos);'],
          }),
        },
        {
          id: 'normalize',
          nome: 'normalize()',
          resumo: "Com `'NFD'`, separa cada letra do seu acento. Junto com um `replace`, serve para remover acentos.",
          sintaxe: "texto.normalize('NFD')",
          retorno: 'Uma string nova, na forma pedida.',
          exemplos: [
            {
              codigo:
                "const texto = 'Ação é fácil';\nconst semAcento = texto.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');\nconsole.log(semAcento);",
              saida: 'Acao e facil',
            },
          ],
          treino: treino({
            enunciado: ['Remova os acentos do `titulo`. Guarde em `semAcento` e mostre.'],
            inicial: ["const titulo = 'Lição de Programação';"],
            esperados: { semAcento: 'Licao de Programacao' },
            usa: [metodo('normalize')],
            mostra: 'Licao de Programacao',
            dicas: [
              "Primeiro `normalize('NFD')` separa os acentos; depois um `replace` apaga eles.",
              "`titulo.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')`",
            ],
            resposta: [
              "const semAcento = titulo.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');",
              'console.log(semAcento);',
            ],
          }),
        },
      ],
    },
  ],
};
