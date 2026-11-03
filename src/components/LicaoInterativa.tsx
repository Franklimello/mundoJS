'use client';

import Link from 'next/link';
import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from 'react';
import { registrarEvento } from '@/estudo/eventos';
import type { TesteDefinicao } from '@/engine/tipos';
import type { DocumentoWeb } from '@/engine/documento';
import { concluirExercicio, useProgresso } from '@/progresso/armazem';
import { Folha } from './Folha';
import { Tique } from './Marcas';
import { NarracaoExercicio } from './NarracaoExercicio';
import type { TutorControles } from './Tutor';

/** Um exercício como a tela o recebe: o texto já vem pronto do servidor. */
export interface ExercicioNaTela {
  titulo?: string;
  enunciado: ReactNode;
  narracao?: string;
  dicas: ReactNode;
  codigoInicial: string;
  documentoInicial?: DocumentoWeb;
  testes: TesteDefinicao[];
  solucao: string;
}

interface LicaoInterativaProps {
  trilha: string;
  licao: string;
  /** O cabeçalho e a explicação da lição. */
  antes: ReactNode;
  /** A navegação entre lições, no pé do texto. */
  depois: ReactNode;
  exercicios: ExercicioNaTela[];
  proxima: { href: string; titulo: string } | null;
  projetoFinal?: { href: string; titulo: string };
}

function rolarParaSuaVez() {
  const alvo = document.getElementById('sua-vez');
  if (!alvo) return;
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  alvo.scrollIntoView({ block: 'start', behavior: menosMovimento ? 'auto' : 'smooth' });
}

/**
 * A lição: o texto à esquerda, a folha à direita e, entre os dois, o passo a
 * passo dos exercícios. A lição só fica concluída quando todos estão certos.
 */
