import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Bricolage_Grotesque } from 'next/font/google';
import { Cabecalho } from '@/components/Cabecalho';
import { AvisoDoProgresso } from '@/components/Progresso';
import './globals.css';

const titulos = Bricolage_Grotesque({ subsets: ['latin'], variable: '--fonte-titulo', display: 'swap' });
const textos = Atkinson_Hyperlegible_Next({ subsets: ['latin'], variable: '--fonte-texto', display: 'swap' });
const codigos = Atkinson_Hyperlegible_Mono({ subsets: ['latin'], variable: '--fonte-codigo', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'MundoJS — aprenda JavaScript escrevendo código', template: '%s · MundoJS' },
  description:
    'Lições curtas de JavaScript com um editor que roda no navegador e um corretor que confere cada exercício na hora. Sem instalar nada.',
};

export const viewport: Viewport = { themeColor: '#fcfdff' };

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulos.variable} ${textos.variable} ${codigos.variable}`}>
      <body>
        <a className="pular" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <div className="pagina">
          <AvisoDoProgresso />
        </div>
        <main id="conteudo">{children}</main>
        <footer className="rodape">
          <div className="pagina">
            <p>Comece sem cadastro. Com uma conta, seu progresso acompanha você em outros dispositivos.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
