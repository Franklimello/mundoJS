import { metodo, treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const classes: TopicoDoc = {
  slug: 'classes',
  titulo: 'Classes e Orientação a Objetos',
  resumo:
    'Guia completo de Programação Orientada a Objetos (POO / OOP) em JavaScript: classes, construtores, métodos, encapsulamento com #, getters/setters, herança com extends e polimorfismo.',
  introducao: [
    'A **Programação Orientada a Objetos (POO / OOP)** organiza o código agrupando dados (propriedades) e comportamentos (métodos) em estruturas chamadas **classes**. Uma classe serve como um molde a partir do qual você pode instanciar múltiplos objetos com a mesma estrutura.',
    'No JavaScript moderno (ES6+), a palavra-chave `class` oferece uma sintaxe clara e expressiva para encapsulamento, herança e polimorfismo. Por baixo dos panos, o JavaScript continua operando sobre sua clássica cadeia de protótipos (*prototypal inheritance*), combinando a elegância da orientação a objetos com o dinamismo do motor JS.',
  ],
  secoes: [
    {
      titulo: 'Declarando classes e instâncias',
      descricao:
        'A base da orientação a objetos: como definir moldes, inicializar propriedades e criar objetos com new.',
      metodos: [
        {
          id: 'class-e-constructor',
          nome: 'class e constructor',
          resumo:
            'Declara uma classe e define a função construtora (`constructor`), executada automaticamente quando um novo objeto é criado com o operador `new`.',
          sintaxe: 'class NomeDaClasse {\n  constructor(param1, param2) {\n    this.propriedade = param1;\n  }\n}',
          retorno: 'Uma nova instância do objeto da classe.',
          exemplos: [
            {
              codigo:
                "class Usuario {\n  constructor(nome, nivel) {\n    this.nome = nome;\n    this.nivel = nivel;\n  }\n}\nconst aluno = new Usuario('Carlos', 'iniciante');\nconsole.log(aluno.nome);\nconsole.log(aluno.nivel);",
              saida: 'Carlos\niniciante',
            },
          ],
          cuidado:
            'Diferente de declarações de funções tradicionais (`function`), as declarações de `class` NÃO sofrem içamento (*hoisting*). Você deve declarar a classe no código antes de tentar instanciá-la com `new`.',
          treino: treino({
            enunciado: [
              'Crie a classe `Livro` com um `constructor(titulo, autor)` que guarde os valores recebidos em `this.titulo` e `this.autor`. Em seguida, instancie um livro com os valores `"O Hobbit"` e `"Tolkien"` na constante `meuLivro` e mostre `meuLivro.titulo`.',
            ],
            inicial: ['// Crie a classe Livro e a constante meuLivro'],
            esperados: { meuLivro: { titulo: 'O Hobbit', autor: 'Tolkien' } },
            usa: [
              { padrao: '\\bclass\\s+Livro\\b', nome: 'declaração class Livro' },
              { padrao: '\\bnew\\s+Livro\\b', nome: 'instanciação new Livro' },
            ],
            mostra: 'O Hobbit',
            dicas: [
              'Declare `class Livro { constructor(titulo, autor) { this.titulo = titulo; this.autor = autor; } }`.',
              'Instancie com `const meuLivro = new Livro("O Hobbit", "Tolkien");`.',
            ],
            resposta: [
              'class Livro {',
              '  constructor(titulo, autor) {',
              '    this.titulo = titulo;',
              '    this.autor = autor;',
              '  }',
              '}',
              "const meuLivro = new Livro('O Hobbit', 'Tolkien');",
              'console.log(meuLivro.titulo);',
            ],
          }),
        },
        {
          id: 'metodos-de-instancia',
          nome: 'Métodos de instância',
          resumo:
            'Funções declaradas dentro do corpo da classe que operam sobre os dados da instância acessando `this`.',
          sintaxe: 'class NomeDaClasse {\n  nomeDoMetodo(argumentos) {\n    return this.propriedade;\n  }\n}',
          retorno: 'O valor retornado pelo método.',
          exemplos: [
            {
              codigo:
                "class Jogador {\n  constructor(nome) {\n    this.nome = nome;\n    this.pontos = 0;\n  }\n  ganharPontos(qtd) {\n    this.pontos += qtd;\n    return this.pontos;\n  }\n}\nconst player = new Jogador('Marina');\nplayer.ganharPontos(50);\nconsole.log(player.pontos);",
              saida: '50',
            },
          ],
          cuidado:
            'Ao passar um método de instância como callback (por exemplo em `setTimeout` ou manipuladores de eventos), o valor de `this` pode ser perdido. Use arrow functions `() => this.metodo()` ou `.bind(this)` para preservar o contexto.',
          treino: treino({
            enunciado: [
              'Na classe `Calculadora`, crie o método `somar(a, b)` que devolve a soma dos dois números. Depois, crie uma instância na constante `calc`, chame `calc.somar(15, 27)` guardando o resultado na variável `total` e mostre `total`.',
            ],
            inicial: ['// Declare a classe Calculadora com o método somar(a, b)'],
            esperados: { total: 42 },
            usa: [metodo('somar')],
            mostra: '42',
            dicas: [
              'Dentro de `Calculadora`, defina `somar(a, b) { return a + b; }`.',
              'Crie a instância com `const calc = new Calculadora();` e calcule com `const total = calc.somar(15, 27);`.',
            ],
            resposta: [
              'class Calculadora {',
              '  somar(a, b) {',
              '    return a + b;',
              '  }',
              '}',
              'const calc = new Calculadora();',
              'const total = calc.somar(15, 27);',
              'console.log(total);',
            ],
          }),
        },
        {
          id: 'campos-publicos',
          nome: 'Campos públicos no corpo da classe',
          resumo:
            'Permite declarar propriedades públicas diretamente no corpo da classe com valores iniciais, sem precisar atribuí-las dentro do `constructor`.',
          sintaxe: 'class NomeDaClasse {\n  propriedade = valorPadrao;\n}',
          retorno: 'Propriedades públicas presentes em cada nova instância.',
          exemplos: [
            {
              codigo:
                "class Tarefa {\n  concluida = false;\n  criadaEm = 2026;\n  constructor(titulo) {\n    this.titulo = titulo;\n  }\n}\nconst t = new Tarefa('Aprender classes');\nconsole.log(t.concluida);\nconsole.log(t.criadaEm);",
              saida: 'false\n2026',
            },
          ],
          cuidado:
            'Campos do corpo da classe são instanciados antes da execução do corpo do `constructor`. Se um campo depender de argumentos recebidos no construtor, prefira inicializá-lo dentro do construtor.',
          treino: treino({
            enunciado: [
              'Na classe `Dispositivo`, declare o campo público `ligado = false`. Em seguida, adicione o método `ligar()` que altera `this.ligado` para `true`. Crie uma instância na constante `aparelho`, execute `aparelho.ligar()` e mostre `aparelho.ligado`.',
            ],
            inicial: ['// Declare a classe Dispositivo com o campo ligado e o método ligar'],
            esperados: { aparelho: { ligado: true } },
            usa: [metodo('ligar')],
            mostra: 'true',
            dicas: ['Declare `ligado = false;` no topo da classe.', 'No método `ligar()`, faça `this.ligado = true;`.'],
            resposta: [
              'class Dispositivo {',
              '  ligado = false;',
              '  ligar() {',
              '    this.ligado = true;',
              '  }',
              '}',
              'const aparelho = new Dispositivo();',
              'aparelho.ligar();',
              'console.log(aparelho.ligado);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Encapsulamento, assessores e privacidade',
      descricao:
        'Controle o acesso e a integridade dos dados internos com getters, setters e membros privados nativos (#).',
      metodos: [
        {
          id: 'get-e-set',
          nome: 'Getters e Setters (get e set)',
          resumo:
            'Métodos especiais que interceptam o acesso de leitura (`get`) e de gravação (`set`) a uma propriedade, permitindo validações e valores calculados.',
          sintaxe:
            'class Exemplo {\n  get area() { return this.largura * this.altura; }\n  set lado(v) { if (v > 0) this._lado = v; }\n}',
          retorno: 'O valor devolvido pelo getter ou atribuição controlada no setter.',
          exemplos: [
            {
              codigo:
                'class Termometro {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n  get fahrenheit() {\n    return this.celsius * 1.8 + 32;\n  }\n}\nconst t = new Termometro(25);\nconsole.log(t.fahrenheit);',
              saida: '77',
            },
          ],
          cuidado:
            'Nunca atribua diretamente à mesma propriedade com o mesmo nome dentro do seu próprio `set` (ex: `set nome(v) { this.nome = v; }`), pois isso disparará recursão infinita (`RangeError: Maximum call stack size exceeded`). Use uma propriedade interna como `this._nome` ou `#nome`.',
          treino: treino({
            enunciado: [
              'Na classe `Quadrado`, crie o `constructor(lado)` e um getter `get area()` que calcule e devolva `this.lado * this.lado`. Crie uma instância em `q` com lado `6`, guarde o valor de `q.area` na variável `resultado` e mostre `resultado`.',
            ],
            inicial: ['// Crie a classe Quadrado com constructor e getter de area'],
            esperados: { resultado: 36 },
            usa: [{ padrao: '\\bget\\s+area\\s*\\(', nome: 'getter get area()' }],
            mostra: '36',
            dicas: [
              'Defina o getter com a palavra-chave `get`: `get area() { return this.lado * this.lado; }`.',
              'Acesse `q.area` como se fosse uma propriedade comum, sem usar parênteses: `const resultado = q.area;`.',
            ],
            resposta: [
              'class Quadrado {',
              '  constructor(lado) {',
              '    this.lado = lado;',
              '  }',
              '  get area() {',
              '    return this.lado * this.lado;',
              '  }',
              '}',
              'const q = new Quadrado(6);',
              'const resultado = q.area;',
              'console.log(resultado);',
            ],
          }),
        },
        {
          id: 'campos-privados',
          nome: 'Campos privados (#campo)',
          resumo:
            'Propriedades declaradas com o prefixo cerquilha (`#`) que só podem ser acessadas ou modificadas dentro dos métodos da própria classe.',
          sintaxe: 'class Conta {\n  #saldo = 0;\n  depositar(v) { this.#saldo += v; }\n}',
          retorno: 'Valor protegido acessível apenas internamente.',
          exemplos: [
            {
              codigo:
                "class Cofre {\n  #segredo;\n  constructor(segredo) {\n    this.#segredo = segredo;\n  }\n  revelar() {\n    return `Segredo: ${this.#segredo}`;\n  }\n}\nconst cofre = new Cofre('chave-123');\nconsole.log(cofre.revelar());\nconsole.log(cofre['#segredo']);",
              saida: 'Segredo: chave-123\nundefined',
            },
          ],
          cuidado:
            'Tentar acessar um campo privado fora da classe onde foi declarado (como `objeto.#campo`) gera um erro de sintaxe (`SyntaxError`) imediato antes mesmo da execução.',
          treino: treino({
            enunciado: [
              'Crie a classe `Carteira` com o campo privado `#saldo` iniciando em 0. Crie o método `adicionar(valor)` que soma ao `#saldo` e o getter `saldo` que devolve o valor de `#saldo`. Instancie em `carteira`, chame `carteira.adicionar(100)`, guarde o saldo em `saldoAtual` e mostre.',
            ],
            inicial: ['// Crie a classe Carteira com saldo privado'],
            esperados: { saldoAtual: 100 },
            usa: [{ padrao: '#saldo\\b', nome: 'campo privado #saldo' }],
            mostra: '100',
            dicas: [
              'Declare `#saldo = 0;` no topo da classe `Carteira`.',
              'Crie `adicionar(valor) { this.#saldo += valor; }` e `get saldo() { return this.#saldo; }`.',
            ],
            resposta: [
              'class Carteira {',
              '  #saldo = 0;',
              '  adicionar(valor) {',
              '    this.#saldo += valor;',
              '  }',
              '  get saldo() {',
              '    return this.#saldo;',
              '  }',
              '}',
              'const carteira = new Carteira();',
              'carteira.adicionar(100);',
              'const saldoAtual = carteira.saldo;',
              'console.log(saldoAtual);',
            ],
          }),
        },
        {
          id: 'metodos-privados',
          nome: 'Métodos privados (#metodo())',
          resumo:
            'Funções internas prefixadas com `#` que auxiliam na implementação interna da classe e ficam completamente invisíveis para código externo.',
          sintaxe:
            'class Servico {\n  #sanitizar(t) { return t.trim(); }\n  processar(t) { return this.#sanitizar(t); }\n}',
          retorno: 'Valor calculado internamente para outros métodos da classe.',
          exemplos: [
            {
              codigo:
                "class ServicoEmail {\n  #formatar(email) {\n    return email.trim().toLowerCase();\n  }\n  enviar(email) {\n    const destinatario = this.#formatar(email);\n    return `Enviado para ${destinatario}`;\n  }\n}\nconst s = new ServicoEmail();\nconsole.log(s.enviar('  USER@MUNDOJS.COM '));",
              saida: 'Enviado para user@mundojs.com',
            },
          ],
          cuidado:
            'Métodos privados pertencem estritamente à classe que os declarou: eles não são herdados para acesso direto em subclasses nem aparecem em `Object.keys()` ou `Object.getOwnPropertyNames()`.',
          treino: treino({
            enunciado: [
              'Na classe `Formatador`, crie o método privado `#duplicar(n)` que devolve `n * 2`, e o método público `calcular(n)` que chama `this.#duplicar(n)`. Instancie a classe em `fmt`, calcule `fmt.calcular(25)` na constante `total` e mostre `total`.',
            ],
            inicial: ['// Crie a classe Formatador com método privado de duplicar'],
            esperados: { total: 50 },
            usa: [{ padrao: '#duplicar\\s*\\(', nome: 'método privado #duplicar()' }],
            mostra: '50',
            dicas: [
              'Declare o método privado com cerquilha: `#duplicar(n) { return n * 2; }`.',
              'No método público, invoque com `this.#duplicar(n)`.',
            ],
            resposta: [
              'class Formatador {',
              '  #duplicar(n) {',
              '    return n * 2;',
              '  }',
              '  calcular(n) {',
              '    return this.#duplicar(n);',
              '  }',
              '}',
              'const fmt = new Formatador();',
              'const total = fmt.calcular(25);',
              'console.log(total);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Membros estáticos (static)',
      descricao:
        'Propriedades e métodos que pertencem à classe como um todo, em vez de pertencerem a instâncias individuais.',
      metodos: [
        {
          id: 'metodos-estaticos',
          nome: 'Métodos estáticos (static metodo())',
          resumo:
            'Métodos utilitários ou funções de fábrica pertencentes à classe, chamados diretamente através de `NomeDaClasse.metodo()` sem necessidade de criar instâncias com `new`.',
          sintaxe: 'class Utilitario {\n  static metodo(parametro) {\n    return resultado;\n  }\n}',
          retorno: 'O valor produzido pelo método estático da classe.',
          exemplos: [
            {
              codigo:
                'class Conversor {\n  static kmParaMilhas(km) {\n    return km * 0.621371;\n  }\n}\nconsole.log(Math.round(Conversor.kmParaMilhas(100)));',
              saida: '62',
            },
          ],
          cuidado:
            'Dentro de um método estático, a palavra-chave `this` aponta para a própria classe (função construtora), e NÃO para uma instância de objeto. Portanto, você não pode acessar propriedades de instância usando `this` dentro de métodos estáticos.',
          treino: treino({
            enunciado: [
              'Crie a classe `Matematica` com o método estático `dobro(numero)` que devolve o número multiplicado por 2. Calcule `Matematica.dobro(14)`, guarde o valor na constante `resultado` e mostre.',
            ],
            inicial: ['// Crie a classe Matematica com o método estático dobro(numero)'],
            esperados: { resultado: 28 },
            usa: [{ padrao: '\\bstatic\\s+dobro\\s*\\(', nome: 'método estático static dobro()' }],
            mostra: '28',
            dicas: [
              'Use o modificador `static`: `class Matematica { static dobro(numero) { return numero * 2; } }`.',
              'Chame diretamente pela classe sem usar new: `const resultado = Matematica.dobro(14);`.',
            ],
            resposta: [
              'class Matematica {',
              '  static dobro(numero) {',
              '    return numero * 2;',
              '  }',
              '}',
              'const resultado = Matematica.dobro(14);',
              'console.log(resultado);',
            ],
          }),
        },
        {
          id: 'campos-estaticos',
          nome: 'Campos estáticos (static campo)',
          resumo:
            'Propriedades armazenadas diretamente na classe, muito úteis para constantes globais, configurações padrão ou contadores de instâncias.',
          sintaxe: 'class Configuracao {\n  static VERSAO = "1.0.0";\n}',
          retorno: 'O valor armazenado na propriedade estática da classe.',
          exemplos: [
            {
              codigo:
                'class Contador {\n  static total = 0;\n  constructor() {\n    Contador.total++;\n  }\n}\nnew Contador();\nnew Contador();\nconsole.log(Contador.total);',
              saida: '2',
            },
          ],
          cuidado:
            'Campos estáticos não existem nas instâncias (ou seja, `instancia.VERSAO` será `undefined`). O acesso deve ser feito sempre pelo nome da classe: `NomeDaClasse.VERSAO`.',
          treino: treino({
            enunciado: [
              'Crie a classe `App` com o campo estático `nome = "MundoJS"`. Guarde o valor de `App.nome` na constante `nomeDoApp` e mostre.',
            ],
            inicial: ['// Crie a classe App com o campo estático nome'],
            esperados: { nomeDoApp: 'MundoJS' },
            usa: [{ padrao: '\\bstatic\\s+nome\\s*=', nome: 'campo estático static nome' }],
            mostra: 'MundoJS',
            dicas: [
              'Escreva `class App { static nome = "MundoJS"; }`.',
              'Guarde na variável: `const nomeDoApp = App.nome;`.',
            ],
            resposta: [
              'class App {',
              "  static nome = 'MundoJS';",
              '}',
              'const nomeDoApp = App.nome;',
              'console.log(nomeDoApp);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Herança e polimorfismo',
      descricao:
        'Reaproveite estruturas e especialize comportamentos com extends, chamadas a super() e o operador instanceof.',
      metodos: [
        {
          id: 'extends',
          nome: 'Herança com extends',
          resumo:
            'Cria uma classe filha (subclasse) que herda todas as propriedades e métodos de uma classe pai (superclasse).',
          sintaxe: 'class SubClasse extends SuperClasse {\n  // novos métodos ou propriedades\n}',
          retorno: 'Uma nova subclasse especializada.',
          exemplos: [
            {
              codigo:
                "class Animal {\n  constructor(nome) {\n    this.nome = nome;\n  }\n  dormir() {\n    return `${this.nome} dormiu`;\n  }\n}\nclass Gato extends Animal {\n  miar() {\n    return 'Miau!';\n  }\n}\nconst g = new Gato('Mingau');\nconsole.log(g.dormir());\nconsole.log(g.miar());",
              saida: 'Mingau dormiu\nMiau!',
            },
          ],
          cuidado:
            'O JavaScript suporta apenas herança simples: uma subclasse só pode herdar de uma única classe pai (ou seja, `class C extends A, B` é inválido).',
          treino: treino({
            enunciado: [
              'A classe `Funcionario` já está declarada no código. Crie a subclasse `Gerente` herdando de `Funcionario` usando `extends`. Instancie um gerente em `chefe` com o nome `"Beatriz"`, chame `chefe.apresentar()` guardando em `mensagem` e mostre.',
            ],
            inicial: [
              'class Funcionario {',
              '  constructor(nome) {',
              '    this.nome = nome;',
              '  }',
              '  apresentar() {',
              '    return `Olá, sou ${this.nome}`;',
              '  }',
              '}',
              '',
            ],
            esperados: { mensagem: 'Olá, sou Beatriz' },
            usa: [{ padrao: '\\bclass\\s+Gerente\\s+extends\\s+Funcionario\\b', nome: 'herança com extends' }],
            mostra: 'Olá, sou Beatriz',
            dicas: [
              'Declare `class Gerente extends Funcionario {}`.',
              'Instancie com `const chefe = new Gerente("Beatriz");` e chame `const mensagem = chefe.apresentar();`.',
            ],
            resposta: [
              'class Gerente extends Funcionario {}',
              "const chefe = new Gerente('Beatriz');",
              'const mensagem = chefe.apresentar();',
              'console.log(mensagem);',
            ],
          }),
        },
        {
          id: 'super',
          nome: 'super em construtores e métodos',
          resumo:
            'Invoca o construtor da superclasse (`super(...)`) ou métodos herdados da classe pai (`super.metodo()`).',
          sintaxe: 'constructor(param1, param2) {\n  super(param1);\n  this.extra = param2;\n}',
          retorno: 'A inicialização ou o retorno do método da superclasse.',
          exemplos: [
            {
              codigo:
                "class Veiculo {\n  constructor(marca) {\n    this.marca = marca;\n  }\n}\nclass Carro extends Veiculo {\n  constructor(marca, modelo) {\n    super(marca);\n    this.modelo = modelo;\n  }\n}\nconst c = new Carro('Fiat', 'Uno');\nconsole.log(c.marca);\nconsole.log(c.modelo);",
              saida: 'Fiat\nUno',
            },
          ],
          cuidado:
            'Em uma subclasse que possui seu próprio `constructor`, é OBRIGATÓRIO chamar `super()` antes de acessar `this`. Acessar `this` antes de `super()` lança um `ReferenceError`.',
          treino: treino({
            enunciado: [
              'A classe `Pessoa` já possui `constructor(nome)`. Crie a subclasse `Aluno` que estende `Pessoa` com `constructor(nome, curso)` chamando `super(nome)` e atribuindo `this.curso = curso`. Crie uma instância em `estudante` com `"Lucas"` e `"JavaScript"`, guarde `estudante.curso` na variável `curso` e mostre.',
            ],
            inicial: ['class Pessoa {', '  constructor(nome) {', '    this.nome = nome;', '  }', '}', ''],
            esperados: { curso: 'JavaScript' },
            usa: [{ padrao: '\\bsuper\\s*\\(', nome: 'chamada super()' }],
            mostra: 'JavaScript',
            dicas: [
              'No construtor de `Aluno`, chame `super(nome);` na primeira linha antes de atribuir `this.curso = curso;`.',
              'Crie a instância com `const estudante = new Aluno("Lucas", "JavaScript");`.',
            ],
            resposta: [
              'class Aluno extends Pessoa {',
              '  constructor(nome, curso) {',
              '    super(nome);',
              '    this.curso = curso;',
              '  }',
              '}',
              "const estudante = new Aluno('Lucas', 'JavaScript');",
              'const curso = estudante.curso;',
              'console.log(curso);',
            ],
          }),
        },
        {
          id: 'sobrescrita-de-metodos',
          nome: 'Sobrescrita de métodos (Polimorfismo)',
          resumo:
            'Redefine um método na subclasse com implementação especializada, substituindo ou estendendo o comportamento original herdado.',
          sintaxe: 'class SubClasse extends SuperClasse {\n  metodo() {\n    return "novo comportamento";\n  }\n}',
          retorno: 'O retorno especializado do método sobrescrito.',
          exemplos: [
            {
              codigo:
                "class Instrumento {\n  tocar() {\n    return 'Som de instrumento';\n  }\n}\nclass Violao extends Instrumento {\n  tocar() {\n    return 'Acordes de violão';\n  }\n}\nconst inst = new Violao();\nconsole.log(inst.tocar());",
              saida: 'Acordes de violão',
            },
          ],
          cuidado:
            'Se você quiser apenas complementar o método pai em vez de substituí-lo totalmente, chame `super.nomeDoMetodo()` dentro da sua nova implementação para reaproveitar a lógica existente.',
          treino: treino({
            enunciado: [
              'A classe `ContaBancaria` possui o método `tipo()` que devolve `"Corrente"`. Crie a subclasse `ContaPoupanca` que sobrescreve `tipo()` devolvendo `"Poupança"`. Instancie em `poupanca`, guarde o retorno de `poupanca.tipo()` na constante `nomeDoTipo` e mostre.',
            ],
            inicial: ['class ContaBancaria {', '  tipo() {', '    return "Corrente";', '  }', '}', ''],
            esperados: { nomeDoTipo: 'Poupança' },
            usa: [
              { padrao: '\\bclass\\s+ContaPoupanca\\s+extends\\s+ContaBancaria\\b', nome: 'subclasse ContaPoupanca' },
            ],
            mostra: 'Poupança',
            dicas: [
              'Declare `class ContaPoupanca extends ContaBancaria { tipo() { return "Poupança"; } }`.',
              'Instancie e chame: `const poupanca = new ContaPoupanca(); const nomeDoTipo = poupanca.tipo();`.',
            ],
            resposta: [
              'class ContaPoupanca extends ContaBancaria {',
              '  tipo() {',
              "    return 'Poupança';",
              '  }',
              '}',
              'const poupanca = new ContaPoupanca();',
              'const nomeDoTipo = poupanca.tipo();',
              'console.log(nomeDoTipo);',
            ],
          }),
        },
        {
          id: 'instanceof',
          nome: 'Operador instanceof',
          resumo:
            'Testa se um objeto descende de uma classe ou função construtora, verificando toda a sua cadeia de herança prototípica.',
          sintaxe: 'objeto instanceof NomeDaClasse',
          retorno: '`true` se o objeto pertencer à classe ou a um de seus ancestrais; caso contrário, `false`.',
          exemplos: [
            {
              codigo:
                'class Animal {}\nclass Cachorro extends Animal {}\nconst rex = new Cachorro();\nconsole.log(rex instanceof Cachorro);\nconsole.log(rex instanceof Animal);\nconsole.log(rex instanceof Array);',
              saida: 'true\ntrue\nfalse',
            },
          ],
          cuidado:
            'Valores primitivos literais (como strings literais `"texto"` ou números `10`) não são considerados instâncias das classes empacotadoras (`"texto" instanceof String` é `false`).',
          treino: treino({
            enunciado: [
              'Dadas as classes `Veiculo` e `Carro` (que estende `Veiculo`), crie uma nova instância de `Carro` na constante `automovel`. Verifique se `automovel` é uma instância de `Veiculo` usando `instanceof`, guarde o resultado booleano na constante `ehVeiculo` e mostre.',
            ],
            inicial: ['class Veiculo {}', 'class Carro extends Veiculo {}', ''],
            esperados: { ehVeiculo: true },
            usa: [{ padrao: '\\binstanceof\\s+Veiculo\\b', nome: 'operador instanceof' }],
            mostra: 'true',
            dicas: [
              'Crie o objeto com `const automovel = new Carro();`.',
              'Teste a herança com `const ehVeiculo = automovel instanceof Veiculo;`.',
            ],
            resposta: [
              'const automovel = new Carro();',
              'const ehVeiculo = automovel instanceof Veiculo;',
              'console.log(ehVeiculo);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Protótipos e arquitetura interna',
      descricao: 'Compreenda a herança prototípica que alimenta as classes no motor do JavaScript.',
      metodos: [
        {
          id: 'prototype',
          nome: 'Protótipos e Object.getPrototypeOf()',
          resumo:
            'Revela como o modelo prototípico funciona por baixo das classes: cada classe armazena seus métodos compartilhados no objeto `.prototype`, vinculado a todas as instâncias.',
          sintaxe: 'Classe.prototype.metodo ou Object.getPrototypeOf(instancia)',
          retorno: 'O objeto protótipo compartilhado pelas instâncias.',
          exemplos: [
            {
              codigo:
                "class Pessoa {\n  falar() {\n    return 'Oi';\n  }\n}\nconst p1 = new Pessoa();\nconst p2 = new Pessoa();\nconsole.log(p1.falar === p2.falar);\nconsole.log(Object.getPrototypeOf(p1) === Pessoa.prototype);",
              saida: 'true\ntrue',
            },
          ],
          cuidado:
            'Métodos de classe vivem em `Classe.prototype` e são compartilhados na memória entre todas as instâncias. Já propriedades criadas com `this.prop = val` ou campos de corpo de classe são duplicadas em cada instância individualmente.',
          treino: treino({
            enunciado: [
              'Dada a classe `Obra` e a instância `livro`, use `Object.getPrototypeOf()` para verificar se o protótipo de `livro` é estritamente igual a `Obra.prototype`. Guarde o resultado booleano em `temMesmoPrototipo` e mostre.',
            ],
            inicial: ['class Obra {}', 'const livro = new Obra();', ''],
            esperados: { temMesmoPrototipo: true },
            usa: [metodo('getPrototypeOf')],
            mostra: 'true',
            dicas: [
              'Obtenha o protótipo com `Object.getPrototypeOf(livro)`.',
              'Compare com `Obra.prototype` usando `===`: `const temMesmoPrototipo = Object.getPrototypeOf(livro) === Obra.prototype;`.',
            ],
            resposta: [
              'const temMesmoPrototipo = Object.getPrototypeOf(livro) === Obra.prototype;',
              'console.log(temMesmoPrototipo);',
            ],
          }),
        },
      ],
    },
  ],
};
