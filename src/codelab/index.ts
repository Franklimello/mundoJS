import { ArquivoCodeLab, PastaCodeLab, ProjetoCodeLab, ResultadoBusca } from './tipos';
import { projetoExpressSequelize } from './projetos/api-express-sequelize';
import { projetoNestjsPrisma } from './projetos/api-nestjs-prisma';
import { projetoAlgoritmos } from './projetos/algoritmos-javascript';

export * from './tipos';
export {
  projetoExpressSequelize,
  projetoNestjsPrisma,
  projetoAlgoritmos,
  projetoExpressSequelize as apiExpressSequelize,
  projetoNestjsPrisma as apiNestjsPrisma,
  projetoAlgoritmos as algoritmosJavascript,
};

const PROJETOS: ProjetoCodeLab[] = [projetoExpressSequelize, projetoNestjsPrisma, projetoAlgoritmos];

/**
 * Retorna todos os projetos disponíveis no CodeLab.
 */
export function listarProjetos(): ProjetoCodeLab[] {
  return PROJETOS;
}

/**
 * Busca um projeto pelo ID ou pelo slug.
 */
export function obterProjeto(idOuSlug: string): ProjetoCodeLab | undefined {
  const busca = idOuSlug.toLowerCase().trim();
  return (
    PROJETOS.find((p) => p.id === busca || p.slug === busca) ??
    PROJETOS.find((p) => p.id.includes(busca) || p.slug.includes(busca))
  );
}

/**
 * Coleta recursivamente todos os arquivos contidos em uma pasta e subpastas.
 */
function coletarArquivosDePasta(pasta: PastaCodeLab): ArquivoCodeLab[] {
  const arquivos: ArquivoCodeLab[] = [...pasta.arquivos];
  for (const sub of pasta.pastas) {
    arquivos.push(...coletarArquivosDePasta(sub));
  }
  return arquivos;
}

/**
 * Retorna uma lista linear de todos os arquivos de um projeto.
 */
export function obterTodosArquivos(projeto: ProjetoCodeLab): ArquivoCodeLab[] {
  const arquivos: ArquivoCodeLab[] = [...projeto.estrutura.arquivosRaiz];
  for (const pasta of projeto.estrutura.pastas) {
    arquivos.push(...coletarArquivosDePasta(pasta));
  }
  return arquivos;
}

/**
 * Encontra um arquivo específico em um projeto pelo seu caminho.
 */
export function buscarArquivoNoProjeto(projeto: ProjetoCodeLab, caminho: string): ArquivoCodeLab | undefined {
  const todos = obterTodosArquivos(projeto);
  return todos.find((a) => a.caminho === caminho || a.id === caminho);
}

/**
 * Pesquisa no escopo de um projeto por termo (nome de arquivo, métodos, conteúdo ou documentação).
 */
export function pesquisarNoProjeto(projeto: ProjetoCodeLab, termo: string): ResultadoBusca[] {
  const query = termo.toLowerCase().trim();
  if (!query) return [];

  const arquivos = obterTodosArquivos(projeto);
  const resultados: ResultadoBusca[] = [];

  for (const arquivo of arquivos) {
    // 1. Busca por nome do arquivo
    if (arquivo.nome.toLowerCase().includes(query)) {
      resultados.push({
        arquivo,
        tipo: 'nome',
        correspondencia: arquivo.nome,
        trecho: arquivo.caminho,
      });
      continue;
    }

    // 2. Busca por métodos e funções documentadas
    const metodoEncontrado = arquivo.documentacao.metodos?.find(
      (m) => m.nome.toLowerCase().includes(query) || m.descricao.toLowerCase().includes(query),
    );
    if (metodoEncontrado) {
      resultados.push({
        arquivo,
        tipo: 'metodo',
        correspondencia: metodoEncontrado.nome,
        trecho: metodoEncontrado.assinatura,
      });
      continue;
    }

    // 3. Busca por responsabilidade / resumo
    if (
      arquivo.documentacao.resumo.toLowerCase().includes(query) ||
      arquivo.documentacao.responsabilidade.toLowerCase().includes(query)
    ) {
      resultados.push({
        arquivo,
        tipo: 'responsabilidade',
        correspondencia: arquivo.documentacao.resumo,
        trecho: arquivo.documentacao.responsabilidade,
      });
      continue;
    }

    // 4. Busca no conteúdo do código-fonte (encontra linha)
    const linhas = arquivo.conteudo.split('\n');
    for (let i = 0; i < linhas.length; i++) {
      const linha = linhas[i];
      if (linha && linha.toLowerCase().includes(query)) {
        resultados.push({
          arquivo,
          tipo: 'conteudo',
          correspondencia: linha.trim(),
          linha: i + 1,
          trecho: linha.trim(),
        });
        break; // Evita poluir com dezenas de linhas do mesmo arquivo
      }
    }
  }

  return resultados;
}

/**
 * Pesquisa um termo em todos os projetos cadastrados.
 */
export function pesquisarEmTodosProjetos(termo: string): { projeto: ProjetoCodeLab; resultados: ResultadoBusca[] }[] {
  const termoFormatado = termo.trim();
  if (!termoFormatado) return [];

  return PROJETOS.map((projeto) => ({
    projeto,
    resultados: pesquisarNoProjeto(projeto, termoFormatado),
  })).filter((item) => item.resultados.length > 0);
}
