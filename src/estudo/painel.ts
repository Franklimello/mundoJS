import { todasAsLicoes, trilhas } from '@/conteudo';
import { trilhaGratuita } from '@/conta/planos';
import type { Progresso } from '@/progresso/tipos';
import type { PosicaoEstudo } from './tipos';
import { escolherRetomada } from './retomar';

export function resumirAprendizado(
  progresso: Progresso,
  ultima: PosicaoEstudo | null,
  pro: boolean,
  certificados: { trilha: string; id: string }[],
) {
  const catalogo = trilhas.flatMap((trilha) =>
    todasAsLicoes(trilha).map((licao) => ({
      trilha: trilha.slug,
      tituloTrilha: trilha.titulo,
      licao: licao.slug,
      titulo: licao.titulo,
      total: licao.exercicios.length,
    })),
  );
  // O painel conta exercícios atuais registrados, como a emissão de certificados.
  const atual = { ...progresso, concluidas: {} };
  const resumoTrilhas = trilhas.map((trilha) => {
    const licoes = catalogo.filter((licao) => licao.trilha === trilha.slug);
    const retomada = escolherRetomada(licoes, atual);
    return {
      slug: trilha.slug,
      titulo: trilha.titulo,
      total: retomada.total,
      feitos: retomada.feitos,
      completa: retomada.total > 0 && retomada.feitos === retomada.total,
      liberada: pro || trilhaGratuita(trilha.slug),
      certificado: certificados.find((item) => item.trilha === trilha.slug)?.id ?? null,
      proximaLicao: retomada.licao?.licao ?? null,
    };
  });
  const retomada = escolherRetomada(
    catalogo.filter((licao) => pro || trilhaGratuita(licao.trilha)),
    atual,
    ultima,
  );
  return {
    trilhas: resumoTrilhas,
    feitos: resumoTrilhas.reduce((soma, trilha) => soma + trilha.feitos, 0),
    total: resumoTrilhas.reduce((soma, trilha) => soma + trilha.total, 0),
    completas: resumoTrilhas.filter((trilha) => trilha.completa).length,
    certificados: certificados.length,
    paraEmitir: resumoTrilhas.filter((trilha) => trilha.completa && !trilha.certificado).length,
    retomada,
    pro,
  };
}
