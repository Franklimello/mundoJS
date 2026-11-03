'use client';

import { useEffect, useRef } from 'react';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab, temporarilySetTabFocusMode } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { EditorState, StateEffect, StateField } from '@codemirror/state';
import {
  Decoration,
  type DecorationSet,
  drawSelection,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

/**
 * O editor de código.
 *
 * O visual é o de uma folha pautada: cada linha de código tem a altura exata
 * de uma pauta (`--pauta`, definida em `globals.css`), então o texto assenta
 * sobre as linhas do papel. A margem rosa é a borda direita da coluna de
 * números. Isso só funciona porque a altura da linha é fixa — não mude o
 * `line-height` sem mudar `--pauta`.
 */

const definirLinhaComErro = StateEffect.define<number | null>();

/** Marca a linha do erro. Qualquer edição apaga a marca: ela já pode não valer mais. */
const campoDaLinhaComErro = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(marcas, transacao) {
    let novas = transacao.docChanged ? Decoration.none : marcas;
    for (const efeito of transacao.effects) {
      if (!efeito.is(definirLinhaComErro)) continue;
      const linha = efeito.value;
      novas =
        linha === null || linha < 1 || linha > transacao.state.doc.lines
          ? Decoration.none
          : Decoration.set([
              Decoration.line({ class: 'cm-linha-com-erro' }).range(transacao.state.doc.line(linha).from),
            ]);
    }
    return novas;
  },
  provide: (campo) => EditorView.decorations.from(campo),
});

const tema = EditorView.theme({
  '&': { color: 'var(--tinta)', backgroundColor: 'transparent', fontSize: '1rem' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--fonte-codigo)',
    lineHeight: 'var(--pauta)',
    // As pautas rolam junto com o texto, para as linhas do papel nunca se desencontrarem do código.
    backgroundImage:
      'repeating-linear-gradient(to bottom, transparent 0, transparent calc(var(--pauta) - 1px), var(--cor-pauta) calc(var(--pauta) - 1px), var(--cor-pauta) var(--pauta))',
    backgroundAttachment: 'local',
  },
  '.cm-content': {
    padding: '0',
    caretColor: 'var(--tinta)',
    minHeight: 'calc(var(--pauta) * var(--pautas-minimas, 8))',
  },
  '.cm-line': { padding: '0 0.75rem 0 0.9rem' },
  '.cm-gutters': {
    backgroundColor: 'var(--papel)',
    color: 'var(--lapis)',
    border: 'none',
    borderRight: '2px solid var(--cor-margem)',
    minHeight: 'calc(var(--pauta) * var(--pautas-minimas, 8))',
  },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.6rem 0 0.9rem', minWidth: '2.2rem' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--marca-texto) 45%, transparent)' },
  '.cm-activeLineGutter': { backgroundColor: 'var(--marca-texto)', color: 'var(--grafite)' },
  '.cm-linha-com-erro': {
    backgroundColor: 'color-mix(in srgb, var(--vermelha) 12%, transparent)',
    boxShadow: 'inset 3px 0 0 var(--vermelha)',
  },
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

const cores = HighlightStyle.define([
  {
    tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword],
    color: 'var(--tinta-forte)',
    fontWeight: '700',
  },
  { tag: [t.string, t.special(t.string), t.regexp], color: 'var(--verde)' },
  { tag: [t.number, t.bool, t.null], color: 'var(--ferrugem)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--lapis)', fontStyle: 'italic' },
  { tag: [t.punctuation, t.operator, t.bracket], color: 'var(--grafite)' },
  { tag: t.invalid, color: 'var(--vermelha)' },
]);

export interface EditorCodigoProps {
  valor: string;
  onChange: (valor: string) => void;
  onRodar: () => void;
  onConferir?: () => void;
  /** Linha do erro (a primeira é 1), ou `null`. */
  linhaComErro: number | null;
  /** Nome do campo para leitores de tela. */
  rotulo: string;
  /** Altura mínima, em pautas. */
  pautasMinimas?: number;
  aoMontar?: () => void;
}

export default function EditorCodigo({
  valor,
  onChange,
  onRodar,
  onConferir,
  linhaComErro,
  rotulo,
  pautasMinimas = 8,
  aoMontar,
}: EditorCodigoProps) {
  const raiz = useRef<HTMLDivElement>(null);
  const visao = useRef<EditorView | null>(null);
  // As funções mais recentes, sem recriar o editor a cada letra digitada.
  const acoes = useRef({ onChange, onRodar, onConferir });
  useEffect(() => {
    acoes.current = { onChange, onRodar, onConferir };
  });

  useEffect(() => {
    if (!raiz.current) return;
    const view = new EditorView({
      parent: raiz.current,
      state: EditorState.create({
        doc: valor,
        extensions: [
          keymap.of([
            {
              key: 'Mod-Enter',
              run: () => {
                acoes.current.onRodar();
                return true;
              },
            },
            {
              key: 'Mod-Shift-Enter',
              run: () => {
                acoes.current.onConferir?.();
                return true;
              },
            },
            // Esc e depois Tab deixa o teclado sair do editor, em vez de só recuar o código.
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
          javascript(),
          syntaxHighlighting(cores),
          EditorState.tabSize.of(2),
          indentUnit.of('  '),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({ 'aria-label': rotulo, spellcheck: 'false', autocapitalize: 'off' }),
          campoDaLinhaComErro,
          tema,
          EditorView.updateListener.of((atualizacao) => {
            if (atualizacao.docChanged) acoes.current.onChange(atualizacao.state.doc.toString());
          }),
        ],
      }),
    });
    visao.current = view;
    aoMontar?.();
    return () => {
      view.destroy();
      visao.current = null;
    };
    // O editor é criado uma vez; o texto novo entra pelo efeito logo abaixo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // O código mudou por fora (voltar ao início, rascunho salvo): atualiza o editor.
  useEffect(() => {
    const view = visao.current;
    if (!view) return;
    const atual = view.state.doc.toString();
    if (atual !== valor) view.dispatch({ changes: { from: 0, to: atual.length, insert: valor } });
  }, [valor]);

  useEffect(() => {
    visao.current?.dispatch({ effects: definirLinhaComErro.of(linhaComErro) });
  }, [linhaComErro]);

  return <div ref={raiz} className="editor" style={{ ['--pautas-minimas' as string]: pautasMinimas }} />;
}
