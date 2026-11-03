import { describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { montarDocumento } from './documento';
import { documentoDoIframe } from './sandbox';

describe('documento da prévia web', () => {
  it('mantém controles de formulário e classes, mas remove conteúdo ativo do HTML', async () => {
    const janela = new Window();
    try {
      montarDocumento(janela.document as unknown as Document, {
        html: '<script>while(true){}</script><iframe src="https://example.com"></iframe><form action="https://example.com"><label for="nome">Nome</label><input id="nome" onfocus="alert(1)"><button type="submit" class="acao">Enviar</button></form><a href="javascript:alert(1)">Link</a>',
        css: 'button { color: green; }',
      });
      expect(janela.document.querySelectorAll('script, iframe, a')).toHaveLength(0);
      expect(janela.document.querySelector('form')?.hasAttribute('action')).toBe(false);
      expect(janela.document.querySelector('input')?.hasAttribute('onfocus')).toBe(false);
      expect(janela.document.querySelector('label')?.getAttribute('for')).toBe('nome');
      expect(janela.document.querySelector('button')?.className).toBe('acao');
      expect(janela.document.querySelector('style')?.textContent).toContain('button { color: green; }');
    } finally {
      await janela.happyDOM.close();
    }
  });
  it('trata CSS como texto, sem permitir fechar a tag e inserir um script', async () => {
    const janela = new Window();
    try {
      const css = '</style><script>alert(1)</script>';
      montarDocumento(janela.document as unknown as Document, { html: '<p>Teste</p>', css });
      expect(janela.document.querySelector('style')?.textContent).toContain(css);
      expect(janela.document.querySelector('script')).toBeNull();
      expect(documentoDoIframe()).toContain("default-src 'none'");
      expect(documentoDoIframe()).toContain("form-action 'none'");
    } finally {
      await janela.happyDOM.close();
    }
  });
});
