import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConteudoPro } from '@/components/ConteudoPro';
import { buscarProjeto } from '@/projetos/catalogo';
const mocks = vi.hoisted(() => ({ pro: vi.fn() }));
vi.mock('@/servidor/acesso-conteudo', () => ({ temProAtual: mocks.pro }));
vi.mock('@/components/ProjetoInterativo', () => ({ ProjetoInterativo: () => null }));
import Pagina from './page';
beforeEach(() => {
  mocks.pro.mockReset().mockResolvedValue(false);
});
describe('projetos exclusivos do Pro', () => {
  it('protege inclusive o projeto da trilha gratuita antes de enviar código ou testes', async () => {
    const resultado = await Pagina({ params: Promise.resolve({ trilha: 'javascript-do-zero' }) });
    expect(resultado.type).toBe(ConteudoPro);
    expect(JSON.stringify(resultado)).not.toContain(buscarProjeto('javascript-do-zero')!.codigoInicial);
    mocks.pro.mockResolvedValue(true);
    const liberado = await Pagina({ params: Promise.resolve({ trilha: 'javascript-do-zero' }) });
    expect(liberado.type).not.toBe(ConteudoPro);
  });
  it('protege código, testes e documento da calculadora de compras', async () => {
    const resultado = await Pagina({ params: Promise.resolve({ trilha: 'ferramentas-do-javascript' }) });
    const projeto = buscarProjeto('ferramentas-do-javascript')!;
    expect(resultado.type).toBe(ConteudoPro);
    expect(JSON.stringify(resultado)).not.toContain(projeto.codigoInicial);
    expect(JSON.stringify(resultado)).not.toContain(projeto.documentoInicial!.html);
    mocks.pro.mockResolvedValue(true);
    const liberado = await Pagina({ params: Promise.resolve({ trilha: 'ferramentas-do-javascript' }) });
    expect(liberado.type).not.toBe(ConteudoPro);
  });
});
