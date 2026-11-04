import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const procurando: Licao = {
  slug: 'procurando',
  titulo: 'Procurando em listas',
  resumo: 'find, findIndex, some e every.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Com `filter` você pega **todos** os itens que passam num teste. Quando só quer o **primeiro**, ou só quer saber **se existe**, há ferramentas mais diretas.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const tarefas = [',
        '  { id: 1, titulo: "Estudar", feita: true },',
        '  { id: 2, titulo: "Lavar louça", feita: false },',
        '  { id: 3, titulo: "Passear", feita: false },',
        '];',
        '',
        'console.log(tarefas.find((t) => t.id === 2));',
        'console.log(tarefas.find((t) => t.id === 9));',
      ),
      saida: linhas("{ id: 2, titulo: 'Lavar louça', feita: false }", 'undefined'),
    },
    {
      tipo: 'p',
      texto:
        '`find` devolve o **primeiro item** que passa no teste, ou `undefined` se nenhum passar. Repare: devolve o item inteiro, e não uma lista.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'console.log(tarefas.some((t) => t.feita));',
        'console.log(tarefas.every((t) => t.feita));',
        'console.log(tarefas.findIndex((t) => t.id === 3));',
      ),
      saida: linhas('true', 'false', '2'),
    },
    {
      tipo: 'lista',
      itens: [
        '`some` responde se **algum** item passa no teste.',
        '`every` responde se **todos** passam.',
        '`findIndex` devolve a posição do primeiro que passa, ou `-1`.',
      ],
    },
    { tipo: 'p', texto: 'Para uma lista de valores simples, `includes` basta:' },
    {
      tipo: 'codigo',
      codigo: linhas('console.log([1, 2, 3].includes(2));', 'console.log(["a", "b"].includes("z"));'),
      saida: linhas('true', 'false'),
    },
    {
      tipo: 'nota',
      texto:
        'Uma lista vazia passa em `every` (não há nenhum item que reprove) e não passa em `some` (não há nenhum item que aprove).',
    },
  ],
  exercicios: [
    {
      titulo: 'Achar e conferir',
      enunciado: [
        { tipo: 'p', texto: 'Complete as duas funções.' },
        {
          tipo: 'lista',
          itens: [
            '`acharPorId(itens, id)`: devolva o objeto com o `id` procurado, ou `undefined` se ele não existir.',
            '`todosPagaram(pedidos)`: devolva `true` se todos os pedidos tiverem `pago: true`; caso contrário, `false`. Para uma lista vazia, devolva `true`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const itens = [',
        '  { id: 1, nome: "a" },',
        '  { id: 2, nome: "b" },',
        '];',
        'const id = 2;',
        'const pedidos = [{ pago: true }, { pago: true }];',
        '',
        'function acharPorId(itens, id) {',
        '',
        '}',
        '',
        'function todosPagaram(pedidos) {',
        '',
        '}',
        '',
        'console.log(acharPorId(itens, id));',
        'console.log(todosPagaram(pedidos));',
        '',
      ),
      testes: [
        {
          descricao: 'acharPorId devolve o item com o id pedido',
          codigo: js`const itens = [{ id: 1, nome: 'a' }, { id: 2, nome: 'b' }];
igual(acharPorId(itens, 2), { id: 2, nome: 'b' }, 'acharPorId(itens, 2)')`,
        },
        {
          descricao: 'acharPorId devolve undefined quando não existe',
          codigo: js`const itens = [{ id: 1, nome: 'a' }, { id: 2, nome: 'b' }];
verdadeiro(acharPorId(itens, 1) !== undefined, 'Primeiro, acharPorId precisa achar um item que existe.');
igual(acharPorId(itens, 7), undefined, 'acharPorId(itens, 7)')`,
        },
        {
          descricao: 'todosPagaram devolve true quando todos pagaram',
          codigo: js`igual(todosPagaram([{ pago: true }, { pago: true }]), true, 'todosPagaram com todos pagos')`,
        },
        {
          descricao: 'todosPagaram devolve false se algum não pagou',
          codigo: js`igual(todosPagaram([{ pago: true }, { pago: false }]), false, 'todosPagaram com um pendente')`,
        },
        {
          descricao: 'todosPagaram devolve true para uma lista vazia',
          codigo: js`igual(todosPagaram([]), true, 'todosPagaram([])')`,
        },
        {
          descricao: 'Usa find e every',
          codigo: js`verdadeiro(codigoDoAluno.includes('find') && codigoDoAluno.includes('every'), 'Resolva com find e every.')`,
        },
      ],
      dicas: [
        'Em `acharPorId`, o teste é `item.id === id`.',
        'Em `todosPagaram`, o teste de cada pedido é só `pedido.pago`.',
      ],
      solucao: linhas(
        'function acharPorId(itens, id) {',
        '  return itens.find((item) => item.id === id);',
        '}',
        '',
        'function todosPagaram(pedidos) {',
        '  return pedidos.every((pedido) => pedido.pago);',
        '}',
      ),
    },
    {
      titulo: 'O primeiro negativo',
      enunciado: [
        { tipo: 'p', texto: 'Complete `primeiroNegativo(numeros)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva o primeiro número negativo, respeitando a ordem da lista.',
            'Se não houver negativos, devolva `undefined`.',
            'Exemplo: `[5, 3, -2, -8]` deve resultar em `-2`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const numeros = [5, 3, -2, -8];',
        '',
        'function primeiroNegativo(numeros) {',
        '',
        '}',
        '',
        'console.log(primeiroNegativo(numeros));',
        '',
      ),
      testes: [
        {
          descricao: 'primeiroNegativo([5, 3, -2, -8]) devolve -2',
          codigo: js`igual(primeiroNegativo([5, 3, -2, -8]), -2, 'primeiroNegativo([5, 3, -2, -8])')`,
        },
        {
          descricao: 'O zero não é negativo',
          codigo: js`igual(primeiroNegativo([0, 4, -1]), -1, 'primeiroNegativo([0, 4, -1])')`,
        },
        {
          descricao: 'Sem negativos devolve undefined (e com negativo devolve o número)',
          codigo: js`igual(primeiroNegativo([-3]), -3, 'primeiroNegativo([-3])');
igual(primeiroNegativo([1, 2, 3]), undefined, 'primeiroNegativo([1, 2, 3])');
igual(primeiroNegativo([]), undefined, 'primeiroNegativo([])')`,
        },
        {
          descricao: 'Usa find',
          codigo: js`verdadeiro(codigoDoAluno.includes('.find('), 'Resolva com find.')`,
        },
      ],
      dicas: [
        '`find` devolve o primeiro item que passa no teste, e `undefined` se nenhum passar.',
        'O teste é `(n) => n < 0`.',
      ],
      solucao: linhas('function primeiroNegativo(numeros) {', '  return numeros.find((n) => n < 0);', '}'),
    },
    {
      titulo: 'Tem algum adulto?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `temAdulto(pessoas)`.' },
        {
          tipo: 'lista',
          itens: [
            'Cada pessoa tem `nome` e `idade`.',
            'Devolva `true` se pelo menos uma pessoa tiver `18` anos ou mais. Caso contrário, `false`.',
            'Para uma lista vazia, devolva `false`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const pessoas = [',
        '  { nome: "Bia", idade: 9 },',
        '  { nome: "Ana", idade: 30 },',
        '];',
        '',
        'function temAdulto(pessoas) {',
        '',
        '}',
        '',
        'console.log(temAdulto(pessoas));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve true quando há um adulto',
          codigo: js`igual(temAdulto([{ nome: 'Bia', idade: 9 }, { nome: 'Ana', idade: 30 }]), true, 'temAdulto com um adulto')`,
        },
        {
          descricao: 'Quem tem exatamente 18 conta',
          codigo: js`igual(temAdulto([{ nome: 'Caio', idade: 18 }]), true, 'temAdulto com 18 anos')`,
        },
        {
          descricao: 'Devolve false quando só há crianças',
          codigo: js`igual(temAdulto([{ nome: 'Bia', idade: 9 }, { nome: 'Teo', idade: 17 }]), false, 'temAdulto só com menores')`,
        },
        { descricao: 'Uma lista vazia devolve false', codigo: js`igual(temAdulto([]), false, 'temAdulto([])')` },
        { descricao: 'Usa some', codigo: js`verdadeiro(codigoDoAluno.includes('.some('), 'Resolva com some.')` },
      ],
      dicas: [
        '`some` responde se algum item passa no teste.',
        'O teste de cada pessoa é `(pessoa) => pessoa.idade >= 18`.',
      ],
      solucao: linhas('function temAdulto(pessoas) {', '  return pessoas.some((pessoa) => pessoa.idade >= 18);', '}'),
    },
    {
      titulo: 'Formulário preenchido',
      enunciado: [
        { tipo: 'p', texto: 'Complete `tudoPreenchido(campos)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva `true` se todos os textos tiverem algum conteúdo, ou `false` se algum estiver vazio.',
            'Um texto contendo apenas espaços conta como vazio.',
            'Para uma lista vazia, devolva `true`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const campos = ["Ana", "ana@x.com"];',
        '',
        'function tudoPreenchido(campos) {',
        '',
        '}',
        '',
        'console.log(tudoPreenchido(campos));',
        '',
      ),
      testes: [
        {
          descricao: 'tudoPreenchido(["Ana", "ana@x.com"]) devolve true',
          codigo: js`igual(tudoPreenchido(['Ana', 'ana@x.com']), true, "tudoPreenchido(['Ana', 'ana@x.com'])")`,
        },
        {
          descricao: 'Um campo vazio faz devolver false',
          codigo: js`igual(tudoPreenchido(['Ana', '']), false, "tudoPreenchido(['Ana', ''])")`,
        },
        {
          descricao: 'Um campo só com espaços também é vazio',
          codigo: js`igual(tudoPreenchido(['Ana', '   ']), false, "tudoPreenchido(['Ana', '   '])")`,
        },
        {
          descricao: 'Uma lista vazia devolve true',
          codigo: js`igual(tudoPreenchido([]), true, 'tudoPreenchido([])')`,
        },
        { descricao: 'Usa every', codigo: js`verdadeiro(codigoDoAluno.includes('.every('), 'Resolva com every.')` },
      ],
      dicas: [
        '`every` responde se todos os itens passam no teste.',
        'Um campo está preenchido quando `campo.trim() !== ""`.',
      ],
      solucao: linhas(
        'function tudoPreenchido(campos) {',
        '  return campos.every((campo) => campo.trim() !== "");',
        '}',
      ),
    },
    {
      titulo: 'Em que posição está?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `posicaoDaTarefa(tarefas, id)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva o índice da tarefa com o `id` informado. Os índices começam em `0`.',
            'Se a tarefa não existir, devolva `-1`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const tarefas = [{ id: 10 }, { id: 20 }, { id: 30 }];',
        'const id = 30;',
        '',
        'function posicaoDaTarefa(tarefas, id) {',
        '',
        '}',
        '',
        'console.log(posicaoDaTarefa(tarefas, id));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve a posição da tarefa',
          codigo: js`const tarefas = [{ id: 10 }, { id: 20 }, { id: 30 }];
igual(posicaoDaTarefa(tarefas, 30), 2, 'posicaoDaTarefa(tarefas, 30)');
igual(posicaoDaTarefa(tarefas, 10), 0, 'posicaoDaTarefa(tarefas, 10)')`,
        },
        {
          descricao: 'Devolve -1 quando a tarefa não existe',
          codigo: js`igual(posicaoDaTarefa([{ id: 1 }], 5), -1, 'posicaoDaTarefa([{ id: 1 }], 5)')`,
        },
        {
          descricao: 'Uma lista vazia devolve -1',
          codigo: js`igual(posicaoDaTarefa([], 1), -1, 'posicaoDaTarefa([], 1)')`,
        },
        {
          descricao: 'Usa findIndex',
          codigo: js`verdadeiro(codigoDoAluno.includes('.findIndex('), 'Resolva com findIndex.')`,
        },
      ],
      dicas: [
        '`findIndex` devolve a posição do primeiro item que passa no teste, ou `-1`.',
        'O teste é `(tarefa) => tarefa.id === id`.',
      ],
      solucao: linhas(
        'function posicaoDaTarefa(tarefas, id) {',
        '  return tarefas.findIndex((tarefa) => tarefa.id === id);',
        '}',
      ),
    },
    {
      titulo: 'Está na lista de convidados?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `estaConvidado(convidados, nome)`.' },
        {
          tipo: 'lista',
          itens: [
            'Procure o nome na lista sem diferenciar maiúsculas de minúsculas.',
            'Devolva `true` se encontrar e `false` se não encontrar.',
            'Exemplo: `estaConvidado(["Ana", "Bia"], "ana")` deve devolver `true`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const convidados = ["Ana", "Bia"];',
        'const nome = "ana";',
        '',
        'function estaConvidado(convidados, nome) {',
        '',
        '}',
        '',
        'console.log(estaConvidado(convidados, nome));',
        '',
      ),
      testes: [
        {
          descricao: 'estaConvidado(["Ana", "Bia"], "ana") devolve true',
          codigo: js`igual(estaConvidado(['Ana', 'Bia'], 'ana'), true, "estaConvidado(['Ana', 'Bia'], 'ana')")`,
        },
        {
          descricao: 'Ignora a maiúscula do nome procurado: "BIA"',
          codigo: js`igual(estaConvidado(['Ana', 'Bia'], 'BIA'), true, "estaConvidado(['Ana', 'Bia'], 'BIA')")`,
        },
        {
          descricao: 'Quem não está na lista não entra',
          codigo: js`igual(estaConvidado(['Ana', 'Bia'], 'Caio'), false, "estaConvidado(['Ana', 'Bia'], 'Caio')")`,
        },
        {
          descricao: 'Uma lista vazia devolve false',
          codigo: js`igual(estaConvidado([], 'Ana'), false, "estaConvidado([], 'Ana')")`,
        },
        {
          descricao: 'O nome precisa ser inteiro: "An" não vale',
          codigo: js`igual(estaConvidado(['Ana'], 'An'), false, "estaConvidado(['Ana'], 'An')")`,
        },
      ],
      dicas: [
        'Deixe a lista toda em minúsculas com `map` e o nome também.',
        'Depois use `includes`: `convidados.map((c) => c.toLowerCase()).includes(nome.toLowerCase())`.',
      ],
      solucao: linhas(
        'function estaConvidado(convidados, nome) {',
        '  return convidados.map((convidado) => convidado.toLowerCase()).includes(nome.toLowerCase());',
        '}',
      ),
    },
    {
      titulo: 'Todos os produtos disponíveis?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `todosDisponiveis(produtos)` usando `every`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva `true` se todos os produtos tiverem `quantidade` maior que `0`. Caso contrário, `false`.',
            'Para uma lista vazia, devolva `true`, seguindo o comportamento de `every`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const produtos = [{ quantidade: 2 }, { quantidade: 0 }];',
        '',
        'function todosDisponiveis(produtos) {',
        '',
        '}',
        '',
        'console.log(todosDisponiveis(produtos));',
        '',
      ),
      testes: [
        {
          descricao: 'Um produto sem estoque impede a disponibilidade de todos',
          codigo: js`igual(todosDisponiveis([{ quantidade: 2 }, { quantidade: 0 }]), false, 'Um item indisponível'); igual(todosDisponiveis([{ quantidade: 1 }]), true, 'Disponível')`,
        },
        {
          descricao: 'A lista vazia não tem item descumprindo a regra',
          codigo: js`igual(todosDisponiveis([]), true, 'Lista vazia')`,
        },
      ],
      dicas: ['O callback do every deve devolver produto.quantidade > 0.'],
      solucao:
        'function todosDisponiveis(produtos) {\n  return produtos.every((produto) => produto.quantidade > 0);\n}',
    },
    {
      titulo: 'A primeira tarefa pendente',
      enunciado: [
        { tipo: 'p', texto: 'Complete `posicaoDaPendencia(tarefas)`.' },
        {
          tipo: 'lista',
          itens: [
            'Devolva o índice da primeira tarefa com `concluida: false`.',
            'Se todas estiverem concluídas, ou se a lista estiver vazia, devolva `-1`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const tarefas = [{ concluida: true }, { concluida: false }, { concluida: false }];',
        '',
        'function posicaoDaPendencia(tarefas) {',
        '',
        '}',
        '',
        'console.log(posicaoDaPendencia(tarefas));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve a posição da primeira pendência',
          codigo: js`igual(posicaoDaPendencia([{ concluida: true }, { concluida: false }, { concluida: false }]), 1, 'Primeira pendência'); igual(posicaoDaPendencia([{ concluida: false }]), 0, 'Na primeira posição')`,
        },
        {
          descricao: 'Devolve -1 quando não encontra pendência',
          codigo: js`igual(posicaoDaPendencia([{ concluida: true }]), -1, 'Tudo concluído'); igual(posicaoDaPendencia([]), -1, 'Sem tarefas')`,
        },
      ],
      dicas: ['find devolve o objeto; findIndex devolve a posição.'],
      solucao:
        'function posicaoDaPendencia(tarefas) {\n  return tarefas.findIndex((tarefa) => tarefa.concluida === false);\n}',
    },
  ],
};
