'use client';

import { useId, useState } from 'react';
import {
  VscClose,
  VscChevronLeft,
  VscSearch,
  VscRepo,
  VscBookmark,
  VscFolder,
  VscTrash,
  VscArrowRight,
} from 'react-icons/vsc';
import { ArquivoCodeLab, ProjetoCodeLab, ResultadoBusca } from '@/codelab/tipos';
import { listarProjetos, pesquisarNoProjeto, pesquisarEmTodosProjetos } from '@/codelab';
import { CodeLabFileTree } from './CodeLabFileTree';
import { SecaoActivityBar } from './CodeLabActivityBar';

interface CodeLabSidebarProps {
  secaoAtiva: SecaoActivityBar;
  projetoAtual: ProjetoCodeLab;
  arquivoAtivoId: string;
  favoritos: ArquivoCodeLab[];
  onSelecionarProjeto: (projeto: ProjetoCodeLab) => void;
  onSelecionarArquivo: (arquivo: ArquivoCodeLab, linha?: number) => void;
  onRemoverFavorito: (arquivoId: string) => void;
  onFecharSidebar: () => void;
}

export function CodeLabSidebar({
  secaoAtiva,
  projetoAtual,
  arquivoAtivoId,
  favoritos,
  onSelecionarProjeto,
  onSelecionarArquivo,
  onRemoverFavorito,
  onFecharSidebar,
}: CodeLabSidebarProps) {
  const [termoBusca, setTermoBusca] = useState('');
  const [escopoGlobal, setEscopoGlobal] = useState(false);
  const campoBuscaId = useId();

  const projetos = listarProjetos();

  // Executa busca dinamicamente
  const resultadosProjeto = !escopoGlobal && termoBusca.trim() ? pesquisarNoProjeto(projetoAtual, termoBusca) : [];

  const resultadosGlobais = escopoGlobal && termoBusca.trim() ? pesquisarEmTodosProjetos(termoBusca) : [];

  const totalResultados = escopoGlobal
    ? resultadosGlobais.reduce((acc, curr) => acc + curr.resultados.length, 0)
    : resultadosProjeto.length;

  return (
    <div className="codelab-sidebar" aria-label="Painel Lateral">
      <div className="codelab-sidebar-header">
        <h2 className="codelab-sidebar-title">
          {secaoAtiva === 'explorer' && 'EXPLORER'}
          {secaoAtiva === 'search' && 'PESQUISA'}
          {secaoAtiva === 'projetos' && 'PROJETOS'}
          {secaoAtiva === 'favoritos' && 'FAVORITOS'}
        </h2>
        <button
          type="button"
          className="codelab-sidebar-btn-fechar"
          title="Recolher painel lateral"
          aria-label="Recolher painel lateral"
          onClick={onFecharSidebar}
        >
          <VscChevronLeft />
        </button>
      </div>

      <div className="codelab-sidebar-content">
        {/* ================= VISTA: EXPLORER ================= */}
        {secaoAtiva === 'explorer' && (
          <div className="codelab-sidebar-view codelab-view-explorer">
            <div className="codelab-sidebar-section-title">
              <span className="codelab-project-name">{projetoAtual.nome}</span>
            </div>
            <CodeLabFileTree
              projeto={projetoAtual}
              arquivoAtivoId={arquivoAtivoId}
              onSelecionarArquivo={onSelecionarArquivo}
            />
          </div>
        )}

        {/* ================= VISTA: SEARCH ================= */}
        {secaoAtiva === 'search' && (
          <div className="codelab-sidebar-view codelab-view-search">
            <div className="codelab-search-box">
              <div className="codelab-search-input-wrapper">
                <VscSearch className="codelab-search-icon" aria-hidden="true" />
                <label htmlFor={campoBuscaId} className="sr-only">
                  Pesquisar arquivos, métodos ou código
                </label>
                <input
                  id={campoBuscaId}
                  type="text"
                  className="codelab-search-input"
                  placeholder="Pesquisar (arquivo, método, código)..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  autoFocus
                />
                {termoBusca && (
                  <button
                    type="button"
                    className="codelab-search-clear"
                    onClick={() => setTermoBusca('')}
                    title="Limpar busca"
                    aria-label="Limpar busca"
                  >
                    <VscClose />
                  </button>
                )}
              </div>

              <div className="codelab-search-scope-toggle">
                <label className="codelab-checkbox-label">
                  <input type="checkbox" checked={escopoGlobal} onChange={(e) => setEscopoGlobal(e.target.checked)} />
                  <span>Buscar em todos os projetos</span>
                </label>
              </div>
            </div>

            {termoBusca.trim() && (
              <div className="codelab-search-summary">
                {totalResultados === 0 ? (
                  <span>Nenhum resultado encontrado</span>
                ) : (
                  <span>
                    {totalResultados} {totalResultados === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </span>
                )}
              </div>
            )}

            <div className="codelab-search-results">
              {/* Resultados no projeto atual */}
              {!escopoGlobal &&
                resultadosProjeto.map((res: ResultadoBusca, idx: number) => (
                  <button
                    key={`${res.arquivo.id}-${idx}`}
                    type="button"
                    className="codelab-search-result-item"
                    onClick={() => onSelecionarArquivo(res.arquivo, res.linha)}
                  >
                    <div className="codelab-search-item-header">
                      <span className="codelab-search-item-file">{res.arquivo.nome}</span>
                      <span className="codelab-search-item-badge">{res.tipo}</span>
                    </div>
                    <span className="codelab-search-item-path">{res.arquivo.caminho}</span>
                    {res.trecho && (
                      <span className="codelab-search-item-snippet">
                        {res.linha ? `L${res.linha}: ` : ''}
                        {res.trecho}
                      </span>
                    )}
                  </button>
                ))}

              {/* Resultados em todos os projetos */}
              {escopoGlobal &&
                resultadosGlobais.map((item) => (
                  <div key={item.projeto.id} className="codelab-search-group">
                    <div className="codelab-search-group-header">
                      <VscRepo aria-hidden="true" />
                      <span>{item.projeto.nome}</span>
                      <span className="codelab-group-count">({item.resultados.length})</span>
                    </div>
                    {item.resultados.map((res: ResultadoBusca, idx: number) => (
                      <button
                        key={`${res.arquivo.id}-${idx}`}
                        type="button"
                        className="codelab-search-result-item"
                        onClick={() => {
                          onSelecionarProjeto(item.projeto);
                          onSelecionarArquivo(res.arquivo, res.linha);
                        }}
                      >
                        <div className="codelab-search-item-header">
                          <span className="codelab-search-item-file">{res.arquivo.nome}</span>
                          <span className="codelab-search-item-badge">{res.tipo}</span>
                        </div>
                        <span className="codelab-search-item-path">{res.arquivo.caminho}</span>
                        {res.trecho && (
                          <span className="codelab-search-item-snippet">
                            {res.linha ? `L${res.linha}: ` : ''}
                            {res.trecho}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= VISTA: PROJETOS ================= */}
        {secaoAtiva === 'projetos' && (
          <div className="codelab-sidebar-view codelab-view-projects">
            <p className="codelab-projects-desc">
              Selecione uma arquitetura de referência para explorar toda a árvore de arquivos e sua documentação
              técnica:
            </p>
            <div className="codelab-projects-list">
              {projetos.map((proj) => {
                const ativo = proj.id === projetoAtual.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    className={`codelab-project-card ${ativo ? 'ativo' : ''}`}
                    onClick={() => onSelecionarProjeto(proj)}
                  >
                    <div className="codelab-project-card-header">
                      <VscRepo className="codelab-project-card-icon" />
                      <span className="codelab-project-card-name">{proj.nome}</span>
                      {ativo && <span className="codelab-project-card-current">Ativo</span>}
                    </div>
                    <p className="codelab-project-card-desc">{proj.descricao}</p>
                    <div className="codelab-project-card-tags">
                      {proj.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="codelab-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= VISTA: FAVORITOS ================= */}
        {secaoAtiva === 'favoritos' && (
          <div className="codelab-sidebar-view codelab-view-favorites">
            {favoritos.length === 0 ? (
              <div className="codelab-empty-state">
                <VscBookmark className="codelab-empty-icon" />
                <p>Nenhum arquivo favoritado ainda.</p>
                <small>
                  Clique no ícone de marcador na barra superior do editor para salvar arquivos de referência rápida.
                </small>
              </div>
            ) : (
              <div className="codelab-favorites-list">
                {favoritos.map((fav) => (
                  <div key={fav.id} className="codelab-favorite-row">
                    <button
                      type="button"
                      className="codelab-favorite-link"
                      onClick={() => onSelecionarArquivo(fav)}
                      title={fav.caminho}
                    >
                      <VscFolder className="codelab-fav-icon" />
                      <div className="codelab-fav-text">
                        <span className="codelab-fav-name">{fav.nome}</span>
                        <span className="codelab-fav-path">{fav.caminho}</span>
                      </div>
                      <VscArrowRight className="codelab-fav-arrow" />
                    </button>
                    <button
                      type="button"
                      className="codelab-fav-remove-btn"
                      onClick={() => onRemoverFavorito(fav.id)}
                      title="Remover dos favoritos"
                      aria-label={`Remover ${fav.nome} dos favoritos`}
                    >
                      <VscTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
