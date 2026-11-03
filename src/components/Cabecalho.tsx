'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ContaNavegacao } from './ContaNavegacao';

const LINKS = [
  { href: '/trilhas', texto: 'Trilhas' },
  { href: '/projetos', texto: 'Projetos' },
  { href: '/rascunho', texto: 'Rascunho' },
  { href: '/planos', texto: 'Planos' },
] as const;

export function Cabecalho() {
  const caminho = usePathname();
  return (
    <header className="cabecalho">
      <div className="pagina cabecalho-interno">
        <Link href="/" className="marca" aria-label="MundoJS, página inicial">
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
        <nav aria-label="Principal">
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
