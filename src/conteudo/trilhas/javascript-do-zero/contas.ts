import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const contas: Licao = {
  slug: 'contas',
  titulo: 'Fazendo contas',
  resumo: 'Operadores de soma, subtração, multiplicação, divisão e resto.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'JavaScript faz contas com `+`, `-`, `*` (vezes) e `/` (dividido por). Você pode usá-los direto, ou com variáveis:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(8 + 2);', 'console.log(8 - 2);', 'console.log(8 * 2);', 'console.log(8 / 2);'),
      saida: linhas('10', '6', '16', '4'),
    },
    {
      tipo: 'p',
      texto:
        'Existe ainda o `%`, que devolve o **resto** da divisão. `10 % 3` dá `1`: dez dividido por três é três, e sobra um. Ele é útil, por exemplo, para saber se um número é par — se o resto da divisão por 2 é 0, é par.',
    },
    {
      tipo: 'p',
      texto: 'A ordem das contas é a da matemática: vezes e dividido primeiro. Para mandar na ordem, use parênteses:',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log(2 + 3 * 4);', 'console.log((2 + 3) * 4);'),
      saida: linhas('14', '20'),
    },
    {
      tipo: 'nota',
      texto: 'O separador decimal em JavaScript é o ponto: escreva `7.5`, não `7,5`.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Total da compra',
      enunciado: [
        { tipo: 'p', texto: 'Calcule o valor final da compra.' },
        {
          tipo: 'lista',
          itens: [
            'Use as variáveis `preco`, `quantidade` e `desconto` já fornecidas.',
            'Guarde em `total` o preço vezes a quantidade, menos o desconto em reais.',
            'Mostre `total` com `console.log`.',
          ],
        },
      ],
      codigoInicial: linhas('const preco = 12;', 'const quantidade = 3;', 'const desconto = 5;', ''),
      testes: [
        {
          descricao: 'Existe a variável total, com um número',
          codigo: js`verdadeiro(typeof total === 'number', 'Crie a variável total com o resultado da conta.')`,
        },
        { descricao: 'O total está certo', codigo: js`igual(total, 31, 'total')` },
        {
          descricao: 'A conta usa as três variáveis',
          codigo: js`const linha = codigoDoAluno.split('\n').find((l) => /\btotal\s*=/.test(l)) ?? '';
verdadeiro(
  linha.includes('preco') && linha.includes('quantidade') && linha.includes('desconto'),
  'Faça a conta usando preco, quantidade e desconto, e não só o número final.',
)`,
        },
        {
          descricao: 'O total foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '31', 'O último valor mostrado')`,
        },
      ],
      dicas: [
        'Comece por `const total = preco * quantidade;` e depois pense em onde entra o desconto.',
        'Depois da conta, `console.log(total);` mostra o resultado.',
      ],
      solucao: linhas(
        'const preco = 12;',
        'const quantidade = 3;',
        'const desconto = 5;',
        '',
        'const total = preco * quantidade - desconto;',
        'console.log(total);',
      ),
    },
    {
      titulo: 'O resto da divisão',
      enunciado: [
        { tipo: 'p', texto: 'Calcule o resto da divisão de `numero` por `5`.' },
        { tipo: 'lista', itens: ['Guarde o resultado em `resto`.', 'Mostre `resto` com `console.log`.'] },
      ],
      codigoInicial: linhas('const numero = 17;', ''),
      testes: [
        { descricao: 'resto vale 2', codigo: js`igual(resto, 2, 'resto')` },
        {
          descricao: 'O resto foi mostrado',
          codigo: js`igual(saida[saida.length - 1], '2', 'O último valor mostrado')`,
        },
        {
          descricao: 'Usa o operador do resto',
          codigo: js`verdadeiro(codigoDoAluno.includes('%'), 'Use o operador % para achar o resto da divisão.')`,
        },
      ],
      dicas: ['O operador do resto é o `%`: `10 % 3` dá `1`.', 'A conta fica assim: `const resto = numero % 5;`.'],
      solucao: linhas('const numero = 17;', '', 'const resto = numero % 5;', 'console.log(resto);'),
    },
    {
      titulo: 'A ordem das contas',
      enunciado: [
        { tipo: 'p', texto: 'Crie `resultado` com uma expressão que resulte em `20`.' },
        {
          tipo: 'lista',
          itens: [
            'Use somente os números `2`, `3` e `4`, uma soma e uma multiplicação.',
            'Use parênteses para definir a ordem das operações.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        { descricao: 'resultado vale 20', codigo: js`igual(resultado, 20, 'resultado')` },
        {
          descricao: 'A conta usa o 2, o 3, o 4 e parênteses',
          codigo: js`verdadeiro(
  codigoDoAluno.includes('(') && /\b2\b/.test(codigoDoAluno) && /\b3\b/.test(codigoDoAluno) && /\b4\b/.test(codigoDoAluno),
  'Chegue ao 20 fazendo a conta com 2, 3 e 4 e parênteses, e não digitando o 20 direto.',
)`,
        },
      ],
      dicas: [
        'A multiplicação acontece antes da soma. Para somar primeiro, use parênteses.',
        'Experimente `(2 + 3) * 4`.',
      ],
      solucao: linhas('const resultado = (2 + 3) * 4;', 'console.log(resultado);'),
    },
    {
      titulo: 'Média de duas notas',
      enunciado: [
        { tipo: 'p', texto: 'Calcule a média das duas notas fornecidas.' },
        {
          tipo: 'lista',
          itens: [
            'Some `nota1` e `nota2` e divida a soma por `2`.',
            'Guarde o valor em `media` e mostre-o com `console.log`.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Atenção à ordem das contas: `nota1 + nota2 / 2` divide só a segunda nota, e não a soma. Os parênteses resolvem.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas('const nota1 = 7;', 'const nota2 = 9;', ''),
      testes: [
        { descricao: 'media vale 8', codigo: js`igual(media, 8, 'media')` },
        {
          descricao: 'A média foi mostrada',
          codigo: js`igual(saida[saida.length - 1], '8', 'O último valor mostrado')`,
        },
        {
          descricao: 'A conta usa nota1 e nota2',
          codigo: js`const linha = codigoDoAluno.split('\n').find((l) => /\bmedia\s*=/.test(l)) ?? '';
verdadeiro(linha.includes('nota1') && linha.includes('nota2'), 'Calcule a média usando nota1 e nota2.')`,
        },
      ],
      dicas: [
        'Some as duas notas **dentro de parênteses** e só depois divida.',
        'Assim: `const media = (nota1 + nota2) / 2;`.',
      ],
      solucao: linhas(
        'const nota1 = 7;',
        'const nota2 = 9;',
        '',
        'const media = (nota1 + nota2) / 2;',
        'console.log(media);',
      ),
    },
    {
      titulo: 'Horas e minutos que sobram',
      enunciado: [
        { tipo: 'p', texto: 'Converta `minutos` em horas completas e minutos restantes.' },
        {
          tipo: 'lista',
          itens: [
            'Guarde as horas completas em `horas`.',
            'Guarde o resto da divisão por `60` em `restantes`.',
            'Mostre `horas` e `restantes`, nessa ordem.',
          ],
        },
      ],
      codigoInicial: linhas('const minutos = 137;', ''),
      testes: [
        {
          descricao: '137 minutos equivalem a 2 horas e 17 minutos',
          codigo: js`igual(horas, 2, 'horas'); igual(restantes, 17, 'restantes')`,
        },
        { descricao: 'Mostra as duas partes na ordem certa', codigo: js`igual(saida, ['2 17'], 'Horas e minutos')` },
      ],
      dicas: [
        'Use minutos % 60 para o que sobra. Tire essa sobra antes de dividir por 60 para encontrar horas completas.',
      ],
      solucao:
        'const minutos = 137;\nconst restantes = minutos % 60;\nconst horas = (minutos - restantes) / 60;\nconsole.log(horas, restantes);',
    },
    {
      titulo: 'Consertando a média do preço',
      enunciado: [
        { tipo: 'p', texto: 'Corrija a conta de `media` para calcular o custo de cada item.' },
        { tipo: 'lista', itens: ['Divida `total` por `itens`.', 'Mantenha o comando que mostra o resultado.'] },
      ],
      codigoInicial: 'const total = 45;\nconst itens = 3;\nconst media = total + itens;\nconsole.log(media);\n',
      testes: [
        { descricao: 'O preço médio é 15', codigo: js`igual(media, 15, 'media')` },
        { descricao: 'A saída mostra o preço médio corrigido', codigo: js`igual(saida, ['15'], 'O valor por item')` },
      ],
      dicas: ['Para repartir um total igualmente entre itens, use divisão.'],
      solucao: 'const total = 45;\nconst itens = 3;\nconst media = total / itens;\nconsole.log(media);',
    },
  ],
};
