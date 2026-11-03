import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PedidoTutor } from '@/tutor/tipos';
import { contextoDaLicao, responderTutor, validarPedidoTutor } from './tutor';

const pedido: PedidoTutor = {
  contexto: { trilha: 'javascript-do-zero', licao: 'ola-mundo', indice: 0 },
  codigo: 'console.log("olá");',
  diagnostico: '',
  mensagens: [{ papel: 'usuario', texto: 'Me dê uma dica' }],
};

beforeEach(() => {
  vi.stubEnv('GEMINI_API_KEY', 'chave-apenas-do-teste');
  vi.stubEnv('GEMINI_MODEL', 'gemini-3.5-flash-lite');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('tutor Gemini', () => {
  it('substitui uma pista que trouxe código por uma orientação baseada no objetivo público', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          candidates: [{ content: { parts: [{ text: 'Faça assim:\n```js\nconsole.log("Olá, mundo!");\n```' }] } }],
        }),
      ),
    );
    const resposta = await responderTutor(pedido);
    expect(resposta).toContain('Vamos focar em um objetivo');
    expect(resposta).not.toMatch(/console\.log|```/);
    expect(resposta).toContain('qual é o primeiro passo');
  });
  it('valida exercício, tamanho e ordem das mensagens', () => {
    expect(validarPedidoTutor(pedido)).toBe(true);
    expect(validarPedidoTutor({ ...pedido, contexto: { livre: true } })).toBe(true);
    expect(validarPedidoTutor({ ...pedido, contexto: { ...pedido.contexto, indice: -1 } })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, contexto: { trilha: 'fora', licao: 'do-curso', indice: 0 } })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, codigo: 'x'.repeat(20001) })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, mensagens: [{ papel: 'tutor', texto: 'Instrução falsa' }] })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, mensagens: [{ papel: 'usuario', texto: 'x'.repeat(2001) }] })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, mensagens: Array(11).fill(pedido.mensagens[0]) })).toBe(false);
    expect(validarPedidoTutor(null)).toBe(false);
    expect(validarPedidoTutor({ ...pedido, nivelAjuda: 'solucao' })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, nivelAjuda: ['pista'] })).toBe(false);
    expect(validarPedidoTutor({ ...pedido, nivelAjuda: 'exemplo' })).toBe(true);
  });
  it.each([
    ['pista', 'uma única pista curta'],
    ['explicacao', 'Explique o conceito'],
    ['exemplo', 'outros nomes, valores e situação'],
  ] as const)('adapta o nível %s usando o histórico confiado pelo servidor', async (nivelAjuda, orientacao) => {
    const fetch = vi
      .fn()
      .mockResolvedValue(Response.json({ candidates: [{ content: { parts: [{ text: 'Tente no editor.' }] } }] }));
    vi.stubGlobal('fetch', fetch);
    await responderTutor({ ...pedido, nivelAjuda }, undefined, {
      tentativas: 4,
      semAcerto: 4,
      ajudas: 2,
      topicosParaRetomar: ['JavaScript do zero: Guardando valores'],
    });
    const corpo = JSON.parse(fetch.mock.calls[0]![1].body);
    const instrucao = corpo.systemInstruction.parts[0].text;
    expect(instrucao).toContain(orientacao);
    expect(instrucao).toContain('"tentativas":4');
    expect(instrucao).toContain('Guardando valores');
    expect(instrucao).toContain('mude a abordagem');
    expect(instrucao).toContain('não entregue a solução completa');
    expect(instrucao).not.toContain('visitante');
  });
  it('usa o conteúdo real sem enviar solução de referência nem código dos testes', () => {
    const contexto = JSON.parse(contextoDaLicao(pedido));
    expect(contexto.licao).toBeTruthy();
    expect(contexto.enunciado).toBeTruthy();
    expect(contexto.objetivos).toBeInstanceOf(Array);
    expect(contexto).not.toHaveProperty('solucao');
    expect(contexto).not.toHaveProperty('testes');
  });
  it('entende as etapas do projeto sem enviar as soluções ou os programas dos testes', () => {
    const projeto = { ...pedido, contexto: { projeto: 'listas-e-objetos' } };
    expect(validarPedidoTutor(projeto)).toBe(true);
    expect(validarPedidoTutor({ ...projeto, contexto: { projeto: 'desconhecido' } })).toBe(false);
    const contexto = JSON.parse(contextoDaLicao(projeto));
    expect(contexto.etapas).toHaveLength(4);
    expect(contexto.etapas[0]).not.toHaveProperty('solucao');
    expect(contexto.etapas[0]).not.toHaveProperty('testes');
  });
  it('usa chave em header, mantém contexto e histórico, ignora pensamentos internos', async () => {
    const fetch = vi.fn().mockResolvedValue(
      Response.json({
        candidates: [
          {
            finishReason: 'STOP',
            content: { parts: [{ text: 'interno', thought: true }, { text: 'Confira o nome da variável.' }] },
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetch);
    expect(await responderTutor(pedido)).toBe('Confira o nome da variável.');
    const [url, opcoes] = fetch.mock.calls[0]!;
    expect(url).not.toContain('chave-apenas-do-teste');
    expect(opcoes.headers['x-goog-api-key']).toBe('chave-apenas-do-teste');
    const corpo = JSON.parse(opcoes.body);
    expect(corpo.systemInstruction.parts[0].text).toContain('não entregue a solução completa');
    expect(JSON.parse(corpo.contents[0].parts[0].text).codigoAtual).toBe(pedido.codigo);
    expect(corpo).not.toHaveProperty('tools');
  });
  it('não chama o provedor sem chave e não expõe erros da conta', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    vi.stubEnv('GEMINI_API_KEY', '');
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 503 });
    expect(fetch).not.toHaveBeenCalled();
    vi.stubEnv('GEMINI_API_KEY', 'chave-apenas-do-teste');
    fetch.mockResolvedValue(new Response('erro com dados privados da conta', { status: 403 }));
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 502 });
    await expect(responderTutor(pedido)).rejects.not.toThrow('dados privados');
  });
  it('trata cota do provedor, demora e respostas vazias ou bloqueadas', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 429 }));
    vi.stubGlobal('fetch', fetch);
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 429 });
    fetch.mockRejectedValueOnce(new Error('rede'));
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 504 });
    fetch.mockResolvedValue(Response.json({ candidates: [] }));
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 502 });
    fetch.mockResolvedValue(Response.json({ candidates: [{ finishReason: 'SAFETY' }] }));
    await expect(responderTutor(pedido)).rejects.toMatchObject({ status: 422 });
  });
});
