import type { DocumentoWeb } from '@/engine/documento';
import type { Licao, Trilha } from '../../tipos';

const css =
  'h1 { color: #244c9b; }\nbutton { padding: 10px 16px; border: 1px solid #244c9b; border-radius: 6px; }\ninput { padding: 10px; margin: 8px 0; }\n.destaque { background: #fff4ad; padding: 12px; }\n.concluida { text-decoration: line-through; }\nli { margin: 10px 0; }';
const pagina = (html: string): DocumentoWeb => ({ html, css });
const nota = {
  tipo: 'nota' as const,
  texto:
    'HTML monta os elementos, CSS define a aparência e JavaScript muda o comportamento. Explore as três abas. Use Rodar para atualizar a prévia; Conferir reinicia a página e simula interações para avaliar sua solução.',
};

const selecionar: Licao = {
  slug: 'selecionar-elementos',
  titulo: 'Encontre um elemento na página',
  resumo: 'O DOM, document e querySelector.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'O navegador transforma o HTML em uma árvore de objetos: o **DOM**. Cada título, botão e parágrafo é um elemento que o JavaScript pode encontrar e alterar.',
    },
    {
      tipo: 'p',
      texto:
        '`document.querySelector("#titulo")` encontra o elemento com `id="titulo"`. O ponto seleciona uma classe, como `.aviso`; sem sinal, o nome da tag, como `h1`. Se não houver correspondência, o resultado é `null`.',
    },
    {
      tipo: 'p',
      texto:
        'Guarde o elemento em uma variável. Depois, atribua um texto à propriedade `textContent`, como em `elemento.textContent = "Novo texto"`.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Um novo título',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Selecione `#titulo` e troque seu texto para `"Olá, DOM!"`. Preserve o elemento original.',
        },
      ],
      codigoInicial: '// Encontre o título e altere seu textContent.\n',
      documentoInicial: pagina('<h1 id="titulo">Minha página</h1><p>Esta é sua primeira alteração no DOM.</p>'),
      testes: [
        {
          descricao: 'O título original mostra Olá, DOM!',
          codigo: 'igual(document.querySelector("#titulo")?.textContent, "Olá, DOM!");',
        },
      ],
      dicas: [
        'O seletor de um id começa com `#`.',
        'Guarde o resultado de `document.querySelector("#titulo")` em uma constante e altere `textContent`.',
      ],
      solucao: 'const titulo = document.querySelector("#titulo");\ntitulo.textContent = "Olá, DOM!";',
    },
  ],
};

const varios: Licao = {
  slug: 'selecionar-varios',
  titulo: 'Uma mudança em vários elementos',
  resumo: 'querySelectorAll e iteração sobre elementos.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`querySelector` encontra somente o primeiro elemento. `document.querySelectorAll(".item")` encontra todos os elementos que têm a classe `item` e devolve uma lista que você pode percorrer com `forEach` ou `for...of`.',
    },
    {
      tipo: 'p',
      texto:
        'Cada item da lista é um elemento de verdade. Você pode ler o texto atual e substituí-lo. A seleção é um retrato daquele momento: elementos criados depois exigem uma nova consulta.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Três avisos',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Encontre todos os elementos `.item` e mude o texto de cada um para `"Pronto para estudar"`. Não remova nenhum dos três itens.',
        },
      ],
      codigoInicial: '// Percorra os elementos que têm a classe item.\n',
      documentoInicial: pagina(
        '<ul><li class="item">HTML</li><li class="item">CSS</li><li class="item">JavaScript</li></ul>',
      ),
      testes: [
        {
          descricao: 'Os três itens recebem o novo texto',
          codigo:
            'const itens = [...document.querySelectorAll(".item")]; verdadeiro(itens.length === 3 && itens.every(item => item.textContent === "Pronto para estudar"));',
        },
      ],
      dicas: [
        'Use `querySelectorAll` com o seletor `.item`.',
        'Dentro de `forEach`, altere o `textContent` do elemento recebido.',
      ],
      solucao:
        'const itens = document.querySelectorAll(".item");\nitens.forEach(item => {\n  item.textContent = "Pronto para estudar";\n});',
    },
  ],
};

