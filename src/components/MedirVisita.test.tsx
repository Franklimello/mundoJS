// @vitest-environment happy-dom
import { act, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
const registrar = vi.hoisted(() => vi.fn());
vi.mock('@/estudo/eventos', () => ({ registrarEvento: registrar }));
import { MedirVisita } from './MedirVisita';

it('deduplica a montagem repetida e gera outro evento ao mudar a página acompanhada', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  registrar.mockClear();
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () =>
      root.render(
        <StrictMode>
          <MedirVisita pagina="inicio" />
        </StrictMode>,
      ),
    );
    const iniciais = registrar.mock.calls;
    expect(iniciais.length).toBeGreaterThan(0);
    expect(new Set(iniciais.map((chamada) => chamada[1])).size).toBe(1);
    const idInicio = iniciais[0]![1];
    await act(async () =>
      root.render(
        <StrictMode>
          <MedirVisita pagina="comecar" />
        </StrictMode>,
      ),
    );
    expect(registrar.mock.lastCall?.[0]).toMatchObject({ tipo: 'visita', pagina: 'comecar' });
    expect(registrar.mock.lastCall?.[1]).not.toBe(idInicio);
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
