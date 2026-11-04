import type { ResultadoExecucao } from '@/engine/tipos';

/** O que o código mostrou, e o erro que o interrompeu, se houve. */
export function Saida({
  resultado,
  aoIrParaLinha,
}: {
  resultado: ResultadoExecucao | null;
  aoIrParaLinha?: (linha: number) => void;
}) {
  if (!resultado) {
    return (
      <p className="saida-vazia">
        Aperte <strong>Rodar</strong> para ver o resultado aqui.
      </p>
    );
  }
  const { saida, erro } = resultado;
  return (
    <>
      {saida.length > 0 ? (
        <pre className="saida-linhas" tabIndex={0} aria-label="Texto mostrado pelo código">
          {saida.map((linha, indice) => (
            <span key={indice} className={`saida-linha saida-${linha.tipo}`}>
              {linha.texto}
              {'\n'}
            </span>
          ))}
        </pre>
      ) : (
        !erro && (
          <p className="saida-vazia">
            O código rodou, mas não mostrou nada. Use <code>console.log</code> para ver valores aqui.
          </p>
        )
      )}
      {erro && (
        <div className="erro" role="alert">
          <p className="erro-titulo">{erro.linha ? `Deu erro na linha ${erro.linha}` : 'Deu erro'}</p>
          <p>{erro.mensagem}</p>
          {erro.dica && (
            <p className="erro-dica">
              <strong>Tente isto:</strong> {erro.dica}
            </p>
          )}
          {erro.exemplo && (
            <details className="erro-exemplo">
              <summary>Ver um exemplo</summary>
              <p>{erro.exemplo.explicacao}</p>
              <pre tabIndex={0} aria-label="Exemplo para entender o erro">
                <code>{erro.exemplo.codigo}</code>
              </pre>
              <p className="erro-exemplo-nota">Este exemplo explica a ideia. Adapte ao seu código e rode de novo.</p>
            </details>
          )}
          {erro.linha && aoIrParaLinha && (
            <button type="button" className="botao" onClick={() => aoIrParaLinha(erro.linha!)}>
              Ir para a linha {erro.linha}
            </button>
          )}
        </div>
      )}
    </>
  );
}
