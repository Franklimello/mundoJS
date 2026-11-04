import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const temporizadores: Licao = {
  slug: 'temporizadores',
  titulo: 'Esperando um pouco',
  resumo: 'setTimeout, setInterval e funções de retorno (callbacks).',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Até aqui, o computador fez uma coisa de cada vez, de cima para baixo, sem esperar nada. Mas boa parte da vida de um programa é **esperar**: um tempo passar, uma resposta chegar. Para isso existem os temporizadores.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'console.log("1: antes");',
        '',
        'setTimeout(() => {',
        '  console.log("3: dentro do setTimeout");',
        '}, 100);',
        '',
        'console.log("2: depois");',
      ),
      saida: linhas('1: antes', '2: depois', '3: dentro do setTimeout'),
    },
    {
      tipo: 'p',
      texto:
        '`setTimeout(função, milissegundos)` agenda a função para daqui a um tempo (1000 ms é 1 segundo). E repare: o JavaScript **não fica parado esperando**. Ele agenda, segue para a linha de baixo e só chama a função quando o tempo passar. Por isso o "2: depois" aparece antes do "3".',
    },
    {
      tipo: 'p',
      texto:
        'Uma função que você entrega a outra, para ela chamar mais tarde, se chama **função de retorno** (em inglês, *callback*). Você já fez isso com `map` e `filter` — só que lá ela é chamada na hora; aqui, depois de um tempo.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function saudarDepois(nome, aoTerminar) {',
        '  setTimeout(() => {',
        '    console.log("Olá, " + nome + "!");',
        '    aoTerminar();',
        '  }, 50);',
        '}',
        '',
        'saudarDepois("Ana", () => {',
        '  console.log("Pronto.");',
        '});',
      ),
      saida: linhas('Olá, Ana!', 'Pronto.'),
    },
    {
      tipo: 'p',
      texto: '`setInterval(função, ms)` repete a função a cada intervalo, até alguém mandar parar com `clearInterval`:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'let contagem = 0;',
        '',
        'const id = setInterval(() => {',
        '  contagem = contagem + 1;',
        '  console.log("tic", contagem);',
        '',
        '  if (contagem === 3) {',
        '    clearInterval(id);',
        '    console.log("parou");',
        '  }',
        '}, 50);',
      ),
      saida: linhas('tic 1', 'tic 2', 'tic 3', 'parou'),
    },
    {
      tipo: 'nota',
      texto:
        'Guarde o `id` que o `setInterval` devolve: é com ele que você manda parar. Um `setInterval` esquecido roda para sempre. Aqui no MundoJS, o programa espera os temporizadores por até 3 segundos e depois encerra, com um aviso.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Contagem em intervalos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `contarAte(n, aCadaNumero, aoTerminar)`.' },
        {
          tipo: 'lista',
          itens: [
            'Chame `aCadaNumero` com os valores de `1` até `n`, um a cada `10` milissegundos.',
            'Depois do último número, chame `aoTerminar()` exatamente uma vez.',
            'Para `n = 0`, chame apenas `aoTerminar()`. Nenhuma chamada deve acontecer imediatamente, durante a execução inicial de `contarAte`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const n = 3;',
        'const aCadaNumero = (numero) => console.log(numero);',
        'const aoTerminar = () => console.log("Fim");',
        '',
        'function contarAte(n, aCadaNumero, aoTerminar) {',
        '',
        '}',
        '',
        'contarAte(n, aCadaNumero, aoTerminar);',
        '',
      ),
      testes: [
        {
          descricao: 'Entrega 1, 2, 3 na ordem e só depois avisa que terminou',
          codigo: js`const eventos = [];
contarAte(3, (i) => eventos.push('n' + i), () => eventos.push('fim'));
await new Promise((resolver) => setTimeout(resolver, 250));
igual(eventos, ['n1', 'n2', 'n3', 'fim'], 'A ordem dos avisos')`,
        },
        {
          descricao: 'Chama aoTerminar uma vez só',
          codigo: js`let fim = 0;
contarAte(2, () => {}, () => { fim++; });
await new Promise((resolver) => setTimeout(resolver, 250));
igual(fim, 1, 'Quantas vezes aoTerminar foi chamada')`,
        },
        {
          descricao: 'Com n igual a 0, só avisa que terminou',
          codigo: js`const eventos = [];
contarAte(0, (i) => eventos.push(i), () => eventos.push('fim'));
await new Promise((resolver) => setTimeout(resolver, 150));
igual(eventos, ['fim'], 'Os avisos com n igual a 0')`,
        },
        {
          descricao: 'Nada acontece na hora: os avisos vêm depois',
          codigo: js`const eventos = [];
contarAte(2, (i) => eventos.push(i), () => eventos.push('fim'));
igual(eventos, [], 'Logo depois de chamar contarAte');
await new Promise((resolver) => setTimeout(resolver, 250));
igual(eventos, [1, 2, 'fim'], 'Depois de esperar um pouco')`,
        },
      ],
      dicas: [
        'Use um `setInterval` de 10 milissegundos e uma variável `let atual = 0;` que guarda em que número você está.',
        'A cada volta: se `atual` já chegou em `n`, pare com `clearInterval`, chame `aoTerminar()` e saia com `return`. Se não, some 1 em `atual` e chame `aCadaNumero(atual)`.',
        'Guarde o `id` do `setInterval` numa `const`: é ele que o `clearInterval` pede.',
      ],
      solucao: linhas(
        'function contarAte(n, aCadaNumero, aoTerminar) {',
        '  let atual = 0;',
        '  const id = setInterval(() => {',
        '    if (atual >= n) {',
        '      clearInterval(id);',
        '      aoTerminar();',
        '      return;',
        '    }',
        '    atual = atual + 1;',
        '    aCadaNumero(atual);',
        '  }, 10);',
        '}',
      ),
    },
    {
      titulo: 'Dizer depois',
      enunciado: [
        { tipo: 'p', texto: 'Complete `dizerDepois(texto, ms, aoDizer)`.' },
        {
          tipo: 'lista',
          itens: [
            'Espere `ms` milissegundos e chame `aoDizer(texto)` uma única vez.',
            'Não chame `aoDizer` imediatamente, durante a execução inicial da função.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const texto = "Olá!";',
        'const ms = 20;',
        'const aoDizer = (mensagem) => console.log(mensagem);',
        '',
        'function dizerDepois(texto, ms, aoDizer) {',
        '',
        '}',
        '',
        'dizerDepois(texto, ms, aoDizer);',
        '',
      ),
      testes: [
        {
          descricao: 'Chama aoDizer com o texto, só depois do tempo',
          codigo: js`const eventos = [];
dizerDepois('oi', 20, (texto) => eventos.push(texto));
igual(eventos, [], 'Logo depois de chamar dizerDepois');
await new Promise((resolver) => setTimeout(resolver, 120));
igual(eventos, ['oi'], 'Depois de esperar um pouco')`,
        },
        {
          descricao: 'Respeita o tempo de cada um, e não a ordem das chamadas',
          codigo: js`const eventos = [];
dizerDepois('lento', 60, (texto) => eventos.push(texto));
dizerDepois('rápido', 10, (texto) => eventos.push(texto));
await new Promise((resolver) => setTimeout(resolver, 200));
igual(eventos, ['rápido', 'lento'], 'A ordem em que chegaram')`,
        },
        {
          descricao: 'Chama aoDizer uma vez só',
          codigo: js`let vezes = 0;
dizerDepois('x', 10, () => { vezes++; });
await new Promise((resolver) => setTimeout(resolver, 150));
igual(vezes, 1, 'Quantas vezes aoDizer foi chamada')`,
        },
      ],
      dicas: [
        'É um `setTimeout` com uma função que chama `aoDizer(texto)`.',
        'Resposta: `setTimeout(() => aoDizer(texto), ms);`.',
      ],
      solucao: linhas('function dizerDepois(texto, ms, aoDizer) {', '  setTimeout(() => aoDizer(texto), ms);', '}'),
    },
    {
      titulo: 'A ordem dos avisos',
      enunciado: [
        { tipo: 'p', texto: 'Mostre três mensagens com estes prazos, contados a partir do início do programa:' },
        {
          tipo: 'lista',
          itens: [
            '`Preparando`: imediatamente.',
            '`Pronto`: depois de `30` milissegundos.',
            '`Servido`: depois de `60` milissegundos.',
            'Cada mensagem deve aparecer em uma linha, nessa ordem.',
          ],
        },
      ],
      codigoInicial: '',
      testes: [
        {
          descricao: 'Mostra Preparando, Pronto e Servido, nesta ordem',
          codigo: js`await new Promise((resolver) => setTimeout(resolver, 200));
igual(saida, ['Preparando', 'Pronto', 'Servido'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa setTimeout para esperar',
          codigo: js`verdadeiro((codigoDoAluno.match(/setTimeout/g) ?? []).length >= 2, 'Agende “Pronto” e “Servido” com setTimeout.')`,
        },
      ],
      dicas: [
        'O primeiro aviso é um `console.log` comum, sem espera.',
        'Os outros dois são `setTimeout`, um de `30` e um de `60` milissegundos: `setTimeout(() => console.log("Pronto"), 30);`.',
      ],
      solucao: linhas(
        'console.log("Preparando");',
        'setTimeout(() => console.log("Pronto"), 30);',
        'setTimeout(() => console.log("Servido"), 60);',
      ),
    },
    {
      titulo: 'Cancelar a tempo',
      enunciado: [
        { tipo: 'p', texto: 'Complete `agendar(funcao, ms)`.' },
        {
          tipo: 'lista',
          itens: [
            'Agende a execução de `funcao` para depois de `ms` milissegundos.',
            'Devolva uma função `cancelar`. Se ela for chamada antes do prazo, a função agendada não deve executar.',
            'Cancelar depois da execução não deve causar erro.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            '`setTimeout` devolve um **id**, e `clearTimeout(id)` cancela aquele agendamento, do mesmo jeito que `clearInterval` faz com o `setInterval`.',
        },
      ],
      codigoInicial: linhas(
        'const funcao = () => console.log("Aviso");',
        'const ms = 20;',
        '',
        'function agendar(funcao, ms) {',
        '',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve uma função',
          codigo: js`verdadeiro(typeof agendar(() => {}, 1) === 'function', 'agendar precisa devolver uma função.')`,
        },
        {
          descricao: 'Sem cancelar, a função roda depois do tempo',
          codigo: js`let rodou = 0;
agendar(() => { rodou++; }, 20);
igual(rodou, 0, 'Logo depois de agendar');
await new Promise((resolver) => setTimeout(resolver, 120));
igual(rodou, 1, 'Depois de esperar um pouco')`,
        },
        {
          descricao: 'Cancelando a tempo, a função nunca roda',
          codigo: js`let rodou = 0;
const cancelar = agendar(() => { rodou++; }, 30);
cancelar();
await new Promise((resolver) => setTimeout(resolver, 120));
igual(rodou, 0, 'Quantas vezes a função rodou')`,
        },
        {
          descricao: 'Cancelar depois que já rodou não causa problema',
          codigo: js`let rodou = 0;
const cancelar = agendar(() => { rodou++; }, 10);
await new Promise((resolver) => setTimeout(resolver, 80));
cancelar();
igual(rodou, 1, 'Quantas vezes a função rodou')`,
        },
      ],
      dicas: [
        'Guarde o id: `const id = setTimeout(funcao, ms);`.',
        'Devolva uma função que cancela: `return () => clearTimeout(id);`.',
      ],
      solucao: linhas(
        'function agendar(funcao, ms) {',
        '  const id = setTimeout(funcao, ms);',
        '  return () => clearTimeout(id);',
        '}',
      ),
    },
    {
      titulo: 'Um passo depois do outro',
      enunciado: [
        { tipo: 'p', texto: 'Complete `emSequencia(passos, aoTerminar)`.' },
        {
          tipo: 'lista',
          itens: [
            'Cada passo recebe uma função `proximo` e a chama quando termina.',
            'Execute um passo por vez. Só comece o seguinte depois que o atual chamar `proximo()`.',
            'Depois do último passo, chame `aoTerminar()`. Se a lista estiver vazia, chame `aoTerminar()` diretamente.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'O truque é uma função de dentro, que recebe o índice do passo da vez e se chama de novo, com o índice seguinte, no `proximo` do passo.',
        },
      ],
      codigoInicial: linhas(
        'const passos = [',
        '  (proximo) =>',
        '    setTimeout(() => {',
        '      console.log("Passo 1");',
        '      proximo();',
        '    }, 10),',
        '  (proximo) =>',
        '    setTimeout(() => {',
        '      console.log("Passo 2");',
        '      proximo();',
        '    }, 10),',
        '];',
        'const aoTerminar = () => console.log("Todos os passos terminaram");',
        '',
        'function emSequencia(passos, aoTerminar) {',
        '',
        '}',
        '',
        'emSequencia(passos, aoTerminar);',
        '',
      ),
      testes: [
        {
          descricao: 'Roda os passos em ordem, mesmo que o primeiro demore mais, e só então avisa',
          codigo: js`const eventos = [];
const passo = (nome, ms) => (proximo) => setTimeout(() => { eventos.push(nome); proximo(); }, ms);
emSequencia([passo('a', 30), passo('b', 10), passo('c', 20)], () => eventos.push('fim'));
await new Promise((resolver) => setTimeout(resolver, 250));
igual(eventos, ['a', 'b', 'c', 'fim'], 'A ordem dos eventos')`,
        },
        {
          descricao: 'Sem passos, só avisa que terminou',
          codigo: js`const eventos = [];
emSequencia([], () => eventos.push('fim'));
await new Promise((resolver) => setTimeout(resolver, 50));
igual(eventos, ['fim'], 'Os eventos sem passos')`,
        },
        {
          descricao: 'Avisa uma vez só',
          codigo: js`let fim = 0;
const passo = (proximo) => setTimeout(proximo, 5);
emSequencia([passo, passo], () => { fim++; });
await new Promise((resolver) => setTimeout(resolver, 150));
igual(fim, 1, 'Quantas vezes aoTerminar foi chamada')`,
        },
        {
          descricao: 'O segundo passo só começa quando o primeiro termina',
          codigo: js`const eventos = [];
const lento = (proximo) => { eventos.push('lento começa'); setTimeout(() => { eventos.push('lento termina'); proximo(); }, 40); };
const rapido = (proximo) => { eventos.push('rápido começa'); proximo(); };
emSequencia([lento, rapido], () => {});
await new Promise((resolver) => setTimeout(resolver, 200));
igual(eventos, ['lento começa', 'lento termina', 'rápido começa'], 'A ordem dos eventos')`,
        },
      ],
      dicas: [
        'Crie uma função de dentro, `executar(indice)`. Se `indice` já passou do último passo, chame `aoTerminar()` e saia.',
        'Senão, chame `passos[indice]` entregando como `proximo` uma função que chama `executar(indice + 1)`. No fim, comece com `executar(0)`.',
      ],
      solucao: linhas(
        'function emSequencia(passos, aoTerminar) {',
        '  function executar(indice) {',
        '    if (indice >= passos.length) {',
        '      aoTerminar();',
        '      return;',
        '    }',
        '    passos[indice](() => executar(indice + 1));',
        '  }',
        '  executar(0);',
        '}',
      ),
    },
    {
      titulo: 'Tempo limite',
      enunciado: [
        { tipo: 'p', texto: 'Complete `comTempoLimite(iniciar, ms, aoResponder)`.' },
        {
          tipo: 'lista',
          itens: [
            'Chame `iniciar(aoTerminar)` para começar o trabalho.',
            'Se ele terminar dentro do prazo de `ms` milissegundos, chame `aoResponder` com o resultado recebido.',
            'Se o prazo acabar antes, chame `aoResponder("tempo esgotado")`.',
            '`aoResponder` deve ser chamada somente uma vez, mesmo se o trabalho terminar depois do prazo.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const iniciar = (responder) => setTimeout(() => responder("feito"), 10);',
        'const ms = 100;',
        'const aoResponder = (resposta) => console.log(resposta);',
        '',
        'function comTempoLimite(iniciar, ms, aoResponder) {',
        '',
        '}',
        '',
        'comTempoLimite(iniciar, ms, aoResponder);',
        '',
      ),
      testes: [
        {
          descricao: 'Um trabalho rápido entrega o resultado',
          codigo: js`const respostas = [];
comTempoLimite((fim) => setTimeout(() => fim('feito'), 10), 100, (r) => respostas.push(r));
await new Promise((resolver) => setTimeout(resolver, 250));
igual(respostas, ['feito'], 'As respostas recebidas')`,
        },
        {
          descricao: 'Um trabalho lento estoura o tempo, e responde uma vez só',
          codigo: js`const respostas = [];
comTempoLimite((fim) => setTimeout(() => fim('feito'), 150), 30, (r) => respostas.push(r));
await new Promise((resolver) => setTimeout(resolver, 350));
igual(respostas, ['tempo esgotado'], 'As respostas recebidas')`,
        },
        {
          descricao: 'Nada é respondido na hora',
          codigo: js`const respostas = [];
comTempoLimite((fim) => setTimeout(() => fim('feito'), 20), 100, (r) => respostas.push(r));
igual(respostas, [], 'Logo depois de chamar comTempoLimite');
await new Promise((resolver) => setTimeout(resolver, 200));
igual(respostas, ['feito'], 'Depois de esperar um pouco')`,
        },
      ],
      dicas: [
        'Crie uma variável `let respondeu = false;` e uma função `responder(valor)` que só chama `aoResponder` se ainda não respondeu.',
        'Agende `responder("tempo esgotado")` com `setTimeout` e entregue a mesma `responder` ao `iniciar`: quem chegar primeiro vence.',
      ],
      solucao: linhas(
        'function comTempoLimite(iniciar, ms, aoResponder) {',
        '  let respondeu = false;',
        '  const responder = (valor) => {',
        '    if (respondeu) {',
        '      return;',
        '    }',
        '    respondeu = true;',
        '    aoResponder(valor);',
        '  };',
        '  setTimeout(() => responder("tempo esgotado"), ms);',
        '  iniciar(responder);',
        '}',
      ),
    },
    {
      titulo: 'Uma resposta que vem depois',
      enunciado: [
        { tipo: 'p', texto: 'Complete `responderDepois(valor, aoResponder)`.' },
        {
          tipo: 'lista',
          itens: [
            'Espere `20` milissegundos e chame `aoResponder(valor)` exatamente uma vez.',
            'A chamada não pode ocorrer durante a execução inicial de `responderDepois`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const valor = 7;',
        'const aoResponder = (resposta) => console.log(resposta);',
        '',
        'function responderDepois(valor, aoResponder) {',
        '',
        '}',
        '',
        'responderDepois(valor, aoResponder);',
        '',
      ),
      testes: [
        {
          descricao: 'O valor só é entregue depois',
          codigo: js`let recebido = 'aguardando'; responderDepois(7, (valor) => { recebido = valor; }); igual(recebido, 'aguardando', 'Antes do temporizador'); await new Promise((r) => setTimeout(r, 40)); igual(recebido, 7, 'Depois do temporizador')`,
        },
        {
          descricao: 'Entrega zero e não repete a resposta',
          codigo: js`let chamadas = 0; let recebido; responderDepois(0, (valor) => { chamadas++; recebido = valor; }); await new Promise((r) => setTimeout(r, 50)); igual(recebido, 0, 'Zero recebido'); igual(chamadas, 1, 'Quantidade de respostas')`,
        },
      ],
      dicas: ['Passe uma função ao setTimeout. Essa função é que deve chamar aoResponder(valor).'],
      solucao: 'function responderDepois(valor, aoResponder) {\n  setTimeout(() => aoResponder(valor), 20);\n}',
    },
    {
      titulo: 'Devolver uma forma de cancelar',
      enunciado: [
        { tipo: 'p', texto: 'Complete `adiarAviso(ms, acao)`.' },
        {
          tipo: 'lista',
          itens: [
            'Agende `acao` para depois de `ms` milissegundos.',
            'Devolva uma função de cancelamento. Se ela for chamada antes do prazo, a ação não deve executar.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const ms = 20;',
        'const acao = () => console.log("Aviso agendado");',
        '',
        'function adiarAviso(ms, acao) {',
        '',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'A função devolvida cancela o aviso',
          codigo: js`let chamadas = 0; const cancelar = adiarAviso(20, () => { chamadas++; }); verdadeiro(typeof cancelar === 'function', 'Devolva uma função para cancelar.'); cancelar(); await new Promise((r) => setTimeout(r, 40)); igual(chamadas, 0, 'Aviso cancelado')`,
        },
        {
          descricao: 'Sem cancelamento, o aviso acontece uma vez',
          codigo: js`let chamadas = 0; adiarAviso(10, () => { chamadas++; }); await new Promise((r) => setTimeout(r, 35)); igual(chamadas, 1, 'Aviso executado')`,
        },
      ],
      dicas: [
        'setTimeout devolve um identificador. A função de cancelamento deve usar clearTimeout com esse identificador.',
      ],
      solucao:
        'function adiarAviso(ms, acao) {\n  const identificador = setTimeout(acao, ms);\n  return () => clearTimeout(identificador);\n}',
    },
  ],
};
