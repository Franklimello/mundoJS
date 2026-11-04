import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const tryCatch: Licao = {
  slug: 'try-catch',
  titulo: 'Quando algo dá errado',
  resumo: 'try, catch e finally.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Nem tudo sai como o planejado: um texto chega no formato errado, um valor que deveria existir não existe. Quando isso acontece, o JavaScript **lança um erro** e o programa para ali. Com `try` e `catch`, você tenta uma coisa arriscada e decide o que fazer se ela falhar.',
    },
    {
      tipo: 'p',
      texto:
        'Para treinar, vamos usar o `JSON.parse`. JSON é um texto com jeito de objeto, muito usado para trocar dados entre sistemas, e `JSON.parse` transforma esse texto num objeto de verdade — ou lança um erro, se o texto estiver errado.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(JSON.parse(\'{"nome": "Ana", "idade": 25}\'));'),
      saida: "{ nome: 'Ana', idade: 25 }",
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'try {',
        '  const dados = JSON.parse("isto não é JSON");',
        '  console.log(dados);',
        '} catch (erro) {',
        '  console.log("Deu problema:", erro.name);',
        '}',
        '',
        'console.log("O programa continua.");',
      ),
      saida: linhas('Deu problema: SyntaxError', 'O programa continua.'),
    },
    {
      tipo: 'p',
      texto:
        'O que está dentro do `try` roda normalmente. Se uma linha lançar um erro, o JavaScript **pula o resto do `try`** e vai direto para o `catch`, que recebe o erro (aqui chamado de `erro`): `erro.name` é o tipo dele e `erro.message`, a explicação. Depois, o programa segue. Sem o `try/catch`, esse erro derrubaria tudo.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'try {',
        '  console.log("1: antes");',
        '  JSON.parse("{");',
        '  console.log("2: depois (esta linha nunca roda)");',
        '} catch (erro) {',
        '  console.log("3: no catch");',
        '}',
      ),
      saida: linhas('1: antes', '3: no catch'),
    },
    {
      tipo: 'p',
      texto:
        'O `finally` é opcional e roda **sempre**, tenha dado erro ou não — até quando há um `return` no meio. Serve para o que precisa acontecer de qualquer jeito.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function abrir(texto) {',
        '  try {',
        '    return JSON.parse(texto);',
        '  } catch (erro) {',
        '    return "inválido";',
        '  } finally {',
        '    console.log("conferi:", texto);',
        '  }',
        '}',
        '',
        'console.log(abrir("[1, 2]"));',
        'console.log(abrir("{"));',
      ),
      saida: linhas('conferi: [1, 2]', '[ 1, 2 ]', 'conferi: {', 'inválido'),
    },
    {
      tipo: 'nota',
      texto:
        'O `catch` não serve para esconder erros. Um `catch` vazio faz o problema sumir sem ninguém saber. Use-o quando você sabe **o que fazer** se der errado: devolver um valor de reserva, avisar a pessoa, tentar de novo.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'JSON e nomes',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções, as duas com `try` e `catch`:' },
        {
          tipo: 'lista',
          itens: [
            '`lerJson(texto)` devolve o objeto que o texto JSON descreve, ou `null` se o texto for inválido.',
            '`nomeEmMaiusculas(pessoa)` devolve o `nome` da pessoa em maiúsculas. Se a pessoa não tiver nome (ou for `null`), devolve `"ANÔNIMO"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const texto = \'{"nome":"Ana","idade":25}\';',
        'const pessoa = { nome: "ana" };',
        '',
        'function lerJson(texto) {',
        '',
        '}',
        '',
        'function nomeEmMaiusculas(pessoa) {',
        '',
        '}',
        '',
        'console.log(lerJson(texto));',
        'console.log(nomeEmMaiusculas(pessoa));',
        '',
      ),
      testes: [
        {
          descricao: 'lerJson converte um texto JSON válido',
          codigo: js`igual(lerJson('{"nome":"Ana","idade":25}'), { nome: 'Ana', idade: 25 }, 'lerJson de um objeto')`,
        },
        {
          descricao: 'lerJson converte uma lista JSON',
          codigo: js`igual(lerJson('[1, 2]'), [1, 2], "lerJson('[1, 2]')")`,
        },
        {
          descricao: 'lerJson devolve null para um texto qualquer',
          codigo: js`igual(lerJson('isto não é json'), null, "lerJson('isto não é json')")`,
        },
        {
          descricao: 'lerJson devolve null para um JSON incompleto',
          codigo: js`igual(lerJson('{'), null, "lerJson('{')")`,
        },
        {
          descricao: 'nomeEmMaiusculas deixa o nome em maiúsculas',
          codigo: js`igual(nomeEmMaiusculas({ nome: 'ana' }), 'ANA', "nomeEmMaiusculas({ nome: 'ana' })")`,
        },
        {
          descricao: 'nomeEmMaiusculas devolve “ANÔNIMO” quando falta o nome',
          codigo: js`igual(nomeEmMaiusculas({}), 'ANÔNIMO', 'nomeEmMaiusculas({})')`,
        },
        {
          descricao: 'nomeEmMaiusculas devolve “ANÔNIMO” para null',
          codigo: js`igual(nomeEmMaiusculas(null), 'ANÔNIMO', 'nomeEmMaiusculas(null)')`,
        },
        {
          descricao: 'Usa try e catch',
          codigo: js`verdadeiro(/\btry\b/.test(codigoDoAluno) && /\bcatch\b/.test(codigoDoAluno), 'Resolva com try e catch.')`,
        },
      ],
      dicas: [
        'Ponha a linha que pode falhar dentro do `try`, e o valor de reserva dentro do `catch`.',
        'Em `nomeEmMaiusculas`, `pessoa.nome.toUpperCase()` lança um erro quando `nome` não existe — é esse erro que o `catch` vai pegar.',
      ],
      solucao: linhas(
        'function lerJson(texto) {',
        '  try {',
        '    return JSON.parse(texto);',
        '  } catch (erro) {',
        '    return null;',
        '  }',
        '}',
        '',
        'function nomeEmMaiusculas(pessoa) {',
        '  try {',
        '    return pessoa.nome.toUpperCase();',
        '  } catch (erro) {',
        '    return "ANÔNIMO";',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Qual foi o tipo do erro?',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `tipoDoErro(funcao)`, que chama a `funcao` recebida e devolve o **nome do tipo** do erro que ela lançar (`erro.name`), como `"TypeError"` ou `"SyntaxError"`. Se a função não lançar nada, devolve `"nenhum"`.',
        },
      ],
      codigoInicial: linhas(
        'const funcao = () => {',
        '  throw new TypeError("Falha de exemplo");',
        '};',
        '',
        'function tipoDoErro(funcao) {',
        '',
        '}',
        '',
        'console.log(tipoDoErro(funcao));',
        '',
      ),
      testes: [
        {
          descricao: 'Reconhece um TypeError',
          codigo: js`igual(tipoDoErro(() => { const nada = null; return nada.nome; }), 'TypeError', 'Ler uma propriedade de null')`,
        },
        {
          descricao: 'Reconhece um SyntaxError',
          codigo: js`igual(tipoDoErro(() => JSON.parse('{')), 'SyntaxError', "JSON.parse('{')")`,
        },
        {
          descricao: 'Reconhece o Error comum',
          codigo: js`igual(tipoDoErro(() => { throw new Error('ops'); }), 'Error', 'Um throw new Error')`,
        },
        {
          descricao: 'Sem erro, devolve “nenhum”',
          codigo: js`igual(tipoDoErro(() => 5), 'nenhum', 'Uma função que não falha')`,
        },
      ],
      dicas: [
        'Chame `funcao()` dentro do `try`; no `catch`, devolva `erro.name`.',
        'Se a chamada no `try` não der erro, o `catch` não roda: depois do `try/catch`, devolva `"nenhum"`.',
      ],
      solucao: linhas(
        'function tipoDoErro(funcao) {',
        '  try {',
        '    funcao();',
        '  } catch (erro) {',
        '    return erro.name;',
        '  }',
        '  return "nenhum";',
        '}',
      ),
    },
    {
      titulo: 'Valor de reserva',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `comReserva(funcao, reserva)`, que devolve o resultado de `funcao()`. Se ela lançar um erro, devolve o valor de `reserva`. Por exemplo, `comReserva(() => JSON.parse("{"), null)` devolve `null`.',
        },
      ],
      codigoInicial: linhas(
        'const funcao = () => {',
        '  throw new Error("Serviço indisponível");',
        '};',
        'const reserva = "Valor de reserva";',
        '',
        'function comReserva(funcao, reserva) {',
        '',
        '}',
        '',
        'console.log(comReserva(funcao, reserva));',
        '',
      ),
      testes: [
        {
          descricao: 'Sem erro, devolve o resultado da função',
          codigo: js`igual(comReserva(() => 5, 0), 5, 'comReserva(() => 5, 0)')`,
        },
        {
          descricao: 'Com erro, devolve a reserva',
          codigo: js`igual(comReserva(() => { throw new Error('ops'); }, 'plano B'), 'plano B', 'Uma função que falha')`,
        },
        {
          descricao: 'A reserva pode ser null',
          codigo: js`igual(comReserva(() => JSON.parse('{'), null), null, "comReserva(() => JSON.parse('{'), null)")`,
        },
        {
          descricao: 'A reserva pode ser zero, e vale mesmo assim',
          codigo: js`igual(comReserva(() => { throw new Error('x'); }, 0), 0, 'A reserva 0')`,
        },
        {
          descricao: 'Sem erro, um resultado “vazio” não vira reserva',
          codigo: js`igual(comReserva(() => '', 'reserva'), '', 'Um texto vazio é um resultado válido')`,
        },
      ],
      dicas: [
        'O resultado normal vai com `return funcao();` dentro do `try`.',
        'O `catch` devolve `reserva`. Não use `||`: um resultado como `0` ou `""` é válido e não pode ser trocado.',
      ],
      solucao: linhas(
        'function comReserva(funcao, reserva) {',
        '  try {',
        '    return funcao();',
        '  } catch (erro) {',
        '    return reserva;',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Quantos JSON são válidos',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `contarJson(textos)`, que tenta converter **cada** texto da lista com `JSON.parse` e devolve um objeto `{ validos, invalidos }` com a contagem dos que funcionaram e dos que deram erro. Um erro num texto **não pode** interromper os outros. Por exemplo, `["[1]", "{", "2", "x"]` dá `{ validos: 2, invalidos: 2 }`.',
        },
      ],
      codigoInicial: linhas(
        'const textos = ["[1]", "{", "2", "x"];',
        '',
        'function contarJson(textos) {',
        '',
        '}',
        '',
        'console.log(contarJson(textos));',
        '',
      ),
      testes: [
        {
          descricao: 'contarJson(["[1]", "{", "2", "x"]) devolve { validos: 2, invalidos: 2 }',
          codigo: js`igual(contarJson(['[1]', '{', '2', 'x']), { validos: 2, invalidos: 2 }, 'contarJson com dois válidos e dois inválidos')`,
        },
        {
          descricao: 'Todos válidos',
          codigo: js`igual(contarJson(['{}', '[]', 'true']), { validos: 3, invalidos: 0 }, 'contarJson com três válidos')`,
        },
        {
          descricao: 'Todos inválidos',
          codigo: js`igual(contarJson(['{', 'abc']), { validos: 0, invalidos: 2 }, 'contarJson com dois inválidos')`,
        },
        {
          descricao: 'Uma lista vazia dá zeros',
          codigo: js`igual(contarJson([]), { validos: 0, invalidos: 0 }, 'contarJson([])')`,
        },
        {
          descricao: 'Um erro no começo não impede de ler o resto',
          codigo: js`igual(contarJson(['{', '1', '2', '3']), { validos: 3, invalidos: 1 }, 'Um inválido na frente')`,
        },
      ],
      dicas: [
        'Crie dois contadores e percorra a lista com `for...of`.',
        'O `try/catch` fica **dentro** do laço: assim, o erro de um texto só pula para o `catch` daquela volta.',
      ],
      solucao: linhas(
        'function contarJson(textos) {',
        '  let validos = 0;',
        '  let invalidos = 0;',
        '  for (const texto of textos) {',
        '    try {',
        '      JSON.parse(texto);',
        '      validos = validos + 1;',
        '    } catch (erro) {',
        '      invalidos = invalidos + 1;',
        '    }',
        '  }',
        '  return { validos, invalidos };',
        '}',
      ),
    },
    {
      titulo: 'O finally sempre roda',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `usarERecolher(acao, recolher)`. Ela chama `acao()` e devolve o resultado; se `acao` lançar um erro, devolve `null`. Em qualquer dos dois casos, a função `recolher()` precisa ser chamada **exatamente uma vez**, depois da ação. Use o `finally`.',
        },
      ],
      codigoInicial: linhas(
        'const acao = () => "Trabalho concluído";',
        'const recolher = () => console.log("Recurso recolhido");',
        '',
        'function usarERecolher(acao, recolher) {',
        '',
        '}',
        '',
        'console.log(usarERecolher(acao, recolher));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o resultado da ação e chama recolher uma vez',
          codigo: js`let chamadas = 0;
const resultado = usarERecolher(() => 'ok', () => { chamadas++; });
igual(resultado, 'ok', 'O resultado da ação');
igual(chamadas, 1, 'Quantas vezes recolher foi chamada')`,
        },
        {
          descricao: 'Se a ação falha, devolve null e chama recolher uma vez',
          codigo: js`let chamadas = 0;
const resultado = usarERecolher(() => { throw new Error('ops'); }, () => { chamadas++; });
igual(resultado, null, 'O resultado quando a ação falha');
igual(chamadas, 1, 'Quantas vezes recolher foi chamada')`,
        },
        {
          descricao: 'recolher só roda depois da ação',
          codigo: js`const ordem = [];
usarERecolher(() => { ordem.push('acao'); return 1; }, () => { ordem.push('recolher'); });
igual(ordem, ['acao', 'recolher'], 'A ordem das chamadas')`,
        },
        {
          descricao: 'Usa finally',
          codigo: js`verdadeiro(/finally\s*[{]/.test(codigoDoAluno), 'Resolva com um bloco finally.')`,
        },
      ],
      dicas: [
        'O `finally` vai depois do `catch`, e roda com ou sem erro.',
        'Dentro dele, chame `recolher();`. O `return` do `try` e o do `catch` continuam valendo.',
      ],
      solucao: linhas(
        'function usarERecolher(acao, recolher) {',
        '  try {',
        '    return acao();',
        '  } catch (erro) {',
        '    return null;',
        '  } finally {',
        '    recolher();',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Quantos itens vieram no JSON?',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `quantosItensJson(texto)`, que tenta ler o JSON e devolve o tamanho quando o resultado é uma lista. Para JSON inválido ou um valor que não seja lista, devolva 0.',
        },
        {
          tipo: 'nota',
          texto:
            '`Array.isArray(valor)` devolve true quando valor é uma lista, permitindo distingui-la de objetos, números e null.',
        },
      ],
      codigoInicial: linhas(
        'const texto = "[1, 2, 3]";',
        '',
        'function quantosItensJson(texto) {',
        '',
        '}',
        '',
        'console.log(quantosItensJson(texto));',
        '',
      ),
      testes: [
        {
          descricao: 'Conta os itens de listas válidas',
          codigo: js`igual(quantosItensJson('[1, 2, 3]'), 3, 'Três itens'); igual(quantosItensJson('[]'), 0, 'Lista vazia')`,
        },
        {
          descricao: 'JSON inválido e outros tipos não derrubam a função',
          codigo: js`igual(quantosItensJson('quebrado'), 0, 'Inválido'); igual(quantosItensJson('null'), 0, 'Null'); igual(quantosItensJson('{"itens": 2}'), 0, 'Objeto')`,
        },
      ],
      dicas: ['Use JSON.parse dentro do try. Confira Array.isArray antes de acessar o tamanho como resultado.'],
      solucao:
        'function quantosItensJson(texto) {\n  try {\n    const valor = JSON.parse(texto);\n    return Array.isArray(valor) ? valor.length : 0;\n  } catch {\n    return 0;\n  }\n}',
    },
    {
      titulo: 'Resultado ou mensagem de erro',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `tentarExecutar(acao)`. Se a função recebida funcionar, devolva `{ ok: true, valor }`. Se ela lançar um Error, devolva `{ ok: false, erro: mensagem }`, usando a mensagem original. A ação é síncrona.',
        },
      ],
      codigoInicial: linhas(
        'const acao = () => 7;',
        '',
        'function tentarExecutar(acao) {',
        '',
        '}',
        '',
        'console.log(tentarExecutar(acao));',
        '',
      ),
      testes: [
        {
          descricao: 'Preserva resultados válidos, inclusive zero',
          codigo: js`igual(tentarExecutar(() => 7), { ok: true, valor: 7 }, 'Sucesso'); igual(tentarExecutar(() => 0), { ok: true, valor: 0 }, 'Zero')`,
        },
        {
          descricao: 'Usa a mensagem da ação que falhou',
          codigo: js`igual(tentarExecutar(() => { throw new Error('não encontrado'); }), { ok: false, erro: 'não encontrado' }, 'Falha capturada')`,
        },
      ],
      dicas: ['Chame acao() dentro do try e use erro.message no catch.'],
      solucao:
        'function tentarExecutar(acao) {\n  try {\n    return { ok: true, valor: acao() };\n  } catch (erro) {\n    return { ok: false, erro: erro.message };\n  }\n}',
    },
  ],
};
