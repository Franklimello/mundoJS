'use client';

import { useState } from 'react';
import { FiPlay, FiX } from 'react-icons/fi';
import { Folha } from './Folha';
import { Texto } from './Texto';
import { chaveDoTreino } from '@/documentacao';
import type { MetodoDoc } from '@/documentacao/tipos';

interface TreinoMetodoProps {
  topico: string;
  metodo: MetodoDoc;
}

/**
 * Área de treino interativa para um método da documentação. Abre um editor com
 * a folha de caderno, testes automáticos e dicas para o aluno praticar na hora.
 */
export function TreinoMetodo({ topico, metodo }: TreinoMetodoProps) {
  const [aberto, setAberto] = useState(false);
  const { treino } = metodo;

  if (!aberto) {
    return (
      <div className="doc-treino-acoes">
        <button
          type="button"
          className="botao botao-leve doc-treino-gatilho"
          onClick={() => setAberto(true)}
          aria-expanded={false}
        >
          <FiPlay size={16} aria-hidden="true" focusable="false" />
          Treine esse método
        </button>
      </div>
    );
  }

  return (
    <section className="doc-treino" aria-label={`Treino prático de ${metodo.nome}`}>
      <div className="doc-treino-cabecalho">
        <div className="doc-treino-titulo-grupo">
          <span className="doc-treino-selo">Treino prático</span>
          <h4 className="doc-treino-titulo">
            Praticar: <code>{metodo.nome}</code>
          </h4>
        </div>
        <button
          type="button"
          className="botao botao-leve doc-treino-fechar"
          onClick={() => setAberto(false)}
          aria-expanded={true}
        >
          <FiX size={16} aria-hidden="true" focusable="false" />
          Fechar treino
        </button>
      </div>

      <div className="doc-treino-enunciado">
        {treino.enunciado.map((paragrafo, i) => (
          <p key={i}>
            <Texto>{paragrafo}</Texto>
          </p>
        ))}
      </div>

      {treino.dicas.length > 0 && (
        <details className="doc-treino-dicas">
          <summary>Precisa de ajuda? Dicas</summary>
          <ul>
            {treino.dicas.map((dica, i) => (
              <li key={i}>
                <Texto>{dica}</Texto>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="doc-treino-folha">
        <Folha
          titulo={`Treino · ${metodo.nome}`}
          rotuloDoEditor={`Editor de código para treinar ${metodo.nome}`}
          codigoInicial={treino.codigoInicial}
          testes={treino.testes}
          solucao={treino.solucao}
          chaveRascunho={chaveDoTreino(topico, metodo.id)}
          pautasMinimas={7}
          aoAcertar={
            <div className="depois">
              <p>
                Muito bem! Você completou o treino de <code>{metodo.nome}</code>.
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
}