const atributos: Licao = {
  slug: 'textos-estilos-atributos',
  titulo: 'Textos, estilos e atributos',
  resumo: 'style e setAttribute para mudar a interface.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Além de `textContent`, um elemento expõe propriedades de aparência e comportamento. `elemento.style.color = "blue"` muda a cor; `elemento.setAttribute("aria-label", "Descrição")` altera um atributo.',
    },
    {
      tipo: 'p',
      texto:
        'Para textos enviados por pessoas, prefira `textContent`. Ele trata a entrada como texto, sem interpretá-la como HTML. Para estilos reutilizáveis, vamos usar classes na próxima lição.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Aviso acessível',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Em `#aviso`, escreva `"Salvo com sucesso"`, defina `style.color` como `"green"` e o atributo `role` como `"status"`.',
        },
      ],
      codigoInicial: '// Atualize o texto, a cor e o papel do aviso.\n',
      documentoInicial: pagina('<p id="aviso">Ainda não salvo</p>'),
      testes: [
        {
          descricao: 'O aviso informa que foi salvo',
          codigo: 'igual(document.querySelector("#aviso")?.textContent, "Salvo com sucesso");',
        },
        {
          descricao: 'A cor do aviso é verde',
          codigo: 'igual(document.querySelector("#aviso")?.style.color, "green");',
        },
        {
          descricao: 'O aviso pode ser identificado como status',
          codigo: 'igual(document.querySelector("#aviso")?.getAttribute("role"), "status");',
        },
      ],
      dicas: [
        'Encontre o parágrafo pelo id `aviso`.',
        'Use `textContent`, `style.color` e `setAttribute` no mesmo elemento.',
      ],
      solucao:
        'const aviso = document.querySelector("#aviso");\naviso.textContent = "Salvo com sucesso";\naviso.style.color = "green";\naviso.setAttribute("role", "status");',
    },
  ],
};

const classes: Licao = {
  slug: 'classes-css',
  titulo: 'A aparência muda com classes',
  resumo: 'classList.add, remove e toggle.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'O CSS descreve a aparência de uma classe; o JavaScript decide quando aplicá-la. `elemento.classList.add("destaque")` adiciona uma classe e `remove("destaque")` a retira, preservando as outras.',
    },
    {
      tipo: 'p',
      texto:
        '`toggle("destaque")` alterna: adiciona quando não existe e remove quando já existe. Escreva o nome da classe sem o ponto; o ponto é usado apenas no seletor CSS.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Destaque do cartão',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Adicione a classe `destaque` a `#cartao` e remova a classe `apagado`. Preserve a classe `cartao` que já existe.',
        },
      ],
      codigoInicial: '// Use classList para ajustar as classes do cartão.\n',
      documentoInicial: pagina(
        '<article id="cartao" class="cartao apagado"><h2>Estudar DOM</h2><p>Uma pequena conquista por dia.</p></article>',
      ),
      testes: [
        {
          descricao: 'O cartão recebe destaque, perde apagado e mantém cartao',
          codigo:
            'const cartao = document.querySelector("#cartao"); verdadeiro(cartao?.classList.contains("destaque") && !cartao.classList.contains("apagado") && cartao.classList.contains("cartao"));',
        },
      ],
      dicas: [
        'Use o id para encontrar o cartão.',
        'Adicione `destaque` com `classList.add` e retire `apagado` com `classList.remove`.',
      ],
      solucao:
        'const cartao = document.querySelector("#cartao");\ncartao.classList.add("destaque");\ncartao.classList.remove("apagado");',
    },
  ],
};

const criar: Licao = {
  slug: 'criar-elementos',
  titulo: 'Crie e adicione elementos',
  resumo: 'createElement, textContent e append.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`document.createElement("li")` cria um elemento que ainda não aparece na página. Defina seu texto e use `lista.append(novoItem)` para inseri-lo no final de uma lista.',
    },
    {
      tipo: 'p',
      texto:
        '`elemento.remove()` retira um elemento. Criar cada parte com `createElement` e `textContent` evita transformar uma entrada da pessoa em código HTML.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Mais um assunto',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie um novo `li` com o texto `"Eventos"` e acrescente-o ao final de `#assuntos`, preservando os dois itens existentes.',
        },
      ],
      codigoInicial: '// Crie o novo item e acrescente-o à lista.\n',
      documentoInicial: pagina('<ul id="assuntos"><li>HTML</li><li>DOM</li></ul>'),
      testes: [
        {
          descricao: 'A lista termina com Eventos e preserva os assuntos anteriores',
          codigo:
            'igual([...document.querySelectorAll("#assuntos > li")].map(item => item.textContent), ["HTML", "DOM", "Eventos"]);',
        },
      ],
      dicas: [
        'Crie o item com `document.createElement("li")`.',
        'Depois de definir `textContent`, encontre a lista e chame `append` com o novo item.',
      ],
      solucao:
        'const item = document.createElement("li");\nitem.textContent = "Eventos";\ndocument.querySelector("#assuntos").append(item);',
    },
  ],
};

