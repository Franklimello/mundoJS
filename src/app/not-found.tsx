import Link from 'next/link';

export default function NaoEncontrada() {
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Essa página não existe</h1>
      <p className="secao-apoio">
        O endereço pode ter mudado ou ter sido digitado errado. Volte para as trilhas e escolha uma lição.
      </p>
      <p className="secao-acao">
        <Link className="botao botao-principal" href="/trilhas">
          Ver as trilhas
        </Link>
      </p>
    </div>
  );
}
