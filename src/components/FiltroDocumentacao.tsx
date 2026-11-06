'use client';

import { useId, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

/** Tira acentos e maiúsculas, para "maiusculas" achar "Maiúsculas". */
function simplificar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtra os métodos já desenhados no servidor. Cada método tem
 * `data-busca` com o texto pesquisável; a seção some quando fica vazia.
 */
export function FiltroDocumentacao({ alvo }: { alvo: string }) {
  const id = useId();
  const [termo, setTermo] = useState('');
  const [encontrados, setEncontrados] = useState<number | null>(null);

  function filtrar(valor: string) {
    setTermo(valor);
    const raiz = document.getElementById(alvo);
    if (!raiz) return;
    const busca = simplificar(valor);
    let total = 0;
    for (const secao of raiz.querySelectorAll<HTMLElement>('[data-secao]')) {
      let visiveis = 0;
      for (const metodo of secao.querySelectorAll<HTMLElement>('[data-busca]')) {
        const combina = !busca || simplificar(metodo.dataset.busca ?? '').includes(busca);
        metodo.hidden = !combina;
        if (combina) visiveis++;
      }
      secao.hidden = visiveis === 0;
      total += visiveis;
    }
    for (const link of document.querySelectorAll<HTMLElement>(`[data-indice-de="${alvo}"] [data-busca]`)) {
      link.hidden = Boolean(busca) && !simplificar(link.dataset.busca ?? '').includes(busca);
    }
    setEncontrados(busca ? total : null);
  }

  return (
    <div className="doc-filtro" role="search">
      <label htmlFor={id} className="sr-only">
        Filtrar métodos
      </label>
      <FiSearch size={18} aria-hidden="true" focusable="false" />
      <input
        id={id}
        type="search"
        placeholder="Filtrar: trim, maiúsculas, recortar..."
        value={termo}
        onChange={(evento) => filtrar(evento.target.value)}
        autoComplete="off"
      />
      <p className="doc-filtro-resultado" aria-live="polite">
        {encontrados === null
          ? ''
          : encontrados === 0
            ? 'Nenhum método encontrado.'
            : `${encontrados} ${encontrados === 1 ? 'método encontrado' : 'métodos encontrados'}.`}
      </p>
    </div>
  );
}
