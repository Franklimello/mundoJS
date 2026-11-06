// @vitest-environment happy-dom
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FolhaProps } from './Folha';
import { TreinoMetodo } from './TreinoMetodo';
import { buscarTopico } from '@/documentacao';

const mocks = vi.hoisted(() => ({
  folhaProps: null as FolhaProps | null,
}));

vi.mock('./Folha', () => ({
  Folha: (props: FolhaProps) => {
    mocks.folhaProps = props;
    return <div data-testid="folha-simulada">{props.titulo}</div>;
  },
}));

describe('TreinoMetodo', () => {
  let container: HTMLDivElement;
  let raiz: Root;

  beforeEach(() => {
    mocks.folhaProps = null;
    container = document.createElement('div');
    document.body.appendChild(container);
    raiz = createRoot(container);
  });

  afterEach(() => {
    act(() => raiz.unmount());
    container.remove();
  });

  const topico = buscarTopico('strings')!;
  const metodo = topico.secoes[2]!.metodos[0]!; // trim()

  it('começa fechado com o botão de treino', () => {
    act(() => {
      raiz.render(<TreinoMetodo topico="strings" metodo={metodo} />);
    });
    const botao = container.querySelector('button.doc-treino-gatilho');
    expect(botao).not.toBeNull();
    expect(botao?.textContent).toContain('Treine esse método');
    expect(container.querySelector('[data-testid="folha-simulada"]')).toBeNull();
  });

  it('abre o treino ao clicar no botão e passa os dados certos para a Folha', () => {
    act(() => {
      raiz.render(<TreinoMetodo topico="strings" metodo={metodo} />);
    });
    const botao = container.querySelector<HTMLButtonElement>('button.doc-treino-gatilho')!;
    act(() => {
      botao.click();
    });

    expect(container.textContent).toContain('Praticar: trim()');
    expect(container.textContent).toContain('A busca veio com espaços sobrando nas pontas');
    expect(container.querySelector('[data-testid="folha-simulada"]')).not.toBeNull();
    expect(mocks.folhaProps?.chaveRascunho).toBe('doc/strings/trim');
    expect(mocks.folhaProps?.codigoInicial).toBe(metodo.treino.codigoInicial);
    expect(mocks.folhaProps?.solucao).toBe(metodo.treino.solucao);
  });

  it('permite fechar o treino', () => {
    act(() => {
      raiz.render(<TreinoMetodo topico="strings" metodo={metodo} />);
    });
    const abrir = container.querySelector<HTMLButtonElement>('button.doc-treino-gatilho')!;
    act(() => {
      abrir.click();
    });
    const fechar = container.querySelector<HTMLButtonElement>('button.doc-treino-fechar')!;
    act(() => {
      fechar.click();
    });

    expect(container.querySelector('button.doc-treino-gatilho')).not.toBeNull();
    expect(container.querySelector('[data-testid="folha-simulada"]')).toBeNull();
  });
});