export function LicaoInterativa({
  trilha,
  licao,
  antes,
  depois,
  exercicios,
  proxima,
  projetoFinal,
}: LicaoInterativaProps) {
  const id = useId();
  const leitura = useRef<HTMLElement | null>(null);
  const pratica = useRef<HTMLDivElement | null>(null);
  const tutor = useRef<TutorControles | null>(null);
  const [escolhido, setAtual] = useState<number | null>(null);
  const { pronto, erro, concluida, exercicioConcluido } = useProgresso();
  if (escolhido === null && (pronto || erro)) {
    const pendente = concluida(trilha, licao, exercicios.length)
      ? 0
      : exercicios.findIndex((_, i) => !exercicioConcluido(trilha, licao, i));
    setAtual(Math.max(0, pendente));
  }
  const atual = escolhido ?? 0;
  const ultimoEvento = useRef<{ chave: string; id: string } | null>(null);
  useEffect(() => {
    if (escolhido === null) return;
    const chave = `${trilha}/${licao}#${atual}`;
    if (ultimoEvento.current?.chave !== chave) ultimoEvento.current = { chave, id: crypto.randomUUID() };
    registrarEvento({ tipo: 'exercicio_aberto', posicao: { trilha, licao, indice: atual } }, ultimoEvento.current.id);
  }, [trilha, licao, atual, escolhido]);
  const total = exercicios.length;
  const exercicio = exercicios[atual] ?? exercicios[0];

  const acertou = useCallback(() => {
    void concluirExercicio(trilha, licao, atual, total);
  }, [trilha, licao, atual, total]);

  if (!exercicio) return null;

  function focarRegiao(alvo: HTMLElement | null) {
    if (!alvo) return;
    alvo.focus({ preventScroll: true });
    alvo.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  function irPara(indice: number, rolar: boolean) {
    setAtual(indice);
    if (rolar) rolarParaSuaVez();
  }

  // O exercício que acabou de ficar certo já conta, mesmo antes de o progresso ser regravado.
  const faltam = exercicios.map((_, i) => i).filter((i) => i !== atual && !exercicioConcluido(trilha, licao, i));
  const proximoPendente = faltam.find((i) => i > atual) ?? faltam[0];

  const aoAcertar =
    faltam.length === 0 ? (
      <div className="depois">
        <p>
          {total > 1 ? `Lição concluída: os ${total} exercícios estão certos.` : 'Lição concluída.'}{' '}
          {proxima ? 'Ela já aparece com o visto no índice.' : 'Foi a última desta trilha.'}
        </p>
        {projetoFinal && (
          <Link className="botao botao-principal" href={projetoFinal.href}>
            Construir: {projetoFinal.titulo}
          </Link>
        )}
        {proxima ? (
          <Link href={proxima.href} className="botao botao-principal">
            Próxima: {proxima.titulo}
          </Link>
        ) : (
          <Link href="/trilhas" className="botao botao-principal">
            Ver as outras trilhas
          </Link>
        )}
      </div>
    ) : (
      <div className="depois">
        <p>
          Exercício {atual + 1} certo.{' '}
          {faltam.length === 1 ? 'Falta 1 exercício' : `Faltam ${faltam.length} exercícios`} para concluir a lição.
        </p>
        {proximoPendente !== undefined && (
          <button type="button" className="botao botao-principal" onClick={() => irPara(proximoPendente, true)}>
            Ir para o exercício {proximoPendente + 1}
          </button>
        )}
      </div>
    );

  return (
    <div className="pagina licao">
      <nav className="licao-atalhos" aria-label="Atalhos da lição">
        <button
          type="button"
          className="botao botao-leve"
          aria-controls={`${id}-leitura`}
          onClick={() => focarRegiao(leitura.current)}
        >
          Ler
        </button>
        <button
          type="button"
          className="botao botao-leve"
          aria-controls={`${id}-pratica`}
          disabled={escolhido === null}
          onClick={() => focarRegiao(pratica.current)}
        >
          Praticar
        </button>
        <button
          type="button"
          className="botao botao-leve"
          disabled={escolhido === null}
          onClick={() => tutor.current?.abrir()}
        >
          Ajuda
        </button>
      </nav>
      <article ref={leitura} id={`${id}-leitura`} tabIndex={-1} className="licao-texto">
        {antes}

        <section className="sua-vez" aria-labelledby="sua-vez">
          <h2 id="sua-vez">Sua vez</h2>

          {total > 1 && (
            <nav aria-label="Exercícios desta lição">
              <ol className="passos">
                {exercicios.map((_, indice) => {
                  const feito = exercicioConcluido(trilha, licao, indice);
                  return (
                    <li key={indice}>
                      <button
                        type="button"
                        className="passo"
                        aria-current={indice === atual ? 'step' : undefined}
                        onClick={() => irPara(indice, false)}
                      >
                        <span className="sr-only">Exercício </span>
                        {indice + 1}
                        {feito && (
                          <>
                            <Tique tamanho={14} className="sem-animacao" />
                            <span className="sr-only"> (feito)</span>
                          </>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {total > 1 && (
            <p className="exercicio-posicao" aria-live="polite">
              Exercício {atual + 1} de {total}
              {exercicio.titulo ? `: ${exercicio.titulo}` : ''}
            </p>
          )}

          {exercicio.enunciado}
          {exercicio.narracao && escolhido !== null && (
            <NarracaoExercicio key={`${trilha}/${licao}#${atual}`} texto={exercicio.narracao} />
          )}
          {exercicio.dicas}
        </section>

        {depois}
      </article>

      <div ref={pratica} id={`${id}-pratica`} tabIndex={-1} className="licao-folha">
        <details className="enunciado-no-editor" open>
          <summary>
            Exercício {atual + 1} de {total}
            {exercicio.titulo ? `: ${exercicio.titulo}` : ''}
          </summary>
          {exercicio.enunciado}
        </details>
        {/* `key` troca a folha inteira ao mudar de exercício: cada um com o seu código e o seu rascunho. */}
        {escolhido === null ? (
          <p role="status">Carregando seu próximo exercício…</p>
        ) : (
          <Folha
            tutorRef={tutor}
            aoPraticar={() => focarRegiao(pratica.current)}
            key={atual}
            titulo="Seu código"
            rotuloDoEditor={total > 1 ? `Editor de código do exercício ${atual + 1}` : 'Editor de código da lição'}
            codigoInicial={exercicio.codigoInicial}
            documentoInicial={exercicio.documentoInicial}
            chaveRascunho={atual === 0 ? `${trilha}/${licao}` : `${trilha}/${licao}#${atual}`}
            testes={exercicio.testes}
            solucao={exercicio.solucao}
            aoConcluir={acertou}
            aoAcertar={aoAcertar}
            contextoTutor={{ trilha, licao, indice: atual }}
          />
        )}
      </div>
    </div>
  );
}
