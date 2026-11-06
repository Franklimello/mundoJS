import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConteudoPro } from '@/components/ConteudoPro';

const mocks = vi.hoisted(() => ({ pro: vi.fn() }));
vi.mock('@/servidor/acesso-conteudo', () => ({ temProAtual: mocks.pro }));

import TopicoDaDocumentacao from './page';

beforeEach(() => {
  mocks.pro.mockReset().mockResolvedValue(false);
});

describe('proteção de tópicos da documentação', () => {
  it('mantém tópicos gratuitos acessíveis sem consultar assinatura', async () => {
    const elemento = await TopicoDaDocumentacao({ params: Promise.resolve({ topico: 'strings' }) });
    expect(elemento.type).not.toBe(ConteudoPro);
    expect(mocks.pro).not.toHaveBeenCalled();
    const html = renderToStaticMarkup(elemento);
    expect(html).toContain('Manipulação de strings');
  });

  it('bloqueia o módulo SQL para usuários não assinantes', async () => {
    const elemento = await TopicoDaDocumentacao({ params: Promise.resolve({ topico: 'sql' }) });
    expect(elemento.type).toBe(ConteudoPro);
    expect(mocks.pro).toHaveBeenCalled();
    const html = renderToStaticMarkup(elemento);
    expect(html).toContain('Incluído no MundoJS Pro');
    expect(html).toContain('Linguagem SQL e Banco de Dados');
    expect(html).not.toContain('id="select"');
  });

  it('libera o módulo SQL completo para assinantes Pro', async () => {
    mocks.pro.mockResolvedValue(true);
    const elemento = await TopicoDaDocumentacao({ params: Promise.resolve({ topico: 'sql' }) });
    expect(elemento.type).not.toBe(ConteudoPro);
    const html = renderToStaticMarkup(elemento);
    expect(html).toContain('Linguagem SQL e Banco de Dados');
    expect(html).toContain('SELECT e FROM');
  });
});
