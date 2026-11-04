'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, type Ref, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type { DocumentoWeb } from '@/engine/documento';
import { guardarDocumento, lerDocumento } from '@/progresso/documento';
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
import { useModoFoco } from '@/editor/usar-modo-foco';
import type { ControlesEditor } from '@/editor/controles';

// O editor é pesado e só roda no navegador: carrega à parte, depois da página.
const EditorCodigo = dynamic(() => import('./EditorCodigo'), { ssr: false });

const SEM_TESTES: TesteDefinicao[] = [];
/** Quantas conferências erradas até oferecer uma solução. */
const FALHAS_ATE_OFERECER_SOLUCAO = 3;

function CampoWeb({
  arquivo,
  valor,
  onChange,
  onRodar,
}: {
  arquivo: 'html' | 'css';
  valor: string;
  onChange: (arquivo: 'html' | 'css', valor: string) => void;
  onRodar: () => void;
}) {
  return (
    <textarea
      className="web-editor"
      aria-label={`Editor de ${arquivo.toUpperCase()}`}
      value={valor}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      autoComplete="off"
      onChange={(evento) => onChange(arquivo, evento.target.value)}
      onKeyDown={(evento) => {
        if (evento.key === 'Enter' && (evento.ctrlKey || evento.metaKey)) {
          evento.preventDefault();
          onRodar();
        }
      }}
    />
  );
}

