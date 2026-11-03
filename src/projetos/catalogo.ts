import { buscarLicao } from '@/conteudo';

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
      '// Experimente depois de implementar:\n// console.log(contarVogais("Aprendendo JavaScript"));\n// console.log(contarNotas(187));',
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
      '// Experimente depois de implementar:\n// const produtos = [{ nome: "Caderno", preco: 12, quantidade: 3 }];\n// console.log(relatorio(produtos));',
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
      '// Experimente depois de implementar:\n// const eventos = [{ jogador: " aNA ", pontos: 10 }, { jogador: "Ana", pontos: 5 }];\n// console.log(textoDoRanking(ranking(totalPorJogador(eventos))));',
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
      '// Experimente depois de implementar:\n// const resultado = await carregar([1, 2, 0]);\n// console.log(relatorio(resultado));',
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
        return 'function totalPorJogador(eventos) {\n  // some os pontos de cada jogador, usando limparNome\n}\n';
      return exercicio.codigoInicial;
    })
    .join('\n');
  return {
    ...meta,
    nomeTrilha: origem.trilha.titulo,
    etapas: origem.licao.exercicios,
    introducao: origem.licao.conteudo,
    codigoInicial: `${codigoInicial}\n${meta.demonstracao}\n`,
    testes: origem.licao.exercicios.flatMap((exercicio) =>
      exercicio.testes.map((teste) => ({ ...teste, descricao: `${exercicio.titulo}: ${teste.descricao}` })),
    ),
  };
}
