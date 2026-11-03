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
        {
          tipo: 'p',
          texto:
            'A função `buscarUsuario` já está pronta. Escreva a função `async` `carregar(ids)`, que busca **todos os ids ao mesmo tempo** e devolve um objeto `{ usuarios, falhas }`: `usuarios` é a lista dos **nomes** dos usuários encontrados, e `falhas` é a lista dos **ids** que falharam, ambas na ordem dos ids recebidos. Uma falha não pode derrubar as outras buscas.',
        },
      ],
      codigoInicial: linhas(
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
        '  // busque todos juntos, tratando a falha de cada um',
        '}',
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
            'A função `esperar(ms)` já está pronta. Escreva a função `async` `buscarComTentativas(funcaoAsync, maximo, pausaMs)`. Ela chama a `funcaoAsync` e, se a promessa for rejeitada, **espera `pausaMs`** e tenta de novo, até `maximo` chamadas no total. Devolve o valor da primeira que der certo. Se todas falharem, deixa subir o erro da última. **Sem pausa depois da última falha** nem quando dá certo.',
        },
      ],
      codigoInicial: linhas(
        'function esperar(ms) {',
        '  return new Promise((resolver) => setTimeout(resolver, ms));',
        '}',
        '',
        'async function buscarComTentativas(funcaoAsync, maximo, pausaMs) {',
        '  // tente, espere um pouco, tente de novo',
        '}',
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
        {
          tipo: 'p',
          texto:
            'Buscar o mesmo dado de novo é desperdício. Escreva a função `criarCache(buscar)`, que recebe uma função `buscar(id)` (que devolve uma promessa) e devolve **outra função**, com o mesmo uso. Na primeira vez que um `id` é pedido, ela chama `buscar(id)` e guarda a promessa; nas vezes seguintes com o mesmo `id`, devolve **a mesma promessa**, sem chamar `buscar` de novo. Ids diferentes não se misturam.',
        },
      ],
      codigoInicial: linhas(
        'function criarCache(buscar) {',
        '  // guarde as promessas por id, num objeto que só a função devolvida enxerga',
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
        {
          tipo: 'p',
          texto:
            'Escreva a função `relatorio({ usuarios, falhas })`, que monta um texto com o resultado de um carregamento, no formato `Carregados: Usuário 1, Usuário 2. Falhas: 0, -3.`. Quando uma das listas está vazia, escreva `nenhum` (para os carregados) ou `nenhuma` (para as falhas) no lugar dela.',
        },
      ],
      codigoInicial: linhas(
        'function relatorio({ usuarios, falhas }) {',
        '  // monte o texto, tratando as listas vazias',
        '}',
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
