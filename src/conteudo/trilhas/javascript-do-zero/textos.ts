import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const textos: Licao = {
  slug: 'textos',
  titulo: 'Trabalhando com textos',
  resumo: 'Juntar textos, template literals, length e toUpperCase.',
  conteudo: [
    {
      tipo: 'p',
      texto: 'Um texto (em programação, uma *string*) fica entre aspas. Dá para juntar textos com `+`:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('const nome = "Ana";', 'console.log("Olá, " + nome + "!");'),
      saida: 'Olá, Ana!',
    },
    {
      tipo: 'p',
      texto:
        'Há um jeito mais prático: o *template literal*, que usa crases em vez de aspas. Dentro dele, `${ }` encaixa qualquer valor no meio do texto:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('const nome = "Ana";', 'const idade = 25;', 'console.log(`${nome} tem ${idade} anos.`);'),
      saida: 'Ana tem 25 anos.',
    },
    { tipo: 'p', texto: 'Todo texto também carrega algumas ferramentas:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const frase = "javascript";',
        'console.log(frase.length);',
        'console.log(frase.toUpperCase());',
        'console.log(frase[0]);',
      ),
      saida: linhas('10', 'JAVASCRIPT', 'j'),
    },
    {
      tipo: 'p',
      texto:
        '`.length` conta os caracteres, `.toUpperCase()` devolve o texto em maiúsculas e `[0]` pega o primeiro caractere — em programação, a contagem começa no zero.',
    },
  ],
  exercicios: [
    {
      titulo: 'Mensagem com crases',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Com `nome` e `idade` já criados, monte a variável `mensagem` usando um template literal, para ela valer exatamente `Ana tem 25 anos.`. Depois, mostre-a.',
        },
      ],
      codigoInicial: linhas('const nome = "Ana";', 'const idade = 25;', ''),
      testes: [
        {
          descricao: 'A mensagem é “Ana tem 25 anos.”',
          codigo: js`verdadeiro(typeof mensagem === 'string', 'Crie a variável mensagem.');
igual(mensagem, 'Ana tem 25 anos.', 'mensagem')`,
        },
        {
          descricao: 'Usa crases e ${ }',
          codigo:
            "verdadeiro(codigoDoAluno.includes('${') && codigoDoAluno.includes('`'), 'Monte o texto com crases e ${ }, encaixando nome e idade.')",
        },
        {
          descricao: 'A mensagem foi mostrada',
          codigo: js`igual(saida[saida.length - 1], 'Ana tem 25 anos.', 'O último texto mostrado')`,
        },
      ],
      dicas: [
        'O texto vai entre crases, e cada variável entra assim: `${nome}`.',
        'O texto inteiro fica entre crases, com `${nome}` e `${idade}` encaixados nos lugares certos.',
      ],
      solucao: linhas(
        'const nome = "Ana";',
        'const idade = 25;',
        '',
        'const mensagem = `${nome} tem ${idade} anos.`;',
        'console.log(mensagem);',
      ),
    },
    {
      titulo: 'Juntando com o +',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Com `nome` já criado, monte `saudacao` juntando textos com o `+`, para ela valer `Olá, Bia!`. Depois, mostre-a.',
        },
      ],
      codigoInicial: linhas('const nome = "Bia";', ''),
      testes: [
        {
          descricao: 'saudacao vale “Olá, Bia!”',
          codigo: js`verdadeiro(typeof saudacao === 'string', 'Crie a variável saudacao.');
igual(saudacao, 'Olá, Bia!', 'saudacao')`,
        },
        {
          descricao: 'Usa o + e a variável nome',
          codigo: js`const linha = codigoDoAluno.split('\n').find((l) => /\bsaudacao\s*=/.test(l)) ?? '';
verdadeiro(
  linha.includes('+') && /\bnome\b/.test(linha),
  'Junte os pedaços com + e use a variável nome no meio.',
)`,
        },
        {
          descricao: 'A saudação foi mostrada',
          codigo: js`igual(saida[saida.length - 1], 'Olá, Bia!', 'O último texto mostrado')`,
        },
      ],
      dicas: [
        'São três pedaços: o texto `"Olá, "`, a variável `nome` e o texto `"!"`. O `+` liga um ao outro.',
        'Fica assim: `const saudacao = "Olá, " + nome + "!";`. Repare no espaço depois da vírgula.',
      ],
      solucao: linhas('const nome = "Bia";', '', 'const saudacao = "Olá, " + nome + "!";', 'console.log(saudacao);'),
    },
    {
      titulo: 'Quantas letras?',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `tamanho` com a quantidade de caracteres da constante `palavra` e mostre-a. Deixe o computador contar: não digite o número.',
        },
      ],
      codigoInicial: linhas('const palavra = "desenvolvimento";', ''),
      testes: [
        { descricao: 'tamanho vale 15', codigo: js`igual(tamanho, 15, 'tamanho')` },
        {
          descricao: 'O tamanho foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '15', 'O último valor mostrado')`,
        },
        {
          descricao: 'A contagem vem da própria palavra',
          codigo: js`verdadeiro(/palavra\s*\.length/.test(codigoDoAluno), 'Use palavra.length para o computador contar os caracteres.')`,
        },
      ],
      dicas: [
        'Todo texto tem um `.length`, que diz quantos caracteres ele tem.',
        'Assim: `const tamanho = palavra.length;`.',
      ],
      solucao: linhas(
        'const palavra = "desenvolvimento";',
        '',
        'const tamanho = palavra.length;',
        'console.log(tamanho);',
      ),
    },
    {
      titulo: 'Maiúsculas e inicial',
      enunciado: [
        {
          tipo: 'lista',
          itens: [
            'Crie `grito` com a `frase` toda em maiúsculas.',
            'Crie `inicial` com o primeiro caractere da `frase`.',
            'Mostre os dois, nesta ordem, cada um numa linha.',
          ],
        },
      ],
      codigoInicial: linhas('const frase = "cuidado com o degrau";', ''),
      testes: [
        { descricao: 'grito vale “CUIDADO COM O DEGRAU”', codigo: js`igual(grito, 'CUIDADO COM O DEGRAU', 'grito')` },
        { descricao: 'inicial vale “c”', codigo: js`igual(inicial, 'c', 'inicial')` },
        {
          descricao: 'Mostrou os dois, nesta ordem',
          codigo: js`igual(saida, ['CUIDADO COM O DEGRAU', 'c'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa as ferramentas do texto',
          codigo: js`verdadeiro(
  codigoDoAluno.includes('toUpperCase()') && /frase\s*\[\s*0\s*\]/.test(codigoDoAluno),
  'Use frase.toUpperCase() e frase[0], em vez de digitar os resultados.',
)`,
        },
      ],
      dicas: [
        'Maiúsculas: `frase.toUpperCase()`. Primeiro caractere: `frase[0]`, porque a contagem começa no zero.',
        'São duas constantes e dois `console.log`: `grito` primeiro, `inicial` depois.',
      ],
      solucao: linhas(
        'const frase = "cuidado com o degrau";',
        '',
        'const grito = frase.toUpperCase();',
        'const inicial = frase[0];',
        'console.log(grito);',
        'console.log(inicial);',
      ),
    },
    {
      titulo: 'A última letra da palavra',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `ultima` com a última letra de `palavra`, usando o tamanho do texto. Mostre o tamanho na primeira linha e a última letra na segunda.',
        },
      ],
      codigoInicial: linhas('const palavra = "estudar";', ''),
      testes: [
        { descricao: 'A última letra é r', codigo: js`igual(ultima, 'r', 'ultima')` },
        {
          descricao: 'Mostra tamanho e letra em linhas separadas',
          codigo: js`igual(saida, ['7', 'r'], 'O tamanho e a última letra')`,
        },
      ],
      dicas: ['A primeira posição é zero. A última posição é palavra.length - 1.'],
      solucao:
        'const palavra = "estudar";\nconst ultima = palavra[palavra.length - 1];\nconsole.log(palavra.length);\nconsole.log(ultima);',
    },
    {
      titulo: 'Consertando a interpolação',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'O aviso mostra os caracteres de `${curso}` em vez do nome do curso. Corrija `mensagem` usando um template literal e mostre `Curso: JavaScript`.',
        },
      ],
      codigoInicial: 'const curso = "JavaScript";\nconst mensagem = "Curso: ${curso}";\nconsole.log(mensagem);\n',
      testes: [
        {
          descricao: 'A variável contém o nome interpolado',
          codigo: js`igual(mensagem, 'Curso: JavaScript', 'mensagem')`,
        },
        {
          descricao: 'A saída não mostra o marcador literal',
          codigo: js`igual(saida, ['Curso: JavaScript'], 'O aviso')`,
        },
      ],
      dicas: ['A interpolação só acontece quando o texto fica entre crases, em vez de aspas comuns.'],
      solucao: 'const curso = "JavaScript";\nconst mensagem = `Curso: ${curso}`;\nconsole.log(mensagem);',
    },
  ],
};
