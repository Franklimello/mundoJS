/** Permite uma prévia Google-only enquanto o SMTP online não está configurado. */
export function emailSenhaHabilitados() {
  return process.env.AUTH_EMAIL_ENABLED !== 'false';
}
