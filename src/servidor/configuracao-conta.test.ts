import { afterEach, describe, expect, it, vi } from 'vitest';
import { emailSenhaHabilitados } from './configuracao-conta';
afterEach(() => vi.unstubAllEnvs());
describe('prévia sem SMTP', () => {
  it('desativa e-mail e senha somente quando configurado explicitamente', () => {
    vi.stubEnv('AUTH_EMAIL_ENABLED', 'false');
    expect(emailSenhaHabilitados()).toBe(false);
    vi.stubEnv('AUTH_EMAIL_ENABLED', 'true');
    expect(emailSenhaHabilitados()).toBe(true);
    vi.stubEnv('AUTH_EMAIL_ENABLED', '');
    expect(emailSenhaHabilitados()).toBe(true);
  });
});
