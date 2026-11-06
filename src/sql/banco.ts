import initSqlJs, { type Database, type SqlValue } from 'sql.js';

export type ValorSql = SqlValue;

export interface TabelaResultado {
  colunas: string[];
  linhas: ValorSql[][];
}

export interface ResultadoExecucaoSql {
  sucesso: boolean;
  tabelas: TabelaResultado[];
  linhasAfetadas?: number;
  mensagem?: string;
  duracaoMs: number;
  erro?: string;
}

export interface ColunaInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: unknown;
  pk: number;
}

export interface TabelaInfo {
  nome: string;
  colunas: ColunaInfo[];
  totalLinhas: number;
}

export interface ExemploSql {
  id: string;
  titulo: string;
  categoria: 'Básico' | 'Agrupamento' | 'JOIN' | 'DML';
  descricao: string;
  sql: string;
}

export const ESQUEMA_INICIAL_SQL = `
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  ativo INTEGER DEFAULT 1,
  criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO clientes (id, nome, email, cidade, estado, ativo, criado_em) VALUES
  (1, 'Ana Silva', 'ana.silva@email.com', 'São Paulo', 'SP', 1, '2026-01-15'),
  (2, 'Carlos Souza', 'carlos.souza@email.com', 'Rio de Janeiro', 'RJ', 1, '2026-02-10'),
  (3, 'Beatriz Lima', 'beatriz.lima@email.com', 'Belo Horizonte', 'MG', 1, '2026-02-18'),
  (4, 'Diego Ferreira', 'diego.ferreira@email.com', 'Curitiba', 'PR', 0, '2026-03-01'),
  (5, 'Eduarda Santos', 'eduarda.santos@email.com', 'Recife', 'PE', 1, '2026-03-12'),
  (6, 'Felipe Rocha', 'felipe.rocha@email.com', 'Porto Alegre', 'RS', 1, '2026-04-05'),
  (7, 'Gabriela Costa', 'gabriela.costa@email.com', 'Salvador', 'BA', 1, '2026-04-20'),
  (8, 'Henrique Alves', 'henrique.alves@email.com', 'Fortaleza', 'CE', 0, '2026-05-02');

CREATE TABLE categorias (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL
);

INSERT INTO categorias (id, nome) VALUES
  (1, 'Periféricos'),
  (2, 'Monitores'),
  (3, 'Mobiliário'),
  (4, 'Armazenamento');

CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria_id INTEGER,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

INSERT INTO produtos (id, nome, categoria_id, preco, estoque) VALUES
  (1, 'Teclado Mecânico RGB', 1, 280.00, 35),
  (2, 'Mouse Óptico Sem Fio', 1, 120.50, 50),
  (3, 'Headset Surround 7.1', 1, 350.00, 20),
  (4, 'Monitor Gamer 24" 144Hz', 2, 950.00, 15),
  (5, 'Monitor Ultrawide 29"', 2, 1400.00, 8),
  (6, 'Cadeira Ergonômica', 3, 850.00, 12),
  (7, 'Mesa Regulável', 3, 1200.00, 5),
  (8, 'SSD NVMe 1TB', 4, 450.00, 40),
  (9, 'HD Externo 2TB', 4, 380.00, 25),
  (10, 'Mousepad Grande 90x40', 1, 75.00, 60);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  total REAL NOT NULL,
  status TEXT NOT NULL,
  data_pedido TEXT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

INSERT INTO pedidos (id, cliente_id, total, status, data_pedido) VALUES
  (101, 1, 400.50, 'pago', '2026-04-01'),
  (102, 2, 950.00, 'pago', '2026-04-03'),
  (103, 1, 1400.00, 'entregue', '2026-04-10'),
  (104, 3, 120.50, 'pago', '2026-04-15'),
  (105, 5, 1275.00, 'pendente', '2026-04-20'),
  (106, 6, 280.00, 'cancelado', '2026-04-22'),
  (107, 7, 850.00, 'pago', '2026-04-25');

CREATE TABLE departamentos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  orcamento REAL NOT NULL
);

INSERT INTO departamentos (id, nome, orcamento) VALUES
  (1, 'Engenharia de Software', 250000.00),
  (2, 'Design e Produto', 120000.00),
  (3, 'Atendimento e Sucesso', 80000.00),
  (4, 'Marketing e Vendas', 95000.00);

CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  salario REAL NOT NULL,
  departamento_id INTEGER,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

INSERT INTO funcionarios (id, nome, cargo, salario, departamento_id) VALUES
  (1, 'Lucas Martins', 'Desenvolvedor Frontend', 7500.00, 1),
  (2, 'Camila Ribeiro', 'Tech Lead', 14000.00, 1),
  (3, 'Rodrigo Prado', 'Designer UX/UI', 6800.00, 2),
  (4, 'Juliana Castro', 'Gerente de Produto', 12500.00, 2),
  (5, 'Renato Farias', 'Especialista de Suporte', 4200.00, 3),
  (6, 'Vanessa Mendes', 'Coordenadora de Vendas', 8900.00, 4),
  (7, 'Gustavo Teixeira', 'Desenvolvedor Backend', 8200.00, 1);
`.trim();

