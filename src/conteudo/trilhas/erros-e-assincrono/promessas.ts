import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const promessas: Licao = {
  slug: 'promessas',
  titulo: 'Promessas',
  resumo: 'Promise, then, catch e Promise.all.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Funções de retorno resolvem, mas se enrolam quando uma coisa depende da outra, que depende da outra... A **promessa** é um objeto que representa um resultado que **ainda vai chegar**. Ela pode terminar bem (*resolvida*, com um valor) ou mal (*rejeitada*, com um erro).',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => {',
        '    setTimeout(resolver, ms);',
        '  });',
        '}',
        '',
        'esperar(100).then(() => {',
        '  console.log("passaram 100 ms");',
        '});',
        '',
        'console.log("não espera");',
      ),
      saida: linhas('não espera', 'passaram 100 ms'),
    },
    {
      tipo: 'p',
      texto:
        'Quem **cria** a promessa recebe duas funções: `resolver(valor)`, para terminar bem, e `rejeitar(erro)`, para terminar mal. Quem **usa** a promessa liga o que fazer depois com `.then` (se deu certo) e `.catch` (se deu errado):',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function dividirDepois(a, b) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (b === 0) {',
        '        rejeitar(new Error("divisão por zero"));',
        '      } else {',
        '        resolver(a / b);',
        '      }',
        '    }, 50);',
        '  });',
        '}',
        '',
        'dividirDepois(10, 2)',
        '  .then((resultado) => console.log("resultado:", resultado))',
        '  .catch((erro) => console.log("erro:", erro.message));',
        '',
        'dividirDepois(1, 0)',
        '  .then((resultado) => console.log("resultado:", resultado))',
        '  .catch((erro) => console.log("erro:", erro.message));',
      ),
      saida: linhas('resultado: 5', 'erro: divisão por zero'),
    },
    {
      tipo: 'p',
      texto:
        'O `.then` devolve **outra promessa**, e é isso que permite encadear passos, um depois do outro. O valor devolvido num `.then` chega ao seguinte:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'Promise.resolve(2)',
        '  .then((n) => n * 10)',
        '  .then((n) => n + 1)',
        '  .then((n) => console.log(n));',
      ),
      saida: '21',
    },
    {
      tipo: 'p',
      texto:
        'Para esperar **várias** promessas ao mesmo tempo, use `Promise.all`. Ela devolve uma promessa com a lista dos resultados, **na ordem em que você passou** — mesmo que terminem fora de ordem:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const depois = (ms, valor) => new Promise((resolver) => setTimeout(() => resolver(valor), ms));',
        '',
        'Promise.all([depois(60, "lenta"), depois(10, "rápida")]).then((resultados) => {',
        '  console.log(resultados);',
        '});',
      ),
      saida: "[ 'lenta', 'rápida' ]",
    },
    {
      tipo: 'p',
      texto:
        'Uma última regra de ouro: o que está num `.then` roda **antes** de qualquer `setTimeout`, mesmo que o tempo seja zero.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'console.log("A");',
        'setTimeout(() => console.log("D: setTimeout"), 0);',
        'Promise.resolve().then(() => console.log("C: promessa"));',
        'console.log("B");',
      ),
      saida: linhas('A', 'B', 'C: promessa', 'D: setTimeout'),
    },
  ],
  exercicios: [
    {
      titulo: 'Esperar e buscar',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções que **devolvem promessas**:' },
        {
          tipo: 'lista',
          itens: [
            '`esperar(ms)` devolve uma promessa que se resolve (sem valor) depois de `ms` milissegundos.',
            '`buscarUsuario(id)` devolve uma promessa que, depois de **10 milissegundos**, se resolve com `{ id: id, nome: "Usuário " + id }` — se `id` for maior que zero. Para `id` zero ou negativo, a promessa é **rejeitada** com `new Error("Usuário não encontrado")`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const ms = 50;',
        'const id = 1;',
        '',
        'function esperar(ms) {',
        '',
        '}',
        '',
        'function buscarUsuario(id) {',
        '',
        '}',
        '',
        'console.log(await esperar(ms));',
        'console.log(await buscarUsuario(id));',
        '',
      ),
      testes: [
        {
          descricao: 'esperar(50) só termina depois de uns 50 ms',
          codigo: js`const inicio = Date.now();
await esperar(50);
const gasto = Date.now() - inicio;
verdadeiro(gasto >= 40, 'esperar(50) terminou depois de só ' + gasto + ' ms.')`,
        },
        {
          descricao: 'esperar devolve uma promessa',
          codigo: js`verdadeiro(esperar(1) instanceof Promise, 'esperar precisa devolver uma promessa.')`,
        },
        {
          descricao: 'buscarUsuario(1) se resolve com o usuário',
          codigo: js`igual(await buscarUsuario(1), { id: 1, nome: 'Usuário 1' }, 'buscarUsuario(1)')`,
        },
        {
          descricao: 'buscarUsuario(7) se resolve com o usuário 7',
          codigo: js`igual(await buscarUsuario(7), { id: 7, nome: 'Usuário 7' }, 'buscarUsuario(7)')`,
        },
        {
          descricao: 'buscarUsuario(0) é rejeitada com “Usuário não encontrado”',
          codigo: js`let erro = null;
try { await buscarUsuario(0); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'buscarUsuario(0) deveria ser rejeitada com um Error.');
igual(erro.message, 'Usuário não encontrado', 'A mensagem do erro')`,
        },
        {
          descricao: 'buscarUsuario demora um pouco, e não responde na hora',
          codigo: js`const inicio = Date.now();
await buscarUsuario(1);
const gasto = Date.now() - inicio;
verdadeiro(gasto >= 5, 'buscarUsuario(1) respondeu em ' + gasto + ' ms; deveria esperar uns 10 ms antes de resolver.')`,
        },
      ],
      dicas: [
        'Uma promessa nasce assim: `new Promise((resolver, rejeitar) => { ... })`. Dentro dela, use `setTimeout`.',
        'Para terminar bem, chame `resolver(valor)`. Para terminar mal, `rejeitar(new Error("..."))`.',
        'Em `esperar`, o próprio `resolver` pode ser o que o `setTimeout` chama: `setTimeout(resolver, ms)`.',
      ],
      solucao: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => {',
        '    setTimeout(resolver, ms);',
        '  });',
        '}',
        '',
        'function buscarUsuario(id) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (id > 0) {',
        '        resolver({ id: id, nome: "Usuário " + id });',
        '      } else {',
        '        rejeitar(new Error("Usuário não encontrado"));',
        '      }',
        '    }, 10);',
        '  });',
        '}',
      ),
    },
    {
      titulo: 'Encadeando passos',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `calcular(n)`, que devolve uma **promessa**. Comece de uma promessa já resolvida com `n` (`Promise.resolve(n)`) e encadeie dois `.then`: o primeiro **multiplica por 3** e o segundo **subtrai 1**. Por exemplo, `calcular(4)` se resolve com `11`.',
        },
      ],
      codigoInicial: linhas(
        'const n = 4;',
        '',
        'function calcular(n) {',
        '',
        '}',
        '',
        'console.log(await calcular(n));',
        '',
      ),
      testes: [
        { descricao: 'calcular(4) se resolve com 11', codigo: js`igual(await calcular(4), 11, 'calcular(4)')` },
        { descricao: 'calcular(0) se resolve com -1', codigo: js`igual(await calcular(0), -1, 'calcular(0)')` },
        {
          descricao: 'Devolve uma promessa',
          codigo: js`verdadeiro(calcular(1) instanceof Promise, 'calcular precisa devolver uma promessa.')`,
        },
        {
          descricao: 'Usa dois .then encadeados',
          codigo: js`verdadeiro((codigoDoAluno.match(/[.]then[(]/g) ?? []).length >= 2, 'Encadeie dois .then, um para cada passo.')`,
        },
      ],
      dicas: [
        'Cada `.then` recebe o valor do passo anterior e devolve o valor para o próximo.',
        'Resposta: `Promise.resolve(n).then((x) => x * 3).then((x) => x - 1)`.',
      ],
      solucao: linhas(
        'function calcular(n) {',
        '  return Promise.resolve(n)',
        '    .then((x) => x * 3)',
        '    .then((x) => x - 1);',
        '}',
      ),
    },
    {
      titulo: 'Plano B',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `valorOuReserva(promessa, reserva)`, que devolve uma nova promessa. Se a `promessa` se resolver, a nova se resolve com o mesmo valor. Se a `promessa` for **rejeitada**, a nova se resolve com a `reserva`, em vez de falhar. Use `.catch`.',
        },
      ],
      codigoInicial: linhas(
        'const promessa = Promise.resolve(5);',
        'const reserva = 0;',
        '',
        'function valorOuReserva(promessa, reserva) {',
        '',
        '}',
        '',
        'console.log(await valorOuReserva(promessa, reserva));',
        '',
      ),
      testes: [
        {
          descricao: 'Uma promessa que dá certo mantém o valor',
          codigo: js`igual(await valorOuReserva(Promise.resolve(5), 0), 5, 'valorOuReserva com uma promessa resolvida')`,
        },
        {
          descricao: 'Uma promessa rejeitada vira a reserva',
          codigo: js`const falha = Promise.reject(new Error('x'));
falha.catch(() => {});
igual(await valorOuReserva(falha, 'reserva'), 'reserva', 'valorOuReserva com uma promessa rejeitada')`,
        },
        {
          descricao: 'A reserva pode ser zero',
          codigo: js`const falha = Promise.reject(new Error('x'));
falha.catch(() => {});
igual(await valorOuReserva(falha, 0), 0, 'A reserva 0')`,
        },
        {
          descricao: 'Devolve uma promessa',
          codigo: js`verdadeiro(valorOuReserva(Promise.resolve(1), 0) instanceof Promise, 'valorOuReserva precisa devolver uma promessa.')`,
        },
      ],
      dicas: [
        'Toda promessa tem `.catch`, que recebe uma função para o caso de rejeição.',
        'Resposta: `return promessa.catch(() => reserva);`. O que o `catch` devolve vira o valor da promessa nova.',
      ],
      solucao: linhas('function valorOuReserva(promessa, reserva) {', '  return promessa.catch(() => reserva);', '}'),
    },
    {
      titulo: 'Somando tarefas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `somarTarefas(tarefas)`. Cada tarefa é uma **função** que, ao ser chamada, começa um trabalho e devolve uma promessa de número. `somarTarefas` começa **todas as tarefas ao mesmo tempo**, espera todas com `Promise.all` e devolve uma promessa com a **soma** dos números. Para uma lista vazia, a soma é `0`. Se qualquer tarefa for rejeitada, a promessa devolvida também é.',
        },
        {
          tipo: 'nota',
          texto:
            'O trabalho só começa quando a tarefa é **chamada**. Por isso a pressa depende de você: chame todas de uma vez, e só depois espere o grupo.',
        },
      ],
      codigoInicial: linhas(
        'const tarefas = [',
        '  () => Promise.resolve(10),',
        '  () => Promise.resolve(20),',
        '  () => Promise.resolve(30),',
        '];',
        '',
        'function somarTarefas(tarefas) {',
        '',
        '}',
        '',
        'console.log(await somarTarefas(tarefas));',
        '',
      ),
      testes: [
        {
          descricao: 'Soma os valores das tarefas',
          codigo: js`const depois = (ms, valor) => new Promise((resolver) => setTimeout(() => resolver(valor), ms));
igual(await somarTarefas([() => depois(30, 1), () => depois(10, 2), () => depois(20, 3)]), 6, 'A soma de 1, 2 e 3')`,
        },
        {
          descricao: 'Uma lista vazia soma 0 (e uma tarefa só vale o número dela)',
          codigo: js`igual(await somarTarefas([() => Promise.resolve(5)]), 5, 'Uma tarefa de valor 5');
igual(await somarTarefas([]), 0, 'somarTarefas([])')`,
        },
        {
          descricao: 'As tarefas andam juntas, e não uma depois da outra',
          codigo: js`const depois = (ms, valor) => new Promise((resolver) => setTimeout(() => resolver(valor), ms));
const tarefas = [() => depois(40, 1), () => depois(40, 1), () => depois(40, 1)];
const inicio = Date.now();
const soma = await somarTarefas(tarefas);
const gasto = Date.now() - inicio;
igual(soma, 3, 'A soma');
verdadeiro(gasto < 100, 'Três tarefas de 40 ms levaram ' + gasto + ' ms: chame todas de uma vez e espere com Promise.all.')`,
        },
        {
          descricao: 'Se uma tarefa é rejeitada, a soma também é',
          codigo: js`let erro = null;
try {
  await somarTarefas([() => Promise.resolve(1), () => Promise.reject(new Error('falhou'))]);
} catch (e) {
  erro = e;
}
verdadeiro(erro instanceof Error, 'A promessa devolvida deveria ser rejeitada.');
igual(erro.message, 'falhou', 'A mensagem do erro')`,
        },
      ],
      dicas: [
        'Para começar todas, chame cada uma: `tarefas.map((tarefa) => tarefa())`. Isso dá uma lista de promessas.',
        '`Promise.all(...)` espera todas e entrega a lista dos valores. Encadeie um `.then` que soma, com um laço ou com `reduce`.',
      ],
      solucao: linhas(
        'function somarTarefas(tarefas) {',
        '  const promessas = tarefas.map((tarefa) => tarefa());',
        '  return Promise.all(promessas).then((valores) => valores.reduce((total, valor) => total + valor, 0));',
        '}',
      ),
    },
    {
      titulo: 'A mais rápida',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `maisRapida(promessas)`, que devolve uma promessa com o resultado da **primeira** promessa da lista que terminar.',
        },
        {
          tipo: 'nota',
          texto:
            '`Promise.all` espera todas. `Promise.race` (“corrida”) faz o contrário: devolve uma promessa que termina, bem ou mal, assim que a **primeira** terminar.',
        },
      ],
      codigoInicial: linhas(
        'const promessas = [',
        '  new Promise((resolver) => setTimeout(() => resolver("lenta"), 30)),',
        '  new Promise((resolver) => setTimeout(() => resolver("rápida"), 10)),',
        '];',
        '',
        'function maisRapida(promessas) {',
        '',
        '}',
        '',
        'console.log(await maisRapida(promessas));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve o valor da promessa mais rápida',
          codigo: js`const depois = (ms, valor) => new Promise((resolver) => setTimeout(() => resolver(valor), ms));
igual(await maisRapida([depois(60, 'lenta'), depois(10, 'rápida')]), 'rápida', 'A vencedora')`,
        },
        {
          descricao: 'Com uma promessa só, devolve o valor dela',
          codigo: js`igual(await maisRapida([Promise.resolve('única')]), 'única', 'maisRapida com uma promessa')`,
        },
        {
          descricao: 'Se a mais rápida for rejeitada, a corrida também é',
          codigo: js`const rapidaRuim = new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('falhou')), 10));
rapidaRuim.catch(() => {});
const lenta = new Promise((resolver) => setTimeout(() => resolver('ok'), 60));
let erro = null;
try { await maisRapida([lenta, rapidaRuim]); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'A promessa devolvida deveria ser rejeitada.');
igual(erro.message, 'falhou', 'A mensagem do erro')`,
        },
        {
          descricao: 'Usa Promise.race',
          codigo: js`verdadeiro(codigoDoAluno.includes('Promise.race'), 'Resolva com Promise.race.')`,
        },
      ],
      dicas: [
        'A corrida entre promessas se faz com `Promise.race`, que recebe a lista.',
        'Resposta: `return Promise.race(promessas);`.',
      ],
      solucao: linhas('function maisRapida(promessas) {', '  return Promise.race(promessas);', '}'),
    },
    {
      titulo: 'Quem chega primeiro?',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'O programa abaixo mostra as mensagens fora de ordem. Agende, com uma **promessa já resolvida**, a mensagem `3: promessa`, para que a saída final seja: `1: começa`, `2: síncrono`, `3: promessa`, `4: timeout`.',
        },
        {
          tipo: 'nota',
          texto:
            'O que está num `.then` roda **antes** de qualquer `setTimeout`, mesmo que o tempo seja zero. É a regra de ouro da lição.',
        },
      ],
      codigoInicial: linhas(
        'console.log("1: começa");',
        'setTimeout(() => console.log("4: timeout"), 0);',
        'console.log("2: síncrono");',
        '',
      ),
      testes: [
        {
          descricao: 'A saída termina na ordem 1, 2, 3, 4',
          codigo: js`await new Promise((resolver) => setTimeout(resolver, 100));
igual(saida, ['1: começa', '2: síncrono', '3: promessa', '4: timeout'], 'As linhas mostradas')`,
        },
        {
          descricao: 'Usa uma promessa com .then',
          codigo: js`verdadeiro(/Promise[.]resolve[(][)]/.test(codigoDoAluno) && /[.]then[(]/.test(codigoDoAluno), 'Use Promise.resolve().then(...) para agendar a mensagem 3.')`,
        },
      ],
      dicas: [
        '`Promise.resolve()` cria uma promessa que já nasce resolvida, e o `.then` dela roda logo depois do código atual.',
        'Acrescente: `Promise.resolve().then(() => console.log("3: promessa"));`.',
      ],
      solucao: linhas(
        'console.log("1: começa");',
        'setTimeout(() => console.log("4: timeout"), 0);',
        'console.log("2: síncrono");',
        '',
        'Promise.resolve().then(() => console.log("3: promessa"));',
      ),
    },
    {
      titulo: 'Uma promessa vira um resultado',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `resultadoDaPromessa(promessa)`, que devolve outra promessa. Se houver sucesso, ela resolve com `{ ok: true, valor }`; se houver rejeição com Error, resolve com `{ ok: false, mensagem }`. Trate a falha com catch, sem deixar a promessa final rejeitada.',
        },
      ],
      codigoInicial: linhas(
        'const promessa = Promise.resolve(7);',
        '',
        'function resultadoDaPromessa(promessa) {',
        '',
        '}',
        '',
        'console.log(await resultadoDaPromessa(promessa));',
        '',
      ),
      testes: [
        {
          descricao: 'Transforma valores resolvidos sem perder zero',
          codigo: js`igual(await resultadoDaPromessa(Promise.resolve(7)), { ok: true, valor: 7 }, 'Sucesso'); igual(await resultadoDaPromessa(Promise.resolve(0)), { ok: true, valor: 0 }, 'Zero')`,
        },
        {
          descricao: 'A rejeição vira um objeto resolvido',
          codigo: js`const falha = Promise.reject(new Error('indisponível')); falha.catch(() => {}); igual(await resultadoDaPromessa(falha), { ok: false, mensagem: 'indisponível' }, 'Falha transformada')`,
        },
      ],
      dicas: ['Encadeie then para montar o objeto de sucesso e catch para montar o objeto de falha.'],
      solucao:
        'function resultadoDaPromessa(promessa) {\n  return promessa.then((valor) => ({ ok: true, valor })).catch((erro) => ({ ok: false, mensagem: erro.message }));\n}',
    },
    {
      titulo: 'Montar um placar com duas buscas',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `montarPlacar(nomePrometido, pontosPrometidos)`, que espera as duas promessas e devolve uma promessa com o texto no formato `"Ana: 12"`. Se uma delas falhar, preserve a rejeição original. Use Promise.all e then.',
        },
      ],
      codigoInicial: linhas(
        'const nomePrometido = Promise.resolve("Ana");',
        'const pontosPrometidos = Promise.resolve(12);',
        '',
        'function montarPlacar(nomePrometido, pontosPrometidos) {',
        '',
        '}',
        '',
        'console.log(await montarPlacar(nomePrometido, pontosPrometidos));',
        '',
      ),
      testes: [
        {
          descricao: 'Combina nome e pontos, inclusive zero',
          codigo: js`igual(await montarPlacar(Promise.resolve('Ana'), Promise.resolve(12)), 'Ana: 12', 'Placar'); igual(await montarPlacar(Promise.resolve('Bia'), Promise.resolve(0)), 'Bia: 0', 'Zero ponto')`,
        },
        {
          descricao: 'Preserva o erro de uma busca rejeitada',
          codigo: js`const original = new Error('sem pontos'); const falha = Promise.reject(original); falha.catch(() => {}); let recebido; try { await montarPlacar(Promise.resolve('Ana'), falha); } catch (e) { recebido = e; } verdadeiro(recebido === original, 'Não esconda nem troque a rejeição original.')`,
        },
      ],
      dicas: ['Promise.all mantém os resultados na ordem da lista de promessas, mesmo que terminem em outra ordem.'],
      solucao:
        'function montarPlacar(nomePrometido, pontosPrometidos) {\n  return Promise.all([nomePrometido, pontosPrometidos]).then(([nome, pontos]) => `${nome}: ${pontos}`);\n}',
    },
  ],
};
