import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import PaginaSql, { metadata } from './page';

// Mock do PlaygroundSql para teste unitário do componente de página
vi.mock('@/components/PlaygroundSql', () => ({
  PlaygroundSql: () => <div data-testid="playground-sql">Playground SQL Mock</div>,
}));

describe('página do console SQL interativo (/sql)', () => {
  it('contém metadados adequados para SEO e canonical', () => {
    expect(metadata.title).toContain('Console SQL Interativo');
    expect(metadata.alternates).toEqual({ canonical: '/sql' });
  });

  it('renderiza o cabeçalho, migalhas e o componente PlaygroundSql', () => {
    const html = renderToStaticMarkup(<PaginaSql />);
    expect(html).toContain('Console SQL Interativo');
    expect(html).toContain('Documentação');
    expect(html).toContain('/documentacao/sql');
    expect(html).toContain('SQLite');
    expect(html).toContain('data-testid="playground-sql"');
  });
});
