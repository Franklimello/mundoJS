import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const json: Licao = {
  slug: 'json-dados-e-textos',
  titulo: 'JSON: dados que viram texto',
  resumo: 'parse e stringify para ler e preparar dados de uma aplicação.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '**JSON** é um formato de texto para representar dados. Ele aparece em arquivos de configuração e nas respostas de muitas APIs. O objeto nativo `JSON` tem métodos para converter esse texto em valores e fazer o caminho de volta.',
    },
    {
      tipo: 'p',
      texto:
        '`JSON.parse(texto)` transforma um texto JSON em um valor JavaScript. Depois da conversão, você pode acessar propriedades ou percorrer um array normalmente.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const texto = \'{"nome":"Ana","pontos":12}\';',
        'const pessoa = JSON.parse(texto);',
        'console.log(pessoa.nome);',
        'console.log(pessoa.pontos);',
      ),
      saida: linhas('Ana', '12'),
    },
    {
      tipo: 'p',
      texto:
        '`JSON.stringify(valor)` transforma dados em texto JSON. Repare na diferença: o objeto tem propriedades acessíveis; o texto é uma string que pode ser enviada ou armazenada.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const preferencias = { tema: "claro", som: false };',
        'console.log(JSON.stringify(preferencias));',
      ),
      saida: '{"tema":"claro","som":false}',
    },
    {
      tipo: 'nota',
      texto:
        'Em JSON, os nomes das propriedades e os textos usam aspas duplas. Comentários, vírgula depois do último item, funções e undefined não fazem parte desse formato. JSON.parse lança um erro se o texto for inválido; nesta lição, todas as entradas serão válidas. O tratamento de falhas aparece na trilha de erros.',
    },
  ],
  exercicios: [
    {
      titulo: 'Leia o nome do perfil',
      enunciado: [
        { tipo: 'p', texto: 'Complete `lerNome(texto)` para ler um perfil recebido em JSON.' },
        {
          tipo: 'lista',
          itens: [
            'Converta o texto com `JSON.parse` e devolva a propriedade `nome`.',
            'A entrada será um texto JSON válido com um objeto que contém `nome`.',
            'Exemplo: o texto `\'{"nome":"Ana"}\'` deve resultar no texto `"Ana"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const perfilJson = \'{"nome":"Ana","pontos":12}\';',
        '',
        'function lerNome(texto) {',
        '}',
        '',
        'console.log(lerNome(perfilJson));',
      ),
      testes: [
        {
          descricao: 'Lê a propriedade do objeto convertido',
          codigo: js`igual(lerNome('{"nome":"Ana","pontos":12}'), 'Ana'); igual(lerNome('{"nome":"Bruno"}'), 'Bruno'); igual(lerNome('{"nome":""}'), '');`,
        },
      ],
      dicas: [
        'Guarde o resultado de `JSON.parse(texto)` em uma constante.',
        'Leia a propriedade nome desse objeto e devolva seu valor.',
      ],
      solucao: 'function lerNome(texto) {\n  const perfil = JSON.parse(texto);\n  return perfil.nome;\n}',
    },
    {
      titulo: 'Prepare as preferências',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Complete `salvarPreferencias(preferencias)` para transformar o objeto recebido em texto JSON.',
        },
        {
          tipo: 'lista',
          itens: [
            'Use `JSON.stringify` e devolva uma string.',
            'Mantenha todos os dados do objeto, sem alterá-lo.',
            'O objeto terá somente valores compatíveis com JSON. Não é preciso salvar em um banco nesta atividade.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const preferencias = { tema: "escuro", som: true };',
        '',
        'function salvarPreferencias(preferencias) {',
        '}',
        '',
        'console.log(salvarPreferencias(preferencias));',
      ),
      testes: [
        {
          descricao: 'Devolve texto que representa os mesmos dados',
          codigo: js`const entrada = { tema: 'escuro', som: true }; const resultado = salvarPreferencias(entrada); verdadeiro(typeof resultado === 'string', 'Devolva o texto produzido por JSON.stringify.'); igual(JSON.parse(resultado), entrada); igual(entrada, { tema: 'escuro', som: true }); igual(JSON.parse(salvarPreferencias({ tema: 'claro', som: false, tamanho: 14 })), { tema: 'claro', som: false, tamanho: 14 });`,
        },
      ],
      dicas: [
        'Aqui a conversão é de objeto para texto, o caminho inverso de parse.',
        'Devolva `JSON.stringify(preferencias)`.',
      ],
      solucao: 'function salvarPreferencias(preferencias) {\n  return JSON.stringify(preferencias);\n}',
    },
    {
      titulo: 'Some os preços recebidos',
      enunciado: [
        { tipo: 'p', texto: 'Complete `totalDosProdutos(texto)` para somar os preços de uma lista recebida em JSON.' },
        {
          tipo: 'lista',
          itens: [
            'Converta o texto em um array. Cada objeto terá uma propriedade numérica `preco`.',
            'Devolva a soma como número. Uma lista vazia deve resultar em `0`.',
            'Exemplo: `\'[{"preco":12},{"preco":8}]\'` deve resultar em `20`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const produtosJson = \'[{"nome":"Caderno","preco":12},{"nome":"Caneta","preco":8}]\';',
        '',
        'function totalDosProdutos(texto) {',
        '}',
        '',
        'console.log(totalDosProdutos(produtosJson));',
      ),
      testes: [
        {
          descricao: 'Converte a lista e soma os preços, inclusive quando está vazia',
          codigo: js`igual(totalDosProdutos('[{"preco":12},{"preco":8}]'), 20); igual(totalDosProdutos('[{"preco":4},{"preco":0},{"preco":6}]'), 10); igual(totalDosProdutos('[]'), 0);`,
        },
      ],
      dicas: [
        'Depois de usar parse, trabalhe com o resultado como um array comum.',
        'Comece o total em zero e acrescente o preco de cada produto, ou use reduce com valor inicial zero.',
      ],
      solucao:
        'function totalDosProdutos(texto) {\n  const produtos = JSON.parse(texto);\n  return produtos.reduce((total, produto) => total + produto.preco, 0);\n}',
    },
  ],
};
