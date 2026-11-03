import type { ResultadoExecucao } from '@/engine/tipos';

/** O que o código mostrou, e o erro que o interrompeu, se houve. */
export function Saida({ resultado }: { resultado: ResultadoExecucao | null }) {
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
          {erro.dica && <p className="erro-dica">{erro.dica}</p>}
        </div>
      )}
    </>
  );
}
