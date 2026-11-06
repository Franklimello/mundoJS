'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiAward,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiDatabase,
  FiEye,
  FiEyeOff,
  FiHelpCircle,
  FiInfo,
  FiPlay,
  FiRotateCcw,
  FiTable,
  FiTarget,
  FiTerminal,
  FiTrash2,
} from 'react-icons/fi';
import {
  criarOuRestaurarBanco,
  executarSql,
  EXEMPLOS_SQL,
  type ExemploSql,
  obterBanco,
  obterEsquema,
  type ResultadoExecucaoSql,
  type TabelaInfo,
} from '@/sql/banco';
import { DESAFIOS_SQL, type DesafioSql, validarDesafio, type ResultadoValidacaoDesafio } from '@/sql/desafios';
import { EditorSql } from './EditorSql';

const ATALHOS_CLAVIS: string[] = [
  'SELECT',
  'FROM',
  'WHERE',
  'INNER JOIN',
  'LEFT JOIN',
  'GROUP BY',
  'HAVING',
  'ORDER BY',
  'LIMIT',
  'INSERT INTO',
  'UPDATE',
  'DELETE FROM',
];

const CATEGORIAS_EXEMPLOS = ['Todos', 'Básico', 'JOIN', 'Agrupamento', 'DML'] as const;
const CATEGORIAS_DESAFIOS = ['Todos', 'Básico', 'JOIN', 'Agrupamento', 'DML', 'Avançado'] as const;
const CHAVE_STORAGE_CONCLUIDOS = 'mundojs_sql_desafios_concluidos';

const PRIMEIRO_DESAFIO: DesafioSql = DESAFIOS_SQL[0] ?? {
  id: 'clientes-nordeste-ativos',
  titulo: 'Clientes ativos de PE e CE',
  categoria: 'Básico',
  dificuldade: 'Iniciante',
  enunciado: 'Selecione clientes de PE e CE.',
  tabelas: ['clientes'],
  sqlInicial: 'SELECT * FROM clientes;',
  dicas: [],
  solucao: 'SELECT * FROM clientes;',
  resultadoEsperadoDescricao: '',
};

