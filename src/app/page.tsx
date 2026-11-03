import Link from 'next/link';
import type { Metadata } from 'next';
import { FolhaDaVitrine } from '@/components/Folhas';
import { ContagemDaTrilha } from '@/components/Progresso';
import { ContinuarEstudando } from '@/components/ContinuarEstudando';
import { MedirVisita } from '@/components/MedirVisita';
import { todasAsLicoes, trilhas } from '@/conteudo';
import { trilhaGratuita } from '@/conta/planos';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Inicio() {
  return (
    <>
      <MedirVisita />
      <section className="pagina heroi">
        <div className="heroi-texto">
          <h1>Escreva um código. Veja ele rodar.</h1>
          <p className="heroi-apoio">
            Lições curtas de JavaScript, um editor que roda direto no navegador e um corretor que confere cada exercício
            na hora. Não precisa instalar nada.
          </p>
          <div className="heroi-acoes">
            <ContinuarEstudando
              catalogo={trilhas.flatMap((trilha) =>
                todasAsLicoes(trilha).map((licao) => ({
                  trilha: trilha.slug,
                  tituloTrilha: trilha.titulo,
                  licao: licao.slug,
                  titulo: licao.titulo,
                  total: licao.exercicios.length,
                })),
              )}
            />
            <Link className="botao botao-leve botao-grande" href="/rascunho">
              Abrir o rascunho
            </Link>
          </div>
        </div>
        <div className="heroi-folha">
          <FolhaDaVitrine />
        </div>
      </section>

      <section className="pagina secao" aria-labelledby="titulo-trilhas">
        <h2 id="titulo-trilhas">Trilhas</h2>
        <p className="secao-apoio">
          Comece gratuitamente com JavaScript do zero. Continue com as demais trilhas e os projetos no Pro.
        </p>
        <ul className="trilhas">
          {trilhas.map((trilha) => (
            <li key={trilha.slug}>
              <Link href={`/trilhas/${trilha.slug}`} className="trilha-linha">
                <span className="trilha-titulo">
                  {trilha.titulo}{' '}
                  <small className="plano-etiqueta">{trilhaGratuita(trilha.slug) ? 'Gratuita' : 'Pro'}</small>
                </span>
                <span className="trilha-descricao">{trilha.descricao}</span>
                <ContagemDaTrilha
                  trilha={trilha.slug}
                  licoes={todasAsLicoes(trilha).map((l) => ({ slug: l.slug, total: l.exercicios.length }))}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
