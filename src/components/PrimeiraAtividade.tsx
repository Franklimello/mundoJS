'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck, FiHelpCircle } from 'react-icons/fi';
import { registrarEvento } from '@/estudo/eventos';
import { HREF_PRIMEIRA_LICAO, PRIMEIRA_ATIVIDADE } from '@/estudo/inicio';
import { concluirExercicio, useProgresso } from '@/progresso/armazem';
import { Folha } from './Folha';
import type { ExercicioNaTela } from './LicaoInterativa';
import { NarracaoExercicio } from './NarracaoExercicio';
import { Texto } from './Texto';

interface Props {
  exercicio: Pick<ExercicioNaTela, 'enunciado' | 'narracao' | 'codigoInicial' | 'testes' | 'solucao'>;
  totalExercicios: number;
  dicas: string[];
}

export function PrimeiraAtividade({ exercicio, totalExercicios, dicas }: Props) {
  const [iniciou, setIniciou] = useState(false);
  const [acertouAgora, setAcertouAgora] = useState(false);
  const [dicasVisiveis, setDicasVisiveis] = useState(0);
  const { pronto, erro, exercicioConcluido } = useProgresso();
  const evento = useRef<string | null>(null);
  const pratica = useRef<HTMLElement>(null);
  const { trilha, licao, indice } = PRIMEIRA_ATIVIDADE;
  const concluido = acertouAgora || exercicioConcluido(trilha, licao, indice);
  const etapa = concluido ? 3 : iniciou ? 2 : 1;

  useEffect(() => {
    if (!iniciou) return;
    evento.current ??= crypto.randomUUID();
    registrarEvento({ tipo: 'exercicio_aberto', posicao: PRIMEIRA_ATIVIDADE }, evento.current);
    pratica.current?.focus({ preventScroll: true });
    pratica.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [iniciou]);

  const orientacao = (
    <div className="primeira-orientacao">
      <h2>Escreva suas duas mensagens</h2>
      {exercicio.enunciado}
      <p>
        Digite no editor. Use <strong>Rodar</strong> para ver a saída e <strong>Conferir</strong> para corrigir.
      </p>
      <p className="primeira-apoio">
        No celular, toque em <strong>Modelos</strong> para inserir um comando e preencher o texto.
      </p>
      {dicas.length > 0 && (
        <div className="primeira-dicas">
          <button
            type="button"
            className="botao botao-leve"
            disabled={dicasVisiveis === dicas.length}
            onClick={() => setDicasVisiveis((quantas) => Math.min(quantas + 1, dicas.length))}
          >
            <FiHelpCircle aria-hidden="true" />
            {dicasVisiveis === dicas.length
              ? 'Todas as dicas abertas'
              : dicasVisiveis
                ? 'Ver próxima dica'
                : 'Preciso de uma dica'}
          </button>
          <div aria-live="polite">
            {dicas.slice(0, dicasVisiveis).map((dica, i) => (
              <p key={dica}>
                <strong>Dica {i + 1}:</strong> <Texto>{dica}</Texto>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pagina primeira-atividade">
      <header className="primeira-cabecalho">
        <p className="primeira-etiqueta">Primeira atividade · gratuita · sem cadastro</p>
        <h1 className="titulo-de-pagina">Seu primeiro código, com ajuda.</h1>
        <p>Você vai pedir ao computador para mostrar duas mensagens. Vamos por partes.</p>
      </header>
      <ol className="primeira-etapas" aria-label="Etapas da primeira atividade">
        {['Entender', 'Experimentar', 'Conseguir'].map((texto, i) => (
          <li key={texto} aria-current={etapa === i + 1 ? 'step' : undefined} data-feito={etapa > i + 1}>
            <span aria-hidden="true">{etapa > i + 1 ? <FiCheck /> : i + 1}</span>
            {texto}
          </li>
        ))}
      </ol>

      {concluido && !iniciou && (
        <section className="nota primeira-retomada">
          <h2>Você já concluiu esta atividade.</h2>
          <p>Seu progresso está guardado. Continue na primeira lição ou experimente novamente.</p>
          <Link className="botao botao-principal" href={HREF_PRIMEIRA_LICAO}>
            Continuar aprendendo <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      )}

      {!iniciou ? (
        <section className="primeira-intro" aria-labelledby="primeiro-comando">
          <h2 id="primeiro-comando">Um comando para mostrar uma mensagem</h2>
          <p>
            <code>console.log</code> pede ao JavaScript para mostrar o que está entre os parênteses.
          </p>
          <figure className="exemplo">
            <pre tabIndex={0} aria-label="Exemplo de código">
              <code>{'console.log("Oi!");'}</code>
            </pre>
            <figcaption>
              <span className="exemplo-rotulo">Mostra</span>
              <pre>Oi!</pre>
            </figcaption>
          </figure>
          <p>
            O texto fica entre aspas. Cada <code>console.log</code> cria uma linha na saída.
          </p>
          <button
            type="button"
            className="botao botao-principal botao-grande"
            disabled={!pronto && !erro}
            onClick={() => setIniciou(true)}
          >
            {!pronto && !erro ? 'Carregando seu progresso…' : concluido ? 'Praticar novamente' : 'Começar a atividade'}
            <FiArrowRight aria-hidden="true" />
          </button>
          <p className="primeira-apoio">Pode errar e tentar de novo. As dicas aparecem quando você precisar.</p>
        </section>
      ) : (
        <section ref={pratica} tabIndex={-1} aria-label="Praticar seu primeiro código" className="primeira-pratica">
          <aside className="primeira-instrucoes" aria-label="Ajuda para a atividade">
            {orientacao}
            {exercicio.narracao && <NarracaoExercicio texto={exercicio.narracao} />}
          </aside>
          <div className="primeira-editor">
            <Folha
              titulo="Seu primeiro código"
              rotuloDoEditor="Editor da primeira atividade"
              codigoInicial={exercicio.codigoInicial}
              chaveRascunho={`${trilha}/${licao}`}
              enunciado={orientacao}
              testes={exercicio.testes}
              solucao={exercicio.solucao}
              contextoTutor={PRIMEIRA_ATIVIDADE}
              aoPraticar={() => pratica.current?.scrollIntoView({ block: 'start' })}
              aoConcluir={() => {
                setAcertouAgora(true);
                void concluirExercicio(trilha, licao, indice, totalExercicios);
              }}
              aoAcertar={
                <div className="depois">
                  <h3>Você escreveu seu primeiro programa!</h3>
                  <p>
                    Usou <code>console.log</code> para mostrar duas mensagens, uma em cada linha.
                  </p>
                  <p>Este acerto conta na trilha JavaScript do zero. A próxima atividade mistura números e textos.</p>
                  <Link className="botao botao-principal" href={HREF_PRIMEIRA_LICAO}>
                    Continuar na primeira lição <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              }
            />
          </div>
        </section>
      )}
      <p className="primeira-saida">
        <Link href="/trilhas/javascript-do-zero">Ver a trilha completa</Link>
      </p>
    </div>
  );
}
