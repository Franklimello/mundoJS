import { describe, expect, it } from 'vitest';
import { history, undo } from '@codemirror/commands';
import { nextSnippetField } from '@codemirror/autocomplete';
import { EditorState, type Transaction } from '@codemirror/state';
import { parse } from 'acorn';
import { aplicarModelo, MODELOS_CODIGO } from './modelos';

function editor() {
  let state = EditorState.create({
    doc: 'const antes = 1;\n',
    selection: { anchor: 17 },
    extensions: [history(), EditorState.allowMultipleSelections.of(true)],
  });
  return {
    get state() {
      return state;
    },
    dispatch(tr: Transaction) {
      state = tr.state;
    },
  };
}

describe('modelos para digitar no celular', () => {
  it.each(MODELOS_CODIGO)('$nome insere uma estrutura válida, sem comentários, e permite desfazer', (modelo) => {
    const alvo = editor();
    const comentarios: unknown[] = [];
    aplicarModelo(alvo, modelo.codigo);
    expect(alvo.state.doc.toString()).toContain('const antes = 1;');
    parse(alvo.state.doc.toString(), {
      ecmaVersion: 'latest',
      allowReturnOutsideFunction: true,
      onComment: (_bloco, texto) => comentarios.push(texto),
    });
    expect(comentarios).toEqual([]);
    expect(undo(alvo)).toBe(true);
    expect(alvo.state.doc.toString()).toBe('const antes = 1;\n');
  });
  it('seleciona o primeiro campo e avança para o próximo por toque', () => {
    const alvo = editor();
    aplicarModelo(alvo, MODELOS_CODIGO[1].codigo);
    const selecionado = () => alvo.state.sliceDoc(alvo.state.selection.main.from, alvo.state.selection.main.to);
    expect(selecionado()).toBe('nome');
    nextSnippetField(alvo);
    expect(selecionado()).toBe('valor');
  });
});
