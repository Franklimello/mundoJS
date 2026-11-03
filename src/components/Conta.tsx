'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { contaCliente } from '@/conta/cliente';
import { incorporarProgresso } from '@/conta/vincular';
import { entrarGoogleFirebase, mensagemErroGoogle } from '@/conta/firebase';

function PainelConta({ id, nome, email }: { id: string; nome: string; email: string }) {
  const [status, setStatus] = useState('Incorporando seu progresso deste navegador…');
  const [erro, setErro] = useState(false);
  const [arquivados, setArquivados] = useState(0);
  const [saindo, setSaindo] = useState(false);
  async function incorporar() {
    try {
      const resultado = await incorporarProgresso(id);
      setErro(false);
      setArquivados(resultado.arquivados);
      setStatus('Seu progresso está vinculado à sua conta. Entre com este e-mail em outro dispositivo para continuar.');
    } catch {
      setErro(true);
      setStatus('Não conseguimos incorporar o progresso deste navegador. Tente novamente antes de sair.');
    }
  }
  useEffect(() => {
    let ativo = true;
    void incorporarProgresso(id)
      .then((resultado) => {
        if (!ativo) return;
        setErro(false);
        setArquivados(resultado.arquivados);
        setStatus(
          'Seu progresso está vinculado à sua conta. Entre com este e-mail em outro dispositivo para continuar.',
        );
      })
      .catch(() => {
        if (!ativo) return;
        setErro(true);
        setStatus('Não conseguimos incorporar o progresso deste navegador. Tente novamente antes de sair.');
      });
    return () => {
      ativo = false;
    };
  }, [id]);
  async function sair() {
    setSaindo(true);
    try {
      const resposta = await contaCliente.signOut();
      if (resposta.error) throw new Error('Falha ao sair');
      window.location.replace('/');
    } catch {
      setStatus('Não foi possível sair. Tente novamente.');
      setErro(true);
      setSaindo(false);
    }
  }
  return (
    <div className="conta-cartao">
      <h2>Olá, {nome}.</h2>
      <p className="conta-email">{email}</p>
      <p role={erro ? 'alert' : 'status'}>{status}</p>
      {erro && (
        <button type="button" className="botao botao-leve" onClick={() => void incorporar()}>
          Tentar salvar novamente
        </button>
      )}
      {arquivados > 0 && (
        <p>
          Preservamos {arquivados} {arquivados === 1 ? 'rascunho anterior' : 'rascunhos anteriores'} que tinham outra
          versão na conta. <a href="/api/conta/rascunhos">Baixar rascunhos anteriores</a>.
        </p>
      )}
      <div className="conta-acoes">
        <Link href="/conta/certificados" className="botao botao-leve">
          Meus certificados
        </Link>
        <Link href="/conta/plano" className="botao botao-leve">
          Meu plano e uso do tutor
        </Link>
        <Link href="/" className="botao botao-principal">
          Continuar estudando
        </Link>
        <button type="button" className="botao botao-leve" disabled={saindo} onClick={() => void sair()}>
          {saindo ? 'Saindo…' : 'Sair da conta'}
        </button>
      </div>
    </div>
  );
}

