'use client';

import { Folha } from './Folha';
import { DesafiosRascunho } from './DesafiosRascunho';
import { useRef, useState } from 'react';
import { chaveDoDesafio, DESAFIOS_RASCUNHO } from '@/conteudo/desafios-rascunho';

const DOCUMENTO_LIVRE = {
  html: '<h1>Minha primeira página</h1>\n<p id="mensagem">Clique para mudar este texto.</p>\n<button id="botao" type="button">Experimentar</button>',
  css: 'h1 { color: #244c9b; }\nbutton { padding: 12px 18px; border-radius: 8px; }',
};
const JAVASCRIPT_WEB =
  'const botao = document.querySelector("#botao");\nbotao.addEventListener("click", () => {\n  document.querySelector("#mensagem").textContent = "Você mudou a página com JavaScript!";\n});\n';

/** As folhas fora das lições: a livre e a da vitrine. A da lição está em `LicaoInterativa.tsx`. */

const CODIGO_DO_RASCUNHO = 'console.log("Olá, MundoJS!");\n';
const DOCUMENTO_DO_DESAFIO = { html: '', css: '' };

export function FolhaDoRascunho() {
  const [web, setWeb] = useState(false);
  const [escolhas, setEscolhas] = useState({ javascript: '', web: '' });
  const [trocando, setTrocando] = useState(false);
  const [falhaTroca, setFalhaTroca] = useState(false);
  const trocaEmAndamento = useRef(false);
  const folha = useRef<{ salvarAntesDeSair: () => Promise<boolean> }>(null);
  const modo = web ? 'web' : 'javascript';
  const desafio = DESAFIOS_RASCUNHO.find((item) => item.id === escolhas[modo] && item.modo === modo);

  async function trocar(acao: () => void) {
    if (trocaEmAndamento.current) return;
    trocaEmAndamento.current = true;
    setTrocando(true);
    setFalhaTroca(false);
    try {
      if ((await folha.current?.salvarAntesDeSair()) === false) {
        setFalhaTroca(true);
        return;
      }
      acao();
    } finally {
      trocaEmAndamento.current = false;
      setTrocando(false);
    }
  }
  return (
    <>
      <div className="web-modos" aria-label="Tipo de rascunho">
        <button
          type="button"
          className="botao"
          aria-pressed={!web}
          disabled={trocando}
          onClick={() => void trocar(() => setWeb(false))}
        >
          JavaScript
        </button>
        <button
          type="button"
          className="botao"
          aria-pressed={web}
          disabled={trocando}
          onClick={() => void trocar(() => setWeb(true))}
        >
          Página web · HTML, CSS e JS
        </button>
      </div>
      <DesafiosRascunho
        modo={modo}
        escolhido={escolhas[modo]}
        ocupado={trocando}
        aoEscolher={(id) => void trocar(() => setEscolhas((atual) => ({ ...atual, [modo]: id })))}
      />
      {falhaTroca && (
        <p role="alert">
          A troca foi cancelada porque o salvamento falhou. Tente salvar novamente e depois selecione o desafio.
        </p>
      )}
      <Folha
        key={desafio ? chaveDoDesafio(desafio) : modo}
        controleRef={folha}
        titulo={desafio ? `Rascunho · ${desafio.titulo}` : 'Rascunho livre'}
        rotuloDoEditor="Editor de código livre"
        codigoInicial={desafio ? '' : web ? JAVASCRIPT_WEB : CODIGO_DO_RASCUNHO}
        documentoInicial={web ? (desafio ? DOCUMENTO_DO_DESAFIO : DOCUMENTO_LIVRE) : undefined}
        chaveRascunho={desafio ? chaveDoDesafio(desafio) : web ? 'rascunho-web' : 'rascunho-livre'}
        dadosExemplo={desafio ? { texto: desafio.dados, arquivo: web ? 'html' : 'javascript' } : undefined}
        enunciado={
          desafio ? (
            <>
              <h3>{desafio.titulo}</h3>
              <p>{desafio.enunciado}</p>
              <ol>
                {desafio.passos.map(([titulo, dica]) => (
                  <li key={titulo}>
                    <strong>{titulo}</strong> {dica}
                  </li>
                ))}
              </ol>
            </>
          ) : undefined
        }
        contextoTutor={{ livre: true }}
        pautasMinimas={18}
      />
    </>
  );
}

const CODIGO_DA_VITRINE = [
  'const nome = "Ana";',
  '',
  'for (let i = 1; i <= 3; i++) {',
  '  console.log(`Olá, ${nome}! (volta ${i})`);',
  '}',
  '',
].join('\n');

/** A folha da página inicial: já abre rodando, e roda de novo enquanto a pessoa digita. */
export function FolhaDaVitrine() {
  return (
    <Folha
      titulo="Experimente"
      rotuloDoEditor="Editor de código de exemplo"
      codigoInicial={CODIGO_DA_VITRINE}
      rodarAoDigitar
      pautasMinimas={7}
    />
  );
}
