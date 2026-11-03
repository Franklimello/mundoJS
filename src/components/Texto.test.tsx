import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Texto } from './Texto';

const html = (texto: string) => renderToStaticMarkup(<Texto>{texto}</Texto>);

describe('texto das lições', () => {
  it('formata código, negrito e itálico no meio da frase', () => {
    expect(html('Use `const` ou **let** em uma *string*.')).toBe(
      'Use <code>const</code> ou <strong>let</strong> em uma <em>string</em>.',
    );
  });

  it('um asterisco dentro de código não vira itálico', () => {
    expect(html('Multiplique com `*` e divida com `/`, ou use `a * b`.')).toBe(
      'Multiplique com <code>*</code> e divida com <code>/</code>, ou use <code>a * b</code>.',
    );
  });

  it('código com ${ } e crases de texto fica inteiro', () => {
    expect(html('Dentro, `${ }` encaixa um valor.')).toBe('Dentro, <code>${ }</code> encaixa um valor.');
  });

  it('texto puro, com acento e pontuação, passa sem mudança', () => {
    expect(html('Olá, mundo! Aprenda “JavaScript” — passo a passo.')).toBe(
      'Olá, mundo! Aprenda “JavaScript” — passo a passo.',
    );
  });

  it('não deixa HTML do texto virar HTML da página', () => {
    expect(html('Cuidado com `<script>alert(1)</script>` e <b>negrito</b>.')).toBe(
      'Cuidado com <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> e &lt;b&gt;negrito&lt;/b&gt;.',
    );
  });
});
