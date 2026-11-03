import { criarExecutor } from './executor';
import { rodar } from './rodar';
import { montarDocumento, type DocumentoWeb } from './documento';
import type { PedidoBruto, ResultadoBruto, ResultadoExecucao, TesteDefinicao } from './tipos';

/**
 * O código do aluno nunca roda na página do MundoJS. Ele roda num iframe:
 *
 *  - `sandbox="allow-scripts"` e nada mais: sem `allow-same-origin`, o iframe
 *    tem uma origem "opaca" — não enxerga cookies, `localStorage`, nem a página
 *    de fora; sem formulários, janelas nem navegação;
 *  - uma política de conteúdo (CSP) dentro do documento corta toda rede
 *    (`fetch`, WebSocket, imagens externas): o código só calcula e imprime;
 *  - um iframe NOVO a cada execução, descartado no fim. Assim cada "Rodar"
 *    começa limpo (nada de `Array.prototype` alterado na rodada anterior) e
 *    temporizadores esquecidos morrem junto.
 *
 * Quem protege a aba de um laço infinito é o contador inserido por `analisar`;
 * o vigia daqui só pega o que escapar dele (e então descarta o iframe).
 */

const POLITICA_DE_CONTEUDO =
  "default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'";
const ESPERA_PELO_IFRAME_MS = 5_000;
const FOLGA_DO_VIGIA_MS = 8_000;

/** O script que roda dentro do iframe: monta o executor e responde às mensagens. */
export function scriptDoIframe(): string {
  return `(function () {
  var executar = (${criarExecutor.toString()})();
  var montar = (${montarDocumento.toString()});
  var iniciado = false;
  window.addEventListener('message', function (evento) {
    var dados = evento.data;
    if (evento.source !== parent || iniciado || !dados || dados.tipo !== 'executar') return;
    iniciado = true;
    if (dados.documento) montar(document, dados.documento);
    executar(dados.pedido).then(
      function (resultado) { parent.postMessage({ tipo: 'resultado', id: dados.id, resultado: resultado }, '*'); },
      function (erro) { parent.postMessage({ tipo: 'falha', id: dados.id, mensagem: String((erro && erro.message) || erro) }, '*'); }
    );
  });
  parent.postMessage({ tipo: 'pronto' }, '*');
})();`;
}

export function documentoDoIframe(): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${POLITICA_DE_CONTEUDO}"></head><body><script>${scriptDoIframe()}</script></body></html>`;
}

function resultadoComErro(mensagem: string, nome = 'ExecutorIndisponivel'): ResultadoBruto {
  return { saida: [], erro: { nome, mensagem }, testes: [], duracaoMs: 0 };
}

interface PreviaWeb {
  documento: DocumentoWeb;
  alvo: HTMLElement;
}

function executarNoIframe(pedido: PedidoBruto, previa?: PreviaWeb): Promise<ResultadoBruto> {
  return new Promise((resolver) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', previa ? 'allow-scripts allow-forms' : 'allow-scripts');
    iframe.title = previa ? 'Prévia da página HTML, CSS e JavaScript' : 'Executor de código (oculto)';
    if (!previa) {
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      Object.assign(iframe.style, {
        position: 'fixed',
        width: '0',
        height: '0',
        border: '0',
        visibility: 'hidden',
        pointerEvents: 'none',
      });
    }

    const id = Math.random().toString(36).slice(2);
    let vigia: ReturnType<typeof setTimeout>;

    const terminar = (resultado: ResultadoBruto) => {
      clearTimeout(vigia);
      window.removeEventListener('message', ouvir);
      if (!previa || resultado.erro) iframe.remove();
      resolver(resultado);
    };

    function ouvir(evento: MessageEvent) {
      // Só vale o que vem do nosso iframe.
      if (evento.source !== iframe.contentWindow) return;
      const dados = evento.data as { tipo?: string; id?: string; resultado?: ResultadoBruto; mensagem?: string } | null;
      if (!dados) return;
      if (dados.tipo === 'pronto') {
        clearTimeout(vigia);
        vigia = setTimeout(
          () => terminar(resultadoComErro('O código demorou demais e foi interrompido.', 'Demorou')),
          pedido.esperaMaximaMs + FOLGA_DO_VIGIA_MS,
        );
        iframe.contentWindow?.postMessage({ tipo: 'executar', id, pedido, documento: previa?.documento }, '*');
      } else if (dados.tipo === 'resultado' && dados.id === id && dados.resultado) {
        terminar(dados.resultado);
      } else if (dados.tipo === 'falha' && dados.id === id) {
        terminar(resultadoComErro(dados.mensagem ?? 'O executor falhou.'));
      }
    }

    window.addEventListener('message', ouvir);
    vigia = setTimeout(
      () => terminar(resultadoComErro('Não foi possível iniciar o executor de código neste navegador.')),
      ESPERA_PELO_IFRAME_MS,
    );
    iframe.srcdoc = documentoDoIframe();
    if (previa) previa.alvo.replaceChildren(iframe);
    else document.body.appendChild(iframe);
  });
}

// Uma execução por vez: duas ao mesmo tempo atropelariam a saída uma da outra.
let fila: Promise<unknown> = Promise.resolve();

/** Roda o código do aluno (e os testes, se houver) no iframe isolado. */
export function rodarNoNavegador(
  codigo: string,
  testes: TesteDefinicao[] = [],
  previa?: PreviaWeb,
): Promise<ResultadoExecucao> {
  previa?.alvo.replaceChildren();
  const execucao = fila.then(() => rodar(codigo, testes, (pedido) => executarNoIframe(pedido, previa)));
  fila = execucao.catch(() => undefined);
  return execucao;
}
