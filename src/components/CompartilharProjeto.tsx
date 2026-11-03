'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { contaCliente } from '@/conta/cliente';

type Publicacao = { id: string; atualizadoEm: string };
export function CompartilharProjeto({
  trilha,
  codigo,
  identidade,
  somenteGerenciar = false,
}: {
  trilha: string;
  codigo: string;
  identidade?: string;
  somenteGerenciar?: boolean;
}) {
  const { data: sessao, isPending } = contaCliente.useSession();
  const [resultado, setResultado] = useState<{ dono: string; publicacao: Publicacao | null }>();
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [url, setUrl] = useState('');
  const campoId = useId();
  const dono = sessao?.user.id;
  const identidadeAcao = somenteGerenciar && dono ? `conta:${dono}` : identidade;
  const conhecido = resultado?.dono === dono && dono !== undefined;
  const publicacao = conhecido ? (resultado?.publicacao ?? null) : null;

  async function consultar() {
    if (!dono || ocupado) return;
    setOcupado(true);
    setErro('');
    try {
      const resposta = await fetch(`/api/projetos/compartilhar?trilha=${encodeURIComponent(trilha)}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
        headers: { 'X-MundoJS-Conta': dono },
      });
      const dados = (await resposta.json()) as { publicacao: Publicacao | null; erro?: string };
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível verificar o link.');
      setResultado({ dono, publicacao: dados.publicacao });
      setUrl(dados.publicacao ? `${window.location.origin}/compartilhado/${dados.publicacao.id}` : '');
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível verificar o link.');
    } finally {
      setOcupado(false);
    }
  }

  async function alterar(acao: 'publicar' | 'retirar') {
    if (!dono || !identidadeAcao || ocupado || (somenteGerenciar && acao === 'publicar')) return;
    setOcupado(true);
    setErro('');
    setAviso('');
    try {
      const resposta = await fetch('/api/projetos/compartilhar', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acao,
          trilha,
          codigo: acao === 'publicar' ? codigo : undefined,
          identidadeEsperada: identidadeAcao,
        }),
      });
      const dados = (await resposta.json()) as { publicacao: Publicacao | null; erro?: string };
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível alterar o compartilhamento.');
      setResultado({ dono, publicacao: dados.publicacao });
      setUrl(dados.publicacao ? `${window.location.origin}/compartilhado/${dados.publicacao.id}` : '');
      setAviso(
        acao === 'retirar'
          ? 'O link foi retirado do ar. Quem já copiou o código pode continuar com sua cópia.'
          : 'Esta versão está disponível no link de leitura. Mudanças no rascunho só aparecerão depois de atualizar o link.',
      );
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível alterar o compartilhamento.');
    } finally {
      setOcupado(false);
    }
  }

  function baixar() {
    const arquivo = URL.createObjectURL(new Blob([codigo], { type: 'text/javascript;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = arquivo;
    link.download = `${trilha}.js`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(arquivo), 1000);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setAviso('Link copiado.');
    } catch {
      setErro('Selecione e copie o link no campo acima.');
    }
  }

  return (
    <section className="projeto-compartilhar" aria-label="Guardar e compartilhar projeto">
      <h3>{somenteGerenciar ? 'Seus links anteriores' : 'Seu projeto, do seu jeito.'}</h3>
      <p>
        {somenteGerenciar
          ? 'Você pode consultar ou retirar versões já compartilhadas, mesmo sem uma assinatura ativa.'
          : 'O rascunho é salvo automaticamente. Você também pode baixar o arquivo JavaScript.'}
      </p>
      {!somenteGerenciar && (
        <button type="button" className="botao botao-leve" onClick={baixar}>
          Baixar meu código (.js)
        </button>
      )}
      <details
        onToggle={(event) => {
          if (event.currentTarget.open && dono && !conhecido) void consultar();
        }}
      >
        <summary>
          {somenteGerenciar ? 'Gerenciar link anterior deste projeto' : 'Compartilhar uma versão do projeto'}
        </summary>
        <p>
          Qualquer pessoa com o link poderá ler o código compartilhado. Revise o editor e retire senhas, chaves e dados
          pessoais antes de criar ou atualizar o link.
        </p>
        {isPending ? (
          <p role="status">Verificando sua conta…</p>
        ) : !sessao ? (
          <p>
            <Link href="/conta">Entre na sua conta para controlar o link de leitura</Link>. Publicar novas versões exige
            o Pro.
          </p>
        ) : (
          <>
            {!conhecido ? (
              <button type="button" className="botao botao-leve" disabled={ocupado} onClick={() => void consultar()}>
                {ocupado ? 'Verificando link…' : 'Verificar compartilhamento'}
              </button>
            ) : (
              <>
                {!somenteGerenciar && (
                  <button
                    type="button"
                    className="botao botao-principal"
                    disabled={ocupado || !identidade}
                    onClick={() => void alterar('publicar')}
                  >
                    {ocupado ? 'Aguarde…' : publicacao ? 'Atualizar link com este código' : 'Criar link de leitura'}
                  </button>
                )}
                {!somenteGerenciar && !identidade && (
                  <p role="status">Aguarde o carregamento do seu rascunho antes de compartilhar.</p>
                )}
                {somenteGerenciar && !publicacao && <p>Você não tem um link publicado para este projeto.</p>}
                {publicacao && (
                  <div className="projeto-link">
                    <label htmlFor={campoId}>Link da versão compartilhada</label>
                    <input id={campoId} value={url} readOnly onFocus={(event) => event.target.select()} />
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      Abrir página de leitura
                    </a>
                    <button type="button" className="botao botao-leve" onClick={() => void copiar()}>
                      Copiar link
                    </button>
                    <button
                      type="button"
                      className="botao botao-leve"
                      disabled={ocupado || !identidadeAcao}
                      onClick={() => void alterar('retirar')}
                    >
                      Retirar link do ar
                    </button>
                    <p>
                      O link mostra a última versão enviada. Seu rascunho continua privado até você atualizar o link.
                    </p>
                    {/^http:\/\/(localhost|127\.0\.0\.1):/.test(url) && (
                      <p>
                        Este endereço local só abre nesta máquina. Para outras pessoas acessarem, o MundoJS precisa
                        estar publicado.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
        {erro && <p role="alert">{erro}</p>}
        {aviso && <p role="status">{aviso}</p>}
      </details>
    </section>
  );
}
