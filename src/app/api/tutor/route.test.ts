import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as tutor from '@/servidor/tutor';

const mocks = vi.hoisted(() => ({
  reservar: vi.fn(),
  historico: vi.fn(),
  franquia: vi.fn(),
  devolver: vi.fn(),
  acesso: vi.fn(),
}));
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/visitante', () => ({ visitante: async () => 'visitante-teste' }));
vi.mock('@/servidor/limites-tutor', () => ({ reservarPergunta: mocks.reservar }));
vi.mock('@/servidor/historico-tutor', () => ({ historicoDoTutor: mocks.historico }));
vi.mock('@/servidor/franquia-tutor', () => ({ reservarFranquia: mocks.franquia }));
vi.mock('@/servidor/acesso-conteudo', () => ({ podeAcessarContexto: mocks.acesso }));
import { POST } from './route';

const dados = {
  contexto: { livre: true },
  codigo: 'let x = 1;',
  diagnostico: '',
  mensagens: [{ papel: 'usuario', texto: 'Me explique' }],
};
function pedido(valor: unknown = dados, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/tutor', {
    method: 'POST',
    headers: { origin, 'content-type': 'application/json' },
    body: JSON.stringify(valor),
  });
}
beforeEach(() => {
  vi.stubEnv('GEMINI_API_KEY', 'teste');
  mocks.reservar.mockReset().mockResolvedValue(undefined);
  mocks.historico.mockReset().mockResolvedValue(null);
  mocks.devolver.mockReset().mockResolvedValue(undefined);
  mocks.franquia.mockReset().mockResolvedValue(mocks.devolver);
  mocks.acesso.mockReset().mockResolvedValue(true);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('API do tutor', () => {
  it('bloqueia contexto Pro antes de consumir cotas ou chamar o Gemini', async () => {
    mocks.acesso.mockResolvedValue(false);
    const gerar = vi.spyOn(tutor, 'responderTutor');
    expect((await POST(pedido({ ...dados, contexto: { projeto: 'javascript-do-zero' }, pro: true }))).status).toBe(403);
    expect(mocks.acesso).toHaveBeenCalledWith({}, 'visitante-teste', { projeto: 'javascript-do-zero' });
    expect(mocks.reservar).not.toHaveBeenCalled();
    expect(mocks.franquia).not.toHaveBeenCalled();
    expect(gerar).not.toHaveBeenCalled();
  });
  it('devolve a franquia mensal quando o Gemini falha', async () => {
    vi.spyOn(tutor, 'responderTutor').mockRejectedValue(new tutor.ErroTutor(503, 'Indisponível.'));
    expect((await POST(pedido())).status).toBe(503);
    expect(mocks.devolver).toHaveBeenCalledOnce();
  });
  it('não chama Gemini quando a franquia mensal terminou', async () => {
    mocks.franquia.mockRejectedValue(new tutor.ErroTutor(429, 'Franquia esgotada.'));
    const gerar = vi.spyOn(tutor, 'responderTutor');
    expect((await POST(pedido())).status).toBe(429);
    expect(gerar).not.toHaveBeenCalled();
  });
  it('bloqueia o iframe e dados inválidos antes de consumir cota', async () => {
    expect((await POST(pedido(dados, 'null'))).status).toBe(403);
    expect((await POST(pedido({ ...dados, codigo: 'x'.repeat(20001) }))).status).toBe(400);
    expect((await POST(pedido({ ...dados, codigo: 'x'.repeat(160001) }))).status).toBe(413);
    expect(mocks.reservar).not.toHaveBeenCalled();
  });
  it('não consome cota quando o serviço não está configurado', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    expect((await POST(pedido())).status).toBe(503);
    expect(mocks.reservar).not.toHaveBeenCalled();
  });
  it('reserva cota e responde sem permitir cache', async () => {
    const gerar = vi.spyOn(tutor, 'responderTutor').mockResolvedValue('Uma dica útil.');
    const resposta = await POST(pedido());
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ resposta: 'Uma dica útil.', apoio: { nivel: 'pista', historico: null } });
    expect(resposta.headers.get('cache-control')).toContain('no-store');
    expect(mocks.reservar).toHaveBeenCalledWith({}, 'visitante-teste');
    expect(gerar).toHaveBeenCalledOnce();
  });
  it('não chama Gemini quando o limite foi atingido', async () => {
    mocks.reservar.mockRejectedValue(new tutor.ErroTutor(429, 'Limite atingido.'));
    const gerar = vi.spyOn(tutor, 'responderTutor');
    const resposta = await POST(pedido());
    expect(resposta.status).toBe(429);
    expect(resposta.headers.get('retry-after')).toBe('60');
    expect(gerar).not.toHaveBeenCalled();
    expect(mocks.historico).not.toHaveBeenCalled();
  });
  it('consulta apenas a identidade da sessão e ignora histórico inventado no corpo', async () => {
    const resumo = { tentativas: 3, semAcerto: 2, ajudas: 1, topicosParaRetomar: [] };
    mocks.historico.mockResolvedValue(resumo);
    const gerar = vi.spyOn(tutor, 'responderTutor').mockResolvedValue('Uma explicação.');
    const resposta = await POST(
      pedido({ ...dados, nivelAjuda: 'explicacao', visitante: 'outra-pessoa', historico: { tentativas: 999 } }),
    );
    expect(resposta.status).toBe(200);
    expect(mocks.historico).toHaveBeenCalledWith({}, 'visitante-teste', dados.contexto);
    expect(gerar.mock.calls[0]?.[2]).toEqual(resumo);
    expect((await resposta.json()).apoio).toEqual({ nivel: 'explicacao', historico: resumo });
  });
  it('mantém a ajuda disponível quando a leitura do histórico falha', async () => {
    mocks.historico.mockRejectedValue(new Error('falha na consulta'));
    const gerar = vi.spyOn(tutor, 'responderTutor').mockResolvedValue('Uma pista.');
    expect((await POST(pedido())).status).toBe(200);
    expect(gerar.mock.calls[0]?.[2]).toBeNull();
  });
});
