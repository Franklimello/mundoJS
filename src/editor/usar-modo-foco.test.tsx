// @vitest-environment happy-dom
import { act, useCallback, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useModoFoco } from './usar-modo-foco';

function Exemplo() {
  const [ativo, setAtivo] = useState(false);
  const raiz = useRef<HTMLElement>(null);
  const fechar = useCallback(() => setAtivo(false), []);
  useModoFoco(raiz, ativo, fechar);
  return (
    <>
      <button id="fora">Fora</button>
      <section ref={raiz}>
        <button className="folha-foco-sair" onClick={() => setAtivo(!ativo)}>
          {ativo ? 'Sair' : 'Entrar'}
        </button>
        <button id="ultimo">Último</button>
      </section>
    </>
  );
}

let container: HTMLDivElement;
let root: Root;
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<Exemplo />));
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('modo foco', () => {
  it('isola o fundo e restaura rolagem e foco ao sair com Escape', () => {
    document.body.style.overflow = 'auto';
    const botao = container.querySelector<HTMLButtonElement>('.folha-foco-sair')!;
    botao.focus();
    act(() => botao.click());
    expect(container.querySelector<HTMLElement>('#fora')!.inert).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    act(() => botao.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    expect(container.querySelector<HTMLElement>('#fora')!.inert).toBe(false);
    expect(document.body.style.overflow).toBe('auto');
    expect(document.activeElement).toBe(botao);
  });

  it('acompanha a área visível e remove os efeitos ao desmontar', () => {
    const viewport = Object.assign(new EventTarget(), { height: 400, offsetTop: 12 });
    vi.stubGlobal('visualViewport', viewport);
    act(() => container.querySelector<HTMLButtonElement>('.folha-foco-sair')!.click());
    const painel = container.querySelector('section')!;
    expect(painel.style.getPropertyValue('--altura-foco')).toBe('400px');
    viewport.height = 280;
    viewport.offsetTop = 24;
    act(() => viewport.dispatchEvent(new Event('resize')));
    expect(painel.style.getPropertyValue('--altura-foco')).toBe('280px');
    expect(painel.style.getPropertyValue('--topo-foco')).toBe('24px');
    act(() => root.render(<p>Outra página</p>));
    expect(document.body.style.overflow).toBe('auto');
    expect(container.inert).toBe(false);
  });
});
