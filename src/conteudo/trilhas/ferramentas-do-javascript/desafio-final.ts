import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const desafioCompras: Licao = {
  slug: 'desafio-final',
  titulo: 'Construa uma calculadora de compras',
  resumo: 'Some produtos, aplique desconto, formate em reais e prepare um resumo JSON.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Vamos juntar arrays, objetos, Math e JSON em uma calculadora de compras. Cada etapa constrói uma função pequena. Depois, reúna as quatro funções no projeto para ver sua própria tela de compras funcionando.',
    },
    {
      tipo: 'p',
      texto:
        'Os preços serão inteiros em **centavos**: `1250` representa R$ 12,50. Multiplique o preço pela quantidade para obter o valor de cada produto. Só divida por 100 ao formatar o valor para mostrar na tela.',
    },
    {
      tipo: 'p',
      texto:
        'O desconto será uma porcentagem de 0 a 100. Para tirar 10%, multiplique o subtotal por `1 - 10 / 100`. Use Math.round uma única vez no resultado para manter um total inteiro em centavos.',
    },
    {
      tipo: 'p',
      texto:
        '**Intl** também já vem no JavaScript. `new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })` prepara um formatador para reais. Chame seu método `format` com o valor em reais, não em centavos.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });',
        'console.log(reais.format(1250 / 100));',
      ),
      saida: 'R$\u00a012,50',
    },
    {
      tipo: 'nota',
      texto:
        'A formatação pode inserir um espaço que não quebra linha depois de R$. A correção aceita esse espaço ou um espaço comum. Nas três funções de cálculo e resumo, mantenha os valores monetários em centavos.',
    },
  ],
  exercicios: [
    {
      titulo: 'Some os produtos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `subtotalCompra(produtos)` para devolver o subtotal em centavos.' },
        {
          tipo: 'lista',
          itens: [
            'Cada produto tem `nome`, `precoCentavos` e `quantidade`. Multiplique preço por quantidade e some os resultados.',
            'Preços e quantidades serão inteiros maiores ou iguais a zero. Uma lista vazia deve resultar em `0`.',
            'Não altere os produtos. Exemplo: dois itens de 1250 centavos e três de 350 centavos totalizam `3550`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const produtos = [',
        '  { nome: "Caderno", precoCentavos: 1250, quantidade: 2 },',
        '  { nome: "Caneta", precoCentavos: 350, quantidade: 3 },',
        '];',
        '',
        'function subtotalCompra(produtos) {',
        '}',
        '',
        'console.log(subtotalCompra(produtos));',
      ),
      testes: [
        {
          descricao: 'Soma preço vezes quantidade e aceita lista vazia',
          codigo: js`igual(subtotalCompra([{ nome: 'A', precoCentavos: 1250, quantidade: 2 }, { nome: 'B', precoCentavos: 350, quantidade: 3 }]), 3550); igual(subtotalCompra([]), 0); igual(subtotalCompra([{ nome: 'A', precoCentavos: 199, quantidade: 3 }, { nome: 'B', precoCentavos: 500, quantidade: 0 }]), 597);`,
        },
        {
          descricao: 'Calcula sem alterar os dados recebidos',
          codigo: js`const itens = [{ nome: 'Teste', precoCentavos: 450, quantidade: 2 }]; igual(subtotalCompra(itens), 900); igual(itens, [{ nome: 'Teste', precoCentavos: 450, quantidade: 2 }]);`,
        },
      ],
      dicas: [
        'Comece um total em zero e percorra os produtos.',
        'Acrescente `produto.precoCentavos * produto.quantidade` ao total e devolva a soma.',
      ],
      solucao:
        'function subtotalCompra(produtos) {\n  return produtos.reduce((total, produto) => total + produto.precoCentavos * produto.quantidade, 0);\n}',
    },
    {
      titulo: 'Aplique o desconto',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Complete `aplicarDesconto(subtotalCentavos, percentual)` para devolver o total depois do desconto.',
        },
        {
          tipo: 'lista',
          itens: [
            'O subtotal será um inteiro maior ou igual a zero; o percentual estará entre 0 e 100.',
            'Calcule o total descontado e use `Math.round` para arredondar uma única vez ao centavo mais próximo.',
            'Exemplos: `aplicarDesconto(3550, 10)` devolve `3195`; `aplicarDesconto(999, 15)` devolve `849`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const compra = { subtotalCentavos: 3550, descontoPercentual: 10 };',
        '',
        'function aplicarDesconto(subtotalCentavos, percentual) {',
        '}',
        '',
        'console.log(aplicarDesconto(compra.subtotalCentavos, compra.descontoPercentual));',
      ),
      testes: [
        {
          descricao: 'Desconta a porcentagem e arredonda o total em centavos',
          codigo: js`igual(aplicarDesconto(3550, 10), 3195); igual(aplicarDesconto(999, 15), 849); igual(aplicarDesconto(5, 50), 3); igual(aplicarDesconto(1200, 0), 1200); igual(aplicarDesconto(1200, 100), 0); igual(aplicarDesconto(0, 10), 0);`,
        },
      ],
      dicas: [
        'Divida o percentual por 100 e subtraia essa fração de 1.',
        'Multiplique o subtotal por essa proporção e passe o resultado para Math.round.',
      ],
      solucao:
        'function aplicarDesconto(subtotalCentavos, percentual) {\n  return Math.round(subtotalCentavos * (1 - percentual / 100));\n}',
    },
    {
      titulo: 'Mostre o valor em reais',
      enunciado: [
        { tipo: 'p', texto: 'Complete `formatarReais(centavos)` para devolver um texto com o valor em reais.' },
        {
          tipo: 'lista',
          itens: [
            'Use `Intl.NumberFormat` com o idioma `"pt-BR"`, estilo `"currency"` e moeda `"BRL"`.',
            'Divida o valor em centavos por 100 antes de formatar.',
            'Exemplos: `3195` deve aparecer como `R$ 31,95`; `0` como `R$ 0,00`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const totalCentavos = 3195;',
        '',
        'function formatarReais(centavos) {',
        '}',
        '',
        'console.log(formatarReais(totalCentavos));',
      ),
      testes: [
        {
          descricao: 'Formata centavos como moeda brasileira',
          codigo: js`igual(formatarReais(3195)?.replace(/\s/g, ' '), 'R$ 31,95'); igual(formatarReais(0)?.replace(/\s/g, ' '), 'R$ 0,00'); igual(formatarReais(123456)?.replace(/\s/g, ' '), 'R$ 1.234,56');`,
        },
        {
          descricao: 'Usa o formatador Intl.NumberFormat',
          codigo: js`verdadeiro(/\bIntl\s*\.\s*NumberFormat\b/.test(codigoDoAluno) && typeof formatarReais(199) === 'string', 'Use Intl.NumberFormat e devolva o texto formatado.');`,
        },
      ],
      dicas: [
        'Crie um formatador com as três opções indicadas no enunciado.',
        'Devolva `formatador.format(centavos / 100)`.',
      ],
      solucao:
        'function formatarReais(centavos) {\n  const formatador = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });\n  return formatador.format(centavos / 100);\n}',
    },
    {
      titulo: 'Prepare o resumo JSON',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Complete `gerarResumo(produtos, subtotalCentavos, totalCentavos)` para devolver um texto JSON.',
        },
        {
          tipo: 'lista',
          itens: [
            'O texto deve representar um objeto com `quantidadeItens`, `subtotalCentavos` e `totalCentavos`.',
            'Some as quantidades dos produtos para obter quantidadeItens. Não use apenas o tamanho do array.',
            'Os dois totais já chegam calculados como argumentos; mantenha-os em centavos. Não altere os produtos.',
            'Exemplo: produtos com quantidades 2 e 3, subtotal 3550 e total 3195 devem representar `{ quantidadeItens: 5, subtotalCentavos: 3550, totalCentavos: 3195 }`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const produtos = [{ nome: "Caderno", precoCentavos: 1250, quantidade: 2 }, { nome: "Caneta", precoCentavos: 350, quantidade: 3 }];',
        'const subtotalCentavos = 3550;',
        'const totalCentavos = 3195;',
        '',
        'function gerarResumo(produtos, subtotalCentavos, totalCentavos) {',
        '}',
        '',
        'console.log(gerarResumo(produtos, subtotalCentavos, totalCentavos));',
      ),
      testes: [
        {
          descricao: 'Gera JSON com a quantidade de unidades e os totais recebidos',
          codigo: js`const itens = [{ nome: 'A', precoCentavos: 1250, quantidade: 2 }, { nome: 'B', precoCentavos: 350, quantidade: 3 }]; const texto = gerarResumo(itens, 3550, 3195); verdadeiro(typeof texto === 'string', 'Devolva o texto produzido por JSON.stringify.'); igual(JSON.parse(texto), { quantidadeItens: 5, subtotalCentavos: 3550, totalCentavos: 3195 }); igual(JSON.parse(gerarResumo([], 0, 0)), { quantidadeItens: 0, subtotalCentavos: 0, totalCentavos: 0 }); igual(JSON.parse(gerarResumo([{ quantidade: 0 }, { quantidade: 4 }], 800, 600)), { quantidadeItens: 4, subtotalCentavos: 800, totalCentavos: 600 }); igual(itens[0].quantidade, 2);`,
        },
      ],
      dicas: [
        'Some as quantidades, começando em zero.',
        'Monte o objeto com os três campos e passe-o para JSON.stringify.',
      ],
      solucao:
        'function gerarResumo(produtos, subtotalCentavos, totalCentavos) {\n  const quantidadeItens = produtos.reduce((total, produto) => total + produto.quantidade, 0);\n  return JSON.stringify({ quantidadeItens, subtotalCentavos, totalCentavos });\n}',
    },
  ],
};
