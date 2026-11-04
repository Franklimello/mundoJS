// @vitest-environment happy-dom
import { act, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';

const executar = vi.hoisted(() => vi.fn());
const evento = vi.hoisted(() => vi.fn());
vi.mock('@/engine/sandbox', () => ({ rodarNoNavegador: executar }));
vi.mock('@/estudo/eventos', () => ({ registrarEvento: evento }));
vi.mock('./Tutor', () => ({ Tutor: () => null }));
vi.mock('./SalvarProgresso', () => ({ SalvarProgresso: () => null }));
vi.mock('next/dynamic', () => ({
  default: () =>
    function Editor({ aoMontar }: { aoMontar: () => void }) {
      useEffect(() => {
        aoMontar();
      }, [aoMontar]);
      return <div>Editor de teste</div>;
    },
}));
import { Folha } from './Folha';

it('registra prática, mas não confere nem conclui o exercício ao revisar passos', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  executar.mockReset();
  evento.mockReset();
  vi.useFakeTimers();
  executar.mockResolvedValue({
    saida: [],
    erro: null,
    testes: [],
    duracaoMs: 1,
    passoAPasso: {
      limiteAtingido: false,
      passos: [{ linha: 1, descricao: 'Antes de começar', variaveis: [], lacos: [], linhasSaida: 0 }],
    },
  });
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const concluir = vi.fn();
  try {
    await act(async () =>
      root.render(
        <Folha
          titulo="Seu código"
          rotuloDoEditor="Código"
          codigoInicial="let n = 1;"
          testes={[{ descricao: 'Teste', codigo: 'igual(n, 1);' }]}
          aoConcluir={concluir}
          contextoTutor={{ trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 }}
          rodarAoDigitar
        />,
      ),
    );
    await act(async () =>
      [...container.querySelectorAll('button')].find((b) => b.textContent === 'Passo a passo')!.click(),
    );
    expect(executar).toHaveBeenCalledWith('let n = 1;', [], undefined, { passoAPasso: true });
    expect(concluir).not.toHaveBeenCalled();
    expect(evento).toHaveBeenCalledWith(expect.objectContaining({ tipo: 'codigo_rodado' }));
    expect(evento.mock.calls.some(([e]) => e.tipo === 'exercicio_conferido')).toBe(false);
    expect(container.querySelector('[aria-label="Execução passo a passo"]')).not.toBeNull();
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(executar).toHaveBeenCalledOnce();
    executar.mockResolvedValue({ saida: [], erro: null, testes: [{ descricao: 'Teste', passou: true }], duracaoMs: 1 });
    await act(async () => [...container.querySelectorAll('button')].find((b) => b.textContent === 'Conferir')!.click());
    expect(concluir).toHaveBeenCalledOnce();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  }
});
