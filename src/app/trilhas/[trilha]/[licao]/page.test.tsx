import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConteudoPro } from '@/components/ConteudoPro';
import { LicaoInterativa } from '@/components/LicaoInterativa';
import { buscarLicao } from '@/conteudo';
const mocks = vi.hoisted(() => ({ pro: vi.fn() }));
vi.mock('@/servidor/acesso-conteudo', () => ({ temProAtual: mocks.pro }));
vi.mock('@/components/LicaoInterativa', () => ({ LicaoInterativa: () => null }));
import Pagina from './page';
beforeEach(() => {
  mocks.pro.mockReset().mockResolvedValue(false);
});
describe('página de lição protegida no servidor', () => {
  const pedido = (trilha: string, licao: string) => ({ params: Promise.resolve({ trilha, licao }) });
  it('não envia enunciados, testes, soluções ou código de uma lição Pro ao gratuito', async () => {
    const trilha = 'listas-e-objetos';
    const licao = 'desafio-final';
    const resultado = await Pagina(pedido(trilha, licao));
    expect(resultado.type).toBe(ConteudoPro);
    expect(JSON.stringify(resultado)).not.toContain(buscarLicao(trilha, licao)!.licao.exercicios[0]!.solucao);
    expect(resultado.props).not.toHaveProperty('exercicios');
  });
  it('entrega atividades ao Pro e mantém a primeira trilha aberta sem consultar assinatura', async () => {
    const gratis = await Pagina(pedido('javascript-do-zero', 'variaveis'));
    expect(gratis.type).toBe(LicaoInterativa);
    expect(mocks.pro).not.toHaveBeenCalled();
    mocks.pro.mockResolvedValue(true);
    const pro = await Pagina(pedido('listas-e-objetos', 'desafio-final'));
    expect(pro.type).toBe(LicaoInterativa);
    expect(pro.props.exercicios.length).toBeGreaterThan(0);
  });
});
