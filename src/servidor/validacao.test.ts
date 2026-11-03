import { describe, expect, it } from 'vitest';
import { filtrarProgressoLegado, progressoValido, rascunhoValido } from './validacao';

const data = '2026-11-03T10:00:00.000Z';
describe('dados recebidos pela API', () => {
  it('aceita só lições e exercícios existentes com datas válidas', () => {
    const progresso = { versao: 1, concluidas: {}, exerciciosConcluidos: { 'javascript-do-zero/ola-mundo#0': data } };
    expect(progressoValido(progresso)).toBe(true);
    expect(progressoValido({ ...progresso, exerciciosConcluidos: { 'inexistente#0': data } })).toBe(false);
    expect(
      progressoValido({ ...progresso, exerciciosConcluidos: { 'javascript-do-zero/ola-mundo#0': 'amanhã' } }),
    ).toBe(false);
    expect(progressoValido(null)).toBe(false);
    expect(progressoValido({ ...progresso, concluidas: [] })).toBe(false);
  });
  it('limita código em bytes e permite apagar rascunhos existentes', () => {
    expect(rascunhoValido('rascunho-livre', 'console.log(1)')).toBe(true);
    expect(rascunhoValido('rascunho-web', '{"mundojsWeb":1,"html":"<p>Teste</p>","css":"","javascript":""}')).toBe(
      true,
    );
    expect(rascunhoValido('javascript-do-zero/ola-mundo', null)).toBe(true);
    expect(rascunhoValido('rascunho-livre', 'á'.repeat(100001))).toBe(false);
    expect(rascunhoValido('desconhecido', '')).toBe(false);
  });
  it('importa entradas antigas válidas e descarta referências que não existem mais', () => {
    expect(
      filtrarProgressoLegado({
        concluidas: { 'javascript-do-zero/ola-mundo': data, 'fora/do-curso': data },
        exerciciosConcluidos: null,
      }),
    ).toEqual({ versao: 1, concluidas: { 'javascript-do-zero/ola-mundo': data }, exerciciosConcluidos: {} });
  });
});
