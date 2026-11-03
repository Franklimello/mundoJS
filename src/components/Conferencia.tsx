import type { ReactNode } from 'react';
import type { ResultadoTeste } from '@/engine/tipos';
import { Tique, Xis } from './Marcas';

/**
 * A correção: um visto verde para cada teste que passou, um xis vermelho para
 * o que ainda não. `children` aparece só quando tudo passou (o "e agora?").
 */
export function Conferencia({ testes, children }: { testes: ResultadoTeste[]; children?: ReactNode }) {
  const certos = testes.filter((teste) => teste.passou).length;
  const tudoCerto = certos === testes.length;
  return (
    <section className="conferencia" aria-label="Conferência">
      <h3 className="conferencia-titulo">{tudoCerto ? 'Tudo certo.' : `${certos} de ${testes.length} certos`}</h3>
      <ul className="conferencia-lista">
        {testes.map((teste, indice) => (
          // `--i` escalona o desenho dos vistos, um depois do outro, como um professor corrigindo.
          <li key={teste.descricao} className={teste.passou ? 'certo' : 'errado'} style={{ ['--i' as string]: indice }}>
            {teste.passou ? <Tique tamanho={20} /> : <Xis tamanho={20} />}
            <div>
              <p className="teste-descricao">
                <span className="sr-only">{teste.passou ? 'Certo: ' : 'Errado: '}</span>
                {teste.descricao}
              </p>
              {!teste.passou && teste.mensagem && <p className="teste-mensagem">{teste.mensagem}</p>}
            </div>
          </li>
        ))}
      </ul>
      {tudoCerto && children}
    </section>
  );
}
