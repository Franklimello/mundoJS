'use client';

import { Folha } from './Folha';
import { DesafiosRascunho } from './DesafiosRascunho';
import { useState } from 'react';

const DOCUMENTO_LIVRE = {
  html: '<h1>Minha primeira página</h1>\n<p id="mensagem">Clique para mudar este texto.</p>\n<button id="botao" type="button">Experimentar</button>',
  css: 'h1 { color: #244c9b; }\nbutton { padding: 12px 18px; border-radius: 8px; }',
};
const JAVASCRIPT_WEB =
  'const botao = document.querySelector("#botao");\nbotao.addEventListener("click", () => {\n  document.querySelector("#mensagem").textContent = "Você mudou a página com JavaScript!";\n});\n';

/** As folhas fora das lições: a livre e a da vitrine. A da lição está em `LicaoInterativa.tsx`. */

const CODIGO_DO_RASCUNHO = [
  '// Aqui você escreve e roda o que quiser.',
  '// Aperte Ctrl + Enter para ver o resultado.',
  '',
  'console.log("Olá, MundoJS!");',
  '',
].join('\n');

export function FolhaDoRascunho() {
  const [web, setWeb] = useState(false);
  return (
    <>
      <div className="web-modos" aria-label="Tipo de rascunho">
        <button type="button" className="botao" aria-pressed={!web} onClick={() => setWeb(false)}>
          JavaScript
        </button>
        <button type="button" className="botao" aria-pressed={web} onClick={() => setWeb(true)}>
          Página web · HTML, CSS e JS
        </button>
      </div>
      <DesafiosRascunho key={web ? 'desafios-web' : 'desafios-javascript'} modo={web ? 'web' : 'javascript'} />
      <Folha
        key={web ? 'web' : 'javascript'}
        titulo="Rascunho"
        rotuloDoEditor="Editor de código livre"
        codigoInicial={web ? JAVASCRIPT_WEB : CODIGO_DO_RASCUNHO}
        documentoInicial={web ? DOCUMENTO_LIVRE : undefined}
        chaveRascunho={web ? 'rascunho-web' : 'rascunho-livre'}
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
