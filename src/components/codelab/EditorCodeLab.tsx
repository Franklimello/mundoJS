'use client';

import { useEffect, useRef } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { sql } from '@codemirror/lang-sql';
import { bracketMatching, HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import {
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { LinguagemArquivo } from '@/codelab/tipos';

// Tema VS Code Dark+ fiel
const temaVsCodeDark = EditorView.theme(
  {
    '&': {
      color: '#d4d4d4',
      backgroundColor: '#1e1e1e',
      height: '100%',
      fontSize: '13.5px',
      fontFamily: "Consolas, Monaco, 'Courier New', 'Fira Code', var(--fonte-codigo, monospace)",
    },
    '&.cm-focused': {
      outline: 'none',
    },
    '.cm-scroller': {
      lineHeight: '1.55',
      fontFamily: 'inherit',
      overflow: 'auto',
    },
    '.cm-content': {
      padding: '0.5rem 0',
      caretColor: '#aeafad',
    },
    '.cm-line': {
      padding: '0 1rem 0 0.75rem',
    },
    '.cm-gutters': {
      backgroundColor: '#1e1e1e',
      color: '#858585',
      border: 'none',
      borderRight: '1px solid #2a2a2a',
      userSelect: 'none',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 0.75rem 0 0.85rem',
      minWidth: '2.5rem',
      textAlign: 'right',
    },
    '.cm-activeLine': {
      backgroundColor: '#282828',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#282828',
      color: '#c6c6c6',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#aeafad',
      borderLeftWidth: '2px',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: '#264f78 !important',
    },
    '.cm-matchingBracket': {
      backgroundColor: '#3b5170',
      outline: '1px solid #569cd6',
      color: '#ffffff !important',
    },
  },
  { dark: true },
);

// Destaques de sintaxe VS Code Dark+
const sintaxeVsCodeDark = HighlightStyle.define([
  {
    tag: [t.keyword, t.definitionKeyword, t.moduleKeyword],
    color: '#569cd6',
  },
  {
    tag: [t.controlKeyword],
    color: '#c586c0',
  },
  {
    tag: [t.operatorKeyword, t.operator],
    color: '#d4d4d4',
  },
  {
    tag: [t.string, t.special(t.string)],
    color: '#ce9178',
  },
  {
    tag: [t.number, t.integer],
    color: '#b5cea8',
  },
  {
    tag: [t.bool, t.null],
    color: '#569cd6',
  },
  {
    tag: [t.comment, t.lineComment, t.blockComment, t.docComment],
    color: '#6a9955',
    fontStyle: 'italic',
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: '#dcdcaa',
  },
  {
    tag: [t.typeName, t.className, t.standard(t.typeName)],
    color: '#4ec9b0',
  },
  {
    tag: [t.propertyName],
    color: '#9cdcfe',
  },
  {
    tag: [t.variableName],
    color: '#9cdcfe',
  },
  {
    tag: [t.punctuation, t.bracket],
    color: '#d4d4d4',
  },
  {
    tag: t.invalid,
    color: '#f44747',
  },
]);

export interface EditorCodeLabProps {
  codigo: string;
  linguagem: LinguagemArquivo;
  linhaDestaque?: number;
}

export function EditorCodeLab({ codigo, linguagem, linhaDestaque }: EditorCodeLabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let extensaoLinguagem = javascript({ typescript: true, jsx: true });
    if (linguagem === 'sql') {
      extensaoLinguagem = sql() as unknown as ReturnType<typeof javascript>;
    }

    const estado = EditorState.create({
      doc: codigo,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        bracketMatching(),
        extensaoLinguagem,
        temaVsCodeDark,
        syntaxHighlighting(sintaxeVsCodeDark),
        EditorState.readOnly.of(true),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state: estado,
      parent: containerRef.current,
    });

    viewRef.current = view;

    if (linhaDestaque && linhaDestaque > 0) {
      try {
        const linha = view.state.doc.line(Math.min(linhaDestaque, view.state.doc.lines));
        view.dispatch({
          selection: { anchor: linha.from },
          scrollIntoView: true,
        });
      } catch {
        // Ignora erro se a linha for inválida
      }
    }

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [codigo, linguagem, linhaDestaque]);

  return <div ref={containerRef} className="codelab-editor-view" />;
}
