import type { Metadata } from 'next';
import Link from 'next/link';
import { catalogoProjetos } from '@/projetos/catalogo';
import { temProAtual } from '@/servidor/acesso-conteudo';

export const metadata: Metadata = {
  title: 'Projetos práticos',
  description: 'Junte o que aprendeu e construa seu próprio projeto JavaScript.',
};
export const dynamic = 'force-dynamic';
export default async function Projetos() {
  const pro = await temProAtual();
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Da lição para um projeto seu.</h1>
      <p className="secao-apoio">
        Os 4 projetos práticos fazem parte do Pro. Junte o que aprendeu em um programa completo, salve seu código e
        compartilhe uma versão de leitura.
      </p>
      <div className="projetos-grade">
        {catalogoProjetos.map((projeto, indice) => (
          <article className="projeto-cartao" key={projeto.trilha}>
            <p className="projeto-selo">Projeto {indice + 1} · Pro</p>
            <h2>{projeto.titulo}</h2>
            <p>{projeto.resumo}</p>
            <ul>
              {projeto.resultados.map((resultado) => (
                <li key={resultado}>{resultado}</li>
              ))}
            </ul>
            <Link href={pro ? `/projetos/${projeto.trilha}` : '/planos'} className="botao botao-principal">
              {pro ? 'Construir meu projeto' : 'Liberar com o Pro'}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