const cliques: Licao = {
  slug: 'eventos-de-clique',
  titulo: 'Responda aos cliques',
  resumo: 'addEventListener e estado da interface.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '`botao.addEventListener("click", funcao)` registra uma função para rodar a cada clique. Passe a função; não a execute durante o registro. Uma função de seta permite escrever o comportamento ali mesmo.',
    },
    {
      tipo: 'p',
      texto:
        'Uma variável declarada fora da função lembra o valor entre cliques. Atualize a variável e, em seguida, o texto que a pessoa vê. Na prévia você pode clicar de verdade; o corretor simula cliques ao conferir.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Contador de cliques',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'A cada clique em `#somar`, aumente um contador em 1 e mostre o valor em `#total`. Comece em 0 e aceite vários cliques seguidos.',
        },
      ],
      codigoInicial: 'let cliques = 0;\n// Registre o evento do botão e atualize o total.\n',
      documentoInicial: pagina(
        '<h2>Seu contador</h2><output id="total">0</output><br><button id="somar" type="button">Somar 1</button>',
      ),
      testes: [
        {
          descricao: 'Três cliques seguidos mostram 1, 2 e 3',
          codigo:
            'const botao = document.querySelector("#somar"); for (let i = 1; i <= 3; i++) { botao.click(); igual(document.querySelector("#total")?.textContent, String(i)); }',
        },
      ],
      dicas: [
        'Registre uma função com `addEventListener("click", ...)`.',
        'Aumente `cliques` dentro da função e atribua `String(cliques)` ao texto do total.',
      ],
      solucao:
        'let cliques = 0;\ndocument.querySelector("#somar").addEventListener("click", () => {\n  cliques++;\n  document.querySelector("#total").textContent = String(cliques);\n});',
    },
  ],
};

const formularios: Licao = {
  slug: 'formularios',
  titulo: 'Leia e valide um formulário',
  resumo: 'submit, preventDefault, value e trim.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'O evento `submit` pertence ao formulário e também acontece ao pressionar Enter. Receba o evento na função e chame `evento.preventDefault()` para tratar o envio com JavaScript, sem navegar.',
    },
    {
      tipo: 'p',
      texto:
        '`input.value` contém o que a pessoa digitou. Use `trim()` para retirar espaços das pontas e decida o que fazer quando o resultado estiver vazio. Mensagens devem ser claras e próximas do campo.',
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Uma saudação com validação',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'No envio de `#cadastro`, impeça a navegação. Leia `#nome`, retire espaços das pontas e escreva em `#mensagem`: `"Digite seu nome."` quando estiver vazio, ou `"Olá, Ana!"` se a entrada for `" Ana "` (adaptando o nome informado).',
        },
      ],
      codigoInicial: '// Ouça o submit do formulário e valide o nome.\n',
      documentoInicial: pagina(
        '<form id="cadastro"><label for="nome">Seu nome</label><br><input id="nome" name="nome"><button type="submit">Enviar</button></form><p id="mensagem" role="status"></p>',
      ),
      testes: [
        {
          descricao: 'Um nome vazio recebe orientação sem navegar',
          codigo:
            'document.querySelector("#nome").value = "   "; const evento = new Event("submit", { bubbles: true, cancelable: true }); document.querySelector("#cadastro").dispatchEvent(evento); verdadeiro(evento.defaultPrevented); igual(document.querySelector("#mensagem").textContent, "Digite seu nome.");',
        },
        {
          descricao: 'O nome é limpo e usado na saudação',
          codigo:
            'document.querySelector("#nome").value = " Bruno "; document.querySelector("#cadastro").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); igual(document.querySelector("#mensagem").textContent, "Olá, Bruno!");',
        },
      ],
      dicas: [
        'Registre `submit` no formulário e receba `evento` na função.',
        'Chame `preventDefault`, leia `value.trim()` do campo e use uma decisão para montar a mensagem.',
      ],
      solucao:
        'document.querySelector("#cadastro").addEventListener("submit", evento => {\n  evento.preventDefault();\n  const nome = document.querySelector("#nome").value.trim();\n  document.querySelector("#mensagem").textContent = nome ? `Olá, ${nome}!` : "Digite seu nome.";\n});',
    },
  ],
};

