import { describe, expect, it } from 'vitest';
import { history, redo, undo } from '@codemirror/commands';
import { EditorSelection, EditorState } from '@codemirror/state';
import { inserirAtalho } from './inserir-atalho';

describe('atalhos de sintaxe', () => {
  it.each([
    ['(', ')'],
    ['[', ']'],
    ['{', '}'],
    ['"', '"'],
    ["'", "'"],
    ['`', '`'],
  ])('insere %s%s com o cursor dentro do par', (abre, fecha) => {
    const estado = EditorState.create({ doc: 'const valor = ', selection: { anchor: 14 } });
    const novo = estado.update(inserirAtalho(estado, abre, fecha)).state;
    expect(novo.doc.toString()).toBe('const valor = ' + abre + fecha);
    expect(novo.selection.main.anchor).toBe(15);
    expect(novo.selection.main.empty).toBe(true);
  });

  it('envolve o texto selecionado e mantém o conteúdo selecionado', () => {
    const estado = EditorState.create({ doc: 'nome', selection: { anchor: 4, head: 0 } });
    const novo = estado.update(inserirAtalho(estado, '"', '"')).state;
    expect(novo.doc.toString()).toBe('"nome"');
    expect(novo.sliceDoc(novo.selection.main.from, novo.selection.main.to)).toBe('nome');
  });

  it('substitui a seleção por um operador completo', () => {
    const estado = EditorState.create({ doc: 'a = b', selection: { anchor: 2, head: 3 } });
    const novo = estado.update(inserirAtalho(estado, '===')).state;
    expect(novo.doc.toString()).toBe('a === b');
    expect(novo.selection.main.head).toBe(5);
  });

  it('aplica pares a todas as seleções sem deslocar a segunda', () => {
    const estado = EditorState.create({
      doc: 'a b',
      selection: EditorSelection.create([EditorSelection.range(0, 1), EditorSelection.range(2, 3)]),
      extensions: EditorState.allowMultipleSelections.of(true),
    });
    const novo = estado.update(inserirAtalho(estado, '[', ']')).state;
    expect(novo.doc.toString()).toBe('[a] [b]');
    expect(novo.selection.ranges.map((faixa) => novo.sliceDoc(faixa.from, faixa.to))).toEqual(['a', 'b']);
  });

  it('desfaz e refaz o atalho sem apagar a digitação anterior', () => {
    let estado = EditorState.create({ extensions: history() });
    estado = estado.update({
      changes: { from: 0, insert: 'nome' },
      selection: { anchor: 4 },
      userEvent: 'input.type',
    }).state;
    estado = estado.update(inserirAtalho(estado, ';')).state;
    const alvo = {
      get state() {
        return estado;
      },
      dispatch: (transacao: { state: EditorState }) => {
        estado = transacao.state;
      },
    };
    expect(undo(alvo)).toBe(true);
    expect(estado.doc.toString()).toBe('nome');
    expect(redo(alvo)).toBe(true);
    expect(estado.doc.toString()).toBe('nome;');
  });
});
