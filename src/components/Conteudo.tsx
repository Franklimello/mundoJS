import type { Bloco } from '@/conteudo/tipos';
import { CodigoDestacado } from './CodigoDestacado';
import { Texto } from './Texto';

/** Desenha os blocos de uma lição ou de um enunciado. Roda no servidor. */
export function Conteudo({ blocos }: { blocos: Bloco[] }) {
  return (
    <div className="prosa">
      {blocos.map((bloco, indice) => {
        switch (bloco.tipo) {
          case 'p':
            return (
              <p key={indice}>
                <Texto>{bloco.texto}</Texto>
              </p>
            );
          case 'lista':
            return (
              <ul key={indice}>
                {bloco.itens.map((item, i) => (
                  <li key={i}>
                    <Texto>{item}</Texto>
                  </li>
                ))}
              </ul>
            );
          case 'codigo':
            return (
              <figure key={indice} className="exemplo">
                <pre tabIndex={0} aria-label="Exemplo de código">
                  <code>
                    <CodigoDestacado codigo={bloco.codigo} />
                  </code>
                </pre>
                {bloco.saida !== undefined && (
                  <figcaption>
                    <span className="exemplo-rotulo">Mostra</span>
                    <pre>{bloco.saida}</pre>
                  </figcaption>
                )}
              </figure>
            );
          case 'nota':
            return (
              <aside key={indice} className={bloco.tom === 'cuidado' ? 'nota nota-cuidado' : 'nota'}>
                <Texto>{bloco.texto}</Texto>
              </aside>
            );
        }
      })}
    </div>
  );
}
