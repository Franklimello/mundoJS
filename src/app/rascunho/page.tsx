import type { Metadata } from 'next';
import { FolhaDoRascunho } from '@/components/Folhas';

export const metadata: Metadata = {
  title: 'Rascunho',
  description: 'Um editor livre para escrever e rodar JavaScript, sem exercício e sem correção.',
};

export default function Rascunho() {
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Rascunho</h1>
      <p className="secao-apoio">
        Escreva e rode o que quiser, sem exercício e sem correção. O que você escreve fica guardado neste navegador.
      </p>
      <div className="rascunho-folha">
        <FolhaDoRascunho />
      </div>
    </div>
  );
}
