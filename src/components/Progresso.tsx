'use client';

import { sincronizarProgresso, useProgresso } from '@/progresso/armazem';
import { Tique } from './Marcas';

export function AvisoDoProgresso() {
  const { erro } = useProgresso();
  if (!erro) return null;
  return (
    <p role="alert">
      {erro}{' '}
      <button type="button" className="botao botao-leve" onClick={() => void sincronizarProgresso()}>
        Tentar novamente
      </button>
    </p>
  );
}

/** "3 de 9 lições concluídas". Antes de ler o progresso salvo, só o total, para não piscar "0 de 9". */
export function ContagemDaTrilha({
  trilha,
  licoes,
  emLinha = false,
}: {
  trilha: string;
  licoes: { slug: string; total: number }[];
  emLinha?: boolean;
}) {
  const { pronto, quantasConcluidas } = useProgresso();
  const feitas = quantasConcluidas(trilha, licoes);
  const totalExercicios = licoes.reduce((soma, licao) => soma + licao.total, 0);
  const Elemento = emLinha ? 'span' : 'p';
  return (
    <Elemento className="trilha-contagem">
      {pronto && feitas > 0 ? `${feitas} de ${licoes.length} lições concluídas` : `${licoes.length} lições`}
      {` · ${totalExercicios} exercícios`}
    </Elemento>
  );
}

/**
 * O que mostrar ao lado de uma lição no índice: o visto, se está concluída, ou
 * "2 de 4" se ela tem vários exercícios e o aluno já fez alguns.
 */
export function SituacaoDaLicao({ trilha, licao, exercicios }: { trilha: string; licao: string; exercicios: number }) {
  const { pronto, concluida, exerciciosFeitos } = useProgresso();
  if (!pronto) return null;
  if (concluida(trilha, licao, exercicios)) {
    return (
      <span className="visto">
        <Tique tamanho={20} className="sem-animacao" />
        <span className="sr-only">Concluída</span>
      </span>
    );
  }
  const feitos = exerciciosFeitos(trilha, licao, exercicios);
  if (feitos === 0) return null;
  return (
    <span className="parcial">
      {feitos} de {exercicios}
      <span className="sr-only"> exercícios feitos</span>
    </span>
  );
}
