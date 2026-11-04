import { describe, expect, it } from 'vitest';
import { PROGRESSO_VAZIO } from '@/progresso/tipos';
import { escolherRetomada, hrefDaRetomada } from './retomar';

const catalogo = [
  { trilha: 't', licao: 'a', titulo: 'A', tituloTrilha: 'T', total: 2 },
  { trilha: 't', licao: 'b', titulo: 'B', tituloTrilha: 'T', total: 1 },
  { trilha: 't', licao: 'c', titulo: 'C', tituloTrilha: 'T', total: 2 },
];
describe('próximo passo do aluno', () => {
  it('retoma exercícios acrescentados sem perder os acertos da versão anterior', () => {
    const ampliado = catalogo.map((licao) => (licao.licao === 'a' ? { ...licao, total: 3 } : licao));
    const progresso = {
      ...PROGRESSO_VAZIO,
      concluidas: { 't/a': '2026-01-01' },
      exerciciosConcluidos: { 't/a#0': '2026-01-01', 't/a#1': '2026-01-01' },
    };
    expect(escolherRetomada(ampliado, progresso, { trilha: 't', licao: 'a', indice: 1 })).toMatchObject({
      licao: ampliado[0],
      indice: 2,
      feitos: 2,
    });
    expect(progresso.concluidas['t/a']).toBe('2026-01-01');
  });
  it('oferece a primeira lição a quem ainda não começou', () => {
    expect(escolherRetomada(catalogo, PROGRESSO_VAZIO)).toMatchObject({
      licao: catalogo[0],
      indice: 0,
      iniciada: false,
      feitos: 0,
      total: 5,
    });
  });
  it('retoma a última lição visitada mesmo sem um acerto e abre seu primeiro pendente', () => {
    const progresso = { ...PROGRESSO_VAZIO, exerciciosConcluidos: { 't/c#0': '2026-01-01' } };
    expect(escolherRetomada(catalogo, progresso, { trilha: 't', licao: 'c', indice: 0 })).toMatchObject({
      licao: catalogo[2],
      indice: 1,
      iniciada: true,
      feitos: 1,
    });
    expect(escolherRetomada(catalogo, PROGRESSO_VAZIO, { trilha: 't', licao: 'b', indice: 0 }).licao).toBe(catalogo[1]);
  });
  it('avança após a última lição concluída e reconhece progresso antigo sem exercícios', () => {
    const progresso = { ...PROGRESSO_VAZIO, concluidas: { 't/a': '2026-01-01' } };
    expect(escolherRetomada(catalogo, progresso)).toMatchObject({ licao: catalogo[1], feitos: 2 });
  });
  it('volta a uma pendência anterior quando a última lição da lista foi concluída', () => {
    const progresso = { ...PROGRESSO_VAZIO, concluidas: { 't/c': '2026-01-01' } };
    expect(escolherRetomada(catalogo, progresso, { trilha: 't', licao: 'c', indice: 0 }).licao).toBe(catalogo[0]);
  });
  it('reconhece curso completo sem mandar o aluno para um novo exercício', () => {
    const progresso = {
      ...PROGRESSO_VAZIO,
      concluidas: { 't/a': '2026-01-01', 't/b': '2026-01-01', 't/c': '2026-01-01' },
    };
    expect(escolherRetomada(catalogo, progresso)).toMatchObject({ licao: null, feitos: 5, total: 5 });
  });
  it('ignora uma última posição removida do curso', () => {
    expect(escolherRetomada(catalogo, PROGRESSO_VAZIO, { trilha: 't', licao: 'removida', indice: 0 }).licao).toBe(
      catalogo[0],
    );
  });
});

describe('entrada na atividade guiada', () => {
  const inicio = [{ trilha: 'javascript-do-zero', licao: 'ola-mundo', titulo: 'Início', tituloTrilha: 'JS', total: 6 }];

  it('envia novos alunos e tentativas incompletas da primeira atividade para o guia', () => {
    expect(hrefDaRetomada(null)).toBe('/comecar');
    expect(hrefDaRetomada(escolherRetomada(inicio, PROGRESSO_VAZIO))).toBe('/comecar');
    expect(
      hrefDaRetomada(
        escolherRetomada(inicio, PROGRESSO_VAZIO, { trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 }),
      ),
    ).toBe('/comecar');
  });

  it('segue para a lição assim que o primeiro exercício estiver concluído', () => {
    const progresso = { ...PROGRESSO_VAZIO, exerciciosConcluidos: { 'javascript-do-zero/ola-mundo#0': '2026-11-04' } };
    expect(hrefDaRetomada(escolherRetomada(inicio, progresso))).toBe('/trilhas/javascript-do-zero/ola-mundo');
  });

  it('preserva a retomada de outras lições e a revisão do curso completo', () => {
    expect(hrefDaRetomada(escolherRetomada(catalogo, PROGRESSO_VAZIO, { trilha: 't', licao: 'b', indice: 0 }))).toBe(
      '/trilhas/t/b',
    );
    expect(
      hrefDaRetomada(
        escolherRetomada(inicio, { ...PROGRESSO_VAZIO, concluidas: { 'javascript-do-zero/ola-mundo': '2026-11-04' } }),
      ),
    ).toBe('/trilhas');
  });
});