export interface FolhaProps {
  controleRef?: Ref<{ salvarAntesDeSair: () => Promise<boolean> }>;
  dadosExemplo?: { texto: string; arquivo: 'javascript' | 'html' };
  enunciado?: ReactNode;
  /** O nome da folha no alto, como "Seu código". */
  titulo: string;
  /** Descrição do campo, para leitores de tela. */
  rotuloDoEditor: string;
  codigoInicial: string;
  documentoInicial?: DocumentoWeb;
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

type Execucao = { modo: 'rodar' | 'conferir'; dados: ResultadoExecucao; codigo: string; documento?: DocumentoWeb };

/**
 * A folha pautada: editor, saída e conferência.
 *
 * Rodar mostra só o que o código imprime. Conferir roda os testes da lição e
 * corrige, teste por teste.
 */
export function Folha({
  controleRef,
  dadosExemplo,
  enunciado,
  titulo,
  rotuloDoEditor,
  codigoInicial,
  documentoInicial,
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
  const [foco, setFoco] = useState(false);
  const [painel, setPainel] = useState<'codigo' | 'enunciado' | 'resultado'>('codigo');
  const raiz = useRef<HTMLElement>(null);
  const resultado = useRef<HTMLDivElement>(null);
  const controleEditor = useRef<ControlesEditor>(null);
  const linhaParaFocar = useRef<number | null>(null);
  const voltarAoEditor = useRef(false);
  const fecharFoco = useCallback(() => setFoco(false), []);
  useModoFoco(raiz, foco, fecharFoco);
  const [documento, setDocumento] = useState(documentoInicial);
  const [aba, setAba] = useState<'javascript' | 'html' | 'css'>('javascript');
  const idEditor = useId();
  const previa = useRef<HTMLDivElement>(null);
  const documentoAtual = useRef(documentoInicial);
  const [execucao, setExecucao] = useState<Execucao | null>(null);
  const [executando, setExecutando] = useState(false);
  const [falhas, setFalhas] = useState(0);
  const [mostrandoSolucao, setMostrandoSolucao] = useState(false);
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [editorPronto, setEditorPronto] = useState(false);
  const [rascunhoCarregado, setRascunhoCarregado] = useState(false);
  const [identidadeRascunho, setIdentidadeRascunho] = useState<string>();
  const [erroRascunho, setErroRascunho] = useState<string | null>(null);
  const [estadoRascunho, setEstadoRascunho] = useState<
    'carregando' | 'pronto' | 'pendente' | 'salvando' | 'salvo' | 'erro'
  >('carregando');
  const gravacaoAtual = useRef(0);

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
        const documentoExecutado = documentoAtual.current;
        const dados = await rodarNoNavegador(
          codigoExecutado,
          modo === 'conferir' ? testes : SEM_TESTES,
          documentoExecutado && previa.current ? { documento: documentoExecutado, alvo: previa.current } : undefined,
        );
        setExecucao({ modo, dados, codigo: codigoExecutado, documento: documentoExecutado });
        if (!rodarAoDigitar && window.matchMedia('(max-width: 62rem), (pointer: coarse)').matches) {
          setPainel('resultado');
        }
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
    [testes, contextoTutor, rodarAoDigitar],
  );

  useEffect(() => {
    if (painel === 'resultado') {
      resultado.current?.focus({ preventScroll: true });
      if (!foco) resultado.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else if (painel === 'codigo' && voltarAoEditor.current) {
      voltarAoEditor.current = false;
      if (aba === 'javascript') controleEditor.current?.focar();
      else document.getElementById(`${idEditor}-painel-${aba}`)?.querySelector('textarea')?.focus();
      if (linhaParaFocar.current !== null) {
        controleEditor.current?.irParaLinha(linhaParaFocar.current);
        linhaParaFocar.current = null;
      }
    }
  }, [painel, execucao, foco, aba, idEditor]);

  function mostrarCodigo() {
    voltarAoEditor.current = true;
    setPainel('codigo');
  }

  // O editor só existe no navegador: quando ele monta, volta o que o aluno estava escrevendo.
  const carregarRascunho = useCallback(async () => {
    if (!chaveRascunho) return;
    try {
      const salvo = await lerRascunho(chaveRascunho);
      donoDoRascunho.current = salvo.identidade;
      setIdentidadeRascunho(salvo.identidade);
      if (!editado.current && salvo.codigo !== null) {
        const web = documentoInicial ? lerDocumento(salvo.codigo) : null;
        codigoAtual.current = web?.javascript ?? salvo.codigo;
        setCodigo(codigoAtual.current);
        if (web) {
          documentoAtual.current = web.documento;
          setDocumento(web.documento);
        }
      }
      setRascunhoCarregado(true);
      setErroRascunho(null);
      setEstadoRascunho(pendenteDeSalvar.current ? 'pendente' : salvo.codigo === null ? 'pronto' : 'salvo');
      return true;
    } catch {
      setErroRascunho('Não foi possível carregar seu rascunho.');
      setEstadoRascunho('erro');
      return false;
    }
  }, [chaveRascunho, documentoInicial]);

  const aoMontarOEditor = useCallback(() => {
    setEditorPronto(true);
    void carregarRascunho();
  }, [carregarRascunho]);

  const gravarRascunho = useCallback(async () => {
    if (!chaveRascunho) return true;
    const tentativa = ++gravacaoAtual.current;
    setEstadoRascunho('salvando');
    const valor = documentoAtual.current
      ? guardarDocumento(codigoAtual.current, documentoAtual.current)
      : codigoAtual.current;
    const inicial = documentoInicial ? guardarDocumento(codigoInicial, documentoInicial) : codigoInicial;
    try {
      if (valor === inicial) await apagarRascunho(chaveRascunho, donoDoRascunho.current);
      else await salvarRascunho(chaveRascunho, valor, donoDoRascunho.current);
      const atual = documentoAtual.current
        ? guardarDocumento(codigoAtual.current, documentoAtual.current)
        : codigoAtual.current;
      if (tentativa === gravacaoAtual.current) {
        if (atual === valor) pendenteDeSalvar.current = false;
        setEstadoRascunho(atual === valor ? 'salvo' : 'pendente');
        setErroRascunho(null);
      }
      return true;
    } catch {
      if (tentativa === gravacaoAtual.current) {
        setErroRascunho(
          navigator.onLine
            ? 'Não foi possível salvar seu rascunho. Tente novamente antes de sair.'
            : 'Você está sem conexão. Seu código ainda não foi salvo; mantenha esta página aberta e tente novamente ao reconectar.',
        );
        setEstadoRascunho('erro');
      }
      return false;
    }
  }, [chaveRascunho, codigoInicial, documentoInicial]);

  useImperativeHandle(
    controleRef,
    () => ({
      salvarAntesDeSair: async () => {
        if (!pendenteDeSalvar.current) return true;
        if (!rascunhoCarregado && !(await carregarRascunho())) return false;
        while (pendenteDeSalvar.current) {
          if (!(await gravarRascunho())) return false;
        }
        return true;
      },
    }),
    [rascunhoCarregado, carregarRascunho, gravarRascunho],
  );

  function alterarCodigo(valor: string) {
    editado.current = true;
    pendenteDeSalvar.current = true;
    setEstadoRascunho('pendente');
    codigoAtual.current = valor;
    setCodigo(valor);
  }

  const alterarDocumento = useCallback(
    (campo: 'html' | 'css', valor: string) => {
      if (!documento) return;
      editado.current = true;
      pendenteDeSalvar.current = true;
      setEstadoRascunho('pendente');
      const proximo = { ...documento, [campo]: valor };
      documentoAtual.current = proximo;
      setDocumento(proximo);
    },
    [documento],
  );

  // Guarda o rascunho um instante depois da última tecla.
  useEffect(() => {
    if (!chaveRascunho || !rascunhoCarregado || !pendenteDeSalvar.current) return;
    const espera = setTimeout(() => {
      void gravarRascunho();
    }, 400);
    return () => clearTimeout(espera);
  }, [codigo, documento, chaveRascunho, rascunhoCarregado, gravarRascunho]);

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
    documentoAtual.current = documentoInicial;
    setDocumento(documentoInicial);
    previa.current?.replaceChildren();
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
  const mudou =
    codigo !== codigoInicial || documento?.html !== documentoInicial?.html || documento?.css !== documentoInicial?.css;
  const podeVerSolucao = Boolean(solucao) && falhas >= FALHAS_ATE_OFERECER_SOLUCAO && !acertou;

  function inserirDados() {
    if (!dadosExemplo) return;
    mostrarCodigo();
    setAba(dadosExemplo.arquivo);
    if (dadosExemplo.arquivo === 'javascript') controleEditor.current?.inserirDados(dadosExemplo.texto);
    else if (documento && !documento.html.includes(dadosExemplo.texto.trim()))
      alterarDocumento('html', dadosExemplo.texto.trim() + '\n' + documento.html);
  }

  const legendaRascunho = {
    carregando: 'Carregando rascunho…',
    pronto: 'Pronto para editar',
    pendente: 'Alterações não salvas',
    salvando: 'Salvando…',
    salvo: 'Salvo',
    erro: 'Não salvo · tente novamente',
  }[estadoRascunho];

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
    <section
      ref={raiz}
      className={`folha${foco ? ' folha-foco' : ''}`}
      data-painel={painel}
      aria-label={foco ? `${titulo} · modo foco` : titulo}
      role={foco ? 'dialog' : undefined}
      aria-modal={foco ? true : undefined}
    >
      <div className="folha-mobile">
        <div className="folha-mobile-paineis" role="group" aria-label="Área de prática">
          <button type="button" aria-pressed={painel === 'codigo'} onClick={mostrarCodigo}>
            Código
          </button>
          {enunciado && (
            <button type="button" aria-pressed={painel === 'enunciado'} onClick={() => setPainel('enunciado')}>
              Enunciado
            </button>
          )}
          <button type="button" aria-pressed={painel === 'resultado'} onClick={() => setPainel('resultado')}>
            Resultado
          </button>
        </div>
        <button
          type="button"
          className="folha-foco-sair"
          aria-pressed={foco}
          aria-label={foco ? 'Sair do modo foco' : 'Ativar modo foco'}
          onClick={() => setFoco(!foco)}
        >
          {foco ? 'Sair' : 'Modo foco'}
        </button>
      </div>
      {enunciado && (
        <div className="folha-enunciado-mobile" tabIndex={-1}>
          {enunciado}
        </div>
      )}
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

        {(chaveRascunho || dadosExemplo) && (
          <div className="folha-ferramentas">
            {chaveRascunho && (
              <p className="folha-salvamento" role="status" data-estado={estadoRascunho}>
                {legendaRascunho}
              </p>
            )}
            {dadosExemplo && (
              <button
                type="button"
                className="botao botao-leve"
                onClick={inserirDados}
                disabled={
                  !editorPronto ||
                  (dadosExemplo.arquivo === 'javascript' ? codigo : (documento?.html ?? '')).includes(
                    dadosExemplo.texto.trim(),
                  )
                }
              >
                Inserir dados do desafio
              </button>
            )}
          </div>
        )}

        {documento && (
          <div className="web-abas" role="tablist" aria-label="Arquivos da página">
            {(['html', 'css', 'javascript'] as const).map((arquivo, indice, arquivos) => (
              <button
                key={arquivo}
                id={`${idEditor}-aba-${arquivo}`}
                type="button"
                role="tab"
                aria-selected={aba === arquivo}
                aria-controls={`${idEditor}-painel-${arquivo}`}
                tabIndex={aba === arquivo ? 0 : -1}
                onClick={() => setAba(arquivo)}
                onKeyDown={(evento) => {
                  const destino =
                    evento.key === 'ArrowRight'
                      ? (indice + 1) % 3
                      : evento.key === 'ArrowLeft'
                        ? (indice + 2) % 3
                        : evento.key === 'Home'
                          ? 0
                          : evento.key === 'End'
                            ? 2
                            : null;
                  if (destino === null) return;
                  evento.preventDefault();
                  const proxima = arquivos[destino]!;
                  setAba(proxima);
                  document.getElementById(`${idEditor}-aba-${proxima}`)?.focus();
                }}
              >
                {arquivo === 'javascript' ? 'JavaScript' : arquivo.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        {documento &&
          (['html', 'css'] as const).map((arquivo) => (
            <div
              key={arquivo}
              id={`${idEditor}-painel-${arquivo}`}
              role="tabpanel"
              aria-labelledby={`${idEditor}-aba-${arquivo}`}
              hidden={aba !== arquivo}
            >
              <CampoWeb
                arquivo={arquivo}
                valor={documento[arquivo]}
                onChange={alterarDocumento}
                onRodar={() => void executar('rodar')}
              />
            </div>
          ))}
        <div
          className="papel"
          id={documento ? `${idEditor}-painel-javascript` : undefined}
          role={documento ? 'tabpanel' : undefined}
          aria-labelledby={documento ? `${idEditor}-aba-javascript` : undefined}
          hidden={Boolean(documento && aba !== 'javascript')}
        >
          {!editorPronto && (
            <pre className="papel-esqueleto" aria-hidden="true">
              {codigo}
            </pre>
          )}
          <EditorCodigo
            controleRef={controleEditor}
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
        Ctrl ou Cmd + Enter roda. {documento ? 'Na aba JavaScript, Tab recua a linha; ' : 'Tab recua a linha; '}para
        sair do editor com o teclado, aperte Esc e depois Tab.
      </p>

      <div className="folha-retorno-mobile" ref={resultado} tabIndex={-1} aria-label="Resultado da execução">
        {execucao && (execucao.codigo !== codigo || execucao.documento !== documento) && (
          <p className="folha-resultado-antigo">
            Este resultado é da execução anterior. O código mudou; use Rodar ou Conferir para atualizar.
          </p>
        )}
        <div className="folha-mobile-resumo">
          <p role="status">{status || 'Execute seu código para ver o resultado.'}</p>
          <button type="button" className="botao" onClick={mostrarCodigo}>
            Voltar ao código
          </button>
        </div>
        <div className="folha-resultado" aria-busy={executando}>
          {documento && (
            <section className="web-previa" aria-label="Prévia visual">
              <h3 className="folha-secao">Prévia visual</h3>
              <p>
                Use Rodar para atualizar. Depois, interaja com a página abaixo. Conferir recria a página e testa seu
                código.
              </p>
              <div className="web-previa-alvo" ref={previa} />
              {!execucao && <p>A prévia aparece quando você usar Rodar.</p>}
            </section>
          )}
          <h3 className="folha-secao">Saída</h3>
          <Saida
            resultado={execucao?.dados ?? null}
            aoIrParaLinha={
              execucao?.codigo === codigo
                ? (linha) => {
                    linhaParaFocar.current = linha;
                    setAba('javascript');
                    mostrarCodigo();
                    if (painel === 'codigo') {
                      controleEditor.current?.irParaLinha(linha);
                      linhaParaFocar.current = null;
                    }
                  }
                : undefined
            }
          />
        </div>

        {conferido && conferido.testes.length > 0 && <Conferencia testes={conferido.testes}>{aoAcertar}</Conferencia>}
        {acertou && <SalvarProgresso />}
      </div>

      {contextoTutor && (
        <Tutor
          ref={tutorRef}
          aoPraticar={aoPraticar}
          contexto={contextoTutor}
          codigo={documento ? `HTML:\n${documento.html}\n\nCSS:\n${documento.css}\n\nJavaScript:\n${codigo}` : codigo}
          diagnostico={
            execucao?.codigo === codigo && execucao.documento === documento
              ? JSON.stringify({
                  erro: execucao.dados.erro,
                  testes: execucao.dados.testes,
                  saida: execucao.dados.saida.slice(0, 5),
                  investigacoes: execucao.dados.investigacoes?.slice(0, 1).map((item) => ({
                    ...item,
                    itens: item.itens.slice(0, 3),
                  })),
                  investigacoesObjetos: execucao.dados.investigacoesObjetos?.slice(0, 1).map((item) => ({
                    ...item,
                    propriedades: item.propriedades.slice(0, 3),
                  })),
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
