import type { Metadata } from 'next';
import Link from 'next/link';
import { ConteudoPro } from '@/components/ConteudoPro';
import { PlaygroundSql } from '@/components/PlaygroundSql';
import { temProAtual } from '@/servidor/acesso-conteudo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Console SQL Interativo · SQLite WebAssembly · MundoJS',
  alternates: { canonical: '/sql' },
  description:
    'Execute consultas SQL de verdade diretamente no navegador com SQLite via WebAssembly. Banco de dados relacional com 6 tabelas populadas, JOINs, agregações e suporte a DML.',
  robots: { index: false, follow: true },
};

export default async function PaginaSql() {
  if (!(await temProAtual())) {
    return (
      <ConteudoPro
        titulo="Console SQL Interativo (SQLite Real)"
        descricao="Execute consultas SQL reais contra um banco SQLite em memória via WebAssembly com 6 tabelas relacionais completas no Pro."
      />
    );
  }

  return (
    <div className="pagina secao">
      <p className="migalhas">
        <Link href="/">Início</Link>
        <span aria-hidden="true"> · </span>
        <Link href="/documentacao">Documentação</Link>
        <span aria-hidden="true"> · </span>
        <Link href="/documentacao/sql">SQL</Link>
        <span aria-hidden="true"> · </span>
        <span>Console Interativo</span>
      </p>

      <h1 className="titulo-de-pagina">Console SQL Interativo</h1>
      <p className="secao-apoio">
        Execute consultas SQL de verdade contra um banco <strong>SQLite em memória via WebAssembly</strong>. Explore 6
        tabelas relacionais com dados reais, teste cláusulas <code>SELECT</code>, <code>WHERE</code>, <code>JOIN</code>,{' '}
        <code>GROUP BY</code> e até comandos <code>INSERT</code> ou <code>UPDATE</code> diretamente no navegador.
      </p>

      <div className="sql-pagina-conteudo">
        <PlaygroundSql />
      </div>
    </div>
  );
}
