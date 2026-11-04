import { js, linhas } from '../../ajudantes';
import type { Licao } from '../../tipos';

export const date: Licao = {
  slug: 'date-datas-e-prazos',
  titulo: 'Date: datas e prazos',
  resumo: 'Crie datas, leia suas partes e calcule intervalos em UTC.',
  conteudo: [
    {
      tipo: 'p',
      texto:
        '**Date** é um recurso nativo para representar um instante. Escreva `new Date(texto)` para criar uma data a partir de um texto ISO, como `"2026-11-04T00:00:00Z"`. O `new` cria o objeto com que vamos trabalhar; o Z no final indica UTC.',
    },
    {
      tipo: 'p',
      texto:
        'Uma mesma data pode aparecer em dias ou horários diferentes conforme o fuso. Aqui vamos usar **UTC** em todas as contas para obter o mesmo resultado em qualquer aparelho. Use os métodos que têm UTC no nome.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const data = new Date("2026-11-04T00:00:00Z");',
        'console.log(data.getUTCFullYear());',
        'console.log(data.getUTCMonth() + 1);',
        'console.log(data.getUTCDate());',
      ),
      saida: linhas('2026', '11', '4'),
    },
    {
      tipo: 'nota',
      texto:
        'getUTCMonth conta os meses de 0 a 11. Some 1 para devolver um mês de 1 a 12. getUTCDate devolve o dia do mês; getUTCDay é outro método e devolve o dia da semana.',
    },
    {
      tipo: 'p',
      texto:
        '`getTime()` devolve o instante em milissegundos. A diferença entre dois instantes em UTC permite calcular um intervalo. Um dia de 24 horas tem `24 * 60 * 60 * 1000` milissegundos.',
    },
    {
      tipo: 'p',
      texto:
        '`setUTCDate` muda o dia do mês e ajusta a data ao atravessar meses ou anos. `toISOString()` converte o instante em um texto ISO com UTC. Esse texto também inclui os milissegundos.',
    },
    {
      tipo: 'codigo',
      codigo: linhas(
        'const prazo = new Date("2026-12-31T00:00:00Z");',
        'prazo.setUTCDate(prazo.getUTCDate() + 1);',
        'console.log(prazo.toISOString());',
      ),
      saida: '2027-01-01T00:00:00.000Z',
    },
    {
      tipo: 'nota',
      texto:
        'As atividades usam textos ISO válidos com UTC e datas fixas. Você não precisa usar a data atual nem adivinhar o fuso de quem vai rodar o código.',
    },
  ],
  exercicios: [
    {
      titulo: 'Separe ano, mês e dia',
      enunciado: [
        { tipo: 'p', texto: 'Complete `partesDaData(texto)` para devolver um objeto com `ano`, `mes` e `dia`.' },
        {
          tipo: 'lista',
          itens: [
            'Crie um Date com o texto ISO recebido e leia as partes usando os métodos UTC.',
            'Devolva `mes` de 1 a 12.',
            'Exemplo: `"2026-11-04T00:00:00Z"` resulta em `{ ano: 2026, mes: 11, dia: 4 }`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const dataExemplo = "2026-11-04T00:00:00Z";',
        '',
        'function partesDaData(texto) {',
        '}',
        '',
        'console.log(partesDaData(dataExemplo));',
      ),
      testes: [
        {
          descricao: 'Lê as partes em UTC e ajusta o número do mês',
          codigo: js`igual(partesDaData('2026-11-04T00:00:00Z'), { ano: 2026, mes: 11, dia: 4 }); igual(partesDaData('2027-01-01T00:00:00Z'), { ano: 2027, mes: 1, dia: 1 }); igual(partesDaData('2024-02-29T00:00:00Z'), { ano: 2024, mes: 2, dia: 29 });`,
        },
      ],
      dicas: [
        'Comece com `const data = new Date(texto)`.',
        'Use getUTCFullYear, getUTCMonth mais 1 e getUTCDate para montar o objeto.',
      ],
      solucao:
        'function partesDaData(texto) {\n  const data = new Date(texto);\n  return { ano: data.getUTCFullYear(), mes: data.getUTCMonth() + 1, dia: data.getUTCDate() };\n}',
    },
    {
      titulo: 'Quantos dias de diferença?',
      enunciado: [
        { tipo: 'p', texto: 'Complete `diasEntre(inicio, fim)` para contar os dias entre duas datas.' },
        {
          tipo: 'lista',
          itens: [
            'As duas entradas serão textos ISO válidos à meia-noite em UTC. O fim será igual ou posterior ao início.',
            'Subtraia os instantes em milissegundos e divida pelo número de milissegundos em 24 horas.',
            'Exemplos: de 4 a 7 de novembro são `3` dias; duas datas iguais resultam em `0`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const periodo = { inicio: "2026-11-04T00:00:00Z", fim: "2026-11-07T00:00:00Z" };',
        '',
        'function diasEntre(inicio, fim) {',
        '}',
        '',
        'console.log(diasEntre(periodo.inicio, periodo.fim));',
      ),
      testes: [
        {
          descricao: 'Conta os dias em intervalos comuns, iguais e que atravessam o ano',
          codigo: js`igual(diasEntre('2026-11-04T00:00:00Z', '2026-11-07T00:00:00Z'), 3); igual(diasEntre('2026-11-04T00:00:00Z', '2026-11-04T00:00:00Z'), 0); igual(diasEntre('2026-12-31T00:00:00Z', '2027-01-02T00:00:00Z'), 2); igual(diasEntre('2024-02-28T00:00:00Z', '2024-03-01T00:00:00Z'), 2);`,
        },
      ],
      dicas: [
        'Use new Date e getTime nas duas entradas.',
        'Um dia tem `86400000` milissegundos. A conta é fim menos início, dividido por esse valor.',
      ],
      solucao:
        'function diasEntre(inicio, fim) {\n  return (new Date(fim).getTime() - new Date(inicio).getTime()) / 86400000;\n}',
    },
    {
      titulo: 'Calcule o novo prazo',
      enunciado: [
        { tipo: 'p', texto: 'Complete `adicionarDias(texto, dias)` para avançar uma data em UTC.' },
        {
          tipo: 'lista',
          itens: [
            'O texto será uma data ISO válida. `dias` será um inteiro maior ou igual a zero.',
            'Acrescente a quantidade ao dia UTC da data e devolva o novo instante com `toISOString()`.',
            'Exemplo: adicionar `1` a `"2026-12-31T00:00:00Z"` deve devolver `"2027-01-01T00:00:00.000Z"`.',
          ],
        },
      ],
      codigoInicial: linhas(
        'const entrega = { data: "2026-12-31T00:00:00Z", dias: 1 };',
        '',
        'function adicionarDias(texto, dias) {',
        '}',
        '',
        'console.log(adicionarDias(entrega.data, entrega.dias));',
      ),
      testes: [
        {
          descricao: 'Avança o prazo em UTC, inclusive entre meses e em ano bissexto',
          codigo: js`igual(adicionarDias('2026-12-31T00:00:00Z', 1), '2027-01-01T00:00:00.000Z'); igual(adicionarDias('2026-11-04T00:00:00Z', 0), '2026-11-04T00:00:00.000Z'); igual(adicionarDias('2024-02-28T00:00:00Z', 2), '2024-03-01T00:00:00.000Z'); igual(adicionarDias('2026-11-04T15:30:00Z', 3), '2026-11-07T15:30:00.000Z');`,
        },
      ],
      dicas: [
        'Crie a data e leia seu dia atual com getUTCDate.',
        'Use setUTCDate com o dia atual mais dias. Depois devolva a conversão ISO.',
      ],
      solucao:
        'function adicionarDias(texto, dias) {\n  const data = new Date(texto);\n  data.setUTCDate(data.getUTCDate() + dias);\n  return data.toISOString();\n}',
    },
  ],
};
