import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const escopo: Licao = {
  slug: 'escopo',
  titulo: 'Onde cada variável vale',
  resumo: 'Escopo de função e de bloco, e funções que lembram valores (closures).',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Uma variável só existe no lugar onde foi criada: esse lugar é o seu **escopo**. Dentro de uma função, ou de um bloco entre chaves, o que foi criado com `let` ou `const` não aparece do lado de fora.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function cumprimentar() {',
        '  const mensagem = "Olá!";',
        '  return mensagem;',
        '}',
        '',
        'console.log(cumprimentar());',
        'console.log(typeof mensagem);',
      ),
      saida: linhas('Olá!', 'undefined'),
    },
    {
      tipo: 'p',
      texto:
        '`typeof` de um nome que não existe dá `"undefined"` em vez de um erro, e por isso serve para espiar. O mesmo vale para um bloco:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let total = 0;',
        'const comBonus = true;',
        '',
        'if (comBonus) {',
        '  const bonus = 5;',
        '  total = total + bonus;',
        '}',
        '',
        'console.log(total);',
        'console.log(typeof bonus);',
      ),
      saida: linhas('5', 'undefined'),
    },
    {
      tipo: 'p',
      texto:
        'O contrário funciona: quem está **dentro** enxerga o que está **fora**. Uma função enxerga as variáveis do lugar onde foi criada.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const desconto = 10;',
        '',
        'function precoFinal(preco) {',
        '  return preco - desconto;',
        '}',
        '',
        'console.log(precoFinal(50));',
      ),
      saida: '40',
    },
    {
      tipo: 'p',
      texto:
        'Isso leva a uma ideia poderosa. Uma função criada **dentro** de outra continua enxergando as variáveis dela, mesmo depois que a de fora terminou. Isso se chama *closure*.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function criarSomador(base) {',
        '  return function (n) {',
        '    return base + n;',
        '  };',
        '}',
        '',
        'const somaDez = criarSomador(10);',
        'const somaCem = criarSomador(100);',
        '',
        'console.log(somaDez(5));',
        'console.log(somaCem(5));',
      ),
      saida: linhas('15', '105'),
    },
    {
      tipo: 'nota',
      texto:
        'Cada chamada de `criarSomador` guarda o seu próprio `base`: `somaDez` e `somaCem` não se misturam. Closures servem para criar funções "configuradas" e para guardar um estado que ninguém de fora consegue mexer, como um contador.',
    },
  ],
  exercicios: [
    {
      titulo: 'Contador e multiplicador',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções que **devolvem funções**:' },
        {
          tipo: 'lista',
          itens: [
            '`criarContador()` devolve uma função. Cada vez que ela é chamada, devolve o próximo número, começando em `1`. Dois contadores criados separadamente não se misturam.',
            '`criarMultiplicador(fator)` devolve uma função que multiplica o número recebido pelo `fator`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'function criarContador() {',
        '  // guarde a contagem numa variável e devolva uma função que a aumenta',
        '}',
        '',
        'function criarMultiplicador(fator) {',
        '  // devolva uma função que usa o fator',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'O contador conta 1, 2, 3 a cada chamada',
          codigo: js`const contar = criarContador();
igual([contar(), contar(), contar()], [1, 2, 3], 'Três chamadas seguidas')`,
        },
        {
          descricao: 'Dois contadores não se misturam',
          codigo: js`const a = criarContador();
const b = criarContador();
a();
a();
igual(b(), 1, 'A primeira chamada do segundo contador')`,
        },
        {
          descricao: 'criarMultiplicador(3) triplica',
          codigo: js`const triplo = criarMultiplicador(3);
igual(triplo(4), 12, 'triplo(4)')`,
        },
        {
          descricao: 'Cada multiplicador guarda o seu fator',
          codigo: js`const dobro = criarMultiplicador(2);
const triplo = criarMultiplicador(3);
igual([dobro(5), triplo(5)], [10, 15], 'dobro(5) e triplo(5)')`,
        },
      ],
      dicas: [
        'No contador, crie a variável `let contagem = 0;` **fora** da função devolvida, e dentro de `criarContador`.',
        'A função devolvida soma 1 em `contagem` e devolve o novo valor.',
        'No multiplicador, a função devolvida recebe `n` e devolve `n * fator`.',
      ],
      solucao: linhas(
        'function criarContador() {',
        '  let contagem = 0;',
        '  return function () {',
        '    contagem = contagem + 1;',
        '    return contagem;',
        '  };',
        '}',
        '',
        'function criarMultiplicador(fator) {',
        '  return function (n) {',
        '    return n * fator;',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'Espiando o escopo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `calcular` guarda `segredo` **dentro** dela. Depois de mostrar o resultado da função, mostre também o `typeof` de `segredo` aqui fora. O resultado esperado é uma saída de duas linhas: `43` e `undefined`.',
        },
      ],
      codigoInicial: linhas(
        'function calcular() {',
        '  const segredo = 42;',
        '  return segredo + 1;',
        '}',
        '',
        'console.log(calcular());',
        '',
        '// Mostre agora o tipo de segredo, aqui fora da função',
        '',
      ),
      testes: [
        {
          descricao: 'Mostra 43 e, depois, “undefined”',
          codigo: js`igual(saida, ['43', 'undefined'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa typeof para espiar o nome',
          codigo: js`verdadeiro(/typeof\s+segredo/.test(codigoDoAluno), 'Use typeof segredo para espiar sem causar erro.')`,
        },
      ],
      dicas: [
        'Mostrar o `segredo` direto daria erro, porque ele não existe fora da função.',
        'O `typeof` espia sem dar erro: `console.log(typeof segredo);`.',
      ],
      solucao: linhas(
        'function calcular() {',
        '  const segredo = 42;',
        '  return segredo + 1;',
        '}',
        '',
        'console.log(calcular());',
        'console.log(typeof segredo);',
      ),
    },
    {
      titulo: 'Saudação configurada',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva `criarSaudacao(saudacao)`, que devolve uma **função**. Essa função recebe um `nome` e devolve o texto `saudacao, nome!`. Por exemplo, `criarSaudacao("Oi")("Ana")` devolve `"Oi, Ana!"`.',
        },
      ],
      codigoInicial: linhas(
        'function criarSaudacao(saudacao) {',
        '  // devolva uma função que lembra a saudação',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve uma função',
          codigo: js`verdadeiro(typeof criarSaudacao('Oi') === 'function', 'criarSaudacao precisa devolver uma função.')`,
        },
        {
          descricao: 'A função monta a saudação com o nome',
          codigo: js`const oi = criarSaudacao('Oi');
igual(oi('Ana'), 'Oi, Ana!', "oi('Ana')")`,
        },
        {
          descricao: 'Cada saudação guarda a sua palavra',
          codigo: js`const oi = criarSaudacao('Oi');
const bomDia = criarSaudacao('Bom dia');
igual([oi('Bia'), bomDia('Bia')], ['Oi, Bia!', 'Bom dia, Bia!'], 'As duas saudações')`,
        },
      ],
      dicas: [
        'A função de fora recebe `saudacao`; a de dentro recebe `nome` e ainda enxerga `saudacao`.',
        'A função de fora devolve `function (nome) { ... }`. A de dentro monta o texto com `${saudacao}` e `${nome}`.',
      ],
      solucao: linhas(
        'function criarSaudacao(saudacao) {',
        '  return function (nome) {',
        '    return `${saudacao}, ${nome}!`;',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'Limite de tentativas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva `criarLimite(maximo)`, que devolve uma função `tentar`. Cada chamada de `tentar()` devolve `true` enquanto o total de chamadas não passar de `maximo`, e `false` depois disso. Com `criarLimite(2)`, as chamadas devolvem `true`, `true`, `false`, `false`.',
        },
      ],
      codigoInicial: linhas(
        'function criarLimite(maximo) {',
        '  // guarde quantas tentativas já foram feitas',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Com limite 2: true, true, false, false',
          codigo: js`const tentar = criarLimite(2);
igual([tentar(), tentar(), tentar(), tentar()], [true, true, false, false], 'Quatro chamadas com limite 2')`,
        },
        {
          descricao: 'Com limite 1, só a primeira vale',
          codigo: js`const tentar = criarLimite(1);
igual([tentar(), tentar()], [true, false], 'Duas chamadas com limite 1')`,
        },
        {
          descricao: 'Com limite 0, nenhuma tentativa vale',
          codigo: js`const tentar = criarLimite(0);
igual([tentar(), tentar()], [false, false], 'Duas chamadas com limite 0')`,
        },
        {
          descricao: 'Dois limites não se misturam',
          codigo: js`const a = criarLimite(1);
const b = criarLimite(1);
a();
a();
igual(b(), true, 'A primeira chamada do segundo limite')`,
        },
      ],
      dicas: [
        'Crie `let feitas = 0;` dentro de `criarLimite`, fora da função devolvida.',
        'A função devolvida soma 1 em `feitas` e devolve `feitas <= maximo`.',
      ],
      solucao: linhas(
        'function criarLimite(maximo) {',
        '  let feitas = 0;',
        '  return function () {',
        '    feitas = feitas + 1;',
        '    return feitas <= maximo;',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'Acumulador',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva `criarAcumulador()`, que devolve uma função. Cada chamada recebe um número, soma-o ao total guardado e devolve o **total até agora**. Por exemplo: `acum(5)` devolve `5`; depois, `acum(10)` devolve `15`.',
        },
      ],
      codigoInicial: linhas(
        'function criarAcumulador() {',
        '  // guarde o total e devolva uma função que o aumenta',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Acumula 5 e depois 10: 5 e 15',
          codigo: js`const acum = criarAcumulador();
igual([acum(5), acum(10)], [5, 15], 'acum(5) e acum(10)')`,
        },
        {
          descricao: 'Acumula números negativos e zero',
          codigo: js`const acum = criarAcumulador();
igual([acum(10), acum(-4), acum(0)], [10, 6, 6], 'Dez, menos quatro e zero')`,
        },
        {
          descricao: 'Dois acumuladores não se misturam',
          codigo: js`const a = criarAcumulador();
const b = criarAcumulador();
a(100);
igual(b(1), 1, 'A primeira chamada do segundo acumulador')`,
        },
      ],
      dicas: [
        'Crie `let total = 0;` dentro de `criarAcumulador`, fora da função devolvida.',
        'A função devolvida recebe `n`, faz `total = total + n;` e devolve `total`.',
      ],
      solucao: linhas(
        'function criarAcumulador() {',
        '  let total = 0;',
        '  return function (n) {',
        '    total = total + n;',
        '    return total;',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'O histórico protegido',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva `criarHistorico()`, que devolve um objeto com duas funções: `registrar(texto)`, que guarda um texto, e `todos()`, que devolve a lista dos textos registrados, na ordem. A lista guardada **só pode ser mudada pelo `registrar`**: quem receber a lista de `todos()` e mexer nela não deve alterar o histórico.',
        },
        {
          tipo: 'nota',
          texto:
            'Escreva as funções como setas dentro do objeto: `{ registrar: (texto) => { ... }, todos: () => ... }`. Para `todos` devolver uma **cópia**, use o spread.',
        },
      ],
      codigoInicial: linhas('function criarHistorico() {', '  // a lista fica escondida aqui dentro', '}', ''),
      testes: [
        {
          descricao: 'Guarda os textos na ordem em que foram registrados',
          codigo: js`const h = criarHistorico();
h.registrar('a');
h.registrar('b');
igual(h.todos(), ['a', 'b'], 'h.todos()')`,
        },
        {
          descricao: 'Um histórico novo começa vazio',
          codigo: js`const h = criarHistorico();
verdadeiro(typeof h.registrar === 'function', 'O objeto precisa ter a função registrar.');
igual(h.todos(), [], 'h.todos()')`,
        },
        {
          descricao: 'Dois históricos não se misturam',
          codigo: js`const a = criarHistorico();
const b = criarHistorico();
a.registrar('x');
igual(b.todos(), [], 'O histórico de b')`,
        },
        {
          descricao: 'Mexer na lista devolvida não altera o histórico',
          codigo: js`const h = criarHistorico();
h.registrar('a');
const lista = h.todos();
verdadeiro(Array.isArray(lista), 'todos() precisa devolver uma lista.');
lista.push('intruso');
igual(h.todos(), ['a'], 'h.todos() depois de mexer na cópia')`,
        },
      ],
      dicas: [
        'Crie `const itens = [];` dentro de `criarHistorico`. Só as duas funções do objeto enxergam essa lista.',
        '`registrar` faz `itens.push(texto)`. `todos` devolve `[...itens]`, uma cópia.',
      ],
      solucao: linhas(
        'function criarHistorico() {',
        '  const itens = [];',
        '  return {',
        '    registrar: (texto) => {',
        '      itens.push(texto);',
        '    },',
        '    todos: () => [...itens],',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'Gerador de etiquetas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `criarEtiquetador(prefixo)`, que devolve uma função. Cada chamada dessa função produz um texto com prefixo, hífen e um contador começando em 1, como `"PED-1"`. Cada etiquetador mantém seu contador separado.',
        },
      ],
      codigoInicial: 'function criarEtiquetador(prefixo) {\n  // mantenha um contador no escopo da função criada\n}\n',
      testes: [
        {
          descricao: 'As etiquetas avançam a cada chamada',
          codigo: js`const proxima = criarEtiquetador('PED'); igual(proxima(), 'PED-1', 'Primeira'); igual(proxima(), 'PED-2', 'Segunda')`,
        },
        {
          descricao: 'Cada gerador tem prefixo e memória próprios',
          codigo: js`const a = criarEtiquetador('A'); const b = criarEtiquetador('B'); igual(a(), 'A-1', 'A'); igual(b(), 'B-1', 'B'); igual(a(), 'A-2', 'A novamente')`,
        },
      ],
      dicas: ['O contador nasce na função externa. A função devolvida aumenta esse contador e monta a etiqueta.'],
      solucao:
        'function criarEtiquetador(prefixo) {\n  let contador = 0;\n  return () => {\n    contador++;\n    return `${prefixo}-${contador}`;\n  };\n}',
    },
    {
      titulo: 'Um interruptor com memória',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `criarInterruptor(inicial)`, que recebe um booleano e devolve uma função. Cada chamada inverte o estado e devolve o novo booleano. O estado deve ficar privado no escopo da função.',
        },
      ],
      codigoInicial: 'function criarInterruptor(inicial) {\n  // guarde o estado que deve alternar\n}\n',
      testes: [
        {
          descricao: 'Cada chamada inverte o estado anterior',
          codigo: js`const alternar = criarInterruptor(false); igual(alternar(), true, 'Ligou'); igual(alternar(), false, 'Desligou'); igual(alternar(), true, 'Ligou novamente')`,
        },
        {
          descricao: 'Interruptores não compartilham memória',
          codigo: js`const a = criarInterruptor(true); const b = criarInterruptor(false); igual(a(), false, 'A'); igual(b(), true, 'B'); igual(a(), true, 'A novamente')`,
        },
      ],
      dicas: ['Use uma variável let na função externa e o operador ! para inverter seu valor em cada chamada.'],
      solucao:
        'function criarInterruptor(inicial) {\n  let ligado = inicial;\n  return () => {\n    ligado = !ligado;\n    return ligado;\n  };\n}',
    },
  ],
};
