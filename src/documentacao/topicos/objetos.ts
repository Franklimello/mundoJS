import { metodo, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const objetos: TopicoDoc = {
  slug: 'objetos',
  titulo: 'Manipulação de objetos',
  resumo:
    'Os métodos e operadores de objeto mais usados em JavaScript: keys, values, entries, hasOwn, spread, freeze, desestruturação e mais.',
  introducao: [
    'Um *objeto* em JavaScript organiza dados em pares de **chave e valor** entre chaves `{ }`. É a estrutura principal para representar entidades como usuários, produtos, configurações e registros.',
    'JavaScript traz métodos prontos na classe `Object` para inspecionar, copiar e proteger objetos, além de operadores modernos como o encadeamento opcional `?.`, o spread `...` e a desestruturação.',
  ],
  secoes: [
    {
      titulo: 'Chaves, valores e entradas',
      descricao: 'Descubra quais propriedades existem e transforme objetos em listas para percorrer facilmente.',
      metodos: [
        {
          id: 'keys',
          nome: 'Object.keys()',
          resumo: 'Devolve um array contendo os nomes de todas as propriedades (as chaves) do objeto.',
          sintaxe: 'Object.keys(objeto)',
          retorno: 'Um array de strings com os nomes das chaves.',
          exemplos: [
            {
              codigo:
                "const livro = { titulo: 'O Hobbit', autor: 'Tolkien', ano: 1937 };\nconsole.log(Object.keys(livro));",
              saida: "[ 'titulo', 'autor', 'ano' ]",
            },
          ],
          treino: treino({
            enunciado: [
              'Pegue todas as chaves do objeto `carro` usando `Object.keys()`. Guarde a lista em `chaves` e mostre.',
            ],
            inicial: ["const carro = { marca: 'Fiat', modelo: 'Uno', ano: 2010 };"],
            esperados: { chaves: ['marca', 'modelo', 'ano'] },
            usa: [metodo('keys')],
            mostra: "[ 'marca', 'modelo', 'ano' ]",
            dicas: ['Passe o objeto dentro dos parênteses de `Object.keys()`.', '`const chaves = Object.keys(carro);`'],
            resposta: ['const chaves = Object.keys(carro);', 'console.log(chaves);'],
          }),
        },
        {
          id: 'values',
          nome: 'Object.values()',
          resumo: 'Devolve um array com todos os valores das propriedades do objeto.',
          sintaxe: 'Object.values(objeto)',
          retorno: 'Um array com os valores.',
          exemplos: [
            {
              codigo: 'const precos = { maca: 5, banana: 3, uva: 8 };\nconsole.log(Object.values(precos));',
              saida: '[ 5, 3, 8 ]',
            },
          ],
          treino: treino({
            enunciado: [
              'Pegue os valores do objeto `pontuacoes` usando `Object.values()`. Guarde em `listaValores` e mostre.',
            ],
            inicial: ['const pontuacoes = { etapa1: 100, etapa2: 150, etapa3: 200 };'],
            esperados: { listaValores: [100, 150, 200] },
            usa: [metodo('values')],
            mostra: '[ 100, 150, 200 ]',
            dicas: [
              'Funciona como o `keys()`, mas devolve o conteúdo de cada campo.',
              '`const listaValores = Object.values(pontuacoes);`',
            ],
            resposta: ['const listaValores = Object.values(pontuacoes);', 'console.log(listaValores);'],
          }),
        },
        {
          id: 'entries',
          nome: 'Object.entries()',
          resumo:
            'Devolve uma lista de pares `[chave, valor]`. Muito útil para percorrer com `for...of` ou filtrar propriedades com métodos de array.',
          sintaxe: 'Object.entries(objeto)',
          retorno: 'Um array de pares `[chave, valor]`.',
          exemplos: [
            {
              codigo: "const dados = { brasilia: 'DF', salvador: 'BA' };\nconsole.log(Object.entries(dados));",
              saida: "[ [ 'brasilia', 'DF' ], [ 'salvador', 'BA' ] ]",
            },
          ],
          treino: treino({
            enunciado: [
              'Obtenha os pares chave-valor do objeto `config` com `Object.entries()`. Guarde em `pares` e mostre.',
            ],
            inicial: ["const config = { tema: 'escuro', fonte: 16 };"],
            esperados: {
              pares: [
                ['tema', 'escuro'],
                ['fonte', 16],
              ],
            },
            usa: [metodo('entries')],
            mostra: "[ [ 'tema', 'escuro' ], [ 'fonte', 16 ] ]",
            dicas: [
              'Cada par vira um array de 2 posições: `[chave, valor]`.',
              '`const pares = Object.entries(config);`',
            ],
            resposta: ['const pares = Object.entries(config);', 'console.log(pares);'],
          }),
        },
        {
          id: 'fromentries',
          nome: 'Object.fromEntries()',
          resumo:
            'Faz o inverso de `Object.entries()`: recebe uma lista de pares `[chave, valor]` e reconstrói um objeto.',
          sintaxe: 'Object.fromEntries(listaDePares)',
          retorno: 'Um novo objeto.',
          exemplos: [
            {
              codigo:
                "const pares = [['nome', 'Ana'], ['idade', 25]];\nconst pessoa = Object.fromEntries(pares);\nconsole.log(pessoa);",
              saida: "{ nome: 'Ana', idade: 25 }",
            },
          ],
          treino: treino({
            enunciado: [
              'Converta a lista de `pares` de volta em um objeto usando `Object.fromEntries()`. Guarde em `usuario` e mostre.',
            ],
            inicial: ["const pares = [['login', 'leo'], ['ativo', true]];"],
            esperados: { usuario: { login: 'leo', ativo: true } },
            usa: [metodo('fromEntries')],
            mostra: "{ login: 'leo', ativo: true }",
            dicas: [
              'Passe a lista de pares para `Object.fromEntries(pares)`.',
              '`const usuario = Object.fromEntries(pares);`',
            ],
            resposta: ['const usuario = Object.fromEntries(pares);', 'console.log(usuario);'],
          }),
        },
      ],
    },
    {
      titulo: 'Verificar existência',
      descricao: 'Confirme com segurança se um campo existe no objeto.',
      metodos: [
        {
          id: 'hasown',
          nome: 'Object.hasOwn()',
          resumo:
            'A forma moderna e recomendada de conferir se uma propriedade pertence diretamente ao objeto, sem pegar herança de protótipo.',
          sintaxe: "Object.hasOwn(objeto, 'propriedade')",
          retorno: '`true` se a propriedade direta existir, senão `false`.',
          exemplos: [
            {
              codigo:
                "const user = { nome: 'Carlos' };\nconsole.log(Object.hasOwn(user, 'nome'));\nconsole.log(Object.hasOwn(user, 'idade'));",
              saida: 'true\nfalse',
            },
          ],
          treino: treino({
            enunciado: [
              "Confira se o objeto `produto` possui a propriedade `'estoque'` usando `Object.hasOwn()`. Guarde o resultado em `temEstoque` e mostre.",
            ],
            inicial: ["const produto = { id: 10, nome: 'Teclado', estoque: 15 };"],
            esperados: { temEstoque: true },
            usa: [metodo('hasOwn')],
            mostra: 'true',
            dicas: [
              "O nome da propriedade vai entre aspas como segundo argumento: `Object.hasOwn(produto, 'estoque')`.",
              "`const temEstoque = Object.hasOwn(produto, 'estoque');`",
            ],
            resposta: ["const temEstoque = Object.hasOwn(produto, 'estoque');", 'console.log(temEstoque);'],
          }),
        },
        {
          id: 'operador-in',
          nome: 'Operador in',
          resumo:
            'Verifica se a propriedade existe no objeto **ou** na cadeia de protótipos herdada dele (como `toString`).',
          sintaxe: "'propriedade' in objeto",
          retorno: '`true` ou `false`.',
          exemplos: [
            {
              codigo:
                "const animal = { tipo: 'Gato' };\nconsole.log('tipo' in animal);\nconsole.log('toString' in animal);\nconsole.log('idade' in animal);",
              saida: 'true\ntrue\nfalse',
            },
          ],
          cuidado:
            "O operador `in` retorna `true` para propriedades herdadas como `'toString'`. Se quiser testar apenas propriedades próprias do objeto, use `Object.hasOwn()`.",
          treino: treino({
            enunciado: [
              "Use o operador `in` para verificar se `'desconto'` existe no objeto `cupom`. Guarde o resultado booleano em `existe` e mostre.",
            ],
            inicial: ["const cupom = { codigo: 'PROMO10', desconto: 0.1 };"],
            esperados: { existe: true },
            usa: [{ padrao: '\\bin\\b', nome: 'operador in' }],
            mostra: 'true',
            dicas: ["A sintaxe é `'chave' in objeto`.", "`const existe = 'desconto' in cupom;`"],
            resposta: ["const existe = 'desconto' in cupom;", 'console.log(existe);'],
          }),
        },
      ],
    },
    {
      titulo: 'Copiar, mesclar e clonar',
      descricao: 'Combine múltiplos objetos ou crie cópias independentes.',
      metodos: [
        {
          id: 'spread',
          nome: 'Spread de objeto ({ ...obj })',
          resumo:
            'Cria um novo objeto copiando as propriedades de um ou mais objetos existentes. Permite sobrescrever valores facilmente de forma imutável.',
          sintaxe: 'const novo = { ...origem, chaveNova: valor }',
          retorno: 'Um novo objeto.',
          exemplos: [
            {
              codigo:
                "const base = { tema: 'claro', fonte: 14 };\nconst atual = { ...base, fonte: 18, som: true };\nconsole.log(atual);\nconsole.log(base);",
              saida: "{ tema: 'claro', fonte: 18, som: true }\n{ tema: 'claro', fonte: 14 }",
            },
          ],
          treino: treino({
            enunciado: [
              'Crie `perfilCompleto` copiando todas as propriedades de `usuario` com o operador spread `{ ...usuario }` e acrescentando `cidade: "Curitiba"`. Mostre no console.',
            ],
            inicial: ["const usuario = { nome: 'Julia', idade: 28 };"],
            esperados: { perfilCompleto: { nome: 'Julia', idade: 28, cidade: 'Curitiba' } },
            usa: [{ padrao: '\\.\\.\\.', nome: 'spread (...)' }],
            mostra: "{ nome: 'Julia', idade: 28, cidade: 'Curitiba' }",
            dicas: [
              'Abra chaves `{ }`, use `...usuario` e adicione a nova propriedade.',
              '`const perfilCompleto = { ...usuario, cidade: "Curitiba" };`',
            ],
            resposta: ['const perfilCompleto = { ...usuario, cidade: "Curitiba" };', 'console.log(perfilCompleto);'],
          }),
        },
        {
          id: 'assign',
          nome: 'Object.assign()',
          resumo:
            'Copia todas as propriedades de um ou mais objetos de origem para um objeto de destino. Modifica o objeto de destino.',
          sintaxe: 'Object.assign(destino, ...origens)',
          retorno: 'O objeto de destino atualizado.',
          exemplos: [
            {
              codigo: 'const alvo = { a: 1 };\nObject.assign(alvo, { b: 2 }, { c: 3 });\nconsole.log(alvo);',
              saida: '{ a: 1, b: 2, c: 3 }',
            },
          ],
          cuidado:
            '`Object.assign()` altera diretamente o primeiro argumento (`destino`). Se quiser gerar um objeto novo sem alterar os existentes, use `{}` como primeiro argumento: `Object.assign({}, a, b)`.',
          treino: treino({
            enunciado: [
              'Copie as opções de `extra` para dentro de `destino` usando `Object.assign()`. Mostre `destino` no console.',
            ],
            inicial: ["const destino = { cor: 'azul' };", "const extra = { tamanho: 'M', preco: 49.9 };"],
            esperados: { destino: { cor: 'azul', tamanho: 'M', preco: 49.9 } },
            usa: [metodo('assign')],
            mostra: "{ cor: 'azul', tamanho: 'M', preco: 49.9 }",
            dicas: ['`Object.assign(destino, extra);` atualiza `destino`.', 'Depois chame `console.log(destino);`.'],
            resposta: ['Object.assign(destino, extra);', 'console.log(destino);'],
          }),
        },
        {
          id: 'structuredclone',
          nome: 'structuredClone()',
          resumo:
            'Cria uma **cópia profunda** (deep clone) do objeto. Objetos e listas internas ganham referências totalmente independentes.',
          sintaxe: 'structuredClone(objeto)',
          retorno: 'Uma cópia profunda e isolada do objeto.',
          exemplos: [
            {
              codigo:
                "const original = { nome: 'Ana', notas: [10, 9] };\nconst clone = structuredClone(original);\nclone.notas.push(8);\nconsole.log(original.notas);\nconsole.log(clone.notas);",
              saida: '[ 10, 9 ]\n[ 10, 9, 8 ]',
            },
          ],
          treino: treino({
            enunciado: ['Faça uma cópia profunda de `dados` usando `structuredClone()`. Guarde em `copia` e mostre.'],
            inicial: ["const dados = { time: 'Águias', jogadores: ['Lucas', 'Mateus'] };"],
            esperados: { copia: { time: 'Águias', jogadores: ['Lucas', 'Mateus'] } },
            usa: [{ padrao: 'structuredClone\\s*\\(', nome: 'structuredClone()' }],
            mostra: "{ time: 'Águias', jogadores: [ 'Lucas', 'Mateus' ] }",
            dicas: ['`structuredClone` é uma função global nativa.', '`const copia = structuredClone(dados);`'],
            resposta: ['const copia = structuredClone(dados);', 'console.log(copia);'],
          }),
        },
      ],
    },
    {
      titulo: 'Imutabilidade e proteção',
      descricao: 'Previna alterações indesejadas em objetos compartilhados ou sensíveis.',
      metodos: [
        {
          id: 'freeze',
          nome: 'Object.freeze() e Object.isFrozen()',
          resumo:
            'Congela o objeto: impede adicionar novas propriedades, alterar valores existentes ou deletar propriedades. `Object.isFrozen()` confirma o estado.',
          sintaxe: 'Object.freeze(objeto)\nObject.isFrozen(objeto)',
          retorno: 'O próprio objeto congelado.',
          exemplos: [
            {
              codigo:
                'const status = Object.freeze({ ativo: true, versao: 1 });\nconsole.log(Object.isFrozen(status));\nconsole.log(status);',
              saida: 'true\n{ ativo: true, versao: 1 }',
            },
          ],
          cuidado:
            'O congelamento é raso (*shallow*). Objetos ou arrays aninhados dentro dele continuam podendo ser modificados se não forem congelados também.',
          treino: treino({
            enunciado: [
              'Congele o objeto `configuracao` com `Object.freeze()`. Guarde o resultado de `Object.isFrozen(configuracao)` na variável `congelado` e mostre.',
            ],
            inicial: ["const configuracao = { porta: 3000, host: 'localhost' };"],
            esperados: { congelado: true },
            usa: [metodo('freeze'), metodo('isFrozen')],
            mostra: 'true',
            dicas: [
              'Primeiro congele o objeto com `Object.freeze(configuracao);`.',
              'Depois guarde o teste: `const congelado = Object.isFrozen(configuracao);`.',
            ],
            resposta: [
              'Object.freeze(configuracao);',
              'const congelado = Object.isFrozen(configuracao);',
              'console.log(congelado);',
            ],
          }),
        },
        {
          id: 'seal',
          nome: 'Object.seal() e Object.isSealed()',
          resumo:
            'Sela o objeto: permite **alterar** valores das propriedades existentes, mas impede adicionar novas ou deletar as existentes.',
          sintaxe: 'Object.seal(objeto)\nObject.isSealed(objeto)',
          retorno: 'O próprio objeto selado.',
          exemplos: [
            {
              codigo:
                'const item = { preco: 50 };\nObject.seal(item);\nitem.preco = 60;\nconsole.log(item.preco);\nconsole.log(Object.isSealed(item));',
              saida: '60\ntrue',
            },
          ],
          treino: treino({
            enunciado: [
              'Sele o objeto `pontuacao` usando `Object.seal()`. Depois altere a propriedade `pontos` para `250` e mostre o objeto.',
            ],
            inicial: ["const pontuacao = { jogador: 'Leo', pontos: 200 };"],
            esperados: { pontuacao: { jogador: 'Leo', pontos: 250 } },
            usa: [metodo('seal')],
            mostra: "{ jogador: 'Leo', pontos: 250 }",
            dicas: [
              '`Object.seal(pontuacao);` impede novas propriedades, mas permite mudar as atuais.',
              '`pontuacao.pontos = 250;` e depois `console.log(pontuacao);`.',
            ],
            resposta: ['Object.seal(pontuacao);', 'pontuacao.pontos = 250;', 'console.log(pontuacao);'],
          }),
        },
      ],
    },
    {
      titulo: 'Acesso seguro e exclusão',
      descricao: 'Técnicas essenciais para ler propriedades aninhadas, remover campos e extrair variáveis.',
      metodos: [
        {
          id: 'optional-chaining',
          nome: 'Encadeamento opcional (?.)',
          resumo:
            'Lê propriedades aninhadas sem dar erro `TypeError` quando um nível intermediário for `null` ou `undefined`. Devolve `undefined` com segurança.',
          sintaxe: 'objeto?.propriedade?.subPropriedade',
          retorno: 'O valor da propriedade, ou `undefined`.',
          exemplos: [
            {
              codigo:
                "const cliente = { nome: 'Paula' };\nconsole.log(cliente?.endereco?.rua);\nconsole.log(cliente?.nome);",
              saida: 'undefined\nPaula',
            },
          ],
          treino: treino({
            enunciado: [
              "Acesse com segurança a cidade do `cliente` usando `cliente?.endereco?.cidade` com valor padrão `'Não informada'` (usando `??`). Guarde em `cidade` e mostre.",
            ],
            inicial: ["const cliente = { nome: 'Bruno' };"],
            esperados: { cidade: 'Não informada' },
            usa: [{ padrao: '\\?\\.', nome: 'encadeamento opcional (?.)' }],
            mostra: 'Não informada',
            dicas: [
              "Use o operador de coalescência nula `??` junto com `?.`: `cliente?.endereco?.cidade ?? 'Não informada'`.",
              "const cidade = cliente?.endereco?.cidade ?? 'Não informada';",
            ],
            resposta: ["const cidade = cliente?.endereco?.cidade ?? 'Não informada';", 'console.log(cidade);'],
          }),
        },
        {
          id: 'delete',
          nome: 'Operador delete',
          resumo: 'Remove uma propriedade de um objeto.',
          sintaxe: 'delete objeto.propriedade',
          retorno: '`true` se a propriedade foi removida com sucesso.',
          exemplos: [
            {
              codigo:
                "const usuario = { id: 1, senhaProvisoria: '123456', ativo: true };\ndelete usuario.senhaProvisoria;\nconsole.log(usuario);",
              saida: '{ id: 1, ativo: true }',
            },
          ],
          treino: treino({
            enunciado: [
              'Remova a propriedade `temporario` do objeto `sessao` usando o operador `delete`. Mostre o objeto `sessao` atualizado com `console.log`.',
            ],
            inicial: ["const sessao = { usuario: 'marcos', token: 'xyz', temporario: true };"],
            esperados: { sessao: { usuario: 'marcos', token: 'xyz' } },
            usa: [{ padrao: '\\bdelete\\b', nome: 'operador delete' }],
            mostra: "{ usuario: 'marcos', token: 'xyz' }",
            dicas: ['Use `delete sessao.temporario;`.', 'Depois mostre a variável `sessao`.'],
            resposta: ['delete sessao.temporario;', 'console.log(sessao);'],
          }),
        },
        {
          id: 'desestruturacao',
          nome: 'Desestruturação de objeto ({ })',
          resumo:
            'Extrai propriedades de um objeto diretamente para variáveis individuais, com suporte a renomeação e valores padrão.',
          sintaxe: "const { nome, idade, cargo = 'Junior' } = usuario",
          retorno: 'Cria as variáveis locais correspondentes.',
          exemplos: [
            {
              codigo:
                "const filme = { titulo: 'Matrix', lancamento: 1999 };\nconst { titulo, lancamento, genero = 'Ficção' } = filme;\nconsole.log(titulo);\nconsole.log(lancamento);\nconsole.log(genero);",
              saida: 'Matrix\n1999\nFicção',
            },
          ],
          treino: treino({
            enunciado: [
              'Desestruture as propriedades `cidade` e `pais` do objeto `viagem`. Mostre `cidade` no console.',
            ],
            inicial: ["const viagem = { cidade: 'Tóquio', pais: 'Japão', dias: 15 };"],
            esperados: { cidade: 'Tóquio', pais: 'Japão' },
            usa: [{ padrao: 'const\\s*\\{[^}]+\\}|let\\s*\\{[^}]+\\}', nome: 'desestruturação { }' }],
            mostra: 'Tóquio',
            dicas: ['Use a sintaxe `const { cidade, pais } = viagem;`.', 'Depois chame `console.log(cidade);`.'],
            resposta: ['const { cidade, pais } = viagem;', 'console.log(cidade);'],
          }),
        },
      ],
    },
  ],
};
