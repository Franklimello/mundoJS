import { describe, expect, it } from 'vitest';
import {
  buscarArquivoNoProjeto,
  listarProjetos,
  obterProjeto,
  obterTodosArquivos,
  pesquisarEmTodosProjetos,
  pesquisarNoProjeto,
} from './index';

describe('Catálogo CodeLab', () => {
  it('deve listar os 3 projetos principais de referência', () => {
    const projetos = listarProjetos();
    expect(projetos).toHaveLength(3);

    const ids = projetos.map((p) => p.id);
    expect(ids).toContain('api-express-sequelize');
    expect(ids).toContain('api-nestjs-prisma');
    expect(ids).toContain('algoritmos-javascript');
  });

  it('deve encontrar projeto por id e slug', () => {
    const p1 = obterProjeto('api-express-sequelize');
    expect(p1).toBeDefined();
    expect(p1?.nome).toBe('API Node.js + Express + Sequelize');

    const p2 = obterProjeto('api-nestjs-prisma');
    expect(p2).toBeDefined();
    expect(p2?.slug).toBe('api-nestjs-prisma');

    const p3 = obterProjeto('algoritmos');
    expect(p3).toBeDefined();
    expect(p3?.id).toBe('algoritmos-javascript');
  });

  it('deve extrair todos os arquivos de cada projeto sem duplicações', () => {
    const projetos = listarProjetos();

    for (const projeto of projetos) {
      const arquivos = obterTodosArquivos(projeto);
      expect(arquivos.length).toBeGreaterThan(5);

      const ids = arquivos.map((a) => a.id);
      const setIds = new Set(ids);
      expect(setIds.size).toBe(ids.length); // Nenhum id duplicado
    }
  });

  it('deve encontrar arquivos específicos pelo caminho no projeto Express', () => {
    const projeto = obterProjeto('api-express-sequelize');
    expect(projeto).toBeDefined();
    if (!projeto) return;

    const controller = buscarArquivoNoProjeto(projeto, 'src/controllers/UsuarioController.js');
    expect(controller).toBeDefined();
    expect(controller?.nome).toBe('UsuarioController.js');
    expect(controller?.documentacao.metodos?.length).toBeGreaterThan(0);
    expect(controller?.documentacao.relacionamentos?.importaDe?.length).toBeGreaterThan(0);
  });

  it('deve encontrar arquivos específicos no projeto NestJS + Prisma', () => {
    const projeto = obterProjeto('api-nestjs-prisma');
    expect(projeto).toBeDefined();
    if (!projeto) return;

    const schema = buscarArquivoNoProjeto(projeto, 'prisma/schema.prisma');
    expect(schema).toBeDefined();
    expect(schema?.linguagem).toBe('prisma');

    const controller = buscarArquivoNoProjeto(projeto, 'src/modules/usuarios/usuarios.controller.ts');
    expect(controller).toBeDefined();
    expect(controller?.documentacao.metodos?.length).toBeGreaterThan(0);
  });

  it('deve encontrar arquivos na biblioteca de algoritmos', () => {
    const projeto = obterProjeto('algoritmos-javascript');
    expect(projeto).toBeDefined();
    if (!projeto) return;

    const debounce = buscarArquivoNoProjeto(projeto, 'manipulacao-dados/debounce.ts');
    expect(debounce).toBeDefined();
    expect(debounce?.documentacao.exemplos?.length).toBeGreaterThan(0);
  });

  it('deve pesquisar por termo dentro do projeto', () => {
    const projeto = obterProjeto('api-express-sequelize');
    expect(projeto).toBeDefined();
    if (!projeto) return;

    // Busca por método
    const resMetodo = pesquisarNoProjeto(projeto, 'listar');
    expect(resMetodo.length).toBeGreaterThan(0);

    // Busca por nome de arquivo
    const resNome = pesquisarNoProjeto(projeto, 'UsuarioController');
    expect(resNome.length).toBeGreaterThan(0);
    expect(resNome[0]?.tipo).toBe('nome');

    // Busca por termo no código
    const resCodigo = pesquisarNoProjeto(projeto, 'Sequelize');
    expect(resCodigo.length).toBeGreaterThan(0);
  });

  it('deve pesquisar globalmente em todos os projetos', () => {
    const resultados = pesquisarEmTodosProjetos('Usuario');
    expect(resultados.length).toBeGreaterThanOrEqual(2);
  });
});
