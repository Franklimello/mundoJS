'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArquivoCodeLab, ProjetoCodeLab } from '@/codelab/tipos';
import { buscarArquivoNoProjeto, listarProjetos, obterProjeto, obterTodosArquivos } from '@/codelab';
import { CodeLabActivityBar, SecaoActivityBar } from './CodeLabActivityBar';
import { CodeLabSidebar } from './CodeLabSidebar';
import { CodeLabEditorHeader } from './CodeLabEditorHeader';
import { EditorCodeLab } from './EditorCodeLab';
import { AbaPainelTecnico, CodeLabBottomPanel } from './CodeLabBottomPanel';
import { CodeLabStatusBar } from './CodeLabStatusBar';

const CHAVE_STORAGE_FAVORITOS = 'mundojs_codelab_favoritos_v1';
const CHAVE_STORAGE_PROJETO = 'mundojs_codelab_projeto_ativo_v1';

export function CodeLab() {
  const projetos = listarProjetos();
  const primeiroProjeto = projetos[0] as ProjetoCodeLab;

  // Estado do projeto ativo (com leitura preguiçosa do localStorage)
  const [projetoAtual, setProjetoAtual] = useState<ProjetoCodeLab>(() => {
    if (typeof window === 'undefined') return primeiroProjeto;
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE_PROJETO);
      if (salvo) {
        const encontrado = obterProjeto(salvo);
        if (encontrado) return encontrado;
      }
    } catch {
      // localStorage indisponível
    }
    return primeiroProjeto;
  });

  // Arquivo padrão do projeto inicial
  const arquivoInicial =
    buscarArquivoNoProjeto(projetoAtual, projetoAtual.arquivoPadrao) ?? obterTodosArquivos(projetoAtual)[0] ?? null;

  // Abas abertas
  const [abasAbertas, setAbasAbertas] = useState<ArquivoCodeLab[]>(() => (arquivoInicial ? [arquivoInicial] : []));

  // Arquivo atualmente visualizado no editor
  const [arquivoAtivo, setArquivoAtivo] = useState<ArquivoCodeLab | null>(() => arquivoInicial);

  // Linha para scroll/destaque (ex: via busca)
  const [linhaDestaque, setLinhaDestaque] = useState<number | undefined>(undefined);

  // Sidebar e Activity Bar
  const [secaoSidebar, setSecaoSidebar] = useState<SecaoActivityBar | null>('explorer');
  const [sidebarAberta, setSidebarAberta] = useState(true);

  // Painel inferior de documentação
  const [painelInferiorAberto, setPainelInferiorAberto] = useState(true);
  const [abaPainelInferior, setAbaPainelInferior] = useState<AbaPainelTecnico>('explicacao');

  // Favoritos persistidos
  const [favoritosIds, setFavoritosIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const dados = localStorage.getItem(CHAVE_STORAGE_FAVORITOS);
      return dados ? (JSON.parse(dados) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Salva projeto ativo no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE_PROJETO, projetoAtual.id);
    } catch {
      // Ignore
    }
  }, [projetoAtual.id]);

  // Salva favoritos no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE_FAVORITOS, JSON.stringify(favoritosIds));
    } catch {
      // Ignore
    }
  }, [favoritosIds]);

  // Seleciona um arquivo para exibição
  const selecionarArquivo = useCallback((arquivo: ArquivoCodeLab, linha?: number) => {
    setAbasAbertas((prev) => {
      const jaExiste = prev.some((a) => a.id === arquivo.id);
      if (jaExiste) return prev;
      return [...prev, arquivo];
    });
    setArquivoAtivo(arquivo);
    setLinhaDestaque(linha);
  }, []);

  // Fecha uma aba
  const fecharAba = useCallback(
    (arquivoId: string) => {
      setAbasAbertas((prev) => {
        const filtradas = prev.filter((a) => a.id !== arquivoId);
        // Se a aba fechada era a ativa, troca para a última disponível
        if (arquivoAtivo?.id === arquivoId) {
          const proxima = filtradas[filtradas.length - 1] ?? null;
          setArquivoAtivo(proxima);
        }
        return filtradas;
      });
    },
    [arquivoAtivo?.id],
  );

  // Troca de projeto ativo
  const selecionarProjeto = useCallback(
    (novoProjeto: ProjetoCodeLab) => {
      if (novoProjeto.id === projetoAtual.id) return;
      setProjetoAtual(novoProjeto);

      // Abre o arquivo padrão do novo projeto
      const novoArquivoPadrao =
        buscarArquivoNoProjeto(novoProjeto, novoProjeto.arquivoPadrao) ?? obterTodosArquivos(novoProjeto)[0] ?? null;

      if (novoArquivoPadrao) {
        setAbasAbertas([novoArquivoPadrao]);
        setArquivoAtivo(novoArquivoPadrao);
      } else {
        setAbasAbertas([]);
        setArquivoAtivo(null);
      }
      setLinhaDestaque(undefined);
    },
    [projetoAtual.id],
  );

  // Alterna atividade da barra lateral
  const alternarSecaoActivityBar = useCallback(
    (secao: SecaoActivityBar) => {
      if (secaoSidebar === secao && sidebarAberta) {
        setSidebarAberta(false);
      } else {
        setSecaoSidebar(secao);
        setSidebarAberta(true);
      }
    },
    [secaoSidebar, sidebarAberta],
  );

  // Alterna favorito do arquivo ativo
  const alternarFavoritoAtivo = useCallback(() => {
    if (!arquivoAtivo) return;
    setFavoritosIds((prev) => {
      if (prev.includes(arquivoAtivo.id)) {
        return prev.filter((id) => id !== arquivoAtivo.id);
      }
      return [...prev, arquivoAtivo.id];
    });
  }, [arquivoAtivo]);

  // Remove dos favoritos pelo id
  const removerFavorito = useCallback((arquivoId: string) => {
    setFavoritosIds((prev) => prev.filter((id) => id !== arquivoId));
  }, []);

  // Navega para arquivo relacionado a partir do painel de relacionamentos
  const navegarArquivoRelacionado = useCallback(
    (caminhoOuId: string) => {
      const arq = buscarArquivoNoProjeto(projetoAtual, caminhoOuId);
      if (arq) {
        selecionarArquivo(arq);
      }
    },
    [projetoAtual, selecionarArquivo],
  );

  // Mapeia objetos dos arquivos favoritos atuais
  const todosArquivosProjetos = listarProjetos().flatMap(obterTodosArquivos);
  const arquivosFavoritos = favoritosIds
    .map((id) => todosArquivosProjetos.find((a) => a.id === id))
    .filter((a): a is ArquivoCodeLab => a !== undefined);

  const eFavorito = arquivoAtivo ? favoritosIds.includes(arquivoAtivo.id) : false;

  return (
    <div className="codelab-app-container">
      {/* Barra de atividades vertical na extrema esquerda */}
      <CodeLabActivityBar
        secaoAtiva={sidebarAberta ? secaoSidebar : null}
        onSelecionarSecao={alternarSecaoActivityBar}
        quantidadeFavoritos={favoritosIds.length}
      />

      {/* Painel lateral (Explorer, Pesquisa, Projetos, Favoritos) */}
      {sidebarAberta && secaoSidebar && (
        <CodeLabSidebar
          secaoAtiva={secaoSidebar}
          projetoAtual={projetoAtual}
          arquivoAtivoId={arquivoAtivo?.id ?? ''}
          favoritos={arquivosFavoritos}
          onSelecionarProjeto={selecionarProjeto}
          onSelecionarArquivo={selecionarArquivo}
          onRemoverFavorito={removerFavorito}
          onFecharSidebar={() => setSidebarAberta(false)}
        />
      )}

      {/* Área central principal: Abas, Editor de Código e Painel Inferior */}
      <main className="codelab-main-area">
        <CodeLabEditorHeader
          projeto={projetoAtual}
          abasAbertas={abasAbertas}
          arquivoAtivo={arquivoAtivo}
          eFavorito={eFavorito}
          painelInferiorAberto={painelInferiorAberto}
          sidebarAberta={sidebarAberta}
          onSelecionarAba={setArquivoAtivo}
          onFecharAba={fecharAba}
          onAlternarFavorito={alternarFavoritoAtivo}
          onAlternarPainelInferior={() => setPainelInferiorAberto(!painelInferiorAberto)}
          onAlternarSidebar={() => setSidebarAberta(!sidebarAberta)}
        />

        {/* Editor de código */}
        <div className="codelab-editor-wrapper">
          {arquivoAtivo ? (
            <EditorCodeLab
              codigo={arquivoAtivo.conteudo}
              linguagem={arquivoAtivo.linguagem}
              linhaDestaque={linhaDestaque}
            />
          ) : (
            <div className="codelab-editor-empty">
              <p>Nenhum arquivo aberto.</p>
              <small>Selecione um arquivo no Explorer lateral ou abra pelo catálogo de projetos.</small>
            </div>
          )}
        </div>

        {/* Painel inferior expansível de documentação técnica */}
        {painelInferiorAberto && arquivoAtivo && (
          <CodeLabBottomPanel
            arquivo={arquivoAtivo}
            abaAtiva={abaPainelInferior}
            onSelecionarAba={setAbaPainelInferior}
            onNavegarArquivoRelacionado={navegarArquivoRelacionado}
            onFecharPainel={() => setPainelInferiorAberto(false)}
          />
        )}

        {/* Barra de status inferior estilo VS Code */}
        <CodeLabStatusBar projeto={projetoAtual} arquivoAtivo={arquivoAtivo} />
      </main>
    </div>
  );
}
