'use client';

import { VscFiles, VscSearch, VscRepo, VscBookmark } from 'react-icons/vsc';

export type SecaoActivityBar = 'explorer' | 'search' | 'projetos' | 'favoritos';

interface CodeLabActivityBarProps {
  secaoAtiva: SecaoActivityBar | null;
  onSelecionarSecao: (secao: SecaoActivityBar) => void;
  quantidadeFavoritos: number;
}

export function CodeLabActivityBar({ secaoAtiva, onSelecionarSecao, quantidadeFavoritos }: CodeLabActivityBarProps) {
  const ITENS = [
    {
      id: 'explorer' as const,
      titulo: 'Explorer (Ctrl+Shift+E)',
      icone: VscFiles,
      badge: 0,
    },
    {
      id: 'search' as const,
      titulo: 'Pesquisa global (Ctrl+Shift+F)',
      icone: VscSearch,
      badge: 0,
    },
    {
      id: 'projetos' as const,
      titulo: 'Catálogo de Arquiteturas',
      icone: VscRepo,
      badge: 0,
    },
    {
      id: 'favoritos' as const,
      titulo: 'Arquivos Salvos / Favoritos',
      icone: VscBookmark,
      badge: quantidadeFavoritos,
    },
  ];

  return (
    <aside className="codelab-activity-bar" aria-label="Barra de Atividades do CodeLab">
      <div className="codelab-activity-bar-top">
        {ITENS.map((item) => {
          const ativo = secaoAtiva === item.id;
          const Icone = item.icone;
          return (
            <button
              key={item.id}
              type="button"
              className={`codelab-activity-btn ${ativo ? 'ativo' : ''}`}
              title={item.titulo}
              aria-label={item.titulo}
              aria-pressed={ativo}
              onClick={() => onSelecionarSecao(item.id)}
            >
              <Icone className="codelab-activity-icon" />
              {item.badge > 0 && <span className="codelab-activity-badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
