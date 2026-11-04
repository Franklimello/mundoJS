// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { PassoAPasso } from './PassoAPasso';
import type { ResultadoExecucao } from '@/engine/tipos';

it('navega pelo registro sem executar novamente, limita o console ao passo e oferece retorno à linha', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  const rodar = vi.fn();
  const linha = vi.fn();
  const resultado: ResultadoExecucao = {
    saida: [{ tipo: 'log', texto: '3' }],
    erro: null,
    testes: [],
    duracaoMs: 1,
    passoAPasso: {
      limiteAtingido: false,
      passos: [
        { linha: 1, descricao: 'Antes de começar', variaveis: [], linhasSaida: 0, lacos: [] },
        {
          linha: 2,
          descricao: 'Variáveis declaradas',
          variaveis: [{ nome: 'n', valor: '3', estado: 'nova' }],
          linhasSaida: 0,
          lacos: [],
        },
        {
          linha: 3,
          descricao: 'Comando executado',
          variaveis: [{ nome: 'n', valor: '3', estado: 'igual' }],
          linhasSaida: 1,
          lacos: [],
        },
      ],
    },
  };
  const botao = (nome: string) => [...container.querySelectorAll('button')].find((item) => item.textContent === nome)!;
  try {
    await act(async () =>
      root.render(
        <PassoAPasso
          resultado={resultado}
          codigo={'\nlet n = 3;\nconsole.log(n);'}
          aoRodar={rodar}
          aoIrParaLinha={linha}
        />,
      ),
    );
    expect(botao('Anterior').disabled).toBe(true);
    expect(container.querySelector('[aria-label="Console até este passo"]')).toBeNull();
    await act(async () => botao('Próximo passo').click());
    expect(container.textContent).toContain('Passo 2 de 3');
    expect(container.querySelector('tbody')?.textContent).toContain('Visível agora');
    await act(async () => botao('Ver linha 2 no editor').click());
    expect(linha).toHaveBeenCalledWith(2);
    await act(async () => botao('Próximo passo').click());
    expect(container.querySelector('[aria-label="Console até este passo"]')?.textContent).toBe('3\n');
    expect(botao('Próximo passo').disabled).toBe(true);
    await act(async () => botao('Anterior').click());
    expect(container.querySelector('[aria-label="Console até este passo"]')).toBeNull();
    await act(async () => botao('Reiniciar revisão').click());
    expect(container.textContent).toContain('Passo 1 de 3');
    expect(rodar).not.toHaveBeenCalled();
    await act(async () =>
      root.render(
        <PassoAPasso
          resultado={{
            ...resultado,
            passoAPasso: {
              passos: [],
              limiteAtingido: false,
              indisponivel: { mensagem: 'Funções ainda usam Rodar.', linha: 2 },
            },
          }}
          codigo="function x() {}"
          aoRodar={rodar}
        />,
      ),
    );
    expect(container.textContent).toContain('O código não foi executado neste modo.');
    await act(async () => botao('Rodar normalmente').click());
    expect(rodar).toHaveBeenCalledOnce();
  } finally {
    await act(async () => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  }
});
