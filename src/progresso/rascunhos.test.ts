import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ carregar: vi.fn(), salvar: vi.fn(), identidade: vi.fn() }));
vi.mock('./api', () => ({
  carregarDados: mocks.carregar,
  salvarDados: mocks.salvar,
  identidadeAtual: mocks.identidade,
}));
import { lerRascunho, salvarRascunho } from './rascunhos';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.salvar.mockResolvedValue(undefined);
});
describe('dono do rascunho', () => {
  it('devolve o dono junto com o código e não troca a identidade da gravação quando outra conta entra', async () => {
    mocks.carregar.mockResolvedValue({ identidade: 'conta:a', rascunhos: { livre: 'código da conta A' } });
    const salvo = await lerRascunho('livre');
    mocks.identidade.mockReturnValue('conta:b');
    await salvarRascunho('livre', salvo.codigo || '', salvo.identidade);
    expect(mocks.salvar).toHaveBeenCalledWith(
      { tipo: 'rascunho', chave: 'livre', codigo: 'código da conta A' },
      'conta:a',
    );
  });
});