export const EXEMPLOS_SQL: ExemploSql[] = [
  {
    id: 'clientes-ativos',
    titulo: 'Clientes de SP e RJ',
    categoria: 'Básico',
    descricao: 'Filtra clientes ativos das regiões SP e RJ ordenados alfabeticamente.',
    sql: `SELECT id, nome, email, cidade, estado\nFROM clientes\nWHERE ativo = 1 AND estado IN ('SP', 'RJ')\nORDER BY nome ASC;`,
  },
  {
    id: 'produtos-caros',
    titulo: 'Produtos > R$ 300',
    categoria: 'Básico',
    descricao: 'Busca produtos com valor a partir de R$ 300, ordenados do mais caro ao mais barato.',
    sql: `SELECT nome, preco, estoque\nFROM produtos\nWHERE preco >= 300\nORDER BY preco DESC;`,
  },
  {
    id: 'pedidos-com-cliente',
    titulo: 'Pedidos com dados do cliente (INNER JOIN)',
    categoria: 'JOIN',
    descricao: 'Conecta a tabela de pedidos com clientes para mostrar quem realizou cada compra.',
    sql: `SELECT \n  pedidos.id AS pedido_id,\n  clientes.nome AS cliente,\n  pedidos.total,\n  pedidos.status,\n  pedidos.data_pedido\nFROM pedidos\nINNER JOIN clientes ON pedidos.cliente_id = clientes.id\nORDER BY pedidos.data_pedido DESC;`,
  },
  {
    id: 'clientes-sem-pedidos',
    titulo: 'Clientes que não compraram (LEFT JOIN)',
    categoria: 'JOIN',
    descricao: 'Usa LEFT JOIN com IS NULL para identificar clientes que ainda não geraram pedidos.',
    sql: `SELECT clientes.id, clientes.nome, clientes.email\nFROM clientes\nLEFT JOIN pedidos ON clientes.id = pedidos.cliente_id\nWHERE pedidos.id IS NULL;`,
  },
  {
    id: 'agrupamento-categorias',
    titulo: 'Métricas por categoria (GROUP BY)',
    categoria: 'Agrupamento',
    descricao: 'Calcula a quantidade de produtos, preço médio e preço máximo por categoria.',
    sql: `SELECT \n  categorias.nome AS categoria,\n  COUNT(produtos.id) AS total_produtos,\n  ROUND(AVG(produtos.preco), 2) AS preco_medio,\n  MAX(produtos.preco) AS maior_preco\nFROM categorias\nINNER JOIN produtos ON categorias.id = produtos.categoria_id\nGROUP BY categorias.nome\nORDER BY total_produtos DESC;`,
  },
  {
    id: 'salarios-departamento',
    titulo: 'Folha salarial por departamento (HAVING)',
    categoria: 'Agrupamento',
    descricao: 'Calcula o total de salários por departamento e filtra apenas setores com folha > R$ 10.000.',
    sql: `SELECT \n  departamentos.nome AS departamento,\n  COUNT(funcionarios.id) AS num_funcionarios,\n  SUM(funcionarios.salario) AS folha_salarial,\n  ROUND(AVG(funcionarios.salario), 2) AS media_salarial\nFROM departamentos\nINNER JOIN funcionarios ON departamentos.id = funcionarios.departamento_id\nGROUP BY departamentos.nome\nHAVING SUM(funcionarios.salario) > 10000\nORDER BY folha_salarial DESC;`,
  },
  {
    id: 'inserir-cliente',
    titulo: 'Cadastrar novo cliente (INSERT)',
    categoria: 'DML',
    descricao: 'Insere um novo registro de cliente e depois consulta a tabela.',
    sql: `INSERT INTO clientes (nome, email, cidade, estado, ativo)\nVALUES ('Mariana Ramos', 'mariana.ramos@email.com', 'Campinas', 'SP', 1);\n\nSELECT * FROM clientes ORDER BY id DESC LIMIT 3;`,
  },
  {
    id: 'atualizar-estoque',
    titulo: 'Atualizar preço com desconto (UPDATE)',
    categoria: 'DML',
    descricao: 'Aplica 10% de desconto no produto de id = 1 e consulta a linha atualizada.',
    sql: `UPDATE produtos \nSET preco = ROUND(preco * 0.9, 2)\nWHERE id = 1;\n\nSELECT id, nome, preco, estoque FROM produtos WHERE id = 1;`,
  },
];

let instanciaBanco: Database | null = null;
let promessaInicializacao: Promise<Database> | null = null;

async function obterLocalDoWasm(): Promise<(arquivo: string) => string> {
  if (typeof window === 'undefined') {
    const path = await import('path');
    return (arquivo: string) => {
      const nome = arquivo || 'sql-wasm-browser.wasm';
      return path.resolve('./public', nome);
    };
  }
  return (arquivo: string) => `/${arquivo}`;
}

