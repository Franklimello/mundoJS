import type { Metadata } from 'next';
import { FolhaDoRascunho } from '@/components/Folhas';

export const metadata: Metadata = {
  title: 'Rascunho',
  alternates: { canonical: '/rascunho' },
  description: 'Um editor livre de JavaScript e páginas HTML/CSS, com prévia visual.',
};

export default function Rascunho() {
  return (
    <div className="pagina secao">
      <h1 className="titulo-de-pagina">Rascunho</h1>
      <p className="secao-apoio">
        Experimente JavaScript ou crie uma página com HTML, CSS e JS. Seus rascunhos ficam salvos; com uma conta,
        acompanham você em outros dispositivos.
      </p>
      <div className="rascunho-folha">
        <FolhaDoRascunho />
      </div>
    </div>
  );
}
