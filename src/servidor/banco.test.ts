import { afterEach, describe, expect, it, vi } from 'vitest';
import { urlBancoCobranca } from './banco';
afterEach(() => vi.unstubAllEnvs());
describe('conexão que preserva bloqueios de sessão', () => {
  it('separa a conexão direta da conexão transaction pooler do Neon', () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://user:teste@ep-app-pooler.us-east-1.aws.neon.tech/mundojs');
    vi.stubEnv('DATABASE_URL_UNPOOLED', 'postgresql://user:teste@ep-app.us-east-1.aws.neon.tech/mundojs');
    expect(urlBancoCobranca()).toBe(process.env.DATABASE_URL_UNPOOLED);
  });
  it('recusa pooler em operações que dependem de sessão', () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://user:teste@ep-app-pooler.us-east-1.aws.neon.tech/mundojs');
    vi.stubEnv('DATABASE_URL_UNPOOLED', '');
    expect(() => urlBancoCobranca()).toThrow('DATABASE_URL_UNPOOLED');
  });
  it('mantém a conexão Docker local compatível e falha fechado sem configuração', () => {
    vi.stubEnv('DATABASE_URL_UNPOOLED', '');
    vi.stubEnv('DATABASE_URL', 'postgresql://user:teste@localhost:5433/rabisco');
    expect(urlBancoCobranca()).toBe(process.env.DATABASE_URL);
    vi.stubEnv('DATABASE_URL', '');
    expect(() => urlBancoCobranca()).toThrow('não configurada');
  });
});
