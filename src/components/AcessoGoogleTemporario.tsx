import Link from 'next/link';

export function AcessoGoogleTemporario() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Entre com o Google nesta prévia.</h1>
      <p className="secao-apoio">
        O acesso por e-mail e senha ainda não está disponível. Para recuperar sua conta Google, use a recuperação do
        próprio Google.
      </p>
      <Link href="/conta" className="botao botao-principal">
        Ir para minha conta
      </Link>
    </div>
  );
}
