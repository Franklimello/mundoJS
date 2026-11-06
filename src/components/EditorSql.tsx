'use client';

import { useEffect, useRef } from 'react';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab, temporarilySetTabFocusMode } from '@codemirror/commands';
import { SQLite, sql } from '@codemirror/lang-sql';
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { Annotation, EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

const textoAtualizadoDeFora = Annotation.define<boolean>();

const temaSql = EditorView.theme({
  '&': {
    color: 'var(--tinta)',
    backgroundColor: 'transparent',
    fontSize: 'var(--fonte-editor, 1rem)',
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--fonte-codigo)',
    lineHeight: 'var(--pauta)',
    backgroundImage:
      'repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--pauta) - 1px), var(--cor-pauta) calc(var(--pauta) - 1px), var(--cor-pauta) var(--pauta))',
    backgroundAttachment: 'local',
  },
  '.cm-content': {
    padding: '0',
    caretColor: 'var(--tinta)',
    minHeight: 'calc(var(--pauta) * 6)',
  },
  '.cm-line': { padding: '0 0.75rem 0 0.9rem' },
  '.cm-gutters': {
    backgroundColor: 'var(--papel)',
    color: 'var(--lapis)',
    border: 'none',
    borderRight: '2px solid var(--cor-margem)',
    minHeight: 'calc(var(--pauta) * 6)',
  },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.6rem 0 0.9rem', minWidth: '2.2rem' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--marca-texto) 45%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--marca-texto)', color: 'var(--grafite)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--tinta)', borderLeftWidth: '2px' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: 'color-mix(in srgb, var(--tinta) 22%, transparent)',
  },
  '.cm-matchingBracket': { backgroundColor: 'var(--marca-texto)', outline: '1px solid var(--lapis)' },
  '.cm-tooltip': {
    border: '1px solid var(--cor-traco)',
    backgroundColor: 'var(--papel)',
    borderRadius: '4px',
    boxShadow: '3px 3px 0 var(--cor-sombra-folha)',
    fontFamily: 'var(--fonte-codigo)',
  },
  '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
    backgroundColor: 'var(--marca-texto)',
    color: 'var(--grafite)',
  },
});

const coresSql = HighlightStyle.define([
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword],
    color: 'var(--tinta-forte)',
    fontWeight: '700',
  },
  { tag: [t.string, t.special(t.string)], color: 'var(--verde)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--ferrugem)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--lapis)', fontStyle: 'italic' },
  { tag: [t.punctuation, t.operator, t.bracket], color: 'var(--grafite)' },
  { tag: t.invalid, color: 'var(--vermelha)' },
]);

export interface EditorSqlProps {
  valor: string;
  onChange: (valor: string) => void;
  onExecutar: () => void;
  esquemaColunas?: Record<string, string[]>;
  rotulo?: string;
}

export function EditorSql({
  valor,
  onChange,
  onExecutar,
  esquemaColunas,
  rotulo = 'Editor de consulta SQL',
}: EditorSqlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visaoRef = useRef<EditorView | null>(null);
  const acoesRef = useRef({ onChange, onExecutar });

  useEffect(() => {
    acoesRef.current = { onChange, onExecutar };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const extensaoSql = sql({
      dialect: SQLite,
      schema: esquemaColunas,
    });

    const view = new EditorView({
      parent: containerRef.current,
      state: EditorState.create({
        doc: valor,
        extensions: [
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                acoesRef.current.onExecutar();
                return true;
              },
            },
            {
              key: 'Escape',
              run: (v) => {
                temporarilySetTabFocusMode(v);
                return false;
              },
            },
            ...closeBracketsKeymap,
            ...completionKeymap,
            ...historyKeymap,
            ...defaultKeymap,
            indentWithTab,
          ]),
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ icons: false }),
          extensaoSql,
          syntaxHighlighting(coresSql),
          EditorState.tabSize.of(2),
          indentUnit.of('  '),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-label': rotulo,
            spellcheck: 'false',
            autocapitalize: 'off',
            autocorrect: 'off',
            autocomplete: 'off',
          }),
          temaSql,
          EditorView.updateListener.of((atualizacao) => {
            if (
              atualizacao.docChanged &&
              !atualizacao.transactions.every((tr) => tr.annotation(textoAtualizadoDeFora))
            ) {
              acoesRef.current.onChange(atualizacao.state.doc.toString());
            }
          }),
        ],
      }),
    });

    visaoRef.current = view;

    return () => {
      view.destroy();
      visaoRef.current = null;
    };
    // Inicializa uma vez; o texto atualiza via efeito externo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sincroniza quando o valor muda externamente (ex: clique em exemplo ou limpar)
  useEffect(() => {
    const view = visaoRef.current;
    if (!view) return;
    const atual = view.state.doc.toString();
    if (atual !== valor) {
      view.dispatch({
        changes: { from: 0, to: atual.length, insert: valor },
        annotations: textoAtualizadoDeFora.of(true),
      });
    }
  }, [valor]);

  return <div ref={containerRef} className="editor-sql-container" />;
}
