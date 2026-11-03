import { prepararSessao } from '@/progresso/api';
import type { EventoEstudo } from './tipos';

let fila: Promise<void> = Promise.resolve();

/** Dá aos eventos recentes a chance de chegar antes da consulta adaptativa, sem travar a ajuda. */
export async function aguardarEventos(): Promise<void> {
  let espera: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      fila,
      new Promise<void>((resolve) => {
        espera = setTimeout(resolve, 1500);
      }),
    ]);
  } finally {
    clearTimeout(espera);
  }
}

/** A medição nunca impede o aluno de estudar e não envia textos livres. */
export function registrarEvento(evento: Omit<EventoEstudo, 'id'>, id = crypto.randomUUID()): void {
  fila = fila
    .catch(() => {})
    .then(async () => {
      await prepararSessao();
      await fetch('/api/estudo/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...evento, id }),
        keepalive: true,
        signal: AbortSignal.timeout(5000),
      });
    })
    .catch(() => {});
}
