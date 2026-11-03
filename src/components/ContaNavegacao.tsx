'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { FiUser } from 'react-icons/fi';
import { contaCliente } from '@/conta/cliente';
import { incorporarProgresso } from '@/conta/vincular';

export function ContaNavegacao() {
  const { data, isPending, error } = contaCliente.useSession();
  const caminho = usePathname();
  const anterior = useRef<string | null | undefined>(undefined);
  const usuario = data?.user.id ?? null;
  useEffect(() => {
    if (isPending || error) return;
    const mudou = anterior.current !== undefined && anterior.current !== usuario;
    anterior.current = usuario;
    if (caminho.startsWith('/conta')) return;
    if (usuario) {
      void incorporarProgresso(usuario)
        .then((resultado) => {
          if (mudou || resultado.incorporados) window.location.reload();
        })
        .catch(() => {
          if (mudou) window.location.replace('/conta');
        });
    } else if (mudou) window.location.reload();
  }, [usuario, isPending, error, caminho]);
  return (
    <Link
      href={data ? '/conta/aprendizado' : '/conta'}
      aria-current={caminho.startsWith('/conta') ? 'page' : undefined}
    >
      <FiUser size={17} aria-hidden="true" focusable="false" />
      {data ? 'Minha conta' : 'Entrar'}
    </Link>
  );
}
