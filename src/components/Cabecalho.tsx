'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ContaNavegacao } from './ContaNavegacao';

const LINKS = [
  { href: '/trilhas', texto: 'Trilhas' },
  { href: '/projetos', texto: 'Projetos' },
  { href: '/rascunho', texto: 'Rascunho' },
  { href: '/planos', texto: 'Planos' },
] as const;

export function Cabecalho() {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const cabecalho = useRef<HTMLElement>(null);
  const botaoMenu = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuAberto) return;
    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return;
      setMenuAberto(false);
      botaoMenu.current?.focus();
    }
    function fecharAoSair(evento: PointerEvent) {
      if (evento.target instanceof Node && !cabecalho.current?.contains(evento.target)) setMenuAberto(false);
    }
    document.addEventListener('keydown', fecharComEscape);
    document.addEventListener('pointerdown', fecharAoSair);
    return () => {
      document.removeEventListener('keydown', fecharComEscape);
      document.removeEventListener('pointerdown', fecharAoSair);
    };
  }, [menuAberto]);

  return (
    <header className="cabecalho" ref={cabecalho}>
      <div className="pagina cabecalho-interno">
        <Link href="/" className="marca" aria-label="MundoJS, página inicial" onClick={() => setMenuAberto(false)}>
          <Image
            src="/mundojs-logo.jpeg"
            alt="MundoJS — o seu universo JavaScript"
            width={1376}
            height={768}
            sizes="(max-width: 600px) 210px, 340px"
            preload
            className="marca-logo"
          />
        </Link>
        <button
          ref={botaoMenu}
          type="button"
          className="menu-mobile"
          aria-label={menuAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={menuAberto}
          aria-controls="navegacao-principal"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuAberto ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        <nav
          id="navegacao-principal"
          className="navegacao-principal"
          aria-label="Principal"
          data-aberto={menuAberto}
          onClick={(evento) => {
            if (evento.target instanceof Element && evento.target.closest('a')) setMenuAberto(false);
          }}
        >
          <ul className="nav">
            {LINKS.map((link) => {
              const ativo = caminho === link.href || caminho.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={ativo ? 'page' : undefined}>
                    {link.texto}
                  </Link>
                </li>
              );
            })}
            <li>
              <ContaNavegacao />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
