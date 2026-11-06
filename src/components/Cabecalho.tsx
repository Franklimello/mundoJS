'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FiBookOpen, FiCode, FiCreditCard, FiDatabase, FiFileText, FiFolder, FiMenu, FiX } from 'react-icons/fi';
import { ContaNavegacao } from './ContaNavegacao';

const LINKS = [
  { href: '/trilhas', texto: 'Trilhas', icone: FiBookOpen },
  { href: '/projetos', texto: 'Projetos', icone: FiFolder },
  { href: '/rascunho', texto: 'Rascunho', icone: FiCode },
  { href: '/sql', texto: 'SQL', icone: FiDatabase },
  { href: '/documentacao', texto: 'Documentação', icone: FiFileText },
  { href: '/planos', texto: 'Planos', icone: FiCreditCard },
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
          <span className="marca-simbolo" aria-hidden="true">
            <Image
              src="/mundojs-logo.jpeg"
              alt=""
              width={1376}
              height={768}
              sizes="150px"
              preload
              className="marca-logo"
            />
          </span>
          <span className="marca-identidade" aria-hidden="true">
            <span className="marca-nome">
              Mundo<span className="marca-js">JS</span>
            </span>
            <span className="marca-legenda">O seu universo JavaScript</span>
          </span>
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
          {menuAberto ? (
            <FiX size={24} aria-hidden="true" focusable="false" />
          ) : (
            <FiMenu size={24} aria-hidden="true" focusable="false" />
          )}
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
              const Icone = link.icone;
              return (
                <li key={link.href}>
                  <Link href={link.href} aria-current={ativo ? 'page' : undefined}>
                    <Icone size={17} aria-hidden="true" focusable="false" />
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
