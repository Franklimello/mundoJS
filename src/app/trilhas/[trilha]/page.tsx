import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sumario } from '@/components/Sumario';
import { ResultadoTrilha } from '@/components/ResultadoTrilha';
import { buscarTrilha, todasAsLicoes, trilhas } from '@/conteudo';
import { trilhaGratuita } from '@/conta/planos';
import { temProAtual } from '@/servidor/acesso-conteudo';

type Parametros = { params: Promise<{ trilha: string }> };
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return trilhas.map((trilha) => ({ trilha: trilha.slug }));
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const trilha = buscarTrilha((await params).trilha);
  return trilha
    ? { title: trilha.titulo, description: trilha.descricao, alternates: { canonical: `/trilhas/${trilha.slug}` } }
    : {};
}

export default async function PaginaDaTrilha({ params }: Parametros) {
  const trilha = buscarTrilha((await params).trilha);
  if (!trilha) notFound();
  const pro = trilhaGratuita(trilha.slug) ? false : await temProAtual();
  const bloqueada = !trilhaGratuita(trilha.slug) && !pro;
  const primeira = todasAsLicoes(trilha)[0];

  return (
    <div className="pagina secao">
      <p className="migalhas">
        <Link href="/trilhas">Trilhas</Link>
      </p>
      <h1 className="titulo-de-pagina">{trilha.titulo}</h1>
      <p className="secao-apoio">{trilha.descricao}</p>
      {primeira && (
        <p className="secao-acao">
          <Link
            className="botao botao-principal botao-grande"
            href={bloqueada ? '/planos' : `/trilhas/${trilha.slug}/${primeira.slug}`}
          >
            {bloqueada ? 'Liberar esta trilha com o Pro' : `Começar: ${primeira.titulo}`}
          </Link>
        </p>
      )}
      <ResultadoTrilha trilha={trilha.slug} />
      <Sumario trilha={trilha} pro={pro} />
    </div>
  );
}
