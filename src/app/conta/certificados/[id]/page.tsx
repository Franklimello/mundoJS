import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { FiAward } from 'react-icons/fi';
import { banco } from '@/servidor/banco';
import { sessaoAtual } from '@/servidor/sessao';
import { lerCertificado } from '@/servidor/certificados';
import { FiDownload } from 'react-icons/fi';
import estilos from '../certificados.module.css';

export const metadata: Metadata = { title: 'Certificado de conclusão' };
export const dynamic = 'force-dynamic';

export default async function PaginaCertificado({ params }: { params: Promise<{ id: string }> }) {
  const sessao = await sessaoAtual();
  if (!sessao) redirect('/conta');
  const certificado = await lerCertificado(banco(), sessao.user.id, (await params).id);
  if (!certificado) notFound();
  return (
    <div className="pagina secao">
      <div className={estilos.acoes}>
        <Link className="botao botao-leve" href="/conta/certificados">
          Meus certificados
        </Link>
        <a className="botao botao-principal" href={`/api/conta/certificados/${certificado.id}/pdf`} download>
          <FiDownload aria-hidden="true" /> Baixar certificado em PDF
        </a>
      </div>
      <p className={estilos.ajuda}>Guarde o PDF no seu dispositivo ou imprima quando quiser.</p>
      <article className={estilos.folha} aria-label={`Certificado de ${certificado.nome}`}>
        <div className={estilos.topo}>
          <span className={estilos.marca}>
            Mundo<span>JS</span>
          </span>
          <span className={estilos.edicao}>APRENDER · PRATICAR · CONSTRUIR</span>
        </div>
        <FiAward size={54} aria-hidden="true" className={estilos.premio} />
        <p className={estilos.selo}>Uma nova etapa concluída</p>
        <h1>Certificado de conclusão</h1>
        <p>O MundoJS certifica que</p>
        <h2 className={estilos.nome}>{certificado.nome}</h2>
        <p>concluiu as atividades da trilha</p>
        <h3 className={estilos.trilha}>{certificado.titulo}</h3>
        <p>
          {certificado.licoes} lições · {certificado.exercicios} exercícios de programação
        </p>
        <div className={estilos.base}>
          <div>
            <strong>MundoJS</strong>
            <span>O seu universo JavaScript</span>
          </div>
          <div>
            <strong>
              Emitido em{' '}
              {new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(certificado.emitido_em)}
            </strong>
            <span>mundojavascript.com.br</span>
          </div>
        </div>
        <p className={estilos.codigo}>Registro {certificado.id}</p>
      </article>
    </div>
  );
}
