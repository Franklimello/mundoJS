import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { RespostaTutor, Tutor } from './Tutor';

describe('tutor na interface', () => {
  it('escapa HTML e mantém exemplos de código sem executá-los', () => {
    const html = renderToStaticMarkup(
      <RespostaTutor texto={'<script>alert(1)</script>\n```js\nconsole.log("oi");\n```'} />,
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<pre');
    expect(html).toContain('console.log');
  });
  it('oferece envio explícito com informação sobre compartilhamento e formulário acessível', () => {
    const html = renderToStaticMarkup(<Tutor contexto={{ livre: true }} codigo="" diagnostico="" />);
    expect(html).toContain('Pedir ajuda');
    expect(html).toContain('compartilhados com o Gemini');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('Qual é a sua dúvida?');
    expect(html).toContain('maxLength="2000"');
  });
});
