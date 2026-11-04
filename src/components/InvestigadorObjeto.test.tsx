// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { Saida } from './Saida';

it('explica a propriedade ausente com tabela, pista opcional e retorno à linha sem editar a resposta', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const revisar = vi.fn();
  try {
    await act(async () =>
      root.render(
        <Saida
          resultado={{
            saida: [{ tipo: 'log', texto: 'undefined' }],
            erro: null,
            testes: [],
            duracaoMs: 1,
            investigacoesObjetos: [
              {
                objeto: 'aluno',
                propriedade: 'Nome',
                acesso: 'aluno.Nome',
                linha: 2,
                coluna: 13,
                propriedades: [
                  { nome: 'nome', valor: "'Ana'" },
                  { nome: 'idade', valor: '20' },
                ],
                haMais: false,
              },
            ],
          }}
          aoIrParaLinha={revisar}
        />,
      ),
    );
    const painel = container.querySelector('[aria-label="Investigador de erros"]')!;
    expect(painel.textContent).toContain('Isso pode ser intencional');
    expect(painel.querySelector('details')?.open).toBe(false);
    expect(painel.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(painel.querySelector('caption')?.textContent).toContain('Propriedades no momento do acesso');
    expect(painel.textContent).toContain('"Nome"');
    expect(painel.textContent).toContain('qual nome da tabela');
    expect(painel.querySelector('.investigador-pista')?.hasAttribute('open')).toBe(false);
    expect(painel.querySelector('textarea, [contenteditable]')).toBeNull();
    await act(async () => painel.querySelector('button')!.click());
    expect(revisar).toHaveBeenCalledWith(2);
    await act(async () =>
      root.render(
        <Saida
          resultado={{
            saida: [],
            erro: null,
            testes: [],
            duracaoMs: 1,
            investigacoesObjetos: [
              {
                objeto: 'vazio',
                propriedade: 'nome',
                acesso: 'vazio["nome"]',
                linha: 3,
                coluna: 1,
                propriedades: [],
                haMais: false,
              },
            ],
          }}
        />,
      ),
    );
    expect(container.textContent).toContain('esse dado deveria ser criado');
    expect(container.querySelector('table')).toBeNull();
    expect(container.querySelector('.investigador button')).toBeNull();
    await act(async () =>
      root.render(
        <Saida resultado={{ saida: [{ tipo: 'log', texto: 'Ana' }], erro: null, testes: [], duracaoMs: 1 }} />,
      ),
    );
    expect(container.querySelector('[aria-label="Investigador de erros"]')).toBeNull();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
