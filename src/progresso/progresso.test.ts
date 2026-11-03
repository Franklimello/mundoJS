import { describe, expect, it } from 'vitest';
import { lerProgressoSalvo } from './legado';
import { chaveDaLicao, chaveDoExercicio, licaoConcluida, PROGRESSO_VAZIO, registrarExercicio } from './tipos';

const AGORA = '2026-10-11T12:00:00.000Z';

describe('lições que recebem novos exercícios', () => {
  it('reconhece os acertos antigos e mantém apenas o exercício acrescentado pendente', () => {
    let progresso = registrarExercicio(PROGRESSO_VAZIO, 't', 'l', 0, 2, AGORA);
    progresso = registrarExercicio(progresso, 't', 'l', 1, 2, AGORA);
    expect(licaoConcluida(progresso, 't', 'l', 2)).toBe(true);
    expect(licaoConcluida(progresso, 't', 'l', 3)).toBe(false);
    const ampliado = registrarExercicio(progresso, 't', 'l', 2, 3, '2026-11-03T12:00:00.000Z');
    expect(licaoConcluida(ampliado, 't', 'l', 3)).toBe(true);
    expect(ampliado.concluidas['t/l']).toBe(AGORA);
    expect(ampliado.exerciciosConcluidos['t/l#0']).toBe(AGORA);
  });
  it('mantém compatibilidade com registros antigos sem detalhes por exercício', () => {
    expect(licaoConcluida({ ...PROGRESSO_VAZIO, concluidas: { 't/l': AGORA } }, 't', 'l', 3)).toBe(true);
    expect(licaoConcluida(PROGRESSO_VAZIO, 't', 'l', 3)).toBe(false);
  });
});

describe('ler o progresso salvo no navegador', () => {
  it('devolve o progresso quando o que está salvo é válido', () => {
    const salvo = JSON.stringify({
      versao: 1,
      concluidas: { 'javascript-do-zero/ola-mundo': '2026-10-10T01:00:00.000Z' },
      exerciciosConcluidos: { 'javascript-do-zero/ola-mundo#0': '2026-10-10T01:00:00.000Z' },
    });
    const progresso = lerProgressoSalvo(salvo);
    expect(progresso.concluidas).toEqual({ 'javascript-do-zero/ola-mundo': '2026-10-10T01:00:00.000Z' });
    expect(progresso.exerciciosConcluidos).toEqual({ 'javascript-do-zero/ola-mundo#0': '2026-10-10T01:00:00.000Z' });
  });

  it('não tem progresso quando nada foi salvo', () => {
    expect(lerProgressoSalvo(null)).toBe(PROGRESSO_VAZIO);
  });

  // Quem estudou antes de as lições terem vários exercícios não perde o que já fez.
  it('progresso antigo, sem o campo de exercícios, continua valendo', () => {
    const progresso = lerProgressoSalvo(
      JSON.stringify({ versao: 1, concluidas: { 'a/b': '2026-01-01T00:00:00.000Z' } }),
    );
    expect(progresso.concluidas).toEqual({ 'a/b': '2026-01-01T00:00:00.000Z' });
    expect(progresso.exerciciosConcluidos).toEqual({});
  });

  // O que está no `localStorage` pode ter sido editado à mão, ou vir de outra versão.
  it.each([
    ['texto que não é JSON', 'isto não é json'],
    ['um número', '42'],
    ['null', 'null'],
    ['sem o campo concluidas', '{"versao":1}'],
    ['concluidas como lista', '{"concluidas":["a"]}'],
    ['concluidas como texto', '{"concluidas":"a"}'],
  ])('recomeça do zero com %s', (_nome, bruto) => {
    expect(lerProgressoSalvo(bruto)).toBe(PROGRESSO_VAZIO);
  });

  it('descarta só as entradas que não são datas em texto', () => {
    const progresso = lerProgressoSalvo(
      JSON.stringify({
        concluidas: { 'a/b': '2026-01-01T00:00:00.000Z', 'c/d': 123, 'e/f': null, 'g/h': { x: 1 } },
        exerciciosConcluidos: { 'a/b#0': '2026-01-01T00:00:00.000Z', 'a/b#1': 7 },
      }),
    );
    expect(progresso.concluidas).toEqual({ 'a/b': '2026-01-01T00:00:00.000Z' });
    expect(progresso.exerciciosConcluidos).toEqual({ 'a/b#0': '2026-01-01T00:00:00.000Z' });
  });

  it('um campo de exercícios estragado não derruba o progresso das lições', () => {
    const progresso = lerProgressoSalvo(JSON.stringify({ concluidas: { 'a/b': AGORA }, exerciciosConcluidos: ['x'] }));
    expect(progresso.concluidas).toEqual({ 'a/b': AGORA });
    expect(progresso.exerciciosConcluidos).toEqual({});
  });
});

