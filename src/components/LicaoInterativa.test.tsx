import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const progresso = vi.hoisted(() => ({
  pronto: true,
  erro: undefined as string | undefined,
  concluida: vi.fn(),
  exercicioConcluido: vi.fn(),
}));
vi.mock('@/progresso/armazem', () => ({ useProgresso: () => progresso, concluirExercicio: vi.fn() }));
vi.mock('./Folha', () => ({ Folha: ({ rotuloDoEditor }: { rotuloDoEditor: string }) => <div>{rotuloDoEditor}</div> }));
import { LicaoInterativa } from './LicaoInterativa';

const props = {
  trilha: 't',
  licao: 'l',
  antes: <p>Explicação</p>,
  depois: <p>Navegação</p>,
  proxima: null,
  exercicios: [0, 1, 2].map((i) => ({
    titulo: `Título ${i + 1}`,
    enunciado: <p>Enunciado {i + 1}</p>,
    dicas: null,
    codigoInicial: '',
    testes: [],
    solucao: '',
  })),
};
beforeEach(() => {
  progresso.pronto = true;
  progresso.erro = undefined;
  progresso.concluida.mockReset().mockReturnValue(false);
  progresso.exercicioConcluido.mockReset().mockImplementation((_t: string, _l: string, indice: number) => indice === 0);
});
describe('abertura da lição', () => {
  it('seleciona o primeiro exercício pendente em vez de voltar ao primeiro', () => {
    const html = renderToStaticMarkup(<LicaoInterativa {...props} />);
    expect(html).toContain('Editor de código do exercício 2');
    expect(html).toContain('Enunciado 2');
  });
  it('abre uma lição concluída no início para revisão', () => {
    progresso.concluida.mockReturnValue(true);
    const html = renderToStaticMarkup(<LicaoInterativa {...props} />);
    expect(html).toContain('Editor de código do exercício 1');
  });
  it('espera o progresso antes de montar um editor e ainda permite estudar se ele falhar', () => {
    progresso.pronto = false;
    expect(renderToStaticMarkup(<LicaoInterativa {...props} />)).toContain('Carregando seu próximo exercício');
    progresso.erro = 'offline';
    expect(renderToStaticMarkup(<LicaoInterativa {...props} />)).toContain('Editor de código do exercício');
  });
});
