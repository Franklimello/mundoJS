import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
vi.mock('@/conta/cliente', () => ({
  contaCliente: { useSession: () => ({ data: null, isPending: false, error: null }) },
}));
import { Conta } from './Conta';

describe('acesso na prévia Google-only', () => {
  it('oferece Google sem formulários ou recuperação por e-mail quando desativados', () => {
    const html = renderToStaticMarkup(<Conta emailHabilitado={false} />);
    expect(html).toContain('Continuar com Google');
    expect(html).not.toContain('<form');
    expect(html).not.toContain('type="password"');
    expect(html).not.toContain('Esqueci minha senha');
  });
  it('preserva os formulários quando o acesso por e-mail está habilitado', () => {
    const html = renderToStaticMarkup(<Conta />);
    expect(html).toContain('<form');
    expect(html).toContain('type="password"');
    expect(html).toContain('Esqueci minha senha');
  });
});
