import { metodo, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const regex: TopicoDoc = {
  slug: 'regex',
  titulo: 'Expressões Regulares (RegExp)',
  resumo:
    'Guia prático e completo de expressões regulares em JavaScript: métodos de validação e busca, classes de caracteres, quantificadores, âncoras, grupos e flags.',
  introducao: [
    'Uma *expressão regular* (ou **RegExp**) é uma sequência de caracteres que define um padrão de busca textual. Elas são a ferramenta ideal para validar dados (como e-mails, CEPs e senhas), extrair informações de textos desestruturados e fazer substituições dinâmicas.',
    'Em JavaScript, você pode declarar uma regex de forma literal entre barras como `/padrao/flags` ou dinamicamente usando o construtor `new RegExp("padrao", "flags")`. Elas funcionam tanto em métodos próprios da classe `RegExp` (`test` e `exec`) quanto em métodos nativos de `String` (`match`, `matchAll`, `replace`, `search` e `split`).',
  ],
  secoes: [
    {
      titulo: 'Métodos essenciais de busca e validação',
      descricao: 'Os métodos nativos de RegExp e String para executar testes, buscas e extrações no dia a dia.',
      metodos: [
        {
          id: 'test',
          nome: 'RegExp.prototype.test()',
          resumo: 'Verifica se o padrão existe dentro de uma string e devolve um booleano (`true` ou `false`).',
          sintaxe: 'regex.test(texto)',
          retorno: '`true` se o padrão for encontrado no texto; caso contrário, `false`.',
          exemplos: [
            {
              codigo:
                "const temDigito = /\\d/.test('Código 42');\nconsole.log(temDigito);\nconsole.log(/\\d/.test('Sem números'));",
              saida: 'true\nfalse',
            },
          ],
          cuidado:
            'Ao usar a flag `g` (global), o método `test()` armazena o índice da última busca na propriedade `lastIndex`. Chamadas sucessivas com a mesma instância continuarão de onde pararam e podem alternar entre `true` e `false`!',
          treino: treino({
            enunciado: [
              'Valide se a variável `cep` contém exatamente 5 dígitos, um hífen opcional e mais 3 dígitos usando `test()`. Guarde o resultado booleano na variável `valido` e mostre.',
            ],
            inicial: ["const cep = '01310-100';"],
            esperados: { valido: true },
            usa: [metodo('test')],
            mostra: 'true',
            dicas: [
              'Monte a regex com início `^`, 5 dígitos `\\d{5}`, hífen opcional `-?`, 3 dígitos `\\d{3}` e fim `$`.',
              'Execute `const valido = /^\\d{5}-?\\d{3}$/.test(cep);`.',
            ],
            resposta: ['const valido = /^\\d{5}-?\\d{3}$/.test(cep);', 'console.log(valido);'],
          }),
        },
        {
          id: 'exec',
          nome: 'RegExp.prototype.exec()',
          resumo:
            'Executa uma busca detalhada e devolve um array com o texto casado, o índice e os grupos de captura, ou `null`.',
          sintaxe: 'regex.exec(texto)',
          retorno: 'Um array com a correspondência e propriedades extras (`index`, `input`, `groups`), ou `null`.',
          exemplos: [
            {
              codigo:
                "const regex = /item: (\\w+)/;\nconst resultado = regex.exec('Pedido item: caderno pronto');\nconsole.log(resultado[0]);\nconsole.log(resultado[1]);",
              saida: 'item: caderno\ncaderno',
            },
          ],
          cuidado:
            'Se a correspondência falhar, `exec()` devolve `null`. Tentar acessar posições como `resultado[0]` diretamente sem verificar antes causará um erro `TypeError`.',
          treino: treino({
            enunciado: [
              'Use `exec()` para extrair o valor numérico após `R$ ` no texto `precoTexto`. Guarde o texto completo capturado em `encontrado` e o valor numérico capturado pelo grupo em `valor` e mostre `valor`.',
            ],
            inicial: ["const precoTexto = 'Total: R$ 150';"],
            esperados: { encontrado: 'R$ 150', valor: '150' },
            usa: [metodo('exec')],
            mostra: '150',
            dicas: [
              'Use o padrão `/R\\$ (\\d+)/` com parênteses para capturar os dígitos.',
              'Acesse `resultado[0]` para a correspondência inteira e `resultado[1]` para o primeiro grupo capturado.',
            ],
            resposta: [
              'const resultado = /R\\$ (\\d+)/.exec(precoTexto);',
              'const encontrado = resultado[0];',
              'const valor = resultado[1];',
              'console.log(valor);',
            ],
          }),
        },
        {
          id: 'match',
          nome: 'String.prototype.match()',
          resumo:
            'Busca correspondências da regex em uma string. Sem a flag `g` traz detalhes do primeiro casamento; com `g` devolve todos os casamentos.',
          sintaxe: 'texto.match(regex)',
          retorno: 'Um array com os casamentos encontrados, ou `null` se nada for encontrado.',
          exemplos: [
            {
              codigo:
                "const texto = 'Ana comprou 3 maçãs e 12 bananas';\nconst numeros = texto.match(/\\d+/g);\nconsole.log(numeros);",
              saida: "[ '3', '12' ]",
            },
          ],
          cuidado:
            'Se nada for encontrado, `match()` devolve `null` em vez de um array vazio `[]`. Para evitar erros ao ler `.length` ou iterar, use um fallback como `texto.match(...) || []`.',
          treino: treino({
            enunciado: [
              'Extraia todas as hashtags (palavras iniciadas por `#`) do texto `post` usando `match()` com a flag global `g`. Guarde o array resultante em `tags` e mostre.',
            ],
            inicial: ["const post = 'Aprendendo #javascript e #regex no MundoJS';"],
            esperados: { tags: ['#javascript', '#regex'] },
            usa: [metodo('match')],
            mostra: "[ '#javascript', '#regex' ]",
            dicas: [
              'Use a regex `/#\\w+/g` para casar a hashtag e os caracteres alfanuméricos seguintes.',
              'Guarde em `const tags = post.match(/#\\w+/g);` e mostre com `console.log(tags);`.',
            ],
            resposta: ['const tags = post.match(/#\\w+/g);', 'console.log(tags);'],
          }),
        },
        {
          id: 'matchall',
          nome: 'String.prototype.matchAll()',
          resumo:
            'Devolve um iterador com todas as correspondências completas, incluindo índices e grupos de captura. Exige a flag global `g`.',
          sintaxe: 'texto.matchAll(regex)',
          retorno: 'Um iterador de arrays com detalhes de cada casamento.',
          exemplos: [
            {
              codigo:
                "const texto = 'ID: 10, ID: 25, ID: 80';\nconst pares = [...texto.matchAll(/ID: (\\d+)/g)].map((m) => m[1]);\nconsole.log(pares);",
              saida: "[ '10', '25', '80' ]",
            },
          ],
          cuidado:
            'O método `matchAll()` lança um `TypeError` imediato se a expressão regular não tiver a flag `g` (global) configurada.',
          treino: treino({
            enunciado: [
              'Use `matchAll()` com uma regex global para localizar todos os preços no formato `R$ valor` no texto `mensagem`. Extraia apenas os números capturados em um array `precos` e mostre.',
            ],
            inicial: ["const mensagem = 'Entrada: R$ 40, Bebida: R$ 15';"],
            esperados: { precos: ['40', '15'] },
            usa: [metodo('matchAll')],
            mostra: "[ '40', '15' ]",
            dicas: [
              'Converta o iterador em array com `[...mensagem.matchAll(/R\\$ (\\d+)/g)]`.',
              'Use `.map((m) => m[1])` para extrair o primeiro grupo de captura de cada resultado.',
            ],
            resposta: [
              'const precos = [...mensagem.matchAll(/R\\$ (\\d+)/g)].map((m) => m[1]);',
              'console.log(precos);',
            ],
          }),
        },
        {
          id: 'replace-regex',
          nome: 'String.prototype.replace() com RegExp',
          resumo:
            'Substitui trechos que combinam com a expressão regular por outro texto ou pelo valor retornado de uma função.',
          sintaxe: 'texto.replace(regex, novoTextoOuFuncao)',
          retorno: 'Uma nova string com as substituições realizadas.',
          exemplos: [
            {
              codigo:
                "const dataIso = '2026-11-06';\nconst br = dataIso.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, '$3/$2/$1');\nconsole.log(br);",
              saida: '06/11/2026',
            },
          ],
          cuidado:
            'Sem a flag `g`, o `replace()` substitui apenas a primeira ocorrência encontrada no texto. Use `/padrao/g` (ou `replaceAll`) para substituir todas.',
          treino: treino({
            enunciado: [
              'Use `replace()` com a flag `g` para ocultar todos os dígitos do CPF na variável `documento`, substituindo cada dígito por `*`. Guarde em `documentoOculto` e mostre.',
            ],
            inicial: ["const documento = 'CPF: 123.456.789-00';"],
            esperados: { documentoOculto: 'CPF: ***.***.***-**' },
            usa: [metodo('replace')],
            mostra: 'CPF: ***.***.***-**',
            dicas: [
              'Use o atalho de dígitos `\\d` com a flag global: `/\\d/g`.',
              'Passe `*` como segundo argumento do `replace()`.',
            ],
            resposta: ["const documentoOculto = documento.replace(/\\d/g, '*');", 'console.log(documentoOculto);'],
          }),
        },
        {
          id: 'search',
          nome: 'String.prototype.search()',
          resumo:
            'Procura a primeira ocorrência de uma regex na string e devolve a posição do índice numérico inicial.',
          sintaxe: 'texto.search(regex)',
          retorno: 'O índice da primeira correspondência, ou `-1` se não for encontrada.',
          exemplos: [
            {
              codigo:
                "const frase = 'A reunião será às 14h';\nconst posicao = frase.search(/\\d+/);\nconsole.log(posicao);",
              saida: '18',
            },
          ],
          cuidado:
            'O método `search()` ignora a flag `g` e sempre busca apenas a primeira ocorrência. Ele também converte qualquer argumento em RegExp.',
          treino: treino({
            enunciado: [
              'Descubra em qual posição começa o primeiro número no texto `codigo` usando `search()`. Guarde o índice na variável `indice` e mostre.',
            ],
            inicial: ["const codigo = 'PROD-9842';"],
            esperados: { indice: 5 },
            usa: [metodo('search')],
            mostra: '5',
            dicas: [
              'Passe a regex que procura dígitos `/\\d/` como argumento de `search()`.',
              'Guarde o retorno: `const indice = codigo.search(/\\d/);`.',
            ],
            resposta: ['const indice = codigo.search(/\\d/);', 'console.log(indice);'],
          }),
        },
        {
          id: 'split-regex',
          nome: 'String.prototype.split() com RegExp',
          resumo: 'Divide a string em um array de partes usando uma expressão regular como delimitador flexível.',
          sintaxe: 'texto.split(regex)',
          retorno: 'Um array de strings com as partes divididas.',
          exemplos: [
            {
              codigo:
                "const dados = 'maçã, banana ; uva ,laranja';\nconst itens = dados.split(/\\s*[,;]\\s*/);\nconsole.log(itens);",
              saida: "[ 'maçã', 'banana', 'uva', 'laranja' ]",
            },
          ],
          cuidado:
            'Se a regex do `split()` contiver grupos de captura com parênteses `()`, os separadores capturados também serão inseridos no array resultante!',
          treino: treino({
            enunciado: [
              'Divida a string `frase` em palavras separadas usando `split()` com uma regex que trate múltiplos espaços em branco (`/\\s+/`). Guarde a lista em `palavras` e mostre.',
            ],
            inicial: ["const frase = 'JavaScript    é     incrível';"],
            esperados: { palavras: ['JavaScript', 'é', 'incrível'] },
            usa: [metodo('split')],
            mostra: "[ 'JavaScript', 'é', 'incrível' ]",
            dicas: [
              'Use a classe de espaço em branco `\\s` combinada com o quantificador `+`: `/\\s+/`.',
              'Faça `const palavras = frase.split(/\\s+/);`.',
            ],
            resposta: ['const palavras = frase.split(/\\s+/);', 'console.log(palavras);'],
          }),
        },
      ],
    },
    {
      titulo: 'Classes de caracteres e atalhos',
      descricao: 'Metacaracteres que representam categorias inteiras de símbolos sem precisar listá-los um a um.',
      metodos: [
        {
          id: 'classes-basicas',
          nome: 'Classes básicas (\\d, \\w, \\s)',
          resumo:
            'Atalhos prontos para casar dígitos (`\\d`), caracteres alfanuméricos (`\\w`) e espaços (`\\s`), ou suas negações (`\\D`, `\\W`, `\\S`).',
          sintaxe: '/\\d/ (dígito), /\\w/ (palavra), /\\s/ (espaço)',
          retorno: 'Metacaracteres de padrão (não devolvem valor sozinhos).',
          exemplos: [
            {
              codigo:
                "const placa = 'ABC-1234';\nconst letras = placa.match(/\\D+/g);\nconst numeros = placa.match(/\\d+/g);\nconsole.log(letras[0]);\nconsole.log(numeros[0]);",
              saida: 'ABC-\n1234',
            },
          ],
          cuidado:
            'O atalho `\\w` equivale ao conjunto ASCII `[A-Za-z0-9_]`. Ele NÃO inclui caracteres acentuados (como `á`, `é`, `ç`) nem alfabetos não-latinos sem flags específicas.',
          treino: treino({
            enunciado: [
              'Use `replace()` com a classe de caracteres negada `\\D` (tudo que NÃO for dígito) e flag `g` para remover pontuações do telefone e manter apenas números em `apenasNumeros` e mostre.',
            ],
            inicial: ["const telefone = '(11) 98765-4321';"],
            esperados: { apenasNumeros: '11987654321' },
            usa: [metodo('replace'), { padrao: '\\\\D', nome: 'classe \\D' }],
            mostra: '11987654321',
            dicas: [
              'A classe `\\D` em maiúsculo casa qualquer caractere que não seja número.',
              'Faça `const apenasNumeros = telefone.replace(/\\D/g, "");`.',
            ],
            resposta: ["const apenasNumeros = telefone.replace(/\\D/g, '');", 'console.log(apenasNumeros);'],
          }),
        },
        {
          id: 'conjuntos-e-intervalos',
          nome: 'Conjuntos e intervalos ([abc], [a-z], [^...])',
          resumo:
            'Define uma lista de caracteres permitidos entre colchetes. Com hífen vira intervalo, e com `^` no início vira negação.',
          sintaxe: '/[abc]/ (um dos três), /[0-9]/ (intervalo), /[^0-9]/ (negação)',
          retorno: 'Metacaracteres de padrão (não devolvem valor sozinhos).',
          exemplos: [
            {
              codigo:
                "const texto = 'Nota final: B+';\nconst conceito = texto.match(/[ABCD][+-]?/);\nconsole.log(conceito[0]);",
              saida: 'B+',
            },
          ],
          cuidado:
            'Dentro de colchetes, metacaracteres como ponto (`.`) e asterisco (`*`) perdem o significado especial e viram caracteres literais, exceto o hífen (`-`) e o circunflexo (`^`) na primeira posição.',
          treino: treino({
            enunciado: [
              'Use `match()` com o conjunto de vogais `/[aeiou]/gi` para contar quantas vogais existem na string `palavra`. Guarde o número total em `totalVogais` e mostre.',
            ],
            inicial: ["const palavra = 'Oportunidade';"],
            esperados: { totalVogais: 6 },
            usa: [{ padrao: '\\[[^\\]]+\\]', nome: 'conjunto de caracteres [ ]' }],
            mostra: '6',
            dicas: [
              'Encontre as vogais com `palavra.match(/[aeiou]/gi)`.',
              'Calcule o tamanho da lista resultante com `.length`.',
            ],
            resposta: [
              'const vogais = palavra.match(/[aeiou]/gi);',
              'const totalVogais = vogais ? vogais.length : 0;',
              'console.log(totalVogais);',
            ],
          }),
        },
        {
          id: 'ponto',
          nome: 'Ponto curinga (.)',
          resumo: 'Casa qualquer caractere individual, exceto quebras de linha (`\\n` ou `\\r`).',
          sintaxe: '/c.rro/ (casa "carro", "corro", "c1rro")',
          retorno: 'Metacaractere de padrão (não devolve valor sozinho).',
          exemplos: [
            {
              codigo:
                "const nomes = ['gato', 'pato', 'rato', 'mato'];\nconst rimas = nomes.filter((n) => /.ato/.test(n));\nconsole.log(rimas);",
              saida: "[ 'gato', 'pato', 'rato', 'mato' ]",
            },
          ],
          cuidado:
            'Para buscar um ponto literal (como em extensões de arquivo `.js` ou endereços web), você precisa escapá-lo com barra invertida: `\\.`',
          treino: treino({
            enunciado: [
              'Verifique se o nome do arquivo fornecido termina com a extensão `.js` usando o ponto escapado `\\.` e a âncora de fim `$`. Guarde o booleano em `ehJavascript` e mostre.',
            ],
            inicial: ["const arquivo = 'servidor.js';"],
            esperados: { ehJavascript: true },
            usa: [metodo('test'), { padrao: '\\\\\\.', nome: 'ponto escapado \\.' }],
            mostra: 'true',
            dicas: [
              'Escreva a regex como `/\\.js$/` para escapar o ponto e ancorar no final da string.',
              'Teste com `const ehJavascript = /\\.js$/.test(arquivo);`.',
            ],
            resposta: ['const ehJavascript = /\\.js$/.test(arquivo);', 'console.log(ehJavascript);'],
          }),
        },
      ],
    },
    {
      titulo: 'Quantificadores e repetições',
      descricao: 'Controle quantas vezes um caractere, conjunto ou grupo pode se repetir no padrão.',
      metodos: [
        {
          id: 'quantificadores-basicos',
          nome: 'Quantificadores (*, +, ?)',
          resumo:
            'Definem quantas vezes o item anterior pode se repetir: `*` (0 ou mais), `+` (1 ou mais) e `?` (opcional: 0 ou 1).',
          sintaxe: '/a*/ (zero ou mais), /a+/ (um ou mais), /a?/ (opcional)',
          retorno: 'Metacaracteres de padrão (não devolvem valor sozinhos).',
          exemplos: [
            {
              codigo:
                "const protocolos = ['http', 'https'];\nconst padrao = /^https?$/;\nconsole.log(protocolos.every((p) => padrao.test(p)));",
              saida: 'true',
            },
          ],
          cuidado:
            'Por padrão, quantificadores em regex são gulosos (*greedy*): eles tentam casar a maior quantidade possível de texto. Adicione `?` após o quantificador (ex: `+?`) para torná-lo preguiçoso (*lazy*).',
          treino: treino({
            enunciado: [
              'Valide se o endereço começa com o protocolo `http://` ou `https://` usando o quantificador opcional `?` após a letra `s`. Guarde o resultado booleano em `urlValida` e mostre.',
            ],
            inicial: ["const site = 'https://mundojavascript.com.br';"],
            esperados: { urlValida: true },
            usa: [metodo('test'), { padrao: '\\?', nome: 'quantificador opcional ?' }],
            mostra: 'true',
            dicas: [
              'Use `/^https?:\\/\\//` para ancorar no início e aceitar o "s" opcional.',
              'Teste a variável com `const urlValida = /^https?:\\/\\//.test(site);`.',
            ],
            resposta: ['const urlValida = /^https?:\\/\\//.test(site);', 'console.log(urlValida);'],
          }),
        },
        {
          id: 'quantificadores-exatos',
          nome: 'Intervalos numéricos ({n}, {min,}, {min,max})',
          resumo: 'Especifica o número exato ou uma faixa de repetições permitidas para o caractere ou grupo anterior.',
          sintaxe: '/\\d{4}/ (exatos 4), /\\d{2,4}/ (entre 2 e 4), /\\d{3,}/ (no mínimo 3)',
          retorno: 'Metacaracteres de padrão (não devolvem valor sozinhos).',
          exemplos: [
            {
              codigo:
                "const anoValido = /^\\d{4}$/.test('2026');\nconst anoCurto = /^\\d{4}$/.test('26');\nconsole.log(anoValido);\nconsole.log(anoCurto);",
              saida: 'true\nfalse',
            },
          ],
          cuidado:
            'Nunca coloque espaços depois da vírgula dentro das chaves: `{2, 4}` vira busca por texto literal e falha como quantificador. Escreva sempre `{2,4}`.',
          treino: treino({
            enunciado: [
              'Valide se a senha fornecida tem entre 6 e 12 caracteres alfanuméricos usando o quantificador `{6,12}` com as âncoras `^` e `$`. Guarde o resultado em `senhaValida` e mostre.',
            ],
            inicial: ["const senha = 'segredo123';"],
            esperados: { senhaValida: true },
            usa: [metodo('test'), { padrao: '\\{\\d+,\\d+\\}', nome: 'intervalo numérico {min,max}' }],
            mostra: 'true',
            dicas: [
              'Combine início `^`, caractere alfanumérico `\\w`, intervalo `{6,12}` e fim `$`.',
              'Execute `const senhaValida = /^\\w{6,12}$/.test(senha);`.',
            ],
            resposta: ['const senhaValida = /^\\w{6,12}$/.test(senha);', 'console.log(senhaValida);'],
          }),
        },
      ],
    },
    {
      titulo: 'Âncoras e limites de posição',
      descricao: 'Posicione o padrão no início, no fim ou em fronteiras de palavras sem consumir caracteres.',
      metodos: [
        {
          id: 'ancoras',
          nome: 'Início e fim (^ e $)',
          resumo:
            'Âncoras de posição: `^` casa o início do texto e `$` casa o fim, garantindo que o padrão cubra a string inteira.',
          sintaxe: '/^inicio/ (começa com), /fim$/ (termina com), /^exato$/ (toda a string)',
          retorno: 'Âncoras de posição (não devolvem valor sozinhas).',
          exemplos: [
            {
              codigo: "console.log(/^\\d+$/.test('12345'));\nconsole.log(/^\\d+$/.test('123abc45'));",
              saida: 'true\nfalse',
            },
          ],
          cuidado:
            'Sem `^` e `$`, uma regex como `/\\d{3}/` retornará `true` para "abc12345def" pois ela procura o padrão em qualquer parte da string, e não na totalidade.',
          treino: treino({
            enunciado: [
              'Verifique se a variável `usuario` contém apenas letras minúsculas do início ao fim usando as âncoras `^` e `$`. Guarde o resultado booleano em `usuarioValido` e mostre.',
            ],
            inicial: ["const usuario = 'devjavascript';"],
            esperados: { usuarioValido: true },
            usa: [
              metodo('test'),
              { padrao: '\\^', nome: 'âncora de início ^' },
              { padrao: '\\$', nome: 'âncora de fim $' },
            ],
            mostra: 'true',
            dicas: [
              'Use a regex `/^[a-z]+$/` para aceitar uma ou mais letras minúsculas cobrindo todo o texto.',
              'Guarde o teste: `const usuarioValido = /^[a-z]+$/.test(usuario);`.',
            ],
            resposta: ['const usuarioValido = /^[a-z]+$/.test(usuario);', 'console.log(usuarioValido);'],
          }),
        },
        {
          id: 'borda-de-palavra',
          nome: 'Borda de palavra (\\b e \\B)',
          resumo:
            'Casa na fronteira entre um caractere de palavra (`\\w`) e um caractere que não é de palavra (espaços, pontuações ou início/fim).',
          sintaxe: '/\\bpalavra\\b/ (apenas a palavra exata)',
          retorno: 'Âncoras de posição (não devolvem valor sozinhas).',
          exemplos: [
            {
              codigo:
                "const frase = 'Aprenda js hoje no json e nodejs';\nconst casamentos = frase.match(/\\bjs\\b/g);\nconsole.log(casamentos);",
              saida: "[ 'js' ]",
            },
          ],
          cuidado:
            'O delimitador `\\b` depende de `\\w` (letras ASCII, números e sublinhado). Em palavras acentuadas (como "café"), há uma fronteira de palavra entre a letra e o acento se o caractere não for ASCII.',
          treino: treino({
            enunciado: [
              'Use `replace()` com a borda de palavra `\\b` para trocar apenas a palavra isolada `dia` por `noite` na frase `saudacao`, sem afetar outras palavras. Guarde o texto final em `novaSaudacao` e mostre.',
            ],
            inicial: ["const saudacao = 'Bom dia a todos, bom dia!';"],
            esperados: { novaSaudacao: 'Bom noite a todos, bom noite!' },
            usa: [metodo('replace'), { padrao: '\\\\b', nome: 'borda de palavra \\b' }],
            mostra: 'Bom noite a todos, bom noite!',
            dicas: [
              'Use a regex `/\\bdia\\b/g` com a flag global para substituir todas as ocorrências isoladas.',
              'Faça `const novaSaudacao = saudacao.replace(/\\bdia\\b/g, "noite");`.',
            ],
            resposta: ["const novaSaudacao = saudacao.replace(/\\bdia\\b/g, 'noite');", 'console.log(novaSaudacao);'],
          }),
        },
      ],
    },
    {
      titulo: 'Grupos, alternância e flags',
      descricao: 'Estruturação avançada com subexpressões, operadores lógicos e modificadores de execução.',
      metodos: [
        {
          id: 'grupos-e-alternancia',
          nome: 'Grupos e alternância (( ) e |)',
          resumo:
            'Agrupa subexpressões entre parênteses para aplicar quantificadores ou extrair trechos, e usa `|` como operador OU.',
          sintaxe: '/(segunda|terca|quarta)/ (alternância), /(\\d{2})\\/(\\d{2})/ (grupos)',
          retorno: 'Sintaxe de agrupamento e operador condicional.',
          exemplos: [
            {
              codigo:
                "const arquivos = ['foto.png', 'dados.csv', 'icone.jpg'];\nconst imagens = arquivos.filter((arq) => /\\.(png|jpg|gif)$/.test(arq));\nconsole.log(imagens);",
              saida: "[ 'foto.png', 'icone.jpg' ]",
            },
          ],
          cuidado:
            'Parênteses normais `( )` criam grupos de captura que armazenam os trechos na memória. Se precisar agrupar apenas para lógica sem capturar, use grupos não-capturantes: `(?:padrao)`.',
          treino: treino({
            enunciado: [
              'Valide se o nome do arquivo fornecido é uma imagem (`jpg`, `jpeg` ou `png`) no fim da string usando alternância `|` e parênteses. Guarde o resultado booleano em `ehImagem` e mostre.',
            ],
            inicial: ["const foto = 'banner.jpeg';"],
            esperados: { ehImagem: true },
            usa: [metodo('test'), { padrao: '\\|', nome: 'operador de alternância |' }],
            mostra: 'true',
            dicas: [
              'Use a regex `/\\.(jpg|jpeg|png)$/i` com a flag `i` para não diferenciar maiúsculas.',
              'Teste com `const ehImagem = /\\.(jpg|jpeg|png)$/i.test(foto);`.',
            ],
            resposta: ['const ehImagem = /\\.(jpg|jpeg|png)$/i.test(foto);', 'console.log(ehImagem);'],
          }),
        },
        {
          id: 'grupos-nomeados',
          nome: 'Grupos nomeados (?<nome>)',
          resumo:
            'Atribui nomes descritivos aos grupos de captura, permitindo acessá-los diretamente pela propriedade `.groups[nome]`.',
          sintaxe: '/(?<ano>\\d{4})-(?<mes>\\d{2})-(?<dia>\\d{2})/',
          retorno: 'Objeto `groups` preenchido no resultado de `exec()` ou `match()`.',
          exemplos: [
            {
              codigo:
                "const regex = /(?<codigo>[A-Z]{3})-(?<numero>\\d{4})/;\nconst { groups } = regex.exec('Voo: GOL-1234');\nconsole.log(groups.codigo);\nconsole.log(groups.numero);",
              saida: 'GOL\n1234',
            },
          ],
          cuidado:
            'Se a regex não encontrar correspondência, o resultado será `null` e tentar ler `.groups` causará erro. Use desestruturação segura com fallback: `const { groups } = regex.exec(...) ?? {};`',
          treino: treino({
            enunciado: [
              'Extraia o código de área `ddd` e o número `numero` do telefone usando os grupos nomeados `(?<ddd>\\d{2})` e `(?<numero>\\d{8,9})` com `match()`. Guarde os valores nas variáveis `ddd` e `numero` e mostre o `ddd`.',
            ],
            inicial: ["const contato = '(11) 988887777';"],
            esperados: { ddd: '11', numero: '988887777' },
            usa: [metodo('match'), { padrao: '\\?<[a-zA-Z]+>', nome: 'grupo nomeado (?<nome>)' }],
            mostra: '11',
            dicas: [
              'Escreva o padrão como `/\\((?<ddd>\\d{2})\\)\\s*(?<numero>\\d{8,9})/`.',
              'Acesse os grupos com `resultado?.groups?.ddd` e `resultado?.groups?.numero`.',
            ],
            resposta: [
              'const resultado = contato.match(/\\((?<ddd>\\d{2})\\)\\s*(?<numero>\\d{8,9})/);',
              'const ddd = resultado?.groups?.ddd;',
              'const numero = resultado?.groups?.numero;',
              'console.log(ddd);',
            ],
          }),
        },
        {
          id: 'flags',
          nome: 'Modificadores (flags g, i, m, s, u)',
          resumo:
            'Letras adicionadas ao fim da expressão que alteram seu comportamento: global (`g`), sem diferenciar maiúsculas (`i`), multilinha (`m`), ponto casa tudo (`s`) e unicode (`u`).',
          sintaxe: '/padrao/gims ou new RegExp("padrao", "gi")',
          retorno: 'Modificadores de compilação da regex.',
          exemplos: [
            {
              codigo:
                "const texto = 'JavaScript e javascript e JAVASCRIPT';\nconst matches = texto.match(/javascript/gi);\nconsole.log(matches.length);",
              saida: '3',
            },
          ],
          cuidado:
            'A flag `g` faz os métodos `test()` e `exec()` manterem estado interno (`lastIndex`). Para validações simples em formulários, evite a flag `g` para não gerar falsos negativos intercalados.',
          treino: treino({
            enunciado: [
              'Conte quantas vezes a sigla `js` aparece no texto `comentario` sem diferenciar maiúsculas de minúsculas, usando `match()` com as flags `g` e `i`. Guarde a quantidade em `contagem` e mostre.',
            ],
            inicial: ["const comentario = 'Adoro JS! js é muito flexível e Js é rápido.';"],
            esperados: { contagem: 3 },
            usa: [metodo('match'), { padrao: '/[a-zA-Z0-9_]*[gi]{2,}', nome: 'flags combinadas' }],
            mostra: '3',
            dicas: [
              'Combine a busca por `js` com as flags global e case-insensitive: `/js/gi`.',
              'Calcule a quantidade de itens encontrados com `.length`.',
            ],
            resposta: [
              'const ocorrencias = comentario.match(/js/gi);',
              'const contagem = ocorrencias ? ocorrencias.length : 0;',
              'console.log(contagem);',
            ],
          }),
        },
      ],
    },
  ],
};
