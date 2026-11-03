'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, type Ref, useCallback, useEffect, useRef, useState } from 'react';
import { rodarNoNavegador } from '@/engine/sandbox';
import type { ResultadoExecucao, TesteDefinicao } from '@/engine/tipos';
import { apagarRascunho, lerRascunho, salvarRascunho } from '@/progresso/rascunhos';
import type { ContextoTutor } from '@/tutor/tipos';
import { registrarEvento } from '@/estudo/eventos';
import { Conferencia } from './Conferencia';
import { Rodar, Tique } from './Marcas';
import { Saida } from './Saida';
import { Tutor, type TutorControles } from './Tutor';
import { SalvarProgresso } from './SalvarProgresso';

// O editor é pesado e só roda no navegador: carrega à parte, depois da página.
const EditorCodigo = dynamic(() => import('./EditorCodigo'), { ssr: false });

const SEM_TESTES: TesteDefinicao[] = [];
/** Quantas conferências erradas até oferecer uma solução. */
const FALHAS_ATE_OFERECER_SOLUCAO = 3;

export interface FolhaProps {
  /** O nome da folha no alto, como "Seu código". */
  titulo: string;
  /** Descrição do campo, para leitores de tela. */
  rotuloDoEditor: string;
  codigoInicial: string;
  /** Com ela, o código é guardado no servidor e volta quando o aluno retorna. */
  chaveRascunho?: string;
  /** Com testes, aparece o botão Conferir. */
  testes?: TesteDefinicao[];
  /** Mostrada só depois de várias tentativas, e só se o aluno pedir. */
  solucao?: string;
  aoConcluir?: () => void;
  /** O que aparece quando todos os testes passam, como o link da próxima lição. */
  aoAcertar?: ReactNode;
  /** Roda sozinho ao abrir e enquanto o aluno digita. */
  rodarAoDigitar?: boolean;
  pautasMinimas?: number;
  contextoTutor?: ContextoTutor;
  tutorRef?: Ref<TutorControles>;
  aoPraticar?: () => void;
  rodape?: (dados: { codigo: string; identidade?: string }) => ReactNode;
}

type Execucao = { modo: 'rodar' | 'conferir'; dados: ResultadoExecucao; codigo: string };

/**
 * A folha pautada: editor, saída e conferência.
 *
 * Rodar mostra só o que o código imprime. Conferir roda os testes da lição e
 * corrige, teste por teste.
 */
