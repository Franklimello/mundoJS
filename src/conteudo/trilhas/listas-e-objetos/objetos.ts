import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const objetos: Licao = {
  slug: 'objetos',
  titulo: 'Guardando valores com nome',
  resumo: 'Objetos, propriedades e funções que devolvem objetos.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Uma lista guarda itens por posição. Um **objeto** guarda valores por **nome**: cada par `nome: valor` é uma *propriedade*. Ele fica entre chaves.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const pessoa = { nome: "Ana", idade: 25 };',
        '',
        'console.log(pessoa.nome);',
        'console.log(pessoa["idade"]);',
      ),
      saida: linhas('Ana', '25'),
    },
    { tipo: 'p', texto: 'Dá para mudar propriedades e acrescentar novas:' },
    {
      tipo: 'codigo',
      codigo: linhas('pessoa.idade = 26;', 'pessoa.cidade = "Lajinha";', 'console.log(pessoa);'),
      saida: "{ nome: 'Ana', idade: 26, cidade: 'Lajinha' }",
    },
    {
      tipo: 'nota',
      texto:
        'Isso funciona mesmo com `const`. O que a `const` impede é trocar a variável por **outro** objeto; as propriedades de dentro continuam podendo mudar.',
    },
    {
      tipo: 'p',
      texto:
        'Funções também podem devolver objetos. Quando o nome da propriedade é igual ao da variável, dá para abreviar: `{ nome, idade }` vale como `{ nome: nome, idade: idade }`.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'function criarGato(nome) {',
        '  return { nome, patas: 4 };',
        '}',
        '',
        'console.log(criarGato("Mimi"));',
      ),
      saida: "{ nome: 'Mimi', patas: 4 }",
    },
  ],
  exercicios: [
    {
      titulo: 'Criar e apresentar',
      enunciado: [
        {
          tipo: 'lista',
          itens: [
            'Escreva `criarPessoa(nome, idade)`, que devolve um objeto com as propriedades `nome` e `idade`.',
            'Escreva `apresentar(pessoa)`, que devolve um texto no formato `Ana, 25 anos`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const nome = "Ana";',
        'const idade = 25;',
        'const pessoa = { nome: "Ana", idade: 25 };',
        '',
        'function criarPessoa(nome, idade) {',
        '',
        '}',
        '',
        'function apresentar(pessoa) {',
        '',
        '}',
        '',
        'console.log(criarPessoa(nome, idade));',
        'console.log(apresentar(pessoa));',
        '',
      ),
      testes: [
        {
          descricao: 'criarPessoa("Ana", 25) devolve { nome, idade }',
          codigo: js`igual(criarPessoa('Ana', 25), { nome: 'Ana', idade: 25 }, "criarPessoa('Ana', 25)")`,
        },
        {
          descricao: 'apresentar devolve “Ana, 25 anos”',
          codigo: js`igual(apresentar({ nome: 'Ana', idade: 25 }), 'Ana, 25 anos', 'apresentar({ nome: "Ana", idade: 25 })')`,
        },
        {
          descricao: 'As duas funções funcionam juntas',
          codigo: js`igual(apresentar(criarPessoa('Beto', 31)), 'Beto, 31 anos', "apresentar(criarPessoa('Beto', 31))")`,
        },
      ],
      dicas: [
        'Um objeto novo se escreve com chaves: `{ nome: nome, idade: idade }`.',
        'Para o texto, use um template literal com `${pessoa.nome}` e `${pessoa.idade}`.',
      ],
      solucao: linhas(
        'function criarPessoa(nome, idade) {',
        '  return { nome, idade };',
        '}',
        '',
        'function apresentar(pessoa) {',
        '  return `${pessoa.nome}, ${pessoa.idade} anos`;',
        '}',
      ),
    },
    {
      titulo: 'Mexendo na conta',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'O objeto `conta` já existe. Mude o `saldo` para `150` e acrescente uma propriedade nova, `ativa`, valendo `true`. Não crie outro objeto: mude esse.',
        },
      ],
      codigoInicial: linhas('const conta = { titular: "Ana", saldo: 100 };', ''),
      testes: [
        {
          descricao: 'conta terminou com titular, saldo 150 e ativa true',
          codigo: js`igual(conta, { titular: 'Ana', saldo: 150, ativa: true }, 'conta')`,
        },
      ],
      dicas: [
        'Mudar uma propriedade: `conta.saldo = 150;`.',
        'Acrescentar uma nova funciona igual: `conta.ativa = true;`.',
      ],
      solucao: linhas('const conta = { titular: "Ana", saldo: 100 };', '', 'conta.saldo = 150;', 'conta.ativa = true;'),
    },
    {
      titulo: 'Fazendo aniversário',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `fazerAniversario(pessoa)`. Ela soma 1 à propriedade `idade` **do próprio objeto recebido** e devolve esse objeto. Depois de `fazerAniversario(ana)`, a variável `ana` já tem a idade nova.',
        },
      ],
      codigoInicial: linhas(
        'const pessoa = { nome: "Ana", idade: 25 };',
        '',
        'function fazerAniversario(pessoa) {',
        '',
        '}',
        '',
        'console.log(fazerAniversario(pessoa));',
        '',
      ),
      testes: [
        {
          descricao: 'Devolve a pessoa com um ano a mais',
          codigo: js`const resultado = fazerAniversario({ nome: 'Ana', idade: 25 });
igual(resultado, { nome: 'Ana', idade: 26 }, 'O objeto devolvido')`,
        },
        {
          descricao: 'Muda o objeto que foi passado',
          codigo: js`const bia = { nome: 'Bia', idade: 9 };
fazerAniversario(bia);
igual(bia.idade, 10, 'A idade de bia depois da chamada')`,
        },
        {
          descricao: 'Chamar duas vezes soma dois anos',
          codigo: js`const caio = { nome: 'Caio', idade: 30 };
fazerAniversario(caio);
fazerAniversario(caio);
igual(caio.idade, 32, 'A idade de caio depois de duas chamadas')`,
        },
      ],
      dicas: ['A idade muda com `pessoa.idade = pessoa.idade + 1;`.', 'No fim, devolva a própria `pessoa`.'],
      solucao: linhas(
        'function fazerAniversario(pessoa) {',
        '  pessoa.idade = pessoa.idade + 1;',
        '  return pessoa;',
        '}',
      ),
    },
    {
      titulo: 'O retângulo pronto',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `criarRetangulo(largura, altura)`, que devolve um objeto com três propriedades: `largura`, `altura` e `area` (a largura vezes a altura). Por exemplo, `criarRetangulo(3, 4)` devolve `{ largura: 3, altura: 4, area: 12 }`.',
        },
      ],
      codigoInicial: linhas(
        'const largura = 3;',
        'const altura = 4;',
        '',
        'function criarRetangulo(largura, altura) {',
        '',
        '}',
        '',
        'console.log(criarRetangulo(largura, altura));',
        '',
      ),
      testes: [
        {
          descricao: 'criarRetangulo(3, 4) devolve { largura: 3, altura: 4, area: 12 }',
          codigo: js`igual(criarRetangulo(3, 4), { largura: 3, altura: 4, area: 12 }, 'criarRetangulo(3, 4)')`,
        },
        {
          descricao: 'criarRetangulo(10, 2.5) devolve a área 25',
          codigo: js`igual(criarRetangulo(10, 2.5), { largura: 10, altura: 2.5, area: 25 }, 'criarRetangulo(10, 2.5)')`,
        },
        {
          descricao: 'Um lado zero dá área zero',
          codigo: js`igual(criarRetangulo(0, 7), { largura: 0, altura: 7, area: 0 }, 'criarRetangulo(0, 7)')`,
        },
      ],
      dicas: [
        'Escreva as três propriedades dentro das chaves, separadas por vírgula.',
        'A conta pode ficar dentro do objeto: `area: largura * altura`.',
      ],
      solucao: linhas(
        'function criarRetangulo(largura, altura) {',
        '  return { largura, altura, area: largura * altura };',
        '}',
      ),
    },
    {
      titulo: 'O nome da propriedade numa variável',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `valorDe(objeto, chave)`, que devolve o valor da propriedade cujo nome está guardado em `chave`. Por exemplo, `valorDe({ nome: "Ana" }, "nome")` devolve `"Ana"`. Se a propriedade não existir, o resultado natural é `undefined`.',
        },
        {
          tipo: 'nota',
          texto:
            'Com o ponto, o nome é fixo: `objeto.chave` procura uma propriedade chamada literalmente `chave`. Para usar o **valor** da variável como nome, use colchetes: `objeto[chave]`.',
          tom: 'cuidado',
        },
      ],
      codigoInicial: linhas(
        'const objeto = { nome: "Ana" };',
        'const chave = "nome";',
        '',
        'function valorDe(objeto, chave) {',
        '',
        '}',
        '',
        'console.log(valorDe(objeto, chave));',
        '',
      ),
      testes: [
        {
          descricao: 'valorDe({ nome: "Ana" }, "nome") devolve "Ana"',
          codigo: js`igual(valorDe({ nome: 'Ana' }, 'nome'), 'Ana', 'valorDe({ nome: "Ana" }, "nome")')`,
        },
        {
          descricao: 'Escolhe a propriedade certa entre várias',
          codigo: js`igual(valorDe({ a: 1, b: 2, c: 3 }, 'b'), 2, 'valorDe({ a: 1, b: 2, c: 3 }, "b")')`,
        },
        {
          descricao: 'Uma propriedade que não existe dá undefined (e uma que existe dá o valor)',
          codigo: js`igual(valorDe({ x: 7 }, 'x'), 7, 'valorDe({ x: 7 }, "x")');
igual(valorDe({ x: 7 }, 'y'), undefined, 'valorDe({ x: 7 }, "y")')`,
        },
      ],
      dicas: ['Use colchetes: o que está dentro deles é calculado antes.', 'Resposta: `return objeto[chave];`.'],
      solucao: linhas('function valorDe(objeto, chave) {', '  return objeto[chave];', '}'),
    },
    {
      titulo: 'Objeto com lista dentro',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Um aluno é um objeto como `{ nome: "Ana", notas: [7, 9] }`. Escreva a função `resumo(aluno)`, que devolve um objeto novo com o `nome` e a `media` das notas, como em `{ nome: "Ana", media: 8 }`. Sem notas, a média é `0`.',
        },
      ],
      codigoInicial: linhas(
        'const aluno = { nome: "Ana", notas: [7, 9] };',
        '',
        'function resumo(aluno) {',
        '',
        '}',
        '',
        'console.log(resumo(aluno));',
        '',
      ),
      testes: [
        {
          descricao: 'resumo de Ana, com notas 7 e 9, tem média 8',
          codigo: js`igual(resumo({ nome: 'Ana', notas: [7, 9] }), { nome: 'Ana', media: 8 }, 'resumo de Ana')`,
        },
        {
          descricao: 'Uma nota só é a própria média',
          codigo: js`igual(resumo({ nome: 'Beto', notas: [5] }), { nome: 'Beto', media: 5 }, 'resumo de Beto')`,
        },
        {
          descricao: 'Sem notas, a média é 0',
          codigo: js`igual(resumo({ nome: 'Caio', notas: [] }), { nome: 'Caio', media: 0 }, 'resumo de Caio')`,
        },
        {
          descricao: 'A média pode ter casas decimais',
          codigo: js`igual(resumo({ nome: 'Duda', notas: [8, 9] }), { nome: 'Duda', media: 8.5 }, 'resumo de Duda')`,
        },
      ],
      dicas: [
        'As notas estão em `aluno.notas`. Some-as com um laço e divida por `aluno.notas.length`.',
        'Trate o caso sem notas antes de dividir. No fim, devolva `{ nome: aluno.nome, media: media }`.',
      ],
      solucao: linhas(
        'function resumo(aluno) {',
        '  let soma = 0;',
        '  for (const nota of aluno.notas) {',
        '    soma = soma + nota;',
        '  }',
        '  const media = aluno.notas.length === 0 ? 0 : soma / aluno.notas.length;',
        '  return { nome: aluno.nome, media };',
        '}',
      ),
    },
    {
      titulo: 'Creditando uma conta',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `creditar(conta, valor)`, que soma valor à propriedade saldo e devolve o mesmo objeto conta. Neste exercício, a alteração do objeto recebido é intencional.',
        },
      ],
      codigoInicial: linhas(
        'const conta = { saldo: 30, nome: "Ana" };',
        'const valor = 12;',
        '',
        'function creditar(conta, valor) {',
        '',
        '}',
        '',
        'console.log(creditar(conta, valor));',
        '',
      ),
      testes: [
        {
          descricao: 'O crédito atualiza o saldo do mesmo objeto',
          codigo: js`const conta = { saldo: 30, nome: 'Ana' }; const retorno = creditar(conta, 12); verdadeiro(retorno === conta, 'Devolva o mesmo objeto.'); igual(conta.saldo, 42, 'Saldo'); igual(conta.nome, 'Ana', 'Nome preservado')`,
        },
        {
          descricao: 'Funciona com saldo inicial zero',
          codigo: js`igual(creditar({ saldo: 0 }, 5), { saldo: 5 }, 'Primeiro crédito')`,
        },
      ],
      dicas: ['Uma propriedade pode receber um novo valor: conta.saldo = conta.saldo + valor.'],
      solucao: 'function creditar(conta, valor) {\n  conta.saldo = conta.saldo + valor;\n  return conta;\n}',
    },
    {
      titulo: 'Um endereço legível',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `enderecoCompleto(local)`, que lê rua, numero e cidade do objeto e devolve um texto no formato `"Rua Azul, 12 - Recife"`. O número pode ser numérico; as outras propriedades são textos.',
        },
      ],
      codigoInicial: linhas(
        'const local = { rua: "Rua Azul", numero: 12, cidade: "Recife" };',
        '',
        'function enderecoCompleto(local) {',
        '',
        '}',
        '',
        'console.log(enderecoCompleto(local));',
        '',
      ),
      testes: [
        {
          descricao: 'Monta o endereço com pontuação e espaços',
          codigo: js`igual(enderecoCompleto({ rua: 'Rua Azul', numero: 12, cidade: 'Recife' }), 'Rua Azul, 12 - Recife', 'Endereço completo')`,
        },
        {
          descricao: 'Usa os dados de outro endereço',
          codigo: js`igual(enderecoCompleto({ rua: 'Avenida Sol', numero: 8, cidade: 'Natal' }), 'Avenida Sol, 8 - Natal', 'Outro endereço')`,
        },
      ],
      dicas: ['Você pode usar um template literal e acessar cada valor pelo nome da propriedade.'],
      solucao: 'function enderecoCompleto(local) {\n  return `${local.rua}, ${local.numero} - ${local.cidade}`;\n}',
    },
  ],
};
