import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RecuperarSenha } from '@/components/RecuperarSenha';

export const metadata: Metadata = { title: 'Nova senha' };
export default function NovaSenha() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Escolha uma nova senha.</h1>
      <p className="secao-apoio">Seu progresso continua guardado na conta.</p>
      <Suspense fallback={<p>Carregando…</p>}>
        <RecuperarSenha nova />
      </Suspense>
    </div>
  );
}
