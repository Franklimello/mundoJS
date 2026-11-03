import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CodigoDestacado } from '@/components/CodigoDestacado';
import { buscarProjeto } from '@/projetos/catalogo';
import { banco } from '@/servidor/banco';
import { lerProjetoCompartilhado } from '@/servidor/projetos';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Projeto compartilhado', robots: { index: false, follow: false } };
export default async function Compartilhado({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-f0-9]{48}$/.test(id)) notFound();
  const versao = await lerProjetoCompartilhado(banco(), id);
  const projeto = versao && buscarProjeto(versao.trilha);
  if (!versao || !projeto) notFound();
  return (
    <div className="pagina secao">
      <p className="projeto-selo">Projeto compartilhado · somente leitura</p>
      <h1 className="titulo-de-pagina">{projeto.titulo}</h1>
      <p className="secao-apoio">{projeto.resumo}</p>
      <p>Este código foi compartilhado por um aluno. Ele é exibido como texto e não é executado nesta página.</p>
      <pre className="projeto-codigo-publico" tabIndex={0} aria-label="Código compartilhado">
        <code>
          <CodigoDestacado codigo={versao.codigo} />
        </code>
      </pre>
      <Link className="botao botao-principal" href={`/projetos/${projeto.trilha}`}>
        Construir minha própria versão
      </Link>
    </div>
  );
}
