import { describe, expect, it } from 'vitest';
import { filtrarProgressoLegado, progressoValido, rascunhoValido } from './validacao';
import { chaveDoDesafio, DESAFIOS_RASCUNHO } from '@/conteudo/desafios-rascunho';

const data = '2026-11-03T10:00:00.000Z';
describe('dados recebidos pela API', () => {
  it('aceita progresso e rascunhos da nova trilha de ferramentas', () => {
    const base = 'ferramentas-do-javascript/math-arredondamentos';
    expect(rascunhoValido(base, 'const notas = [7.2, 7.5];')).toBe(true);
    expect(rascunhoValido(`${base}#3`, 'function parteInteira(numero) {}')).toBe(true);
    expect(rascunhoValido(`${base}#4`, 'fora da lição')).toBe(false);
    expect(progressoValido({ versao: 1, concluidas: {}, exerciciosConcluidos: { [`${base}#0`]: data } })).toBe(true);
  });
  it('aceita rascunhos separados somente para desafios e modos cadastrados', () => {
    const chaves = DESAFIOS_RASCUNHO.map(chaveDoDesafio);
    expect(new Set(chaves).size).toBe(16);
    for (const chave of chaves) {
      expect(rascunhoValido(chave, 'tentativa')).toBe(true);
      expect(rascunhoValido(chave, null)).toBe(true);
    }
    expect(rascunhoValido('rascunho-desafio/web/maior-numero', 'x')).toBe(false);
    expect(rascunhoValido('rascunho-desafio/javascript/desconhecido', 'x')).toBe(false);
  });
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
    expect(rascunhoValido('doc/strings/trim', 'const limpa = busca.trim();')).toBe(true);
    expect(rascunhoValido('doc/arrays/map', 'const d = lista.map(x => x * 2);')).toBe(true);
    expect(rascunhoValido('doc/objetos/keys', 'const k = Object.keys(o);')).toBe(true);
    expect(rascunhoValido('doc/lacos/for-classico', 'for (let i = 0; i < 5; i++) {}')).toBe(true);
    expect(rascunhoValido('doc/regex/test', 'const ok = /\\d/.test(t);')).toBe(true);
    expect(rascunhoValido('doc/classes/class-e-constructor', 'class A {}')).toBe(true);
    expect(rascunhoValido('doc/sql/select', "const q = 'SELECT * FROM t;';")).toBe(true);
    expect(rascunhoValido('doc/strings/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/arrays/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/objetos/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/lacos/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/regex/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/classes/inexistente', 'x')).toBe(false);
    expect(rascunhoValido('doc/sql/inexistente', 'x')).toBe(false);
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
