'use client';

import { useId, useState } from 'react';
import { DESAFIOS_RASCUNHO, type DesafioRascunho } from '@/conteudo/desafios-rascunho';

export function DesafiosRascunho({ modo }: { modo: DesafioRascunho['modo'] }) {
  const desafios = DESAFIOS_RASCUNHO.filter((desafio) => desafio.modo === modo);
  const [escolhido, setEscolhido] = useState(desafios[0].id);
  const desafio = desafios.find((item) => item.id === escolhido) ?? desafios[0];
  const id = useId();
  const categorias = [...new Set(desafios.map((item) => item.categoria))];

  return (
    <section className="rascunho-desafio" aria-labelledby={`${id}-titulo`}>
      <p className="rascunho-desafio-rotulo">Desafios para praticar · {desafios.length} opções neste modo</p>
      <label className="rascunho-desafio-label" htmlFor={`${id}-escolha`}>
        Escolha um desafio
      </label>
      <select
        id={`${id}-escolha`}
        className="rascunho-desafio-seletor"
        value={desafio.id}
        onChange={(evento) => setEscolhido(evento.target.value)}
        aria-describedby={`${id}-aviso`}
      >
        {categorias.map((categoria) => (
          <optgroup key={categoria} label={categoria}>
            {desafios
              .filter((item) => item.categoria === categoria)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.titulo}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
      <p id={`${id}-aviso`} className="rascunho-desafio-livre">
        Trocar o desafio muda apenas as instruções. Seu código no editor é preservado.
      </p>
      <article key={desafio.id} className="rascunho-desafio-conteudo">
        <p className="rascunho-desafio-rotulo">{desafio.categoria}</p>
        <h2 id={`${id}-titulo`}>{desafio.titulo}</h2>
        <p>{desafio.enunciado}</p>
        <details>
          <summary>Dados de exemplo para começar</summary>
          <pre className="rascunho-desafio-dados">
            <code>{desafio.dados}</code>
          </pre>
        </details>
        <details>
          <summary>Precisa de ajuda? Veja o passo a passo</summary>
          <ol className="rascunho-desafio-passos">
            {desafio.passos.map(([titulo, dica]) => (
              <li key={titulo}>
                <strong>{titulo}</strong> {dica}
              </li>
            ))}
          </ol>
          <p className="rascunho-desafio-extra">
            <strong>Resultado esperado:</strong> {desafio.resultado}
          </p>
          <p className="rascunho-desafio-livre">
            <strong>Vá além:</strong> {desafio.extra}
          </p>
        </details>
      </article>
      <p className="rascunho-desafio-livre">
        Escreva sua tentativa no editor abaixo. O rascunho continua livre para experimentar outras ideias.
      </p>
    </section>
  );
}
