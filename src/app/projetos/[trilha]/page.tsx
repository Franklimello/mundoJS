import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { Texto } from '@/components/Texto';
import { ProjetoInterativo } from '@/components/ProjetoInterativo';
import { buscarProjeto, catalogoProjetos } from '@/projetos/catalogo';
import { temProAtual } from '@/servidor/acesso-conteudo';
import { ConteudoPro } from '@/components/ConteudoPro';

export const dynamic = 'force-dynamic';

type Parametros = { params: Promise<{ trilha: string }> };
export function generateStaticParams() {
  return catalogoProjetos.map(({ trilha }) => ({ trilha }));
}
export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const projeto = buscarProjeto((await params).trilha);
  return projeto
    ? {
        title: projeto.titulo,
        description: projeto.resumo,
        alternates: { canonical: `/projetos/${projeto.trilha}` },
        robots: { index: false, follow: true },
      }
    : {};
}
export default async function Projeto({ params }: Parametros) {
  const projeto = buscarProjeto((await params).trilha);
  if (!projeto) notFound();
  if (!(await temProAtual())) return <ConteudoPro titulo={projeto.titulo} projeto trilha={projeto.trilha} />;
  return (
    <div className="pagina secao">
      <p className="migalhas">
        <Link href="/projetos">Projetos</Link> / <Link href={`/trilhas/${projeto.trilha}`}>{projeto.nomeTrilha}</Link>
      </p>
      <h1 className="titulo-de-pagina">{projeto.titulo}</h1>
      <p className="secao-apoio">{projeto.resumo}</p>
      <p className="projeto-orientacao">
        Construa as funções no mesmo editor. O rascunho é salvo separadamente das lições. Use Rodar para experimentar e
        Conferir para testar o conjunto.
      </p>
      {projeto.documentoInicial && (
        <p className="projeto-orientacao">
          Complete as quatro funções no início do código. O HTML, o CSS e a ligação com a tela já estão preparados.
          Depois de Rodar, mude as quantidades e o desconto na prévia para experimentar.
        </p>
      )}
      <nav className="projeto-atalhos" aria-label="Atalhos do projeto">
        <a className="botao botao-leve" href="#etapas-do-projeto">
          Ver etapas
        </a>
        <a className="botao botao-principal" href="#editor-do-projeto">
          Ir ao editor
        </a>
      </nav>
      <details className="projeto-introducao">
        <summary>Relembrar o contexto do desafio</summary>
        <Conteudo blocos={projeto.introducao} />
      </details>
      <div className="projeto-area">
        <section id="etapas-do-projeto" className="projeto-etapas" aria-label="Etapas do projeto" tabIndex={-1}>
          <h2>Seu plano de construção</h2>
          {projeto.etapas.map((etapa, indice) => (
            <details key={indice} open={indice === 0}>
              <summary>
                {indice + 1}. {etapa.titulo}
              </summary>
              <Conteudo blocos={etapa.enunciado} />
              <details className="dica">
                <summary>Ajuda nesta etapa</summary>
                {etapa.dicas.map((dica, i) => (
                  <p key={i}>
                    <Texto>{dica}</Texto>
                  </p>
                ))}
              </details>
              <Link href={`/trilhas/${projeto.trilha}/desafio-final`}>Rever o desafio na lição</Link>
            </details>
          ))}
        </section>
        <ProjetoInterativo
          trilha={projeto.trilha}
          codigoInicial={projeto.codigoInicial}
          testes={projeto.testes}
          documentoInicial={projeto.documentoInicial}
          enunciado={
            <div className="projeto-enunciado">
              <h2>Seu plano de construção</h2>
              {projeto.etapas.map((etapa, indice) => (
                <section key={indice}>
                  <h3>
                    {indice + 1}. {etapa.titulo}
                  </h3>
                  <Conteudo blocos={etapa.enunciado} />
                  <details className="dica">
                    <summary>Ajuda nesta etapa</summary>
                    {etapa.dicas.map((dica, i) => (
                      <p key={i}>
                        <Texto>{dica}</Texto>
                      </p>
                    ))}
                  </details>
                </section>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
}
