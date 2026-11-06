import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConteudoPro } from '@/components/ConteudoPro';

const mocks = vi.hoisted(() => ({ pro: vi.fn() }));
vi.mock('@/servidor/acesso-conteudo', () => ({ temProAtual: mocks.pro }));
vi.mock('@/components/PlaygroundSql', () => ({
  PlaygroundSql: () => <div data-testid="playground-sql">Playground SQL Mock</div>,
}));

import PaginaSql, { metadata } from './page';

beforeEach(() => {
  mocks.pro.mockReset().mockResolvedValue(false);
});

describe('página do console SQL interativo (/sql)', () => {
  it('contém metadados adequados para SEO e canonical', () => {
    expect(metadata.title).toContain('Console SQL Interativo');
    expect(metadata.alternates).toEqual({ canonical: '/sql' });
  });

  it('exibe tela de bloqueio Pro (ConteudoPro) para usuários não assinantes', async () => {
    const elemento = await PaginaSql();
    expect(elemento.type).toBe(ConteudoPro);
    const html = renderToStaticMarkup(elemento);
    expect(html).toContain('Incluído no MundoJS Pro');
    expect(html).toContain('Console SQL Interativo');
    expect(html).not.toContain('data-testid="playground-sql"');
  });

  it('libera o console SQL com SQLite para assinantes do Pro', async () => {
    mocks.pro.mockResolvedValue(true);
    const elemento = await PaginaSql();
    expect(elemento.type).not.toBe(ConteudoPro);
    const html = renderToStaticMarkup(elemento);
    expect(html).toContain('Console SQL Interativo');
    expect(html).toContain('Documentação');
    expect(html).toContain('/documentacao/sql');
    expect(html).toContain('SQLite');
    expect(html).toContain('data-testid="playground-sql"');
  });
});
