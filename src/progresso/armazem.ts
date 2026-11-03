'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { repositorioServidor } from './repositorio-servidor';
import {
  licaoConcluida,
  chaveDoExercicio,
  PROGRESSO_VAZIO,
  registrarExercicio,
  type Progresso,
  type RepositorioProgresso,
} from './tipos';

/**
 * O progresso em memória, compartilhado por toda a página.
 *
 * `useSyncExternalStore` mantém o servidor e o primeiro desenho do navegador
 * iguais (progresso vazio) e só depois mostra o que foi salvo — sem erro de
 * hidratação.
 */

interface Estado {
  /** Falso até o repositório responder; as telas esperam para não piscar "0 de 9". */
  pronto: boolean;
  progresso: Progresso;
  erro?: string;
}

const ESTADO_DO_SERVIDOR: Estado = { pronto: false, progresso: PROGRESSO_VAZIO };

let estado: Estado = ESTADO_DO_SERVIDOR;
let repositorio: RepositorioProgresso = repositorioServidor;
let iniciado = false;
let pendente = false;
let sincronizacao: Promise<void> | undefined;
let identidade: string | undefined;
const ouvintes = new Set<() => void>();

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

export async function sincronizarProgresso(): Promise<void> {
  if (sincronizacao) return sincronizacao;
  sincronizacao = (async () => {
    try {
      const salvo = await repositorio.carregar();
      const novaIdentidade = repositorio.identidade?.();
      if (identidade && novaIdentidade && identidade !== novaIdentidade) {
        estado = ESTADO_DO_SERVIDOR;
        pendente = false;
      }
      identidade = novaIdentidade;
      estado = {
        pronto: true,
        progresso: {
          versao: 1,
          concluidas: { ...estado.progresso.concluidas, ...salvo.concluidas },
          exerciciosConcluidos: { ...estado.progresso.exerciciosConcluidos, ...salvo.exerciciosConcluidos },
        },
      };
      while (pendente) {
        const progresso = estado.progresso;
        await repositorio.salvar(progresso);
        pendente = progresso !== estado.progresso;
      }
    } catch {
      estado = { ...estado, erro: 'Não foi possível sincronizar seu progresso. Tente novamente antes de sair.' };
    } finally {
      avisar();
    }
  })();
  await sincronizacao;
  sincronizacao = undefined;
}

function iniciar() {
  if (iniciado) return;
  iniciado = true;
  void sincronizarProgresso();
  window.addEventListener('focus', () => void sincronizarProgresso());
  window.addEventListener('online', () => void sincronizarProgresso());
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  iniciar();
  return () => {
    ouvintes.delete(ouvinte);
  };
}

const lerEstado = () => estado;
const lerEstadoDoServidor = () => ESTADO_DO_SERVIDOR;

/**
 * Marca um exercício como certo (e guarda). Quando é o último que faltava, a
 * lição inteira fica concluída. Acertar de novo não muda nenhuma data.
 */
export async function concluirExercicio(trilha: string, licao: string, indice: number, total: number): Promise<void> {
  const progresso = registrarExercicio(estado.progresso, trilha, licao, indice, total);
  if (progresso === estado.progresso) {
    if (pendente) await sincronizarProgresso();
    return;
  }
  estado = { pronto: true, progresso };
  pendente = true;
  avisar();
  await sincronizarProgresso();
}

/** Para o login: troca onde o progresso é guardado e recarrega a partir dele. */
export async function trocarRepositorio(novo: RepositorioProgresso): Promise<void> {
  repositorio = novo;
  estado = ESTADO_DO_SERVIDOR;
  identidade = undefined;
  pendente = false;
  await sincronizarProgresso();
}

export function useProgresso() {
  const atual = useSyncExternalStore(assinar, lerEstado, lerEstadoDoServidor);
  const concluida = useCallback(
    (trilha: string, licao: string, total: number) => licaoConcluida(atual.progresso, trilha, licao, total),
    [atual],
  );
  const quantasConcluidas = useCallback(
    (trilha: string, licoes: { slug: string; total: number }[]) =>
      licoes.filter((licao) => concluida(trilha, licao.slug, licao.total)).length,
    [concluida],
  );
  const exercicioConcluido = useCallback(
    (trilha: string, licao: string, indice: number) =>
      Boolean(atual.progresso.exerciciosConcluidos[chaveDoExercicio(trilha, licao, indice)]),
    [atual],
  );
  /** Quantos dos `total` exercícios da lição já estão certos. */
  const exerciciosFeitos = useCallback(
    (trilha: string, licao: string, total: number) =>
      Array.from({ length: total }, (_, i) => i).filter((i) => exercicioConcluido(trilha, licao, i)).length,
    [exercicioConcluido],
  );
  return { pronto: atual.pronto, erro: atual.erro, concluida, quantasConcluidas, exercicioConcluido, exerciciosFeitos };
}
