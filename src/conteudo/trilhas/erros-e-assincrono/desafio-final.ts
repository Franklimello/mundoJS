import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desafioFinal: Licao = {
  slug: 'desafio-final',
  titulo: 'Desafio: o carregador de dados',
  resumo: 'Promessas, async/await, erros e temporizadores juntos, num carregador que não desiste.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Programas de verdade buscam dados que podem demorar ou falhar, e precisam seguir em frente mesmo assim. Neste desafio, você junta tudo desta trilha para montar um carregador de dados, em quatro etapas. A base é a função de sempre: `buscarUsuario(id)` devolve uma promessa que se resolve com o usuário, ou é rejeitada para ids que não existem.',
    },
    {
      tipo: 'p',
      texto:
        'A peça-chave é tratar o erro **de cada item**, para que uma falha não derrube o grupo: o `.catch` fica colado em cada busca, antes de o `Promise.all` juntar tudo.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function buscarUsuario(id) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (id > 0) resolver({ id, nome: "Usuário " + id });',
        '      else rejeitar(new Error("não encontrado"));',
        '    }, 10);',
        '  });',
        '}',
        '',
        'const nomes = await Promise.all(',
        '  [1, 0, 2].map((id) => buscarUsuario(id).then((usuario) => usuario.nome).catch(() => "falhou")),',
        ');',
        'console.log(nomes);',
      ),
      saida: "[ 'Usuário 1', 'falhou', 'Usuário 2' ]",
    },
    {
      tipo: 'nota',
      texto:
        'Cada exercício é uma etapa independente. Se uma travar, as outras continuam possíveis, e os testes de cada uma dizem o que falta.',
    },
  ],
  exercicios: [
    {
      titulo: 'Sucessos e falhas',
      enunciado: [
        { tipo: 'p', texto: 'Complete a função `async` `carregar(ids)`, usando `buscarUsuario`, que já está pronta.' },
        {
          tipo: 'lista',
          itens: [
            'Faça todas as buscas ao mesmo tempo. Uma falha não pode interromper as demais.',
            'Devolva `{ usuarios, falhas }`: `usuarios` contém os nomes encontrados; `falhas` contém os ids que falharam.',
            'Nas duas listas, mantenha a ordem dos ids recebidos.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const ids = [1, 0, 2, -3];',
        '',
        'function buscarUsuario(id) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (id > 0) {',
        '        resolver({ id: id, nome: "Usuário " + id });',
        '      } else {',
        '        rejeitar(new Error("não encontrado"));',
        '      }',
        '    }, 10);',
        '  });',
        '}',
        '',
        'async function carregar(ids) {',
        '',
        '}',
        '',
        'console.log(await carregar(ids));',
        '',
      ),
      testes: [
        {
          descricao: 'Separa os nomes encontrados dos ids que falharam',
          codigo: js`igual(
  await carregar([1, 0, 2, -3]),
  { usuarios: ['Usuário 1', 'Usuário 2'], falhas: [0, -3] },
  'carregar([1, 0, 2, -3])',
)`,
        },
        {
          descricao: 'Se tudo der certo, não há falhas',
          codigo: js`igual(await carregar([4, 5]), { usuarios: ['Usuário 4', 'Usuário 5'], falhas: [] }, 'carregar([4, 5])')`,
        },
        {
          descricao: 'Se tudo falhar, não há usuários',
          codigo: js`igual(await carregar([0, -1]), { usuarios: [], falhas: [0, -1] }, 'carregar([0, -1])')`,
        },
        {
          descricao: 'Uma lista vazia dá dois resultados vazios',
          codigo: js`igual(await carregar([3]), { usuarios: ['Usuário 3'], falhas: [] }, 'carregar([3])');
igual(await carregar([]), { usuarios: [], falhas: [] }, 'carregar([])')`,
        },
        {
          descricao: 'As buscas andam ao mesmo tempo',
          codigo: js`const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const inicio = Date.now();
const resultado = await carregar(ids);
const gasto = Date.now() - inicio;
igual(resultado.usuarios.length, 10, 'Quantos usuários vieram');
verdadeiro(gasto < 70, 'As 10 buscas levaram ' + gasto + ' ms: comece todas juntas, com Promise.all.')`,
        },
      ],
      dicas: [
        'Transforme cada id numa promessa que **nunca é rejeitada**: `buscarUsuario(id).then((usuario) => ({ id, nome: usuario.nome })).catch(() => ({ id, nome: null }))`.',
        'Espere todas com `await Promise.all(...)`. Depois, os nomes são os resultados com `nome !== null`, e as falhas são os ids dos que têm `nome === null`.',
      ],
      solucao: linhas(
        'function buscarUsuario(id) {',
        '  return new Promise((resolver, rejeitar) => {',
        '    setTimeout(() => {',
        '      if (id > 0) {',
        '        resolver({ id: id, nome: "Usuário " + id });',
        '      } else {',
        '        rejeitar(new Error("não encontrado"));',
        '      }',
        '    }, 10);',
        '  });',
        '}',
        '',
        'async function carregar(ids) {',
        '  const resultados = await Promise.all(',
        '    ids.map((id) =>',
        '      buscarUsuario(id)',
        '        .then((usuario) => ({ id, nome: usuario.nome }))',
        '        .catch(() => ({ id, nome: null })),',
        '    ),',
        '  );',
        '  return {',
        '    usuarios: resultados.filter((r) => r.nome !== null).map((r) => r.nome),',
        '    falhas: resultados.filter((r) => r.nome === null).map((r) => r.id),',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'Tentar de novo, com uma pausa',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Complete a função `async` `buscarComTentativas(funcaoAsync, maximo, pausaMs)`. A função `esperar(ms)` já está pronta.',
        },
        {
          tipo: 'lista',
          itens: [
            'Tente executar `funcaoAsync` até o máximo de chamadas no total. Devolva o primeiro resultado que funcionar.',
            'Após uma falha, espere `pausaMs` antes da próxima tentativa.',
            'Se todas falharem, mantenha o erro da última. Não espere depois da última falha nem depois de um sucesso.',
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
        'const pausaMs = 10;',
        '',
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function buscarComTentativas(funcaoAsync, maximo, pausaMs) {',
        '',
        '}',
        '',
        'console.log(await buscarComTentativas(funcaoAsync, maximo, pausaMs));',
        '',
      ),
      testes: [
        {
          descricao: 'Tenta de novo até dar certo, pausando entre as tentativas',
          codigo: js`let chamadas = 0;
const instavel = async () => {
  chamadas++;
  if (chamadas < 3) throw new Error('falha ' + chamadas);
  return 'ok';
};
const inicio = Date.now();
igual(await buscarComTentativas(instavel, 5, 30), 'ok', 'O resultado');
const gasto = Date.now() - inicio;
igual(chamadas, 3, 'Quantas vezes a função foi chamada');
verdadeiro(gasto >= 50, 'Eram duas pausas de 30 ms, mas tudo levou só ' + gasto + ' ms.')`,
        },
        {
          descricao: 'Se der certo de primeira, não pausa',
          codigo: js`const inicio = Date.now();
const resultado = await buscarComTentativas(async () => 'ok', 3, 200);
const gasto = Date.now() - inicio;
igual(resultado, 'ok', 'O resultado');
verdadeiro(gasto < 100, 'Deu certo de primeira, mas levou ' + gasto + ' ms: não pause antes da primeira tentativa.')`,
        },
        {
          descricao: 'Se todas falharem, o último erro sobe, sem pausa depois dele',
          codigo: js`let chamadas = 0;
const sempre = async () => { chamadas++; throw new Error('falha ' + chamadas); };
const inicio = Date.now();
let erro = null;
try { await buscarComTentativas(sempre, 2, 100); } catch (e) { erro = e; }
const gasto = Date.now() - inicio;
verdadeiro(erro instanceof Error, 'Depois de esgotar as tentativas, deveria subir o erro.');
igual(erro.message, 'falha 2', 'A mensagem do último erro');
igual(chamadas, 2, 'Quantas vezes a função foi chamada');
verdadeiro(gasto >= 80 && gasto < 180, 'Era para haver uma pausa só, de 100 ms, e levou ' + gasto + ' ms.')`,
        },
        {
          descricao: 'Devolve uma promessa que se resolve com o valor',
          codigo: js`const promessa = buscarComTentativas(async () => 7, 1, 10);
verdadeiro(promessa instanceof Promise, 'buscarComTentativas precisa devolver uma promessa.');
igual(await promessa, 7, 'O valor da promessa')`,
        },
      ],
      dicas: [
        'Use um `for` de `maximo` voltas, com `try { return await funcaoAsync(); } catch (erro) { ... }`.',
        'No `catch`, guarde o erro; e só espere (`await esperar(pausaMs)`) se **ainda houver** próxima tentativa: `i < maximo - 1`. Depois do laço, lance o último erro.',
      ],
      solucao: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function buscarComTentativas(funcaoAsync, maximo, pausaMs) {',
        '  let ultimoErro;',
        '  for (let i = 0; i < maximo; i++) {',
        '    try {',
        '      return await funcaoAsync();',
        '    } catch (erro) {',
        '      ultimoErro = erro;',
        '      if (i < maximo - 1) {',
        '        await esperar(pausaMs);',
        '      }',
        '    }',
        '  }',
        '  throw ultimoErro;',
        '}',
      ),
    },
    {
      titulo: 'Não buscar duas vezes',
      enunciado: [
        { tipo: 'p', texto: 'Complete `criarCache(buscar)`.' },
        {
          tipo: 'lista',
          itens: [
            'Receba uma função `buscar(id)` que devolve uma promessa. Devolva outra função que também receba um id.',
            'Na primeira chamada de cada id, execute `buscar(id)` e guarde a promessa.',
            'Nas chamadas seguintes do mesmo id, devolva a mesma promessa, sem buscar de novo. Mantenha ids diferentes separados.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const buscar = (id) => Promise.resolve({ id, nome: "Produto " + id });',
        'const id = 1;',
        '',
        'function criarCache(buscar) {',
        '',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'O mesmo id chama buscar uma vez só, e devolve a mesma promessa',
          codigo: js`let chamadas = 0;
const buscar = (id) => { chamadas++; return Promise.resolve('item ' + id); };
const comCache = criarCache(buscar);
const a = comCache(1);
const b = comCache(1);
verdadeiro(a === b, 'Dois pedidos do mesmo id deveriam devolver a mesma promessa.');
igual(chamadas, 1, 'Quantas vezes buscar foi chamada');
igual(await a, 'item 1', 'O valor entregue')`,
        },
        {
          descricao: 'Ids diferentes chamam buscar cada um',
          codigo: js`let chamadas = 0;
const buscar = (id) => { chamadas++; return Promise.resolve('item ' + id); };
const comCache = criarCache(buscar);
const um = comCache(1);
const dois = comCache(2);
igual(chamadas, 2, 'Quantas vezes buscar foi chamada');
igual([await um, await dois], ['item 1', 'item 2'], 'Os valores entregues')`,
        },
        {
          descricao: 'Cada cache tem a sua própria memória',
          codigo: js`let chamadas = 0;
const buscar = (id) => { chamadas++; return Promise.resolve(id); };
const cacheA = criarCache(buscar);
const cacheB = criarCache(buscar);
cacheA(1);
cacheB(1);
igual(chamadas, 2, 'Quantas vezes buscar foi chamada')`,
        },
        {
          descricao: 'Pedir de novo depois de a promessa terminar também usa a memória',
          codigo: js`let chamadas = 0;
const buscar = (id) => { chamadas++; return Promise.resolve('item ' + id); };
const comCache = criarCache(buscar);
await comCache(7);
igual(await comCache(7), 'item 7', 'O valor da segunda vez');
igual(chamadas, 1, 'Quantas vezes buscar foi chamada')`,
        },
      ],
      dicas: [
        'Crie `const memoria = {};` dentro de `criarCache`, fora da função devolvida: é uma closure.',
        'A função devolvida recebe `id`; se `memoria[id] === undefined`, guarde `memoria[id] = buscar(id);`. No fim, `return memoria[id];`.',
      ],
      solucao: linhas(
        'function criarCache(buscar) {',
        '  const memoria = {};',
        '  return (id) => {',
        '    if (memoria[id] === undefined) {',
        '      memoria[id] = buscar(id);',
        '    }',
        '    return memoria[id];',
        '  };',
        '}',
      ),
    },
    {
      titulo: 'O relatório do carregamento',
      enunciado: [
        { tipo: 'p', texto: 'Complete `relatorio({ usuarios, falhas })`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva um texto no formato `Carregados: Usuário 1, Usuário 2. Falhas: 0, -3.`.',
            'Se `usuarios` estiver vazio, escreva `nenhum` no lugar dos nomes.',
            'Se `falhas` estiver vazio, escreva `nenhuma` no lugar dos ids. Mantenha a pontuação e os espaços do formato.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const dados = { usuarios: ["Usuário 1", "Usuário 2"], falhas: [0, -3] };',
        '',
        'function relatorio({ usuarios, falhas }) {',
        '',
        '}',
        '',
        'console.log(relatorio(dados));',
        '',
      ),
      testes: [
        {
          descricao: 'Mostra os carregados e as falhas',
          codigo: js`igual(
  relatorio({ usuarios: ['Usuário 1', 'Usuário 2'], falhas: [0, -3] }),
  'Carregados: Usuário 1, Usuário 2. Falhas: 0, -3.',
  'relatorio com carregados e falhas',
)`,
        },
        {
          descricao: 'Sem falhas, escreve “nenhuma”',
          codigo: js`igual(
  relatorio({ usuarios: ['Usuário 4'], falhas: [] }),
  'Carregados: Usuário 4. Falhas: nenhuma.',
  'relatorio sem falhas',
)`,
        },
        {
          descricao: 'Sem carregados, escreve “nenhum”',
          codigo: js`igual(
  relatorio({ usuarios: [], falhas: [0] }),
  'Carregados: nenhum. Falhas: 0.',
  'relatorio sem carregados',
)`,
        },
        {
          descricao: 'As duas listas vazias',
          codigo: js`igual(relatorio({ usuarios: [], falhas: [] }), 'Carregados: nenhum. Falhas: nenhuma.', 'relatorio vazio')`,
        },
      ],
      dicas: [
        'Para cada lista, decida o texto: `usuarios.length === 0 ? "nenhum" : usuarios.join(", ")`.',
        'No fim, junte tudo num template literal: `Carregados: ${carregados}. Falhas: ${comFalha}.`.',
      ],
      solucao: linhas(
        'function relatorio({ usuarios, falhas }) {',
        '  const carregados = usuarios.length === 0 ? "nenhum" : usuarios.join(", ");',
        '  const comFalha = falhas.length === 0 ? "nenhuma" : falhas.join(", ");',
        '  return `Carregados: ${carregados}. Falhas: ${comFalha}.`;',
        '}',
      ),
    },
  ],
};
