import type { Metadata } from 'next';
import Link from 'next/link';
import { PlanoConta } from '@/components/PlanoConta';
export const metadata: Metadata = { title: 'Meu plano e uso do tutor' };
export default function MeuPlano() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Seu plano, no seu ritmo.</h1>
      <p className="secao-apoio">Acompanhe suas perguntas ao tutor e gerencie seus pagamentos.</p>
      <section className="conta-cartao">
        <PlanoConta />
      </section>
      <p>
        <Link href="/planos">Comparar planos</Link> · <Link href="/conta">Voltar à minha conta</Link>
      </p>
    </div>
  );
}
