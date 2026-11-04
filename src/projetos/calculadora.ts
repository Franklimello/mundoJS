import type { DocumentoWeb } from '@/engine/documento';

export const dadosCalculadora =
  'const produtos = [\n  { nome: "Caderno", precoCentavos: 1250, quantidade: 2 },\n  { nome: "Caneta", precoCentavos: 350, quantidade: 3 },\n  { nome: "Mochila", precoCentavos: 8900, quantidade: 1 },\n];\nconst descontoPercentual = 10;';

export const documentoCalculadora: DocumentoWeb = {
  html: `<main id="calculadora">
  <h1>Minha compra</h1>
  <p>Altere as quantidades e o desconto para experimentar suas funções.</p>
  <section aria-label="Produtos da compra">
    <div class="produto"><label for="quantidade-0">Caderno <small>R$ 12,50 cada</small></label><input id="quantidade-0" name="quantidade-0" type="number" min="0" max="999" step="1" value="2" aria-label="Quantidade de cadernos"></div>
    <div class="produto"><label for="quantidade-1">Caneta <small>R$ 3,50 cada</small></label><input id="quantidade-1" name="quantidade-1" type="number" min="0" max="999" step="1" value="3" aria-label="Quantidade de canetas"></div>
    <div class="produto"><label for="quantidade-2">Mochila <small>R$ 89,00 cada</small></label><input id="quantidade-2" name="quantidade-2" type="number" min="0" max="999" step="1" value="1" aria-label="Quantidade de mochilas"></div>
  </section>
  <div class="produto"><label for="desconto">Desconto (%)</label><input id="desconto" type="number" min="0" max="100" step="any" value="10"></div>
  <section class="resumo" aria-label="Totais da compra" aria-live="polite">
    <p>Subtotal <output id="subtotal">—</output></p>
    <p class="total">Total <output id="total">—</output></p>
  </section>
  <p id="estado" role="status">Complete as funções e toque em Rodar para atualizar a tela.</p>
  <h2>Resumo em JSON</h2><output id="resumo-json" aria-label="Resumo JSON da compra">Aguardando suas funções.</output>
</main>`,
  css: 'body { background: #f4f7fc; } #calculadora { max-width: 540px; margin: auto; } h1 { margin: 0 0 12px; color: #17377e; font-size: 28px; } h2 { font-size: 18px; margin-top: 24px; } p { line-height: 1.5; } .produto { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 0; border-bottom: 1px solid #ced9eb; } label { font-weight: 600; } small { display: block; color: #526078; font-weight: 400; margin-top: 4px; } input { box-sizing: border-box; width: 88px; min-height: 44px; border: 1px solid #99accd; border-radius: 6px; padding: 8px; background: white; color: #17243b; font-size: 16px; } input:focus-visible { outline: 3px solid #294cb8; outline-offset: 2px; } .resumo { padding: 12px 16px; margin-top: 16px; background: white; border: 1px solid #ced9eb; border-radius: 8px; } .resumo p { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin: 10px 0; } .total { color: #17377e; font-size: 22px; font-weight: 700; } #estado { font-size: 14px; color: #43516b; } #resumo-json { display: block; padding: 12px; border: 1px solid #ced9eb; background: white; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 13px; line-height: 1.5; }',
};

export const demonstracaoCalculadora = `const subtotalExemplo = subtotalCompra(produtos);
const totalExemplo = aplicarDesconto(subtotalExemplo, descontoPercentual);
console.log(subtotalExemplo);
console.log(totalExemplo);
console.log(formatarReais(totalExemplo));
console.log(gerarResumo(produtos, subtotalExemplo, totalExemplo));

if (typeof document !== "undefined") {
  const calculadora = document.querySelector("#calculadora");
  function atualizarTela() {
    if ([...calculadora.querySelectorAll("input")].some(campo => {
      const valor = Number(campo.value);
      return !Number.isFinite(valor) || valor < Number(campo.min) || valor > Number(campo.max) || (campo.id !== "desconto" && !Number.isInteger(valor));
    })) {
      document.querySelector("#subtotal").textContent = "—";
      document.querySelector("#total").textContent = "—";
      document.querySelector("#resumo-json").textContent = "Corrija os campos para atualizar o resumo.";
      document.querySelector("#estado").textContent = "Use quantidades inteiras de 0 a 999 e desconto de 0 a 100%.";
      return;
    }
    const itens = produtos.map((produto, indice) => ({
      ...produto,
      quantidade: Math.min(999, Math.max(0, Math.trunc(Number(document.querySelector("#quantidade-" + indice).value) || 0))),
    }));
    const percentual = Math.min(100, Math.max(0, Number(document.querySelector("#desconto").value) || 0));
    const subtotal = subtotalCompra(itens);
    const total = aplicarDesconto(subtotal, percentual);
    const subtotalTexto = formatarReais(subtotal);
    const totalTexto = formatarReais(total);
    const resumo = gerarResumo(itens, subtotal, total);
    document.querySelector("#subtotal").textContent = subtotalTexto ?? "—";
    document.querySelector("#total").textContent = totalTexto ?? "—";
    document.querySelector("#resumo-json").textContent = typeof resumo === "string" ? resumo : "Complete gerarResumo para ver o JSON.";
    const pronto = Number.isInteger(subtotal) && Number.isInteger(total) && typeof subtotalTexto === "string" && typeof totalTexto === "string" && typeof resumo === "string";
    document.querySelector("#estado").textContent = pronto ? "Sua calculadora está funcionando. Experimente outras quantidades!" : "Complete as quatro funções no início do código e rode de novo.";
  }
  calculadora.addEventListener("input", atualizarTela);
  atualizarTela();
}`;