export function PlaygroundSql() {
  const [modoAba, setModoAba] = useState<'desafios' | 'exemplos'>('desafios');
  const [desafioAtivoId, setDesafioAtivoId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('desafio');
      if (idParam && DESAFIOS_SQL.some((d) => d.id === idParam)) {
        return idParam;
      }
    }
    return PRIMEIRO_DESAFIO.id;
  });

  const [codigoSql, setCodigoSql] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('desafio');
      const encontrado = idParam ? DESAFIOS_SQL.find((d) => d.id === idParam) : null;
      if (encontrado) return encontrado.sqlInicial;
    }
    return PRIMEIRO_DESAFIO.sqlInicial;
  });

  const [desafiosConcluidos, setDesafiosConcluidos] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE_CONCLUIDOS);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignora erro em navegação anônima
    }
    return [];
  });

  const [mostrarSolucaoDesafio, setMostrarSolucaoDesafio] = useState(false);
  const [resultadoValidacao, setResultadoValidacao] = useState<ResultadoValidacaoDesafio | null>(null);
  const [validando, setValidando] = useState(false);
  const [categoriaDesafio, setCategoriaDesafio] = useState<(typeof CATEGORIAS_DESAFIOS)[number]>('Todos');

  const [resultado, setResultado] = useState<ResultadoExecucaoSql | null>(null);
  const [esquema, setEsquema] = useState<TabelaInfo[]>([]);
  const [tabelaExpandida, setTabelaExpandida] = useState<string | null>('clientes');
  const [categoriaExemploAtiva, setCategoriaExemploAtiva] = useState<(typeof CATEGORIAS_EXEMPLOS)[number]>('Todos');
  const [carregandoMotor, setCarregandoMotor] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  // Desafio ativo atual
  const indiceDesafio = useMemo(() => DESAFIOS_SQL.findIndex((d) => d.id === desafioAtivoId), [desafioAtivoId]);
  const desafioAtivo: DesafioSql = useMemo(
    () => DESAFIOS_SQL.find((d) => d.id === desafioAtivoId) ?? PRIMEIRO_DESAFIO,
    [desafioAtivoId],
  );
  const temDesafioAnterior = indiceDesafio > 0;
  const temDesafioProximo = indiceDesafio >= 0 && indiceDesafio < DESAFIOS_SQL.length - 1;

  // Mapeia colunas para autocompletar no editor CodeMirror
  const esquemaColunas = useMemo(() => {
    const mapa: Record<string, string[]> = {};
    for (const tab of esquema) {
      mapa[tab.nome] = tab.colunas.map((c) => c.name);
    }
    return mapa;
  }, [esquema]);

  const atualizarEsquema = useCallback(async () => {
    try {
      const novoEsquema = await obterEsquema();
      setEsquema(novoEsquema);
    } catch {
      // Ignora erro de leitura de esquema se o banco estiver em transição
    }
  }, []);

  const rodarConsulta = useCallback(
    async (sqlParaRodar?: string) => {
      const sqlTexto = (sqlParaRodar ?? codigoSql).trim();
      if (!sqlTexto) return;

      setExecutando(true);
      try {
        const res = await executarSql(sqlTexto);
        setResultado(res);
        // Atualiza esquema caso a consulta tenha feito INSERT/UPDATE/DELETE/CREATE/DROP
        await atualizarEsquema();
        return res;
      } finally {
        setExecutando(false);
      }
    },
    [codigoSql, atualizarEsquema],
  );

  // Inicializa o motor SQLite WebAssembly e roda a primeira consulta
  useEffect(() => {
    let ativo = true;

    async function inicializar() {
      try {
        await obterBanco();
        if (!ativo) return;
        const schema = await obterEsquema();
        if (!ativo) return;
        setEsquema(schema);
        const res = await executarSql(PRIMEIRO_DESAFIO.sqlInicial);
        if (!ativo) return;
        setResultado(res);
      } catch (err) {
        if (!ativo) return;
        setResultado({
          sucesso: false,
          tabelas: [],
          duracaoMs: 0,
          erro: err instanceof Error ? err.message : 'Falha ao inicializar motor SQLite.',
        });
      } finally {
        if (ativo) setCarregandoMotor(false);
      }
    }

    inicializar();

    return () => {
      ativo = false;
    };
  }, []);

  const restaurarBancoDados = async () => {
    setExecutando(true);
    try {
      await criarOuRestaurarBanco();
      await atualizarEsquema();
      const res = await executarSql(codigoSql);
      setResultado(res);
      setMensagemAviso('O banco de dados SQLite foi restaurado para o estado inicial!');
      setTimeout(() => setMensagemAviso(null), 4000);
    } finally {
      setExecutando(false);
    }
  };

  const selecionarDesafio = (desafio: DesafioSql) => {
    setDesafioAtivoId(desafio.id);
    setCodigoSql(desafio.sqlInicial);
    setMostrarSolucaoDesafio(false);
    setResultadoValidacao(null);
    rodarConsulta(desafio.sqlInicial);
  };

  const validarDesafioAtual = async () => {
    setValidando(true);
    try {
      // Executa no banco visual do usuário para ele ver a tabela retornada
      await rodarConsulta();

      // Executa validação isolada comparando com o gabarito
      const validacao = await validarDesafio(codigoSql, desafioAtivo);
      setResultadoValidacao(validacao);

      if (validacao.sucesso) {
        setDesafiosConcluidos((anteriores) => {
          if (anteriores.includes(desafioAtivo.id)) return anteriores;
          const atualizados = [...anteriores, desafioAtivo.id];
          try {
            localStorage.setItem(CHAVE_STORAGE_CONCLUIDOS, JSON.stringify(atualizados));
          } catch {
            // Ignora erro de storage
          }
          return atualizados;
        });
      }
    } finally {
      setValidando(false);
    }
  };

  const avancarProximoDesafio = () => {
    if (temDesafioProximo) {
      const prox = DESAFIOS_SQL[indiceDesafio + 1];
      if (prox) selecionarDesafio(prox);
    }
  };

  const voltarDesafioAnterior = () => {
    if (temDesafioAnterior) {
      const ant = DESAFIOS_SQL[indiceDesafio - 1];
      if (ant) selecionarDesafio(ant);
    }
  };

  const aplicarExemplo = (exemplo: ExemploSql) => {
    setCodigoSql(exemplo.sql);
    rodarConsulta(exemplo.sql);
  };

  const consultarTabela = (nomeTabela: string) => {
    const consulta = `SELECT * FROM ${nomeTabela} LIMIT 10;`;
    setCodigoSql(consulta);
    rodarConsulta(consulta);
  };

  const inserirAtalho = (palavra: string) => {
    setCodigoSql((prev) => {
      const espaco = prev.endsWith(' ') || prev.endsWith('\n') || prev === '' ? '' : ' ';
      return `${prev}${espaco}${palavra} `;
    });
  };

  const copiarConsulta = (sql: string, id: string) => {
    navigator.clipboard?.writeText(sql);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const desafiosFiltrados = useMemo(() => {
    if (categoriaDesafio === 'Todos') return DESAFIOS_SQL;
    return DESAFIOS_SQL.filter((d) => d.categoria === categoriaDesafio);
  }, [categoriaDesafio]);

  const exemplosFiltrados = useMemo(() => {
    if (categoriaExemploAtiva === 'Todos') return EXEMPLOS_SQL;
    return EXEMPLOS_SQL.filter((e) => e.categoria === categoriaExemploAtiva);
  }, [categoriaExemploAtiva]);

  const estaConcluido = desafiosConcluidos.includes(desafioAtivo.id);

  return (
    <div className="sql-playground">
      {mensagemAviso && (
        <div className="sql-toast-aviso" role="status">
          <FiCheckCircle size={18} aria-hidden="true" />
          <span>{mensagemAviso}</span>
        </div>
      )}

      {/* Barra de status e motor */}
      <div className="sql-status-topo">
        <div className="sql-motor-badge">
          <FiDatabase size={16} aria-hidden="true" />
          <span>SQLite 3 (WebAssembly em memória)</span>
        </div>
        <div className="sql-motor-info">
          {carregandoMotor ? (
            <span className="sql-tag-carregando">Carregando SQLite...</span>
          ) : executando || validando ? (
            <span className="sql-tag-executando">Executando consulta...</span>
          ) : resultado ? (
            resultado.sucesso ? (
              <span className="sql-tag-sucesso">
                <FiCheckCircle size={14} aria-hidden="true" />
                {resultado.tabelas.length > 0
                  ? `${resultado.tabelas.reduce((acc, t) => acc + t.linhas.length, 0)} linha(s) retornada(s) · ${resultado.duracaoMs} ms`
                  : `${resultado.linhasAfetadas ?? 0} linha(s) afetada(s) · ${resultado.duracaoMs} ms`}
              </span>
            ) : (
              <span className="sql-tag-erro">
                <FiAlertCircle size={14} aria-hidden="true" />
                Erro SQL · {resultado.duracaoMs} ms
              </span>
            )
          ) : null}
        </div>
      </div>

      {/* Alternador de Modo Principal: Desafios vs Exemplos */}
      <div className="sql-seletor-modo-topo" role="tablist" aria-label="Modo de prática do console SQL">
        <button
          type="button"
          role="tab"
          aria-selected={modoAba === 'desafios'}
          className={`sql-botao-modo ${modoAba === 'desafios' ? 'ativo' : ''}`}
          onClick={() => setModoAba('desafios')}
        >
          <FiAward size={18} aria-hidden="true" />
          <span>Desafios Práticos de SQL</span>
          <span className="sql-badge-progresso">
            {desafiosConcluidos.length}/{DESAFIOS_SQL.length} resolvidos
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={modoAba === 'exemplos'}
          className={`sql-botao-modo ${modoAba === 'exemplos' ? 'ativo' : ''}`}
          onClick={() => setModoAba('exemplos')}
        >
          <FiTable size={18} aria-hidden="true" />
          <span>Consultas de Exemplo</span>
          <span className="sql-badge-contador-exemplos">{EXEMPLOS_SQL.length} prontas</span>
        </button>
      </div>

      <div className="sql-layout-grid">
        {/* Coluna Principal: Desafios / Editor e Resultados */}
        <div className="sql-coluna-principal">
          {modoAba === 'desafios' && (
            <section className="sql-card-desafio-ativo" aria-labelledby="sql-desafio-titulo">
              {/* Topo do Desafio */}
              <div className="sql-desafio-topo">
                <div className="sql-desafio-tags">
                  <span className={`sql-badge-categoria sql-cat-${desafioAtivo.categoria.toLowerCase()}`}>
                    {desafioAtivo.categoria}
                  </span>
                  <span className={`sql-badge-dificuldade sql-dif-${desafioAtivo.dificuldade.toLowerCase()}`}>
                    {desafioAtivo.dificuldade}
                  </span>
                  {estaConcluido && (
                    <span className="sql-badge-concluido">
                      <FiCheck size={14} aria-hidden="true" /> Concluído
                    </span>
                  )}
                  <span className="sql-desafio-indice-contador">
                    Desafio {indiceDesafio + 1} de {DESAFIOS_SQL.length}
                  </span>
                </div>

                <div className="sql-desafio-navegacao">
                  <button
                    type="button"
                    className="sql-botao-nav-desafio"
                    onClick={voltarDesafioAnterior}
                    disabled={!temDesafioAnterior}
                    title="Desafio anterior"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    className="sql-botao-nav-desafio"
                    onClick={avancarProximoDesafio}
                    disabled={!temDesafioProximo}
                    title="Próximo desafio"
                  >
                    Próximo →
                  </button>
                </div>
              </div>

              {/* Título e Enunciado */}
              <h2 id="sql-desafio-titulo" className="sql-desafio-titulo">
                {desafioAtivo.titulo}
              </h2>
              <p className="sql-desafio-enunciado">{desafioAtivo.enunciado}</p>

              {/* Metadados: Tabelas e Expectativa */}
              <div className="sql-desafio-metadados">
                <div className="sql-desafio-meta-item">
                  <strong>Tabelas envolvidas:</strong>
                  <div className="sql-desafio-tabelas-chips">
                    {desafioAtivo.tabelas.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className="sql-chip-tabela"
                        onClick={() => setTabelaExpandida(t)}
                        title={`Ver colunas da tabela ${t}`}
                      >
                        <code>{t}</code>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sql-desafio-meta-item">
                  <strong>Meta esperada:</strong>
                  <span>{desafioAtivo.resultadoEsperadoDescricao}</span>
                </div>
              </div>

              {/* Dicas sanfonadas */}
              {desafioAtivo.dicas.length > 0 && (
                <details className="sql-desafio-dicas-sanfona">
                  <summary>
                    <FiHelpCircle size={15} aria-hidden="true" />
                    <span>Precisa de ajuda? Veja as dicas de resolução ({desafioAtivo.dicas.length})</span>
                  </summary>
                  <ol className="sql-desafio-lista-dicas">
                    {desafioAtivo.dicas.map((dica, i) => (
                      <li key={i}>{dica}</li>
                    ))}
                  </ol>
                </details>
              )}

              {/* Ações do Desafio: Carregar Inicial e Revelar Solução */}
              <div className="sql-desafio-acoes-apoio">
                <button
                  type="button"
                  className="sql-botao-link-desafio"
                  onClick={() => {
                    setCodigoSql(desafioAtivo.sqlInicial);
                    setResultadoValidacao(null);
                  }}
                >
                  <FiRotateCcw size={14} aria-hidden="true" />
                  <span>Restaurar modelo inicial deste desafio</span>
                </button>

                <button
                  type="button"
                  className="sql-botao-link-desafio"
                  onClick={() => setMostrarSolucaoDesafio((prev) => !prev)}
                >
                  {mostrarSolucaoDesafio ? (
                    <>
                      <FiEyeOff size={14} aria-hidden="true" />
                      <span>Ocultar gabarito</span>
                    </>
                  ) : (
                    <>
                      <FiEye size={14} aria-hidden="true" />
                      <span>Ver gabarito da solução</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bloco de Solução Revelada */}
              {mostrarSolucaoDesafio && (
                <div className="sql-desafio-caixa-solucao">
                  <div className="sql-solucao-cabecalho">
                    <strong>Gabarito de referência:</strong>
                    <button
                      type="button"
                      className="sql-botao-copiar"
                      onClick={() => {
                        setCodigoSql(desafioAtivo.solucao);
                        rodarConsulta(desafioAtivo.solucao);
                      }}
                    >
                      Copiar para o editor
                    </button>
                  </div>
                  <pre className="sql-solucao-codigo">
                    <code>{desafioAtivo.solucao}</code>
                  </pre>
                </div>
              )}
            </section>
          )}

          {/* Painel do Editor */}
          <div className="sql-card-editor">
            <div className="sql-editor-cabecalho">
              <div className="sql-editor-titulo">
                <FiTerminal size={17} aria-hidden="true" />
                <span>Consulta SQL {modoAba === 'desafios' ? '· Sua Resolução' : ''}</span>
              </div>
              <div className="sql-editor-atalho-dica">
                Atalho: <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              </div>
            </div>

            {/* Barra de atalhos rápidos de SQL */}
            <div className="sql-barra-atalhos" aria-label="Atalhos rápidos de comandos SQL">
              {ATALHOS_CLAVIS.map((palavra) => (
                <button
                  key={palavra}
                  type="button"
                  className="sql-botao-atalho"
                  onClick={() => inserirAtalho(palavra)}
                  title={`Inserir ${palavra}`}
                >
                  {palavra}
                </button>
              ))}
            </div>

            <div className="sql-editor-corpo">
              <EditorSql
                valor={codigoSql}
                onChange={(novo) => {
                  setCodigoSql(novo);
                  if (resultadoValidacao) setResultadoValidacao(null);
                }}
                onExecutar={() => (modoAba === 'desafios' ? validarDesafioAtual() : rodarConsulta())}
                esquemaColunas={esquemaColunas}
                rotulo="Editor de código SQL interativo"
              />
            </div>

            {/* Ações do Editor */}
            <div className="sql-editor-acoes">
              {modoAba === 'desafios' ? (
                <>
                  <button
                    type="button"
                    className="botao botao-primario sql-botao-validar-desafio"
                    onClick={validarDesafioAtual}
                    disabled={validando || executando || carregandoMotor || !codigoSql.trim()}
                  >
                    <FiAward size={18} aria-hidden="true" />
                    <span>{validando ? 'Validando resolução...' : 'Validar Desafio'}</span>
                  </button>

                  <button
                    type="button"
                    className="botao botao-secundario"
                    onClick={() => rodarConsulta()}
                    disabled={executando || carregandoMotor || !codigoSql.trim()}
                    title="Apenas executa a consulta no banco atual sem validar o gabarito"
                  >
                    <FiPlay size={15} aria-hidden="true" />
                    <span>Testar consulta</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="botao botao-primario sql-botao-executar"
                  onClick={() => rodarConsulta()}
                  disabled={executando || carregandoMotor}
                >
                  <FiPlay size={16} aria-hidden="true" />
                  <span>{executando ? 'Executando...' : 'Executar consulta'}</span>
                </button>
              )}

              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => {
                  setCodigoSql('');
                  setResultadoValidacao(null);
                }}
                disabled={executando || !codigoSql}
                title="Limpar texto do editor"
              >
                <FiTrash2 size={16} aria-hidden="true" />
                <span>Limpar</span>
              </button>

              <button
                type="button"
                className="botao botao-secundario sql-botao-restaurar"
                onClick={restaurarBancoDados}
                disabled={executando}
                title="Restaura todas as 6 tabelas para o estado original padrão"
              >
                <FiRotateCcw size={16} aria-hidden="true" />
                <span>Restaurar banco original</span>
              </button>
            </div>
          </div>

          {/* Banner de Resultado da Validação do Desafio */}
          {resultadoValidacao && (
            <div className={`sql-banner-validacao ${resultadoValidacao.sucesso ? 'sucesso' : 'falha'}`} role="alert">
              <div className="sql-validacao-icone">
                {resultadoValidacao.sucesso ? (
                  <FiCheckCircle size={26} aria-hidden="true" />
                ) : (
                  <FiAlertCircle size={26} aria-hidden="true" />
                )}
              </div>
              <div className="sql-validacao-corpo">
                <h3>{resultadoValidacao.sucesso ? 'Desafio Concluído com Sucesso! 🎉' : 'Ainda precisa de ajustes'}</h3>
                <p className="sql-validacao-mensagem">{resultadoValidacao.mensagem}</p>
                {resultadoValidacao.detalhe && <p className="sql-validacao-detalhe">{resultadoValidacao.detalhe}</p>}

                {resultadoValidacao.sucesso && temDesafioProximo && (
                  <button
                    type="button"
                    className="botao botao-primario sql-botao-proximo-desafio"
                    onClick={avancarProximoDesafio}
                  >
                    Avançar para o próximo desafio →
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Painel de Resultados */}
          <div className="sql-card-resultados" aria-live="polite">
            <div className="sql-resultados-cabecalho">
              <div className="sql-resultados-titulo">
                <FiTable size={17} aria-hidden="true" />
                <span>Resultado da Execução no SQLite</span>
              </div>
              {resultado && (
                <span className="sql-duracao-tempo">
                  Tempo: <strong>{resultado.duracaoMs} ms</strong>
                </span>
              )}
            </div>

            <div className="sql-resultados-corpo">
              {carregandoMotor ? (
                <div className="sql-estado-vazio">
                  <div className="sql-carregador-pulso" />
                  <p>Inicializando motor SQLite via WebAssembly...</p>
                </div>
              ) : !resultado ? (
                <div className="sql-estado-vazio">
                  <p>Digite uma consulta SQL acima e clique em Validar Desafio ou Executar.</p>
                </div>
              ) : !resultado.sucesso ? (
                <div className="sql-caixa-erro">
                  <div className="sql-erro-cabecalho">
                    <FiAlertCircle size={20} aria-hidden="true" />
                    <strong>Erro na execução do comando SQL:</strong>
                  </div>
                  <pre className="sql-erro-mensagem">{resultado.erro}</pre>
                  <p className="sql-erro-dica">
                    Verifique se o nome das tabelas e colunas estão corretos de acordo com o painel lateral de esquema.
                  </p>
                </div>
              ) : resultado.tabelas.length === 0 ? (
                <div className="sql-caixa-mensagem-dml">
                  <FiCheckCircle size={22} className="sql-icone-sucesso-dml" aria-hidden="true" />
                  <div>
                    <p className="sql-mensagem-dml-texto">{resultado.mensagem || 'Comando executado com sucesso.'}</p>
                    <p className="sql-mensagem-dml-subtexto">
                      Nenhuma linha foi retornada. Para conferir o efeito, execute um comando <code>SELECT</code> na
                      tabela alterada.
                    </p>
                  </div>
                </div>
              ) : (
                resultado.tabelas.map((tabela, idx) => (
                  <div key={idx} className="sql-tabela-resultado-bloco">
                    {resultado.tabelas.length > 1 && (
                      <p className="sql-tabela-resultado-contador">Resultado #{idx + 1}</p>
                    )}
                    {tabela.linhas.length === 0 ? (
                      <div className="sql-estado-vazio">
                        <p>A consulta executou com sucesso, mas retornou 0 registros.</p>
                      </div>
                    ) : (
                      <div className="sql-tabela-envoltoria">
                        <table className="sql-tabela-dados">
                          <thead>
                            <tr>
                              <th className="sql-th-linha-num">#</th>
                              {tabela.colunas.map((coluna) => (
                                <th key={coluna}>{coluna}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tabela.linhas.map((linha, indexLinha) => (
                              <tr key={indexLinha}>
                                <td className="sql-td-linha-num">{indexLinha + 1}</td>
                                {linha.map((valor, indexColuna) => (
                                  <td key={indexColuna}>
                                    {valor === null ? (
                                      <span className="sql-valor-nulo">NULL</span>
                                    ) : typeof valor === 'number' ? (
                                      <span className="sql-valor-numero">{valor}</span>
                                    ) : (
                                      String(valor)
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="sql-tabela-rodape">
                      <span>{tabela.linhas.length} registro(s) exibido(s)</span>
                      <span>{tabela.colunas.length} coluna(s)</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Grade de Seleção de Desafios ou Seção de Exemplos */}
          {modoAba === 'desafios' ? (
            <div className="sql-secao-catalogo-desafios">
              <div className="sql-exemplos-cabecalho">
                <div>
                  <h2>Catálogo de Desafios de SQL</h2>
                  <p>Escolha qualquer desafio para resolver no editor e validar em tempo real contra o SQLite.</p>
                </div>

                {/* Filtro por categoria */}
                <div className="sql-filtros-categoria" role="tablist" aria-label="Categorias de desafios">
                  {CATEGORIAS_DESAFIOS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={categoriaDesafio === cat}
                      className={`sql-filtro-botao ${categoriaDesafio === cat ? 'ativo' : ''}`}
                      onClick={() => setCategoriaDesafio(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sql-grade-desafios">
                {desafiosFiltrados.map((desafio) => {
                  const ativo = desafio.id === desafioAtivo.id;
                  const resolvido = desafiosConcluidos.includes(desafio.id);
                  return (
                    <div
                      key={desafio.id}
                      className={`sql-cartao-desafio-catalogo ${ativo ? 'ativo' : ''} ${resolvido ? 'resolvido' : ''}`}
                    >
                      <div className="sql-cartao-exemplo-topo">
                        <div className="sql-tags-agrupadas">
                          <span className={`sql-badge-categoria sql-cat-${desafio.categoria.toLowerCase()}`}>
                            {desafio.categoria}
                          </span>
                          <span className={`sql-badge-dificuldade sql-dif-${desafio.dificuldade.toLowerCase()}`}>
                            {desafio.dificuldade}
                          </span>
                        </div>
                        {resolvido && (
                          <span className="sql-badge-resolvido-mini" title="Desafio concluído!">
                            <FiCheck size={14} /> Resolvido
                          </span>
                        )}
                      </div>
                      <h3>{desafio.titulo}</h3>
                      <p>{desafio.enunciado}</p>
                      <div className="sql-cartao-desafio-rodape">
                        <span className="sql-desafio-tabelas-resumo">
                          Tabelas: <code>{desafio.tabelas.join(', ')}</code>
                        </span>
                        <button
                          type="button"
                          className="botao botao-secundario sql-botao-carregar-exemplo"
                          onClick={() => {
                            selecionarDesafio(desafio);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                        >
                          <FiTarget size={14} aria-hidden="true" />
                          <span>{ativo ? 'Em andamento' : 'Resolver este'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Exemplos Prontos de Consultas */
            <div className="sql-secao-exemplos">
              <div className="sql-exemplos-cabecalho">
                <div>
                  <h2>Consultas Prontas de Exemplo</h2>
                  <p>Clique em qualquer consulta para carregá-la no editor e rodar instantaneamente.</p>
                </div>

                {/* Filtro por categoria */}
                <div className="sql-filtros-categoria" role="tablist" aria-label="Categorias de exemplos">
                  {CATEGORIAS_EXEMPLOS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={categoriaExemploAtiva === cat}
                      className={`sql-filtro-botao ${categoriaExemploAtiva === cat ? 'ativo' : ''}`}
                      onClick={() => setCategoriaExemploAtiva(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sql-grade-exemplos">
                {exemplosFiltrados.map((ex) => (
                  <div key={ex.id} className="sql-cartao-exemplo">
                    <div className="sql-cartao-exemplo-topo">
                      <span className={`sql-badge-categoria sql-cat-${ex.categoria.toLowerCase()}`}>
                        {ex.categoria}
                      </span>
                      <button
                        type="button"
                        className="sql-botao-copiar"
                        onClick={() => copiarConsulta(ex.sql, ex.id)}
                        title="Copiar código SQL"
                      >
                        {copiadoId === ex.id ? <FiCheck size={14} /> : 'Copiar'}
                      </button>
                    </div>
                    <h3>{ex.titulo}</h3>
                    <p>{ex.descricao}</p>
                    <pre className="sql-exemplo-snippet">
                      <code>{ex.sql}</code>
                    </pre>
                    <button
                      type="button"
                      className="botao botao-secundario sql-botao-carregar-exemplo"
                      onClick={() => aplicarExemplo(ex)}
                    >
                      <FiPlay size={14} aria-hidden="true" />
                      <span>Carregar e rodar</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Coluna Lateral: Esquema do Banco */}
        <aside className="sql-coluna-lateral" aria-label="Esquema das tabelas">
          <div className="sql-card-esquema">
            <div className="sql-esquema-cabecalho">
              <div className="sql-esquema-titulo">
                <FiDatabase size={18} aria-hidden="true" />
                <div>
                  <strong>Tabelas do Banco</strong>
                  <span className="sql-esquema-sub">{esquema.length} tabelas no SQLite</span>
                </div>
              </div>
            </div>

            <p className="sql-esquema-intro">
              Clique em uma tabela para ver as colunas ou consultar os 10 primeiros registros.
            </p>

            <div className="sql-lista-tabelas">
              {esquema.map((tabela) => {
                const aberta = tabelaExpandida === tabela.nome;
                return (
                  <div key={tabela.nome} className={`sql-item-tabela ${aberta ? 'aberta' : ''}`}>
                    <div className="sql-item-tabela-topo">
                      <button
                        type="button"
                        className="sql-botao-toggle-tabela"
                        onClick={() => setTabelaExpandida(aberta ? null : tabela.nome)}
                        aria-expanded={aberta}
                      >
                        {aberta ? (
                          <FiChevronDown size={16} aria-hidden="true" />
                        ) : (
                          <FiChevronRight size={16} aria-hidden="true" />
                        )}
                        <span className="sql-nome-tabela">{tabela.nome}</span>
                        <span className="sql-contagem-linhas">{tabela.totalLinhas} linhas</span>
                      </button>

                      <button
                        type="button"
                        className="sql-botao-consultar-rapido"
                        onClick={() => consultarTabela(tabela.nome)}
                        title={`Consultar tabela ${tabela.nome}`}
                      >
                        SELECT
                      </button>
                    </div>

                    {aberta && (
                      <div className="sql-tabela-colunas-detalhe">
                        <ul className="sql-lista-colunas">
                          {tabela.colunas.map((col) => (
                            <li key={col.cid} className="sql-item-coluna">
                              <span className="sql-coluna-nome">
                                {col.name}
                                {col.pk === 1 && <span className="sql-tag-pk">PK</span>}
                              </span>
                              <span className="sql-coluna-tipo">{col.type}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sql-card-dica-didatica">
              <div className="sql-dica-titulo">
                <FiInfo size={16} aria-hidden="true" />
                <span>Sobre este ambiente</span>
              </div>
              <p>
                O banco roda 100% no seu navegador via <strong>WebAssembly</strong>. Você pode fazer alterações à
                vontade com <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> e até{' '}
                <code>CREATE TABLE</code>.
              </p>
              <p>
                Para voltar aos dados originais, basta clicar no botão <strong>Restaurar banco original</strong>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
