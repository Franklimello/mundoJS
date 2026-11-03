import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  sessao: vi.fn(),
  ler: vi.fn(),
  publicar: vi.fn(),
  retirar: vi.fn(),
  assinatura: vi.fn(),
}));
vi.mock('@/servidor/cobranca', () => ({ lerAssinatura: mocks.assinatura }));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/sessao', () => ({ sessaoAtual: mocks.sessao, identidadeConta: (id: string) => `conta:${id}` }));
vi.mock('@/servidor/projetos', () => ({
  publicacaoDoProjeto: mocks.ler,
  publicarProjeto: mocks.publicar,
  retirarProjeto: mocks.retirar,
}));
import { GET, POST } from './route';
const dados = {
  trilha: 'listas-e-objetos',
  acao: 'publicar',
  codigo: 'console.log("oi");',
  identidadeEsperada: 'conta:a',
};
function pedido(corpo: unknown = dados, origin = 'http://localhost:3001') {
  return new Request('http://localhost:3001/api/projetos/compartilhar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', origin },
    body: JSON.stringify(corpo),
  });
}
beforeEach(() => {
  vi.clearAllMocks();
  mocks.sessao.mockResolvedValue({ user: { id: 'a' } });
  mocks.assinatura.mockResolvedValue({ pro: true });
  mocks.ler.mockResolvedValue(null);
  mocks.publicar.mockResolvedValue({ id: 'a'.repeat(48), atualizadoEm: '2026-11-03' });
});
describe('compartilhamento de projetos', () => {
  it('exige Pro para publicar, mas permite retirar links após o cancelamento', async () => {
    mocks.assinatura.mockResolvedValue({ pro: false });
    expect((await POST(pedido())).status).toBe(403);
    expect(mocks.publicar).not.toHaveBeenCalled();
    expect((await POST(pedido({ ...dados, acao: 'retirar' }))).status).toBe(200);
    expect(mocks.retirar).toHaveBeenCalledWith({}, 'a', 'listas-e-objetos');
  });
  it('exige conta e impede publicação iniciada por uma origem externa', async () => {
    expect((await POST(pedido(dados, 'https://externo.example'))).status).toBe(403);
    mocks.sessao.mockResolvedValue(null);
    expect((await POST(pedido())).status).toBe(401);
    expect(mocks.publicar).not.toHaveBeenCalled();
  });
  it('rejeita troca de sessão e usa o dono verificado, ignorando dono enviado no corpo', async () => {
    expect((await POST(pedido({ ...dados, identidadeEsperada: 'conta:b' }))).status).toBe(409);
    const resposta = await POST(pedido({ ...dados, usuario_id: 'b', id: 'link-de-b' }));
    expect(resposta.status).toBe(200);
    expect(mocks.publicar).toHaveBeenCalledWith({}, 'a', 'listas-e-objetos', dados.codigo);
    expect(resposta.headers.get('cache-control')).toContain('no-store');
  });
  it('não permite projeto desconhecido, código grande ou JSON inválido', async () => {
    expect((await POST(pedido({ ...dados, trilha: '../fora' }))).status).toBe(400);
    expect((await POST(pedido({ ...dados, codigo: 'a'.repeat(200001) }))).status).toBe(400);
    expect((await POST(pedido({ ...dados, codigo: 'a'.repeat(1300001) }))).status).toBe(413);
    expect((await POST(pedido(null))).status).toBe(400);
    expect(mocks.publicar).not.toHaveBeenCalled();
  });
  it('consulta e retira somente links da sessão atual', async () => {
    const endereco = 'http://localhost:3001/api/projetos/compartilhar?trilha=listas-e-objetos';
    expect((await GET(new Request(endereco, { headers: { 'X-MundoJS-Conta': 'b' } }))).status).toBe(409);
    expect((await GET(new Request(endereco, { headers: { 'X-MundoJS-Conta': 'a' } }))).status).toBe(200);
    expect(mocks.ler).toHaveBeenCalledWith({}, 'a', 'listas-e-objetos');
    expect((await POST(pedido({ ...dados, acao: 'retirar', usuario_id: 'b' }))).status).toBe(200);
    expect(mocks.retirar).toHaveBeenCalledWith({}, 'a', 'listas-e-objetos');
  });
});
