import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const eOu: Licao = {
  slug: 'e-ou',
  titulo: 'Combinando condições',
  resumo: 'Os operadores && (e), || (ou) e ! (não).',
  conteudo: [
    {
      tipo: 'p',
      texto:
        'Às vezes uma condição só não basta. `&&` quer dizer **e** (as duas precisam ser verdadeiras), `||` quer dizer **ou** (basta uma) e `!` inverte (**não**).',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const idade = 20;',
        'const temCarteira = true;',
        '',
        'console.log(idade >= 18 && temCarteira);',
        'console.log(idade < 18 || temCarteira);',
        'console.log(!temCarteira);',
      ),
      saida: linhas('true', 'true', 'false'),
    },
    {
      tipo: 'p',
      texto:
        '`true` e `false` são valores do tipo **booleano**. Toda comparação resulta em um deles, e é justamente isso que o `if` olha para decidir.',
    },
    {
      tipo: 'codigo',
      codigo: linhas('if (idade >= 18 && temCarteira) {', '  console.log("Pode dirigir.");', '}'),
      saida: 'Pode dirigir.',
    },
    {
      tipo: 'nota',
      texto:
        'Uma função pode devolver direto o resultado de uma comparação: `return idade >= 18;` devolve `true` ou `false`, sem precisar de `if`.',
    },
  ],
  exercicios: [
    {
      titulo: 'Entrar na festa',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `podeEntrar(idade, temConvite)`. Ela devolve `true` se a pessoa tem 18 anos ou mais **ou** tem convite, e `false` caso contrário.',
        },
      ],
      codigoInicial: linhas(
        'const idade = 20;',
        'const temConvite = false;',
        '',
        'function podeEntrar(idade, temConvite) {',
        '',
        '}',
        '',
        'console.log(podeEntrar(idade, temConvite));',
        '',
      ),
      testes: [
        {
          descricao: 'Adulto sem convite entra',
          codigo: js`igual(podeEntrar(20, false), true, 'podeEntrar(20, false)')`,
        },
        {
          descricao: 'Quem tem exatamente 18 entra',
          codigo: js`igual(podeEntrar(18, false), true, 'podeEntrar(18, false)')`,
        },
        {
          descricao: 'Menor com convite entra',
          codigo: js`igual(podeEntrar(16, true), true, 'podeEntrar(16, true)')`,
        },
        {
          descricao: 'Menor sem convite não entra',
          codigo: js`igual(podeEntrar(16, false), false, 'podeEntrar(16, false)')`,
        },
        {
          descricao: 'Quem tem 17 sem convite não entra',
          codigo: js`igual(podeEntrar(17, false), false, 'podeEntrar(17, false)')`,
        },
      ],
      dicas: [
        'São duas condições ligadas por “ou”: ser maior de idade, e ter convite.',
        'Maior de idade é `idade >= 18`. Ligue com `||` a `temConvite`.',
      ],
      solucao: linhas('function podeEntrar(idade, temConvite) {', '  return idade >= 18 || temConvite;', '}'),
    },
    {
      titulo: 'Fim de semana',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `ehFimDeSemana(dia)`, que recebe o nome do dia em minúsculas e devolve `true` para `"sábado"` ou `"domingo"`, e `false` para qualquer outro dia.',
        },
      ],
      codigoInicial: linhas(
        'const dia = "sábado";',
        '',
        'function ehFimDeSemana(dia) {',
        '',
        '}',
        '',
        'console.log(ehFimDeSemana(dia));',
        '',
      ),
      testes: [
        {
          descricao: 'sábado é fim de semana',
          codigo: js`igual(ehFimDeSemana('sábado'), true, 'ehFimDeSemana("sábado")')`,
        },
        {
          descricao: 'domingo é fim de semana',
          codigo: js`igual(ehFimDeSemana('domingo'), true, 'ehFimDeSemana("domingo")')`,
        },
        { descricao: 'segunda não é', codigo: js`igual(ehFimDeSemana('segunda'), false, 'ehFimDeSemana("segunda")')` },
        { descricao: 'sexta não é', codigo: js`igual(ehFimDeSemana('sexta'), false, 'ehFimDeSemana("sexta")')` },
      ],
      dicas: [
        'Cada comparação é completa: `dia === "sábado"`. Não dá para escrever `dia === "sábado" || "domingo"`.',
        'Ligue as duas comparações com `||`.',
      ],
      solucao: linhas('function ehFimDeSemana(dia) {', '  return dia === "sábado" || dia === "domingo";', '}'),
    },
    {
      titulo: 'Dentro dos limites',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `estaEntre(numero, minimo, maximo)`, que devolve `true` se o número é maior ou igual ao mínimo **e** menor ou igual ao máximo. Os limites contam como "dentro".',
        },
      ],
      codigoInicial: linhas(
        'const numero = 5;',
        'const minimo = 1;',
        'const maximo = 10;',
        '',
        'function estaEntre(numero, minimo, maximo) {',
        '',
        '}',
        '',
        'console.log(estaEntre(numero, minimo, maximo));',
        '',
      ),
      testes: [
        { descricao: '5 está entre 1 e 10', codigo: js`igual(estaEntre(5, 1, 10), true, 'estaEntre(5, 1, 10)')` },
        { descricao: 'O limite de baixo conta', codigo: js`igual(estaEntre(1, 1, 10), true, 'estaEntre(1, 1, 10)')` },
        { descricao: 'O limite de cima conta', codigo: js`igual(estaEntre(10, 1, 10), true, 'estaEntre(10, 1, 10)')` },
        { descricao: '0 está abaixo', codigo: js`igual(estaEntre(0, 1, 10), false, 'estaEntre(0, 1, 10)')` },
        { descricao: '11 está acima', codigo: js`igual(estaEntre(11, 1, 10), false, 'estaEntre(11, 1, 10)')` },
      ],
      dicas: [
        'São duas condições: `numero >= minimo` e `numero <= maximo`.',
        'As duas precisam ser verdadeiras ao mesmo tempo, então ligue com `&&`.',
      ],
      solucao: linhas(
        'function estaEntre(numero, minimo, maximo) {',
        '  return numero >= minimo && numero <= maximo;',
        '}',
      ),
    },
    {
      titulo: 'Dirigir sem beber',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Escreva a função `podeDirigir(idade, temCarteira, bebeu)`. Ela devolve `true` só se a pessoa tem 18 anos ou mais, **tem** carteira e **não** bebeu.',
        },
      ],
      codigoInicial: linhas(
        'const idade = 20;',
        'const temCarteira = true;',
        'const bebeu = false;',
        '',
        'function podeDirigir(idade, temCarteira, bebeu) {',
        '',
        '}',
        '',
        'console.log(podeDirigir(idade, temCarteira, bebeu));',
        '',
      ),
      testes: [
        {
          descricao: 'Adulto habilitado que não bebeu pode',
          codigo: js`igual(podeDirigir(20, true, false), true, 'podeDirigir(20, true, false)')`,
        },
        {
          descricao: 'Quem tem 18 anos pode',
          codigo: js`igual(podeDirigir(18, true, false), true, 'podeDirigir(18, true, false)')`,
        },
        {
          descricao: 'Quem bebeu não pode',
          codigo: js`igual(podeDirigir(20, true, true), false, 'podeDirigir(20, true, true)')`,
        },
        {
          descricao: 'Sem carteira não pode',
          codigo: js`igual(podeDirigir(20, false, false), false, 'podeDirigir(20, false, false)')`,
        },
        {
          descricao: 'Menor de idade não pode',
          codigo: js`igual(podeDirigir(17, true, false), false, 'podeDirigir(17, true, false)')`,
        },
      ],
      dicas: [
        'Use `&&` para ligar as três condições: a idade, a carteira e o “não bebeu”.',
        'O “não bebeu” é `!bebeu`: o `!` inverte `true` em `false` e vice-versa.',
      ],
      solucao: linhas(
        'function podeDirigir(idade, temCarteira, bebeu) {',
        '  return idade >= 18 && temCarteira && !bebeu;',
        '}',
      ),
    },
    {
      titulo: 'Ano bissexto',
      enunciado: [
        {
          tipo: 'p',
          texto: 'Escreva a função `ehBissexto(ano)`. Um ano é bissexto quando:',
        },
        {
          tipo: 'lista',
          itens: ['é divisível por 4 **e** não é divisível por 100; **ou**', 'é divisível por 400.'],
        },
        {
          tipo: 'nota',
          texto:
            'Um número é divisível por outro quando o resto da divisão é zero. Por isso 2024 é bissexto, 1900 não é, e 2000 é.',
        },
      ],
      codigoInicial: linhas(
        'const ano = 2024;',
        '',
        'function ehBissexto(ano) {',
        '',
        '}',
        '',
        'console.log(ehBissexto(ano));',
        '',
      ),
      testes: [
        { descricao: '2024 é bissexto', codigo: js`igual(ehBissexto(2024), true, 'ehBissexto(2024)')` },
        { descricao: '2023 não é', codigo: js`igual(ehBissexto(2023), false, 'ehBissexto(2023)')` },
        {
          descricao: '1900 não é (divisível por 100, mas não por 400)',
          codigo: js`igual(ehBissexto(1900), false, 'ehBissexto(1900)')`,
        },
        { descricao: '2000 é (divisível por 400)', codigo: js`igual(ehBissexto(2000), true, 'ehBissexto(2000)')` },
        { descricao: '2100 não é', codigo: js`igual(ehBissexto(2100), false, 'ehBissexto(2100)')` },
        { descricao: '1996 é', codigo: js`igual(ehBissexto(1996), true, 'ehBissexto(1996)')` },
      ],
      dicas: [
        'Divisível por 4: `ano % 4 === 0`. Divisível por 100: `ano % 100 === 0`.',
        'A primeira regra junta duas condições com `&&`, e a segunda entra com `||`. Use parênteses para deixar a ordem clara.',
        'Resposta: `(ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0`.',
      ],
      solucao: linhas(
        'function ehBissexto(ano) {',
        '  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;',
        '}',
      ),
    },
    {
      titulo: 'Retirada de um pedido',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `podeRetirar(pago, emEstoque, documento)`, que devolve true somente quando as três condições são verdadeiras: o pedido foi pago, está em estoque e o documento foi apresentado.',
        },
      ],
      codigoInicial: linhas(
        'const pago = true;',
        'const emEstoque = true;',
        'const documento = true;',
        '',
        'function podeRetirar(pago, emEstoque, documento) {',
        '',
        '}',
        '',
        'console.log(podeRetirar(pago, emEstoque, documento));',
        '',
      ),
      testes: [
        {
          descricao: 'Libera apenas com as três condições',
          codigo: js`igual(podeRetirar(true, true, true), true, 'Tudo pronto'); igual(podeRetirar(false, true, true), false, 'Sem pagamento')`,
        },
        {
          descricao: 'Estoque e documento também são obrigatórios',
          codigo: js`igual(podeRetirar(true, false, true), false, 'Sem estoque'); igual(podeRetirar(true, true, false), false, 'Sem documento')`,
        },
      ],
      dicas: ['O operador && exige que cada parte seja verdadeira. Você pode encadear três partes.'],
      solucao: 'function podeRetirar(pago, emEstoque, documento) {\n  return pago && emEstoque && documento;\n}',
    },
    {
      titulo: 'Duas formas de ganhar frete',
      enunciado: [
        {
          tipo: 'p',
          texto:
            'Crie `temFreteGratis(valor, assinante)`. O frete é grátis quando o valor é pelo menos 100 reais ou quando o cliente é assinante. Devolva true ou false.',
        },
      ],
      codigoInicial: linhas(
        'const valor = 100;',
        'const assinante = false;',
        '',
        'function temFreteGratis(valor, assinante) {',
        '',
        '}',
        '',
        'console.log(temFreteGratis(valor, assinante));',
        '',
      ),
      testes: [
        {
          descricao: 'Compras a partir de 100 recebem frete grátis',
          codigo: js`igual(temFreteGratis(100, false), true, 'No limite'); igual(temFreteGratis(99, false), false, 'Abaixo do limite')`,
        },
        {
          descricao: 'Assinantes recebem o benefício mesmo em compras pequenas',
          codigo: js`igual(temFreteGratis(10, true), true, 'Assinante'); igual(temFreteGratis(0, false), false, 'Sem condição atendida')`,
        },
      ],
      dicas: ['Use || para juntar duas formas alternativas de conseguir o benefício.'],
      solucao: 'function temFreteGratis(valor, assinante) {\n  return valor >= 100 || assinante;\n}',
    },
  ],
};
