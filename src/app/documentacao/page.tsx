import type { Metadata } from 'next';
import Link from 'next/link';
import { contarMetodos, topicos } from '@/documentacao';

export const metadata: Metadata = {
  title: 'Documentação',
  description:
    'Referência rápida de JavaScript em português, com exemplos que rodam: strings, trim, toUpperCase, slice, split e mais.',
  alternates: { canonical: '/documentacao' },
};

export default function Documentacao() {
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Documentação</h1>
      <p className="secao-apoio">
        Uma referência rápida para consultar enquanto estuda. Cada método tem a sintaxe, o que ele devolve e um exemplo
        com o resultado.
      </p>

      <div className="doc-sql-banner">
        <div className="doc-sql-banner-conteudo">
          <span className="doc-sql-banner-icone" aria-hidden="true">
            ⚡
          </span>
          <div>
            <strong>Console SQL Interativo</strong>
            <p>
              Pratique consultas reais em um banco SQLite em memória via WebAssembly, com 6 tabelas relacionais
              populadas e dados de exemplo.
            </p>
          </div>
        </div>
        <Link href="/sql" className="botao botao-primario">
          Abrir Console SQL →
        </Link>
      </div>

      <ul className="doc-topicos">
        {topicos.map((topico) => (
          <li key={topico.slug}>
            <Link href={`/documentacao/${topico.slug}`} className="doc-topico">
              <h2>{topico.titulo}</h2>
              <p>{topico.resumo}</p>
              <span className="doc-topico-contagem">{contarMetodos(topico)} métodos</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
