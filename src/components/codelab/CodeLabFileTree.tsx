'use client';

import { useState } from 'react';
import {
  VscChevronDown,
  VscChevronRight,
  VscFolder,
  VscFolderOpened,
  VscFileCode,
  VscJson,
  VscDatabase,
  VscFile,
} from 'react-icons/vsc';
import { ArquivoCodeLab, PastaCodeLab, ProjetoCodeLab } from '@/codelab/tipos';

interface CodeLabFileTreeProps {
  projeto: ProjetoCodeLab;
  arquivoAtivoId: string;
  onSelecionarArquivo: (arquivo: ArquivoCodeLab) => void;
}

function obterIconeArquivo(nome: string) {
  if (nome.endsWith('.json')) {
    return <VscJson className="codelab-tree-icon icone-json" />;
  }
  if (nome.endsWith('.prisma') || nome.endsWith('.sql')) {
    return <VscDatabase className="codelab-tree-icon icone-database" />;
  }
  if (nome.endsWith('.ts') || nome.endsWith('.tsx')) {
    return <span className="codelab-tree-badge-ext icone-ts">TS</span>;
  }
  if (nome.endsWith('.js') || nome.endsWith('.jsx')) {
    return <span className="codelab-tree-badge-ext icone-js">JS</span>;
  }
  if (nome.endsWith('.md')) {
    return <VscFile className="codelab-tree-icon icone-md" />;
  }
  return <VscFileCode className="codelab-tree-icon icone-generico" />;
}

interface ItemPastaProps {
  pasta: PastaCodeLab;
  nivel: number;
  pastasAbertas: Set<string>;
  onAlternarPasta: (caminho: string) => void;
  arquivoAtivoId: string;
  onSelecionarArquivo: (arquivo: ArquivoCodeLab) => void;
}

function ItemPasta({
  pasta,
  nivel,
  pastasAbertas,
  onAlternarPasta,
  arquivoAtivoId,
  onSelecionarArquivo,
}: ItemPastaProps) {
  const aberta = pastasAbertas.has(pasta.caminho);

  return (
    <div className="codelab-tree-node">
      <button
        type="button"
        className="codelab-tree-row codelab-tree-folder-btn"
        style={{ paddingLeft: `${nivel * 14 + 10}px` }}
        onClick={() => onAlternarPasta(pasta.caminho)}
        title={pasta.caminho}
      >
        <span className="codelab-tree-chevron" aria-hidden="true">
          {aberta ? <VscChevronDown /> : <VscChevronRight />}
        </span>
        <span className="codelab-tree-folder-icon" aria-hidden="true">
          {aberta ? <VscFolderOpened className="icone-pasta-aberta" /> : <VscFolder className="icone-pasta-fechada" />}
        </span>
        <span className="codelab-tree-name">{pasta.nome}</span>
      </button>

      {aberta && (
        <div className="codelab-tree-children">
          {pasta.pastas.map((sub) => (
            <ItemPasta
              key={sub.caminho}
              pasta={sub}
              nivel={nivel + 1}
              pastasAbertas={pastasAbertas}
              onAlternarPasta={onAlternarPasta}
              arquivoAtivoId={arquivoAtivoId}
              onSelecionarArquivo={onSelecionarArquivo}
            />
          ))}

          {pasta.arquivos.map((arq) => {
            const selecionado = arq.id === arquivoAtivoId;
            return (
              <button
                key={arq.id}
                type="button"
                className={`codelab-tree-row codelab-tree-file-btn ${selecionado ? 'ativo' : ''}`}
                style={{ paddingLeft: `${(nivel + 1) * 14 + 10}px` }}
                onClick={() => onSelecionarArquivo(arq)}
                title={arq.caminho}
              >
                <span className="codelab-tree-file-icon" aria-hidden="true">
                  {obterIconeArquivo(arq.nome)}
                </span>
                <span className="codelab-tree-name">{arq.nome}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CodeLabFileTree({ projeto, arquivoAtivoId, onSelecionarArquivo }: CodeLabFileTreeProps) {
  // Inicializa pastas abertas por padrão com todas as pastas do projeto
  const [pastasAbertas, setPastasAbertas] = useState<Set<string>>(() => {
    const abertas = new Set<string>();
    function coletarCaminhos(p: PastaCodeLab) {
      abertas.add(p.caminho);
      p.pastas.forEach(coletarCaminhos);
    }
    projeto.estrutura.pastas.forEach(coletarCaminhos);
    return abertas;
  });

  function alternarPasta(caminho: string) {
    setPastasAbertas((prev) => {
      const prox = new Set(prev);
      if (prox.has(caminho)) {
        prox.delete(caminho);
      } else {
        prox.add(caminho);
      }
      return prox;
    });
  }

  function expandirTodas() {
    const todas = new Set<string>();
    function coletar(p: PastaCodeLab) {
      todas.add(p.caminho);
      p.pastas.forEach(coletar);
    }
    projeto.estrutura.pastas.forEach(coletar);
    setPastasAbertas(todas);
  }

  function recolherTodas() {
    setPastasAbertas(new Set());
  }

  return (
    <div className="codelab-file-tree" role="tree">
      <div className="codelab-file-tree-actions">
        <span className="codelab-tree-root-label">{projeto.slug.toUpperCase()}</span>
        <div className="codelab-tree-quick-actions">
          <button
            type="button"
            className="codelab-tree-action-btn"
            title="Recolher todas as pastas"
            onClick={recolherTodas}
          >
            Recolher
          </button>
          <button
            type="button"
            className="codelab-tree-action-btn"
            title="Expandir todas as pastas"
            onClick={expandirTodas}
          >
            Expandir
          </button>
        </div>
      </div>

      <div className="codelab-file-tree-list">
        {/* Pastas de primeiro nível */}
        {projeto.estrutura.pastas.map((pasta) => (
          <ItemPasta
            key={pasta.caminho}
            pasta={pasta}
            nivel={0}
            pastasAbertas={pastasAbertas}
            onAlternarPasta={alternarPasta}
            arquivoAtivoId={arquivoAtivoId}
            onSelecionarArquivo={onSelecionarArquivo}
          />
        ))}

        {/* Arquivos na raiz do projeto (ex: package.json, app.js, server.js) */}
        {projeto.estrutura.arquivosRaiz.map((arq) => {
          const selecionado = arq.id === arquivoAtivoId;
          return (
            <button
              key={arq.id}
              type="button"
              className={`codelab-tree-row codelab-tree-file-btn ${selecionado ? 'ativo' : ''}`}
              style={{ paddingLeft: '10px' }}
              onClick={() => onSelecionarArquivo(arq)}
              title={arq.caminho}
            >
              <span className="codelab-tree-file-icon" aria-hidden="true">
                {obterIconeArquivo(arq.nome)}
              </span>
              <span className="codelab-tree-name">{arq.nome}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
