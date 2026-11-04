'use client';

import { Folha } from './Folha';
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
      {!web && (
        <section className="rascunho-desafio" aria-labelledby="desafio-rascunho-titulo">
          <p className="rascunho-desafio-rotulo">Desafio para praticar · Arrays e funções</p>
          <h2 id="desafio-rascunho-titulo">Encontre o maior número do array</h2>
          <p>
            Faça um algoritmo que receba um array de números e devolva o maior valor. Use um laço para comparar os
            números, sem usar <code>Math.max</code> ou ordenar o array.
          </p>
          <details>
            <summary>Precisa de ajuda? Veja o passo a passo</summary>
            <ol className="rascunho-desafio-passos">
              <li>
                <strong>Crie um array com 8 números.</strong> Chame de <code>numeros</code> e use os valores{' '}
                <code>[12, 5, 24, 8, 19, 3, 16, 10]</code>.
              </li>
              <li>
                <strong>Crie uma função que receba o array.</strong> Dê o nome <code>encontrarMaior</code> à função e
                use <code>lista</code> como parâmetro. Considere que a lista terá pelo menos um número.
              </li>
              <li>
                <strong>Guarde o primeiro número como o maior por enquanto.</strong> Dentro da função, crie uma variável{' '}
                <code>maior</code> com o valor de <code>lista[0]</code>. Começar pelo primeiro valor também permite
                trabalhar com números negativos.
              </li>
              <li>
                <strong>Percorra os outros números com um laço.</strong> Use <code>for</code> para visitar os valores a
                partir do segundo elemento do array.
              </li>
              <li>
                <strong>Compare cada valor com o maior guardado.</strong> Use <code>if</code>: quando encontrar um
                número maior, atualize a variável <code>maior</code>.
              </li>
              <li>
                <strong>Devolva o resultado ao terminar o laço.</strong> Use <code>return</code> depois de percorrer
                todos os números.
              </li>
              <li>
                <strong>Chame a função e veja a saída.</strong> Escreva{' '}
                <code>console.log(encontrarMaior(numeros));</code> fora da função e clique em <strong>Rodar</strong>. O
                resultado esperado é <code>24</code>.
              </li>
            </ol>
            <p className="rascunho-desafio-extra">
              Funcionou? Experimente <code>[-8, -2, -15]</code> (resultado <code>-2</code>), <code>[7, 7, 3]</code>{' '}
              (resultado <code>7</code>) e <code>[5]</code> (resultado <code>5</code>).
            </p>
          </details>
          <p className="rascunho-desafio-livre">
            Escreva sua tentativa no editor abaixo. O rascunho continua livre para experimentar outras ideias.
          </p>
        </section>
      )}
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
