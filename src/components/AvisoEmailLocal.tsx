export function AvisoEmailLocal() {
  if (process.env.NODE_ENV !== 'development' || process.env.AUTH_SMTP_URL !== 'smtp://127.0.0.1:1025') return null;
  return (
    <details className="conta-aviso">
      <summary>Onde recebo os e-mails nesta versão local?</summary>
      <p>
        As mensagens de confirmação e recuperação ficam na{' '}
        <a href="http://localhost:8025" target="_blank" rel="noreferrer">
          caixa de e-mails de teste
        </a>
        . Elas não são enviadas para sua caixa de entrada real.
      </p>
    </details>
  );
}
