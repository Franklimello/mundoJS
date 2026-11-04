import { FiSearch } from 'react-icons/fi';
import type { InvestigacaoIndice, InvestigacaoPropriedade } from '@/engine/tipos';
import { InvestigadorObjeto } from './InvestigadorObjeto';

export function Investigador({
  acessos,
  propriedades = [],
  aoIrParaLinha,
}: {
  acessos: InvestigacaoIndice[];
  propriedades?: InvestigacaoPropriedade[];
  aoIrParaLinha?: (linha: number) => void;
}) {
  return (
    <section className="investigador" aria-label="Investigador de erros">
      <p className="investigador-titulo">
        <FiSearch aria-hidden="true" /> Investigador de erros
      </p>
      <p role="status">
        Um acesso devolveu <code>undefined</code>. Isso pode ser intencional; confira o índice ou o nome da propriedade.
      </p>
      {acessos.map((acesso, numero) => (
        <details className="investigador-acesso" key={`${acesso.linha}:${acesso.coluna}:${acesso.indice}:${numero}`}>
          <summary>Por que apareceu undefined? · linha {acesso.linha}</summary>
          <div className="investigador-conteudo">
            <p>
              <code>
                {acesso.array}[{acesso.indice}]
              </code>{' '}
              devolveu <code>undefined</code> neste acesso.
            </p>
            <p>
              {acesso.tamanho === 0 ? (
                'O array estava vazio: não havia posições com itens.'
              ) : (
                <>
                  O array tinha {acesso.tamanho} {acesso.tamanho === 1 ? 'posição' : 'posições'}, com índices de{' '}
                  <strong>0</strong> a <strong>{acesso.tamanho - 1}</strong>. O índice <strong>{acesso.indice}</strong>{' '}
                  está fora desse intervalo.
                </>
              )}
            </p>
            {acesso.itens.length > 0 && (
              <table>
                <caption>
                  Posições no momento do acesso{acesso.tamanho > acesso.itens.length ? ' · primeiras 8' : ''}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Índice</th>
                    <th scope="col">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {acesso.itens.map((item) => (
                    <tr key={item.indice}>
                      <th scope="row">{item.indice}</th>
                      <td>
                        <code>{item.valor}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="investigador-pergunta">
              <strong>Agora pense:</strong>{' '}
              {acesso.tamanho === 0
                ? 'como seu programa pode lidar com um array sem itens?'
                : 'qual posição contém o valor que você queria usar?'}
            </p>
            <details className="investigador-pista">
              <summary>Quero uma pista</summary>
              <p>
                A contagem dos índices começa em zero. Compare o índice escolhido com <code>{acesso.array}.length</code>
                . Se o array pode vir vazio, como você trataria esse caso antes do acesso?
              </p>
            </details>
            {aoIrParaLinha && (
              <button type="button" className="botao" onClick={() => aoIrParaLinha(acesso.linha)}>
                Revisar a linha {acesso.linha}
              </button>
            )}
          </div>
        </details>
      ))}
      {propriedades.map((acesso, indice) => (
        <InvestigadorObjeto
          key={`${acesso.linha}:${acesso.coluna}:${indice}`}
          acesso={acesso}
          aoIrParaLinha={aoIrParaLinha}
        />
      ))}
      <p className="investigador-nota">
        Observação desta execução. Ela não altera seu código nem o resultado dos testes.
      </p>
    </section>
  );
}
