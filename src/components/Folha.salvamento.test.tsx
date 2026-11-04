// @vitest-environment happy-dom
import { act, createRef, useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ ler: vi.fn(), salvar: vi.fn(), apagar: vi.fn() }));
vi.mock('@/progresso/rascunhos', () => ({
  lerRascunho: api.ler,
  salvarRascunho: api.salvar,
  apagarRascunho: api.apagar,
}));
vi.mock('@/estudo/eventos', () => ({ registrarEvento: vi.fn() }));
vi.mock('./Tutor', () => ({ Tutor: () => null }));
vi.mock('./SalvarProgresso', () => ({ SalvarProgresso: () => null }));
vi.mock('next/dynamic', () => ({
  default: () =>
    function EditorSimulado({
      valor,
      onChange,
      aoMontar,
    }: {
      valor: string;
      onChange: (valor: string) => void;
      aoMontar: () => void;
    }) {
      useEffect(() => {
        aoMontar();
      }, [aoMontar]);
      return <button onClick={() => onChange(valor + 'x')}>Digitar</button>;
    },
}));
import { Folha } from './Folha';

let container: HTMLDivElement;
let root: Root;
const controle = createRef<{ salvarAntesDeSair: () => Promise<boolean> }>();
beforeEach(async () => {
  vi.useFakeTimers();
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.clearAllMocks();
  api.ler.mockResolvedValue({ codigo: null, identidade: 'visitante:teste' });
  api.salvar.mockResolvedValue(undefined);
  api.apagar.mockResolvedValue(undefined);
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () =>
    root.render(
      <Folha
        controleRef={controle}
        titulo="Teste"
        rotuloDoEditor="Código"
        codigoInicial=""
        chaveRascunho="rascunho-livre"
      />,
    ),
  );
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function alterar() {
  act(() => [...container.querySelectorAll('button')].find((botao) => botao.textContent === 'Digitar')!.click());
}
function status() {
  return container.querySelector('.folha-salvamento')!.textContent;
}

describe('feedback e proteção do rascunho', () => {
  it('não anuncia Salvo para uma resposta antiga enquanto há código novo pendente', async () => {
    let concluir!: () => void;
    api.salvar.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          concluir = resolve;
        }),
    );
    expect(status()).toBe('Pronto para editar');
    alterar();
    expect(status()).toBe('Alterações não salvas');
    await act(async () => vi.advanceTimersByTimeAsync(401));
    expect(status()).toBe('Salvando…');
    alterar();
    await act(async () => concluir());
    expect(status()).toBe('Alterações não salvas');
    await act(async () => vi.advanceTimersByTimeAsync(401));
    expect(status()).toBe('Salvo');
    expect(api.salvar).toHaveBeenLastCalledWith('rascunho-livre', 'xx', 'visitante:teste');
  });

  it('impede sair após falha e permite tentar salvar novamente sem perder a tentativa', async () => {
    api.salvar.mockRejectedValue(new Error('offline'));
    alterar();
    let saiu: boolean | undefined;
    await act(async () => {
      saiu = await controle.current!.salvarAntesDeSair();
    });
    expect(saiu).toBe(false);
    expect(status()).toContain('Não salvo');
    api.salvar.mockResolvedValue(undefined);
    await act(async () => {
      saiu = await controle.current!.salvarAntesDeSair();
    });
    expect(saiu).toBe(true);
    expect(status()).toBe('Salvo');
    expect(api.salvar).toHaveBeenLastCalledWith('rascunho-livre', 'x', 'visitante:teste');
  });
});
