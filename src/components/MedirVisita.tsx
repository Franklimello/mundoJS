'use client';

import { useEffect, useRef } from 'react';
import { registrarEvento } from '@/estudo/eventos';

export function MedirVisita() {
  const id = useRef<string | null>(null);
  useEffect(() => {
    id.current ??= crypto.randomUUID();
    registrarEvento({ tipo: 'visita' }, id.current);
  }, []);
  return null;
}
