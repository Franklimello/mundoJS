import type { Metadata } from 'next';
import { CodeLab } from '@/components/codelab/CodeLab';
import '../codelab.css';

export const metadata: Metadata = {
  title: 'CodeLab · Ambiente de Exploração de Código e Arquiteturas · MundoJS',
  alternates: { canonical: '/codelab' },
  description:
    'Ambiente de documentação técnica e consulta de arquiteturas de projetos inspirado no VS Code. Explore código real de APIs Express, NestJS, Prisma e biblioteca de algoritmos.',
};

export default function PaginaCodeLab() {
  return (
    <div className="codelab-page-wrapper">
      <CodeLab />
    </div>
  );
}
