import type { Metadata } from 'next';
import { Conta } from '@/components/Conta';
import { AvisoEmailLocal } from '@/components/AvisoEmailLocal';

export const metadata: Metadata = {
  title: 'Sua conta',
  description: 'Guarde seu progresso e continue estudando em qualquer dispositivo.',
};
export default function PaginaConta() {
  return (
    <div className="pagina secao conta-pagina">
      <h1 className="titulo-de-pagina">Seu aprendizado vai com você.</h1>
      <p className="secao-apoio">
        Uma conta é opcional. Entre para recuperar suas conquistas ou crie uma para levar seu progresso a outro
        dispositivo.
      </p>
      <AvisoEmailLocal />
      <Conta key="entrar" />
    </div>
  );
}
