import type { Metadata } from 'next';
import Link from 'next/link';
import { PlaygroundSql } from '@/components/PlaygroundSql';

export const metadata: Metadata = {
  title: 'Console SQL Interativo · SQLite WebAssembly · MundoJS',
  alternates: { canonical: '/sql' },
  description:
    'Execute consultas SQL de verdade diretamente no navegador com SQLite via WebAssembly. Banco de dados relacional com 6 tabelas populadas, JOINs, agregações e suporte a DML.',
};

export default function PaginaSql() {
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
