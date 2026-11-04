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
            'Complete as duas funções `async`, usando `buscarUsuario(id)`, que já está pronta e não deve ser alterada.',
        },
        {
          tipo: 'lista',
          itens: [
            '`nomesDosUsuarios(ids)`: busque todos os usuários ao mesmo tempo com `Promise.all` e devolva seus nomes na ordem dos ids. O corretor verifica o tempo.',
            '`buscarOuPadrao(id)`: devolva o usuário encontrado. Se a busca falhar, devolva `{ id: id, nome: "Desconhecido" }`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const ids = [1, 2, 3];',
        'const id = 5;',
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
        '',
        'function nomesDosUsuarios(ids) {',
        '',
        '}',
        '',
        'function buscarOuPadrao(id) {',
        '',
        '}',
        '',
        'console.log(await nomesDosUsuarios(ids));',
        'console.log(await buscarOuPadrao(id));',
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
        { tipo: 'p', texto: 'Complete a função `async` `somarDobros(a, b)`.' },
        {
          tipo: 'lista',
          itens: [
            '`dobroDepois(n)` já está pronta: resolve com o dobro após `10` milissegundos e rejeita com `Error("negativo")` para números negativos.',
            'Espere o dobro de `a` e só depois espere o dobro de `b`. Devolva a soma.',
            'Exemplo: `somarDobros(1, 2)` deve resolver com `6`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const a = 1;',
        'const b = 2;',
        '',
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
        '',
        '}',
        '',
        'console.log(await somarDobros(a, b));',
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
        { tipo: 'p', texto: 'Complete a função `async` `somarTodos(ids)`.' },
        {
          tipo: 'lista',
          itens: [
            '`buscarNumero(id)` já está pronta: leva `40` milissegundos e resolve com `id * 10`.',
            'Inicie todas as buscas ao mesmo tempo e devolva a soma dos resultados.',
            'O corretor verifica o tempo: cinco buscas não devem levar cinco vezes o tempo de uma busca.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const ids = [1, 2, 3];',
        '',
        'function buscarNumero(id) {',
        '  return new Promise((resolver) => {',
        '    setTimeout(() => resolver(id * 10), 40);',
        '  });',
        '}',
        '',
        'async function somarTodos(ids) {',
        '',
        '}',
        '',
        'console.log(await somarTodos(ids));',
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
        { tipo: 'p', texto: 'Complete a função `async` `tentarAte(funcaoAsync, maximo)`.' },
        {
          tipo: 'lista',
          itens: [
            'Chame `funcaoAsync` e espere o resultado. Se ela falhar, tente novamente, até o máximo de chamadas no total.',
            'Devolva o valor da primeira tentativa que funcionar.',
            'Se todas falharem, deixe a função rejeitar com o erro da última tentativa.',
          ],
        },
      ],
      codigoInicial: linhas(
        'let chamadas = 0;',
        'const funcaoAsync = async () => {',
        '  chamadas++;',
        '  if (chamadas < 2) throw new Error("Falha temporária");',
        '  return "ok";',
        '};',
        'const maximo = 3;',
        '',
        'async function tentarAte(funcaoAsync, maximo) {',
        '',
        '}',
        '',
        'console.log(await tentarAte(funcaoAsync, maximo));',
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
        { tipo: 'p', texto: 'Complete a função `async` `processarEmOrdem(ids, registro)`.' },
        {
          tipo: 'lista',
          itens: [
            '`processar(id, registro)` já registra o início, espera `10` milissegundos e registra o fim.',
            'Processe um id por vez: só comece o seguinte quando o anterior terminar.',
            'Para `[1, 2]`, o registro deve ficar `["inicio 1", "fim 1", "inicio 2", "fim 2"]`.',
          ],
        },
        {
          tipo: 'nota',
          texto:
            'Um `await` dentro de um `for...of` faz o laço **esperar** a cada volta. É o contrário do `Promise.all`: aqui a ordem importa mais que a pressa.',
        },
      ],
      codigoInicial: linhas(
        'const ids = [1, 2, 3];',
        'const registro = [];',
        '',
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
        '',
        '}',
        '',
        'await processarEmOrdem(ids, registro);',
        'console.log(registro);',
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
        { tipo: 'p', texto: 'Complete `comLimite(promessa, ms)` e devolva uma nova promessa.' },
        {
          tipo: 'lista',
          itens: [
            'Se a promessa recebida terminar dentro do prazo, preserve seu resultado: o mesmo valor ou o mesmo erro.',
            'Se o prazo de `ms` milissegundos acabar antes, rejeite com `new Error("Tempo esgotado")`.',
            'Você pode usar `Promise.race` para disputar a promessa recebida com um temporizador.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const promessa = new Promise((resolver) => setTimeout(() => resolver("ok"), 10));',
        'const ms = 100;',
        '',
        'function comLimite(promessa, ms) {',
        '',
        '}',
        '',
        'console.log(await comLimite(promessa, ms));',
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
        { tipo: 'p', texto: 'Complete a função `async` `buscarAtivos(buscar)`.' },
        {
          tipo: 'lista',
          itens: [
            '`buscar()` devolve uma promessa com uma lista de pessoas que têm `nome` e `ativo`.',
            'Espere a busca e devolva apenas os nomes das pessoas ativas, na ordem recebida.',
            'Se a busca falhar, mantenha o erro.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const usuarios = [',
        '  { nome: "Ana", ativo: true },',
        '  { nome: "Bia", ativo: false },',
        '  { nome: "Caio", ativo: true },',
        '];',
        'const buscar = async () => usuarios;',
        '',
        'async function buscarAtivos(buscar) {',
        '',
        '}',
        '',
        'console.log(await buscarAtivos(buscar));',
        '',
      ),
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
        { tipo: 'p', texto: 'Complete a função `async` `usarRecurso(abrir, usar, fechar)`.' },
        {
          tipo: 'lista',
          itens: [
            'Espere `abrir()` obter o recurso. Depois, espere `usar(recurso)` e devolva seu resultado.',
            'Após o uso, sempre espere `fechar(recurso)`, mesmo se `usar` falhar.',
            'Se `abrir` falhar, não chame `fechar`. Preserve os erros originais; considere que `fechar` sempre funciona.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const recurso = { id: 1, nome: "Recurso de exemplo" };',
        'const abrir = async () => recurso;',
        'const usar = async (item) => item.nome;',
        'const fechar = async () => console.log("Recurso fechado");',
        '',
        'async function usarRecurso(abrir, usar, fechar) {',
        '',
        '}',
        '',
        'console.log(await usarRecurso(abrir, usar, fechar));',
        '',
      ),
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
