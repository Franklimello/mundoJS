// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Saida } from './Saida';

it('mostra a observação sem solução automática, oferece pista e volta à linha original', async () => {
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
            saida: [{ tipo: 'log', texto: 'undefined' }],
            erro: null,
            testes: [],
            duracaoMs: 1,
            investigacoes: [
              {
                array: 'numeros',
                indice: 3,
                tamanho: 3,
                linha: 2,
                coluna: 13,
                itens: [
                  { indice: 0, valor: '10' },
                  { indice: 1, valor: '20' },
                  { indice: 2, valor: '30' },
                ],
              },
            ],
          }}
          aoIrParaLinha={irParaLinha}
        />,
      ),
    );
    const painel = container.querySelector('[aria-label="Investigador de erros"]')!;
    expect(painel.textContent).toContain('Isso pode ser intencional');
    expect(painel.querySelector('details')?.open).toBe(false);
    expect(painel.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(painel.querySelector('caption')?.textContent).toContain('momento do acesso');
    expect(painel.textContent).toContain('qual posição contém o valor');
    expect(painel.querySelector('.investigador-pista')?.hasAttribute('open')).toBe(false);
    expect(painel.querySelector('[role="alert"]')).toBeNull();
    expect(painel.querySelector('textarea, [contenteditable]')).toBeNull();
    await act(async () => painel.querySelector('button')!.click());
    expect(irParaLinha).toHaveBeenCalledWith(2);
    await act(async () =>
      root.render(
        <Saida resultado={{ saida: [{ tipo: 'log', texto: '30' }], erro: null, testes: [], duracaoMs: 1 }} />,
      ),
    );
    expect(container.querySelector('[aria-label="Investigador de erros"]')).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
