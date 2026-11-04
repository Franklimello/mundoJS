'use client';

import { type RefObject, useEffect } from 'react';

/** Mantém o editor e o cursor montados ao ocupar a área visível do navegador. */
export function useModoFoco(raiz: RefObject<HTMLElement | null>, ativo: boolean, fechar: () => void) {
  useEffect(() => {
    const elemento = raiz.current;
    if (!ativo || !elemento) return;
    const focoAnterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const isolados: { elemento: HTMLElement; inert: boolean }[] = [];
    let ramo: HTMLElement = elemento;
    while (ramo.parentElement) {
      for (const irmao of ramo.parentElement.children) {
        if (irmao === ramo || !(irmao instanceof HTMLElement)) continue;
        isolados.push({ elemento: irmao, inert: irmao.inert });
        irmao.setAttribute('inert', '');
      }
      ramo = ramo.parentElement;
      if (ramo === document.body) break;
    }
    function ajustar() {
      const viewport = window.visualViewport;
      elemento!.style.setProperty('--altura-foco', `${viewport?.height ?? window.innerHeight}px`);
      elemento!.style.setProperty('--topo-foco', `${viewport?.offsetTop ?? 0}px`);
    }
    function tecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        evento.stopPropagation();
        fechar();
      }
      if (evento.key !== 'Tab') return;
      const controles = [
        ...elemento!.querySelectorAll<HTMLElement>(
          'button:not(:disabled), select, textarea, input, a[href], [tabindex="0"], [contenteditable="true"]',
        ),
      ].filter((item) => item.getClientRects().length > 0);
      const primeiro = controles[0];
      const ultimo = controles.at(-1);
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo?.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro?.focus();
      }
    }
    ajustar();
    elemento.querySelector<HTMLElement>('.folha-foco-sair')?.focus({ preventScroll: true });
    window.visualViewport?.addEventListener('resize', ajustar);
    window.visualViewport?.addEventListener('scroll', ajustar);
    window.addEventListener('resize', ajustar);
    elemento.addEventListener('keydown', tecla, true);
    return () => {
      document.body.style.overflow = overflowAnterior;
      for (const item of isolados) item.elemento.toggleAttribute('inert', item.inert);
      window.visualViewport?.removeEventListener('resize', ajustar);
      window.visualViewport?.removeEventListener('scroll', ajustar);
      window.removeEventListener('resize', ajustar);
      elemento.removeEventListener('keydown', tecla, true);
      elemento.style.removeProperty('--altura-foco');
      elemento.style.removeProperty('--topo-foco');
      if (focoAnterior?.isConnected) focoAnterior.focus({ preventScroll: true });
    };
  }, [raiz, ativo, fechar]);
}
