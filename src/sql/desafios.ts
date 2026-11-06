import { executarSqlEmBancoNovo, type ResultadoExecucaoSql, type ValorSql } from './banco';

export type CategoriaDesafioSql = 'Básico' | 'JOIN' | 'Agrupamento' | 'DML' | 'Avançado';
export type DificuldadeDesafioSql = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface DesafioSql {
  id: string;
  titulo: string;
  categoria: CategoriaDesafioSql;
  dificuldade: DificuldadeDesafioSql;
  enunciado: string;
  tabelas: string[];
  sqlInicial: string;
  dicas: string[];
  solucao: string;
  resultadoEsperadoDescricao: string;
}

export interface ResultadoValidacaoDesafio {
  sucesso: boolean;
  mensagem: string;
  detalhe?: string;
  linhasRetornadas?: number;
  colunasRetornadas?: string[];
  linhasEsperadas?: number;
  colunasEsperadas?: string[];
}

export const DESAFIOS_SQL: DesafioSql[] = [
  {
    id: 'clientes-nordeste-ativos',
    titulo: 'Clientes ativos de PE e CE',
    categoria: 'Básico',
    dificuldade: 'Iniciante',
    enunciado:
      'Selecione o `nome`, `email` e `cidade` de todos os clientes dos estados de Pernambuco (`PE`) ou Ceará (`CE`) que estejam ativos (`ativo = 1`), ordenados alfabeticamente pelo `nome`.',
    tabelas: ['clientes'],
    sqlInicial: '-- Escreva sua consulta SELECT aqui\nSELECT nome, email, cidade\nFROM clientes\nWHERE ...;',
    dicas: [
      "Use a cláusula WHERE combinando ativo = 1 com o operador IN ('PE', 'CE') ou OR.",
      'Lembre-se de ordenar os resultados por nome usando ORDER BY nome ASC.',
    ],
    solucao: `SELECT nome, email, cidade\nFROM clientes\nWHERE ativo = 1 AND estado IN ('PE', 'CE')\nORDER BY nome ASC;`,
    resultadoEsperadoDescricao:
      '1 registro retornado (Eduarda Santos, Recife - PE). Henrique Alves não entra pois está inativo.',
  },
  {
    id: 'produtos-estoque-critico',
    titulo: 'Produtos com estoque crítico',
    categoria: 'Básico',
    dificuldade: 'Iniciante',
    enunciado:
      'Encontre os produtos que precisam de reposição urgente: selecione `nome`, `preco` e `estoque` de todos os produtos com `estoque` menor ou igual a 15 unidades, ordenados do menor estoque para o maior.',
    tabelas: ['produtos'],
    sqlInicial:
      '-- Liste produtos com estoque <= 15\nSELECT nome, preco, estoque\nFROM produtos\nWHERE estoque <= 15\nORDER BY estoque ASC;',
    dicas: ['Use a condição `WHERE estoque <= 15`.', 'Para ordenar do menor para o maior, use `ORDER BY estoque ASC`.'],
    solucao: `SELECT nome, preco, estoque\nFROM produtos\nWHERE estoque <= 15\nORDER BY estoque ASC;`,
    resultadoEsperadoDescricao:
      '4 produtos retornados: Mesa Regulável (5), Monitor Ultrawide (8), Cadeira Ergonômica (12) e Monitor Gamer (15).',
  },
  {
    id: 'pedidos-pagos-detalhados',
    titulo: 'Relatório de pedidos pagos com cliente (INNER JOIN)',
    categoria: 'JOIN',
    dificuldade: 'Intermediário',
    enunciado:
      "Gere um relatório de vendas: una as tabelas `pedidos` e `clientes` para exibir o `id` do pedido (como `pedido_id`), o `nome` do cliente (como `cliente`), o `total` e a `data_pedido`, apenas para pedidos com `status = 'pago'`, ordenados pela `data_pedido` mais recente primeiro.",
    tabelas: ['pedidos', 'clientes'],
    sqlInicial:
      '-- Junte pedidos e clientes com INNER JOIN\nSELECT \n  pedidos.id AS pedido_id,\n  clientes.nome AS cliente,\n  pedidos.total,\n  pedidos.data_pedido\nFROM pedidos\nINNER JOIN clientes ON pedidos.cliente_id = clientes.id\nWHERE ...;',
    dicas: [
      'Use `INNER JOIN clientes ON pedidos.cliente_id = clientes.id`.',
      "Filtre com `WHERE pedidos.status = 'pago'`.",
      'Ordene decrescente pela data com `ORDER BY pedidos.data_pedido DESC`.',
    ],
    solucao: `SELECT \n  pedidos.id AS pedido_id,\n  clientes.nome AS cliente,\n  pedidos.total,\n  pedidos.data_pedido\nFROM pedidos\nINNER JOIN clientes ON pedidos.cliente_id = clientes.id\nWHERE pedidos.status = 'pago'\nORDER BY pedidos.data_pedido DESC;`,
    resultadoEsperadoDescricao: '4 pedidos pagos retornados em ordem cronológica decrescente.',
  },
  {
    id: 'clientes-sem-compras',
    titulo: 'Clientes sem nenhum pedido (LEFT JOIN)',
    categoria: 'JOIN',
    dificuldade: 'Intermediário',
    enunciado:
      'Identifique oportunidades de marketing: liste o `id`, `nome` e `email` dos clientes que nunca fizeram nenhuma compra. Utilize um `LEFT JOIN` entre `clientes` e `pedidos` verificando onde o id do pedido é nulo.',
    tabelas: ['clientes', 'pedidos'],
    sqlInicial:
      '-- Encontre clientes sem pedidos usando LEFT JOIN e IS NULL\nSELECT clientes.id, clientes.nome, clientes.email\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.cliente_id\nWHERE ...;',
    dicas: [
      'Faça `LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id`.',
      'Quando um cliente não tem pedidos associados, as colunas de pedidos vêm como NULL.',
      'Adicione `WHERE pedidos.id IS NULL` e ordene por `clientes.id ASC`.',
    ],
    solucao: `SELECT clientes.id, clientes.nome, clientes.email\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.cliente_id\nWHERE pedidos.id IS NULL\nORDER BY clientes.id ASC;`,
    resultadoEsperadoDescricao: '2 clientes retornados: Diego Ferreira (id 4) e Henrique Alves (id 8).',
  },
  {
    id: 'faturamento-por-categoria',
    titulo: 'Preço médio e catálogo por categoria',
    categoria: 'Agrupamento',
    dificuldade: 'Intermediário',
    enunciado:
      'A diretoria quer entender os produtos por setor: junte `categorias` com `produtos`, agrupe pelo nome da categoria e exiba o nome da categoria como `categoria`, a quantidade total de produtos como `total_produtos` e o preço médio arredondado para duas casas como `preco_medio`. Ordene pelo `preco_medio` do maior para o menor.',
    tabelas: ['categorias', 'produtos'],
    sqlInicial:
      '-- Use GROUP BY com COUNT() e ROUND(AVG(), 2)\nSELECT \n  categorias.nome AS categoria,\n  COUNT(produtos.id) AS total_produtos,\n  ROUND(AVG(produtos.preco), 2) AS preco_medio\nFROM categorias\nINNER JOIN produtos ON categorias.id = produtos.categoria_id\nGROUP BY categorias.nome\nORDER BY preco_medio DESC;',
    dicas: [
      'Use `COUNT(produtos.id)` para contar itens por categoria.',
      'Use `ROUND(AVG(produtos.preco), 2)` para formatar a média com 2 casas decimais.',
      'Ordene por `preco_medio DESC`.',
    ],
    solucao: `SELECT \n  categorias.nome AS categoria,\n  COUNT(produtos.id) AS total_produtos,\n  ROUND(AVG(produtos.preco), 2) AS preco_medio\nFROM categorias\nINNER JOIN produtos ON categorias.id = produtos.categoria_id\nGROUP BY categorias.nome\nORDER BY preco_medio DESC;`,
    resultadoEsperadoDescricao:
      '4 categorias retornadas: Monitores (R$ 1175.00), Mobiliário (R$ 1025.00), Armazenamento (R$ 415.00) e Periféricos (R$ 206.38).',
  },
  {
    id: 'folha-salarial-departamento',
    titulo: 'Departamentos com grande folha salarial (HAVING)',
    categoria: 'Agrupamento',
    dificuldade: 'Intermediário',
    enunciado:
      'Calcule os custos de pessoal: conecte `departamentos` e `funcionarios`, agrupe pelo nome do departamento e exiba o nome do departamento como `departamento`, a quantidade de pessoas como `qtd_funcionarios` e a soma de salários como `folha_total`. Filtre apenas departamentos cuja folha total supere R$ 15.000,00 usando a cláusula `HAVING`.',
    tabelas: ['departamentos', 'funcionarios'],
    sqlInicial:
      '-- Agrupe e filtre com HAVING SUM(salario) > 15000\nSELECT \n  departamentos.nome AS departamento,\n  COUNT(funcionarios.id) AS qtd_funcionarios,\n  SUM(funcionarios.salario) AS folha_total\nFROM departamentos\nINNER JOIN funcionarios ON departamentos.id = funcionarios.departamento_id\nGROUP BY departamentos.nome\nHAVING SUM(funcionarios.salario) > 15000\nORDER BY folha_total DESC;',
    dicas: [
      'Cláusulas WHERE não podem filtrar funções de agregação como SUM(). Para isso usamos HAVING.',
      'Use `HAVING SUM(funcionarios.salario) > 15000`.',
      'Ordene por `folha_total DESC`.',
    ],
    solucao: `SELECT \n  departamentos.nome AS departamento,\n  COUNT(funcionarios.id) AS qtd_funcionarios,\n  SUM(funcionarios.salario) AS folha_total\nFROM departamentos\nINNER JOIN funcionarios ON departamentos.id = funcionarios.departamento_id\nGROUP BY departamentos.nome\nHAVING SUM(funcionarios.salario) > 15000\nORDER BY folha_total DESC;`,
    resultadoEsperadoDescricao:
      '2 departamentos retornados: Engenharia de Software (3 pessoas, R$ 29.700,00) e Design e Produto (2 pessoas, R$ 19.300,00).',
  },
  {
    id: 'funcionarios-acima-da-media',
    titulo: 'Salários acima da média geral (Subquery)',
    categoria: 'Avançado',
    dificuldade: 'Avançado',
    enunciado:
      'Identifique os profissionais seniores: selecione o `nome`, `cargo` e `salario` dos funcionários que recebem um salário estritamente maior do que a média salarial de toda a empresa (`SELECT AVG(salario) FROM funcionarios`). Ordene do maior salário para o menor.',
    tabelas: ['funcionarios'],
    sqlInicial:
      '-- Use uma subconsulta WHERE salario > (SELECT AVG(salario) FROM funcionarios)\nSELECT nome, cargo, salario\nFROM funcionarios\nWHERE salario > (SELECT AVG(salario) FROM funcionarios)\nORDER BY salario DESC;',
    dicas: [
      'Uma subconsulta entre parênteses no WHERE calcula a média global antes da filtragem.',
      'A média salarial da empresa gira em torno de R$ 8.871,43.',
      'Ordene com `ORDER BY salario DESC`.',
    ],
    solucao: `SELECT nome, cargo, salario\nFROM funcionarios\nWHERE salario > (SELECT AVG(salario) FROM funcionarios)\nORDER BY salario DESC;`,
    resultadoEsperadoDescricao:
      '3 funcionários retornados: Camila Ribeiro (14.000), Juliana Castro (12.500) e Vanessa Mendes (8.900).',
  },
  {
    id: 'cadastrar-e-consultar-produto',
    titulo: 'Inserir novo produto no catálogo (DML)',
    categoria: 'DML',
    dificuldade: 'Intermediário',
    enunciado:
      "Cadastre um novo item no estoque: insira na tabela `produtos` um registro com `nome = 'Webcam 4K Ultra'`, `categoria_id = 1` (Periféricos), `preco = 420.00` e `estoque = 25`. Em seguida, execute um SELECT para exibir o produto recém-criado filtrando por esse nome.",
    tabelas: ['produtos'],
    sqlInicial: `-- Insira o produto e em seguida consulte-o\nINSERT INTO produtos (nome, categoria_id, preco, estoque)\nVALUES ('Webcam 4K Ultra', 1, 420.00, 25);\n\nSELECT nome, categoria_id, preco, estoque\nFROM produtos\nWHERE nome = 'Webcam 4K Ultra';`,
    dicas: [
      'Você pode executar múltiplos comandos SQL separando-os por ponto e vírgula (;).',
      'No INSERT, informe as colunas: (nome, categoria_id, preco, estoque).',
      "Faça o SELECT filtrando por `WHERE nome = 'Webcam 4K Ultra'`.",
    ],
    solucao: `INSERT INTO produtos (nome, categoria_id, preco, estoque)\nVALUES ('Webcam 4K Ultra', 1, 420.00, 25);\n\nSELECT nome, categoria_id, preco, estoque\nFROM produtos\nWHERE nome = 'Webcam 4K Ultra';`,
    resultadoEsperadoDescricao: '1 registro inserido e retornado com sucesso.',
  },
];

