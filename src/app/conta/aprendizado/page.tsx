import type { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowRight, FiAward, FiBookOpen, FiCheckCircle, FiCode, FiLock } from 'react-icons/fi';
import { sessaoAtual } from '@/servidor/sessao';
import { banco } from '@/servidor/banco';
import { carregarPainelAprendizado } from '@/servidor/painel-aprendizado';
import { AtualizarAprendizado } from '@/components/AtualizarAprendizado';
import estilos from './aprendizado.module.css';

export const metadata: Metadata = { title: 'Meu aprendizado' };
export const dynamic = 'force-dynamic';

function FalhaNoPainel() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Meu aprendizado</h1>
      <p role="alert">Não conseguimos carregar seu progresso agora. Tente novamente em instantes.</p>
      <AtualizarAprendizado />
    </div>
  );
}

export default async function PaginaAprendizado() {
  let sessao;
  try {
    sessao = await sessaoAtual();
  } catch {
    return <FalhaNoPainel />;
  }
  if (!sessao)
    return (
      <div className="pagina secao conta-pagina">
        <p className={estilos.selo}>Seu espaço de estudo</p>
        <h1 className="titulo-de-pagina">Seu próximo passo, sempre à mão.</h1>
        <p className="secao-apoio">
          Entre para acompanhar suas trilhas, retomar os exercícios e guardar seus certificados.
        </p>
        <Link href="/conta" className="botao botao-principal">
          Entrar na minha conta
        </Link>
      </div>
    );
  let painel;
  try {
    painel = await carregarPainelAprendizado(banco(), sessao.user.id);
  } catch {
    return <FalhaNoPainel />;
  }
  const proxima = painel.retomada.licao;
  const diasAtivos = painel.dias.filter((dia) => dia.ativo).length;
  return (
    <div className={`pagina secao ${estilos.pagina}`}>
      <div className={estilos.cabecalho}>
        <div>
          <p className={estilos.selo}>{painel.pro ? 'MundoJS Pro' : 'Sua jornada no MundoJS'}</p>
          <h1 className="titulo-de-pagina">Meu aprendizado</h1>
          <p className="secao-apoio">Olá, {sessao.user.name}. Um exercício de cada vez, um passo mais longe.</p>
        </div>
        <AtualizarAprendizado />
      </div>
      <div className={estilos.destaques}>
        <section className={estilos.proximo} aria-labelledby="proximo-passo">
          <p className={estilos.selo}>Seu próximo passo</p>
          <h2 id="proximo-passo">
            {proxima
              ? proxima.titulo
              : painel.completas === painel.trilhas.length
                ? 'Você concluiu todas as trilhas!'
                : 'Sua etapa gratuita está concluída!'}
          </h2>
          {proxima ? (
            <>
              <p>
                {proxima.tituloTrilha} · exercício {painel.retomada.indice + 1} de {proxima.total}
              </p>
              <Link className="botao botao-principal" href={`/trilhas/${proxima.trilha}/${proxima.licao}`}>
                {painel.retomada.iniciada ? 'Continuar exercício' : 'Começar exercício'}{' '}
                <FiArrowRight aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <p>
                {painel.paraEmitir > 0
                  ? 'Registre sua conquista com um certificado. Depois, escolha seu próximo desafio.'
                  : 'Pratique um projeto, explore o rascunho ou reveja suas conquistas.'}
              </p>
              <Link
                className="botao botao-principal"
                href={painel.paraEmitir > 0 ? '/conta/certificados' : '/rascunho'}
              >
                {painel.paraEmitir > 0 ? 'Ver meus certificados' : 'Praticar no rascunho'}{' '}
                <FiArrowRight aria-hidden="true" />
              </Link>
            </>
          )}
          {proxima && painel.paraEmitir > 0 && (
            <p className={estilos.aviso}>
              <FiAward aria-hidden="true" /> Você tem{' '}
              {painel.paraEmitir === 1
                ? 'um certificado pronto para emitir'
                : `${painel.paraEmitir} certificados prontos para emitir`}
              . <Link href="/conta/certificados">Ver conquistas</Link>
            </p>
          )}
        </section>
        <section className={estilos.atividade} aria-labelledby="atividade-recente">
          <h2 id="atividade-recente">Seu ritmo de prática</h2>
          <p>
            <strong>{diasAtivos} de 7 dias</strong> com código em ação
          </p>
          <ul className={estilos.dias} aria-label="Atividade nos últimos sete dias, horário de Brasília">
            {painel.dias.map(({ dia, ativo }) => {
              const data = new Date(`${dia}T12:00:00-03:00`);
              const nome = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'America/Sao_Paulo' })
                .format(data)
                .replace('.', '');
              const rotulo = new Intl.DateTimeFormat('pt-BR', {
                day: 'numeric',
                month: 'long',
                timeZone: 'America/Sao_Paulo',
              }).format(data);
              return (
                <li
                  key={dia}
                  data-ativo={ativo}
                  aria-label={`${rotulo}: ${ativo ? 'com prática' : 'sem prática registrada'}`}
                >
                  <span>{nome}</span>
                  <span>{ativo ? <FiCheckCircle aria-hidden="true" /> : '—'}</span>
                </li>
              );
            })}
          </ul>
          <p className={estilos.legenda}>
            Conta como prática rodar ou conferir um exercício. Últimos sete dias, no horário de Brasília.
          </p>
        </section>
      </div>
      <dl className={estilos.numeros}>
        <div>
          <FiCode aria-hidden="true" />
          <dt>Exercícios concluídos</dt>
          <dd>
            {painel.feitos}
            <span> de {painel.total}</span>
          </dd>
        </div>
        <div>
          <FiBookOpen aria-hidden="true" />
          <dt>Trilhas concluídas</dt>
          <dd>
            {painel.completas}
            <span> de {painel.trilhas.length}</span>
          </dd>
        </div>
        <div>
          <FiAward aria-hidden="true" />
          <dt>Certificados emitidos</dt>
          <dd>
            {painel.certificados}
            <span> conquistas registradas</span>
          </dd>
        </div>
      </dl>
      <section className={estilos.trilhas} aria-labelledby="suas-trilhas">
        <div className={estilos.tituloSecao}>
          <h2 id="suas-trilhas">Suas trilhas</h2>
          <Link href="/trilhas">Ver catálogo</Link>
        </div>
        <ul>
          {painel.trilhas.map((trilha) => {
            const href = trilha.certificado
              ? `/conta/certificados/${trilha.certificado}`
              : trilha.completa
                ? '/conta/certificados'
                : trilha.liberada
                  ? `/trilhas/${trilha.slug}/${trilha.proximaLicao}`
                  : '/planos';
            const acao = trilha.certificado
              ? 'Ver certificado'
              : trilha.completa
                ? 'Emitir certificado'
                : trilha.liberada
                  ? trilha.feitos
                    ? 'Continuar'
                    : 'Começar'
                  : 'Conhecer Pro';
            return (
              <li key={trilha.slug}>
                <span className={estilos.trilhaIcone}>
                  {trilha.completa ? (
                    <FiCheckCircle aria-hidden="true" />
                  ) : trilha.liberada ? (
                    <FiBookOpen aria-hidden="true" />
                  ) : (
                    <FiLock aria-hidden="true" />
                  )}
                </span>
                <div className={estilos.trilhaNome}>
                  <h3>
                    <Link href={`/trilhas/${trilha.slug}`}>{trilha.titulo}</Link>
                  </h3>
                  <p>
                    {trilha.feitos} de {trilha.total} exercícios{!trilha.liberada && !trilha.completa ? ' · Pro' : ''}
                  </p>
                </div>
                <progress value={trilha.feitos} max={trilha.total} aria-label={`Conclusão de ${trilha.titulo}`} />
                <Link className="botao botao-leve" href={href} aria-label={`${acao}: ${trilha.titulo}`}>
                  {acao} <FiArrowRight aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
        <p className={estilos.legenda}>
          Os totais usam os exercícios atuais sincronizados com sua conta. Certificados emitidos continuam disponíveis
          quando uma trilha recebe atividades novas.
        </p>
      </section>
      <nav className={estilos.atalhos} aria-label="Sua conta">
        <Link href="/conta/certificados">
          <FiAward aria-hidden="true" /> Meus certificados
        </Link>
        <Link href="/conta/plano">Meu plano e uso do tutor</Link>
        <Link href="/conta">Dados da conta e sair</Link>
      </nav>
    </div>
  );
}
