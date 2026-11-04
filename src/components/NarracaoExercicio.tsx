'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { LeitorNarracao, type EstadoNarracao } from '@/narracao/leitor';

export function NarracaoExercicio({ texto }: { texto: string }) {
  const [estado, setEstado] = useState<EstadoNarracao>('parado');
  const [erro, setErro] = useState<string>();
  const [velocidade, setVelocidade] = useState('1');
  const leitor = useRef<LeitorNarracao | null>(null);
  const idVelocidade = useId();
  const ativo = estado === 'preparando' || estado === 'falando' || estado === 'pausado';

  useEffect(() => {
    // Alguns navegadores carregam a lista de vozes de forma assíncrona na primeira consulta.
    window.speechSynthesis?.getVoices();
    const aoSair = () => leitor.current?.parar();
    window.addEventListener('pagehide', aoSair);
    return () => {
      window.removeEventListener('pagehide', aoSair);
      leitor.current?.encerrar();
      leitor.current = null;
    };
  }, []);

  function ouvir() {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setEstado('erro');
      setErro(
        'Este navegador não oferece narração. Você pode acompanhar o enunciado em texto ou usar outro navegador.',
      );
      return;
    }
    leitor.current ??= new LeitorNarracao(
      window.speechSynthesis,
      (trecho) => new SpeechSynthesisUtterance(trecho),
      (novo, falha) => {
        setEstado(novo);
        setErro(falha);
      },
    );
    leitor.current.iniciar(texto, Number(velocidade));
  }

  return (
    <div className="narracao" role="group" aria-label="Narração do exercício">
      <div className="narracao-controles">
        {estado === 'falando' ? (
          <button type="button" className="botao botao-leve" onClick={() => leitor.current?.pausar()}>
            Pausar narração
          </button>
        ) : estado === 'pausado' ? (
          <button type="button" className="botao botao-leve" onClick={() => leitor.current?.continuar()}>
            Continuar narração
          </button>
        ) : (
          <button type="button" className="botao botao-leve" onClick={ouvir} disabled={estado === 'preparando'}>
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" />
            </svg>
            {estado === 'preparando'
              ? 'Preparando áudio…'
              : estado === 'concluido'
                ? 'Ouvir novamente'
                : 'Ouvir exercício'}
          </button>
        )}
        {ativo && (
          <>
            <button type="button" className="botao botao-leve" onClick={ouvir}>
              Recomeçar
            </button>
            <button type="button" className="botao botao-leve" onClick={() => leitor.current?.parar()}>
              Parar narração
            </button>
          </>
        )}
      </div>
      {(ativo || estado === 'concluido') && (
        <p className="narracao-status" role="status">
          {estado === 'falando'
            ? 'Lendo o exercício em português.'
            : estado === 'pausado'
              ? 'Narração pausada.'
              : estado === 'concluido'
                ? 'Narração concluída. Agora é sua vez de tentar.'
                : 'Ouça o enunciado e orientações para começar. A voz depende do seu dispositivo.'}
        </p>
      )}
      {erro && (
        <p className="narracao-erro" role="alert">
          {erro}
        </p>
      )}
      <details className="narracao-opcoes">
        <summary>Opções do áudio</summary>
        <label className="narracao-velocidade" htmlFor={idVelocidade}>
          Velocidade
          <select
            id={idVelocidade}
            value={velocidade}
            disabled={ativo}
            onChange={(event) => setVelocidade(event.target.value)}
          >
            <option value="0.8">0,8×</option>
            <option value="1">1× (normal)</option>
            <option value="1.2">1,2×</option>
            <option value="1.5">1,5×</option>
          </select>
        </label>
        <p>A voz depende do seu dispositivo. Ouça o enunciado e as orientações para começar.</p>
        <details className="narracao-texto">
          <summary>Texto da narração</summary>
          <p>{texto}</p>
        </details>
      </details>
    </div>
  );
}
