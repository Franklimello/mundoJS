import { isolateHistory } from '@codemirror/commands';
import { EditorSelection, type EditorState, Transaction, type TransactionSpec } from '@codemirror/state';

/** Insere no cursor ou envolve a seleção, sem perder o histórico de edição. */
export function inserirAtalho(estado: EditorState, abertura: string, fechamento?: string): TransactionSpec {
  return {
    ...estado.changeByRange((faixa) => {
      const selecionado = fechamento === undefined ? '' : estado.sliceDoc(faixa.from, faixa.to);
      const texto = abertura + selecionado + (fechamento ?? '');
      const inicio = faixa.from + abertura.length;
      return {
        changes: { from: faixa.from, to: faixa.to, insert: texto },
        range:
          fechamento === undefined
            ? EditorSelection.cursor(inicio)
            : EditorSelection.range(inicio, inicio + selecionado.length),
      };
    }),
    annotations: [Transaction.userEvent.of('input.type'), isolateHistory.of('full')],
    scrollIntoView: true,
  };
}
