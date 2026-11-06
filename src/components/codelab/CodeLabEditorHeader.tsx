'use client';

import { useState } from 'react';
import {
  VscClose,
  VscCopy,
  VscCheck,
  VscBookmark,
  VscChevronRight,
  VscLayoutPanel,
  VscLayoutSidebarLeft,
} from 'react-icons/vsc';
import { ArquivoCodeLab, ProjetoCodeLab } from '@/codelab/tipos';

interface CodeLabEditorHeaderProps {
  projeto: ProjetoCodeLab;
  abasAbertas: ArquivoCodeLab[];
  arquivoAtivo: ArquivoCodeLab | null;
  eFavorito: boolean;
  painelInferiorAberto: boolean;
  sidebarAberta: boolean;
  onSelecionarAba: (arquivo: ArquivoCodeLab) => void;
  onFecharAba: (arquivoId: string) => void;
  onAlternarFavorito: () => void;
  onAlternarPainelInferior: () => void;
  onAlternarSidebar: () => void;
}

export function CodeLabEditorHeader({
  projeto,
  abasAbertas,
  arquivoAtivo,
  eFavorito,
  painelInferiorAberto,
  sidebarAberta,
  onSelecionarAba,
  onFecharAba,
  onAlternarFavorito,
  onAlternarPainelInferior,
  onAlternarSidebar,
}: CodeLabEditorHeaderProps) {
  const [copiado, setCopiado] = useState(false);

  async function copiarCodigo() {
    if (!arquivoAtivo) return;
    try {
      await navigator.clipboard.writeText(arquivoAtivo.conteudo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback simples se clipboard API falhar
      const textarea = document.createElement('textarea');
      textarea.value = arquivoAtivo.conteudo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }

  // Segmenta o caminho para os breadcrumbs (ex: ['src', 'controllers', 'UsuarioController.js'])
  const partesCaminho = arquivoAtivo ? arquivoAtivo.caminho.split('/') : [];

  return (
    <div className="codelab-editor-header">
      {/* Barra de abas superiores */}
      <div className="codelab-tabs-bar" role="tablist">
        <div className="codelab-tabs-scroll">
          {abasAbertas.map((aba) => {
            const ativo = arquivoAtivo?.id === aba.id;
            return (
              <div
                key={aba.id}
                role="tab"
                aria-selected={ativo}
                className={`codelab-tab-item ${ativo ? 'ativo' : ''}`}
                onClick={() => onSelecionarAba(aba)}
              >
                <span className="codelab-tab-label">{aba.nome}</span>
                <button
                  type="button"
                  className="codelab-tab-close"
                  title={`Fechar ${aba.nome}`}
                  aria-label={`Fechar aba ${aba.nome}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFecharAba(aba.id);
                  }}
                >
                  <VscClose />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de breadcrumbs e ações rápidas */}
      {arquivoAtivo && (
        <div className="codelab-breadcrumbs-bar">
          <nav className="codelab-breadcrumbs" aria-label="Caminho do arquivo">
            <span className="codelab-breadcrumb-root">{projeto.slug}</span>
            {partesCaminho.map((parte, idx) => (
              <span key={`${parte}-${idx}`} className="codelab-breadcrumb-segment">
                <VscChevronRight className="codelab-breadcrumb-sep" aria-hidden="true" />
                <span
                  className={
                    idx === partesCaminho.length - 1 ? 'codelab-breadcrumb-current' : 'codelab-breadcrumb-item'
                  }
                >
                  {parte}
                </span>
              </span>
            ))}
          </nav>

          <div className="codelab-editor-actions">
            <button
              type="button"
              className="codelab-action-btn"
              onClick={copiarCodigo}
              title={copiado ? 'Código copiado!' : 'Copiar código completo'}
              aria-label="Copiar código completo"
            >
              {copiado ? (
                <>
                  <VscCheck className="codelab-action-icon icone-sucesso" />
                  <span className="codelab-action-texto">Copiado</span>
                </>
              ) : (
                <>
                  <VscCopy className="codelab-action-icon" />
                  <span className="codelab-action-texto">Copiar</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`codelab-action-btn ${eFavorito ? 'favorito-ativo' : ''}`}
              onClick={onAlternarFavorito}
              title={eFavorito ? 'Remover arquivo dos favoritos' : 'Salvar arquivo nos favoritos'}
              aria-label="Favoritar arquivo"
              aria-pressed={eFavorito}
            >
              <VscBookmark className="codelab-action-icon" />
              <span className="codelab-action-texto">{eFavorito ? 'Salvo' : 'Salvar'}</span>
            </button>

            <button
              type="button"
              className={`codelab-action-btn ${painelInferiorAberto ? 'painel-aberto' : ''}`}
              onClick={onAlternarPainelInferior}
              title={painelInferiorAberto ? 'Ocultar documentação técnica' : 'Exibir documentação técnica'}
              aria-label="Alternar painel de documentação técnica"
              aria-pressed={painelInferiorAberto}
            >
              <VscLayoutPanel className="codelab-action-icon" />
              <span className="codelab-action-texto">Doc</span>
            </button>

            <button
              type="button"
              className={`codelab-action-btn ${sidebarAberta ? 'painel-aberto' : ''}`}
              onClick={onAlternarSidebar}
              title={sidebarAberta ? 'Recolher lateral' : 'Expandir lateral'}
              aria-label="Alternar barra lateral"
            >
              <VscLayoutSidebarLeft className="codelab-action-icon" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
