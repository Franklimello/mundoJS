import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desafioFinal: Licao = {
  slug: 'desafio-final',
  titulo: 'Desafio: o ranking do jogo',
  resumo: 'Textos, reduce, sort e map juntos, para montar o ranking de um jogo.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Um jogo registra cada pontuação como um evento, como `{ jogador: "Ana", pontos: 10 }`. A partir da lista de eventos, você vai chegar a um ranking de verdade, em quatro passos, usando o que viu na trilha. Há duas ferramentas pequenas que ainda não apareceram.',
    },
    {
      tipo: 'p',
      texto: '`Object.keys` devolve a lista com os **nomes** das propriedades de um objeto:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const placar = { Ana: 30, Bia: 20 };',
        'console.log(Object.keys(placar));',
        'console.log(Object.keys(placar).map((nome) => placar[nome]));',
      ),
      saida: linhas("[ 'Ana', 'Bia' ]", '[ 30, 20 ]'),
    },
    {
      tipo: 'p',
      texto:
        'E a função do `map` pode receber um **segundo parâmetro**: a posição do item na lista, começando em zero.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const nomes = ["Ana", "Bia"];',
        'console.log(nomes.map((nome, posicao) => posicao + 1 + ". " + nome));',
      ),
      saida: "[ '1. Ana', '2. Bia' ]",
    },
    {
      tipo: 'nota',
      texto:
        'Cada exercício é uma etapa independente, mas o resultado de uma é a matéria-prima da seguinte: nomes limpos, totais por jogador, lista ordenada e texto final.',
    },
  ],
  exercicios: [
    {
      titulo: 'Nomes arrumados',
      enunciado: [
        { tipo: 'p', texto: 'Complete `limparNome(nome)`.' },
        {
          tipo: 'lista',
          itens: [
            'Retire os espaços das pontas e deixe apenas a primeira letra em maiúscula, com o restante em minúsculas.',
            'Devolva o nome ajustado.',
            'Exemplo: `"  aNA "` deve resultar em `"Ana"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const nome = "  aNA ";',
        '',
        'function limparNome(nome) {',
        '',
        '}',
        '',
        'console.log(limparNome(nome));',
        '',
      ),
      testes: [
        {
          descricao: 'limparNome("  aNA ") devolve “Ana”',
          codigo: js`igual(limparNome('  aNA '), 'Ana', "limparNome('  aNA ')")`,
        },
        {
          descricao: 'limparNome("BIA") devolve “Bia”',
          codigo: js`igual(limparNome('BIA'), 'Bia', "limparNome('BIA')")`,
        },
        {
          descricao: 'limparNome("caio") devolve “Caio”',
          codigo: js`igual(limparNome('caio'), 'Caio', "limparNome('caio')")`,
        },
        { descricao: 'Uma letra só', codigo: js`igual(limparNome(' z '), 'Z', "limparNome(' z ')")` },
        {
          descricao: 'Um nome já certo continua igual',
          codigo: js`igual(limparNome('Duda'), 'Duda', "limparNome('Duda')")`,
        },
      ],
      dicas: [
        'Primeiro limpe as pontas: `nome.trim()`. Guarde o resultado numa constante.',
        'A inicial é `limpo[0].toUpperCase()`, e o resto é `limpo.slice(1).toLowerCase()`.',
      ],
      solucao: linhas(
        'function limparNome(nome) {',
        '  const limpo = nome.trim();',
        '  return limpo[0].toUpperCase() + limpo.slice(1).toLowerCase();',
        '}',
      ),
    },
    {
      titulo: 'Somando por jogador',
      enunciado: [
        { tipo: 'p', texto: 'Complete `totalPorJogador(eventos)`. A função `limparNome` já está pronta.' },
        {
          tipo: 'lista',
          itens: [
            'Cada evento tem `jogador` e `pontos`. Use o nome limpo para reunir eventos do mesmo jogador.',
            'Devolva um objeto com o total de pontos de cada nome.',
            'Exemplo: `"ana"` com `10` pontos e `" Ana"` com `5` devem resultar em `{ Ana: 15 }`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const eventos = [',
        '  { jogador: "ana", pontos: 10 },',
        '  { jogador: " Ana", pontos: 5 },',
        '  { jogador: "BIA", pontos: 20 },',
        '];',
        '',
        'function limparNome(nome) {',
        '  const limpo = nome.trim();',
        '  return limpo[0].toUpperCase() + limpo.slice(1).toLowerCase();',
        '}',
        '',
        'function totalPorJogador(eventos) {',
        '',
        '}',
        '',
        'console.log(totalPorJogador(eventos));',
        '',
      ),
      testes: [
        {
          descricao: 'Junta os eventos do mesmo jogador, mesmo com o nome escrito de jeitos diferentes',
          codigo: js`const eventos = [
  { jogador: 'ana', pontos: 10 },
  { jogador: ' Ana', pontos: 5 },
  { jogador: 'BIA', pontos: 20 },
];
igual(totalPorJogador(eventos), { Ana: 15, Bia: 20 }, 'totalPorJogador(eventos)')`,
        },
        {
          descricao: 'Um evento só',
          codigo: js`igual(totalPorJogador([{ jogador: 'caio', pontos: 7 }]), { Caio: 7 }, 'Um evento de caio')`,
        },
        {
          descricao: 'Uma lista vazia devolve um objeto vazio',
          codigo: js`igual(totalPorJogador([]), {}, 'totalPorJogador([])')`,
        },
        {
          descricao: 'Pontos negativos também somam',
          codigo: js`igual(totalPorJogador([{ jogador: 'ana', pontos: 10 }, { jogador: 'ana', pontos: -4 }]), { Ana: 6 }, 'Dez menos quatro')`,
        },
        { descricao: 'Usa reduce', codigo: js`verdadeiro(codigoDoAluno.includes('.reduce('), 'Resolva com reduce.')` },
      ],
      dicas: [
        'O valor inicial do `reduce` é `{}`. A cada evento, o nome certo é `limparNome(evento.jogador)`.',
        'Some assim: `acc[nome] = (acc[nome] ?? 0) + evento.pontos;` e devolva `acc`.',
      ],
      solucao: linhas(
        'function limparNome(nome) {',
        '  const limpo = nome.trim();',
        '  return limpo[0].toUpperCase() + limpo.slice(1).toLowerCase();',
        '}',
        '',
        'function totalPorJogador(eventos) {',
        '  return eventos.reduce((acc, evento) => {',
        '    const nome = limparNome(evento.jogador);',
        '    acc[nome] = (acc[nome] ?? 0) + evento.pontos;',
        '    return acc;',
        '  }, {});',
        '}',
      ),
    },
    {
      titulo: 'Montando o ranking',
      enunciado: [
        { tipo: 'p', texto: 'Complete `ranking(totais)`.' },
        {
          tipo: 'lista',
          itens: [
            'Receba um objeto com os pontos por jogador, como `{ Ana: 15, Bia: 20 }`.',
            'Devolva uma lista de objetos `{ jogador, total }`, do maior para o menor total.',
            'Em caso de empate, use a ordem alfabética dos nomes. No exemplo, Bia vem antes de Ana.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const totais = { Ana: 15, Bia: 20, Caio: 5 };',
        '',
        'function ranking(totais) {',
        '',
        '}',
        '',
        'console.log(ranking(totais));',
        '',
      ),
      testes: [
        {
          descricao: 'Ordena do maior para o menor total',
          codigo: js`igual(
  ranking({ Ana: 15, Bia: 20, Caio: 5 }),
  [{ jogador: 'Bia', total: 20 }, { jogador: 'Ana', total: 15 }, { jogador: 'Caio', total: 5 }],
  'ranking com três jogadores',
)`,
        },
        {
          descricao: 'No empate, vale a ordem alfabética',
          codigo: js`igual(
  ranking({ Zeca: 10, Ana: 10, Mia: 10 }),
  [{ jogador: 'Ana', total: 10 }, { jogador: 'Mia', total: 10 }, { jogador: 'Zeca', total: 10 }],
  'ranking com empate',
)`,
        },
        {
          descricao: 'Um jogador só',
          codigo: js`igual(ranking({ Ana: 3 }), [{ jogador: 'Ana', total: 3 }], 'ranking com um jogador')`,
        },
        {
          descricao: 'Sem jogadores, a lista é vazia',
          codigo: js`igual(ranking({}), [], 'ranking({})')`,
        },
      ],
      dicas: [
        'Comece com `Object.keys(totais).map((jogador) => ({ jogador, total: totais[jogador] }))`.',
        'Depois `.sort((a, b) => b.total - a.total || a.jogador.localeCompare(b.jogador, "pt-BR"))`.',
      ],
      solucao: linhas(
        'function ranking(totais) {',
        '  return Object.keys(totais)',
        '    .map((jogador) => ({ jogador, total: totais[jogador] }))',
        '    .sort((a, b) => b.total - a.total || a.jogador.localeCompare(b.jogador, "pt-BR"));',
        '}',
      ),
    },
    {
      titulo: 'O texto do ranking',
      enunciado: [
        { tipo: 'p', texto: 'Complete `textoDoRanking(lista)`.' },
        {
          tipo: 'lista',
          itens: [
            'A lista já estará ordenada e terá objetos com `jogador` e `total`.',
            'Devolva uma lista de textos no formato `1. Bia: 20 pts`.',
            'As posições começam em `1`. Mantenha os espaços e a ordem dos jogadores.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const lista = [',
        '  { jogador: "Bia", total: 20 },',
        '  { jogador: "Ana", total: 15 },',
        '];',
        '',
        'function textoDoRanking(lista) {',
        '',
        '}',
        '',
        'console.log(textoDoRanking(lista));',
        '',
      ),
      testes: [
        {
          descricao: 'Numera as linhas a partir de 1',
          codigo: js`igual(
  textoDoRanking([{ jogador: 'Bia', total: 20 }, { jogador: 'Ana', total: 15 }]),
  ['1. Bia: 20 pts', '2. Ana: 15 pts'],
  'textoDoRanking com dois jogadores',
)`,
        },
        {
          descricao: 'Um jogador só',
          codigo: js`igual(textoDoRanking([{ jogador: 'Caio', total: 5 }]), ['1. Caio: 5 pts'], 'textoDoRanking com um jogador')`,
        },
        {
          descricao: 'Sem jogadores, a lista é vazia',
          codigo: js`igual(textoDoRanking([]), [], 'textoDoRanking([])')`,
        },
        {
          descricao: 'Numera até o décimo',
          codigo: js`const lista = Array.from({ length: 10 }, (_, i) => ({ jogador: 'J' + i, total: 10 - i }));
igual(textoDoRanking(lista)[9], '10. J9: 1 pts', 'A décima linha')`,
        },
      ],
      dicas: [
        'A função do `map` recebe o item e a posição: `(item, posicao) => ...`.',
        'A posição começa em zero, então o número da linha é `posicao + 1`. O texto pode ser um template literal.',
      ],
      solucao: linhas(
        'function textoDoRanking(lista) {',
        '  return lista.map((item, posicao) => `${posicao + 1}. ${item.jogador}: ${item.total} pts`);',
        '}',
      ),
    },
  ],
};
