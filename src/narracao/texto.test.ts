import { describe, expect, it } from 'vitest';
import type { Exercicio } from '@/conteudo/tipos';
import { dividirNarracao, narracaoDoExercicio } from './texto';

describe('roteiro de áudio do exercício', () => {
  it('inclui o objetivo e orientação editorial sem ler dicas ou solução', () => {
    const exercicio: Exercicio = {
      titulo: 'Primeiro programa',
      enunciado: [{ tipo: 'p', texto: 'Use **duas linhas** com `console.log`.' }],
      explicacaoAudio: 'Pense na ordem das mensagens.',
      dicas: ['DICA PRIVADA'],
      solucao: 'SOLUÇÃO PRIVADA',
      codigoInicial: 'CÓDIGO DO EDITOR',
      testes: [],
    };
    const roteiro = narracaoDoExercicio(exercicio, 1, 4);
    expect(roteiro).toContain('Exercício 2 de 4. Primeiro programa.');
    expect(roteiro).toContain('Use duas linhas com console ponto log.');
    expect(roteiro).toContain('Pense na ordem das mensagens.');
    expect(roteiro).not.toMatch(/PRIVADA|CÓDIGO DO EDITOR|\*\*|`/);
  });
  it('preserva listas, notas e saída de exemplos e pronuncia asteriscos explícitos', () => {
    const roteiro = narracaoDoExercicio(
      {
        enunciado: [
          { tipo: 'lista', itens: ['Mostre `*`.', 'Depois `***`.'] },
          { tipo: 'nota', texto: 'Respeite a ordem.' },
          { tipo: 'codigo', codigo: 'console.log(2);', saida: '2' },
        ],
      },
      0,
      1,
    );
    expect(roteiro).toContain('Item 1. Mostre 1 asterisco.');
    expect(roteiro).toContain('Item 2. Depois 3 asteriscos.');
    expect(roteiro).toContain('Respeite a ordem.');
    expect(roteiro).toContain('Esse exemplo mostra: 2');
  });
  it('divide falas longas sem perder palavras, inclusive palavras sem espaços', () => {
    for (const texto of ['', 'Curto.', 'Uma frase completa. '.repeat(50), 'a'.repeat(500)]) {
      const partes = dividirNarracao(texto);
      expect(partes.every((parte) => parte.length <= 180 && parte.length > 0)).toBe(true);
      expect(partes.join('').replace(/\s/g, '')).toBe(texto.replace(/\s/g, ''));
    }
  });
});