export async function criarOuRestaurarBanco(): Promise<Database> {
  const locateFile = await obterLocalDoWasm();
  const SQL = await initSqlJs({ locateFile });
  const banco = new SQL.Database();
  banco.run(ESQUEMA_INICIAL_SQL);
  instanciaBanco = banco;
  return banco;
}

/** Executa uma consulta em uma instância temporária e isolada com o esquema inicial */
export async function executarSqlEmBancoNovo(codigoSql: string): Promise<ResultadoExecucaoSql> {
  const locateFile = await obterLocalDoWasm();
  const SQL = await initSqlJs({ locateFile });
  const banco = new SQL.Database();
  banco.run(ESQUEMA_INICIAL_SQL);
  const inicio = performance.now();
  try {
    const resultados = banco.exec(codigoSql);
    const duracaoMs = Math.round((performance.now() - inicio) * 100) / 100;
    const tabelas: TabelaResultado[] = resultados.map((item) => ({
      colunas: item.columns,
      linhas: item.values,
    }));
    const linhasAfetadas = banco.getRowsModified();
    return {
      sucesso: true,
      tabelas,
      linhasAfetadas,
      duracaoMs,
    };
  } catch (erro) {
    const duracaoMs = Math.round((performance.now() - inicio) * 100) / 100;
    return {
      sucesso: false,
      tabelas: [],
      duracaoMs,
      erro: erro instanceof Error ? erro.message : String(erro),
    };
  } finally {
    banco.close();
  }
}

export async function obterBanco(): Promise<Database> {
  if (instanciaBanco) return instanciaBanco;
  if (!promessaInicializacao) {
    promessaInicializacao = criarOuRestaurarBanco().then((b) => {
      instanciaBanco = b;
      return b;
    });
  }
  return promessaInicializacao;
}

export async function executarSql(codigoSql: string): Promise<ResultadoExecucaoSql> {
  const inicio = performance.now();
  const sqlLimpo = codigoSql.trim();

  if (!sqlLimpo) {
    return {
      sucesso: false,
      tabelas: [],
      duracaoMs: 0,
      erro: 'Nenhum comando SQL foi digitado para executar.',
    };
  }

  try {
    const banco = await obterBanco();
    const resultados = banco.exec(sqlLimpo);
    const duracaoMs = Math.round((performance.now() - inicio) * 100) / 100;

    const tabelas: TabelaResultado[] = resultados.map((item) => ({
      colunas: item.columns,
      linhas: item.values,
    }));

    // Se não gerou tabelas (como num INSERT/UPDATE/DELETE/CREATE TABLE puro)
    const linhasAfetadas = banco.getRowsModified();
    const ehDmlOuDdl = tabelas.length === 0;

    let mensagem: string | undefined;
    if (ehDmlOuDdl) {
      mensagem =
        linhasAfetadas > 0
          ? `Comando executado com sucesso. ${linhasAfetadas} linha(s) afetada(s).`
          : 'Comando executado com sucesso no SQLite.';
    }

    return {
      sucesso: true,
      tabelas,
      linhasAfetadas,
      mensagem,
      duracaoMs,
    };
  } catch (erro) {
    const duracaoMs = Math.round((performance.now() - inicio) * 100) / 100;
    const mensagemErro = erro instanceof Error ? erro.message : String(erro);
    return {
      sucesso: false,
      tabelas: [],
      duracaoMs,
      erro: mensagemErro,
    };
  }
}

export async function obterEsquema(): Promise<TabelaInfo[]> {
  const banco = await obterBanco();
  const resultadoTabelas = banco.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC;",
  );

  const primeiraTabela = resultadoTabelas[0];
  if (!primeiraTabela || resultadoTabelas.length === 0) return [];
  const nomesTabelas = primeiraTabela.values.map((v) => String(v[0]));

  const esquema: TabelaInfo[] = [];

  for (const nome of nomesTabelas) {
    const infoColunas = banco.exec(`PRAGMA table_info("${nome}");`);
    const primeiraInfo = infoColunas[0];
    const colunas: ColunaInfo[] =
      primeiraInfo && infoColunas.length > 0
        ? primeiraInfo.values.map((c) => ({
            cid: Number(c[0]),
            name: String(c[1]),
            type: String(c[2]),
            notnull: Number(c[3]),
            dflt_value: c[4],
            pk: Number(c[5]),
          }))
        : [];

    const contagem = banco.exec(`SELECT COUNT(*) FROM "${nome}";`);
    const primeiroResultado = contagem[0];
    const totalLinhas =
      primeiroResultado && primeiroResultado.values[0] && primeiroResultado.values[0][0] !== undefined
        ? Number(primeiroResultado.values[0][0])
        : 0;

    esquema.push({
      nome,
      colunas,
      totalLinhas,
    });
  }

  return esquema;
}
