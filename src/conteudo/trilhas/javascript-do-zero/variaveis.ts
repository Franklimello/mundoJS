import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const variaveis: Licao = {
  slug: 'variaveis',
  titulo: 'Guardando valores',
  resumo: 'Variáveis com const e let.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Uma variável é uma caixa com nome, onde você guarda um valor para usar depois. Para criar uma que não vai mudar, use `const`:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('const cidade = "Lajinha";', 'console.log(cidade);'),
      saida: 'Lajinha',
    },
    { tipo: 'p', texto: 'Quando o valor precisa mudar depois, use `let`:' },
    {
      tipo: 'codigo',
      codigo: linhas('let pontos = 10;', 'pontos = pontos + 5;', 'console.log(pontos);'),
      saida: '15',
    },
    {
      tipo: 'p',
      texto:
        'Repare que só a primeira vez leva `let`: é quando a variável nasce. Depois, é só escrever o nome. Na linha `pontos = pontos + 5`, o computador faz primeiro a conta do lado direito (10 + 5) e só então guarda o resultado em `pontos`.',
    },
    {
      tipo: 'nota',
      texto:
        'Prefira `const`. Use `let` só quando o valor realmente precisa mudar — assim o código fica mais fácil de entender.',
    },
    {
      tipo: 'p',
      texto:
        'Os nomes não têm espaço, não começam com número, e maiúsculas importam: `idade` e `Idade` são variáveis diferentes. O costume é escrever `nomeDoCliente`: a primeira palavra em minúsculas e as seguintes com a inicial maiúscula.',
    },
  ],
  exercicios: [
    {
      titulo: 'Nome e pontos',
      enunciado: [
        { tipo: 'p', texto: 'Crie e atualize duas variáveis.' },
        {
          tipo: 'lista',
          itens: [
            'Declare `nome` com `const` e guarde seu nome como texto.',
            'Declare `pontos` com `let`, começando em `0`.',
            'Some `10` a `pontos` e mostre o valor com `console.log`.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Existe uma const nome com o seu nome',
          codigo: js`verdadeiro(/const\s+nome\b/.test(codigoDoAluno), 'Declare nome com const.');
verdadeiro(typeof nome === 'string' && nome.trim().length > 0, 'Guarde o seu nome em nome, entre aspas.')`,
        },
        {
          descricao: 'pontos foi criada com let e terminou valendo 10',
          codigo: js`verdadeiro(/let\s+pontos\b/.test(codigoDoAluno), 'Declare pontos com let.');
igual(pontos, 10, 'pontos')`,
        },
        {
          descricao: 'O valor de pontos foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '10', 'O último valor mostrado')`,
        },
      ],
      dicas: [
        'Uma variável nasce assim: `const nome = "seu nome";`.',
        'Para somar 10: `pontos = pontos + 10;` — sem `let` de novo, porque `pontos` já existe.',
      ],
      solucao: linhas('const nome = "Ana";', 'let pontos = 0;', 'pontos = pontos + 10;', 'console.log(pontos);'),
    },
    {
      titulo: 'Trocando o valor',
      enunciado: [
        { tipo: 'p', texto: 'Atualize a variável `temperatura`, que já vale `20`.' },
        {
          tipo: 'lista',
          itens: ['Mude seu valor para `31`, sem declarar outra variável.', 'Mostre o novo valor com `console.log`.'],
        },
      ],
      codigoInicial: linhas('let temperatura = 20;', ''),
      testes: [
        {
          descricao: 'temperatura passou a valer 31, sem uma segunda variável',
          codigo: js`igual(temperatura, 31, 'temperatura');
verdadeiro(
  (codigoDoAluno.match(/\b(let|const|var)\s+temperatura\b/g) ?? []).length === 1,
  'Crie temperatura uma vez só; depois, é só mudar o valor, sem let.',
)`,
        },
        {
          descricao: 'O valor 31 foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '31', 'O último valor mostrado')`,
        },
      ],
      dicas: [
        'Para mudar o valor, escreva o nome, o `=` e o valor novo, sem `let` na frente.',
        'Assim: `temperatura = 31;` e, depois, `console.log(temperatura);`.',
      ],
      solucao: linhas('let temperatura = 20;', 'temperatura = 31;', 'console.log(temperatura);'),
    },
    {
      titulo: 'A troca',
      enunciado: [
        { tipo: 'p', texto: 'Troque os valores de `a` e `b`.' },
        {
          tipo: 'lista',
          itens: [
            'Ao terminar, `a` deve conter `"segundo"` e `b`, `"primeiro"`.',
            'Use uma variável auxiliar para guardar um dos valores durante a troca.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Se você fizer só `a = b;`, o valor antigo de `a` se perde. Guarde um dos valores numa terceira variável antes de mexer.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas('let a = "primeiro";', 'let b = "segundo";', ''),
      testes: [
        { descricao: 'a passou a valer “segundo”', codigo: js`igual(a, 'segundo', 'a')` },
        { descricao: 'b passou a valer “primeiro”', codigo: js`igual(b, 'primeiro', 'b')` },
      ],
      dicas: [
        'Guarde o valor de `a` numa variável nova antes de mexer nele.',
        'Primeiro `const guardado = a;`, depois `a = b;` e, por fim, `b = guardado;`.',
      ],
      solucao: linhas(
        'let a = "primeiro";',
        'let b = "segundo";',
        '',
        'const guardado = a;',
        'a = b;',
        'b = guardado;',
      ),
    },
    {
      titulo: 'Contador de visitas',
      enunciado: [
        { tipo: 'p', texto: 'Crie um contador de visitas.' },
        {
          tipo: 'lista',
          itens: [
            'Declare `visitas` com `let` e valor inicial `0`.',
            'Some `1` três vezes, em três linhas separadas.',
            'Mostre o valor final de `visitas`.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        { descricao: 'visitas termina valendo 3', codigo: js`igual(visitas, 3, 'visitas')` },
        {
          descricao: 'O valor 3 foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '3', 'O último valor mostrado')`,
        },
        {
          descricao: 'Somou 1 três vezes, uma linha para cada',
          codigo: js`verdadeiro(
  (codigoDoAluno.match(/visitas\s*=\s*visitas\s*\+\s*1/g) ?? []).length === 3,
  'Faça três linhas somando 1, assim: visitas = visitas + 1;',
)`,
        },
      ],
      dicas: [
        'Cada soma é uma linha: `visitas = visitas + 1;`.',
        'Escreva essa linha três vezes e, no fim, `console.log(visitas);`.',
      ],
      solucao: linhas(
        'let visitas = 0;',
        'visitas = visitas + 1;',
        'visitas = visitas + 1;',
        'visitas = visitas + 1;',
        'console.log(visitas);',
      ),
    },
    {
      titulo: 'O saldo da carteira',
      enunciado: [
        { tipo: 'p', texto: 'Atualize `saldo` para registrar duas movimentações.' },
        {
          tipo: 'lista',
          itens: [
            'O saldo inicial é `30` reais.',
            'Primeiro, acrescente `20`. Depois, retire `15`, usando o saldo atualizado.',
            'Mostre o saldo final com `console.log`.',
          ],
        },
      ],
      codigoInicial: linhas('let saldo = 30;', ''),
      testes: [
        { descricao: 'O saldo final é 35', codigo: js`igual(saldo, 35, 'saldo')` },
        { descricao: 'A saída mostra o saldo atualizado', codigo: js`igual(saida, ['35'], 'O saldo mostrado')` },
        {
          descricao: 'A atualização parte do saldo anterior',
          codigo: js`verdadeiro(/saldo\s*=\s*saldo\s*\+/.test(codigoDoAluno) && /saldo\s*=\s*saldo\s*-/.test(codigoDoAluno), 'Atualize saldo somando e subtraindo a partir dele mesmo.')`,
        },
      ],
      dicas: ['Como o valor muda, saldo usa let. Em cada atualização, use saldo do lado direito da conta.'],
      solucao: 'let saldo = 30;\nsaldo = saldo + 20;\nsaldo = saldo - 15;\nconsole.log(saldo);',
    },
    {
      titulo: 'Uma informação que muda',
      enunciado: [
        { tipo: 'p', texto: 'Atualize a cidade de Rafa para `"Natal"`.' },
        {
          tipo: 'lista',
          itens: [
            'Mantenha `nome` declarado com `const`.',
            'Mude a declaração de `cidade` para permitir a troca de valor.',
            'Mostre `nome` e `cidade`, nessa ordem, no mesmo `console.log`.',
          ],
        },
      ],
      codigoInicial: linhas('const nome = "Rafa";', 'const cidade = "Recife";', ''),
      testes: [
        { descricao: 'A cidade foi atualizada para Natal', codigo: js`igual(cidade, 'Natal', 'cidade')` },
        { descricao: 'Mostra Rafa e Natal juntos', codigo: js`igual(saida, ['Rafa Natal'], 'A apresentação')` },
        {
          descricao: 'Cidade pode mudar e nome permanece constante',
          codigo: js`verdadeiro(/\blet\s+cidade\b/.test(codigoDoAluno) && /\bconst\s+nome\b/.test(codigoDoAluno), 'Use let para cidade e mantenha const para nome.')`,
        },
      ],
      dicas: [
        'Uma const não recebe outra atribuição. Para cidade, use let; depois atribua o novo valor sem declarar de novo.',
      ],
      solucao: 'const nome = "Rafa";\nlet cidade = "Recife";\ncidade = "Natal";\nconsole.log(nome, cidade);',
    },
  ],
};
