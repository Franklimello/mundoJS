'use client';

import { VscSourceControl, VscCheck } from 'react-icons/vsc';
import { ArquivoCodeLab, ProjetoCodeLab } from '@/codelab/tipos';

interface CodeLabStatusBarProps {
  projeto: ProjetoCodeLab;
  arquivoAtivo: ArquivoCodeLab | null;
}

export function CodeLabStatusBar({ projeto, arquivoAtivo }: CodeLabStatusBarProps) {
  const totalLinhas = arquivoAtivo ? arquivoAtivo.conteudo.split('\n').length : 0;
  const tamanhoBytes = arquivoAtivo ? new Blob([arquivoAtivo.conteudo]).size : 0;

  function formatarLinguagem(ling?: string) {
    if (!ling) return 'Plain Text';
    switch (ling) {
      case 'typescript':
        return 'TypeScript';
      case 'javascript':
        return 'JavaScript';
      case 'json':
        return 'JSON';
      case 'prisma':
        return 'Prisma';
      case 'sql':
        return 'SQL';
      case 'markdown':
        return 'Markdown';
      default:
        return ling;
    }
  }

  return (
    <footer className="codelab-status-bar" aria-label="Barra de status do CodeLab">
      <div className="codelab-status-left">
        <div className="codelab-status-item codelab-status-branch" title="Branch do repositório">
          <VscSourceControl className="codelab-status-icon" aria-hidden="true" />
          <span>main</span>
        </div>
        <div className="codelab-status-item" title={`Projeto: ${projeto.nome}`}>
          <VscCheck className="codelab-status-icon" aria-hidden="true" />
          <span>{projeto.nome}</span>
        </div>
      </div>

      <div className="codelab-status-right">
        {arquivoAtivo && (
          <>
            <div className="codelab-status-item" title="Contagem de linhas">
              <span>
                {totalLinhas} {totalLinhas === 1 ? 'linha' : 'linhas'}
              </span>
            </div>
            <div className="codelab-status-item" title="Tamanho do arquivo">
              <span>{(tamanhoBytes / 1024).toFixed(1)} KB</span>
            </div>
            <div className="codelab-status-item" title="Indentação">
              <span>Espaços: 2</span>
            </div>
            <div className="codelab-status-item" title="Codificação de caracteres">
              <span>UTF-8</span>
            </div>
            <div className="codelab-status-item" title="Finalizador de linha">
              <span>LF</span>
            </div>
            <div className="codelab-status-item codelab-status-lang" title="Linguagem detectada">
              <span>{formatarLinguagem(arquivoAtivo.linguagem)}</span>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
