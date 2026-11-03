import { beforeEach, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), ler: vi.fn(), pdf: vi.fn() }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/certificados', () => ({ lerCertificado: mocks.ler }));
vi.mock('@/servidor/certificado-pdf', () => ({ gerarPdfCertificado: mocks.pdf }));
import { GET } from './route';
const request = new Request('https://mundojavascript.com.br/api/conta/certificados/exemplo/pdf');
const params = { params: Promise.resolve({ id: 'exemplo' }) };
beforeEach(() => {
  vi.resetAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'a', emailVerified: true } });
  mocks.ler.mockResolvedValue({ id: 'exemplo', trilha: 'javascript-do-zero' });
  mocks.pdf.mockResolvedValue(new TextEncoder().encode('%PDF-teste'));
});
it('entrega somente o PDF da conta autenticada, sem cache nem indexação', async () => {
  const resposta = await GET(request, params);
  expect(mocks.ler).toHaveBeenCalledWith({}, 'a', 'exemplo');
  expect(resposta.headers.get('content-type')).toBe('application/pdf');
  expect(resposta.headers.get('content-disposition')).toContain('attachment;');
  expect(resposta.headers.get('cache-control')).toBe('private, no-store');
  expect(resposta.headers.get('x-robots-tag')).toBe('noindex, nofollow');
});
it('não gera PDF para visitante ou documento indisponível para essa conta', async () => {
  mocks.sessao.mockResolvedValue(null);
  expect((await GET(request, params)).status).toBe(401);
  mocks.sessao.mockResolvedValue({ user: { id: 'b', emailVerified: true } });
  mocks.ler.mockResolvedValue(null);
  expect((await GET(request, params)).status).toBe(404);
  expect(mocks.pdf).not.toHaveBeenCalled();
});
