import { describe, expect, it } from 'vitest';
import { identificarCanal } from './origem';

describe('origem por categorias fixas', () => {
  it.each([
    ['youtube', 'youtube'],
    ['YT', 'youtube'],
    ['ig', 'instagram'],
    ['tiktok', 'tiktok'],
    ['wa', 'whatsapp'],
    ['google', 'google'],
  ])('reconhece utm_source=%s', (origem, esperado) => {
    expect(identificarCanal(`?utm_source=${origem}&email=nao-enviar`, '', 'mundojavascript.com.br')).toBe(esperado);
  });
  it('não devolve parâmetros livres, nomes pessoais ou propriedades herdadas', () => {
    for (const fonte of ['nome@exemplo.com', 'constructor', '__proto__', 'campanha-desconhecida']) {
      expect(
        identificarCanal(
          `?utm_source=${encodeURIComponent(fonte)}`,
          'https://google.com/search',
          'mundojavascript.com.br',
        ),
      ).toBe('outro');
    }
  });
  it.each([
    ['https://m.youtube.com/watch?v=privado', 'youtube'],
    ['https://l.instagram.com/?u=privado', 'instagram'],
    ['https://www.google.com.br/search?q=privado', 'google'],
    ['https://web.whatsapp.com/', 'whatsapp'],
    ['https://www.mundojavascript.com.br/rascunho', 'direto'],
    ['https://youtube.com.exemplo.org/', 'outro'],
    ['https://exemplo.org/?utm_source=youtube', 'outro'],
    ['javascript:alert(1)', 'outro'],
    ['nao-e-url', 'outro'],
    ['', 'direto'],
  ])('classifica a referência sem guardar sua URL: %s', (referencia, esperado) => {
    expect(identificarCanal('', referencia, 'mundojavascript.com.br')).toBe(esperado);
  });
});
