'use client';

import { type Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
  hasNextSnippetField,
  nextSnippetField,
} from '@codemirror/autocomplete';
import {
  cursorCharLeft,
  cursorCharRight,
  defaultKeymap,
  history,
  historyKeymap,
  indentLess,
  indentMore,
  indentWithTab,
  insertNewlineAndIndent,
  redo,
  temporarilySetTabFocusMode,
  undo,
} from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { bracketMatching, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { EditorSelection, EditorState, StateEffect, StateField } from '@codemirror/state';
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
import { inserirAtalho } from '@/editor/inserir-atalho';
import type { ControlesEditor } from '@/editor/controles';
import { aplicarModelo, MODELOS_CODIGO } from '@/editor/modelos';

const SIMBOLOS = [
  { texto: '{ }', nome: 'Inserir chaves', abre: '{', fecha: '}' },
  { texto: '[ ]', nome: 'Inserir colchetes', abre: '[', fecha: ']' },
  { texto: '( )', nome: 'Inserir parênteses', abre: '(', fecha: ')' },
  { texto: '" "', nome: 'Inserir aspas duplas', abre: '"', fecha: '"' },
  { texto: "' '", nome: 'Inserir aspas simples', abre: "'", fecha: "'" },
  { texto: '` `', nome: 'Inserir crases', abre: '`', fecha: '`' },
  ...[
    ';',
    ',',
    '.',
    ':',
    '=',
    '===',
    '=>',
    '+',
    '-',
    '*',
    '/',
    '%',
    '!',
    '&&',
    '||',
    '<',
    '>',
    '?',
    '_',
    '}',
    ']',
    ')',
  ].map((texto) => ({ texto, nome: `Inserir ${texto}`, abre: texto, fecha: undefined })),
];

const ACOES_MOVEIS = [
  { texto: '←', nome: 'Mover cursor para a esquerda', comando: cursorCharLeft },
  { texto: '→', nome: 'Mover cursor para a direita', comando: cursorCharRight },
  { texto: 'Recuar', nome: 'Aumentar recuo da linha', comando: indentMore },
  { texto: 'Desrecuar', nome: 'Diminuir recuo da linha', comando: indentLess },
  { texto: 'Nova linha', nome: 'Inserir nova linha com recuo', comando: insertNewlineAndIndent },
  { texto: 'Desfazer', nome: 'Desfazer edição', comando: undo },
  { texto: 'Refazer', nome: 'Refazer edição', comando: redo },
];

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
  '&': { color: 'var(--tinta)', backgroundColor: 'transparent', fontSize: 'var(--fonte-editor, 1rem)' },
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
  controleRef?: Ref<ControlesEditor>;
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
  controleRef,
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
  const barra = useRef<HTMLDivElement>(null);
  const visao = useRef<EditorView | null>(null);
  const [modelos, setModelos] = useState(false);
  const [temCampos, setTemCampos] = useState(false);
  useImperativeHandle(
    controleRef,
    () => ({
      focar: () => visao.current?.focus(),
      irParaLinha: (numero) => {
        const view = visao.current;
        if (!view || !Number.isInteger(numero) || numero < 1 || numero > view.state.doc.lines) return;
        const linha = view.state.doc.line(numero);
        view.dispatch({
          selection: EditorSelection.cursor(linha.from),
          effects: EditorView.scrollIntoView(linha.from, { y: 'center' }),
        });
        view.focus();
      },
      inserirDados: (texto) => {
        const view = visao.current;
        if (!view || view.state.doc.toString().includes(texto.trim())) return;
        view.dispatch(
          inserirAtalho(view.state.update({ selection: EditorSelection.cursor(0) }).state, texto.trim() + '\n\n'),
        );
        view.focus();
      },
    }),
    [],
  );
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
          EditorState.allowMultipleSelections.of(true),
          indentUnit.of('  '),
          EditorView.lineWrapping,
          EditorView.scrollMargins.of(() => ({ top: barra.current?.offsetHeight ?? 0 })),
          EditorView.contentAttributes.of({
            'aria-label': rotulo,
            spellcheck: 'false',
            autocapitalize: 'off',
            autocorrect: 'off',
            autocomplete: 'off',
          }),
          campoDaLinhaComErro,
          tema,
          EditorView.updateListener.of((atualizacao) => {
            setTemCampos(hasNextSnippetField(atualizacao.state));
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

  function executarAtalho(acao: (view: EditorView) => void) {
    const view = visao.current;
    if (!view) return;
    view.focus();
    acao(view);
  }

  return (
    <div className="editor-com-atalhos" style={{ ['--pautas-minimas' as string]: pautasMinimas }}>
      <div ref={barra} className="editor-atalhos" role="group" aria-label="Atalhos de código para celular">
        <p className="editor-atalhos-ajuda">
          {modelos
            ? 'Escolha uma estrutura para preencher.'
            : temCampos
              ? 'Edite o texto selecionado e use Próximo campo.'
              : 'Atalhos de código · deslize as linhas para ver mais'}
        </p>
        <div
          className="editor-atalhos-linha"
          role="group"
          aria-label={modelos ? 'Modelos de JavaScript' : 'Símbolos de JavaScript'}
        >
          {modelos
            ? MODELOS_CODIGO.map((modelo) => (
                <button
                  key={modelo.nome}
                  type="button"
                  aria-label={`Inserir modelo de ${modelo.nome}`}
                  onPointerDown={(evento) => evento.preventDefault()}
                  onClick={() =>
                    executarAtalho((view) => {
                      aplicarModelo(view, modelo.codigo);
                      setModelos(false);
                    })
                  }
                >
                  {modelo.nome}
                </button>
              ))
            : SIMBOLOS.map(({ texto, nome, abre, fecha }) => (
                <button
                  key={texto}
                  type="button"
                  aria-label={nome}
                  title={nome}
                  onPointerDown={(evento) => evento.preventDefault()}
                  onClick={() => executarAtalho((view) => view.dispatch(inserirAtalho(view.state, abre, fecha)))}
                >
                  {texto}
                </button>
              ))}
        </div>
        <div className="editor-atalhos-acoes" role="group" aria-label="Edição e execução">
          <div className="editor-atalhos-linha">
            <button
              type="button"
              aria-pressed={modelos}
              onPointerDown={(evento) => evento.preventDefault()}
              onClick={() => setModelos(!modelos)}
            >
              {modelos ? 'Símbolos' : 'Modelos'}
            </button>
            {temCampos && (
              <button
                type="button"
                onPointerDown={(evento) => evento.preventDefault()}
                onClick={() =>
                  executarAtalho((view) => {
                    nextSnippetField(view);
                  })
                }
              >
                Próximo campo
              </button>
            )}
            {ACOES_MOVEIS.map(({ texto, nome, comando }) => (
              <button
                key={nome}
                type="button"
                aria-label={nome}
                title={nome}
                onPointerDown={(evento) => evento.preventDefault()}
                onClick={() =>
                  executarAtalho((view) => {
                    comando(view);
                  })
                }
              >
                {texto}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="editor-atalho-rodar"
            onPointerDown={(evento) => evento.preventDefault()}
            onClick={() => executarAtalho(() => acoes.current.onRodar())}
          >
            Rodar código
          </button>
        </div>
      </div>
      <div ref={raiz} className="editor" />
    </div>
  );
}
