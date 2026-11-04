import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const metodosDeTexto: Licao = {
  slug: 'metodos-de-texto',
  titulo: 'Ferramentas dos textos',
  resumo: 'trim, toLowerCase, includes, slice e replaceAll.',
  conteudo: [
    {
      tipo: 'p',
      texto: 'Todo texto vem com ferramentas prontas. Cada uma devolve um texto **novo**: o original nunca muda.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const frase = "  Aprendendo JavaScript  ";',
        'console.log(frase.trim());',
        'console.log(frase.trim().toLowerCase());',
        'console.log(frase);',
      ),
      saida: linhas('Aprendendo JavaScript', 'aprendendo javascript', '  Aprendendo JavaScript  '),
    },
    {
      tipo: 'p',
      texto:
        '`trim()` tira os espaços das pontas. `toLowerCase()` e `toUpperCase()` trocam as maiúsculas e minúsculas. Como cada uma devolve um texto, dá para encadear uma na outra.',
    },
    { tipo: 'p', texto: 'Para procurar dentro de um texto:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const email = "ana@exemplo.com";',
        'console.log(email.includes("@"));',
        'console.log(email.startsWith("ana"));',
        'console.log(email.endsWith(".com"));',
        'console.log(email.indexOf("@"));',
      ),
      saida: linhas('true', 'true', 'true', '3'),
    },
    {
      tipo: 'p',
      texto:
        '`includes`, `startsWith` e `endsWith` respondem `true` ou `false`. `indexOf` diz em que posição o pedaço começa (lembre: a contagem começa em zero) ou `-1` se ele não estiver lá.',
    },
    { tipo: 'p', texto: 'Para pegar um pedaço ou trocar partes:' },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const codigo = "ABC-1234";',
        'console.log(codigo.slice(0, 3));',
        'console.log(codigo.slice(4));',
        'console.log(codigo.replaceAll("-", " "));',
      ),
      saida: linhas('ABC', '1234', 'ABC 1234'),
    },
    {
      tipo: 'nota',
      texto:
        '`slice(início, fim)` inclui a posição de início e **não** inclui a do fim. Sem o segundo número, vai até o final do texto.',
    },
    {
      tipo: 'nota',
      texto:
        'Maiúsculas e minúsculas contam: `"JavaScript".includes("javascript")` dá `false`. Para ignorar a diferença, deixe os dois textos em minúsculas antes de comparar.',
      tom: 'cuidado',
    },
  ],
  exercicios: [
    {
      titulo: 'Normalizar e procurar',
      enunciado: [
        { tipo: 'p', texto: 'Escreva duas funções:' },
        {
          tipo: 'lista',
          itens: [
            '`normalizar(texto)` devolve o texto sem espaços nas pontas e todo em minúsculas.',
            '`temPalavra(texto, palavra)` devolve `true` se o texto contém a palavra, sem ligar para maiúsculas e minúsculas.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const texto = "  Aprendendo JavaScript  ";',
        'const palavra = "javascript";',
        '',
        'function normalizar(texto) {',
        '',
        '}',
        '',
        'function temPalavra(texto, palavra) {',
        '',
        '}',
        '',
        'console.log(normalizar(texto));',
        'console.log(temPalavra(texto, palavra));',
        '',
      ),
      testes: [
        {
          descricao: 'normalizar tira os espaços e as maiúsculas',
          codigo: js`igual(normalizar('  Olá MUNDO  '), 'olá mundo', "normalizar('  Olá MUNDO  ')")`,
        },
        {
          descricao: 'normalizar("JS") devolve “js”',
          codigo: js`igual(normalizar('JS'), 'js', "normalizar('JS')")`,
        },
        {
          descricao: 'temPalavra acha a palavra mesmo com maiúsculas diferentes',
          codigo: js`igual(temPalavra('Aprendendo JavaScript', 'javascript'), true, "temPalavra('Aprendendo JavaScript', 'javascript')")`,
        },
        {
          descricao: 'temPalavra devolve false quando a palavra não está lá',
          codigo: js`igual(temPalavra('Aprendendo JavaScript', 'python'), false, "temPalavra('Aprendendo JavaScript', 'python')")`,
        },
        {
          descricao: 'temPalavra também ignora a maiúscula da palavra procurada',
          codigo: js`igual(temPalavra('bom dia', 'DIA'), true, "temPalavra('bom dia', 'DIA')")`,
        },
      ],
      dicas: [
        'As duas ferramentas se encadeiam: `texto.trim().toLowerCase()`.',
        'Em `temPalavra`, deixe o texto e a palavra em minúsculas antes de usar `includes`.',
      ],
      solucao: linhas(
        'function normalizar(texto) {',
        '  return texto.trim().toLowerCase();',
        '}',
        '',
        'function temPalavra(texto, palavra) {',
        '  return texto.toLowerCase().includes(palavra.toLowerCase());',
        '}',
      ),
    },
    {
      titulo: 'O domínio do e-mail',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `dominio(email)`, que devolve tudo o que vem **depois** do `@`. Por exemplo, `dominio("ana@exemplo.com")` devolve `"exemplo.com"`.',
        },
      ],
      codigoInicial: linhas(
        'const email = "ana@exemplo.com";',
        '',
        'function dominio(email) {',
        '',
        '}',
        '',
        'console.log(dominio(email));',
        '',
      ),
      testes: [
        {
          descricao: 'dominio("ana@exemplo.com") devolve “exemplo.com”',
          codigo: js`igual(dominio('ana@exemplo.com'), 'exemplo.com', "dominio('ana@exemplo.com')")`,
        },
        {
          descricao: 'dominio("x@y.br") devolve “y.br”',
          codigo: js`igual(dominio('x@y.br'), 'y.br', "dominio('x@y.br')")`,
        },
        {
          descricao: 'Funciona com um nome de usuário longo',
          codigo: js`igual(dominio('maria.clara.souza@empresa.com.br'), 'empresa.com.br', 'dominio com nome longo')`,
        },
      ],
      dicas: [
        'A posição do `@` é `email.indexOf("@")`. O domínio começa **uma posição depois**.',
        'Resposta: `email.slice(email.indexOf("@") + 1)`.',
      ],
      solucao: linhas('function dominio(email) {', '  return email.slice(email.indexOf("@") + 1);', '}'),
    },
    {
      titulo: 'Limpando um código',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `limparCodigo(codigo)`, que tira os espaços das pontas, deixa tudo em maiúsculas e remove **todos** os traços. Por exemplo, `limparCodigo("  abc-12-34 ")` devolve `"ABC1234"`.',
        },
      ],
      codigoInicial: linhas(
        'const codigo = "  abc-12-34 ";',
        '',
        'function limparCodigo(codigo) {',
        '',
        '}',
        '',
        'console.log(limparCodigo(codigo));',
        '',
      ),
      testes: [
        {
          descricao: 'limparCodigo("  abc-12-34 ") devolve “ABC1234”',
          codigo: js`igual(limparCodigo('  abc-12-34 '), 'ABC1234', "limparCodigo('  abc-12-34 ')")`,
        },
        {
          descricao: 'Remove todos os traços, e não só o primeiro',
          codigo: js`igual(limparCodigo('a-b-c-d'), 'ABCD', "limparCodigo('a-b-c-d')")`,
        },
        {
          descricao: 'Um código já limpo continua igual',
          codigo: js`igual(limparCodigo('XY99'), 'XY99', "limparCodigo('XY99')")`,
        },
        {
          descricao: 'Só traços, entre espaços, viram texto vazio',
          codigo: js`igual(limparCodigo(' -- '), '', "limparCodigo(' -- ')")`,
        },
      ],
      dicas: [
        'Use `trim()`, `toUpperCase()` e `replaceAll("-", "")`, uma depois da outra.',
        'Remover é trocar por um texto vazio: `replaceAll("-", "")`.',
      ],
      solucao: linhas(
        'function limparCodigo(codigo) {',
        '  return codigo.trim().toUpperCase().replaceAll("-", "");',
        '}',
      ),
    },
    {
      titulo: 'É uma imagem?',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `ehImagem(nomeDoArquivo)`, que devolve `true` se o nome termina em `.png`, `.jpg` ou `.gif`, sem ligar para maiúsculas e minúsculas. Por exemplo, `ehImagem("Foto.PNG")` devolve `true` e `ehImagem("notas.pdf")` devolve `false`.',
        },
      ],
      codigoInicial: linhas(
        'const nomeDoArquivo = "foto.png";',
        '',
        'function ehImagem(nomeDoArquivo) {',
        '',
        '}',
        '',
        'console.log(ehImagem(nomeDoArquivo));',
        '',
      ),
      testes: [
        {
          descricao: 'ehImagem("foto.png") devolve true',
          codigo: js`igual(ehImagem('foto.png'), true, "ehImagem('foto.png')")`,
        },
        {
          descricao: 'Ignora maiúsculas: "Foto.PNG"',
          codigo: js`igual(ehImagem('Foto.PNG'), true, "ehImagem('Foto.PNG')")`,
        },
        {
          descricao: 'ehImagem("a.jpg") e ehImagem("b.gif") devolvem true',
          codigo: js`igual(ehImagem('a.jpg'), true, "ehImagem('a.jpg')");
igual(ehImagem('b.gif'), true, "ehImagem('b.gif')")`,
        },
        {
          descricao: 'ehImagem("notas.pdf") devolve false',
          codigo: js`igual(ehImagem('notas.pdf'), false, "ehImagem('notas.pdf')")`,
        },
        { descricao: 'Sem o ponto, não é imagem: "png"', codigo: js`igual(ehImagem('png'), false, "ehImagem('png')")` },
        {
          descricao: 'A extensão precisa estar no final: "foto.png.txt"',
          codigo: js`igual(ehImagem('foto.png.txt'), false, "ehImagem('foto.png.txt')")`,
        },
      ],
      dicas: [
        'Deixe o nome em minúsculas e use `endsWith(".png")`.',
        'São três extensões possíveis, ligadas por `||`.',
      ],
      solucao: linhas(
        'function ehImagem(nomeDoArquivo) {',
        '  const nome = nomeDoArquivo.toLowerCase();',
        '  return nome.endsWith(".png") || nome.endsWith(".jpg") || nome.endsWith(".gif");',
        '}',
      ),
    },
    {
      titulo: 'Resumindo um texto longo',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `resumir(texto, limite)`. Se o texto tem **mais** caracteres que o `limite`, devolva só os primeiros `limite` caracteres seguidos de `...`. Se não, devolva o texto inteiro. Por exemplo, `resumir("JavaScript", 4)` devolve `"Java..."`.',
        },
      ],
      codigoInicial: linhas(
        'const texto = "JavaScript";',
        'const limite = 4;',
        '',
        'function resumir(texto, limite) {',
        '',
        '}',
        '',
        'console.log(resumir(texto, limite));',
        '',
      ),
      testes: [
        {
          descricao: 'resumir("JavaScript", 4) devolve “Java...”',
          codigo: js`igual(resumir('JavaScript', 4), 'Java...', "resumir('JavaScript', 4)")`,
        },
        { descricao: 'Um texto curto não muda', codigo: js`igual(resumir('Oi', 4), 'Oi', "resumir('Oi', 4)")` },
        {
          descricao: 'Um texto com exatamente o limite não muda',
          codigo: js`igual(resumir('abcd', 4), 'abcd', "resumir('abcd', 4)")`,
        },
        {
          descricao: 'Um caractere acima do limite corta',
          codigo: js`igual(resumir('abcde', 4), 'abcd...', "resumir('abcde', 4)")`,
        },
        {
          descricao: 'Funciona com frases',
          codigo: js`igual(resumir('Bom dia, pessoal', 7), 'Bom dia...', "resumir('Bom dia, pessoal', 7)")`,
        },
      ],
      dicas: [
        'Primeiro um `if`: o corte só vale quando `texto.length > limite`.',
        'O pedaço é `texto.slice(0, limite)`; some `"..."` no fim.',
      ],
      solucao: linhas(
        'function resumir(texto, limite) {',
        '  if (texto.length > limite) {',
        '    return texto.slice(0, limite) + "...";',
        '  }',
        '  return texto;',
        '}',
      ),
    },
    {
      titulo: 'Comparar nomes normalizados',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `mesmoNome(a, b)`, que compara dois nomes ignorando espaços nas pontas e diferenças entre maiúsculas e minúsculas. Não remova acentos nem espaços do meio.',
        },
      ],
      codigoInicial: linhas(
        'const a = "  aNA ";',
        'const b = "Ana";',
        '',
        'function mesmoNome(a, b) {',
        '',
        '}',
        '',
        'console.log(mesmoNome(a, b));',
        '',
      ),
      testes: [
        {
          descricao: 'Ignora espaços externos e diferenças de caixa',
          codigo: js`igual(mesmoNome('  aNA ', 'Ana'), true, 'Mesmo nome'); igual(mesmoNome('BIA', 'bia '), true, 'Caixa diferente')`,
        },
        {
          descricao: 'Não transforma nomes diferentes em iguais',
          codigo: js`igual(mesmoNome('Ana Maria', 'AnaMaria'), false, 'Espaço interno importa'); igual(mesmoNome('João', 'Joao'), false, 'Acento importa')`,
        },
      ],
      dicas: ['Aplique trim e toLowerCase nos dois nomes, depois compare com ===.'],
      solucao: 'function mesmoNome(a, b) {\n  return a.trim().toLowerCase() === b.trim().toLowerCase();\n}',
    },
    {
      titulo: 'Reconhecer a etiqueta do pedido',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `ehEtiquetaPedido(texto)`. Depois de tirar espaços externos e converter para maiúsculas, a etiqueta deve começar com `"PED-"` e ter exatamente 8 caracteres no total. Neste exercício, confira apenas o prefixo e o tamanho, sem validar o tipo dos quatro caracteres finais.',
        },
      ],
      codigoInicial: linhas(
        'const texto = " ped-ab12 ";',
        '',
        'function ehEtiquetaPedido(texto) {',
        '',
        '}',
        '',
        'console.log(ehEtiquetaPedido(texto));',
        '',
      ),
      testes: [
        {
          descricao: 'Reconhece etiquetas normalizadas',
          codigo: js`igual(ehEtiquetaPedido(' ped-ab12 '), true, 'Letras e números'); igual(ehEtiquetaPedido('PED-1234'), true, 'Quatro dígitos')`,
        },
        {
          descricao: 'Recusa prefixo ou tamanho incorreto',
          codigo: js`igual(ehEtiquetaPedido('PAG-1234'), false, 'Outro prefixo'); igual(ehEtiquetaPedido('PED-123'), false, 'Curta'); igual(ehEtiquetaPedido('PED-12345'), false, 'Longa')`,
        },
      ],
      dicas: ['Guarde o texto normalizado e combine startsWith com uma comparação de length.'],
      solucao:
        'function ehEtiquetaPedido(texto) {\n  const etiqueta = texto.trim().toUpperCase();\n  return etiqueta.startsWith("PED-") && etiqueta.length === 8;\n}',
    },
  ],
};
