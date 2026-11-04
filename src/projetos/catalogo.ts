import { buscarLicao } from '@/conteudo';
import { parse } from 'acorn';

export const catalogoProjetos = [
  {
    trilha: 'javascript-do-zero',
    titulo: 'Minha caixa de ferramentas de lógica',
    resumo: 'Reúna funções para resolver pequenos problemas com números e textos.',
    resultados: [
      'Criar funções que recebem valores e devolvem resultados.',
      'Combinar decisões e repetições para resolver problemas.',
      'Testar sua lógica com situações diferentes.',
    ],
    demonstracao:
      'console.log(fizzBuzz(numero));\nconsole.log(ehPrimo(numero));\nconsole.log(fibonacci(numero));\nconsole.log(contarVogais(texto));\nconsole.log(contarNotas(valor));',
    dadosIniciais: 'const numero = 15;\nconst texto = "Aprendendo JavaScript";\nconst valor = 187;',
  },
  {
    trilha: 'listas-e-objetos',
    titulo: 'O estoque da minha loja',
    resumo: 'Calcule o valor do estoque, encontre produtos em falta e prepare um relatório.',
    resultados: [
      'Representar produtos com listas e objetos.',
      'Filtrar, transformar e atualizar dados sem perder os originais.',
      'Montar um relatório útil a partir dos produtos.',
    ],
    demonstracao:
      'console.log(valorEmEstoque(produtos));\nconsole.log(semEstoque(produtos));\nconsole.log(repor(produtos, nome, quantidade));\nconsole.log(relatorio(produtos));',
    dadosIniciais:
      'const produtos = [\n  { nome: "Caneta", preco: 3, quantidade: 10 },\n  { nome: "Caderno", preco: 20, quantidade: 0 },\n  { nome: "Lápis", preco: 2, quantidade: 4 },\n];\nconst nome = "Caderno";\nconst quantidade = 5;',
  },
  {
    trilha: 'listas-e-textos-de-verdade',
    titulo: 'Ranking do meu jogo',
    resumo: 'Transforme pontuações bagunçadas em um placar organizado por jogador.',
    resultados: [
      'Limpar e padronizar textos recebidos.',
      'Agrupar pontuações e ordenar um ranking.',
      'Combinar funções em uma sequência que produz um relatório.',
    ],
    demonstracao:
      'console.log(limparNome(nome));\nconsole.log(totalPorJogador(eventos));\nconsole.log(ranking(totais));\nconsole.log(textoDoRanking(lista));',
    dadosIniciais:
      'const nome = " aNA ";\nconst eventos = [\n  { jogador: "ana", pontos: 10 },\n  { jogador: " Ana ", pontos: 5 },\n  { jogador: "BIA", pontos: 20 },\n];\nconst totais = { Ana: 18, Bia: 12 };\nconst lista = [{ jogador: "Caio", total: 30 }, { jogador: "Ana", total: 18 }];',
  },
  {
    trilha: 'erros-e-assincrono',
    titulo: 'Meu carregador de dados',
    resumo: 'Simule buscas, trate falhas, tente novamente e evite pedidos repetidos.',
    resultados: [
      'Carregar dados em paralelo sem interromper tudo por uma falha.',
      'Usar promessas e async/await com tratamento de erros.',
      'Adicionar novas tentativas, cache e um relatório de carregamento.',
    ],
    demonstracao:
      'console.log(await carregar(ids));\nconsole.log(await buscarComTentativas(funcaoAsync, maximo, pausaMs));\nconsole.log(relatorio(dados));',
    dadosIniciais:
      'const ids = [1, 2, 0];\nconst funcaoAsync = async () => "ok";\nconst maximo = 3;\nconst pausaMs = 10;\nconst buscar = (id) => Promise.resolve("item " + id);\nconst dados = { usuarios: ["Usuário 1"], falhas: [0] };',
  },
] as const;

export function buscarProjeto(slug: string) {
  const meta = catalogoProjetos.find((projeto) => projeto.trilha === slug);
  const origem = meta && buscarLicao(meta.trilha, 'desafio-final');
  if (!meta || !origem) return undefined;
  const codigoInicial = origem.licao.exercicios
    .map((exercicio, indice) => {
      // Na lição isolada, esta etapa já fornece limparNome; no projeto o aluno a constrói uma vez.
      if (meta.trilha === 'listas-e-textos-de-verdade' && indice === 1)
        return 'function totalPorJogador(eventos) {\n}\n';
      // Os exemplos de cada exercício têm variáveis próprias. No projeto,
      // reunimos as funções e fornecemos um conjunto de dados compartilhado.
      const programa = parse(exercicio.codigoInicial, { ecmaVersion: 'latest', allowAwaitOutsideFunction: true });
      return programa.body
        .filter((no) => no.type === 'FunctionDeclaration')
        .map((no) => exercicio.codigoInicial.slice(no.start, no.end))
        .join('\n\n');
    })
    .join('\n');
  return {
    ...meta,
    nomeTrilha: origem.trilha.titulo,
    etapas: origem.licao.exercicios,
    introducao: origem.licao.conteudo,
    codigoInicial: `${meta.dadosIniciais}\n\n${codigoInicial}\n\n${meta.demonstracao}\n`,
    testes: origem.licao.exercicios.flatMap((exercicio) =>
      exercicio.testes.map((teste) => ({ ...teste, descricao: `${exercicio.titulo}: ${teste.descricao}` })),
    ),
  };
}