describe('chaves', () => {
  it('a chave de uma lição junta trilha e lição; a de um exercício acrescenta a posição', () => {
    expect(chaveDaLicao('javascript-do-zero', 'lacos')).toBe('javascript-do-zero/lacos');
    expect(chaveDoExercicio('javascript-do-zero', 'lacos', 2)).toBe('javascript-do-zero/lacos#2');
  });
});

describe('registrar um exercício certo', () => {
  it('um exercício de vários não conclui a lição', () => {
    const progresso = registrarExercicio(PROGRESSO_VAZIO, 't', 'l', 0, 3, AGORA);
    expect(progresso.exerciciosConcluidos).toEqual({ 't/l#0': AGORA });
    expect(progresso.concluidas).toEqual({});
  });

  it('o último exercício que faltava conclui a lição, em qualquer ordem', () => {
    let progresso = registrarExercicio(PROGRESSO_VAZIO, 't', 'l', 2, 3, AGORA);
    progresso = registrarExercicio(progresso, 't', 'l', 0, 3, AGORA);
    expect(progresso.concluidas).toEqual({});
    progresso = registrarExercicio(progresso, 't', 'l', 1, 3, AGORA);
    expect(progresso.concluidas).toEqual({ 't/l': AGORA });
  });

  it('uma lição de um exercício só fica concluída ao acertá-lo', () => {
    const progresso = registrarExercicio(PROGRESSO_VAZIO, 't', 'l', 0, 1, AGORA);
    expect(progresso.concluidas).toEqual({ 't/l': AGORA });
  });

  it('acertar de novo não muda nada, e devolve o mesmo objeto', () => {
    const feito = registrarExercicio(PROGRESSO_VAZIO, 't', 'l', 0, 1, AGORA);
    const denovo = registrarExercicio(feito, 't', 'l', 0, 1, '2030-01-01T00:00:00.000Z');
    expect(denovo).toBe(feito);
    expect(denovo.concluidas['t/l']).toBe(AGORA);
  });

  it('não mexe no progresso de outras lições, nem altera o objeto que recebeu', () => {
    const base = registrarExercicio(PROGRESSO_VAZIO, 'outra', 'licao', 0, 1, AGORA);
    const antes = JSON.stringify(base);
    const novo = registrarExercicio(base, 't', 'l', 0, 2, AGORA);
    expect(JSON.stringify(base)).toBe(antes);
    expect(novo.concluidas).toEqual({ 'outra/licao': AGORA });
    expect(novo.exerciciosConcluidos).toEqual({ 'outra/licao#0': AGORA, 't/l#0': AGORA });
  });

  it('uma lição que já estava concluída antes dos exercícios múltiplos continua concluída', () => {
    const antigo = { ...PROGRESSO_VAZIO, concluidas: { 't/l': '2026-01-01T00:00:00.000Z' } };
    const novo = registrarExercicio(antigo, 't', 'l', 0, 4, AGORA);
    expect(novo.concluidas['t/l']).toBe('2026-01-01T00:00:00.000Z');
    expect(novo.exerciciosConcluidos).toEqual({ 't/l#0': AGORA });
  });
});
