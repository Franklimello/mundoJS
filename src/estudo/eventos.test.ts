import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/progresso/api', () => ({ prepararSessao: async () => {} }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('eventos antes de pedir ajuda', () => {
  it('aguarda as conferências anteriores na ordem antes de consultar o tutor', async () => {
    vi.resetModules();
    const tipos: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url, opcoes) => {
        tipos.push(JSON.parse(opcoes.body).tipo);
        return new Response(null, { status: 204 });
      }),
    );
    const { registrarEvento, aguardarEventos } = await import('./eventos');
    registrarEvento({ tipo: 'exercicio_conferido', posicao: { trilha: 't', licao: 'l', indice: 0 }, passou: false });
    registrarEvento({ tipo: 'ajuda_pedida' });
    await aguardarEventos();
    expect(tipos).toEqual(['exercicio_conferido', 'ajuda_pedida']);
  });
  it('não trava a ajuda se a entrega dos eventos não responder', async () => {
    vi.useFakeTimers();
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    const { registrarEvento, aguardarEventos } = await import('./eventos');
    registrarEvento({ tipo: 'ajuda_pedida' });
    let terminou = false;
    const consulta = aguardarEventos().then(() => {
      terminou = true;
    });
    await vi.advanceTimersByTimeAsync(1500);
    await consulta;
    expect(terminou).toBe(true);
  });
});
