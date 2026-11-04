import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const lancarErros: Licao = {
  slug: 'lancar-erros',
  titulo: 'Avisando que algo está errado',
  resumo: 'throw new Error e a validação de valores.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Até agora quem lançava os erros era o JavaScript. Você também pode lançar os seus, com `throw new Error("mensagem")`. Serve para recusar um valor que não faz sentido **antes** que ele cause um problema lá na frente.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function porcentagem(valor, total) {',
        '  if (total <= 0) {',
        '    throw new Error("O total precisa ser maior que zero.");',
        '  }',
        '  return (valor / total) * 100;',
        '}',
        '',
        'console.log(porcentagem(1, 4));',
        '',
        'try {',
        '  porcentagem(1, 0);',
        '} catch (erro) {',
        '  console.log(erro.message);',
        '}',
      ),
      saida: linhas('25', 'O total precisa ser maior que zero.'),
    },
    {
      tipo: 'p',
      texto:
        'O `throw` **encerra a função na hora**, como um `return`: o que vem depois não roda. Quem chamou a função tem duas saídas: tratar o erro com `try/catch`, ou deixar que ele suba — e então o programa para, mostrando a mensagem.',
    },
    {
      tipo: 'p',
      texto:
        'Uma boa mensagem diz **o que aconteceu** e, se der, **o que fazer**. "Idade inválida: use um número de 0 a 130." ajuda muito mais do que "Erro".',
    },
    {
      tipo: 'p',
      texto: 'Para validar valores, é útil saber o tipo e se um número é inteiro. `Number.isInteger` responde:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'console.log(Number.isInteger(5));',
        'console.log(Number.isInteger(5.5));',
        'console.log(Number.isInteger("5"));',
      ),
      saida: linhas('true', 'false', 'false'),
    },
    {
      tipo: 'p',
      texto:
        'Todo erro tem um tipo, em `erro.name`. `Error` é o genérico; o JavaScript usa outros, como `TypeError` (usar um valor do jeito errado) e `SyntaxError`. Dá para conferir o tipo com `instanceof`:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'try {',
        '  const nada = null;',
        '  console.log(nada.nome);',
        '} catch (erro) {',
        '  console.log(erro.name);',
        '  console.log(erro instanceof TypeError);',
        '  console.log(erro instanceof Error);',
        '}',
      ),
      saida: linhas('TypeError', 'true', 'true'),
    },
    {
      tipo: 'nota',
      texto:
        'Lance sempre um objeto `Error` (`throw new Error("...")`), nunca um texto solto (`throw "deu ruim"`). Só o `Error` guarda o caminho até o problema, o que ajuda muito a achar o defeito.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Dividir e validar idade',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções que **lançam erros**:' },
        {
          tipo: 'lista',
          itens: [
            '`dividir(a, b)` devolve `a / b`. Se `b` for zero, lança um `Error` com a mensagem `"Não dá para dividir por zero."`.',
            '`validarIdade(idade)` devolve a própria idade se ela for um **número inteiro de 0 a 130**. Em qualquer outro caso, lança um `Error` com uma mensagem sua.',
          ],
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const a = 10;',
        'const b = 2;',
        'const idade = 25;',
        '',
        'function dividir(a, b) {',
        '  // recuse a divisão por zero com um erro',
        '}',
        '',
        'function validarIdade(idade) {',
        '  // devolva a idade, ou recuse o valor com um erro',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(dividir(a, b));',
        'console.log(validarIdade(idade));',
        '',
      ),
      testes: [
        { descricao: 'dividir(10, 2) devolve 5', codigo: js`igual(dividir(10, 2), 5, 'dividir(10, 2)')` },
        {
          descricao: 'dividir por zero lança “Não dá para dividir por zero.”',
          codigo: js`let erro = null;
try { dividir(1, 0); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'dividir(1, 0) deveria lançar um erro, mas devolveu normalmente.');
igual(erro.message, 'Não dá para dividir por zero.', 'A mensagem do erro')`,
        },
        {
          descricao: 'validarIdade devolve idades válidas, inclusive 0 e 130',
          codigo: js`igual(validarIdade(25), 25, 'validarIdade(25)');
igual(validarIdade(0), 0, 'validarIdade(0)');
igual(validarIdade(130), 130, 'validarIdade(130)')`,
        },
        {
          descricao: 'validarIdade recusa números fora de 0 a 130',
          codigo: js`for (const idade of [-1, 131]) {
  let erro = null;
  try { validarIdade(idade); } catch (e) { erro = e; }
  verdadeiro(erro instanceof Error, 'validarIdade(' + idade + ') deveria lançar um erro.');
}`,
        },
        {
          descricao: 'validarIdade recusa o que não é número inteiro',
          codigo: js`for (const idade of [1.5, '25', null, NaN]) {
  let erro = null;
  try { validarIdade(idade); } catch (e) { erro = e; }
  verdadeiro(erro instanceof Error, 'validarIdade(' + String(idade) + ') deveria lançar um erro.');
}`,
        },
        {
          descricao: 'O erro de validarIdade tem uma mensagem',
          codigo: js`let erro = null;
try { validarIdade(-5); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error && erro.message.trim().length > 0, 'Escreva uma mensagem no erro, dizendo o que está errado.')`,
        },
      ],
      dicas: [
        'Confira a condição com `if` e, quando ela indicar um problema, use `throw new Error("...")`.',
        'Em `validarIdade`, um valor é inválido se `!Number.isInteger(idade)`, ou se `idade < 0`, ou se `idade > 130`. Junte as três com `||`.',
      ],
      solucao: linhas(
        'function dividir(a, b) {',
        '  if (b === 0) {',
        '    throw new Error("Não dá para dividir por zero.");',
        '  }',
        '  return a / b;',
        '}',
        '',
        'function validarIdade(idade) {',
        '  if (!Number.isInteger(idade) || idade < 0 || idade > 130) {',
        '    throw new Error("Idade inválida: use um número inteiro de 0 a 130.");',
        '  }',
        '  return idade;',
        '}',
      ),
    },
    {
      titulo: 'Raiz quadrada segura',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `raiz(numero)`, que devolve a raiz quadrada do número, com `Math.sqrt`. Para número **negativo**, lance um `Error` com a mensagem `"Não existe raiz quadrada de número negativo."`. O zero tem raiz.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const numero = 9;',
        '',
        'function raiz(numero) {',
        '  // recuse os negativos com um erro',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(raiz(numero));',
        '',
      ),
      testes: [
        { descricao: 'raiz(9) devolve 3', codigo: js`igual(raiz(9), 3, 'raiz(9)')` },
        { descricao: 'raiz(0) devolve 0', codigo: js`igual(raiz(0), 0, 'raiz(0)')` },
        { descricao: 'raiz(2.25) devolve 1.5', codigo: js`igual(raiz(2.25), 1.5, 'raiz(2.25)')` },
        {
          descricao: 'raiz(-4) lança “Não existe raiz quadrada de número negativo.”',
          codigo: js`let erro = null;
try { raiz(-4); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'raiz(-4) deveria lançar um erro.');
igual(erro.message, 'Não existe raiz quadrada de número negativo.', 'A mensagem do erro')`,
        },
      ],
      dicas: ['Primeiro um `if (numero < 0)` com o `throw`.', 'Depois dele, `return Math.sqrt(numero);`.'],
      solucao: linhas(
        'function raiz(numero) {',
        '  if (numero < 0) {',
        '    throw new Error("Não existe raiz quadrada de número negativo.");',
        '  }',
        '  return Math.sqrt(numero);',
        '}',
      ),
    },
    {
      titulo: 'Cada erro com o seu tipo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `validarEmail(email)`. Ela devolve o e-mail sem espaços nas pontas se ele for um **texto** que contém `@`. Se o valor **não for um texto**, lança um `TypeError`. Se for um texto sem `@`, lança um `Error` comum. As duas com uma mensagem sua.',
        },
        {
          tipo: 'nota',
          texto:
            'Para lançar um tipo específico, escreva `throw new TypeError("mensagem")`. Para saber se um valor é um texto, use `typeof email === "string"`.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const email = "  ana@exemplo.com ";',
        '',
        'function validarEmail(email) {',
        '  // dois erros diferentes, e o valor válido no fim',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(validarEmail(email));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o e-mail sem espaços nas pontas',
          codigo: js`igual(validarEmail('  ana@exemplo.com '), 'ana@exemplo.com', "validarEmail('  ana@exemplo.com ')")`,
        },
        {
          descricao: 'Um valor que não é texto lança TypeError',
          codigo: js`for (const valor of [42, null, undefined]) {
  let erro = null;
  try { validarEmail(valor); } catch (e) { erro = e; }
  verdadeiro(erro !== null, 'validarEmail(' + String(valor) + ') deveria lançar um erro.');
  igual(erro.name, 'TypeError', 'O tipo do erro para ' + String(valor));
}`,
        },
        {
          descricao: 'Um texto sem @ lança um Error comum',
          codigo: js`let erro = null;
try { validarEmail('ana.exemplo.com'); } catch (e) { erro = e; }
verdadeiro(erro !== null, 'Um texto sem @ deveria lançar um erro.');
igual(erro.name, 'Error', 'O tipo do erro para um texto sem @')`,
        },
        {
          descricao: 'Os erros têm uma mensagem',
          codigo: js`let erro1 = null;
let erro2 = null;
try { validarEmail(7); } catch (e) { erro1 = e; }
try { validarEmail('x'); } catch (e) { erro2 = e; }
verdadeiro(erro1 !== null && erro1.message.trim() !== '', 'O erro de um valor sem ser texto precisa de uma mensagem.');
verdadeiro(erro2 !== null && erro2.message.trim() !== '', 'O erro de um texto sem @ precisa de uma mensagem.')`,
        },
      ],
      dicas: [
        'Primeiro confira o tipo: `if (typeof email !== "string")`, e lance o `TypeError`.',
        'Depois, `if (!email.includes("@"))`, e lance o `Error`. No fim, devolva `email.trim()`.',
      ],
      solucao: linhas(
        'function validarEmail(email) {',
        '  if (typeof email !== "string") {',
        '    throw new TypeError("O e-mail precisa ser um texto.");',
        '  }',
        '  if (!email.includes("@")) {',
        '    throw new Error("E-mail inválido: falta o @.");',
        '  }',
        '  return email.trim();',
        '}',
      ),
    },
    {
      titulo: 'Tentar de novo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `comTentativas(funcao, maximo)`. Ela chama a `funcao` e, se der erro, tenta de novo, até `maximo` chamadas no total. Devolve o resultado da primeira chamada que der certo. Se **todas** falharem, lança o erro da **última** tentativa.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'let chamadas = 0;',
        'const funcao = () => {',
        '  chamadas++;',
        '  if (chamadas < 2) throw new Error("Falha temporária");',
        '  return "ok";',
        '};',
        'const maximo = 3;',
        '',
        'function comTentativas(funcao, maximo) {',
        '  // um laço com try/catch',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(comTentativas(funcao, maximo));',
        '',
      ),
      testes: [
        {
          descricao: 'Se der certo de primeira, chama uma vez só',
          codigo: js`let chamadas = 0;
const resultado = comTentativas(() => { chamadas++; return 'ok'; }, 3);
igual(resultado, 'ok', 'O resultado');
igual(chamadas, 1, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Tenta de novo até dar certo',
          codigo: js`let chamadas = 0;
const instavel = () => {
  chamadas++;
  if (chamadas < 3) throw new Error('falha ' + chamadas);
  return 'ok';
};
igual(comTentativas(instavel, 5), 'ok', 'O resultado depois de falhar duas vezes');
igual(chamadas, 3, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Se todas falharem, lança o erro da última tentativa',
          codigo: js`let chamadas = 0;
const sempre = () => { chamadas++; throw new Error('falha ' + chamadas); };
let erro = null;
try { comTentativas(sempre, 2); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Depois de esgotar as tentativas, deveria lançar o erro.');
igual(erro.message, 'falha 2', 'A mensagem do último erro');
igual(chamadas, 2, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Não passa do máximo de tentativas',
          codigo: js`let chamadas = 0;
try { comTentativas(() => { chamadas++; throw new Error('x'); }, 4); } catch (e) {}
igual(chamadas, 4, 'Quantas vezes a função foi chamada')`,
        },
      ],
      dicas: [
        'Use um `for` que roda `maximo` vezes e guarde o último erro numa variável `let`.',
        'Dentro do laço: `try { return funcao(); } catch (erro) { ultimoErro = erro; }`. Depois do laço, `throw ultimoErro;`.',
      ],
      solucao: linhas(
        'function comTentativas(funcao, maximo) {',
        '  let ultimoErro;',
        '  for (let i = 0; i < maximo; i++) {',
        '    try {',
        '      return funcao();',
        '    } catch (erro) {',
        '      ultimoErro = erro;',
        '    }',
        '  }',
        '  throw ultimoErro;',
        '}',
      ),
    },
    {
      titulo: 'Uma mensagem que ajuda',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `buscarProduto(produtos, id)`, que devolve o produto com aquele `id`. Se ele não existir, lança um `Error` cuja mensagem diz **qual** produto faltou, no formato `Produto 7 não encontrado.` (com o número do id pedido).',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const produtos = [',
        '  { id: 1, nome: "Caneta" },',
        '  { id: 2, nome: "Caderno" },',
        '];',
        'const id = 2;',
        '',
        'function buscarProduto(produtos, id) {',
        '  // devolva o produto ou lance um erro com o id',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(buscarProduto(produtos, id));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o produto que existe',
          codigo: js`const produtos = [{ id: 1, nome: 'Caneta' }, { id: 2, nome: 'Caderno' }];
igual(buscarProduto(produtos, 2), { id: 2, nome: 'Caderno' }, 'buscarProduto(produtos, 2)')`,
        },
        {
          descricao: 'Lança “Produto 7 não encontrado.” quando falta',
          codigo: js`let erro = null;
try { buscarProduto([{ id: 1, nome: 'Caneta' }], 7); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Um id que não existe deveria lançar um erro.');
igual(erro.message, 'Produto 7 não encontrado.', 'A mensagem do erro')`,
        },
        {
          descricao: 'A mensagem usa o id pedido, qualquer que seja',
          codigo: js`let erro = null;
try { buscarProduto([], 42); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Uma lista vazia deveria lançar um erro.');
igual(erro.message, 'Produto 42 não encontrado.', 'A mensagem do erro')`,
        },
      ],
      dicas: [
        'Use `find` para procurar. Se o resultado for `undefined`, o produto não existe.',
        'A mensagem entra no `throw` com um template literal: `Produto ${id} não encontrado.`.',
      ],
      solucao: linhas(
        'function buscarProduto(produtos, id) {',
        '  const produto = produtos.find((item) => item.id === id);',
        '  if (produto === undefined) {',
        '    throw new Error(`Produto ${id} não encontrado.`);',
        '  }',
        '  return produto;',
        '}',
      ),
    },
    {
      titulo: 'O erro sobe do laço',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `converterTodos(textos)`, que converte cada texto da lista num número com `Number` e devolve a lista de números. Se algum texto **não for um número** (ou estiver vazio), lança um `Error` com a mensagem `"abc" não é um número.`, com o texto problemático entre aspas.',
        },
        {
          tipo: 'nota',
          texto:
            '`Number("abc")` dá `NaN` (não é um número), e `Number.isNaN(valor)` confere isso. Mas cuidado: `Number("")` dá `0`, e não `NaN`: o texto vazio precisa ser tratado à parte.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const textos = ["1", "2.5", "-3"];',
        '',
        'function converterTodos(textos) {',
        '  // converta um a um e recuse o que não for número',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(converterTodos(textos));',
        '',
      ),
      testes: [
        {
          descricao: 'Converte textos numéricos',
          codigo: js`igual(converterTodos(['1', '2.5', '-3']), [1, 2.5, -3], "converterTodos(['1', '2.5', '-3'])")`,
        },
        {
          descricao: 'Uma lista vazia devolve uma lista vazia',
          codigo: js`igual(converterTodos([]), [], 'converterTodos([])')`,
        },
        {
          descricao: 'Lança erro para um texto que não é número',
          codigo: js`let erro = null;
try { converterTodos(['1', 'abc', '3']); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Um texto que não é número deveria lançar um erro.');
igual(erro.message, '"abc" não é um número.', 'A mensagem do erro')`,
        },
        {
          descricao: 'Um texto vazio também é recusado',
          codigo: js`let erro = null;
try { converterTodos(['5', '']); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Um texto vazio deveria lançar um erro.');
igual(erro.message, '"" não é um número.', 'A mensagem do erro')`,
        },
      ],
      dicas: [
        'Percorra a lista; para cada texto, calcule `Number(texto)` e confira `texto.trim() === "" || Number.isNaN(numero)`.',
        'Para recusar, use `throw` com um `new Error(...)` cuja mensagem é um template literal: as aspas podem aparecer dentro dele, em volta de `${texto}`.',
      ],
      solucao: linhas(
        'function converterTodos(textos) {',
        '  const numeros = [];',
        '  for (const texto of textos) {',
        '    const numero = Number(texto);',
        '    if (texto.trim() === "" || Number.isNaN(numero)) {',
        '      throw new Error(`"${texto}" não é um número.`);',
        '    }',
        '    numeros.push(numero);',
        '  }',
        '  return numeros;',
        '}',
      ),
    },
    {
      titulo: 'Validar antes de vender',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `vender(estoque, quantidade)`. Quantidade menor ou igual a zero lança RangeError com mensagem `"Quantidade inválida."`. Quantidade maior que estoque lança Error com mensagem `"Estoque insuficiente."`. Caso contrário, devolva o estoque restante. Considere entradas inteiras e estoque não negativo.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const estoque = 8;',
        'const quantidade = 3;',
        '',
        'function vender(estoque, quantidade) {',
        '  // valide as duas regras antes de descontar',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(vender(estoque, quantidade));',
        '',
      ),
      testes: [
        {
          descricao: 'Desconta vendas permitidas',
          codigo: js`igual(vender(8, 3), 5, 'Venda permitida'); igual(vender(4, 4), 0, 'Estoque esgotado')`,
        },
        {
          descricao: 'Quantidade zero usa RangeError e a mensagem pedida',
          codigo: js`let erro; try { vender(5, 0); } catch (e) { erro = e; } verdadeiro(erro instanceof RangeError, 'Lance RangeError para a quantidade inválida.'); igual(erro.message, 'Quantidade inválida.', 'Mensagem')`,
        },
        {
          descricao: 'Não permite vender mais do que há em estoque',
          codigo: js`let erro; try { vender(2, 3); } catch (e) { erro = e; } verdadeiro(erro instanceof Error, 'Lance um erro quando faltar estoque.'); igual(erro.message, 'Estoque insuficiente.', 'Mensagem')`,
        },
      ],
      dicas: ['As validações vêm antes do return da subtração. Use throw new RangeError e throw new Error.'],
      solucao:
        'function vender(estoque, quantidade) {\n  if (quantidade <= 0) throw new RangeError("Quantidade inválida.");\n  if (quantidade > estoque) throw new Error("Estoque insuficiente.");\n  return estoque - quantidade;\n}',
    },
    {
      titulo: 'Só um tipo de erro pode ser ignorado',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `ignorarForaDaFaixa(acao)`. Execute a ação e devolva seu resultado. Capture RangeError e devolva null, mas relance qualquer outro erro, preservando o mesmo objeto de erro.',
        },
      ],
      codigoInicial: linhas(
        '// Dados de exemplo: altere os valores para experimentar.',
        'const acao = () => {',
        '  throw new RangeError("Fora da faixa");',
        '};',
        '',
        'function ignorarForaDaFaixa(acao) {',
        '  // trate somente o tipo de erro autorizado',
        '}',
        '',
        '// Rode para experimentar sua função com os dados acima.',
        'console.log(ignorarForaDaFaixa(acao));',
        '',
      ),
      testes: [
        {
          descricao: 'Preserva resultados normais e trata RangeError',
          codigo: js`igual(ignorarForaDaFaixa(() => 0), 0, 'Resultado zero'); igual(ignorarForaDaFaixa(() => { throw new RangeError('fora'); }), null, 'RangeError tratado')`,
        },
        {
          descricao: 'Outros erros sobem sem serem substituídos',
          codigo: js`const original = new TypeError('defeito'); let recebido; try { ignorarForaDaFaixa(() => { throw original; }); } catch (e) { recebido = e; } verdadeiro(recebido === original, 'Relance o mesmo erro que não é RangeError.')`,
        },
      ],
      dicas: ['No catch, use instanceof para reconhecer RangeError. Nos outros casos, faça throw erro.'],
      solucao:
        'function ignorarForaDaFaixa(acao) {\n  try {\n    return acao();\n  } catch (erro) {\n    if (erro instanceof RangeError) return null;\n    throw erro;\n  }\n}',
    },
  ],
};
