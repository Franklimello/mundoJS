'use client';

import { useState } from 'react';
import type { ResultadoExecucao } from '@/engine/tipos';
import { Saida } from './Saida';

export function PassoAPasso({
  resultado,
  codigo,
  aoIrParaLinha,
  aoRodar,
  bloqueado = false,
}: {
  resultado: ResultadoExecucao;
  codigo: string;
  aoIrParaLinha?: (linha: number) => void;
  aoRodar: () => void;
  bloqueado?: boolean;
}) {
  const [indice, setIndice] = useState(0);
  const registro = resultado.passoAPasso!;
  const passo = registro.passos[indice];
  const ultimo = indice === registro.passos.length - 1;
  return (
    <section className="passos" aria-label="Execução passo a passo">
      <h3>Passo a passo</h3>
      <p className="passos-nota">
        {registro.indisponivel
          ? 'Este modo acompanha um conjunto limitado de comandos.'
          : 'A execução foi registrada. Avance e volte para revisar os estados; os controles não executam o código novamente.'}
      </p>
      {registro.indisponivel ? (
        <div className="passos-indisponivel" role="status">
          <p>
            {registro.indisponivel.linha ? `Linha ${registro.indisponivel.linha}: ` : ''}
            {registro.indisponivel.mensagem}
          </p>
          <p>O código não foi executado neste modo.</p>
          <button type="button" className="botao" onClick={aoRodar} disabled={bloqueado}>
            Rodar normalmente
          </button>
        </div>
      ) : passo ? (
        <>
          <div className="passos-controles" role="group" aria-label="Navegar pelos passos">
            <button
              type="button"
              className="botao"
              disabled={indice === 0}
              onClick={() => setIndice((atual) => atual - 1)}
            >
              Anterior
            </button>
            <button
              type="button"
              className="botao botao-rodar"
              disabled={ultimo}
              onClick={() => setIndice((atual) => atual + 1)}
            >
              Próximo passo
            </button>
            <button type="button" className="botao botao-leve" disabled={indice === 0} onClick={() => setIndice(0)}>
              Reiniciar revisão
            </button>
          </div>
          <p className="passos-status" role="status" aria-atomic="true">
            Passo {indice + 1} de {registro.passos.length} · linha {passo.linha} · {passo.descricao}
          </p>
          {passo.lacos.map((laco, i) => (
            <p className="passos-volta" key={i}>
              Laço da linha {laco.linha} · voltas iniciadas: {laco.volta}
            </p>
          ))}
          <pre className="passos-codigo" tabIndex={0} aria-label={`Trecho da linha ${passo.linha}`}>
            <code>{codigo.split(/\r?\n/)[passo.linha - 1]?.slice(0, 240) || '(linha vazia)'}</code>
          </pre>
          {aoIrParaLinha && (
            <button type="button" className="botao botao-leve" onClick={() => aoIrParaLinha(passo.linha)}>
              Ver linha {passo.linha} no editor
            </button>
          )}
          <h4>Variáveis visíveis neste passo</h4>
          {passo.variaveis.length > 0 ? (
            <table className="passos-variaveis">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Valor resumido</th>
                </tr>
              </thead>
              <tbody>
                {passo.variaveis.map((v) => (
                  <tr key={v.nome} data-estado={v.estado}>
                    <th scope="row">
                      <code>{v.nome}</code>
                    </th>
                    <td>
                      <code>{v.valor}</code>
                      {v.estado !== 'igual' && <small>{v.estado === 'nova' ? 'Visível agora' : 'Valor mudou'}</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma variável deste trecho está visível aqui.</p>
          )}
          <h4>Console até este passo</h4>
          {passo.linhasSaida > 0 ? (
            <pre className="saida-linhas" tabIndex={0} aria-label="Console até este passo">
              {resultado.saida.slice(0, passo.linhasSaida).map((linha, i) => (
                <span key={i} className={`saida-linha saida-${linha.tipo}`}>
                  {linha.texto}
                  {'\n'}
                </span>
              ))}
            </pre>
          ) : (
            <p>Ainda não há saída.</p>
          )}
          {!ultimo && <p className="passos-pergunta">Antes de avançar: o que você espera que mude?</p>}
          {registro.limiteAtingido && (
            <p className="passos-alerta">
              A execução foi interrompida ao atingir 160 estados. O programa pode não ter terminado. Use Rodar para a
              execução normal.
            </p>
          )}
        </>
      ) : (
        <p>Não foi possível registrar os estados deste código.</p>
      )}
      {resultado.erro && (!passo || ultimo) && (
        <Saida resultado={{ ...resultado, saida: [] }} aoIrParaLinha={aoIrParaLinha} />
      )}
      <details className="passos-ajuda">
        <summary>O que este modo acompanha?</summary>
        <p>
          let/const, cálculos, textos, arrays, objetos simples, if/else, for, for...of, while, break/continue e
          console.log. Funções, métodos, alterações de propriedades, DOM e código assíncrono ainda usam Rodar/Conferir.
          Em for, a atualização do contador aparece na próxima verificação da condição.
        </p>
        <p>
          Até 160 estados, 16 nomes de variáveis e valores resumidos. O registro fica nesta página e não conclui
          exercícios.
        </p>
      </details>
    </section>
  );
}
