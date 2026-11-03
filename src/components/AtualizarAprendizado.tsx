'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FiRefreshCw } from 'react-icons/fi';

export function AtualizarAprendizado() {
  const router = useRouter();
  const [pendente, iniciar] = useTransition();
  return (
    <button
      type="button"
      className="botao botao-leve"
      disabled={pendente}
      onClick={() => iniciar(() => router.refresh())}
    >
      <FiRefreshCw aria-hidden="true" /> {pendente ? 'Atualizando…' : 'Atualizar progresso'}
    </button>
  );
}
