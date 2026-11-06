import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import PaginaCodeLab, { metadata } from './page';

describe('Página CodeLab (/codelab)', () => {
  it('contém metadados corretos de SEO e canonical', () => {
    expect(metadata.title).toContain('CodeLab');
    expect(metadata.alternates).toEqual({ canonical: '/codelab' });
    expect(metadata.description).toContain('VS Code');
  });

  it('renderiza a página com o container e layout do CodeLab', () => {
    const elemento = PaginaCodeLab();
    const html = renderToStaticMarkup(elemento);

    // Contêiner principal
    expect(html).toContain('codelab-page-wrapper');
    expect(html).toContain('codelab-app-container');

    // Barra de atividades (Explorer, Pesquisa, Projetos, Favoritos)
    expect(html).toContain('codelab-activity-bar');

    // Barra de status com VS Code Blue
    expect(html).toContain('codelab-status-bar');
    expect(html).toContain('API Node.js + Express + Sequelize');

    // Abas superiores e breadcrumbs
    expect(html).toContain('codelab-breadcrumbs');
    expect(html).toContain('UsuarioController.js');

    // Painel inferior com abas técnicas
    expect(html).toContain('codelab-bottom-panel');
    expect(html).toContain('Explicação');
    expect(html).toContain('Exemplos');
    expect(html).toContain('Relacionamentos');
    expect(html).toContain('Referências');
  });
});
