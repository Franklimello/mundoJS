import { javascriptLanguage } from '@codemirror/lang-javascript';
import { highlightCode, tagHighlighter, tags as t } from '@lezer/highlight';
import type { ReactNode } from 'react';

/**
 * Código de exemplo com as mesmas cores do editor, pintado no servidor: a
 * lição chega pronta no navegador, sem JavaScript para colorir.
 */
const destacador = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword], class: 'tok-palavra' },
  { tag: [t.string, t.special(t.string), t.regexp], class: 'tok-texto' },
  { tag: [t.number, t.bool, t.null], class: 'tok-valor' },
  { tag: [t.comment, t.lineComment, t.blockComment], class: 'tok-comentario' },
]);

export function CodigoDestacado({ codigo }: { codigo: string }) {
  const filhos: ReactNode[] = [];
  let chave = 0;
  highlightCode(
    codigo,
    javascriptLanguage.parser.parse(codigo),
    destacador,
    (texto, classes) => {
      filhos.push(
        classes ? (
          <span key={chave++} className={classes}>
            {texto}
          </span>
        ) : (
          texto
        ),
      );
    },
    () => {
      filhos.push('\n');
    },
  );
  return <>{filhos}</>;
}
