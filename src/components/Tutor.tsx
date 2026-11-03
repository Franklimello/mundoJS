'use client';

import { type Ref, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { ApoioTutor, ContextoTutor, MensagemTutor, NivelAjuda } from '@/tutor/tipos';
import { Texto } from './Texto';
import Link from 'next/link';
import { aguardarEventos, registrarEvento } from '@/estudo/eventos';

export interface TutorControles {
  abrir: () => void;
}
const NIVEIS: { nivel: NivelAjuda; rotulo: string; pergunta: string }[] = [
  {
    nivel: 'pista',
    rotulo: '1. Uma pista',
    pergunta: 'Me dê uma pista para o próximo passo, sem resolver o exercício.',
  },
  {
    nivel: 'explicacao',
    rotulo: '2. Explicar o conceito',
    pergunta: 'Explique o conceito que preciso entender e como começar minha tentativa.',
  },
  {
    nivel: 'exemplo',
    rotulo: '3. Exemplo parecido',
    pergunta: 'Mostre um exemplo parecido, com outros valores, para eu adaptar sozinho.',
  },
];

/** Formatação deliberadamente limitada: respostas nunca viram HTML executável. */
export function RespostaTutor({ texto }: { texto: string }) {
  return texto.split(/(```[\s\S]*?```)/g).map((parte, i) => {
    if (parte.startsWith('```')) {
      const codigo = parte.slice(3, -3).replace(/^[\w-]*\n/, '');
      return (
        <pre key={i} tabIndex={0}>
          <code>{codigo}</code>
        </pre>
      );
    }
    return (
      <div key={i} className="tutor-prosa">
        <Texto>{parte}</Texto>
      </div>
    );
  });
}

interface TutorProps {
  contexto: ContextoTutor;
  codigo: string;
  diagnostico: string;
  ref?: Ref<TutorControles>;
  aoPraticar?: () => void;
}

export function Tutor({ contexto, codigo, diagnostico, ref, aoPraticar }: TutorProps) {
  const id = useId();
  const [aberto, setAberto] = useState(false);
  const [pergunta, setPergunta] = useState('');
  const [mensagens, setMensagens] = useState<MensagemTutor[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaPergunta, setUltimaPergunta] = useState('');
  const [nivelAjuda, setNivelAjuda] = useState<NivelAjuda>('pista');
  const [ultimoNivel, setUltimoNivel] = useState<NivelAjuda>('pista');
  const [apoio, setApoio] = useState<ApoioTutor | null>(null);
  const emCurso = useRef<AbortController | null>(null);
  const conversa = useRef<HTMLDivElement | null>(null);
  const campo = useRef<HTMLTextAreaElement | null>(null);
  const regiao = useRef<HTMLElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      abrir() {
        setAberto(true);
        requestAnimationFrame(() => {
          regiao.current?.focus({ preventScroll: true });
          regiao.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        });
      },
    }),
    [],
  );

  useEffect(() => () => emCurso.current?.abort(), []);

  async function enviar(texto: string, nivel = nivelAjuda) {
    const perguntaEnviada = texto.trim();
    if (!perguntaEnviada || emCurso.current) return;
    setAberto(true);
    setEnviando(true);
    setErro(null);
    setUltimaPergunta(perguntaEnviada);
    setUltimoNivel(nivel);
    const controle = new AbortController();
    emCurso.current = controle;
    const posicao = 'trilha' in contexto ? contexto : undefined;
    registrarEvento({ tipo: 'ajuda_pedida', posicao });
    try {
      await aguardarEventos();
      if (controle.signal.aborted) return;
      const historico: MensagemTutor[] = [...mensagens.slice(-8), { papel: 'usuario', texto: perguntaEnviada }];
      const resposta = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contexto, codigo, diagnostico, mensagens: historico, nivelAjuda: nivel }),
        signal: AbortSignal.any([controle.signal, AbortSignal.timeout(40000)]),
      });
      const dados = (await resposta.json()) as { resposta?: string; erro?: string; apoio?: ApoioTutor };
      if (controle.signal.aborted) return;
      if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível consultar o tutor. Tente novamente.');
      if (!dados.resposta) throw new Error('O tutor não conseguiu responder. Tente novamente.');
      registrarEvento({ tipo: 'ajuda_recebida', posicao });
      setMensagens([...historico, { papel: 'tutor', texto: dados.resposta }]);
      setApoio(dados.apoio ?? null);
      setPergunta((atual) => (atual.trim() === perguntaEnviada ? '' : atual));
      // Atualiza só a rolagem da conversa, sem tirar o foco do editor ou da pergunta.
      requestAnimationFrame(() => {
        const painel = conversa.current;
        if (painel) painel.scrollTop = painel.scrollHeight;
      });
    } catch (falha) {
      if (!controle.signal.aborted) {
        setErro(
          falha instanceof Error && falha.name !== 'TimeoutError'
            ? falha.message
            : 'O tutor demorou para responder. Tente novamente.',
        );
      }
    } finally {
      if (emCurso.current === controle) {
        emCurso.current = null;
        setEnviando(false);
      }
    }
  }

  function cancelar() {
    emCurso.current?.abort();
    emCurso.current = null;
    setEnviando(false);
  }

  return (
    <section ref={regiao} tabIndex={-1} className="tutor" aria-label="Tutor MundoJS">
      <div className="tutor-cabecalho">
        <div>
          <h3 className="folha-secao">
            Tutor MundoJS <span className="tutor-selo">com Gemini</span>
          </h3>
          <p>Uma pista, uma explicação ou um exemplo para você tentar.</p>
        </div>
        <button
          type="button"
          className="botao botao-leve"
          aria-expanded={aberto}
          aria-controls={`${id}-painel`}
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? 'Recolher' : 'Pedir ajuda'}
        </button>
      </div>

      <div id={`${id}-painel`} hidden={!aberto}>
        <p className="tutor-aviso" id={`${id}-aviso`}>
          Ao enviar, sua pergunta, seu código, o contexto da lição e um resumo das tentativas recentes serão
          compartilhados com o Gemini. Evite incluir dados pessoais ou senhas. A IA pode errar: confira as sugestões no
          editor.
        </p>
        <p className="tutor-aviso">
          <Link href="/conta/plano">Ver minha franquia de perguntas</Link> · <Link href="/planos">Conhecer o Pro</Link>
        </p>
        <div className="tutor-niveis" role="group" aria-label="Nível de ajuda">
          {NIVEIS.map((opcao) => (
            <button
              key={opcao.nivel}
              type="button"
              className="botao botao-leve"
              aria-pressed={nivelAjuda === opcao.nivel}
              disabled={enviando}
              onClick={() => {
                setNivelAjuda(opcao.nivel);
                setPergunta((atual) =>
                  !atual.trim() || NIVEIS.some((item) => item.pergunta === atual) ? opcao.pergunta : atual,
                );
                campo.current?.focus();
              }}
            >
              {opcao.rotulo}
            </button>
          ))}
        </div>
        <p className="tutor-aviso">
          Comece por uma pista. Se precisar, avance para a explicação e depois para um exemplo parecido.
        </p>
        <details className="tutor-outras-perguntas">
          <summary>Perguntar sobre meu erro ou código</summary>
          <div className="tutor-atalhos" aria-label="Sugestões de perguntas">
            {['Explique meu erro', 'Revise meu código'].map((texto) => (
              <button
                key={texto}
                type="button"
                className="botao botao-leve"
                disabled={enviando}
                onClick={() => {
                  setPergunta(texto);
                  setNivelAjuda('explicacao');
                  campo.current?.focus();
                }}
              >
                {texto}
              </button>
            ))}
          </div>
        </details>

        {mensagens.length > 0 && (
          <div ref={conversa} className="tutor-conversa" role="log" aria-label="Conversa com o tutor" tabIndex={0}>
            {mensagens.map((mensagem, i) => (
              <div
                key={i}
                className={`tutor-mensagem tutor-${mensagem.papel}`}
                tabIndex={mensagem.papel === 'tutor' ? -1 : undefined}
              >
                <p className="tutor-autor">{mensagem.papel === 'usuario' ? 'Você' : 'Tutor MundoJS'}</p>
                <RespostaTutor texto={mensagem.texto} />
              </div>
            ))}
          </div>
        )}

        {apoio && mensagens.length > 0 && (
          <div className="tutor-proximo">
            {apoio.historico && (
              <p>
                Histórico deste exercício nos últimos 30 dias: {apoio.historico.tentativas}{' '}
                {apoio.historico.tentativas === 1 ? 'tentativa conferida' : 'tentativas conferidas'},{' '}
                {apoio.historico.semAcerto} sem acerto.
              </p>
            )}
            <p>Agora tente uma mudança sozinho e confira o resultado. A ajuda continua disponível se precisar.</p>
            {aoPraticar && (
              <button type="button" className="botao botao-leve" onClick={aoPraticar}>
                Tentar no editor
              </button>
            )}
            {apoio.nivel !== 'exemplo' && (
              <button
                type="button"
                className="botao botao-leve"
                disabled={enviando}
                onClick={() => {
                  const proximo = NIVEIS.find(
                    (opcao) => opcao.nivel === (apoio.nivel === 'pista' ? 'explicacao' : 'exemplo'),
                  )!;
                  setNivelAjuda(proximo.nivel);
                  setPergunta(proximo.pergunta);
                  campo.current?.focus();
                }}
              >
                {apoio.nivel === 'pista' ? 'Quero uma explicação' : 'Quero um exemplo parecido'}
              </button>
            )}
          </div>
        )}

        <form
          className="tutor-formulario"
          onSubmit={(event) => {
            event.preventDefault();
            void enviar(pergunta);
          }}
          aria-busy={enviando}
        >
          <label htmlFor={`${id}-pergunta`}>Qual é a sua dúvida?</label>
          <textarea
            ref={campo}
            id={`${id}-pergunta`}
            value={pergunta}
            onChange={(event) => setPergunta(event.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Por onde começo este exercício?"
            aria-describedby={`${id}-aviso`}
          />
          <div className="tutor-acoes">
            <button type="submit" className="botao botao-principal" disabled={enviando || !pergunta.trim()}>
              {enviando ? 'Preparando uma resposta…' : 'Enviar pergunta'}
            </button>
            {enviando && (
              <button type="button" className="botao botao-leve" onClick={cancelar}>
                Cancelar
              </button>
            )}
            {mensagens.length > 0 && !enviando && (
              <button
                type="button"
                className="botao botao-leve"
                onClick={() => {
                  setMensagens([]);
                  setApoio(null);
                  setNivelAjuda('pista');
                  setErro(null);
                  campo.current?.focus();
                }}
              >
                Nova conversa
              </button>
            )}
          </div>
          <p className="sr-only" role="status">
            {enviando
              ? 'O tutor está preparando uma resposta.'
              : mensagens.length > 0
                ? 'Resposta do tutor disponível.'
                : ''}
          </p>
        </form>
        {erro && (
          <div className="tutor-erro" role="alert">
            <p>{erro}</p>
            <button
              type="button"
              className="botao botao-leve"
              disabled={enviando}
              onClick={() => void enviar(ultimaPergunta, ultimoNivel)}
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