export function Folha({
  titulo,
  rotuloDoEditor,
  codigoInicial,
  chaveRascunho,
  testes = SEM_TESTES,
  solucao,
  aoConcluir,
  aoAcertar,
  rodarAoDigitar = false,
  pautasMinimas = 9,
  contextoTutor,
  tutorRef,
  aoPraticar,
  rodape,
}: FolhaProps) {
  const [codigo, setCodigo] = useState(codigoInicial);
  const [execucao, setExecucao] = useState<Execucao | null>(null);
  const [executando, setExecutando] = useState(false);
  const [falhas, setFalhas] = useState(0);
  const [mostrandoSolucao, setMostrandoSolucao] = useState(false);
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [editorPronto, setEditorPronto] = useState(false);
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [identidadeRascunho, setIdentidadeRascunho] = useState<string>();
  const [erroRascunho, setErroRascunho] = useState<string | null>(null);

  const codigoAtual = useRef(codigo);
  const ocupado = useRef(false);
  const pendente = useRef(false);
  const editado = useRef(false);
  const pendenteDeSalvar = useRef(false);
  const donoDoRascunho = useRef<string | undefined>(undefined);
  const aoConcluirAtual = useRef(aoConcluir);
  useEffect(() => {
    codigoAtual.current = codigo;
    aoConcluirAtual.current = aoConcluir;
  });

  const executar = useCallback(
    async (modo: 'rodar' | 'conferir') => {
      if (ocupado.current) {
        // O aluno digitou durante uma execução: roda de novo com o texto mais novo.
        if (modo === 'rodar') pendente.current = true;
        return;
      }
      ocupado.current = true;
      setExecutando(true);
      try {
        const codigoExecutado = codigoAtual.current;
        const dados = await rodarNoNavegador(codigoExecutado, modo === 'conferir' ? testes : SEM_TESTES);
        setExecucao({ modo, dados, codigo: codigoExecutado });
        if (contextoTutor) {
          const posicao = 'trilha' in contextoTutor ? contextoTutor : undefined;
          if (modo === 'rodar') registrarEvento({ tipo: 'codigo_rodado', posicao });
          else
            registrarEvento({
              tipo: 'exercicio_conferido',
              posicao,
              passou: !dados.erro && dados.testes.length > 0 && dados.testes.every((teste) => teste.passou),
            });
        }
        if (modo === 'conferir') {
          const acertou = !dados.erro && dados.testes.length > 0 && dados.testes.every((teste) => teste.passou);
          if (acertou) aoConcluirAtual.current?.();
          else setFalhas((anterior) => anterior + 1);
        }
      } finally {
        ocupado.current = false;
        setExecutando(false);
        if (pendente.current) {
          pendente.current = false;
          void executar('rodar');
        }
      }
    },
    [testes, contextoTutor],
  );

  // O editor só existe no navegador: quando ele monta, volta o que o aluno estava escrevendo.
  const carregarRascunho = useCallback(async () => {
    if (!chaveRascunho) return;
    try {
      const salvo = await lerRascunho(chaveRascunho);
      donoDoRascunho.current = salvo.identidade;
      setIdentidadeRascunho(salvo.identidade);
      if (!editado.current && salvo.codigo !== null) {
        codigoAtual.current = salvo.codigo;
        setCodigo(salvo.codigo);
      }
      setRascunhoCarregado(true);
      setErroRascunho(null);
    } catch {
      setErroRascunho('Não foi possível carregar seu rascunho.');
    }
  }, [chaveRascunho]);

  const aoMontarOEditor = useCallback(() => {
    setEditorPronto(true);
    void carregarRascunho();
  }, [carregarRascunho]);

  const gravarRascunho = useCallback(async () => {
    if (!chaveRascunho) return;
    const valor = codigoAtual.current;
    try {
      if (valor === codigoInicial) await apagarRascunho(chaveRascunho, donoDoRascunho.current);
      else await salvarRascunho(chaveRascunho, valor, donoDoRascunho.current);
      if (codigoAtual.current === valor) pendenteDeSalvar.current = false;
      setErroRascunho(null);
    } catch {
      setErroRascunho('Não foi possível salvar seu rascunho. Tente novamente antes de sair.');
    }
  }, [chaveRascunho, codigoInicial]);

  function alterarCodigo(valor: string) {
    editado.current = true;
    pendenteDeSalvar.current = true;
    codigoAtual.current = valor;
    setCodigo(valor);
  }

  // Guarda o rascunho um instante depois da última tecla.
  useEffect(() => {
    if (!chaveRascunho || !rascunhoCarregado || !pendenteDeSalvar.current) return;
    const espera = setTimeout(() => {
      void gravarRascunho();
    }, 400);
    return () => clearTimeout(espera);
  }, [codigo, chaveRascunho, rascunhoCarregado, gravarRascunho]);

  useEffect(() => {
    function guardarPendente() {
      if (pendenteDeSalvar.current) void gravarRascunho();
    }
    window.addEventListener('pagehide', guardarPendente);
    return () => {
      window.removeEventListener('pagehide', guardarPendente);
      guardarPendente();
    };
  }, [gravarRascunho]);

  // Modo "veja rodar": roda ao abrir e um instante depois de cada mudança.
  const primeiraRodada = useRef(true);
  useEffect(() => {
    if (!rodarAoDigitar) return;
    const espera = setTimeout(
      () => {
        primeiraRodada.current = false;
        void executar('rodar');
      },
      primeiraRodada.current ? 0 : 900,
    );
    return () => clearTimeout(espera);
  }, [codigo, rodarAoDigitar, executar]);

  function recomecar() {
    alterarCodigo(codigoInicial);
    setExecucao(null);
    setFalhas(0);
    setMostrandoSolucao(false);
    setConfirmandoReinicio(false);
    if (chaveRascunho) void gravarRascunho();
  }

  const temTestes = testes.length > 0;
  const conferido = execucao?.modo === 'conferir' ? execucao.dados : null;
  const acertou = Boolean(
    conferido && !conferido.erro && conferido.testes.length > 0 && conferido.testes.every((t) => t.passou),
  );
  const mudou = codigo !== codigoInicial;
  const podeVerSolucao = Boolean(solucao) && falhas >= FALHAS_ATE_OFERECER_SOLUCAO && !acertou;

  const status = executando
    ? 'Rodando…'
    : !execucao
      ? ''
      : execucao.dados.erro
        ? 'O código deu erro.'
        : conferido
          ? acertou
            ? 'Tudo certo.'
            : `${conferido.testes.filter((t) => t.passou).length} de ${conferido.testes.length} testes certos.`
          : 'O código rodou sem erro.';

  return (
    <section className="folha" aria-label={titulo}>
      <div className="folha-edicao">
        <div className="folha-barra">
          <h2 className="folha-titulo">{titulo}</h2>
          <div className="folha-acoes">
            {mudou &&
              (confirmandoReinicio ? (
                <span className="folha-confirma">
                  Apagar o que escreveu?
                  <button type="button" className="botao botao-leve" onClick={recomecar}>
                    Apagar
                  </button>
                  <button type="button" className="botao botao-leve" onClick={() => setConfirmandoReinicio(false)}>
                    Manter
                  </button>
                </span>
              ) : (
                <button type="button" className="botao botao-leve" onClick={() => setConfirmandoReinicio(true)}>
                  Recomeçar
                </button>
              ))}
            <button
              type="button"
              className="botao botao-rodar"
              onClick={() => void executar('rodar')}
              disabled={executando}
            >
              <Rodar />
              Rodar
            </button>
            {temTestes && (
              <button
                type="button"
                className="botao botao-conferir"
                onClick={() => void executar('conferir')}
                disabled={executando}
              >
                <Tique tamanho={16} className="sem-animacao" />
                Conferir
              </button>
            )}
          </div>
        </div>

        <div className="papel">
          {!editorPronto && (
            <pre className="papel-esqueleto" aria-hidden="true">
              {codigo}
            </pre>
          )}
          <EditorCodigo
            valor={codigo}
            onChange={alterarCodigo}
            onRodar={() => void executar('rodar')}
            onConferir={temTestes ? () => void executar('conferir') : undefined}
            linhaComErro={execucao?.dados.erro?.linha ?? null}
            rotulo={rotuloDoEditor}
            pautasMinimas={pautasMinimas}
            aoMontar={aoMontarOEditor}
          />
        </div>
      </div>
      {erroRascunho && (
        <p role="alert">
          {erroRascunho}{' '}
          <button
            type="button"
            className="botao botao-leve"
            onClick={() => void (rascunhoCarregado ? gravarRascunho() : carregarRascunho())}
          >
            Tentar novamente
          </button>
        </p>
      )}
      <p className="folha-teclado">
        Ctrl ou Cmd + Enter roda. Tab recua a linha; para sair do editor com o teclado, aperte Esc e depois Tab.
      </p>

      <div className="folha-resultado" aria-busy={executando}>
        <h3 className="folha-secao">Saída</h3>
        <Saida resultado={execucao?.dados ?? null} />
      </div>

      {conferido && conferido.testes.length > 0 && <Conferencia testes={conferido.testes}>{aoAcertar}</Conferencia>}
      {acertou && <SalvarProgresso />}

      {contextoTutor && (
        <Tutor
          ref={tutorRef}
          aoPraticar={aoPraticar}
          contexto={contextoTutor}
          codigo={codigo}
          diagnostico={
            execucao?.codigo === codigo
              ? JSON.stringify({
                  erro: execucao.dados.erro,
                  testes: execucao.dados.testes,
                  saida: execucao.dados.saida.slice(0, 5),
                }).slice(0, 3000)
              : 'O código atual ainda não foi executado. Peça ao aluno para usar Rodar ou Conferir se precisar de um diagnóstico.'
          }
        />
      )}

      {podeVerSolucao && (
        <div className="solucao">
          {mostrandoSolucao ? (
            <>
              <p className="solucao-titulo">Uma solução</p>
              <pre tabIndex={0}>{solucao}</pre>
              <p className="solucao-aviso">
                Leia linha por linha e tente explicar o que cada uma faz. Depois, escreva a sua de novo, sem olhar.
              </p>
            </>
          ) : (
            <>
              <p>Travou? Dá para olhar uma solução. O mais útil é tentar de novo antes.</p>
              <button type="button" className="botao botao-leve" onClick={() => setMostrandoSolucao(true)}>
                Ver uma solução
              </button>
            </>
          )}
        </div>
      )}

      {rodape?.({ codigo, identidade: rascunhoCarregado ? identidadeRascunho : undefined })}
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>
    </section>
  );
}
