// @vitest-environment happy-dom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FolhaProps } from './Folha';

const mocks = vi.hoisted(() => ({
  pronto: true,
  erro: undefined as string | undefined,
  feito: false,
  concluir: vi.fn(),
  evento: vi.fn(),
  folha: null as FolhaProps | null,
}));
vi.mock('@/progresso/armazem', () => ({
  useProgresso: () => ({ pronto: mocks.pronto, erro: mocks.erro, exercicioConcluido: () => mocks.feito }),
  concluirExercicio: mocks.concluir,
}));
vi.mock('@/estudo/eventos', () => ({ registrarEvento: mocks.evento }));
vi.mock('./NarracaoExercicio', () => ({ NarracaoExercicio: () => null }));
vi.mock('./Folha', () => ({
  Folha: (props: FolhaProps) => {
    mocks.folha = props;
    return (
      <div>
        <button onClick={props.aoConcluir}>Simular acerto</button>
        {props.enunciado}
      </div>
    );
  },
}));
import { PrimeiraAtividade } from './PrimeiraAtividade';

let container: HTMLDivElement;
let root: Root;
const props = {
  totalExercicios: 6,
  exercicio: { enunciado: <p>Duas mensagens</p>, codigoInicial: '', testes: [], solucao: '' },
  dicas: ['Uma linha por comando.', 'Confira as aspas.'],
};
async function renderizar() {
  await act(async () => root.render(<PrimeiraAtividade {...props} />));
}
async function clicar(texto: string) {
  const botao = [...container.querySelectorAll('button')].find((alvo) => alvo.textContent?.includes(texto));
  expect(botao, texto).toBeDefined();
  await act(async () => botao!.click());
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});
  mocks.pronto = true;
  mocks.erro = undefined;
  mocks.feito = false;
  mocks.folha = null;
  mocks.concluir.mockReset().mockResolvedValue(undefined);
  mocks.evento.mockReset();
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('primeira atividade guiada', () => {
  it('só monta o editor após a explicação e usa o rascunho existente, sem preencher a resposta', async () => {
    await renderizar();
    expect(mocks.folha).toBeNull();
    await clicar('Começar a atividade');
    expect(mocks.folha?.chaveRascunho).toBe('javascript-do-zero/ola-mundo');
    expect(mocks.folha?.codigoInicial).toBe('');
    expect(mocks.evento).toHaveBeenCalledWith(
      { tipo: 'exercicio_aberto', posicao: { trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 } },
      expect.any(String),
    );
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Praticar seu primeiro código');
  });

  it('revela uma dica por vez sem concluir o exercício nem remontar o editor', async () => {
    await renderizar();
    await clicar('Começar a atividade');
    expect(container.textContent).not.toContain('Uma linha por comando.');
    await clicar('Preciso de uma dica');
    expect(container.textContent).toContain('Uma linha por comando.');
    expect(container.textContent).not.toContain('Confira as aspas.');
    await clicar('Ver próxima dica');
    expect(container.textContent).toContain('Confira as aspas.');
    expect(mocks.concluir).not.toHaveBeenCalled();
    expect(mocks.evento).toHaveBeenCalledTimes(1);
  });

  it('conta o acerto como um dos seis exercícios da lição, sem concluir a lição inteira', async () => {
    await renderizar();
    await clicar('Começar a atividade');
    await clicar('Simular acerto');
    expect(mocks.concluir).toHaveBeenCalledWith('javascript-do-zero', 'ola-mundo', 0, 6);
    expect(container.querySelector('[aria-current="step"]')?.textContent).toContain('Conseguir');
  });

  it('oferece continuidade a quem já concluiu e permite revisão voluntária', async () => {
    mocks.feito = true;
    await renderizar();
    expect(container.textContent).toContain('Você já concluiu esta atividade.');
    expect(container.querySelector('a.botao')?.getAttribute('href')).toBe('/trilhas/javascript-do-zero/ola-mundo');
    expect(mocks.concluir).not.toHaveBeenCalled();
    await clicar('Praticar novamente');
    expect(mocks.folha).not.toBeNull();
  });

  it('espera a leitura do progresso e libera a prática mesmo quando a sincronização falha', async () => {
    mocks.pronto = false;
    await renderizar();
    expect(container.querySelector('button')?.disabled).toBe(true);
    mocks.erro = 'offline';
    await renderizar();
    await clicar('Começar a atividade');
    expect(mocks.folha).not.toBeNull();
  });
});
