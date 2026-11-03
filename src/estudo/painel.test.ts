import { describe, expect, it } from 'vitest';
import { trilhas, todasAsLicoes } from '@/conteudo';
import { PROGRESSO_VAZIO, type Progresso } from '@/progresso/tipos';
import { resumirAprendizado } from './painel';

const gratuita = trilhas[0]!;
const paga = trilhas[1]!;
function chaves(slug: string) {
  const trilha = trilhas.find((t) => t.slug === slug)!;
  return todasAsLicoes(trilha).flatMap((licao) => licao.exercicios.map((_, i) => `${slug}/${licao.slug}#${i}`));
}
const progresso = (...chaves: string[]): Progresso => ({
  ...PROGRESSO_VAZIO,
  exerciciosConcluidos: Object.fromEntries(chaves.map((chave) => [chave, '2026-11-03T10:00:00Z'])),
});
describe('resumo do aprendizado', () => {
  it('oferece um começo claro sem inventar atividade ou conquistas', () => {
    const painel = resumirAprendizado(PROGRESSO_VAZIO, null, false, []);
    expect(painel).toMatchObject({ feitos: 0, completas: 0, certificados: 0, paraEmitir: 0 });
    expect(painel.retomada.licao?.trilha).toBe(gratuita.slug);
    expect(painel.retomada.indice).toBe(0);
    expect(painel.trilhas.filter((t) => t.liberada).map((t) => t.slug)).toEqual([gratuita.slug]);
  });
  it('retoma exatamente o primeiro exercício pendente da última lição acessível', () => {
    const licao = todasAsLicoes(gratuita).find((l) => l.exercicios.length > 1)!;
    const painel = resumirAprendizado(
      progresso(`${gratuita.slug}/${licao.slug}#0`),
      { trilha: gratuita.slug, licao: licao.slug, indice: 0 },
      false,
      [],
    );
    expect(painel.retomada.licao?.licao).toBe(licao.slug);
    expect(painel.retomada.indice).toBe(1);
    expect(painel.feitos).toBe(1);
  });
  it('não recomenda conteúdo Pro para conta gratuita mesmo que a última visita tenha sido paga', () => {
    const licao = todasAsLicoes(paga)[0]!;
    const salvo = progresso(...chaves(gratuita.slug), `${paga.slug}/${licao.slug}#0`);
    const ultima = { trilha: paga.slug, licao: licao.slug, indice: 0 };
    const gratis = resumirAprendizado(salvo, ultima, false, []);
    expect(gratis.retomada.licao).toBeNull();
    expect(gratis.paraEmitir).toBe(1);
    expect(gratis.trilhas.find((t) => t.slug === paga.slug)?.feitos).toBe(1);
    const pro = resumirAprendizado(salvo, ultima, true, []);
    expect(pro.retomada.licao?.trilha).toBe(paga.slug);
    expect(pro.trilhas.every((t) => t.liberada)).toBe(true);
  });
  it('conta somente exercícios atuais, sem transformar marcas legadas em certificado', () => {
    const salvo = {
      ...progresso(...chaves(gratuita.slug).slice(0, -1), 'removida/licao#0'),
      concluidas: Object.fromEntries(todasAsLicoes(gratuita).map((l) => [`${gratuita.slug}/${l.slug}`, '2026-11-03'])),
    };
    const painel = resumirAprendizado(salvo, null, false, []);
    expect(painel.feitos).toBe(chaves(gratuita.slug).length - 1);
    expect(painel.completas).toBe(0);
    expect(painel.paraEmitir).toBe(0);
  });
  it('distingue certificados emitidos, disponíveis e todas as trilhas concluídas', () => {
    const salvo = progresso(...trilhas.flatMap((t) => chaves(t.slug)));
    const painel = resumirAprendizado(salvo, null, true, [{ trilha: gratuita.slug, id: 'certificado-a' }]);
    expect(painel).toMatchObject({ completas: trilhas.length, certificados: 1, paraEmitir: trilhas.length - 1 });
    expect(painel.retomada.licao).toBeNull();
    expect(painel.trilhas[0]?.certificado).toBe('certificado-a');
    expect(painel.feitos).toBe(painel.total);
  });
});
