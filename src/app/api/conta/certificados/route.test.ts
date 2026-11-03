import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ sessao: vi.fn(), emitir: vi.fn() }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/certificados', () => ({ emitirCertificado: mocks.emitir }));
import { POST } from './route';

function pedido(
  body = JSON.stringify({ trilha: 'javascript-do-zero', nome: 'Aluna' }),
  extra: Record<string, string> = {},
) {
  return new Request('https://mundojavascript.com.br/api/conta/certificados', {
    method: 'POST',
    headers: {
      origin: 'https://mundojavascript.com.br',
      'content-type': 'application/json',
      'x-mundojs-conta': 'a',
      ...extra,
    },
    body,
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'a', emailVerified: true } });
  mocks.emitir.mockResolvedValue({ id: 'certificado' });
});
describe('emissão autenticada', () => {
  it('usa somente a identidade da sessão, nunca um usuário indicado no JSON', async () => {
    const resposta = await POST(
      pedido(JSON.stringify({ trilha: 'javascript-do-zero', nome: 'Aluna', usuarioId: 'b', concluido: true })),
    );
    expect(resposta.status).toBe(200);
    expect(mocks.emitir).toHaveBeenCalledWith({}, 'a', 'javascript-do-zero', 'Aluna');
    expect(resposta.headers.get('cache-control')).toBe('private, no-store');
  });
  it('recusa origem externa, visitante, troca de conta e e-mail não confirmado', async () => {
    expect((await POST(pedido(undefined, { origin: 'https://externo.example' }))).status).toBe(403);
    expect((await POST(pedido(undefined, { 'x-mundojs-conta': 'b' }))).status).toBe(409);
    mocks.sessao.mockResolvedValue(null);
    expect((await POST(pedido())).status).toBe(401);
    mocks.sessao.mockResolvedValue({ user: { id: 'a', emailVerified: false } });
    expect((await POST(pedido())).status).toBe(401);
    expect(mocks.emitir).not.toHaveBeenCalled();
  });
  it('recusa corpo inválido, formato incorreto e conteúdo excessivo', async () => {
    expect((await POST(pedido('null'))).status).toBe(400);
    expect((await POST(pedido('{'))).status).toBe(400);
    expect((await POST(pedido(undefined, { 'content-type': 'text/plain' }))).status).toBe(415);
    expect((await POST(pedido('a'.repeat(2049)))).status).toBe(413);
    expect(mocks.emitir).not.toHaveBeenCalled();
  });
  it('informa progresso incompleto e falha temporária sem emitir certificado', async () => {
    mocks.emitir.mockRejectedValue(new Error('trilha-incompleta'));
    expect((await POST(pedido())).status).toBe(409);
    mocks.emitir.mockRejectedValue(new Error('nome-invalido'));
    expect((await POST(pedido())).status).toBe(400);
    mocks.emitir.mockRejectedValue(new Error('banco indisponível'));
    expect((await POST(pedido())).status).toBe(503);
  });
});
