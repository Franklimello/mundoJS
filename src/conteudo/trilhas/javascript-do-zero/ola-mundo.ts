import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const olaMundo: Licao = {
  slug: 'ola-mundo',
  titulo: 'Mostrando algo na tela',
  resumo: 'Seu primeiro comando: console.log.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Um programa é uma lista de instruções que o computador segue de cima para baixo. A instrução mais simples é mostrar uma mensagem — em JavaScript, isso se faz com `console.log`.',
    },
    { tipo: 'codigo', codigo: 'console.log("Olá, mundo!");', saida: 'Olá, mundo!' },
    {
      tipo: 'p',
      texto:
        'O que vai entre os parênteses é o que será mostrado. Um texto precisa ficar entre aspas (`"assim"` ou `\'assim\'`); sem elas, o JavaScript acha que é o nome de outra coisa. O `;` no fim marca onde a instrução termina.',
    },
    { tipo: 'p', texto: 'Cada `console.log` mostra uma linha nova:' },
    {
      tipo: 'codigo',
      codigo: linhas('console.log("Primeira linha");', 'console.log("Segunda linha");'),
      saida: linhas('Primeira linha', 'Segunda linha'),
    },
    {
      tipo: 'p',
      texto:
        'Um mesmo `console.log` aceita **vários valores**, separados por vírgula. Ele mostra todos na mesma linha, com um espaço entre eles. Repare que números não levam aspas:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log("Idade:", 25);', 'console.log("Ana", "tem", 25, "anos");'),
      saida: linhas('Idade: 25', 'Ana tem 25 anos'),
    },
    {
      tipo: 'nota',
      texto:
        'O resultado aparece no painel **Saída**, logo abaixo do editor. Para rodar, clique em **Rodar** ou aperte Ctrl + Enter.',
    },
  ],
  exercicios: [
    {
      titulo: 'Duas linhas',
      explicacaoAudio:
        'Pense no programa como uma sequência de pedidos ao computador. Cada console ponto log mostra uma nova linha. A primeira mensagem tem um texto exato; na segunda, você escolhe uma frase sobre seu objetivo. Leia a saída para conferir a ordem das duas mensagens.',
      enunciado: [
        { tipo: 'p', texto: 'Mostre duas mensagens, uma por linha, usando `console.log`.' },
        {
          tipo: 'lista',
          itens: ['Primeira linha: `Olá, mundo!`.', 'Segunda linha: uma frase sua sobre o que quer aprender.'],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'A primeira linha é “Olá, mundo!”',
          codigo: js`verdadeiro(saida.length > 0, 'Seu programa ainda não mostrou a primeira mensagem. Use console.log para escrever uma linha.');
igual(saida[0], 'Olá, mundo!', 'A primeira linha')`,
        },
        {
          descricao: 'Existe uma segunda linha com uma frase',
          codigo: js`verdadeiro(saida.length >= 2 && saida[1].trim().length > 0, 'Faltou a segunda linha: use outro console.log.')`,
        },
      ],
      dicas: [
        'Cada linha começa com `console.log(` e termina com `);`.',
        'Confira se escreveu `Olá, mundo!` exatamente assim, com o acento e o ponto de exclamação.',
      ],
      solucao: linhas('console.log("Olá, mundo!");', 'console.log("Quero aprender JavaScript.");'),
    },
    {
      titulo: 'O número e a frase',
      enunciado: [
        { tipo: 'p', texto: 'Mostre dois valores, um por linha, usando `console.log`.' },
        {
          tipo: 'lista',
          itens: ['Primeiro, o número `2026`, sem aspas.', 'Depois, o texto `Bem-vindo!`, entre aspas.'],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Mostra 2026 e, depois, “Bem-vindo!”',
          codigo: js`igual(saida, ['2026', 'Bem-vindo!'], 'As linhas mostradas')`,
        },
        {
          descricao: 'O número 2026 foi escrito sem aspas',
          codigo: js`verdadeiro(saida.length > 0, 'Seu programa ainda não mostrou o número. Use console.log para mostrar 2026.');
igual(saida[0], '2026', 'A primeira linha');
verdadeiro(!/["']2026["']/.test(codigoDoAluno), 'O número não leva aspas: escreva 2026 direto.')`,
        },
      ],
      dicas: [
        'São dois `console.log`: um com o número e outro com o texto.',
        'O número se escreve direto: `console.log(2026);`. O texto leva aspas: `console.log("Bem-vindo!");`.',
      ],
      solucao: linhas('console.log(2026);', 'console.log("Bem-vindo!");'),
    },
    {
      titulo: 'A escadinha',
      enunciado: [
        { tipo: 'p', texto: 'Mostre uma escada de asteriscos com exatamente três linhas.' },
        { tipo: 'lista', itens: ['Primeira linha: `*`.', 'Segunda linha: `**`.', 'Terceira linha: `***`.'] },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Mostra as três linhas da escadinha',
          codigo: js`igual(saida, ['*', '**', '***'], 'As linhas mostradas')`,
        },
      ],
      dicas: [
        'Três linhas, então três `console.log`.',
        'Os asteriscos são texto, então ficam entre aspas: `console.log("*");`.',
      ],
      solucao: linhas('console.log("*");', 'console.log("**");', 'console.log("***");'),
    },
    {
      titulo: 'Valores numa linha só',
      enunciado: [
        { tipo: 'p', texto: 'Mostre `Olá 2026 Ana` em uma única linha.' },
        {
          tipo: 'lista',
          itens: [
            'Use apenas um `console.log`, com três valores separados por vírgula.',
            '`Olá` e `Ana` são textos. `2026` deve ser um número.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Mostra “Olá 2026 Ana” numa linha só',
          codigo: js`igual(saida, ['Olá 2026 Ana'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa um único console.log, com os valores separados por vírgula',
          codigo: js`verdadeiro(
  (codigoDoAluno.match(/console\.log/g) ?? []).length === 1 && /console\.log\([^)]*,[^)]*\)/.test(codigoDoAluno),
  'Use um só console.log, com os valores separados por vírgula.',
)`,
        },
      ],
      dicas: [
        'Os valores ficam separados por vírgula, dentro dos parênteses.',
        'Assim: `console.log("Olá", 2026, "Ana");`. Repare que o número fica sem aspas.',
      ],
      solucao: 'console.log("Olá", 2026, "Ana");',
    },
    {
      titulo: 'Três avisos na ordem',
      enunciado: [
        { tipo: 'p', texto: 'Corrija o código para mostrar três mensagens nesta ordem:' },
        { tipo: 'lista', itens: ['`Início`.', '`Processando`.', '`Fim`.', 'Use um `console.log` para cada linha.'] },
      ],
      codigoInicial: 'console.log("Começo");\nconsole.log("Fim");\n',
      testes: [
        {
          descricao: 'Os três avisos aparecem na ordem pedida',
          codigo: js`igual(saida, ['Início', 'Processando', 'Fim'], 'A sequência de avisos')`,
        },
        {
          descricao: 'O aviso do meio ocupa a segunda linha',
          codigo: js`igual(saida[1], 'Processando', 'A segunda linha')`,
        },
      ],
      dicas: ['Troque a primeira mensagem e acrescente o aviso que falta antes de Fim.'],
      solucao: 'console.log("Início");\nconsole.log("Processando");\nconsole.log("Fim");',
    },
    {
      titulo: 'Uma etiqueta de produto',
      enunciado: [
        { tipo: 'p', texto: 'Mostre uma etiqueta com exatamente três linhas.' },
        {
          tipo: 'lista',
          itens: [
            '`Produto: Caderno`.',
            '`Preço: 12`.',
            '`Quantidade: 2`.',
            'Em cada `console.log`, separe o rótulo e o valor com vírgula. Escreva `12` e `2` como números.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'A etiqueta tem rótulos e valores corretos',
          codigo: js`igual(saida, ['Produto: Caderno', 'Preço: 12', 'Quantidade: 2'], 'A etiqueta')`,
        },
        {
          descricao: 'Os dois valores numéricos são passados como números',
          codigo: js`verdadeiro(/console\.log\(\s*["']Preço:["']\s*,\s*12\s*\)/.test(codigoDoAluno) && /console\.log\(\s*["']Quantidade:["']\s*,\s*2\s*\)/.test(codigoDoAluno), 'Passe 12 e 2 sem aspas, separados do rótulo por vírgula.')`,
        },
      ],
      dicas: ['Um rótulo é texto e leva aspas. O segundo valor de cada comando fica depois de uma vírgula.'],
      solucao: 'console.log("Produto:", "Caderno");\nconsole.log("Preço:", 12);\nconsole.log("Quantidade:", 2);',
    },
  ],
};
