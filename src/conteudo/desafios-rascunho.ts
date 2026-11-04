export interface DesafioRascunho {
  id: string;
  categoria: string;
  modo: 'javascript' | 'web';
  titulo: string;
  enunciado: string;
  dados: string;
  passos: [string, string][];
  resultado: string;
  extra: string;
}

export const DESAFIOS_RASCUNHO: DesafioRascunho[] = [
  {
    id: 'maior-numero',
    categoria: 'Arrays',
    modo: 'javascript',
    titulo: 'Encontre o maior número',
    enunciado:
      'Receba um array não vazio de números e devolva o maior valor. Compare os elementos com um laço, sem Math.max ou ordenação.',
    dados: 'const numeros = [12, 5, 24, 8, 19, 3, 16, 10];',
    passos: [
      ['Crie o array.', 'Copie os 8 números do exemplo para uma variável numeros.'],
      ['Crie uma função.', 'Chame de encontrarMaior e receba o array no parâmetro lista.'],
      [
        'Escolha um valor inicial.',
        'Guarde lista[0] em uma variável maior. Assim, números negativos também funcionam.',
      ],
      ['Percorra o restante.', 'Use for a partir do segundo elemento e compare cada número com maior.'],
      [
        'Atualize e devolva.',
        'Se o número atual for maior, atualize a variável. Depois do laço, devolva maior com return.',
      ],
      ['Experimente.', 'Mostre console.log(encontrarMaior(numeros)) e clique em Rodar.'],
    ],
    resultado: '24',
    extra: 'Teste [-8, -2, -15], [7, 7, 3] e [5]. Espere -2, 7 e 5, respectivamente.',
  },
  {
    id: 'somar-array',
    categoria: 'Arrays',
    modo: 'javascript',
    titulo: 'Some os números do array',
    enunciado: 'Crie uma função que receba uma lista de números e devolva a soma de todos eles usando um laço.',
    dados: 'const numeros = [10, 20, 5, 15];',
    passos: [
      ['Prepare os números.', 'Crie numeros com os 4 valores do exemplo.'],
      ['Receba a lista.', 'Crie a função somarNumeros(lista).'],
      ['Prepare o acumulador.', 'Dentro da função, crie uma variável total começando em zero.'],
      ['Acumule os valores.', 'Percorra a lista e acrescente cada número a total.'],
      ['Devolva e teste.', 'Após o laço, retorne total. Chame console.log(somarNumeros(numeros)).'],
    ],
    resultado: '50',
    extra: 'Uma lista vazia deve devolver 0. Com [-5, 10], o resultado deve ser 5.',
  },
  {
    id: 'filtrar-pares',
    categoria: 'Arrays',
    modo: 'javascript',
    titulo: 'Separe os números pares',
    enunciado:
      'Receba um array e devolva um novo array contendo apenas os números pares, sem alterar a lista original.',
    dados: 'const numeros = [3, 8, 11, 14, 0, 7, -2];',
    passos: [
      ['Crie os dados.', 'Use o array numeros do exemplo.'],
      ['Crie a função.', 'Defina selecionarPares(lista) e prepare um array vazio chamado pares.'],
      ['Visite cada número.', 'Percorra a lista com for ou for...of.'],
      ['Verifique o resto.', 'Um número é par quando o resto da divisão por 2 é zero. Use o operador %.'],
      ['Guarde os pares.', 'Adicione ao novo array com push apenas os números que passam na comparação.'],
      ['Mostre a nova lista.', 'Retorne pares e execute console.log(selecionarPares(numeros)).'],
    ],
    resultado: '[8, 14, 0, -2]',
    extra: 'Teste [1, 3, 5] e []. Nos dois casos, espere um array vazio.',
  },
  {
    id: 'media-array',
    categoria: 'Arrays',
    modo: 'javascript',
    titulo: 'Calcule a média das notas',
    enunciado: 'Crie uma função que receba um array não vazio de notas e devolva a média aritmética.',
    dados: 'const notas = [7, 8, 6, 9];',
    passos: [
      ['Prepare as notas.', 'Crie o array notas com os valores do exemplo.'],
      ['Receba os dados.', 'Defina calcularMedia(lista).'],
      ['Some as notas.', 'Crie um acumulador em zero e some os valores com um laço.'],
      ['Conte os elementos.', 'Use a propriedade length da lista para saber quantas notas existem.'],
      ['Calcule e devolva.', 'Divida a soma pela quantidade e retorne o resultado.'],
      ['Confira a saída.', 'Execute console.log(calcularMedia(notas)).'],
    ],
    resultado: '7.5',
    extra: 'Teste [10] e [0, 0]. Espere 10 e 0. Pense em como tratar uma lista vazia antes de dividir.',
  },
  {
    id: 'inverter-texto',
    categoria: 'Textos',
    modo: 'javascript',
    titulo: 'Inverta uma palavra',
    enunciado: 'Receba uma palavra e devolva seus caracteres na ordem inversa. Para praticar laços, não use reverse.',
    dados: 'const palavra = "javascript";',
    passos: [
      ['Crie o texto.', 'Declare palavra com o texto do exemplo.'],
      ['Crie a função.', 'Defina inverterTexto(texto) e prepare uma string vazia chamada invertido.'],
      ['Comece pelo final.', 'O índice do último caractere é texto.length - 1.'],
      [
        'Volte um caractere por vez.',
        'Use um for decrescente até o índice zero e acrescente cada caractere a invertido.',
      ],
      ['Retorne e execute.', 'Devolva invertido e chame console.log(inverterTexto(palavra)).'],
    ],
    resultado: 'tpircsavaj',
    extra: 'Teste "ovo", "a" e uma string vazia. Espere "ovo", "a" e "".',
  },
  {
    id: 'contar-vogais',
    categoria: 'Textos',
    modo: 'javascript',
    titulo: 'Conte as vogais',
    enunciado:
      'Conte quantas vogais a, e, i, o, u existem em um texto sem acentos. Considere letras maiúsculas e minúsculas.',
    dados: 'const texto = "Aprender JavaScript";',
    passos: [
      ['Prepare a frase.', 'Crie texto com o exemplo.'],
      ['Crie a função.', 'Defina contarVogais(frase) e inicie um contador em zero.'],
      ['Normalize as letras.', 'Use toLowerCase para comparar maiúsculas e minúsculas da mesma maneira.'],
      ['Percorra os caracteres.', 'Para cada letra, verifique se ela está na string "aeiou" usando includes.'],
      ['Conte as ocorrências.', 'Aumente o contador somente quando a letra for uma vogal.'],
      ['Devolva e teste.', 'Retorne o contador e execute console.log(contarVogais(texto)).'],
    ],
    resultado: '6',
    extra: 'Teste "AEIOU", "rhythm" e "". Espere 5, 0 e 0.',
  },
  {
    id: 'tabuada',
    categoria: 'Números e laços',
    modo: 'javascript',
    titulo: 'Monte uma tabuada',
    enunciado: 'Receba um número e devolva um array com os resultados de sua multiplicação por 1 até 10.',
    dados: 'const numero = 7;',
    passos: [
      ['Escolha o número.', 'Declare numero com o valor 7.'],
      ['Prepare a função.', 'Crie gerarTabuada(valor) e um array vazio para os resultados.'],
      ['Conte de 1 a 10.', 'Use um laço for incluindo o número 10.'],
      ['Multiplique e guarde.', 'Em cada volta, multiplique valor pelo contador e use push para guardar o produto.'],
      ['Devolva a tabuada.', 'Retorne o array depois do laço e chame console.log(gerarTabuada(numero)).'],
    ],
    resultado: '[7, 14, 21, 28, 35, 42, 49, 56, 63, 70]',
    extra: 'Experimente 0 e -3. A lista deve continuar tendo exatamente 10 resultados.',
  },
  {
    id: 'fatorial',
    categoria: 'Números e laços',
    modo: 'javascript',
    titulo: 'Calcule o fatorial',
    enunciado:
      'Receba um inteiro entre 0 e 10 e devolva o produto dos inteiros de 1 até ele. Lembre que o fatorial de 0 é 1.',
    dados: 'const numero = 5;',
    passos: [
      ['Crie a entrada.', 'Declare numero com o valor 5.'],
      ['Crie a função.', 'Defina calcularFatorial(valor).'],
      ['Prepare o produto.', 'Inicie uma variável resultado em 1, pois multiplicar por zero apagaria o produto.'],
      ['Multiplique em sequência.', 'Use for de 1 até valor e multiplique resultado pelo contador em cada volta.'],
      ['Devolva e teste.', 'Retorne resultado após o laço e execute console.log(calcularFatorial(numero)).'],
    ],
    resultado: '120',
    extra: 'Teste 0, 1 e 4. Espere 1, 1 e 24.',
  },
  {
    id: 'total-carrinho',
    categoria: 'Objetos',
    modo: 'javascript',
    titulo: 'Some o total do carrinho',
    enunciado:
      'Receba uma lista de produtos e calcule o valor total, levando em conta o preço e a quantidade de cada item.',
    dados:
      'const carrinho = [\n  { nome: "Caderno", preco: 15, quantidade: 2 },\n  { nome: "Caneta", preco: 3, quantidade: 4 }\n];',
    passos: [
      ['Crie a lista de objetos.', 'Copie carrinho com os produtos, preços e quantidades.'],
      ['Receba os produtos.', 'Crie totalDoCarrinho(itens) e inicie total em zero.'],
      ['Percorra os itens.', 'Use for...of para acessar um objeto por vez.'],
      ['Calcule cada subtotal.', 'Multiplique preco por quantidade e some o valor a total.'],
      ['Devolva e confira.', 'Retorne total e execute console.log(totalDoCarrinho(carrinho)).'],
    ],
    resultado: '42',
    extra: 'Teste um carrinho vazio (0) e um produto com quantidade zero (subtotal 0).',
  },
  {
    id: 'alunos-aprovados',
    categoria: 'Objetos',
    modo: 'javascript',
    titulo: 'Liste os alunos aprovados',
    enunciado: 'Receba uma lista de alunos e devolva apenas os nomes daqueles com nota maior ou igual a 7.',
    dados:
      'const alunos = [\n  { nome: "Ana", nota: 8 },\n  { nome: "Bruno", nota: 5 },\n  { nome: "Carla", nota: 7 }\n];',
    passos: [
      ['Prepare os alunos.', 'Crie alunos com os três objetos do exemplo.'],
      ['Crie a função.', 'Defina listarAprovados(turma) e prepare um array vazio de nomes.'],
      ['Leia as notas.', 'Percorra a turma e consulte a propriedade nota de cada aluno.'],
      ['Selecione os aprovados.', 'Use if para verificar nota maior ou igual a 7 e guarde apenas o nome.'],
      ['Devolva os nomes.', 'Retorne o array e execute console.log(listarAprovados(alunos)).'],
    ],
    resultado: '["Ana", "Carla"]',
    extra: 'Confira que nota 7 aprova e nota 6.9 não aprova. Uma turma vazia deve devolver [].',
  },
  {
    id: 'buscar-produto',
    categoria: 'Objetos',
    modo: 'javascript',
    titulo: 'Busque um produto pelo código',
    enunciado:
      'Receba uma lista de produtos e um código. Devolva o objeto correspondente ou null quando o código não existir.',
    dados:
      'const produtos = [\n  { codigo: 101, nome: "Teclado" },\n  { codigo: 102, nome: "Mouse" }\n];\nconst codigoProcurado = 102;',
    passos: [
      ['Prepare a busca.', 'Crie produtos e codigoProcurado com os dados do exemplo.'],
      ['Receba os dois argumentos.', 'Defina buscarProduto(lista, codigo).'],
      ['Percorra os produtos.', 'Use um laço e compare o codigo de cada objeto com o argumento usando ===.'],
      ['Retorne o produto encontrado.', 'Quando a comparação for verdadeira, retorne o objeto atual.'],
      [
        'Trate a ausência.',
        'Depois do laço, retorne null. Faça isso fora do laço para não encerrar a busca antes da hora.',
      ],
      ['Execute a busca.', 'Mostre console.log(buscarProduto(produtos, codigoProcurado)).'],
    ],
    resultado: '{ codigo: 102, nome: "Mouse" }',
    extra: 'Busque o código 101 e depois 999. Espere o Teclado e null, respectivamente.',
  },
  {
    id: 'estoque-baixo',
    categoria: 'Objetos',
    modo: 'javascript',
    titulo: 'Identifique o estoque baixo',
    enunciado:
      'Receba produtos e um limite de estoque. Devolva os nomes dos produtos com quantidade menor que o limite.',
    dados:
      'const estoque = [\n  { nome: "Lápis", quantidade: 2 },\n  { nome: "Caderno", quantidade: 10 },\n  { nome: "Borracha", quantidade: 0 }\n];\nconst limite = 5;',
    passos: [
      ['Crie os dados.', 'Copie estoque e limite do exemplo.'],
      ['Prepare a função.', 'Defina listarEstoqueBaixo(produtos, minimo) e crie um array vazio.'],
      ['Verifique cada quantidade.', 'Percorra os produtos e compare quantidade com minimo.'],
      ['Guarde os nomes.', 'Adicione ao novo array o nome de cada produto cuja quantidade seja menor que minimo.'],
      ['Mostre os itens.', 'Retorne a lista e chame console.log(listarEstoqueBaixo(estoque, limite)).'],
    ],
    resultado: '["Lápis", "Borracha"]',
    extra: 'Um item com quantidade igual ao limite não entra. Teste também limite 0 e uma lista vazia.',
  },
  {
    id: 'contador-cliques',
    categoria: 'DOM e eventos',
    modo: 'web',
    titulo: 'Crie um contador de cliques',
    enunciado: 'Monte uma página com um número e um botão. Cada clique deve aumentar o número mostrado na tela.',
    dados: '<p id="contador">0</p>\n<button id="somar" type="button">Somar 1</button>',
    passos: [
      ['Prepare o HTML.', 'Na aba HTML, crie o parágrafo e o botão do exemplo.'],
      ['Selecione os elementos.', 'Na aba JavaScript, use document.querySelector para obter #contador e #somar.'],
      ['Guarde o valor.', 'Declare uma variável de contagem começando em zero.'],
      ['Escute os cliques.', 'Adicione um evento click ao botão com addEventListener.'],
      ['Atualize a tela.', 'Dentro do evento, aumente a contagem e coloque o novo valor no textContent do parágrafo.'],
      ['Execute e interaja.', 'Clique em Rodar para abrir a prévia e depois clique no botão dentro dela.'],
    ],
    resultado: 'O contador começa em 0. Depois de três cliques, mostra 3.',
    extra: 'Adicione um segundo botão para zerar o contador. Atualize tanto a variável quanto o texto.',
  },
  {
    id: 'lista-tarefas',
    categoria: 'DOM e eventos',
    modo: 'web',
    titulo: 'Adicione tarefas a uma lista',
    enunciado: 'Crie um campo de texto, um botão e uma lista. Ao clicar no botão, adicione a tarefa digitada à lista.',
    dados:
      '<label for="tarefa">Nova tarefa</label>\n<input id="tarefa" type="text">\n<button id="adicionar" type="button">Adicionar</button>\n<ul id="tarefas"></ul>',
    passos: [
      ['Monte o HTML.', 'Crie o campo com seu label, o botão e a lista vazia do exemplo na aba HTML.'],
      ['Selecione os três elementos.', 'No JavaScript, obtenha #tarefa, #adicionar e #tarefas com querySelector.'],
      ['Leia o texto no clique.', 'Adicione um evento click ao botão e consulte o value do campo usando trim.'],
      ['Ignore textos vazios.', 'Se o texto estiver vazio após trim, encerre o evento sem criar uma tarefa.'],
      [
        'Crie o item.',
        'Use document.createElement("li"), coloque o texto em textContent e adicione o item à lista com append.',
      ],
      ['Limpe e teste.', 'Esvazie o campo. Clique em Rodar e adicione duas tarefas na prévia.'],
    ],
    resultado: 'Cada tarefa aparece em um item da lista. Texto vazio ou apenas espaços não cria itens.',
    extra: 'Dê foco ao campo após adicionar e permita marcar uma tarefa como concluída ao clicar nela.',
  },
  {
    id: 'mostrar-senha',
    categoria: 'DOM e eventos',
    modo: 'web',
    titulo: 'Mostre e esconda uma senha',
    enunciado:
      'Crie um campo de senha e um botão que alterne entre mostrar e esconder seu conteúdo. Use apenas uma senha fictícia.',
    dados:
      '<label for="senha">Senha de exemplo</label>\n<input id="senha" type="password" value="exemplo123">\n<button id="alternar" type="button" aria-pressed="false">Mostrar senha</button>',
    passos: [
      ['Prepare a página.', 'Na aba HTML, crie o campo e o botão com os dados fictícios do exemplo.'],
      ['Encontre os elementos.', 'No JavaScript, selecione #senha e #alternar.'],
      ['Escute o botão.', 'Adicione um evento click com addEventListener.'],
      ['Alterne o tipo.', 'Se o type do campo for password, mude para text. Caso contrário, volte para password.'],
      [
        'Atualize o botão.',
        'Mude textContent para "Esconder senha" quando visível e "Mostrar senha" quando oculta. Atualize aria-pressed para "true" ou "false" com setAttribute.',
      ],
      ['Confira na prévia.', 'Clique em Rodar e teste vários cliques para verificar as duas direções.'],
    ],
    resultado: 'O primeiro clique revela exemplo123 e o segundo volta a esconder os caracteres.',
    extra: 'Teste o botão usando Tab e Enter. O texto do botão deve sempre indicar a próxima ação.',
  },
  {
    id: 'saudacao-pagina',
    categoria: 'DOM e eventos',
    modo: 'web',
    titulo: 'Exiba uma saudação personalizada',
    enunciado: 'Crie um formulário que leia um nome e mostre uma saudação sem recarregar a página.',
    dados:
      '<form id="formulario">\n  <label for="nome">Seu nome</label>\n  <input id="nome" type="text">\n  <button type="submit">Cumprimentar</button>\n</form>\n<p id="mensagem" aria-live="polite"></p>',
    passos: [
      ['Monte o formulário.', 'Na aba HTML, crie o formulário e o parágrafo do exemplo.'],
      ['Selecione os elementos.', 'No JavaScript, obtenha #formulario, #nome e #mensagem.'],
      ['Escute o envio.', 'Adicione um evento submit ao formulário e receba evento como argumento da função.'],
      ['Evite recarregar.', 'Chame evento.preventDefault() dentro do evento.'],
      ['Leia e valide o nome.', 'Consulte value do campo com trim. Se vazio, mostre uma mensagem pedindo um nome.'],
      [
        'Escreva a saudação.',
        'Caso exista um nome, atualize textContent do parágrafo com "Olá, " seguido do nome e "!". Clique em Rodar e envie o formulário na prévia.',
      ],
    ],
    resultado: 'Ao enviar Ana, a página mostra "Olá, Ana!" sem recarregar.',
    extra: 'Envie o formulário com Enter e teste um nome com espaços nas pontas e um campo vazio.',
  },
];
