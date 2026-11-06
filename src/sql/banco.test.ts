import { describe, expect, it } from 'vitest';
import { criarOuRestaurarBanco, executarSql, obterBanco, obterEsquema } from './banco';

describe('banco SQLite em memória (sql.js)', () => {
  it('inicializa com o esquema e dados populados', async () => {
    const banco = await obterBanco();
    expect(banco).toBeDefined();

    const esquema = await obterEsquema();
    const nomesTabelas = esquema.map((t) => t.nome);
    expect(nomesTabelas).toContain('clientes');
    expect(nomesTabelas).toContain('produtos');
    expect(nomesTabelas).toContain('pedidos');
    expect(nomesTabelas).toContain('departamentos');
    expect(nomesTabelas).toContain('funcionarios');
  });

  it('executa consultas SELECT com filtragem e ordenação', async () => {
    const resultado = await executarSql("SELECT nome, cidade FROM clientes WHERE estado = 'SP' ORDER BY nome ASC;");
    expect(resultado.sucesso).toBe(true);
    expect(resultado.erro).toBeUndefined();
    expect(resultado.tabelas).toHaveLength(1);

    const tabela = resultado.tabelas[0]!;
    expect(tabela.colunas).toEqual(['nome', 'email', 'cidade'].filter((c) => ['nome', 'cidade'].includes(c)));
    expect(tabela.linhas.length).toBeGreaterThanOrEqual(1);
    expect(tabela.linhas[0]![0]).toBe('Ana Silva');
  });

  it('executa consultas relacionais com INNER JOIN', async () => {
    const resultado = await executarSql(`
      SELECT pedidos.id, clientes.nome, pedidos.total
      FROM pedidos
      INNER JOIN clientes ON pedidos.cliente_id = clientes.id
      ORDER BY pedidos.id ASC;
    `);

    expect(resultado.sucesso).toBe(true);
    expect(resultado.tabelas[0]!.colunas).toEqual(['id', 'nome', 'total']);
    expect(resultado.tabelas[0]!.linhas.length).toBe(7);
  });

  it('executa agregações com GROUP BY e HAVING', async () => {
    const resultado = await executarSql(`
      SELECT departamento_id, COUNT(*) AS total_func, ROUND(AVG(salario), 2) AS media_sal
      FROM funcionarios
      GROUP BY departamento_id
      HAVING COUNT(*) >= 2;
    `);

    expect(resultado.sucesso).toBe(true);
    expect(resultado.tabelas[0]!.linhas.length).toBeGreaterThan(0);
  });

  it('retorna erro detalhado em caso de sintaxe SQL inválida', async () => {
    const resultado = await executarSql('SELECT FROM WHERE;');
    expect(resultado.sucesso).toBe(false);
    expect(resultado.erro).toBeDefined();
    expect(resultado.erro?.toLowerCase()).toContain('syntax');
  });

  it('executa INSERT e reflete o novo registro', async () => {
    const insertRes = await executarSql("INSERT INTO categorias (id, nome) VALUES (99, 'Acessórios');");
    expect(insertRes.sucesso).toBe(true);

    const selectRes = await executarSql('SELECT nome FROM categorias WHERE id = 99;');
    expect(selectRes.sucesso).toBe(true);
    expect(selectRes.tabelas[0]!.linhas[0]![0]).toBe('Acessórios');
  });

  it('restaura o banco para o estado original', async () => {
    await criarOuRestaurarBanco();
    const selectRes = await executarSql('SELECT nome FROM categorias WHERE id = 99;');
    expect(selectRes.sucesso).toBe(true);
    const linhas = selectRes.tabelas[0]?.linhas ?? [];
    expect(linhas).toHaveLength(0);
  });
});
