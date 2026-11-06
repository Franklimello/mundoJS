'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiBookOpen,
  FiChevronDown,
  FiCode,
  FiCreditCard,
  FiDatabase,
  FiFileText,
  FiFolder,
  FiLayers,
  FiMenu,
  FiTerminal,
  FiX,
} from 'react-icons/fi';
import { ContaNavegacao } from './ContaNavegacao';

import type { IconType } from 'react-icons';

const LINKS_PRINCIPAIS = [
  { href: '/trilhas', texto: 'Trilhas', icone: FiBookOpen },
  { href: '/projetos', texto: 'Projetos', icone: FiFolder },
] as const;

interface LinkPratica {
  href: string;
  texto: string;
  descricao: string;
  icone: IconType;
  destaque?: string;
}

const LINKS_PRATICA: readonly LinkPratica[] = [
  {
    href: '/codelab',
    texto: 'CodeLab',
    descricao: 'Projetos reais e arquiteturas inspirados no VS Code',
    icone: FiTerminal,
    destaque: 'Novo',
  },
  {
    href: '/sql',
    texto: 'SQL',
    descricao: 'Console SQLite interativo e desafios práticos',
    icone: FiDatabase,
  },
  {
    href: '/rascunho',
    texto: 'Rascunho',
    descricao: 'Playground livre para testar código JavaScript',
    icone: FiCode,
  },
];

const LINKS_SECUNDARIOS = [
  { href: '/documentacao', texto: 'Documentação', icone: FiFileText },
  { href: '/planos', texto: 'Planos', icone: FiCreditCard },
] as const;

export function Cabecalho() {
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPraticaAberto, setMenuPraticaAberto] = useState(false);
  const cabecalho = useRef<HTMLElement>(null);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const dropdownPraticaRef = useRef<HTMLLIElement>(null);

  const estaNaPratica = caminho.startsWith('/codelab') || caminho.startsWith('/sql') || caminho.startsWith('/rascunho');

  useEffect(() => {
    if (!menuAberto && !menuPraticaAberto) return;

    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key !== 'Escape') return;
      if (menuPraticaAberto) {
        setMenuPraticaAberto(false);
        return;
      }
      if (menuAberto) {
        setMenuAberto(false);
        botaoMenu.current?.focus();
      }
    }

    function fecharAoSair(evento: PointerEvent) {
      if (evento.target instanceof Node) {
        if (!cabecalho.current?.contains(evento.target)) {
          setMenuAberto(false);
        }
        if (!dropdownPraticaRef.current?.contains(evento.target)) {
          setMenuPraticaAberto(false);
        }
      }
    }

    document.addEventListener('keydown', fecharComEscape);
    document.addEventListener('pointerdown', fecharAoSair);
    return () => {
      document.removeEventListener('keydown', fecharComEscape);
      document.removeEventListener('pointerdown', fecharAoSair);
    };
  }, [menuAberto, menuPraticaAberto]);

  return (
    <header className="cabecalho" ref={cabecalho}>
      <div className="pagina cabecalho-interno">
        <Link
          href="/"
          className="marca"
          aria-label="MundoJS, página inicial"
          onClick={() => {
            setMenuAberto(false);
            setMenuPraticaAberto(false);
          }}
        >
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
            if (evento.target instanceof Element && evento.target.closest('a')) {
              setMenuAberto(false);
              setMenuPraticaAberto(false);
            }
          }}
        >
          <ul className="nav">
            {/* Links principais */}
            {LINKS_PRINCIPAIS.map((link) => {
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

            {/* Menu suspenso agrupado: Prática (CodeLab, SQL, Rascunho) */}
            <li
              ref={dropdownPraticaRef}
              className="nav-dropdown"
              onMouseEnter={() => setMenuPraticaAberto(true)}
              onMouseLeave={() => setMenuPraticaAberto(false)}
            >
              <button
                type="button"
                className="nav-dropdown-gatilho"
                aria-haspopup="true"
                aria-expanded={menuPraticaAberto}
                aria-current={estaNaPratica ? 'page' : undefined}
                onClick={() => setMenuPraticaAberto((prev) => !prev)}
              >
                <FiLayers size={17} aria-hidden="true" focusable="false" />
                <span>Prática</span>
                <FiChevronDown size={14} className="nav-dropdown-chevron" aria-hidden="true" focusable="false" />
              </button>

              <div className="nav-dropdown-mobile-secao">Prática & Ambientes</div>

              <ul
                className={`nav-dropdown-menu ${menuPraticaAberto ? 'aberto' : ''}`}
                role="menu"
                aria-label="Ambientes de prática"
              >
                {LINKS_PRATICA.map((item) => {
                  const ativo = caminho === item.href || caminho.startsWith(`${item.href}/`);
                  const Icone = item.icone;
                  return (
                    <li key={item.href} className="nav-dropdown-item" role="none">
                      <Link
                        href={item.href}
                        role="menuitem"
                        aria-current={ativo ? 'page' : undefined}
                        onClick={() => {
                          setMenuPraticaAberto(false);
                          setMenuAberto(false);
                        }}
                      >
                        <span className="nav-dropdown-icone-wrapper">
                          <Icone size={16} aria-hidden="true" focusable="false" />
                        </span>
                        <span className="nav-dropdown-textos">
                          <span className="nav-dropdown-titulo-linha">
                            <span className="nav-dropdown-titulo">{item.texto}</span>
                            {item.destaque && <span className="nav-dropdown-badge">{item.destaque}</span>}
                          </span>
                          <span className="nav-dropdown-desc">{item.descricao}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Links secundários */}
            {LINKS_SECUNDARIOS.map((link) => {
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

            {/* Conta do usuário / Entrar */}
            <li>
              <ContaNavegacao />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
