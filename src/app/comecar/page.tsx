import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Conteudo } from '@/components/Conteudo';
import { PrimeiraAtividade } from '@/components/PrimeiraAtividade';
import { buscarLicao } from '@/conteudo';
import { PRIMEIRA_ATIVIDADE } from '@/estudo/inicio';
import { narracaoDoExercicio } from '@/narracao/texto';

export const metadata: Metadata = {
  title: 'Seu primeiro código JavaScript',
  description:
    'Comece do zero com uma atividade gratuita e guiada. Escreva seu primeiro código, receba ajuda e confira o resultado.',
  alternates: { canonical: '/comecar' },
};

export default function Comecar() {
  const achada = buscarLicao(PRIMEIRA_ATIVIDADE.trilha, PRIMEIRA_ATIVIDADE.licao);
  const exercicio = achada?.licao.exercicios[PRIMEIRA_ATIVIDADE.indice];
  if (!achada || !exercicio) notFound();
  return (
    <PrimeiraAtividade
      totalExercicios={achada.licao.exercicios.length}
      dicas={exercicio.dicas}
      exercicio={{
        enunciado: <Conteudo blocos={exercicio.enunciado} />,
        narracao: narracaoDoExercicio(exercicio, 0, achada.licao.exercicios.length),
        codigoInicial: exercicio.codigoInicial,
        testes: exercicio.testes,
        solucao: exercicio.solucao,
      }}
    />
  );
}
