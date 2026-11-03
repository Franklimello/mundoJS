'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { contaCliente } from '@/conta/cliente';

export function RecuperarSenha({ nova = false }: { nova?: boolean }) {
  const parametros = useSearchParams();
  const token = parametros.get('token');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  async function enviar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ocupado) return;
    setErro(null);
    if (nova && senha !== confirmacao) {
      setErro('As senhas precisam ser iguais.');
      return;
    }
    setOcupado(true);
    try {
      const resposta = nova
        ? await contaCliente.resetPassword({ token: token || '', newPassword: senha })
        : await contaCliente.requestPasswordReset({
            email: email.trim(),
            redirectTo: `${window.location.origin}/conta/nova-senha`,
          });
      if (resposta.error) {
        if (resposta.error.status === 429) throw new Error('Muitas tentativas. Aguarde um pouco e tente novamente.');
        throw new Error(
          nova
            ? 'Este link não pode mais ser usado. Peça um novo link de recuperação.'
            : 'Não foi possível solicitar o e-mail agora. Tente novamente.',
        );
      }
      setSenha('');
      setConfirmacao('');
      setConcluido(true);
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Não foi possível concluir. Tente novamente.');
    } finally {
      setOcupado(false);
    }
  }
  if (nova && (!token || parametros.get('error')))
    return (
      <div className="conta-cartao">
        <p role="alert">Este link é inválido ou expirou.</p>
        <Link href="/conta/recuperar">Pedir outro link de recuperação</Link>
      </div>
    );
  return (
    <div className="conta-cartao">
      {concluido ? (
        <p role="status">
          {nova
            ? 'Senha alterada. Entre novamente para recuperar seu progresso.'
            : 'Se houver uma conta com esse e-mail, você receberá um link para escolher uma nova senha. Confira também a pasta de spam.'}
        </p>
      ) : (
        <form className="conta-formulario" onSubmit={(event) => void enviar(event)} aria-busy={ocupado}>
          {nova ? (
            <>
              <label htmlFor="nova-senha">Nova senha</label>
              <input
                id="nova-senha"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                aria-describedby="nova-senha-ajuda"
              />
              <p id="nova-senha-ajuda" className="conta-discreto">
                Use pelo menos 12 caracteres.
              </p>
              <label htmlFor="confirmar-senha">Repita a nova senha</label>
              <input
                id="confirmar-senha"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={128}
                required
                value={confirmacao}
                onChange={(event) => setConfirmacao(event.target.value)}
              />
            </>
          ) : (
            <>
              <label htmlFor="recuperar-email">E-mail da sua conta</label>
              <input
                id="recuperar-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                spellCheck={false}
              />
            </>
          )}
          <button type="submit" className="botao botao-principal" disabled={ocupado}>
            {ocupado ? 'Aguarde…' : nova ? 'Salvar nova senha' : 'Enviar link de recuperação'}
          </button>
        </form>
      )}
      {erro && (
        <p className="conta-erro" role="alert">
          {erro} {nova && <Link href="/conta/recuperar">Pedir outro link</Link>}
        </p>
      )}
      <p>
        <Link href="/conta">Voltar para entrar</Link>
      </p>
    </div>
  );
}
