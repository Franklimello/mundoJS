import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';
import { resumirAprendizado } from '@/estudo/painel';
import { PROGRESSO_VAZIO } from '@/progresso/tipos';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), painel: vi.fn() }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/painel-aprendizado', () => ({ carregarPainelAprendizado: mocks.painel }));
vi.mock('@/components/AtualizarAprendizado', () => ({
  AtualizarAprendizado: () => <button>Atualizar progresso</button>,
}));
import PaginaAprendizado from './page';

beforeEach(() => {
  vi.resetAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'aluno-a', name: 'Júlia Melo' } });
  mocks.painel.mockResolvedValue({
    ...resumirAprendizado(PROGRESSO_VAZIO, null, false, []),
    dias: [{ dia: '2026-11-03', ativo: false }],
  });
});
it('pede login ao visitante sem consultar o progresso de ninguém', async () => {
  mocks.sessao.mockResolvedValue(null);
  const html = renderToStaticMarkup(await PaginaAprendizado());
  expect(html).toContain('Entrar na minha conta');
  expect(mocks.painel).not.toHaveBeenCalled();
});
it('oferece o próximo passo gratuito, certificado e navegação para a conta autenticada', async () => {
  const html = renderToStaticMarkup(await PaginaAprendizado());
  expect(mocks.painel).toHaveBeenCalledWith({}, 'aluno-a');
  expect(html).toContain('Olá, Júlia Melo.');
  expect(html).toContain('Começar exercício');
  expect(html).toContain('href="/conta/certificados"');
  expect(html).toContain('Conhecer Pro');
  expect(html).toContain('horário de Brasília');
});
it('mostra recuperação de falha sem apresentar progresso zerado como se fosse real', async () => {
  mocks.painel.mockRejectedValue(new Error('indisponível'));
  const html = renderToStaticMarkup(await PaginaAprendizado());
  expect(html).toContain('role="alert"');
  expect(html).toContain('Atualizar progresso');
  expect(html).not.toContain('Exercícios concluídos');
  expect(html).not.toContain('indisponível');
});
it('permite tentar novamente se a verificação de sessão estiver indisponível', async () => {
  mocks.sessao.mockRejectedValue(new Error('erro de conexão interno'));
  const html = renderToStaticMarkup(await PaginaAprendizado());
  expect(html).toContain('Atualizar progresso');
  expect(html).not.toContain('erro de conexão interno');
  expect(mocks.painel).not.toHaveBeenCalled();
});
