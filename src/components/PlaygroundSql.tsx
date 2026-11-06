'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiDatabase,
  FiInfo,
  FiPlay,
  FiRotateCcw,
  FiTable,
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

const SQL_INICIAL = EXEMPLOS_SQL[0]?.sql ?? 'SELECT 1;';

export function PlaygroundSql() {
  const [codigoSql, setCodigoSql] = useState<string>(SQL_INICIAL);
  const [resultado, setResultado] = useState<ResultadoExecucaoSql | null>(null);
  const [esquema, setEsquema] = useState<TabelaInfo[]>([]);
  const [tabelaExpandida, setTabelaExpandida] = useState<string | null>('clientes');
  const [categoriaAtiva, setCategoriaAtiva] = useState<(typeof CATEGORIAS_EXEMPLOS)[number]>('Todos');
  const [carregandoMotor, setCarregandoMotor] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [mensagemAviso, setMensagemAviso] = useState<string | null>(null);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

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
        const res = await executarSql(SQL_INICIAL);
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

  const exemplosFiltrados = useMemo(() => {
    if (categoriaAtiva === 'Todos') return EXEMPLOS_SQL;
    return EXEMPLOS_SQL.filter((e) => e.categoria === categoriaAtiva);
  }, [categoriaAtiva]);

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
          ) : executando ? (
            <span className="sql-tag-executando">Executando...</span>
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

      <div className="sql-layout-grid">
        {/* Coluna Principal: Editor e Resultados */}
        <div className="sql-coluna-principal">
          {/* Painel do Editor */}
          <div className="sql-card-editor">
            <div className="sql-editor-cabecalho">
              <div className="sql-editor-titulo">
                <FiTerminal size={17} aria-hidden="true" />
                <span>Consulta SQL</span>
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
                onChange={setCodigoSql}
                onExecutar={() => rodarConsulta()}
                esquemaColunas={esquemaColunas}
                rotulo="Editor de código SQL interativo"
              />
            </div>

            {/* Ações do Editor */}
            <div className="sql-editor-acoes">
              <button
                type="button"
                className="botao botao-primario sql-botao-executar"
                onClick={() => rodarConsulta()}
                disabled={executando || carregandoMotor}
              >
                <FiPlay size={16} aria-hidden="true" />
                <span>{executando ? 'Executando...' : 'Executar consulta'}</span>
              </button>

              <button
                type="button"
                className="botao botao-secundario"
                onClick={() => setCodigoSql('')}
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

          {/* Painel de Resultados */}
          <div className="sql-card-resultados" aria-live="polite">
            <div className="sql-resultados-cabecalho">
              <div className="sql-resultados-titulo">
                <FiTable size={17} aria-hidden="true" />
                <span>Resultado da Execução</span>
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
                  <p>Digite uma consulta SQL acima e clique em Executar.</p>
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

          {/* Exemplos Prontos de Consultas */}
          <div className="sql-secao-exemplos">
            <div className="sql-exemplos-cabecalho">
              <div>
                <h2>Exemplos Prontos de Consultas</h2>
                <p>Clique em qualquer consulta para carregá-la no editor e rodar instantaneamente.</p>
              </div>

              {/* Filtro por categoria */}
              <div className="sql-filtros-categoria" role="tablist" aria-label="Categorias de exemplos">
                {CATEGORIAS_EXEMPLOS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={categoriaAtiva === cat}
                    className={`sql-filtro-botao ${categoriaAtiva === cat ? 'ativo' : ''}`}
                    onClick={() => setCategoriaAtiva(cat)}
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
                    <span className={`sql-badge-categoria sql-cat-${ex.categoria.toLowerCase()}`}>{ex.categoria}</span>
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
