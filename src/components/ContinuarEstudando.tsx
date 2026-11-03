'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { escolherRetomada } from '@/estudo/retomar';
import type { LicaoParaRetomar } from '@/estudo/tipos';
import { carregarDados, type DadosSalvos } from '@/progresso/api';

export function ContinuarEstudando({ catalogo }: { catalogo: LicaoParaRetomar[] }) {
  const [dados, setDados] = useState<DadosSalvos | null>(null);
  useEffect(() => {
    let ativo = true;
    const atualizar = () => {
      void carregarDados()
        .then((salvo) => {
          if (ativo) setDados(salvo);
        })
        .catch(() => {});
    };
    atualizar();
    window.addEventListener('focus', atualizar);
    return () => {
      ativo = false;
      window.removeEventListener('focus', atualizar);
    };
  }, []);
  const retomada = dados ? escolherRetomada(catalogo, dados.progresso, dados.ultimaAtividade) : null;
  const proxima = retomada?.licao ?? catalogo[0];
  const completa = retomada && !retomada.licao;
  const href = completa || !proxima ? '/trilhas' : `/trilhas/${proxima.trilha}/${proxima.licao}`;

  return (
    <div className="continuar-estudando">
      <Link className="botao botao-principal botao-grande" href={href}>
        {completa ? 'Revisar as trilhas' : retomada?.iniciada ? 'Continuar estudando' : 'Começar a primeira lição'}
      </Link>
      {retomada?.iniciada && (
        <div className="continuar-detalhes" aria-live="polite">
          <p>
            {completa
              ? 'Você concluiu todos os exercícios. Que tal praticar de novo?'
              : `${proxima?.titulo} · exercício ${retomada.indice + 1} de ${proxima?.total}`}
          </p>
          <label htmlFor="progresso-geral">
            {retomada.feitos} de {retomada.total} exercícios concluídos
          </label>
          <progress id="progresso-geral" value={retomada.feitos} max={retomada.total} />
        </div>
      )}
    </div>
  );
}
