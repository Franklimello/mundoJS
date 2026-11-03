import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Progresso } from './tipos';

const repositorio = vi.hoisted(() => ({ carregar: vi.fn(), salvar: vi.fn(), identidade: vi.fn() }));
vi.mock('./repositorio-servidor', () => ({ repositorioServidor: repositorio }));

beforeEach(() => {
  vi.resetModules();
  repositorio.carregar.mockReset();
  repositorio.salvar.mockReset();
  repositorio.identidade.mockReset();
});

describe('sincronização de progresso', () => {
  it('não mistura conquistas em memória quando a conta muda', async () => {
    repositorio.identidade.mockReturnValue('conta:a');
    repositorio.carregar.mockResolvedValue({
      versao: 1,
      concluidas: { 't/a': '2026-01-01' },
      exerciciosConcluidos: {},
    });
    const armazem = await import('./armazem');
    await armazem.sincronizarProgresso();
    repositorio.identidade.mockReturnValue('conta:b');
    repositorio.carregar.mockResolvedValue({ versao: 1, concluidas: {}, exerciciosConcluidos: {} });
    await armazem.sincronizarProgresso();
    repositorio.salvar.mockResolvedValue(undefined);
    await armazem.concluirExercicio('t', 'b', 0, 1);
    expect(repositorio.salvar.mock.calls[0]?.[0].concluidas).toEqual({ 't/b': expect.any(String) });
  });
  it('preserva um acerto feito enquanto o progresso antigo ainda carrega', async () => {
    let responder!: (progresso: Progresso) => void;
    repositorio.carregar.mockReturnValue(
      new Promise<Progresso>((resolve) => {
        responder = resolve;
      }),
    );
    repositorio.salvar.mockResolvedValue(undefined);
    const armazem = await import('./armazem');
    const carregando = armazem.sincronizarProgresso();
    const concluindo = armazem.concluirExercicio('t', 'nova', 0, 1);
    responder({ versao: 1, concluidas: { 't/antiga': '2026-01-01T00:00:00.000Z' }, exerciciosConcluidos: {} });
    await Promise.all([carregando, concluindo]);
    const salvo = repositorio.salvar.mock.calls[0]?.[0] as Progresso;
    expect(salvo.concluidas['t/antiga']).toBe('2026-01-01T00:00:00.000Z');
    expect(salvo.exerciciosConcluidos['t/nova#0']).toBeTruthy();
  });
  it('mantém um acerto pendente e reenvia após falha de rede', async () => {
    repositorio.carregar.mockResolvedValue({ versao: 1, concluidas: {}, exerciciosConcluidos: {} });
    repositorio.salvar.mockRejectedValueOnce(new Error('sem rede')).mockResolvedValue(undefined);
    const armazem = await import('./armazem');
    await armazem.concluirExercicio('t', 'l', 0, 1);
    await armazem.concluirExercicio('t', 'l', 0, 1);
    expect(repositorio.salvar).toHaveBeenCalledTimes(2);
    expect(repositorio.salvar.mock.calls[1]?.[0]).toEqual(repositorio.salvar.mock.calls[0]?.[0]);
  });
});
