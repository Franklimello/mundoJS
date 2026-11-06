import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodigoDestacado } from '@/components/CodigoDestacado';
import { FiltroDocumentacao } from '@/components/FiltroDocumentacao';
import { Texto } from '@/components/Texto';
import { TreinoMetodo } from '@/components/TreinoMetodo';
import { buscarTopico, topicos } from '@/documentacao';
import type { MetodoDoc } from '@/documentacao/tipos';

type Parametros = { params: Promise<{ topico: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return topicos.map((topico) => ({ topico: topico.slug }));
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const topico = buscarTopico((await params).topico);
  return topico
    ? {
        title: `${topico.titulo} · Documentação`,
        description: topico.resumo,
        alternates: { canonical: `/documentacao/${topico.slug}` },
      }
    : {};
}

/** O texto que o filtro procura: nome, âncora e resumo. */
function textoDeBusca(metodo: MetodoDoc, secao: string): string {
  return [metodo.nome, metodo.id, metodo.resumo, secao].join(' ');
}

export default async function TopicoDaDocumentacao({ params }: Parametros) {
  const topico = buscarTopico((await params).topico);
  if (!topico) notFound();
  const idConteudo = `doc-${topico.slug}`;

  return (
    <div className="pagina secao">
      <p className="migalhas">
        <Link href="/documentacao">Documentação</Link>
      </p>
      <h1 className="titulo-de-pagina">{topico.titulo}</h1>
      <div className="secao-apoio doc-introducao">
        {topico.introducao.map((paragrafo, i) => (
          <p key={i}>
            <Texto>{paragrafo}</Texto>
          </p>
        ))}
      </div>

      {topico.slug === 'sql' && (
        <div className="doc-sql-banner">
          <div className="doc-sql-banner-conteudo">
            <span className="doc-sql-banner-icone" aria-hidden="true">
              ⚡
            </span>
            <div>
              <strong>Console SQL Interativo disponível!</strong>
              <p>
                Execute consultas reais contra um banco SQLite em memória via WebAssembly, com 6 tabelas populadas e
                resultados em tempo real.
              </p>
            </div>
          </div>
          <Link href="/sql" className="botao botao-primario">
            Abrir Console SQL →
          </Link>
        </div>
      )}

      <div className="doc-layout">
        <nav className="doc-indice" aria-label={`Métodos de ${topico.titulo}`} data-indice-de={idConteudo}>
          <FiltroDocumentacao alvo={idConteudo} />
          {topico.secoes.map((secao) => (
            <div key={secao.titulo} className="doc-indice-grupo">
              <p className="doc-indice-titulo">{secao.titulo}</p>
              <ul>
                {secao.metodos.map((metodo) => (
                  <li key={metodo.id} data-busca={textoDeBusca(metodo, secao.titulo)}>
                    <a href={`#${metodo.id}`}>
                      <code>{metodo.nome}</code>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div id={idConteudo} className="doc-conteudo">
          {topico.secoes.map((secao) => (
            <section key={secao.titulo} className="doc-secao" data-secao>
              <h2>{secao.titulo}</h2>
              {secao.descricao && <p className="doc-secao-descricao">{secao.descricao}</p>}
              {secao.metodos.map((metodo) => (
                <article
                  key={metodo.id}
                  id={metodo.id}
                  className="doc-metodo"
                  data-busca={textoDeBusca(metodo, secao.titulo)}
                >
                  <h3>
                    <a href={`#${metodo.id}`} className="doc-ancora">
                      <code>{metodo.nome}</code>
                    </a>
                  </h3>
                  <p>
                    <Texto>{metodo.resumo}</Texto>
                  </p>
                  <dl className="doc-ficha">
                    <div>
                      <dt>Sintaxe</dt>
                      <dd>
                        <pre className="doc-sintaxe">
                          <code>
                            <CodigoDestacado codigo={metodo.sintaxe} />
                          </code>
                        </pre>
                      </dd>
                    </div>
                    <div>
                      <dt>Devolve</dt>
                      <dd>
                        <Texto>{metodo.retorno}</Texto>
                      </dd>
                    </div>
                  </dl>
                  {metodo.exemplos.map((exemplo, i) => (
                    <figure key={i} className="exemplo">
                      <pre tabIndex={0} aria-label={`Exemplo de ${metodo.nome}`}>
                        <code>
                          <CodigoDestacado codigo={exemplo.codigo} />
                        </code>
                      </pre>
                      <figcaption>
                        <span className="exemplo-rotulo">Mostra</span>
                        <pre>{exemplo.saida}</pre>
                      </figcaption>
                    </figure>
                  ))}
                  {metodo.cuidado && (
                    <aside className="nota nota-cuidado">
                      <Texto>{metodo.cuidado}</Texto>
                    </aside>
                  )}
                  <TreinoMetodo topico={topico.slug} metodo={metodo} />
                </article>
              ))}
            </section>
          ))}
          <p className="doc-rodape">
            {topico.slug === 'sql' ? (
              <>
                Quer rodar consultas de verdade? Experimente o <Link href="/sql">Console SQL Interativo</Link>.
              </>
            ) : (
              <>
                Quer testar? Copie um exemplo e rode no <Link href="/rascunho">Rascunho</Link>.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
