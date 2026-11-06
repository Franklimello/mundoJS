import { metodo, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const lacos: TopicoDoc = {
  slug: 'lacos',
  titulo: 'Laços e repetições',
  resumo:
    'Todos os comandos de repetição em JavaScript: for clássico, while, do...while, for...of, for...in, break, continue e laços aninhados.',
  introducao: [
    'Os *laços de repetição* (loops) permitem executar o mesmo bloco de código várias vezes sem precisar repeti-lo manualmente. Eles são fundamentais para somar valores, percorrer listas, buscar elementos e processar dados.',
    'JavaScript oferece opções para diferentes cenários: o clássico `for` com contador, `while` para repetições condicionais, `for...of` para percorrer valores de coleções, `for...in` para chaves de objetos, além de comandos de controle de fluxo como `break` e `continue`.',
  ],
  secoes: [
    {
      titulo: 'Laços fundamentais',
      descricao: 'As estruturas clássicas com contador ou baseadas em uma condição verdadeira.',
      metodos: [
        {
          id: 'for-classico',
          nome: 'for clássico',
          resumo:
            'Executa um bloco de código repetidas vezes com um contador que define o início, a condição de parada e o incremento a cada volta.',
          sintaxe: 'for (inicializacao; condicao; incremento) {\n  // código\n}',
          retorno: 'Não devolve valor (instrução de controle).',
          exemplos: [
            {
              codigo: 'for (let i = 1; i <= 3; i++) {\n  console.log(`Volta ${i}`);\n}',
              saida: 'Volta 1\nVolta 2\nVolta 3',
            },
          ],
          cuidado:
            'Sempre declare o contador com `let` (ex: `let i = 0`), e não com `var`, para que cada volta tenha seu próprio escopo de bloco e não vaze para fora do laço.',
          treino: treino({
            enunciado: [
              'Use um laço `for` clássico de 1 até 5 para somar todos esses números. Guarde o resultado na variável `soma` (começando em 0) e mostre.',
            ],
            inicial: ['let soma = 0;'],
            esperados: { soma: 15 },
            usa: [{ padrao: '\\bfor\\s*\\(', nome: 'laço for' }],
            mostra: '15',
            dicas: [
              'Monte o laço com contador `i` indo de 1 até 5: `for (let i = 1; i <= 5; i++) { soma += i; }`.',
              'Depois do laço, chame `console.log(soma);`.',
            ],
            resposta: ['for (let i = 1; i <= 5; i++) {', '  soma += i;', '}', 'console.log(soma);'],
          }),
        },
        {
          id: 'while',
          nome: 'while',
          resumo:
            'Executa o bloco **enquanto** uma condição lógica for verdadeira. A condição é avaliada antes de cada volta.',
          sintaxe: 'while (condicao) {\n  // código executado enquanto a condição for verdadeira\n}',
          retorno: 'Não devolve valor (instrução de controle).',
          exemplos: [
            {
              codigo: 'let vidas = 3;\nwhile (vidas > 0) {\n  console.log(`Restam ${vidas} vidas`);\n  vidas--;\n}',
              saida: 'Restam 3 vidas\nRestam 2 vidas\nRestam 1 vidas',
            },
          ],
          cuidado:
            'Sempre atualize a variável de controle dentro do laço (como `vidas--`). Se a condição nunca se tornar falsa, você criará um loop infinito que trava a aba do navegador.',
          treino: treino({
            enunciado: [
              'Use um laço `while` para dobrar a variável `valor` (que começa em 1) enquanto ela for menor que 30. Mostre o `valor` final com `console.log`.',
            ],
            inicial: ['let valor = 1;'],
            esperados: { valor: 32 },
            usa: [{ padrao: '\\bwhile\\s*\\(', nome: 'laço while' }],
            mostra: '32',
            dicas: ['Faça `while (valor < 30) { valor *= 2; }`.', 'O valor passará por 1, 2, 4, 8, 16 e parará em 32.'],
            resposta: ['while (valor < 30) {', '  valor *= 2;', '}', 'console.log(valor);'],
          }),
        },
        {
          id: 'do-while',
          nome: 'do...while',
          resumo:
            'Semelhante ao `while`, mas avalia a condição **depois** de executar o bloco. Isso garante que o código rode **pelo menos uma vez**.',
          sintaxe: 'do {\n  // executado pelo menos uma vez\n} while (condicao);',
          retorno: 'Não devolve valor (instrução de controle).',
          exemplos: [
            {
              codigo:
                'let numero = 10;\ndo {\n  console.log(`Executou pelo menos uma vez: ${numero}`);\n} while (numero < 5);',
              saida: 'Executou pelo menos uma vez: 10',
            },
          ],
          cuidado:
            'Mesmo que a condição seja falsa desde o início (como `10 < 5`), o corpo do `do` será executado uma primeira vez.',
          treino: treino({
            enunciado: [
              'Use um laço `do...while` para incrementar `contador` (que começa em 0) até que ele chegue a 3. Mostre `contador` no console.',
            ],
            inicial: ['let contador = 0;'],
            esperados: { contador: 3 },
            usa: [{ padrao: '\\bdo\\b[\\s\\S]*\\bwhile\\b', nome: 'laço do...while' }],
            mostra: '3',
            dicas: [
              'Escreva `do { contador++; } while (contador < 3);`.',
              'Depois mostre com `console.log(contador);`.',
            ],
            resposta: ['do {', '  contador++;', '} while (contador < 3);', 'console.log(contador);'],
          }),
        },
      ],
    },
    {
      titulo: 'Iteração em coleções',
      descricao: 'Maneiras modernas e legíveis de percorrer listas, textos e objetos.',
      metodos: [
        {
          id: 'for-of',
          nome: 'for...of',
          resumo:
            'A forma mais limpa e moderna de percorrer os **valores** de qualquer iterável (como arrays, strings, Maps e Sets).',
          sintaxe: 'for (const item of colecao) {\n  // usa o item diretamente\n}',
          retorno: 'Não devolve valor (instrução de controle).',
          exemplos: [
            {
              codigo:
                "const frutas = ['uva', 'pera', 'figo'];\nfor (const fruta of frutas) {\n  console.log(fruta);\n}",
              saida: 'uva\npera\nfigo',
            },
          ],
          cuidado:
            '`for...of` foi feito para estruturas iteráveis (arrays, strings). Em objetos comuns, ele gera um erro de execução. Para objetos, use `for...in` ou `Object.entries()`.',
          treino: treino({
            enunciado: [
              'Percorra a lista `precos` com um laço `for...of` somando cada valor na variável `total` (que começa em 0). Mostre o `total` com `console.log`.',
            ],
            inicial: ['const precos = [12, 18, 25, 45];', 'let total = 0;'],
            esperados: { total: 100 },
            usa: [{ padrao: '\\bfor\\s*\\(\\s*(?:const|let|var)?\\s*\\w+\\s+of\\b', nome: 'for...of' }],
            mostra: '100',
            dicas: ['Use `for (const p of precos) { total += p; }`.', 'Depois chame `console.log(total);`.'],
            resposta: ['for (const p of precos) {', '  total += p;', '}', 'console.log(total);'],
          }),
        },
        {
          id: 'for-in',
          nome: 'for...in',
          resumo: 'Percorre os nomes de todas as propriedades enumeráveis (as **chaves**) de um objeto.',
          sintaxe: 'for (const chave in objeto) {\n  // chave é o nome da propriedade\n}',
          retorno: 'Não devolve valor (instrução de controle).',
          exemplos: [
            {
              codigo:
                "const usuario = { nome: 'Marina', cargo: 'Dev' };\nfor (const chave in usuario) {\n  console.log(`${chave}: ${usuario[chave]}`);\n}",
              saida: 'nome: Marina\ncargo: Dev',
            },
          ],
          cuidado:
            'Em arrays, prefira sempre `for...of`. O `for...in` devolve os índices como strings (`"0"`, `"1"`) e pode incluir propriedades adicionais inseridas no protótipo.',
          treino: treino({
            enunciado: [
              'Use um laço `for...in` para percorrer o objeto `pontos` e somar todos os valores na variável `pontuacaoTotal` (que começa em 0). Mostre no console.',
            ],
            inicial: ['const pontos = { rodada1: 30, rodada2: 50, rodada3: 20 };', 'let pontuacaoTotal = 0;'],
            esperados: { pontuacaoTotal: 100 },
            usa: [{ padrao: '\\bfor\\s*\\(\\s*(?:const|let|var)?\\s*\\w+\\s+in\\b', nome: 'for...in' }],
            mostra: '100',
            dicas: [
              'Dentro do laço, acesse o valor usando colchetes: `pontos[chave]`.',
              '`for (const chave in pontos) { pontuacaoTotal += pontos[chave]; }`',
            ],
            resposta: [
              'for (const chave in pontos) {',
              '  pontuacaoTotal += pontos[chave];',
              '}',
              'console.log(pontuacaoTotal);',
            ],
          }),
        },
        {
          id: 'foreach',
          nome: 'forEach()',
          resumo: 'Método funcional de array que executa uma função de callback para cada elemento da lista.',
          sintaxe: 'lista.forEach((item, indice, array) => {\n  // código\n})',
          retorno: '`undefined`.',
          exemplos: [
            {
              codigo:
                "const cores = ['azul', 'verde'];\ncores.forEach((cor, i) => {\n  console.log(`${i + 1}: ${cor}`);\n});",
              saida: '1: azul\n2: verde',
            },
          ],
          cuidado:
            'Não é possível interromper um `forEach()` com `break` nem pular voltas com `continue`. Se precisar interromper cedo, use `for...of` ou métodos como `some()`.',
          treino: treino({
            enunciado: [
              'Use `forEach()` na lista `letras` para juntar cada letra em maiúscula na string `palavra` (que começa vazia `""`). Mostre `palavra` no console.',
            ],
            inicial: ["const letras = ['j', 'a', 'v', 'a'];", 'let palavra = "";'],
            esperados: { palavra: 'JAVA' },
            usa: [metodo('forEach')],
            mostra: 'JAVA',
            dicas: [
              'Dentro do callback, faça `palavra += l.toUpperCase();`.',
              '`letras.forEach((l) => { palavra += l.toUpperCase(); });`',
            ],
            resposta: ['letras.forEach((l) => {', '  palavra += l.toUpperCase();', '});', 'console.log(palavra);'],
          }),
        },
      ],
    },
    {
      titulo: 'Controle de fluxo no laço',
      descricao: 'Comandos para interromper laços ou pular iterações sob condições específicas.',
      metodos: [
        {
          id: 'break',
          nome: 'Comando break',
          resumo:
            'Interrompe e sai imediatamente do laço mais interno em que ele se encontra, pulando qualquer volta restante.',
          sintaxe: 'break;',
          retorno: 'Não devolve valor (comando de fluxo).',
          exemplos: [
            {
              codigo: 'for (let i = 1; i <= 10; i++) {\n  if (i === 4) break;\n  console.log(i);\n}',
              saida: '1\n2\n3',
            },
          ],
          cuidado:
            'O `break` encerra apenas o laço imediatamente ao seu redor. Em laços aninhados, os laços mais externos continuam rodando, a menos que você use um rótulo (*label*).',
          treino: treino({
            enunciado: [
              'Percorra a lista `numeros` com `for...of`. Guarde o primeiro número maior que 50 na variável `primeiroGrande` e pare o laço imediatamente com `break`. Mostre o resultado.',
            ],
            inicial: ['const numeros = [10, 25, 62, 14, 80];', 'let primeiroGrande;'],
            esperados: { primeiroGrande: 62 },
            usa: [{ padrao: '\\bbreak\\b', nome: 'comando break' }],
            mostra: '62',
            dicas: [
              'Use `if (n > 50) { primeiroGrande = n; break; }`.',
              'Assim que encontrar 62, o laço encerra sem testar os próximos.',
            ],
            resposta: [
              'for (const n of numeros) {',
              '  if (n > 50) {',
              '    primeiroGrande = n;',
              '    break;',
              '  }',
              '}',
              'console.log(primeiroGrande);',
            ],
          }),
        },
        {
          id: 'continue',
          nome: 'Comando continue',
          resumo: 'Pula o restante do código da volta atual e avança diretamente para a próxima iteração do laço.',
          sintaxe: 'continue;',
          retorno: 'Não devolve valor (comando de fluxo).',
          exemplos: [
            {
              codigo: 'for (let i = 1; i <= 5; i++) {\n  if (i === 3) continue;\n  console.log(i);\n}',
              saida: '1\n2\n4\n5',
            },
          ],
          cuidado:
            'Em laços `while`, certifique-se de incrementar a variável de controle antes do `continue`. Caso contrário, a próxima volta repetirá o mesmo valor e criará um loop infinito.',
          treino: treino({
            enunciado: [
              'Percorra a lista `valores` somando apenas os números positivos em `somaPositivos` (que começa em 0). Se o número for menor ou igual a 0, use `continue` para pular a volta. Mostre o resultado.',
            ],
            inicial: ['const valores = [10, -5, 20, 0, 30, -12];', 'let somaPositivos = 0;'],
            esperados: { somaPositivos: 60 },
            usa: [{ padrao: '\\bcontinue\\b', nome: 'comando continue' }],
            mostra: '60',
            dicas: ['Use `if (v <= 0) continue;` antes de somar.', 'Os números negativos e zero serão ignorados.'],
            resposta: [
              'for (const v of valores) {',
              '  if (v <= 0) continue;',
              '  somaPositivos += v;',
              '}',
              'console.log(somaPositivos);',
            ],
          }),
        },
        {
          id: 'lacos-aninhados',
          nome: 'Laços aninhados',
          resumo:
            'Um laço colocado dentro do corpo de outro laço. Essencial para matrizes bidimensionais, tabelas e combinações de dados.',
          sintaxe: 'for (...) {\n  for (...) {\n    // código interno\n  }\n}',
          retorno: 'Não devolve valor.',
          exemplos: [
            {
              codigo:
                'const matriz = [[1, 2], [3, 4]];\nfor (let l = 0; l < matriz.length; l++) {\n  for (let c = 0; c < matriz[l].length; c++) {\n    console.log(`[${l},${c}] = ${matriz[l][c]}`);\n  }\n}',
              saida: '[0,0] = 1\n[0,1] = 2\n[1,0] = 3\n[1,1] = 4',
            },
          ],
          cuidado:
            'Cuidado com a performance: cada volta do laço externo executa todas as voltas do laço interno ($N \\times M$). Sempre use nomes de índices diferentes em cada nível (como `i` e `j`, ou `linha` e `coluna`).',
          treino: treino({
            enunciado: [
              'Some todos os números da `grade` (uma matriz 2x2) usando dois laços `for...of` aninhados. Guarde a soma total em `somaMatriz` (que começa em 0) e mostre.',
            ],
            inicial: ['const grade = [[5, 10], [15, 20]];', 'let somaMatriz = 0;'],
            esperados: { somaMatriz: 50 },
            usa: [{ padrao: '\\bfor\\b[\\s\\S]*\\bfor\\b', nome: 'dois laços for' }],
            mostra: '50',
            dicas: [
              'O primeiro laço percorre as linhas (`for (const linha of grade)`), e o segundo percorre os números (`for (const num of linha)`).',
              '`somaMatriz += num;` dentro do laço interno.',
            ],
            resposta: [
              'for (const linha of grade) {',
              '  for (const num of linha) {',
              '    somaMatriz += num;',
              '  }',
              '}',
              'console.log(somaMatriz);',
            ],
          }),
        },
      ],
    },
  ],
};
