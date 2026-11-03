import type { Metadata } from 'next';
import Link from 'next/link';
import { PlanoConta } from '@/components/PlanoConta';
import { PERGUNTAS_GRATIS, PERGUNTAS_VISITANTE, PLANO_PRO } from '@/conta/planos';
import { trilhas, todasAsLicoes } from '@/conteudo';
const totalExercicios = trilhas.flatMap(todasAsLicoes).reduce((total, licao) => total + licao.exercicios.length, 0);
export const metadata: Metadata = {
  title: 'Planos',
  alternates: { canonical: '/planos' },
  description:
    'Comece com JavaScript do zero grátis. Libere todas as trilhas, projetos e mais ajuda no Pro por R$ 9,99 ao mês.',
};

export default function Planos() {
  return (
    <div className="pagina secao planos-pagina">
      <p className="plano-sobretitulo">Um incentivo para continuar</p>
      <h1 className="titulo-de-pagina">
        Comece de graça.
        <br />
        Vá além com o Pro.
      </h1>
      <p className="secao-apoio">
        Experimente a trilha JavaScript do zero gratuitamente. No Pro, libere o curso completo com {totalExercicios}{' '}
        exercícios, os 4 projetos e mais ajuda do tutor.
      </p>
      <div className="planos-grade">
        <section className="plano-cartao" aria-labelledby="gratis-titulo">
          <p className="plano-etiqueta">Para dar os primeiros passos</p>
          <h2 id="gratis-titulo">Gratuito</h2>
          <p className="plano-preco">
            R$ 0 <span>para estudar</span>
          </p>
          <ul>
            <li>Trilha JavaScript do zero completa</li>
            <li>Editor, correção e rascunho livre</li>
            <li>Narração e acompanhamento do progresso</li>
            <li>{PERGUNTAS_GRATIS} perguntas ao tutor por mês, com conta</li>
            <li>Prévia das outras trilhas e dos projetos</li>
          </ul>
          <Link href="/trilhas/javascript-do-zero" className="botao botao-leve">
            Começar a trilha gratuita
          </Link>
          <p className="plano-nota">
            Sem conta? Experimente {PERGUNTAS_VISITANTE} pergunta ao tutor por mês neste navegador.
          </p>
        </section>
        <section className="plano-cartao plano-destaque" aria-labelledby="pro-titulo">
          <p className="plano-etiqueta">Para quem quer mais orientação</p>
          <h2 id="pro-titulo">MundoJS Pro</h2>
          <p className="plano-preco">
            R$ 9,99 <span>/ mês</span>
          </p>
          <ul>
            <li>Tudo do plano gratuito</li>
            <li>
              <strong>Todas as trilhas e os {totalExercicios} exercícios, incluindo DOM e eventos</strong>
            </li>
            <li>4 projetos práticos para construir e compartilhar</li>
            <li>
              <strong>{PLANO_PRO.perguntas} perguntas ao tutor por ciclo mensal</strong>
            </li>
            <li>Pistas, explicações e exemplos sobre seu código</li>
            <li>Gerencie e cancele pela sua conta</li>
          </ul>
          <PlanoConta oferta />
          <p className="plano-nota">Assinatura recorrente mensal. Sem fidelidade. Pagamento por cartão pelo Stripe.</p>
        </section>
      </div>
      <section className="planos-duvidas" aria-labelledby="duvidas-titulo">
        <h2 id="duvidas-titulo">Antes de escolher</h2>
        <details>
          <summary>O que conta como uma pergunta?</summary>
          <p>
            Cada envio ao tutor usa uma pergunta, incluindo pistas, explicações e exemplos. Falhas do serviço devolvem a
            pergunta à franquia. Também há limites de segurança por hora para manter o tutor disponível.
          </p>
        </details>
        <details>
          <summary>Quando minha franquia renova?</summary>
          <p>
            No gratuito, no primeiro dia de cada mês, em UTC. No Pro, a cada ciclo mensal pago da assinatura. Perguntas
            não utilizadas não acumulam.
          </p>
        </details>
        <details>
          <summary>Como funciona o cancelamento?</summary>
          <p>
            Abra Minha conta → Meu plano e gerencie a assinatura no Stripe. Ao cancelar para o fim do ciclo, você mantém
            o Pro até o término do período pago e depois volta ao gratuito. Seu progresso e seus rascunhos são
            preservados; o conteúdo Pro volta a exigir uma assinatura ativa.
          </p>
        </details>
        <details>
          <summary>O tutor resolve tudo por mim?</summary>
          <p>
            Ele ajuda você a raciocinar e praticar com o Gemini. A IA pode errar; execute seu código para conferir as
            sugestões. O Pro libera o curso completo, os projetos e amplia a quantidade de perguntas.
          </p>
        </details>
      </section>
    </div>
  );
}
