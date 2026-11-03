'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAward } from 'react-icons/fi';

export function EmitirCertificado({
  trilha,
  usuarioId,
  nomeInicial,
}: {
  trilha: string;
  usuarioId: string;
  nomeInicial: string;
}) {
  const router = useRouter();
  const [nome, setNome] = useState(nomeInicial === 'Estudante' ? '' : nomeInicial);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  return (
    <form
      className="conta-formulario"
      aria-busy={ocupado}
      onSubmit={async (evento) => {
        evento.preventDefault();
        if (ocupado) return;
        setOcupado(true);
        setErro('');
        try {
          const resposta = await fetch('/api/conta/certificados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-mundojs-conta': usuarioId },
            body: JSON.stringify({ trilha, nome }),
            signal: AbortSignal.timeout(20000),
          });
          const dados = await resposta.json();
          if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível emitir. Tente novamente.');
          router.push(`/conta/certificados/${encodeURIComponent(dados.id)}`);
        } catch (falha) {
          setErro(falha instanceof Error ? falha.message : 'Confira sua conexão e tente novamente.');
          setOcupado(false);
        }
      }}
    >
      <label htmlFor={`nome-${trilha}`}>Nome no certificado</label>
      <input
        id={`nome-${trilha}`}
        autoComplete="name"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        minLength={2}
        maxLength={100}
        disabled={ocupado}
        aria-describedby={`ajuda-${trilha}`}
      />
      <p id={`ajuda-${trilha}`} className="conta-discreto">
        Confira a grafia antes de emitir. Esse nome ficará registrado neste certificado.
      </p>
      <button className="botao botao-principal" type="submit" disabled={ocupado}>
        <FiAward aria-hidden="true" /> {ocupado ? 'Emitindo…' : 'Emitir meu certificado'}
      </button>
      {erro && (
        <p role="alert" className="conta-erro">
          {erro}
        </p>
      )}
    </form>
  );
}
