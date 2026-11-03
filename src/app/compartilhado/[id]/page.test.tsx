import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/servidor/banco', () => ({ banco: () => ({}) }));
vi.mock('@/servidor/projetos', () => ({
  lerProjetoCompartilhado: async () => ({
    trilha: 'listas-e-objetos',
    codigo: '<script>alert("x")</script>\n<img src=x onerror=alert(1)>',
    atualizadoEm: '2026-11-03',
  }),
}));
import Compartilhado from './page';
describe('leitura de projeto compartilhado', () => {
  it('exibe código como texto escapado e nunca monta um executor', async () => {
    const html = renderToStaticMarkup(await Compartilhado({ params: Promise.resolve({ id: 'a'.repeat(48) }) }));
    expect(html).not.toMatch(/<script|<img|<iframe/);
    expect(html).toContain('&lt;');
    expect(html).toContain('somente leitura');
    expect(html).toContain('Código compartilhado');
  });
});
