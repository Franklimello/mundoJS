import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  pathname: vi.fn(),
  session: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: mocks.pathname,
}));

vi.mock('@/conta/cliente', () => ({
  contaCliente: {
    useSession: mocks.session,
  },
}));

vi.mock('@/conta/vincular', () => ({
  incorporarProgresso: vi.fn().mockResolvedValue({ incorporados: 0 }),
}));

import { Cabecalho } from './Cabecalho';

describe('Componente Cabecalho', () => {
  beforeEach(() => {
    mocks.pathname.mockReturnValue('/');
    mocks.session.mockReturnValue({ data: null, isPending: false, error: null });
  });

  it('renderiza os links principais e a marca MundoJS', () => {
    const elemento = <Cabecalho />;
    const html = renderToStaticMarkup(elemento);

    // Marca
    expect(html).toContain('Mundo');
    expect(html).toContain('JS');
    expect(html).toContain('O seu universo JavaScript');

    // Links principais
    expect(html).toContain('Trilhas');
    expect(html).toContain('href="/trilhas"');
    expect(html).toContain('Projetos');
    expect(html).toContain('href="/projetos"');
  });

  it('renderiza o menu suspenso de Prática com CodeLab, SQL e Rascunho', () => {
    const elemento = <Cabecalho />;
    const html = renderToStaticMarkup(elemento);

    // Gatilho do dropdown
    expect(html).toContain('Prática');
    expect(html).toContain('nav-dropdown-gatilho');

    // Itens de prática
    expect(html).toContain('CodeLab');
    expect(html).toContain('href="/codelab"');
    expect(html).toContain('Novo');

    expect(html).toContain('SQL');
    expect(html).toContain('href="/sql"');

    expect(html).toContain('Rascunho');
    expect(html).toContain('href="/rascunho"');
  });

  it('renderiza os links secundários e botão de conta', () => {
    const elemento = <Cabecalho />;
    const html = renderToStaticMarkup(elemento);

    expect(html).toContain('Documentação');
    expect(html).toContain('href="/documentacao"');
    expect(html).toContain('Planos');
    expect(html).toContain('href="/planos"');

    expect(html).toContain('Entrar');
    expect(html).toContain('href="/conta"');
  });

  it('destaca a aba Prática quando o usuário está no /codelab', () => {
    mocks.pathname.mockReturnValue('/codelab');
    const elemento = <Cabecalho />;
    const html = renderToStaticMarkup(elemento);

    // O gatilho de Prática deve estar marcado com aria-current="page"
    expect(html).toContain('nav-dropdown-gatilho" aria-haspopup="true" aria-expanded="false" aria-current="page"');
    expect(html).toContain('href="/codelab"');
    expect(html).toContain('aria-current="page"');
  });

  it('destaca a aba Prática quando o usuário está no /sql', () => {
    mocks.pathname.mockReturnValue('/sql');
    const elemento = <Cabecalho />;
    const html = renderToStaticMarkup(elemento);

    expect(html).toContain('nav-dropdown-gatilho" aria-haspopup="true" aria-expanded="false" aria-current="page"');
    expect(html).toContain('href="/sql"');
    expect(html).toContain('aria-current="page"');
  });
});
