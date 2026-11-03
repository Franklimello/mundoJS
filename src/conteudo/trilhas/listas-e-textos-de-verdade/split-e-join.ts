import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const splitEJoin: Licao = {
  slug: 'split-e-join',
  titulo: 'Quebrando e juntando textos',
  resumo: 'split, join e reverse.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`split` quebra um texto numa lista, usando um separador. `join` faz o caminho de volta: junta uma lista num texto.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const frase = "um dois três";',
        'const palavras = frase.split(" ");',
        'console.log(palavras);',
        'console.log(palavras.length);',
        'console.log(palavras.join("-"));',
      ),
      saida: linhas("[ 'um', 'dois', 'três' ]", '3', 'um-dois-três'),
    },
    {
      tipo: 'p',
      texto:
        'O separador pode ser qualquer texto: uma vírgula, um traço, ou um texto vazio, que separa letra por letra.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('console.log("a,b,c".split(","));', 'console.log("casa".split(""));'),
      saida: linhas("[ 'a', 'b', 'c' ]", "[ 'c', 'a', 's', 'a' ]"),
    },
    {
      tipo: 'p',
      texto:
        'Como `split` devolve uma lista, vale tudo o que você já sabe de listas: `map`, `filter`, `length`. Assim se pega a primeira letra de cada palavra:',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const iniciais = "ana maria".split(" ").map((palavra) => palavra[0].toUpperCase());',
        'console.log(iniciais);',
        'console.log(iniciais.join(""));',
      ),
      saida: linhas("[ 'A', 'M' ]", 'AM'),
    },
    { tipo: 'p', texto: 'E `reverse` inverte a ordem de uma lista:' },
    {
      tipo: 'codigo',
      codigo: linhas('const letras = ["a", "b", "c"];', 'letras.reverse();', 'console.log(letras);'),
      saida: "[ 'c', 'b', 'a' ]",
    },
    {
      tipo: 'nota',
      texto:
        '`reverse` (e `push`) **mudam a própria lista**. `map`, `filter` e `slice` devolvem uma lista nova. Quando importa não alterar a original, essa diferença faz muita diferença. Encadear `split(...).reverse()` é seguro porque o `split` já criou uma lista nova.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Iniciais e palavras ao contrário',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções. Nos testes, as palavras vêm separadas por um espaço só.' },
        {
          tipo: 'lista',
          itens: [
            '`iniciais(nome)` devolve as iniciais em maiúsculas: `iniciais("Ana Maria Silva")` devolve `"AMS"`.',
            '`inverterPalavras(frase)` devolve as palavras na ordem contrária: `inverterPalavras("um dois três")` devolve `"três dois um"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'function iniciais(nome) {',
        '  // separe as palavras, pegue a primeira letra de cada uma e junte',
        '}',
        '',
        'function inverterPalavras(frase) {',
        '  // separe, inverta e junte de novo',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'iniciais("Ana Maria Silva") devolve “AMS”',
          codigo: js`igual(iniciais('Ana Maria Silva'), 'AMS', "iniciais('Ana Maria Silva')")`,
        },
        {
          descricao: 'iniciais deixa tudo em maiúsculas',
          codigo: js`igual(iniciais('carlos eduardo'), 'CE', "iniciais('carlos eduardo')")`,
        },
        {
          descricao: 'iniciais funciona com uma palavra só',
          codigo: js`igual(iniciais('joão'), 'J', "iniciais('joão')")`,
        },
        {
          descricao: 'inverterPalavras("um dois três") devolve “três dois um”',
          codigo: js`igual(inverterPalavras('um dois três'), 'três dois um', "inverterPalavras('um dois três')")`,
        },
        {
          descricao: 'inverterPalavras funciona com uma palavra só',
          codigo: js`igual(inverterPalavras('olá'), 'olá', "inverterPalavras('olá')")`,
        },
        {
          descricao: 'Usa split',
          codigo: js`verdadeiro(codigoDoAluno.includes('split'), 'Use split para separar as palavras.')`,
        },
      ],
      dicas: [
        'Comece separando as palavras: `nome.split(" ")`.',
        'Em `iniciais`, use `map` para pegar `palavra[0].toUpperCase()` de cada palavra e `join("")` no fim.',
        'Em `inverterPalavras`, o caminho é `split`, `reverse`, `join(" ")`.',
      ],
      solucao: linhas(
        'function iniciais(nome) {',
        '  return nome',
        '    .split(" ")',
        '    .map((palavra) => palavra[0].toUpperCase())',
        '    .join("");',
        '}',
        '',
        'function inverterPalavras(frase) {',
        '  return frase.split(" ").reverse().join(" ");',
        '}',
      ),
    },
    {
      titulo: 'Contando palavras',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `contarPalavras(frase)`, que devolve quantas palavras a frase tem. As palavras vêm separadas por um espaço só, e um texto vazio tem `0` palavras.',
        },
        {
          tipo: 'nota',
          texto:
            'Cuidado: `"".split(" ")` não devolve uma lista vazia, e sim `[""]`, uma lista com um texto vazio dentro. Por isso o texto vazio precisa de um tratamento à parte.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas('function contarPalavras(frase) {', '  // separe a frase e conte as partes', '}', ''),
      testes: [
        {
          descricao: 'contarPalavras("um dois três") devolve 3',
          codigo: js`igual(contarPalavras('um dois três'), 3, "contarPalavras('um dois três')")`,
        },
        { descricao: 'Uma palavra só devolve 1', codigo: js`igual(contarPalavras('olá'), 1, "contarPalavras('olá')")` },
        { descricao: 'Um texto vazio devolve 0', codigo: js`igual(contarPalavras(''), 0, "contarPalavras('')")` },
        {
          descricao: 'Uma frase longa',
          codigo: js`igual(contarPalavras('a vida é feita de pequenos momentos felizes'), 8, 'contarPalavras com 8 palavras')`,
        },
      ],
      dicas: [
        'Separe com `frase.split(" ")` e pegue o `length` da lista.',
        'Antes disso, um `if (frase === "")` devolve `0`.',
      ],
      solucao: linhas(
        'function contarPalavras(frase) {',
        '  if (frase === "") {',
        '    return 0;',
        '  }',
        '  return frase.split(" ").length;',
        '}',
      ),
    },
    {
      titulo: 'Endereço de uma página',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `criarSlug(titulo)`, que transforma um título no pedaço de endereço de uma página: tudo em minúsculas e as palavras ligadas por hífen. Por exemplo, `criarSlug("Aprendendo JavaScript Hoje")` devolve `"aprendendo-javascript-hoje"`. As palavras vêm separadas por um espaço só.',
        },
      ],
      codigoInicial: linhas('function criarSlug(titulo) {', '  // minúsculas, e hífen no lugar dos espaços', '}', ''),
      testes: [
        {
          descricao: 'criarSlug("Aprendendo JavaScript Hoje") devolve “aprendendo-javascript-hoje”',
          codigo: js`igual(criarSlug('Aprendendo JavaScript Hoje'), 'aprendendo-javascript-hoje', 'criarSlug com três palavras')`,
        },
        {
          descricao: 'Uma palavra só fica em minúsculas',
          codigo: js`igual(criarSlug('Olá'), 'olá', "criarSlug('Olá')")`,
        },
        {
          descricao: 'criarSlug("MundoJS é legal") devolve “mundojs-é-legal”',
          codigo: js`igual(criarSlug('MundoJS é legal'), 'mundojs-é-legal', "criarSlug('MundoJS é legal')")`,
        },
        {
          descricao: 'Usa split e join',
          codigo: js`verdadeiro(
  codigoDoAluno.includes('split') && codigoDoAluno.includes('join'),
  'Resolva com split para separar e join para ligar com hífen.',
)`,
        },
      ],
      dicas: [
        'O caminho é: minúsculas, `split(" ")` e `join("-")`.',
        'Resposta: `titulo.toLowerCase().split(" ").join("-")`.',
      ],
      solucao: linhas('function criarSlug(titulo) {', '  return titulo.toLowerCase().split(" ").join("-");', '}'),
    },
    {
      titulo: 'Somando uma linha de números',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `somarLinha(linha)`. Ela recebe números separados por vírgula, como `"10,20,30"`, e devolve a soma deles: `60`.',
        },
        {
          tipo: 'nota',
          texto:
            'Depois do `split`, os itens ainda são **textos**: `"10" + "20"` dá `"1020"`. Para virar número, use `Number("10")`, que devolve `10`.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas('function somarLinha(linha) {', '  // separe, converta em números e some', '}', ''),
      testes: [
        {
          descricao: 'somarLinha("10,20,30") devolve 60',
          codigo: js`igual(somarLinha('10,20,30'), 60, "somarLinha('10,20,30')")`,
        },
        { descricao: 'Um número só devolve ele mesmo', codigo: js`igual(somarLinha('5'), 5, "somarLinha('5')")` },
        { descricao: 'Aceita decimais', codigo: js`igual(somarLinha('1.5,2.5'), 4, "somarLinha('1.5,2.5')")` },
        {
          descricao: 'Soma números, e não junta textos',
          codigo: js`igual(somarLinha('1,2,3,4'), 10, "somarLinha('1,2,3,4')")`,
        },
      ],
      dicas: [
        'Separe com `linha.split(",")` e converta cada item com `Number(...)`.',
        'Some com um laço `for...of`, em cima da lista de números.',
      ],
      solucao: linhas(
        'function somarLinha(linha) {',
        '  let soma = 0;',
        '  for (const parte of linha.split(",")) {',
        '    soma = soma + Number(parte);',
        '  }',
        '  return soma;',
        '}',
      ),
    },
    {
      titulo: 'Palíndromo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Um palíndromo é um texto que se lê igual de trás para frente, como `arara`. Escreva a função `ehPalindromo(texto)`, que devolve `true` ou `false`, ignorando maiúsculas e **espaços**: `"Ana"` é palíndromo, e `"a sacada da casa"` também.',
        },
      ],
      codigoInicial: linhas(
        'function ehPalindromo(texto) {',
        '  // limpe o texto e compare com ele mesmo ao contrário',
        '}',
        '',
      ),
      testes: [
        {
          descricao: 'ehPalindromo("arara") devolve true',
          codigo: js`igual(ehPalindromo('arara'), true, "ehPalindromo('arara')")`,
        },
        { descricao: 'Ignora maiúsculas: "Ana"', codigo: js`igual(ehPalindromo('Ana'), true, "ehPalindromo('Ana')")` },
        {
          descricao: 'Ignora espaços: "a sacada da casa"',
          codigo: js`igual(ehPalindromo('a sacada da casa'), true, "ehPalindromo('a sacada da casa')")`,
        },
        {
          descricao: 'ehPalindromo("casa") devolve false',
          codigo: js`igual(ehPalindromo('casa'), false, "ehPalindromo('casa')")`,
        },
        {
          descricao: 'ehPalindromo("ab") devolve false',
          codigo: js`igual(ehPalindromo('ab'), false, "ehPalindromo('ab')")`,
        },
      ],
      dicas: [
        'Deixe em minúsculas e tire os espaços: `texto.toLowerCase().replaceAll(" ", "")`.',
        'Para inverter, separe em letras, inverta a lista e junte: `split("").reverse().join("")`. Depois compare com `===`.',
      ],
      solucao: linhas(
        'function ehPalindromo(texto) {',
        '  const limpo = texto.toLowerCase().replaceAll(" ", "");',
        '  const invertido = limpo.split("").reverse().join("");',
        '  return limpo === invertido;',
        '}',
      ),
    },
    {
      titulo: 'Nome próprio',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `capitalizar(frase)`, que deixa a **primeira letra de cada palavra em maiúscula** e o resto em minúsculas. Por exemplo, `capitalizar("jOÃO da silva")` devolve `"João Da Silva"`. As palavras vêm separadas por um espaço só.',
        },
      ],
      codigoInicial: linhas('function capitalizar(frase) {', '  // trate cada palavra e junte de novo', '}', ''),
      testes: [
        {
          descricao: 'capitalizar("jOÃO da silva") devolve “João Da Silva”',
          codigo: js`igual(capitalizar('jOÃO da silva'), 'João Da Silva', "capitalizar('jOÃO da silva')")`,
        },
        {
          descricao: 'capitalizar("ana") devolve “Ana”',
          codigo: js`igual(capitalizar('ana'), 'Ana', "capitalizar('ana')")`,
        },
        {
          descricao: 'Tudo em maiúsculas vira só a inicial',
          codigo: js`igual(capitalizar('MARIA CLARA'), 'Maria Clara', "capitalizar('MARIA CLARA')")`,
        },
        {
          descricao: 'Palavras de uma letra só',
          codigo: js`igual(capitalizar('a b c'), 'A B C', "capitalizar('a b c')")`,
        },
      ],
      dicas: [
        'Separe as palavras e use `map`. Cada palavra vira `palavra[0].toUpperCase()` mais o resto.',
        'O resto da palavra é `palavra.slice(1).toLowerCase()`. No fim, `join(" ")`.',
      ],
      solucao: linhas(
        'function capitalizar(frase) {',
        '  return frase',
        '    .split(" ")',
        '    .map((palavra) => palavra[0].toUpperCase() + palavra.slice(1).toLowerCase())',
        '    .join(" ");',
        '}',
      ),
    },
    {
      titulo: 'Uma lista de convidados limpa',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `formatarConvidados(texto)`. Os nomes vêm separados por ponto e vírgula. Tire os espaços de cada nome, ignore as partes vazias e junte os convidados com vírgula seguida de espaço.',
        },
      ],
      codigoInicial: 'function formatarConvidados(texto) {\n  // separe, limpe, filtre e junte os nomes\n}\n',
      testes: [
        {
          descricao: 'Limpa os espaços e remove partes vazias',
          codigo: js`igual(formatarConvidados(' Ana ; ; Bia; Caio '), 'Ana, Bia, Caio', 'Convidados')`,
        },
        {
          descricao: 'Trata um nome só e ausência de nomes',
          codigo: js`igual(formatarConvidados('  Lia  '), 'Lia', 'Um nome'); igual(formatarConvidados(' ; ; '), '', 'Sem nomes')`,
        },
      ],
      dicas: ['Depois de split(";"), use map para trim, filter para excluir texto vazio e join(", ").'],
      solucao:
        'function formatarConvidados(texto) {\n  return texto.split(";").map((nome) => nome.trim()).filter((nome) => nome !== "").join(", ");\n}',
    },
    {
      titulo: 'Uma ficha a partir de uma linha',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `montarFicha(linha)`, que recebe três campos no formato `"nome;idade;cidade"` e devolve um objeto com nome, idade numérica e cidade. Tire os espaços das pontas do nome e da cidade. Considere entradas com os três campos e uma idade numérica válida.',
        },
      ],
      codigoInicial: 'function montarFicha(linha) {\n  // separe os campos e monte o objeto\n}\n',
      testes: [
        {
          descricao: 'Lê os três campos e converte a idade',
          codigo: js`igual(montarFicha(' Ana ; 25 ; Recife '), { nome: 'Ana', idade: 25, cidade: 'Recife' }, 'Ficha')`,
        },
        {
          descricao: 'Preserva uma idade igual a zero',
          codigo: js`igual(montarFicha('Bia;0;Natal'), { nome: 'Bia', idade: 0, cidade: 'Natal' }, 'Outra ficha')`,
        },
      ],
      dicas: ['Use split(";") e os índices 0, 1 e 2. Number converte o campo da idade para número.'],
      solucao:
        'function montarFicha(linha) {\n  const partes = linha.split(";");\n  return { nome: partes[0].trim(), idade: Number(partes[1]), cidade: partes[2].trim() };\n}',
    },
  ],
};