export function Conta({ criar = false, emailHabilitado = true }: { criar?: boolean; emailHabilitado?: boolean }) {
  const { data: sessao, isPending, error: erroSessao, refetch } = contaCliente.useSession();
  const [modo, setModo] = useState<'entrar' | 'criar'>(criar ? 'criar' : 'entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [ocupadoGoogle, setOcupadoGoogle] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function entrarGoogle() {
    if (ocupado || ocupadoGoogle) return;
    setOcupadoGoogle(true);
    setErro(null);
    setAviso(null);
    try {
      await entrarGoogleFirebase();
      window.location.replace('/conta');
    } catch (falha) {
      setErro(mensagemErroGoogle(falha));
    } finally {
      setOcupadoGoogle(false);
    }
  }

  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ocupado || ocupadoGoogle) return;
    setOcupado(true);
    setErro(null);
    setAviso(null);
    try {
      if (modo === 'criar') {
        const resposta = await contaCliente.signUp.email({
          email: email.trim(),
          name: 'Estudante',
          password: senha,
          callbackURL: '/conta',
        });
        if (resposta.error) {
          if (resposta.error.status === 429) throw new Error('Muitas tentativas. Aguarde um pouco e tente novamente.');
          throw new Error(
            'Não foi possível concluir o cadastro. Confira os dados ou use a recuperação de senha se já tiver uma conta.',
          );
        }
        setSenha('');
        setAviso(
          'Confira seu e-mail e abra o link de confirmação. Para incorporar o progresso atual, abra o link neste navegador ou entre aqui depois de confirmar.',
        );
      } else {
        const resposta = await contaCliente.signIn.email({ email: email.trim(), password: senha });
        if (resposta.error) {
          if (resposta.error.status === 429) throw new Error('Muitas tentativas. Aguarde um pouco e tente novamente.');
          if (resposta.error.code === 'EMAIL_NOT_VERIFIED')
            throw new Error('Confirme seu e-mail antes de entrar. Enviamos um novo link de confirmação.');
          throw new Error('Não foi possível entrar. Confira o e-mail e a senha.');
        }
        window.location.replace('/conta');
      }
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível acessar a conta. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }

  if (isPending) return <p role="status">Verificando sua conta…</p>;
  if (erroSessao)
    return (
      <div role="alert">
        <p>Não conseguimos acessar sua conta agora.</p>
        <button type="button" className="botao botao-leve" onClick={() => void refetch()}>
          Tentar novamente
        </button>
        <p>
          <Link href="/trilhas">Continuar sem entrar</Link>
        </p>
      </div>
    );
  if (sessao)
    return <PainelConta key={sessao.user.id} id={sessao.user.id} nome={sessao.user.name} email={sessao.user.email} />;

  return (
    <div className="conta-cartao">
      {emailHabilitado && (
        <div className="conta-modos" role="group" aria-label="Acesso à conta">
          <button
            type="button"
            className="botao botao-leve"
            aria-pressed={modo === 'entrar'}
            onClick={() => {
              setModo('entrar');
              setErro(null);
              setAviso(null);
            }}
          >
            Já tenho conta
          </button>
          <button
            type="button"
            className="botao botao-leve"
            aria-pressed={modo === 'criar'}
            onClick={() => {
              setModo('criar');
              setErro(null);
              setAviso(null);
            }}
          >
            Criar minha conta
          </button>
        </div>
      )}
      <h2>
        {!emailHabilitado
          ? 'Continue com sua conta Google'
          : modo === 'entrar'
            ? 'Entrar na minha conta'
            : 'Criar minha conta'}
      </h2>
      <p>
        O progresso e os rascunhos deste navegador serão incorporados à sua conta. Se houver versões diferentes de um
        rascunho, manteremos a mais recente e preservaremos a anterior para baixar.
      </p>
      <button
        type="button"
        className="botao botao-google"
        disabled={ocupado || ocupadoGoogle}
        onClick={() => void entrarGoogle()}
      >
        <Image src="/google-g.png" width={20} height={20} alt="" />
        {ocupadoGoogle ? 'Conectando com Google…' : 'Continuar com Google'}
      </button>
      {!emailHabilitado && (
        <p>
          Nesta prévia, use o Google para entrar ou criar sua conta. O acesso por e-mail e senha será liberado depois.
        </p>
      )}
      {emailHabilitado && (
        <>
          <div className="conta-divisor">
            <span>ou use seu e-mail</span>
          </div>
          <form
            onSubmit={(event) => void enviar(event)}
            className="conta-formulario"
            aria-busy={ocupado || ocupadoGoogle}
          >
            <label htmlFor="conta-email">Seu e-mail</label>
            <input
              id="conta-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete={modo === 'entrar' ? 'username' : 'email'}
              maxLength={254}
              spellCheck={false}
            />
            <label htmlFor="conta-senha">Sua senha</label>
            <input
              id="conta-senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
              minLength={modo === 'criar' ? 12 : 1}
              maxLength={128}
              autoComplete={modo === 'criar' ? 'new-password' : 'current-password'}
              aria-describedby={modo === 'criar' ? 'conta-senha-ajuda' : undefined}
            />
            {modo === 'criar' && (
              <p id="conta-senha-ajuda" className="conta-discreto">
                Use pelo menos 12 caracteres. Uma frase fácil de lembrar também funciona.
              </p>
            )}
            <button type="submit" className="botao botao-principal" disabled={ocupado || ocupadoGoogle}>
              {ocupado
                ? 'Aguarde…'
                : modo === 'entrar'
                  ? 'Entrar e recuperar meu progresso'
                  : 'Criar conta e salvar meu progresso'}
            </button>
          </form>
        </>
      )}
      {erro && (
        <p role="alert" className="conta-erro">
          {erro}
        </p>
      )}
      {aviso && (
        <p role="status" className="conta-aviso">
          {aviso}
        </p>
      )}
      <div className="conta-acoes">
        {emailHabilitado && <Link href="/conta/recuperar">Esqueci minha senha</Link>}
        <Link href="/trilhas">Continuar sem cadastro</Link>
      </div>
    </div>
  );
}
