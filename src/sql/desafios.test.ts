import { describe, expect, it } from 'vitest';
import { criarOuRestaurarBanco, executarSql } from './banco';
import { DESAFIOS_SQL, validarDesafio, validarResultadoDesafio } from './desafios';

describe('Catálogo e validação de desafios de SQL', () => {
  it('contém lista de desafios estruturados com enunciado, dicas e solução', () => {
    expect(DESAFIOS_SQL.length).toBeGreaterThanOrEqual(8);
    for (const desafio of DESAFIOS_SQL) {
      expect(desafio.id).toBeTruthy();
      expect(desafio.titulo).toBeTruthy();
      expect(desafio.enunciado).toBeTruthy();
      expect(desafio.solucao).toBeTruthy();
      expect(desafio.tabelas.length).toBeGreaterThan(0);
      expect(desafio.dicas.length).toBeGreaterThan(0);
    }
  });

  it('cada solução do gabarito executa com sucesso no banco SQLite real', async () => {
    for (const desafio of DESAFIOS_SQL) {
      // Restaura o banco antes de cada teste para garantir isolamento
      await criarOuRestaurarBanco();
      const resultado = await executarSql(desafio.solucao);
      expect(resultado.sucesso, `Erro no desafio ${desafio.id}: ${resultado.erro}`).toBe(true);

      // Valida o gabarito contra si mesmo
      const validacao = validarResultadoDesafio(resultado, resultado);
      expect(validacao.sucesso, `Validação falhou para ${desafio.id}: ${validacao.mensagem}`).toBe(true);
    }
  });

  it('identifica erro de sintaxe ou execução', () => {
    const erroAluno = {
      sucesso: false,
      tabelas: [],
      duracaoMs: 1,
      erro: 'no such table: inexistente',
    };
    const gabaritoOk = {
      sucesso: true,
      tabelas: [{ colunas: ['id'], linhas: [[1]] }],
      duracaoMs: 1,
    };
    const validacao = validarResultadoDesafio(erroAluno, gabaritoOk);
    expect(validacao.sucesso).toBe(false);
    expect(validacao.mensagem).toContain('retornou um erro');
  });

  it('detecta diferença na quantidade de linhas e colunas', () => {
    const resMenosLinhas = {
      sucesso: true,
      tabelas: [{ colunas: ['id', 'nome'], linhas: [[1, 'Ana']] }],
      duracaoMs: 1,
    };
    const gabarito = {
      sucesso: true,
      tabelas: [
        {
          colunas: ['id', 'nome'],
          linhas: [
            [1, 'Ana'],
            [2, 'Carlos'],
          ],
        },
      ],
      duracaoMs: 1,
    };

    const validacaoLinhas = validarResultadoDesafio(resMenosLinhas, gabarito);
    expect(validacaoLinhas.sucesso).toBe(false);
    expect(validacaoLinhas.mensagem).toContain('Quantidade de linhas diferente');

    const resMenosColunas = {
      sucesso: true,
      tabelas: [
        {
          colunas: ['id'],
          linhas: [[1], [2]],
        },
      ],
      duracaoMs: 1,
    };

    const validacaoColunas = validarResultadoDesafio(resMenosColunas, gabarito);
    expect(validacaoColunas.sucesso).toBe(false);
    expect(validacaoColunas.mensagem).toContain('Quantidade de colunas diferente');
  });

  it('detecta ordenação divergente', () => {
    const alunoDesordenado = {
      sucesso: true,
      tabelas: [
        {
          colunas: ['nome'],
          linhas: [['Zilda'], ['Ana']],
        },
      ],
      duracaoMs: 1,
    };
    const gabaritoOrdenado = {
      sucesso: true,
      tabelas: [
        {
          colunas: ['nome'],
          linhas: [['Ana'], ['Zilda']],
        },
      ],
      duracaoMs: 1,
    };

    const validacao = validarResultadoDesafio(alunoDesordenado, gabaritoOrdenado);
    expect(validacao.sucesso).toBe(false);
    expect(validacao.mensagem).toContain('ordenação');
  });

  it('valida fim a fim com validarDesafio testando solução correta e código incompleto', async () => {
    const primeiro = DESAFIOS_SQL[0];
    expect(primeiro).toBeDefined();
    if (!primeiro) return;
    const sucesso = await validarDesafio(primeiro.solucao, primeiro);
    expect(sucesso.sucesso).toBe(true);

    const incompleto = await validarDesafio('SELECT * FROM clientes;', primeiro);
    expect(incompleto.sucesso).toBe(false);
  });
});