/** Compara se duas linhas de dados SQL são equivalentes */
function linhasIguais(linhaA: ValorSql[], linhaB: ValorSql[]): boolean {
  if (linhaA.length !== linhaB.length) return false;
  for (let i = 0; i < linhaA.length; i++) {
    const a = linhaA[i];
    const b = linhaB[i];
    if (a === null && b === null) continue;
    if (typeof a === 'number' && typeof b === 'number') {
      // Tolera pequenas variações de ponto flutuante
      if (Math.abs(a - b) > 0.01) return false;
      continue;
    }
    if (String(a).trim() !== String(b).trim()) return false;
  }
  return true;
}

/**
 * Valida o resultado da consulta do aluno em relação ao resultado esperado do desafio.
 */
export function validarResultadoDesafio(
  resultadoAluno: ResultadoExecucaoSql,
  resultadoGabarito: ResultadoExecucaoSql,
): ResultadoValidacaoDesafio {
  if (!resultadoAluno.sucesso) {
    return {
      sucesso: false,
      mensagem: 'O comando SQL retornou um erro de execução.',
      detalhe: resultadoAluno.erro || 'Verifique a sintaxe da consulta.',
    };
  }

  // Desafio com múltiplas tabelas ou DML (INSERT/UPDATE/SELECT)
  const tabelaAluno = resultadoAluno.tabelas[resultadoAluno.tabelas.length - 1];
  const tabelaGabarito = resultadoGabarito.tabelas[resultadoGabarito.tabelas.length - 1];

  if (!tabelaAluno && !tabelaGabarito) {
    // Ambos foram DML puro
    return {
      sucesso: true,
      mensagem: 'Comando executado com sucesso e banco atualizado!',
    };
  }

  if (!tabelaAluno && tabelaGabarito) {
    return {
      sucesso: false,
      mensagem: 'Sua consulta não retornou nenhuma tabela de dados.',
      detalhe: 'Certifique-se de incluir um comando SELECT para exibir o resultado solicitado.',
    };
  }

  if (!tabelaAluno || !tabelaGabarito) {
    return {
      sucesso: false,
      mensagem: 'O resultado não corresponde ao tipo de operação esperada.',
    };
  }

  const colunasAluno = tabelaAluno.colunas;
  const colunasGabarito = tabelaGabarito.colunas;
  const linhasAluno = tabelaAluno.linhas;
  const linhasGabarito = tabelaGabarito.linhas;

  // 1. Verifica quantidade de linhas
  if (linhasAluno.length !== linhasGabarito.length) {
    return {
      sucesso: false,
      mensagem: `Quantidade de linhas diferente do esperado.`,
      detalhe: `Sua consulta retornou ${linhasAluno.length} registro(s), mas o esperado eram ${linhasGabarito.length} registro(s). Verifique os filtros na cláusula WHERE ou os JOINs.`,
      linhasRetornadas: linhasAluno.length,
      linhasEsperadas: linhasGabarito.length,
      colunasRetornadas: colunasAluno,
      colunasEsperadas: colunasGabarito,
    };
  }

  // 2. Verifica quantidade de colunas
  if (colunasAluno.length !== colunasGabarito.length) {
    return {
      sucesso: false,
      mensagem: `Quantidade de colunas diferente do esperado.`,
      detalhe: `Sua consulta retornou ${colunasAluno.length} coluna(s) (${colunasAluno.join(', ')}), mas o esperado eram ${colunasGabarito.length} coluna(s) (${colunasGabarito.join(', ')}).`,
      linhasRetornadas: linhasAluno.length,
      linhasEsperadas: linhasGabarito.length,
      colunasRetornadas: colunasAluno,
      colunasEsperadas: colunasGabarito,
    };
  }

  // 3. Verifica dados linha a linha (ordem estrita)
  let diferencaEncontrada: string | null = null;
  for (let i = 0; i < linhasGabarito.length; i++) {
    const lA = linhasAluno[i];
    const lG = linhasGabarito[i];
    if (!lA || !lG || !linhasIguais(lA, lG)) {
      diferencaEncontrada = `Na linha #${i + 1}, esperado [${lG?.join(', ') ?? ''}], mas foi retornado [${lA?.join(', ') ?? ''}].`;
      break;
    }
  }

  if (diferencaEncontrada) {
    // Testa se os registros existem mas estão em ordem diferente
    const dadosIguaisSemOrdem =
      linhasAluno.length === linhasGabarito.length &&
      linhasAluno.every((lA) => lA && linhasGabarito.some((lG) => lG && linhasIguais(lA, lG)));

    if (dadosIguaisSemOrdem) {
      return {
        sucesso: false,
        mensagem: 'Os dados foram encontrados, mas a ordenação está diferente.',
        detalhe: 'Verifique a cláusula ORDER BY para ordenar os resultados exatamente como solicitado no enunciado.',
        linhasRetornadas: linhasAluno.length,
        linhasEsperadas: linhasGabarito.length,
        colunasRetornadas: colunasAluno,
        colunasEsperadas: colunasGabarito,
      };
    }

    return {
      sucesso: false,
      mensagem: 'Os valores retornados não correspondem ao gabarito do desafio.',
      detalhe: diferencaEncontrada,
      linhasRetornadas: linhasAluno.length,
      linhasEsperadas: linhasGabarito.length,
      colunasRetornadas: colunasAluno,
      colunasEsperadas: colunasGabarito,
    };
  }

  return {
    sucesso: true,
    mensagem: 'Excelente! Consulta validada com perfeição!',
    detalhe: `Todos os ${linhasAluno.length} registro(s) e ${colunasAluno.length} coluna(s) correspondem ao resultado esperado.`,
    linhasRetornadas: linhasAluno.length,
    linhasEsperadas: linhasGabarito.length,
    colunasRetornadas: colunasAluno,
    colunasEsperadas: colunasGabarito,
  };
}

/**
 * Executa a tentativa do aluno e a solução de referência de forma isolada e compara os resultados.
 */
export async function validarDesafio(sqlAluno: string, desafio: DesafioSql): Promise<ResultadoValidacaoDesafio> {
  const sqlLimpo = sqlAluno.trim();
  if (!sqlLimpo) {
    return {
      sucesso: false,
      mensagem: 'Digite um comando SQL no editor antes de validar.',
    };
  }

  // 1. Executa SQL do aluno em um banco isolado e limpo
  const resAluno = await executarSqlEmBancoNovo(sqlLimpo);
  if (!resAluno.sucesso) {
    return {
      sucesso: false,
      mensagem: 'O comando SQL retornou um erro de execução no SQLite.',
      detalhe: resAluno.erro || 'Verifique a sintaxe da consulta.',
    };
  }

  // 2. Executa a solução em outro banco isolado e limpo
  const resGabarito = await executarSqlEmBancoNovo(desafio.solucao);

  // 3. Compara os resultados de forma estruturada
  return validarResultadoDesafio(resAluno, resGabarito);
}
