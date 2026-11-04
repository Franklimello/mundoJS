// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Saida } from './Saida';

it('mantém o exemplo opcional e permite voltar à linha indicada sem aplicar a solução', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const irParaLinha = vi.fn();
  try {
    await act(async () =>
      root.render(
        <Saida
          resultado={{
            saida: [],
            testes: [],
            duracaoMs: 0,
            erro: {
              nome: 'ReferenceError',
              mensagem: 'Esse nome não existe.',
              dica: 'Confira a declaração.',
              linha: 2,
              exemplo: { codigo: 'const nome = "Ana";\nconsole.log(nome);', explicacao: 'Crie o nome antes de usar.' },
            },
          }}
          aoIrParaLinha={irParaLinha}
        />,
      ),
    );
    expect(container.querySelector('details')?.open).toBe(false);
    expect(container.textContent).toContain('Tente isto:');
    expect(container.querySelector('pre')?.textContent).toContain('console.log(nome)');
    await act(async () => container.querySelector('button')!.click());
    expect(irParaLinha).toHaveBeenCalledWith(2);
    expect(container.querySelector('textarea, [contenteditable]')).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
