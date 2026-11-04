import { afterEach, describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { montarDocumento } from '@/engine/documento';
import { criarExecutor } from '@/engine/executor';
import { rodar } from '@/engine/rodar';
import { buscarProjeto } from './catalogo';

const projeto = buscarProjeto('ferramentas-do-javascript')!;
let janela: Window | undefined;
afterEach(async () => {
  await janela?.happyDOM.close();
  janela = undefined;
});

async function abrir(completo: boolean) {
  janela = new Window({ settings: { enableJavaScriptEvaluation: true } });
  montarDocumento(janela.document as unknown as Document, projeto.documentoInicial!);
  const executar = janela.eval(`(${criarExecutor.toString()})()`) as ReturnType<typeof criarExecutor>;
  const codigo = completo
    ? `${projeto.dadosIniciais}\n${projeto.etapas.map((etapa) => etapa.solucao).join('\n')}\n${projeto.demonstracao}`
    : projeto.codigoInicial;
  return rodar(codigo, projeto.testes, executar);
}
function texto(id: string) {
  return janela!.document.getElementById(id)!.textContent;
}
function alterar(id: string, valor: string) {
  const campo = janela!.document.getElementById(id)! as unknown as HTMLInputElement;
  campo.value = valor;
  campo.dispatchEvent(new janela!.Event('input', { bubbles: true }) as unknown as Event);
}

describe('calculadora com prévia interativa', () => {
  it('começa com produtos prontos, sem respostas aprovadas nem valores inventados', async () => {
    const resultado = await abrir(false);
    expect(resultado.erro).toBeNull();
    expect(resultado.testes.every((teste) => !teste.passou)).toBe(true);
    expect(texto('total')).toBe('—');
    expect(texto('estado')).toContain('Complete as quatro funções');
  });
  it('conecta as quatro funções à tela e recalcula após mudar quantidade e desconto', async () => {
    const resultado = await abrir(true);
    expect(resultado.erro).toBeNull();
    expect(resultado.testes.every((teste) => teste.passou)).toBe(true);
    expect(texto('total')?.replace(/\s/g, ' ')).toBe('R$ 112,05');
    expect(JSON.parse(texto('resumo-json')!)).toEqual({
      quantidadeItens: 6,
      subtotalCentavos: 12450,
      totalCentavos: 11205,
    });
    alterar('quantidade-0', '3');
    expect(texto('total')?.replace(/\s/g, ' ')).toBe('R$ 123,30');
    alterar('desconto', '100');
    expect(texto('total')?.replace(/\s/g, ' ')).toBe('R$ 0,00');
    expect(JSON.parse(texto('resumo-json')!).quantidadeItens).toBe(7);
    for (const id of ['quantidade-0', 'quantidade-1', 'quantidade-2']) alterar(id, '0');
    expect(JSON.parse(texto('resumo-json')!)).toEqual({ quantidadeItens: 0, subtotalCentavos: 0, totalCentavos: 0 });
  });
  it('explica campos fora dos limites e volta a calcular após a correção', async () => {
    await abrir(true);
    alterar('desconto', '101');
    expect(texto('total')).toBe('—');
    expect(texto('estado')).toContain('desconto de 0 a 100%');
    alterar('desconto', '0');
    expect(texto('total')?.replace(/\s/g, ' ')).toBe('R$ 124,50');
    alterar('quantidade-0', '-1');
    expect(texto('total')).toBe('—');
    alterar('quantidade-0', '2');
    expect(texto('estado')).toContain('Sua calculadora está funcionando');
  });
});
