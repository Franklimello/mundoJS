'use client';

import { useState } from 'react';
import {
  VscChevronDown,
  VscChevronUp,
  VscClose,
  VscLinkExternal,
  VscArrowRight,
  VscInfo,
  VscWarning,
  VscPass,
  VscCode,
} from 'react-icons/vsc';
import { ArquivoCodeLab } from '@/codelab/tipos';

export type AbaPainelTecnico = 'explicacao' | 'exemplos' | 'relacionamentos' | 'referencias';

interface CodeLabBottomPanelProps {
  arquivo: ArquivoCodeLab;
  abaAtiva: AbaPainelTecnico;
  onSelecionarAba: (aba: AbaPainelTecnico) => void;
  onNavegarArquivoRelacionado: (caminho: string) => void;
  onFecharPainel: () => void;
}

export function CodeLabBottomPanel({
  arquivo,
  abaAtiva,
  onSelecionarAba,
  onNavegarArquivoRelacionado,
  onFecharPainel,
}: CodeLabBottomPanelProps) {
  const [expandido, setExpandido] = useState(false);
  const doc = arquivo.documentacao;

  const totalMetodos = doc.metodos?.length ?? 0;
  const totalExemplos = doc.exemplos?.length ?? 0;
  const totalRelacionados =
    (doc.relacionamentos?.importaDe?.length ?? 0) + (doc.relacionamentos?.usadoPor?.length ?? 0);
  const totalReferencias = doc.referencias?.length ?? 0;

  return (
    <div
      className={`codelab-bottom-panel ${expandido ? 'painel-max' : 'painel-normal'}`}
      aria-label="Painel de Documentação Técnica"
    >
      {/* Barra de abas do painel inferior */}
      <div className="codelab-panel-tabs-bar">
        <div className="codelab-panel-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'explicacao'}
            className={`codelab-panel-tab-btn ${abaAtiva === 'explicacao' ? 'ativo' : ''}`}
            onClick={() => onSelecionarAba('explicacao')}
          >
            Explicação
            {totalMetodos > 0 && <span className="codelab-panel-tab-badge">{totalMetodos} fns</span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'exemplos'}
            className={`codelab-panel-tab-btn ${abaAtiva === 'exemplos' ? 'ativo' : ''}`}
            onClick={() => onSelecionarAba('exemplos')}
          >
            Exemplos
            {totalExemplos > 0 && <span className="codelab-panel-tab-badge">{totalExemplos}</span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'relacionamentos'}
            className={`codelab-panel-tab-btn ${abaAtiva === 'relacionamentos' ? 'ativo' : ''}`}
            onClick={() => onSelecionarAba('relacionamentos')}
          >
            Relacionamentos
            {totalRelacionados > 0 && <span className="codelab-panel-tab-badge">{totalRelacionados}</span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'referencias'}
            className={`codelab-panel-tab-btn ${abaAtiva === 'referencias' ? 'ativo' : ''}`}
            onClick={() => onSelecionarAba('referencias')}
          >
            Referências
            {totalReferencias > 0 && <span className="codelab-panel-tab-badge">{totalReferencias}</span>}
          </button>
        </div>

        <div className="codelab-panel-controls">
          <button
            type="button"
            className="codelab-panel-control-btn"
            title={expandido ? 'Restaurar tamanho' : 'Maximizar painel'}
            aria-label={expandido ? 'Restaurar tamanho' : 'Maximizar painel'}
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <VscChevronDown /> : <VscChevronUp />}
          </button>
          <button
            type="button"
            className="codelab-panel-control-btn"
            title="Fechar documentação"
            aria-label="Fechar painel de documentação"
            onClick={onFecharPainel}
          >
            <VscClose />
          </button>
        </div>
      </div>

      {/* Conteúdo da aba selecionada */}
      <div className="codelab-panel-body">
        {/* ================= ABA 1: EXPLICAÇÃO ================= */}
        {abaAtiva === 'explicacao' && (
          <div className="codelab-panel-content-tab">
            <div className="codelab-doc-card">
              <div className="codelab-doc-badge-summary">
                <VscInfo className="codelab-doc-info-icon" />
                <span className="codelab-doc-summary-text">{doc.resumo}</span>
              </div>

              <div className="codelab-doc-section">
                <h4 className="codelab-doc-heading">Responsabilidade na Arquitetura</h4>
                <p className="codelab-doc-text">{doc.responsabilidade}</p>
              </div>

              {doc.comoFunciona && (
                <div className="codelab-doc-section">
                  <h4 className="codelab-doc-heading">Como Funciona o Código</h4>
                  <p className="codelab-doc-text">{doc.comoFunciona}</p>
                </div>
              )}

              {doc.porQueEssaAbordagem && (
                <div className="codelab-doc-section">
                  <h4 className="codelab-doc-heading">Por Que Essa Abordagem?</h4>
                  <p className="codelab-doc-text">{doc.porQueEssaAbordagem}</p>
                </div>
              )}

              {/* Lista detalhada de métodos documentados */}
              {doc.metodos && doc.metodos.length > 0 && (
                <div className="codelab-doc-section">
                  <h4 className="codelab-doc-heading">Funções e Métodos Exportados ({doc.metodos.length})</h4>
                  <div className="codelab-methods-list">
                    {doc.metodos.map((metodo, idx) => (
                      <div key={`${metodo.nome}-${idx}`} className="codelab-method-card">
                        <div className="codelab-method-signature">
                          <code>{metodo.assinatura}</code>
                        </div>
                        <p className="codelab-method-desc">{metodo.descricao}</p>

                        {metodo.parametros && metodo.parametros.length > 0 && (
                          <div className="codelab-method-params">
                            <span className="codelab-param-title">Parâmetros:</span>
                            <ul>
                              {metodo.parametros.map((param) => (
                                <li key={param.nome}>
                                  <strong>{param.nome}</strong> (<code>{param.tipo}</code>)
                                  {param.obrigatorio === false ? ' [opcional]' : ''}: {param.descricao}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {metodo.retorno && (
                          <div className="codelab-method-return">
                            <span className="codelab-param-title">Retorno:</span> <code>{metodo.retorno}</code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boas práticas e Erros Comuns */}
              <div className="codelab-doc-grids">
                {doc.boasPraticas && doc.boasPraticas.length > 0 && (
                  <div className="codelab-guideline-box boas-praticas">
                    <h5 className="codelab-guideline-title">
                      <VscPass className="codelab-guideline-icon icone-sucesso" />
                      Boas Práticas
                    </h5>
                    <ul>
                      {doc.boasPraticas.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {doc.errosComuns && doc.errosComuns.length > 0 && (
                  <div className="codelab-guideline-box erros-comuns">
                    <h5 className="codelab-guideline-title">
                      <VscWarning className="codelab-guideline-icon icone-aviso" />
                      Erros Comuns a Evitar
                    </h5>
                    <ul>
                      {doc.errosComuns.map((ec, i) => (
                        <li key={i}>{ec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: EXEMPLOS ================= */}
        {abaAtiva === 'exemplos' && (
          <div className="codelab-panel-content-tab">
            {!doc.exemplos || doc.exemplos.length === 0 ? (
              <p className="codelab-panel-empty-text">Nenhum exemplo prático adicional registrado para este arquivo.</p>
            ) : (
              <div className="codelab-examples-list">
                {doc.exemplos.map((ex, idx) => (
                  <div key={idx} className="codelab-example-card">
                    <div className="codelab-example-header">
                      <VscCode className="codelab-example-icon" />
                      <h4 className="codelab-example-title">{ex.titulo}</h4>
                    </div>
                    <p className="codelab-example-desc">{ex.descricao}</p>
                    <div className="codelab-example-code-block">
                      <pre>
                        <code>{ex.codigo}</code>
                      </pre>
                    </div>
                    {ex.saida && (
                      <div className="codelab-example-output">
                        <span className="codelab-output-label">Saída / Resposta esperada:</span>
                        <pre>
                          <code>{ex.saida}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ABA 3: RELACIONAMENTOS ================= */}
        {abaAtiva === 'relacionamentos' && (
          <div className="codelab-panel-content-tab">
            <div className="codelab-rel-container">
              {/* Origem e Destino do fluxo de dados */}
              {(doc.relacionamentos?.origemDosDados || doc.relacionamentos?.destinoDosDados) && (
                <div className="codelab-data-flow-box">
                  <h4 className="codelab-doc-heading">Fluxo dos Dados</h4>
                  {doc.relacionamentos.origemDosDados && (
                    <div className="codelab-flow-row">
                      <span className="codelab-flow-label">De onde vêm os dados:</span>
                      <span className="codelab-flow-val">{doc.relacionamentos.origemDosDados}</span>
                    </div>
                  )}
                  {doc.relacionamentos.destinoDosDados && (
                    <div className="codelab-flow-row">
                      <span className="codelab-flow-label">Para onde as informações vão:</span>
                      <span className="codelab-flow-val">{doc.relacionamentos.destinoDosDados}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Arquivos que este arquivo importa */}
              <div className="codelab-rel-group">
                <h4 className="codelab-doc-heading">Dependências Importadas (Consumidas)</h4>
                {!doc.relacionamentos?.importaDe || doc.relacionamentos.importaDe.length === 0 ? (
                  <p className="codelab-panel-empty-text">
                    Este arquivo não importa dependências internas de outros arquivos do projeto.
                  </p>
                ) : (
                  <div className="codelab-rel-links-list">
                    {doc.relacionamentos.importaDe.map((item, idx) => (
                      <div key={idx} className="codelab-rel-link-card">
                        <button
                          type="button"
                          className="codelab-rel-nav-btn"
                          onClick={() => onNavegarArquivoRelacionado(item.arquivo)}
                          title={`Abrir ${item.arquivo}`}
                        >
                          <span className="codelab-rel-file-name">{item.arquivo}</span>
                          <VscArrowRight className="codelab-rel-arrow" />
                        </button>
                        <span className="codelab-rel-reason">{item.motivo}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Arquivos que utilizam este arquivo */}
              <div className="codelab-rel-group">
                <h4 className="codelab-doc-heading">Arquivos Que Consomem Este Arquivo (Usado Por)</h4>
                {!doc.relacionamentos?.usadoPor || doc.relacionamentos.usadoPor.length === 0 ? (
                  <p className="codelab-panel-empty-text">
                    Nenhum consumidor direto listado para este componente na árvore.
                  </p>
                ) : (
                  <div className="codelab-rel-links-list">
                    {doc.relacionamentos.usadoPor.map((item, idx) => (
                      <div key={idx} className="codelab-rel-link-card">
                        <button
                          type="button"
                          className="codelab-rel-nav-btn"
                          onClick={() => onNavegarArquivoRelacionado(item.arquivo)}
                          title={`Abrir ${item.arquivo}`}
                        >
                          <span className="codelab-rel-file-name">{item.arquivo}</span>
                          <VscArrowRight className="codelab-rel-arrow" />
                        </button>
                        <span className="codelab-rel-reason">{item.motivo}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: REFERÊNCIAS ================= */}
        {abaAtiva === 'referencias' && (
          <div className="codelab-panel-content-tab">
            {!doc.referencias || doc.referencias.length === 0 ? (
              <p className="codelab-panel-empty-text">
                Nenhuma documentação externa associada especificamente a este arquivo.
              </p>
            ) : (
              <div className="codelab-refs-list">
                {doc.referencias.map((ref, idx) => (
                  <a key={idx} href={ref.url} target="_blank" rel="noopener noreferrer" className="codelab-ref-link">
                    <div className="codelab-ref-header">
                      <span className="codelab-ref-title">{ref.titulo}</span>
                      <VscLinkExternal className="codelab-ref-ext-icon" />
                    </div>
                    {ref.descricao && <span className="codelab-ref-desc">{ref.descricao}</span>}
                    <span className="codelab-ref-url">{ref.url}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
