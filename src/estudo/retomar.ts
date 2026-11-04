import { chaveDaLicao, chaveDoExercicio, licaoConcluida, type Progresso } from '@/progresso/tipos';
import type { LicaoParaRetomar, PosicaoEstudo } from './tipos';
import { PRIMEIRA_ATIVIDADE } from './inicio';

export function escolherRetomada(catalogo: LicaoParaRetomar[], progresso: Progresso, ultima?: PosicaoEstudo | null) {
  const pendente = (licao: LicaoParaRetomar) => {
    if (licaoConcluida(progresso, licao.trilha, licao.licao, licao.total)) return -1;
    return Array.from({ length: licao.total }, (_, i) => i).findIndex(
      (i) => !progresso.exerciciosConcluidos[chaveDoExercicio(licao.trilha, licao.licao, i)],
    );
  };
  let inicio = ultima ? catalogo.findIndex((l) => l.trilha === ultima.trilha && l.licao === ultima.licao) : -1;
  if (inicio < 0) {
    const datas = { ...progresso.concluidas, ...progresso.exerciciosConcluidos };
    const ultimaChave = Object.entries(datas)
      .sort((a, b) => b[1].localeCompare(a[1]))[0]?.[0]
      .split('#')[0];
    inicio = catalogo.findIndex((l) => chaveDaLicao(l.trilha, l.licao) === ultimaChave);
  }
  const ordem = [...catalogo.slice(Math.max(0, inicio)), ...catalogo.slice(0, Math.max(0, inicio))];
  const licao = ordem.find((l) => pendente(l) >= 0);
  const feitos = catalogo.reduce(
    (soma, l) =>
      soma +
      (pendente(l) < 0
        ? l.total
        : Array.from({ length: l.total }, (_, i) => i).filter(
            (i) => progresso.exerciciosConcluidos[chaveDoExercicio(l.trilha, l.licao, i)],
          ).length),
    0,
  );
  return {
    licao: licao ?? null,
    indice: licao ? pendente(licao) : 0,
    iniciada: Boolean(
      ultima || Object.keys(progresso.concluidas).length || Object.keys(progresso.exerciciosConcluidos).length,
    ),
    feitos,
    total: catalogo.reduce((soma, l) => soma + l.total, 0),
  };
}

export function hrefDaRetomada(retomada: ReturnType<typeof escolherRetomada> | null): string {
  if (!retomada) return '/comecar';
  if (!retomada.licao) return '/trilhas';
  const { trilha, licao } = retomada.licao;
  if (trilha === PRIMEIRA_ATIVIDADE.trilha && licao === PRIMEIRA_ATIVIDADE.licao && retomada.indice === 0) {
    return '/comecar';
  }
  return `/trilhas/${trilha}/${licao}`;
}
