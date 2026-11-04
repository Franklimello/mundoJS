'use client';

import { useEffect, useRef } from 'react';
import { registrarEvento } from '@/estudo/eventos';
import { identificarCanal, type PaginaEntrada } from '@/estudo/origem';

export function MedirVisita({ pagina = 'inicio' }: { pagina?: PaginaEntrada }) {
  const evento = useRef<{ pagina: PaginaEntrada; id: string } | null>(null);
  useEffect(() => {
    if (evento.current?.pagina !== pagina) evento.current = { pagina, id: crypto.randomUUID() };
    registrarEvento(
      {
        tipo: 'visita',
        pagina,
        canal: identificarCanal(window.location.search, document.referrer, window.location.hostname),
      },
      evento.current.id,
    );
  }, [pagina]);
  return null;
}
