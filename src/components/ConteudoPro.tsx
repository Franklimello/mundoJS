import Link from 'next/link';
import { CompartilharProjeto } from './CompartilharProjeto';

export function ConteudoPro({
  titulo,
  projeto = false,
  trilha,
  descricao,
}: {
  titulo: string;
  projeto?: boolean;
  trilha?: string;
  descricao?: string;
}) {
  const textoApoio = descricao ?? (projeto ? 'Construa este projeto com o Pro.' : 'Continue nesta trilha com o Pro.');

  return (
    <section className="pagina secao conteudo-pro" aria-labelledby="conteudo-pro-titulo">
      <p className="plano-etiqueta">Incluído no MundoJS Pro</p>
      <h1 id="conteudo-pro-titulo" className="titulo-de-pagina">
        {titulo}
      </h1>
      <p className="secao-apoio">
        {textoApoio} Por R$ 9,99/mês, você libera todas as trilhas, os projetos práticos, o módulo e console de SQL com
        SQLite real e 100 perguntas ao tutor por ciclo.
      </p>
      <div className="conta-acoes">
        <Link href="/planos" className="botao botao-principal">
          Conhecer o Pro — R$ 9,99/mês
        </Link>
        <Link href="/trilhas/javascript-do-zero" className="botao botao-leve">
          Estudar a trilha gratuita
        </Link>
      </div>
      <p>
        Seu progresso e seus rascunhos já salvos são preservados. Já assinou?{' '}
        <Link href="/conta/plano">Confira sua conta e seu plano</Link>.
      </p>
      {projeto && trilha && <CompartilharProjeto trilha={trilha} codigo="" somenteGerenciar />}
    </section>
  );
}
