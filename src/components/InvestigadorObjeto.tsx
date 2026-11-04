import type { InvestigacaoPropriedade } from '@/engine/tipos';

export function InvestigadorObjeto({
  acesso,
  aoIrParaLinha,
}: {
  acesso: InvestigacaoPropriedade;
  aoIrParaLinha?: (linha: number) => void;
}) {
  return (
    <details className="investigador-acesso investigador-objeto">
      <summary>Por que apareceu undefined? · linha {acesso.linha}</summary>
      <div className="investigador-conteudo">
        <p>
          <code>{acesso.acesso}</code> devolveu <code>undefined</code> neste acesso.
        </p>
        <p>
          A propriedade <code>{JSON.stringify(acesso.propriedade)}</code> não foi encontrada em{' '}
          <code>{acesso.objeto}</code>.
        </p>
        {acesso.propriedades.length > 0 ? (
          <table>
            <caption>Propriedades no momento do acesso{acesso.haMais ? ' · primeiras 8' : ''}</caption>
            <thead>
              <tr>
                <th scope="col">Propriedade</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {acesso.propriedades.map((item, indice) => (
                <tr key={indice}>
                  <th scope="row">
                    <code>{item.nome}</code>
                  </th>
                  <td>
                    <code>{item.valor}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Não havia propriedades definidas diretamente neste objeto para mostrar.</p>
        )}
        <p className="investigador-pergunta">
          <strong>Agora pense:</strong>{' '}
          {acesso.propriedades.length > 0
            ? 'qual nome da tabela corresponde ao dado que você queria ler?'
            : 'esse dado deveria ser criado no objeto antes da leitura?'}
        </p>
        <details className="investigador-pista">
          <summary>Quero uma pista</summary>
          <p>
            Compare os nomes, inclusive letras maiúsculas e minúsculas. Se o dado for opcional, pense em como tratar sua
            ausência.
          </p>
        </details>
        {aoIrParaLinha && (
          <button type="button" className="botao" onClick={() => aoIrParaLinha(acesso.linha)}>
            Revisar a linha {acesso.linha}
          </button>
        )}
      </div>
    </details>
  );
}
