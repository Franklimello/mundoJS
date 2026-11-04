import { snippet } from '@codemirror/autocomplete';
import { isolateHistory } from '@codemirror/commands';
import { type EditorState, Transaction } from '@codemirror/state';

export const MODELOS_CODIGO = [
  { nome: 'console.log', codigo: 'console.log(${1:valor});${0}' },
  { nome: 'const', codigo: 'const ${1:nome} = ${2:valor};${0}' },
  { nome: 'if', codigo: 'if (${1:condicao}) {\n\t${0}\n}' },
  { nome: 'for', codigo: 'for (let ${1:i} = 0; ${1:i} < ${2:lista}.length; ${1:i}++) {\n\t${0}\n}' },
  { nome: 'função', codigo: 'function ${1:nome}(${2:parametro}) {\n\t${0}\n}' },
  { nome: 'return', codigo: 'return ${1:valor};${0}' },
] as const;

export function aplicarModelo(alvo: { state: EditorState; dispatch: (tr: Transaction) => void }, codigo: string) {
  const { from, to } = alvo.state.selection.main;
  snippet(codigo)(
    {
      state: alvo.state,
      dispatch: (tr) =>
        alvo.dispatch(
          tr.startState.update({
            changes: tr.changes,
            selection: tr.selection,
            effects: tr.effects,
            scrollIntoView: true,
            annotations: [Transaction.userEvent.of('input.complete'), isolateHistory.of('full')],
          }),
        ),
    },
    null,
    from,
    to,
  );
}
