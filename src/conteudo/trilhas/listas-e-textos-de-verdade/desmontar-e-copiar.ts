import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desmontarECopiar: Licao = {
  slug: 'desmontar-e-copiar',
  titulo: 'Desmontando e copiando',
  resumo: 'Desestruturação, valores padrão e o operador ... (spread).',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Duas ideias que aparecem em quase todo código moderno. A primeira é **desestruturar**: tirar valores de dentro de um objeto ou de uma lista, direto para variáveis.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const pessoa = { nome: "Ana", idade: 25, cidade: "Lajinha" };',
        'const { nome, idade } = pessoa;',
        'console.log(nome, idade);',
        '',
        'const cores = ["azul", "verde", "rosa"];',
        'const [primeira, segunda] = cores;',
        'console.log(primeira, segunda);',
      ),
      saida: linhas('Ana 25', 'azul verde'),
    },
    {
      tipo: 'p',
      texto:
        'Em objetos, o que vai entre chaves são os nomes das propriedades. Em listas, vale a posição. Isso também funciona nos parâmetros de uma função, e dá para definir um **valor padrão**, usado quando o valor não vem:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function saudar({ nome, saudacao = "Olá" }) {',
        '  return `${saudacao}, ${nome}!`;',
        '}',
        '',
        'console.log(saudar({ nome: "Ana" }));',
        'console.log(saudar({ nome: "Beto", saudacao: "E aí" }));',
      ),
      saida: linhas('Olá, Ana!', 'E aí, Beto!'),
    },
    {
      tipo: 'p',
      texto:
        'A segunda ideia é **copiar**, com `...` (o *spread*). Ele espalha os itens de uma lista, ou as propriedades de um objeto, dentro de uma lista ou objeto novo:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const a = [1, 2];',
        'const b = [...a, 3, 4];',
        'console.log(b);',
        '',
        'const original = { nome: "Ana", idade: 25 };',
        'const atualizado = { ...original, idade: 26 };',
        'console.log(atualizado);',
        'console.log(original);',
      ),
      saida: linhas('[ 1, 2, 3, 4 ]', "{ nome: 'Ana', idade: 26 }", "{ nome: 'Ana', idade: 25 }"),
    },
    {
      tipo: 'nota',
      texto:
        'Isso cria uma **cópia**: `original` continua igual. Nos objetos, o que vem depois vence, por isso `idade: 26` troca a idade antiga. Atualizar sem estragar o original evita bugs difíceis de achar.',
    },
  ],
  exercicios: [
    {
      titulo: 'Desmontar e copiar',
      enunciado: [
        { tipo: 'p', texto: 'Escreva três funções:' },
        {
          tipo: 'lista',
          itens: [
            '`descrever(item)` recebe `{ nome, preco, quantidade }` e devolve `"2x Caneta = 6"` (quantidade, nome e o total). Se `quantidade` não vier, vale `1`. Use desestruturação.',
            '`atualizar(pessoa, mudancas)` devolve um objeto **novo**, com tudo de `pessoa` e as `mudancas` por cima. `pessoa` não pode mudar.',
            '`trocar(par)` recebe uma lista de dois itens e devolve a mesma lista com a ordem trocada: `trocar([1, 2])` devolve `[2, 1]`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'function descrever(item) {',
        '  // desestruture nome, preco e quantidade (com valor padrão 1)',
        '}',
        '',
        'function atualizar(pessoa, mudancas) {',
        '  // devolva um objeto novo com o spread',
        '}',
        '',
        'function trocar(par) {',
        '  // devolva a lista com a ordem trocada',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'descrever mostra quantidade, nome e total',
          codigo: js`igual(descrever({ nome: 'Caneta', preco: 3, quantidade: 2 }), '2x Caneta = 6', 'descrever de duas canetas')`,
        },
        {
          descricao: 'descrever usa quantidade 1 quando ela não vem',
          codigo: js`igual(descrever({ nome: 'Caderno', preco: 20 }), '1x Caderno = 20', 'descrever de um caderno sem quantidade')`,
        },
        {
          descricao: 'atualizar troca e acrescenta propriedades',
          codigo: js`igual(atualizar({ nome: 'Ana', idade: 25 }, { idade: 26, cidade: 'Lajinha' }), { nome: 'Ana', idade: 26, cidade: 'Lajinha' }, 'O objeto atualizado')`,
        },
        {
          descricao: 'atualizar não altera o objeto original',
          codigo: js`const pessoa = { nome: 'Ana', idade: 25 };
const resultado = atualizar(pessoa, { idade: 30 });
verdadeiro(typeof resultado === 'object' && resultado !== null, 'atualizar precisa devolver um objeto.');
igual(pessoa, { nome: 'Ana', idade: 25 }, 'O objeto original')`,
        },
        {
          descricao: 'atualizar devolve um objeto diferente do original',
          codigo: js`const pessoa = { nome: 'Ana' };
const copia = atualizar(pessoa, {});
verdadeiro(typeof copia === 'object' && copia !== null, 'atualizar precisa devolver um objeto.');
verdadeiro(copia !== pessoa, 'atualizar precisa devolver uma cópia, não o mesmo objeto.')`,
        },
        {
          descricao: 'trocar inverte a ordem do par',
          codigo: js`igual(trocar([1, 2]), [2, 1], 'trocar([1, 2])');
igual(trocar(['x', 'y']), ['y', 'x'], "trocar(['x', 'y'])")`,
        },
      ],
      dicas: [
        'A desestruturação pode ficar no parâmetro: `function descrever({ nome, preco, quantidade = 1 })`.',
        'Para atualizar, espalhe os dois objetos num novo, na ordem certa: `{ ...pessoa, ...mudancas }`.',
        'Para trocar, desestruture o par e devolva ao contrário: `const [a, b] = par; return [b, a];`.',
      ],
      solucao: linhas(
        'function descrever({ nome, preco, quantidade = 1 }) {',
        '  return `${quantidade}x ${nome} = ${preco * quantidade}`;',
        '}',
        '',
        'function atualizar(pessoa, mudancas) {',
        '  return { ...pessoa, ...mudancas };',
        '}',
        '',
        'function trocar([a, b]) {',
        '  return [b, a];',
        '}',
      ),
    },
    {
      titulo: 'Acrescentar sem mexer na lista',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `comItem(lista, item)`, que devolve uma **lista nova**: os itens da original e, no fim, o `item`. A lista original não pode mudar (por isso, nada de `push`). Por exemplo, `comItem([1, 2], 3)` devolve `[1, 2, 3]`.',
        },
      ],
      codigoInicial: linhas('function comItem(lista, item) {', '  // monte uma lista nova com o spread', '}', ''),
      testes: [
        {
          descricao: 'comItem([1, 2], 3) devolve [1, 2, 3]',
          codigo: js`igual(comItem([1, 2], 3), [1, 2, 3], 'comItem([1, 2], 3)')`,
        },
        { descricao: 'Funciona com uma lista vazia', codigo: js`igual(comItem([], 'a'), ['a'], "comItem([], 'a')")` },
        {
          descricao: 'A lista original não mudou',
          codigo: js`const original = [1, 2];
const resultado = comItem(original, 3);
verdadeiro(Array.isArray(resultado) && resultado.length === 3, 'comItem precisa devolver uma lista com 3 itens.');
igual(original, [1, 2], 'A lista original')`,
        },
        {
          descricao: 'Devolve uma lista diferente da original',
          codigo: js`const original = ['x'];
const resultado = comItem(original, 'y');
verdadeiro(Array.isArray(resultado), 'comItem precisa devolver uma lista.');
verdadeiro(resultado !== original, 'Devolva uma lista nova, e não a mesma lista.')`,
        },
      ],
      dicas: [
        'Espalhe a lista dentro de colchetes novos: `[...lista]`.',
        'Depois do spread, escreva o item: `[...lista, item]`.',
      ],
      solucao: linhas('function comItem(lista, item) {', '  return [...lista, item];', '}'),
    },
    {
      titulo: 'Juntando listas sem repetir',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `uniao(a, b)`, que devolve uma lista nova com todos os itens de `a` e, depois deles, só os itens de `b` que **não** estão em `a`. Por exemplo, `uniao([1, 2], [2, 3])` devolve `[1, 2, 3]`. As listas originais não podem mudar.',
        },
      ],
      codigoInicial: linhas(
        'function uniao(a, b) {',
        '  // spread de a, e só os itens de b que ainda não estão em a',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'uniao([1, 2], [2, 3]) devolve [1, 2, 3]',
          codigo: js`igual(uniao([1, 2], [2, 3]), [1, 2, 3], 'uniao([1, 2], [2, 3])')`,
        },
        { descricao: 'Duas listas iguais viram uma só', codigo: js`igual(uniao([1], [1]), [1], 'uniao([1], [1])')` },
        {
          descricao: 'A primeira lista vazia traz todos os da segunda',
          codigo: js`igual(uniao([], [1, 2]), [1, 2], 'uniao([], [1, 2])')`,
        },
        {
          descricao: 'Listas sem nada em comum só se juntam',
          codigo: js`igual(uniao(['a', 'b'], ['c']), ['a', 'b', 'c'], "uniao(['a', 'b'], ['c'])")`,
        },
        {
          descricao: 'As listas originais não mudaram',
          codigo: js`const a = [1, 2];
const b = [2, 3];
const resultado = uniao(a, b);
verdadeiro(Array.isArray(resultado) && resultado.length === 3, 'uniao precisa devolver uma lista com 3 itens.');
igual([a, b], [[1, 2], [2, 3]], 'As duas listas originais')`,
        },
      ],
      dicas: [
        'Os itens novos são `b.filter((item) => !a.includes(item))`.',
        'Junte tudo num colchete só: `[...a, ...b.filter(...)]`.',
      ],
      solucao: linhas('function uniao(a, b) {', '  return [...a, ...b.filter((item) => !a.includes(item))];', '}'),
    },
    {
      titulo: 'Valores padrão',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `criarUsuario({ nome, papel, ativo })`, que devolve um objeto com essas três propriedades. Quando `papel` não vem, vale `"leitor"`; quando `ativo` não vem, vale `true`. Use valores padrão na desestruturação.',
        },
        {
          tipo: 'nota',
          texto:
            'Atenção ao `ativo: false`: ele **veio**, então precisa ser respeitado. O valor padrão só entra quando a propriedade não existe (é `undefined`).',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas(
        'function criarUsuario({ nome, papel, ativo }) {',
        '  // coloque os valores padrão e devolva o objeto',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'Sem papel e sem ativo, usa “leitor” e true',
          codigo: js`igual(criarUsuario({ nome: 'Ana' }), { nome: 'Ana', papel: 'leitor', ativo: true }, "criarUsuario({ nome: 'Ana' })")`,
        },
        {
          descricao: 'Respeita o papel que veio',
          codigo: js`igual(criarUsuario({ nome: 'Bia', papel: 'admin' }), { nome: 'Bia', papel: 'admin', ativo: true }, "criarUsuario({ nome: 'Bia', papel: 'admin' })")`,
        },
        {
          descricao: 'Respeita o ativo: false',
          codigo: js`igual(criarUsuario({ nome: 'Caio', ativo: false }), { nome: 'Caio', papel: 'leitor', ativo: false }, "criarUsuario({ nome: 'Caio', ativo: false })")`,
        },
        {
          descricao: 'Tudo informado',
          codigo: js`igual(criarUsuario({ nome: 'Duda', papel: 'editor', ativo: false }), { nome: 'Duda', papel: 'editor', ativo: false }, 'criarUsuario com tudo')`,
        },
      ],
      dicas: [
        'O valor padrão vai no próprio parâmetro: `{ nome, papel = "leitor", ativo = true }`.',
        'Depois, devolva `{ nome, papel, ativo }`.',
      ],
      solucao: linhas(
        'function criarUsuario({ nome, papel = "leitor", ativo = true }) {',
        '  return { nome, papel, ativo };',
        '}',
      ),
    },
    {
      titulo: 'Concluir uma tarefa',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `concluirTarefa(tarefas, id)`, que devolve uma **lista nova** em que a tarefa com aquele `id` tem `feita: true`. As outras tarefas ficam como estão, e a lista original (e suas tarefas) **não podem mudar**.',
        },
        {
          tipo: 'nota',
          texto:
            'Combine `map` com o spread de objeto: para a tarefa certa, devolva `{ ...tarefa, feita: true }`; para as outras, a própria tarefa.',
        },
      ],
      codigoInicial: linhas('function concluirTarefa(tarefas, id) {', '  // use map e o spread de objeto', '}', ''),
      testes: [
        {
          descricao: 'Marca como feita só a tarefa do id pedido',
          codigo: js`const tarefas = [
  { id: 1, titulo: 'Estudar', feita: false },
  { id: 2, titulo: 'Passear', feita: false },
];
const esperado = [
  { id: 1, titulo: 'Estudar', feita: false },
  { id: 2, titulo: 'Passear', feita: true },
];
igual(concluirTarefa(tarefas, 2), esperado, 'concluirTarefa(tarefas, 2)')`,
        },
        {
          descricao: 'Um id que não existe não muda nada',
          codigo: js`const tarefas = [{ id: 1, titulo: 'Estudar', feita: false }];
const resultado = concluirTarefa(tarefas, 9);
verdadeiro(Array.isArray(resultado), 'concluirTarefa precisa devolver uma lista.');
igual(resultado, [{ id: 1, titulo: 'Estudar', feita: false }], 'O resultado sem o id')`,
        },
        {
          descricao: 'A lista original e as tarefas não mudaram',
          codigo: js`const tarefas = [{ id: 1, titulo: 'Estudar', feita: false }];
const resultado = concluirTarefa(tarefas, 1);
verdadeiro(Array.isArray(resultado) && resultado.length === 1, 'concluirTarefa precisa devolver uma lista com uma tarefa.');
igual(tarefas, [{ id: 1, titulo: 'Estudar', feita: false }], 'A lista original')`,
        },
        {
          descricao: 'Concluir uma tarefa que já estava feita a mantém feita',
          codigo: js`igual(concluirTarefa([{ id: 1, titulo: 'A', feita: true }], 1), [{ id: 1, titulo: 'A', feita: true }], 'Uma tarefa já feita')`,
        },
      ],
      dicas: [
        'Dentro do `map`, um `if (tarefa.id === id)` decide o que devolver.',
        'Para a tarefa certa: `return { ...tarefa, feita: true };`. Para as outras: `return tarefa;`.',
      ],
      solucao: linhas(
        'function concluirTarefa(tarefas, id) {',
        '  return tarefas.map((tarefa) => {',
        '    if (tarefa.id === id) {',
        '      return { ...tarefa, feita: true };',
        '    }',
        '    return tarefa;',
        '  });',
        '}',
      ),
    },
    {
      titulo: 'Preferências com atualização parcial',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `atualizarPreferencias(atuais, alteracoes)`, que devolve um objeto novo com as propriedades dos dois objetos. Alterações devem vencer quando a mesma propriedade aparece nos dois. Nenhuma entrada deve ser modificada. A cópia é só do primeiro nível.',
        },
      ],
      codigoInicial:
        'function atualizarPreferencias(atuais, alteracoes) {\n  // a ordem das cópias define qual valor vence\n}\n',
      testes: [
        {
          descricao: 'A atualização substitui somente os campos enviados',
          codigo: js`igual(atualizarPreferencias({ idioma: 'pt', tamanho: 16 }, { tamanho: 20 }), { idioma: 'pt', tamanho: 20 }, 'Preferências')`,
        },
        {
          descricao: 'Cria outro objeto e preserva as entradas',
          codigo: js`const atuais = { som: true }; const resultado = atualizarPreferencias(atuais, { som: false }); igual(resultado, { som: false }, 'Novo valor'); verdadeiro(resultado !== atuais, 'Devolva um objeto novo.'); igual(atuais, { som: true }, 'Original')`,
        },
      ],
      dicas: ['Espalhe as propriedades atuais primeiro e as alterações depois.'],
      solucao: 'function atualizarPreferencias(atuais, alteracoes) {\n  return { ...atuais, ...alteracoes };\n}',
    },
    {
      titulo: 'O primeiro e o restante',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `separarPrimeiro(lista)`, que devolve um objeto com primeiro e resto. O primeiro recebe o item inicial, ou null se a lista estiver vazia; resto é uma nova lista com os demais itens.',
        },
        {
          tipo: 'nota',
          texto:
            'Na desestruturação de uma lista, `...resto` captura os itens restantes. Confira o tamanho da lista para distinguir uma lista vazia de um primeiro item com valor undefined.',
        },
      ],
      codigoInicial: 'function separarPrimeiro(lista) {\n  // desestruture o primeiro item e capture o restante\n}\n',
      testes: [
        {
          descricao: 'Separa a cabeça dos demais itens',
          codigo: js`igual(separarPrimeiro([2, 4, 6]), { primeiro: 2, resto: [4, 6] }, 'Partes da lista')`,
        },
        {
          descricao: 'Trata listas curtas sem modificar a entrada',
          codigo: js`igual(separarPrimeiro([]), { primeiro: null, resto: [] }, 'Vazia'); const entrada = ['a']; igual(separarPrimeiro(entrada), { primeiro: 'a', resto: [] }, 'Um item'); igual(entrada, ['a'], 'Entrada preservada')`,
        },
      ],
      dicas: [
        'Use const [primeiro, ...resto] = lista. No objeto devolvido, use null como primeiro apenas quando lista.length for zero.',
      ],
      solucao:
        'function separarPrimeiro(lista) {\n  const [primeiro, ...resto] = lista;\n  return { primeiro: lista.length === 0 ? null : primeiro, resto };\n}',
    },
  ],
};
