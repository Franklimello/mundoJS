import type { Metadata } from 'next';
import Link from 'next/link';
import { FiAward, FiCheckCircle } from 'react-icons/fi';
import { sessaoAtual } from '@/servidor/sessao';
import { banco } from '@/servidor/banco';
import { situacaoCertificados } from '@/servidor/certificados';
import { EmitirCertificado } from '@/components/EmitirCertificado';
import estilos from './certificados.module.css';

export const metadata: Metadata = { title: 'Meus certificados' };
export const dynamic = 'force-dynamic';

export default async function PaginaCertificados() {
  const sessao = await sessaoAtual();
  if (!sessao)
    return (
      <div className="pagina secao conta-pagina">
        <h1 className="titulo-de-pagina">Suas conquistas merecem um certificado.</h1>
        <p>Entre na sua conta para vincular o progresso e emitir um certificado ao concluir cada trilha.</p>
        <Link href="/conta" className="botao botao-principal">
          Entrar na minha conta
        </Link>
      </div>
    );
  const situacoes = await situacaoCertificados(banco(), sessao.user.id);
  return (
    <div className="pagina secao">
      <p className="migalhas">
        <Link href="/conta">Minha conta</Link>
      </p>
      <h1 className="titulo-de-pagina">Meus certificados</h1>
      <p className="secao-apoio">
        Uma conquista para cada trilha. Conclua todos os exercícios, confirme seu nome e guarde seu certificado.
      </p>
      <div className={estilos.lista}>
        {situacoes.map((item) => (
          <section className={estilos.cartao} key={item.trilha} aria-labelledby={`trilha-${item.trilha}`}>
            <FiAward size={30} aria-hidden="true" className={estilos.icone} />
            <div>
              <p className={estilos.selo}>
                {item.certificado ? 'Certificado emitido' : item.liberado ? 'Pronto para emitir' : 'Em andamento'}
              </p>
              <h2 id={`trilha-${item.trilha}`}>{item.titulo}</h2>
              {item.certificado ? (
                <>
                  <p>
                    <FiCheckCircle aria-hidden="true" /> Emitido para {item.certificado.nome}
                  </p>
                  <Link className="botao botao-principal" href={`/conta/certificados/${item.certificado.id}`}>
                    Abrir certificado
                  </Link>
                </>
              ) : (
                <>
                  <p>
                    {item.concluidos} de {item.exercicios} exercícios concluídos
                  </p>
                  <progress value={item.concluidos} max={item.exercicios} aria-label={`Conclusão de ${item.titulo}`} />
                  {item.liberado ? (
                    <EmitirCertificado trilha={item.trilha} usuarioId={sessao.user.id} nomeInicial={sessao.user.name} />
                  ) : (
                    <>
                      <p className="conta-discreto">
                        O certificado usa os exercícios sincronizados com sua conta. Lições antigas sem registro dos
                        exercícios precisam ser refeitas.
                      </p>
                      <Link className="botao botao-leve" href={`/trilhas/${item.trilha}`}>
                        Continuar trilha
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        ))}
      </div>
      <p className="conta-discreto">
        Os certificados registram a conclusão das atividades no MundoJS. Eles ficam disponíveis somente na sua conta e
        podem ser salvos em PDF.
      </p>
    </div>
  );
}
