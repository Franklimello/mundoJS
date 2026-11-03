import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { LicaoInterativa, type ExercicioNaTela } from '@/components/LicaoInterativa';
import { Texto } from '@/components/Texto';
import { buscarLicao, todasAsLicoes, todosOsCaminhos } from '@/conteudo';
import { narracaoDoExercicio } from '@/narracao/texto';
import { buscarProjeto } from '@/projetos/catalogo';
import { trilhaGratuita } from '@/conta/planos';
import { temProAtual } from '@/servidor/acesso-conteudo';
import { ConteudoPro } from '@/components/ConteudoPro';

export const dynamic = 'force-dynamic';

type Parametros = { params: Promise<{ trilha: string; licao: string }> };

export function generateStaticParams() {
  return todosOsCaminhos();
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const { trilha, licao } = await params;
  const achada = buscarLicao(trilha, licao);
  return achada ? { title: `${achada.licao.titulo} — ${achada.trilha.titulo}`, description: achada.licao.resumo } : {};
}

export default async function PaginaDaLicao({ params }: Parametros) {
  const { trilha: trilhaSlug, licao: licaoSlug } = await params;
  const achada = buscarLicao(trilhaSlug, licaoSlug);
  if (!achada) notFound();
  // A autorização acontece antes de montar ou serializar qualquer atividade.
  if (!trilhaGratuita(trilhaSlug) && !(await temProAtual())) return <ConteudoPro titulo={achada.licao.titulo} />;
  const { trilha, modulo, licao, numero, anterior, proxima } = achada;
  const total = todasAsLicoes(trilha).length;
  const projeto = licao.slug === 'desafio-final' ? buscarProjeto(trilha.slug) : undefined;
  const href = (slug: string) => `/trilhas/${trilha.slug}/${slug}`;

  // O texto de cada exercício é montado aqui, no servidor, e só chega pronto à tela interativa.
  const exercicios: ExercicioNaTela[] = licao.exercicios.map((exercicio, indice) => ({
    ...(exercicio.titulo && { titulo: exercicio.titulo }),
    enunciado: <Conteudo blocos={exercicio.enunciado} />,
    narracao: narracaoDoExercicio(exercicio, indice, licao.exercicios.length),
    dicas: (
      <div className="dicas">
        {exercicio.dicas.map((dica, indice) => (
          <details key={indice} className="dica">
            <summary>Dica {indice + 1}</summary>
            <p>
              <Texto>{dica}</Texto>
            </p>
          </details>
        ))}
      </div>
    ),
    codigoInicial: exercicio.codigoInicial,
    documentoInicial: exercicio.documentoInicial,
    testes: exercicio.testes,
    solucao: exercicio.solucao,
  }));

  return (
    <LicaoInterativa
      key={`${trilha.slug}/${licao.slug}`}
      trilha={trilha.slug}
      licao={licao.slug}
      exercicios={exercicios}
      projetoFinal={projeto ? { href: `/projetos/${projeto.trilha}`, titulo: projeto.titulo } : undefined}
      proxima={proxima ? { href: href(proxima.licao.slug), titulo: proxima.licao.titulo } : null}
      antes={
        <>
          <p className="migalhas">
            <Link href={`/trilhas/${trilha.slug}`}>{trilha.titulo}</Link>
            <span aria-hidden="true"> / </span>
            {modulo.titulo}
          </p>
          <h1 className="titulo-de-pagina">{licao.titulo}</h1>
          <p className="licao-posicao">
            Lição {numero} de {total}
          </p>
          <Conteudo blocos={licao.conteudo} />
        </>
      }
      depois={
        <nav className="licao-navegacao" aria-label="Entre as lições">
          {anterior ? (
            <Link href={href(anterior.licao.slug)}>
              <span className="navegacao-sentido">Anterior</span>
              {anterior.licao.titulo}
            </Link>
          ) : (
            <span />
          )}
          {proxima && (
            <Link href={href(proxima.licao.slug)} className="navegacao-proxima">
              <span className="navegacao-sentido">Próxima</span>
              {proxima.licao.titulo}
            </Link>
          )}
        </nav>
      }
    />
  );
}
