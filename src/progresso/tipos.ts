/**
 * O progresso do aluno e o contrato de onde ele é guardado.
 *
 * A API persiste os dados no Postgres. O repositório mantém as telas
 * independentes da forma de armazenamento.
 */

export interface Progresso {
  versao: 1;
  /** Lições concluídas: `trilha/licao` → quando, em ISO 8601. */
  concluidas: Record<string, string>;
  /** Exercícios certos: `trilha/licao#indice` (o primeiro é 0) → quando. */
  exerciciosConcluidos: Record<string, string>;
}

export const PROGRESSO_VAZIO: Progresso = { versao: 1, concluidas: {}, exerciciosConcluidos: {} };

export interface RepositorioProgresso {
  identidade?(): string | undefined;
  carregar(): Promise<Progresso>;
  salvar(progresso: Progresso): Promise<void>;
}

export function chaveDaLicao(trilha: string, licao: string): string {
  return `${trilha}/${licao}`;
}

export function chaveDoExercicio(trilha: string, licao: string, indice: number): string {
  return `${chaveDaLicao(trilha, licao)}#${indice}`;
}

/** Novos exercícios ficam pendentes mesmo se a versão anterior da lição estava concluída.
 * Registros antigos sem qualquer detalhe por exercício continuam sendo reconhecidos. */
export function licaoConcluida(progresso: Progresso, trilha: string, licao: string, total: number): boolean {
  if (total < 1) return false;
  const feitos = Array.from({ length: total }, (_, i) =>
    Boolean(progresso.exerciciosConcluidos[chaveDoExercicio(trilha, licao, i)]),
  );
  if (feitos.every(Boolean)) return true;
  if (feitos.some(Boolean)) return false;
  return Boolean(progresso.concluidas[chaveDaLicao(trilha, licao)]);
}

/**
 * Marca um exercício como certo. Quando todos os `total` exercícios da lição
 * estão certos, a lição também fica concluída.
 *
 * Devolve o MESMO objeto se nada mudou (acertar de novo um exercício que já
 * estava certo não mexe nas datas), para quem chama poder pular o salvamento.
 */
export function registrarExercicio(
  progresso: Progresso,
  trilha: string,
  licao: string,
  indice: number,
  total: number,
  agora: string = new Date().toISOString(),
): Progresso {
  const chave = chaveDoExercicio(trilha, licao, indice);
  const exerciciosConcluidos = progresso.exerciciosConcluidos[chave]
    ? progresso.exerciciosConcluidos
    : { ...progresso.exerciciosConcluidos, [chave]: agora };

  const todos = Array.from({ length: total }, (_, i) => i).every((i) =>
    Boolean(exerciciosConcluidos[chaveDoExercicio(trilha, licao, i)]),
  );
  const chaveDaLicaoAtual = chaveDaLicao(trilha, licao);
  const concluidas =
    todos && !progresso.concluidas[chaveDaLicaoAtual]
      ? { ...progresso.concluidas, [chaveDaLicaoAtual]: agora }
      : progresso.concluidas;

  if (exerciciosConcluidos === progresso.exerciciosConcluidos && concluidas === progresso.concluidas) {
    return progresso;
  }
  return { ...progresso, concluidas, exerciciosConcluidos };
}
