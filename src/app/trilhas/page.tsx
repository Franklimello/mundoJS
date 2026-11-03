import type { Metadata } from 'next';
import { Sumario } from '@/components/Sumario';
import { trilhas } from '@/conteudo';
import { temProAtual } from '@/servidor/acesso-conteudo';

export const metadata: Metadata = { title: 'Trilhas' };
export const dynamic = 'force-dynamic';

export default async function Trilhas() {
  const pro = await temProAtual();
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Trilhas</h1>
      <p className="secao-apoio">
        Comece com JavaScript do zero, a trilha gratuita. Libere as outras trilhas e os projetos com o Pro.
      </p>
      <div className="trilhas-completas">
        {trilhas.map((trilha) => (
          <Sumario key={trilha.slug} trilha={trilha} comTitulo pro={pro} />
        ))}
      </div>
    </div>
  );
}
