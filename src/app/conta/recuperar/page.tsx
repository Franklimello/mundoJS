import { Suspense } from 'react';
import type { Metadata } from 'next';
import { RecuperarSenha } from '@/components/RecuperarSenha';
import { AvisoEmailLocal } from '@/components/AvisoEmailLocal';

export const metadata: Metadata = { title: 'Recuperar acesso' };
export default function Recuperar() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Recupere seu acesso.</h1>
      <p className="secao-apoio">Vamos enviar um link para você escolher uma nova senha.</p>
      <AvisoEmailLocal />
      <Suspense fallback={<p>Carregando…</p>}>
        <RecuperarSenha />
      </Suspense>
    </div>
  );
}