const desafio: Licao = {
  slug: 'desafio-final',
  titulo: 'Construa sua lista de tarefas',
  resumo: 'Um pequeno aplicativo com formulário, elementos e eventos.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Agora combine seleção, criação de elementos, leitura de campos e eventos. Sua lista recebe uma tarefa pelo formulário, permite removê-la e mantém um contador atualizado.',
    },
    {
      tipo: 'lista',
      itens: [
        'Receba o envio do formulário sem navegar.',
        'Ignore tarefas vazias e use texto simples para mostrar o que foi digitado.',
        'Crie um botão de remoção para cada tarefa.',
        'Atualize o contador após adicionar ou remover.',
      ],
    },
    nota,
  ],
  exercicios: [
    {
      titulo: 'Lista interativa',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Em `#formulario`, leia `#tarefa` no envio e acrescente um `li` a `#tarefas`. O primeiro nó do item deve ser o texto limpo da tarefa; depois, adicione um botão `Remover` que exclui esse item. Atualize `#quantidade` com o número de tarefas, limpe o campo após adicionar e ignore entradas vazias. Use `textContent` para a entrada da pessoa.',
        },
      ],
      codigoInicial: '// Monte sua lista interativa usando os elementos do HTML.\n',
      documentoInicial: pagina(
        '<h1>Minhas tarefas</h1><form id="formulario"><label for="tarefa">Nova tarefa</label><br><input id="tarefa" name="tarefa"><button type="submit">Adicionar</button></form><p>Tarefas: <output id="quantidade">0</output></p><ul id="tarefas"></ul>',
      ),
      testes: [
        {
          descricao: 'Adiciona uma tarefa limpa, atualiza o contador e limpa o campo',
          codigo:
            'const campo = document.querySelector("#tarefa"); campo.value = " Estudar DOM "; document.querySelector("#formulario").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); const itens = document.querySelectorAll("#tarefas > li"); igual(itens.length, 1); igual(itens[0].firstChild.textContent, "Estudar DOM"); igual(document.querySelector("#quantidade").textContent, "1"); igual(campo.value, "");',
        },
        {
          descricao: 'Impede a navegação e ignora tarefas em branco',
          codigo:
            'const antes = document.querySelectorAll("#tarefas > li").length; document.querySelector("#tarefa").value = "   "; const evento = new Event("submit", { bubbles: true, cancelable: true }); document.querySelector("#formulario").dispatchEvent(evento); verdadeiro(evento.defaultPrevented); igual(document.querySelectorAll("#tarefas > li").length, antes);',
        },
        {
          descricao: 'A tarefa é texto simples e o botão remove somente seu item',
          codigo:
            'const lista = document.querySelector("#tarefas"); document.querySelector("#tarefa").value = "<b>Revisar</b>"; document.querySelector("#formulario").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })); const ultimo = lista.lastElementChild; igual(ultimo?.firstChild?.textContent, "<b>Revisar</b>"); igual(ultimo.querySelector("b"), null); const botao = ultimo.querySelector("button"); verdadeiro(botao && botao.textContent === "Remover"); const antes = lista.children.length; botao.click(); igual(lista.children.length, antes - 1); igual(document.querySelector("#quantidade").textContent, String(antes - 1));',
        },
      ],
      dicas: [
        'Guarde referências para formulário, campo, lista e contador. Uma função pequena pode atualizar o contador.',
        'No submit, impeça a navegação e retorne se o texto limpo estiver vazio.',
        'Crie um li e um button. Ao clicar no botão, remova o li e atualize o contador.',
      ],
      solucao:
        'const formulario = document.querySelector("#formulario");\nconst campo = document.querySelector("#tarefa");\nconst lista = document.querySelector("#tarefas");\nconst quantidade = document.querySelector("#quantidade");\nfunction atualizarQuantidade() {\n  quantidade.textContent = String(lista.children.length);\n}\nformulario.addEventListener("submit", evento => {\n  evento.preventDefault();\n  const texto = campo.value.trim();\n  if (!texto) return;\n  const item = document.createElement("li");\n  item.textContent = texto;\n  const remover = document.createElement("button");\n  remover.type = "button";\n  remover.textContent = "Remover";\n  remover.addEventListener("click", () => {\n    item.remove();\n    atualizarQuantidade();\n  });\n  item.append(remover);\n  lista.append(item);\n  campo.value = "";\n  atualizarQuantidade();\n});',
    },
  ],
};

export const domEEventos: Trilha = {
  slug: 'dom-e-eventos',
  titulo: 'DOM e eventos',
  descricao:
    'Transforme JavaScript em páginas interativas. Edite HTML, CSS e JS, veja o resultado e construa uma lista de tarefas. Para quem já conhece funções, listas e decisões.',
  modulos: [
    { titulo: 'Conhecendo a página', licoes: [selecionar, varios, atributos, classes, criar] },
    { titulo: 'Páginas que respondem', licoes: [cliques, formularios] },
    { titulo: 'Desafio final', licoes: [desafio] },
  ],
};
