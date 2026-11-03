import Link from 'next/link';
import { FiBookOpen, FiChevronDown, FiCheckCircle, FiLock } from 'react-icons/fi';
import type { Trilha } from '@/conteudo/tipos';
import { todasAsLicoes } from '@/conteudo';
import { trilhaGratuita } from '@/conta/planos';
import { ContagemDaTrilha, CertificadoDaTrilha } from './Progresso';
import { ResultadoTrilha } from './ResultadoTrilha';
import { Sumario } from './Sumario';

export function TrilhaRecolhivel({ trilha, pro }: { trilha: Trilha; pro: boolean }) {
  const gratuita = trilhaGratuita(trilha.slug);
  const liberada = gratuita || pro;
  return (
    <details className="trilha-recolhivel" name="catalogo-trilhas">
      <summary>
        <span className="trilha-recolhivel-icone">
          <FiBookOpen size={22} aria-hidden="true" focusable="false" />
        </span>
        <span className="trilha-recolhivel-dados">
          <span className="trilha-recolhivel-titulo">{trilha.titulo}</span>
          <span className="trilha-recolhivel-meta">
            <ContagemDaTrilha
              emLinha
              trilha={trilha.slug}
              licoes={todasAsLicoes(trilha).map((licao) => ({ slug: licao.slug, total: licao.exercicios.length }))}
            />
            <span className="trilha-recolhivel-plano" data-liberada={liberada}>
              {liberada ? (
                <FiCheckCircle aria-hidden="true" focusable="false" />
              ) : (
                <FiLock aria-hidden="true" focusable="false" />
              )}
              {gratuita ? 'Gratuita' : pro ? 'Pro liberado' : 'Pro'}
            </span>
          </span>
        </span>
        <span className="trilha-recolhivel-acao" aria-hidden="true">
          <span className="trilha-acao-abrir">Ver lições</span>
          <span className="trilha-acao-fechar">Recolher</span>
          <FiChevronDown className="trilha-recolhivel-seta" size={20} focusable="false" />
        </span>
      </summary>
      <div className="trilha-recolhivel-conteudo">
        <p className="trilha-recolhivel-descricao">{trilha.descricao}</p>
        <Link className="botao botao-leve" href={`/trilhas/${trilha.slug}`}>
          Ver página da trilha
        </Link>
        <ResultadoTrilha trilha={trilha.slug} />
        <Sumario trilha={trilha} pro={pro} />
        <CertificadoDaTrilha
          trilha={trilha.slug}
          licoes={todasAsLicoes(trilha).map((licao) => ({ slug: licao.slug, total: licao.exercicios.length }))}
        />
      </div>
    </details>
  );
}
