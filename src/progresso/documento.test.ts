import { describe, expect, it } from 'vitest';
import { guardarDocumento, lerDocumento } from './documento';

describe('rascunho com três arquivos', () => {
  it('preserva HTML, CSS e JavaScript no mesmo rascunho', () => {
    const documento = { html: '<p>Olá</p>', css: 'p { color: green; }' };
    expect(lerDocumento(guardarDocumento('const numero = 1;', documento))).toEqual({
      javascript: 'const numero = 1;',
      documento,
    });
  });
  it.each(['console.log(1)', 'null', '{}', '{"mundojsWeb":1,"html":2,"css":"","javascript":""}'])(
    'não confunde rascunho legado ou inválido com documento: %s',
    (valor) => {
      expect(lerDocumento(valor)).toBeNull();
    },
  );
});
