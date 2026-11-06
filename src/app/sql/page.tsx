import type { Metadata } from 'next';
import Link from 'next/link';
import { ConteudoPro } from '@/components/ConteudoPro';
import { PlaygroundSql } from '@/components/PlaygroundSql';
import { temProAtual } from '@/servidor/acesso-conteudo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Console SQL e Desafios Práticos · SQLite WebAssembly · MundoJS',
  alternates: { canonical: '/sql' },
  description:
    'Resolva desafios práticos de SQL e execute consultas de verdade diretamente no navegador com SQLite via WebAssembly. Banco de dados relacional com 6 tabelas populadas e validação automática.',
  robots: { index: false, follow: true },
};

export default async function PaginaSql() {
  if (!(await temProAtual())) {
    return (
      <ConteudoPro
        titulo="Console SQL e Desafios Práticos (SQLite Real)"
        descricao="Resolva desafios práticos de SQL com validação automática e execute consultas reais contra um banco SQLite em memória via WebAssembly no Pro."
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
        <span>Console e Desafios</span>
      </p>

      <h1 className="titulo-de-pagina">Console SQL e Desafios Práticos</h1>
      <p className="secao-apoio">
        Resolva desafios práticos de negócios com validação instantânea ou execute consultas livres contra um banco{' '}
        <strong>SQLite em memória via WebAssembly</strong>. Explore 6 tabelas relacionais com dados reais, teste
        cláusulas <code>SELECT</code>, <code>WHERE</code>, <code>JOIN</code>, <code>GROUP BY</code> e comandos de
        modificação diretamente no navegador.
      </p>

      <div className="sql-pagina-conteudo">
        <PlaygroundSql />
      </div>
    </div>
  );
}
