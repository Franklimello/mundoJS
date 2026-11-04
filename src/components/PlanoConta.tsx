'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { contaCliente } from '@/conta/cliente';
import type { UsoPlano } from '@/conta/planos';

function data(texto: string) {
  return new Date(texto).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
interface Estado {
  uso: UsoPlano;
  disponivel: boolean;
  assinatura: { pro: boolean; fim: string | null; cancelarNoFim: boolean; podeGerenciar: boolean } | null;
}

export function PlanoConta({ oferta = false }: { oferta?: boolean }) {
  const { data: sessao, isPending } = contaCliente.useSession();
  const [estado, setEstado] = useState<Estado | null>(null);
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [atualizacao, setAtualizacao] = useState(0);
  const usuario = sessao?.user.id;
  useEffect(() => {
    if (isPending) return;
    let ativo = true;
    const controle = new AbortController();
    void fetch('/api/cobranca', { cache: 'no-store', signal: controle.signal })
      .then(async (r) => {
        const dados = await r.json();
        if (!r.ok) throw new Error(dados.erro);
        return dados as Estado;
      })
      .then((dados) => {
        if (ativo) {
          setEstado(dados);
          setErro('');
        }
      })
      .catch((e) => {
        if (ativo) {
          setEstado(null);
          setErro(e instanceof Error ? e.message : 'Não foi possível consultar seu plano.');
        }
      });
    return () => {
      ativo = false;
      controle.abort();
      setEstado(null);
    };
  }, [usuario, isPending, atualizacao]);

  async function abrir(acao: 'checkout' | 'portal') {
    if (!usuario || ocupado) return;
    setOcupado(true);
    setErro('');
    try {
      const r = await fetch(`/api/cobranca/${acao}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ identidade: usuario }),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro);
      window.location.assign(dados.url);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Tente novamente.');
      setOcupado(false);
    }
  }
  const gerenciar = estado?.assinatura?.podeGerenciar;
  return (
    <div className="plano-controles" aria-busy={ocupado || isPending}>
      {!oferta && (
        <>
          <h2>{estado?.uso.plano === 'pro' ? 'MundoJS Pro' : 'Seu plano gratuito'}</h2>
          {estado && (
            <p>
              {estado.uso.plano === 'pro'
                ? 'Todas as trilhas e os projetos estão liberados.'
                : 'Seu plano inclui JavaScript do zero e o rascunho livre. As outras trilhas e os projetos fazem parte do Pro.'}
            </p>
          )}
          {estado && (
            <>
              <p>
                <strong>
                  {estado.uso.restantes} de {estado.uso.limite} perguntas disponíveis
                </strong>{' '}
                neste período.
              </p>
              <progress
                value={estado.uso.usadas}
                max={estado.uso.limite}
                aria-label={`${estado.uso.usadas} de ${estado.uso.limite} perguntas usadas`}
              />
              <p>A franquia renova em {data(estado.uso.renovaEm)}. Perguntas não utilizadas não acumulam.</p>
              {estado.assinatura?.cancelarNoFim && estado.assinatura.pro && (
                <p>Cancelamento agendado. Seu Pro fica disponível até {data(estado.assinatura.fim!)}.</p>
              )}
              <p>
                A confirmação de um pagamento pode levar alguns instantes. Atualize seu plano após concluir o pagamento.
              </p>
            </>
          )}
        </>
      )}
      {isPending || (!estado && !erro) ? (
        <p role="status">Consultando seu plano…</p>
      ) : !usuario ? (
        <Link className="botao botao-principal" href="/conta">
          Entrar para assinar
        </Link>
      ) : (
        <button
          className="botao botao-principal"
          type="button"
          disabled={ocupado || !estado?.disponivel}
          onClick={() => void abrir(gerenciar ? 'portal' : 'checkout')}
        >
          {ocupado ? 'Abrindo…' : gerenciar ? 'Gerenciar assinatura' : 'Assinar por R$ 9,99/mês'}
        </button>
      )}
      {estado && !estado.disponivel && (
        <p className="plano-nota">Assinaturas em breve. Você já pode estudar gratuitamente.</p>
      )}
      {erro && <p role="alert">{erro}</p>}
      {!oferta && (
        <button
          type="button"
          className="botao botao-leve"
          disabled={ocupado || isPending}
          onClick={() => setAtualizacao((n) => n + 1)}
        >
          Atualizar plano e uso
        </button>
      )}
    </div>
  );
}
