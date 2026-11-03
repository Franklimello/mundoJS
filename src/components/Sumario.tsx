import Link from 'next/link';
import { todasAsLicoes } from '@/conteudo';
import type { Trilha } from '@/conteudo/tipos';
import { ContagemDaTrilha, SituacaoDaLicao } from './Progresso';
import { ResultadoTrilha } from './ResultadoTrilha';
import { trilhaGratuita } from '@/conta/planos';

/**
 * O sumário de uma trilha, como o de um caderno: número, título, pontilhado e,
 * no fim, o visto das lições já concluídas.
 */
export function Sumario({
  trilha,
  comTitulo = false,
  pro = false,
}: {
  trilha: Trilha;
  comTitulo?: boolean;
  pro?: boolean;
}) {
  const bloqueada = !trilhaGratuita(trilha.slug) && !pro;
  // A numeração segue pela trilha inteira, sem passar de um módulo para o outro.
  const inicios = trilha.modulos.map((_, i) =>
    trilha.modulos.slice(0, i).reduce((soma, modulo) => soma + modulo.licoes.length, 0),
  );
  return (
    <div className="sumario">
      {comTitulo && (
        <header className="sumario-cabecalho">
          <h2>
            <Link href={`/trilhas/${trilha.slug}`}>{trilha.titulo}</Link>
          </h2>
          <ContagemDaTrilha
            trilha={trilha.slug}
            licoes={todasAsLicoes(trilha).map((l) => ({ slug: l.slug, total: l.exercicios.length }))}
          />
        </header>
      )}
      {comTitulo && <ResultadoTrilha trilha={trilha.slug} />}
      <p className="plano-etiqueta">
        {trilhaGratuita(trilha.slug)
          ? 'Trilha gratuita'
          : bloqueada
            ? 'Pro · assine para liberar as lições'
            : 'Trilha Pro · liberada'}
      </p>
      {trilha.modulos.map((modulo, indiceDoModulo) => (
        <section key={modulo.titulo} className="sumario-modulo" aria-label={modulo.titulo}>
          <h3>{modulo.titulo}</h3>
          <ol>
            {modulo.licoes.map((licao, indice) => {
              const numero = (inicios[indiceDoModulo] ?? 0) + indice + 1;
              return (
                <li key={licao.slug}>
                  <Link href={`/trilhas/${trilha.slug}/${licao.slug}`} className="sumario-linha">
                    <span className="sumario-numero" aria-hidden="true">
                      {numero}
                    </span>
                    <span className="sumario-titulo">
                      <span className="sumario-nome">{licao.titulo}</span>
                      <span className="sumario-resumo">{licao.resumo}</span>
                    </span>
                    <span className="sumario-pontilhado" aria-hidden="true" />
                    {bloqueada ? (
                      <span className="plano-etiqueta">Pro</span>
                    ) : (
                      <SituacaoDaLicao trilha={trilha.slug} licao={licao.slug} exercicios={licao.exercicios.length} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
