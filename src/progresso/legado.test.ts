import { afterEach, describe, expect, it, vi } from 'vitest';
import { importarLegado } from './legado';

afterEach(() => vi.unstubAllGlobals());

function navegador(valores: Record<string, string>) {
  const armazenamento = { ...valores } as Record<string, unknown>;
  armazenamento.getItem = (chave: string) => armazenamento[chave] ?? null;
  armazenamento.removeItem = (chave: string) => {
    delete armazenamento[chave];
  };
  vi.stubGlobal('window', { localStorage: armazenamento });
  return armazenamento;
}

describe('importação única do armazenamento antigo', () => {
  it('remove apenas chaves confirmadas e preserva outros aplicativos', async () => {
    const salvo = navegador({ 'rabisco:rascunho:rascunho-livre': 'meu código', 'outro-app': 'manter' });
    const enviar = vi.fn(async () => {
      expect(salvo['rabisco:rascunho:rascunho-livre']).toBe('meu código');
      return true;
    });
    await importarLegado(enviar);
    expect(enviar).toHaveBeenCalledWith({ tipo: 'importar-rascunho', chave: 'rascunho-livre', codigo: 'meu código' });
    expect(salvo['rabisco:rascunho:rascunho-livre']).toBeUndefined();
    expect(salvo['outro-app']).toBe('manter');
  });
  it('mantém o original se o servidor falhar ou não reconhecer a chave', async () => {
    const salvo = navegador({ 'rabisco:rascunho:antigo': 'preservar' });
    await importarLegado(async () => false);
    expect(salvo['rabisco:rascunho:antigo']).toBe('preservar');
    await expect(
      importarLegado(async () => {
        throw new Error('sem rede');
      }),
    ).rejects.toThrow('sem rede');
    expect(salvo['rabisco:rascunho:antigo']).toBe('preservar');
  });
  it('funciona quando o acesso ao localStorage está bloqueado', async () => {
    vi.stubGlobal('window', {
      get localStorage() {
        throw new Error('bloqueado');
      },
    });
    const enviar = vi.fn();
    await importarLegado(enviar);
    expect(enviar).not.toHaveBeenCalled();
  });
});
