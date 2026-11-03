import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const asyncAwait: Licao = {
  slug: 'async-await',
  titulo: 'async e await',
  resumo: 'Escrever código que espera com a cara de código normal.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`.then` funciona, mas encadear muitos deixa o código difícil de ler. O `async/await` é o mesmo mecanismo, escrito de um jeito que lembra código normal, de cima para baixo.',
    },
    {
      tipo: 'p',
      texto:
        'São duas palavras. `async`, na frente de uma função, faz dela uma função que **sempre devolve uma promessa**. `await`, dentro dela, **espera** uma promessa terminar e entrega o valor.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function preparar() {',
        '  console.log("começando");',
        '  await esperar(100);',
        '  console.log("pronto");',
        '  return "bolo";',
        '}',
        '',
        'const resultado = await preparar();',
        'console.log(resultado);',
      ),
      saida: linhas('começando', 'pronto', 'bolo'),
    },
    {
      tipo: 'p',
      texto:
        'Enquanto espera, o `await` **não trava** o resto do programa: só pausa aquela função. E o `return` de uma função `async` vira o valor da promessa.',
    },
    {
      tipo: 'p',
      texto:
        'Para tratar erros, o `try/catch` que você já conhece funciona com `await`: uma promessa rejeitada vira um erro lançado naquele ponto.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function buscar(id) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (id > 0) resolver("item " + id);',
        '      else rejeitar(new Error("id inválido"));',
        '    }, 20);',
        '  });',
        '}',
        '',
        'async function mostrar(id) {',
        '  try {',
        '    const item = await buscar(id);',
        '    console.log(item);',
        '  } catch (erro) {',
        '    console.log("falhou:", erro.message);',
        '  }',
        '}',
        '',
        'await mostrar(1);',
        'await mostrar(0);',
      ),
      saida: linhas('item 1', 'falhou: id inválido'),
    },
    {
      tipo: 'p',
      texto:
        'Cuidado com a espera à toa. Dois `await` seguidos esperam **um depois do outro**. Se as buscas não dependem uma da outra, comece todas juntas com `Promise.all`, que leva só o tempo da mais lenta:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const [primeiro, segundo] = await Promise.all([buscar(1), buscar(2)]);',
        'console.log(primeiro, segundo);',
      ),
      saida: 'item 1 item 2',
    },
    {
      tipo: 'nota',
      texto:
        'O `await` só vale dentro de uma função `async`. O MundoJS também deixa usá-lo direto no nível de cima, como nos exemplos; em projetos de verdade isso só vale dentro de módulos, e fora deles você precisa de uma função `async`.',
    },
    {
      tipo: 'nota',
      texto:
        'Esquecer o `await` é um erro comum: `const item = buscar(1)` guarda a **promessa**, e não o item. Se você imprimir, vai ver algo como `Promise { <pendente> }`.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Nomes e padrão',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `buscarUsuario(id)` já está pronta no código (é a da lição anterior; não mexa nela). Escreva duas funções `async` que a usam:',
        },
        {
          tipo: 'lista',
          itens: [
            '`nomesDosUsuarios(ids)` devolve a lista com o `nome` de cada usuário, na mesma ordem dos `ids`. Faça as buscas **ao mesmo tempo** com `Promise.all`: o corretor confere o tempo.',
            '`buscarOuPadrao(id)` devolve o usuário; se a busca for rejeitada, devolve `{ id: id, nome: "Desconhecido" }` em vez de deixar o erro subir.',
          ],
        },
      ],
      codigoInicial: linhas(
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
        '',
        'function nomesDosUsuarios(ids) {',
        '  // devolva a lista de nomes, buscando todos ao mesmo tempo',
        '}',
        '',
        'function buscarOuPadrao(id) {',
        '  // devolva o usuário, ou um "Desconhecido" se a busca falhar',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'nomesDosUsuarios devolve os nomes na ordem',
          codigo: js`igual(await nomesDosUsuarios([1, 2, 3]), ['Usuário 1', 'Usuário 2', 'Usuário 3'], 'nomesDosUsuarios([1, 2, 3])')`,
        },
        {
          descricao: 'nomesDosUsuarios([]) devolve uma lista vazia',
          codigo: js`igual(await nomesDosUsuarios([]), [], 'nomesDosUsuarios([])')`,
        },
        {
          descricao: 'nomesDosUsuarios devolve uma promessa',
          codigo: js`verdadeiro(nomesDosUsuarios([1]) instanceof Promise, 'nomesDosUsuarios precisa devolver uma promessa: escreva async function.')`,
        },
        {
          descricao: 'nomesDosUsuarios faz as buscas ao mesmo tempo',
          codigo: js`const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const inicio = Date.now();
const nomes = await nomesDosUsuarios(ids);
const gasto = Date.now() - inicio;
igual(nomes.length, 10, 'Quantos nomes vieram');
verdadeiro(gasto < 70, 'As 10 buscas levaram ' + gasto + ' ms: faça todas ao mesmo tempo, com Promise.all.')`,
        },
        {
          descricao: 'buscarOuPadrao devolve o usuário quando a busca dá certo',
          codigo: js`igual(await buscarOuPadrao(5), { id: 5, nome: 'Usuário 5' }, 'buscarOuPadrao(5)')`,
        },
        {
          descricao: 'buscarOuPadrao devolve “Desconhecido” quando a busca falha',
          codigo: js`igual(await buscarOuPadrao(0), { id: 0, nome: 'Desconhecido' }, 'buscarOuPadrao(0)')`,
        },
        {
          descricao: 'Usa async e await',
          codigo: js`verdadeiro(/async\s+function/.test(codigoDoAluno) && /\bawait\b/.test(codigoDoAluno), 'Escreva as funções com async e use await.')`,
        },
      ],
      dicas: [
        'Em `nomesDosUsuarios`, comece todas as buscas de uma vez com `ids.map((id) => buscarUsuario(id))` e espere o grupo com `await Promise.all(...)`.',
        'Depois de esperar, `usuarios.map((usuario) => usuario.nome)` fica só com os nomes.',
        'Em `buscarOuPadrao`, ponha a busca num `try`. Atenção: dentro do `try`, escreva `return await buscarUsuario(id)`. Sem o `await`, a rejeição escapa do `catch`.',
      ],
      solucao: linhas(
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
        '',
        'async function nomesDosUsuarios(ids) {',
        '  const usuarios = await Promise.all(ids.map((id) => buscarUsuario(id)));',
        '  return usuarios.map((usuario) => usuario.nome);',
        '}',
        '',
        'async function buscarOuPadrao(id) {',
        '  try {',
        '    return await buscarUsuario(id);',
        '  } catch (erro) {',
        '    return { id: id, nome: "Desconhecido" };',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Um passo depois do outro',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `dobroDepois(n)` já está pronta: ela devolve uma promessa que, depois de 10 ms, se resolve com o dobro de `n` — ou é rejeitada com `Error("negativo")` se `n` for negativo. Escreva a função `async` `somarDobros(a, b)`, que **espera** o dobro de `a`, depois o dobro de `b`, e devolve a soma dos dois. Por exemplo, `somarDobros(1, 2)` devolve `6`.',
        },
      ],
      codigoInicial: linhas(
        'function dobroDepois(n) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (n < 0) {',
        '        rejeitar(new Error("negativo"));',
        '      } else {',
        '        resolver(n * 2);',
        '      }',
        '    }, 10);',
        '  });',
        '}',
        '',
        'async function somarDobros(a, b) {',
        '  // espere cada dobro e some',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'somarDobros(1, 2) devolve 6',
          codigo: js`igual(await somarDobros(1, 2), 6, 'somarDobros(1, 2)')`,
        },
        {
          descricao: 'somarDobros(5, 0) devolve 10',
          codigo: js`igual(await somarDobros(5, 0), 10, 'somarDobros(5, 0)')`,
        },
        {
          descricao: 'Uma rejeição vira um erro para quem chamou',
          codigo: js`let erro = null;
try { await somarDobros(-1, 2); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'somarDobros(-1, 2) deveria ser rejeitada.');
igual(erro.message, 'negativo', 'A mensagem do erro')`,
        },
        {
          descricao: 'Usa await',
          codigo: js`verdadeiro(/await\s+dobroDepois/.test(codigoDoAluno), 'Espere as promessas com await.')`,
        },
      ],
      dicas: [
        'Dentro de uma função `async`, `const x = await dobroDepois(a);` espera o valor e o entrega.',
        'Faça isso para `a` e para `b`, e devolva a soma: `return x + y;`.',
      ],
      solucao: linhas(
        'function dobroDepois(n) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (n < 0) {',
        '        rejeitar(new Error("negativo"));',
        '      } else {',
        '        resolver(n * 2);',
        '      }',
        '    }, 10);',
        '  });',
        '}',
        '',
        'async function somarDobros(a, b) {',
        '  const x = await dobroDepois(a);',
        '  const y = await dobroDepois(b);',
        '  return x + y;',
        '}',
      ),
    },
    {
      titulo: 'Todas ao mesmo tempo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `buscarNumero(id)` já está pronta: leva 40 ms e se resolve com `id * 10`. Escreva a função `async` `somarTodos(ids)`, que busca **todos os ids ao mesmo tempo** e devolve a soma dos números. O corretor confere o tempo: cinco buscas não podem levar cinco vezes 40 ms.',
        },
      ],
      codigoInicial: linhas(
        'function buscarNumero(id) {',
        '  return new Promise((resolver) => {',
        '    setTimeout(() => resolver(id * 10), 40);',
        '  });',
        '}',
        '',
        'async function somarTodos(ids) {',
        '  // comece todas as buscas juntas e espere o grupo',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'somarTodos([1, 2, 3]) devolve 60',
          codigo: js`igual(await somarTodos([1, 2, 3]), 60, 'somarTodos([1, 2, 3])')`,
        },
        { descricao: 'somarTodos([4]) devolve 40', codigo: js`igual(await somarTodos([4]), 40, 'somarTodos([4])')` },
        {
          descricao: 'Cinco buscas levam o tempo de uma só, e não de cinco',
          codigo: js`const inicio = Date.now();
const soma = await somarTodos([1, 2, 3, 4, 5]);
const gasto = Date.now() - inicio;
igual(soma, 150, 'A soma de cinco buscas');
verdadeiro(gasto < 120, 'Cinco buscas de 40 ms levaram ' + gasto + ' ms: comece todas juntas e espere com Promise.all.')`,
        },
        {
          descricao: 'Uma lista vazia soma 0 (e uma busca isolada vale o seu número)',
          codigo: js`igual(await somarTodos([2]), 20, 'somarTodos([2])');
igual(await somarTodos([]), 0, 'somarTodos([])')`,
        },
      ],
      dicas: [
        'Comece todas as buscas de uma vez: `ids.map((id) => buscarNumero(id))`. Isso dá uma lista de promessas.',
        'Espere o grupo com `await Promise.all(...)` e some os números com `reduce`.',
      ],
      solucao: linhas(
        'function buscarNumero(id) {',
        '  return new Promise((resolver) => {',
        '    setTimeout(() => resolver(id * 10), 40);',
        '  });',
        '}',
        '',
        'async function somarTodos(ids) {',
        '  const numeros = await Promise.all(ids.map((id) => buscarNumero(id)));',
        '  return numeros.reduce((total, numero) => total + numero, 0);',
        '}',
      ),
    },
    {
      titulo: 'Insistir até conseguir',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `async` `tentarAte(funcaoAsync, maximo)`. Ela chama a `funcaoAsync` (que devolve uma promessa) e **espera** o resultado. Se a promessa for rejeitada, tenta de novo, até `maximo` chamadas no total. Devolve o valor da primeira que der certo; se todas falharem, deixa subir o erro da **última** tentativa.',
        },
      ],
      codigoInicial: linhas(
        'async function tentarAte(funcaoAsync, maximo) {',
        '  // um laço com try/catch e await',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Se der certo de primeira, chama uma vez só',
          codigo: js`let chamadas = 0;
const resultado = await tentarAte(async () => { chamadas++; return 'ok'; }, 3);
igual(resultado, 'ok', 'O resultado');
igual(chamadas, 1, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Tenta de novo até dar certo',
          codigo: js`let chamadas = 0;
const instavel = async () => {
  chamadas++;
  if (chamadas < 3) throw new Error('falha ' + chamadas);
  return 'ok';
};
igual(await tentarAte(instavel, 5), 'ok', 'O resultado depois de duas falhas');
igual(chamadas, 3, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Se todas falharem, o erro da última tentativa sobe',
          codigo: js`let chamadas = 0;
const sempre = async () => { chamadas++; throw new Error('falha ' + chamadas); };
let erro = null;
try { await tentarAte(sempre, 2); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Depois de esgotar as tentativas, a promessa deveria ser rejeitada.');
igual(erro.message, 'falha 2', 'A mensagem do último erro');
igual(chamadas, 2, 'Quantas vezes a função foi chamada')`,
        },
        {
          descricao: 'Devolve uma promessa que se resolve com o valor',
          codigo: js`const promessa = tentarAte(async () => 1, 1);
verdadeiro(promessa instanceof Promise, 'tentarAte precisa devolver uma promessa: escreva async function.');
igual(await promessa, 1, 'O valor da promessa')`,
        },
      ],
      dicas: [
        'Use um `for` de `maximo` voltas e guarde o último erro. Dentro do laço, `try { return await funcaoAsync(); } catch (erro) { ultimoErro = erro; }`.',
        'Sem o `await` dentro do `try`, a rejeição escapa do `catch`. Depois do laço, `throw ultimoErro;`.',
      ],
      solucao: linhas(
        'async function tentarAte(funcaoAsync, maximo) {',
        '  let ultimoErro;',
        '  for (let i = 0; i < maximo; i++) {',
        '    try {',
        '      return await funcaoAsync();',
        '    } catch (erro) {',
        '      ultimoErro = erro;',
        '    }',
        '  }',
        '  throw ultimoErro;',
        '}',
      ),
    },
    {
      titulo: 'Um de cada vez, em ordem',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A função `processar(id, registro)` já está pronta: ela anota `"inicio " + id` na lista `registro`, espera 10 ms e anota `"fim " + id`. Escreva a função `async` `processarEmOrdem(ids, registro)`, que processa os ids **um de cada vez**: o seguinte só começa quando o anterior termina. Para `[1, 2]`, o registro fica `["inicio 1", "fim 1", "inicio 2", "fim 2"]`.',
        },
        {
          tipo: 'nota',
          texto:
            'Um `await` dentro de um `for...of` faz o laço **esperar** a cada volta. É o contrário do `Promise.all`: aqui a ordem importa mais que a pressa.',
        },
      ],
      codigoInicial: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function processar(id, registro) {',
        '  registro.push("inicio " + id);',
        '  await esperar(10);',
        '  registro.push("fim " + id);',
        '}',
        '',
        'async function processarEmOrdem(ids, registro) {',
        '  // processe um id de cada vez',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Cada id só começa quando o anterior termina',
          codigo: js`const registro = [];
await processarEmOrdem([1, 2, 3], registro);
igual(registro, ['inicio 1', 'fim 1', 'inicio 2', 'fim 2', 'inicio 3', 'fim 3'], 'O registro')`,
        },
        {
          descricao: 'Um id só registra o começo e o fim dele (e uma lista vazia não registra nada)',
          codigo: js`const registro = [];
await processarEmOrdem([7], registro);
igual(registro, ['inicio 7', 'fim 7'], 'O registro de um id');
const vazio = [];
await processarEmOrdem([], vazio);
igual(vazio, [], 'O registro de uma lista vazia')`,
        },
        {
          descricao: 'Só devolve quando o último termina',
          codigo: js`const registro = [];
await processarEmOrdem([1], registro);
igual(registro.length, 2, 'O registro logo depois de esperar a função')`,
        },
      ],
      dicas: [
        'Percorra com `for (const id of ids)`.',
        'Dentro do laço, `await processar(id, registro);`: o laço espera antes de passar para o próximo.',
      ],
      solucao: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function processar(id, registro) {',
        '  registro.push("inicio " + id);',
        '  await esperar(10);',
        '  registro.push("fim " + id);',
        '}',
        '',
        'async function processarEmOrdem(ids, registro) {',
        '  for (const id of ids) {',
        '    await processar(id, registro);',
        '  }',
        '}',
      ),
    },
    {
      titulo: 'Tempo limite com async',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `comLimite(promessa, ms)`, que devolve uma promessa. Se a `promessa` terminar em até `ms` milissegundos, a nova termina do mesmo jeito (com o mesmo valor, ou rejeitada com o mesmo erro). Se **demorar mais**, a nova é rejeitada com `new Error("Tempo esgotado")`. Dica: faça uma corrida com `Promise.race` entre a promessa e uma promessa que se rejeita sozinha depois de `ms`.',
        },
      ],
      codigoInicial: linhas(
        'function comLimite(promessa, ms) {',
        '  // corrida entre a promessa e um temporizador',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Uma promessa rápida entrega o valor',
          codigo: js`const rapida = new Promise((resolver) => setTimeout(() => resolver('ok'), 10));
igual(await comLimite(rapida, 100), 'ok', 'comLimite com uma promessa rápida')`,
        },
        {
          descricao: 'Uma promessa lenta é rejeitada com “Tempo esgotado”',
          codigo: js`const lenta = new Promise((resolver) => setTimeout(() => resolver('tarde'), 200));
let erro = null;
try { await comLimite(lenta, 30); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Uma promessa lenta deveria ser rejeitada.');
igual(erro.message, 'Tempo esgotado', 'A mensagem do erro')`,
        },
        {
          descricao: 'Uma promessa que falha depressa mantém o erro dela',
          codigo: js`const ruim = new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error('falhou')), 10));
ruim.catch(() => {});
let erro = null;
try { await comLimite(ruim, 100); } catch (e) { erro = e; }
verdadeiro(erro instanceof Error, 'Uma promessa rejeitada deveria continuar rejeitada.');
igual(erro.message, 'falhou', 'A mensagem do erro')`,
        },
        {
          descricao: 'Devolve uma promessa',
          codigo: js`verdadeiro(comLimite(Promise.resolve(1), 50) instanceof Promise, 'comLimite precisa devolver uma promessa.')`,
        },
      ],
      dicas: [
        'A promessa do limite é `new Promise((_, rejeitar) => setTimeout(() => rejeitar(new Error("Tempo esgotado")), ms))`.',
        'Resposta: `return Promise.race([promessa, limite]);`. Quem terminar primeiro, vence.',
      ],
      solucao: linhas(
        'function comLimite(promessa, ms) {',
        '  const limite = new Promise((_, rejeitar) => {',
        '    setTimeout(() => rejeitar(new Error("Tempo esgotado")), ms);',
        '  });',
        '  return Promise.race([promessa, limite]);',
        '}',
      ),
    },
    {
      titulo: 'Selecionar depois da busca',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie a função async `buscarAtivos(buscar)`. A função buscar devolve uma promessa com pessoas que têm nome e ativo. Espere a busca e devolva os nomes das pessoas ativas, na ordem recebida. Não esconda erros da busca.',
        },
      ],
      codigoInicial: 'async function buscarAtivos(buscar) {\n  // espere a lista antes de selecionar os nomes\n}\n',
      testes: [
        {
          descricao: 'Seleciona somente os nomes ativos',
          codigo: js`igual(await buscarAtivos(async () => [{ nome: 'Ana', ativo: true }, { nome: 'Bia', ativo: false }, { nome: 'Caio', ativo: true }]), ['Ana', 'Caio'], 'Ativos')`,
        },
        { descricao: 'Trata lista vazia', codigo: js`igual(await buscarAtivos(async () => []), [], 'Sem pessoas')` },
        {
          descricao: 'A falha da busca continua visível a quem chamou',
          codigo: js`const original = new Error('busca falhou'); let recebido; try { await buscarAtivos(async () => { throw original; }); } catch (e) { recebido = e; } verdadeiro(recebido === original, 'Deixe o erro da busca subir.')`,
        },
      ],
      dicas: ['Guarde await buscar() numa variável e só depois aplique filter e map.'],
      solucao:
        'async function buscarAtivos(buscar) {\n  const pessoas = await buscar();\n  return pessoas.filter((pessoa) => pessoa.ativo).map((pessoa) => pessoa.nome);\n}',
    },
    {
      titulo: 'Fechar o recurso depois de usar',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie a função async `usarRecurso(abrir, usar, fechar)`. Espere abrir() obter um recurso. Depois, espere usar(recurso) e devolva seu resultado. Após o uso, sempre espere fechar(recurso), mesmo se usar falhar. Se abrir falhar, não há recurso para fechar. Preserve os erros originais; considere que fechar sempre funciona.',
        },
      ],
      codigoInicial:
        'async function usarRecurso(abrir, usar, fechar) {\n  // obtenha o recurso antes do try e feche no finally\n}\n',
      testes: [
        {
          descricao: 'Só fecha depois de o uso assíncrono terminar',
          codigo: js`const passos = []; const recurso = { id: 1 }; const valor = await usarRecurso(async () => { passos.push('abrir'); return recurso; }, async (r) => { await Promise.resolve(); verdadeiro(r === recurso, 'Use o recurso aberto.'); passos.push('usar'); return 42; }, async (r) => { verdadeiro(r === recurso, 'Feche o mesmo recurso.'); passos.push('fechar'); }); igual(valor, 42, 'Resultado'); igual(passos, ['abrir', 'usar', 'fechar'], 'Ordem')`,
        },
        {
          descricao: 'Fecha mesmo se o uso falhar e preserva o erro',
          codigo: js`const original = new Error('falha no uso'); let fechou = false; let recebido; try { await usarRecurso(async () => 'recurso', async () => { throw original; }, async () => { fechou = true; }); } catch (e) { recebido = e; } verdadeiro(fechou, 'O finally precisa fechar o recurso.'); verdadeiro(recebido === original, 'Preserve o erro do uso.')`,
        },
        {
          descricao: 'Não fecha um recurso que não chegou a abrir',
          codigo: js`const original = new Error('não abriu'); let fechou = false; let recebido; try { await usarRecurso(async () => { throw original; }, async () => 1, async () => { fechou = true; }); } catch (e) { recebido = e; } verdadeiro(recebido === original, 'Preserve o erro da abertura.'); igual(fechou, false, 'Não havia recurso para fechar')`,
        },
      ],
      dicas: [
        'Depois de obter o recurso, use try com return await usar(recurso). Coloque await fechar(recurso) no finally. O await antes do return é importante para esperar o uso antes de fechar.',
      ],
      solucao:
        'async function usarRecurso(abrir, usar, fechar) {\n  const recurso = await abrir();\n  try {\n    return await usar(recurso);\n  } finally {\n    await fechar(recurso);\n  }\n}',
    },
  ],
};
