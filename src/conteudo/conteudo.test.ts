import { describe, expect, it } from 'vitest';
import { Window } from 'happy-dom';
import { montarDocumento, type DocumentoWeb } from '@/engine/documento';
import { analisar } from '@/engine/analisar';
import { criarExecutor } from '@/engine/executor';
import { rodar } from '@/engine/rodar';
import { buscarLicao, todasAsLicoes, todosOsCaminhos, trilhas } from './index';
import type { Bloco } from './tipos';

const executor = criarExecutor();
async function rodarLocal(codigo: string, testes: Parameters<typeof rodar>[1] = [], documento?: DocumentoWeb) {
  if (!documento) return rodar(codigo, testes, executor, { esperaMaximaMs: 1000, limiteDeVoltas: 200_000 });
  const janela = new Window({ settings: { enableJavaScriptEvaluation: true } });
  try {
    montarDocumento(janela.document as unknown as Document, documento);
    const executar = janela.eval(`(${criarExecutor.toString()})()`) as ReturnType<typeof criarExecutor>;
    return await rodar(codigo, testes, executar, { esperaMaximaMs: 1000, limiteDeVoltas: 200_000 });
  } finally {
    await janela.happyDOM.close();
  }
}

const licoes = trilhas.flatMap((trilha) => todasAsLicoes(trilha).map((licao) => ({ trilha, licao })));
const porLicao = licoes.map(({ trilha, licao }) => [`${trilha.slug}/${licao.slug}`, licao] as const);
/** Todos os exercícios de todas as lições, com um nome que diz qual é: `trilha/licao#2`. */
const porExercicio = licoes.flatMap(({ trilha, licao }) =>
  licao.exercicios.map((exercicio, indice) => [`${trilha.slug}/${licao.slug}#${indice + 1}`, exercicio] as const),
);

function textosDe(blocos: Bloco[]): string[] {
  return blocos.flatMap((bloco) => {
    if (bloco.tipo === 'lista') return bloco.itens;
    if (bloco.tipo === 'codigo') return [];
    return [bloco.texto];
  });
}

describe('estrutura do conteúdo', () => {
  it('as trilhas e as lições têm endereços únicos', () => {
    expect(new Set(trilhas.map((t) => t.slug)).size).toBe(trilhas.length);
    for (const trilha of trilhas) {
      const slugs = todasAsLicoes(trilha).map((l) => l.slug);
      expect(new Set(slugs).size, `lições repetidas em ${trilha.slug}`).toBe(slugs.length);
    }
    const caminhos = todosOsCaminhos().map((c) => `${c.trilha}/${c.licao}`);
    expect(new Set(caminhos).size).toBe(caminhos.length);
  });

  it('o endereço só usa letras minúsculas, números e hífen', () => {
    for (const { trilha, licao } of licoes) {
      expect(trilha.slug).toMatch(/^[a-z0-9-]+$/);
      expect(licao.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('buscarLicao liga a anterior e a próxima, inclusive entre módulos', () => {
    const primeira = buscarLicao('javascript-do-zero', 'ola-mundo');
    expect(primeira?.numero).toBe(1);
    expect(primeira?.anterior).toBeNull();
    expect(primeira?.proxima?.licao.slug).toBe('variaveis');
    // O desafio fica num módulo à parte: a lição de antes aponta para ele, entre módulos.
    expect(buscarLicao('javascript-do-zero', 'enquanto')?.proxima?.licao.slug).toBe('desafio-final');
    const ultima = buscarLicao('javascript-do-zero', 'desafio-final');
    expect(ultima?.proxima).toBeNull();
    expect(ultima?.anterior?.licao.slug).toBe('enquanto');
    expect(buscarLicao('javascript-do-zero', 'nao-existe')).toBeUndefined();
    expect(buscarLicao('nao-existe', 'ola-mundo')).toBeUndefined();
  });

  it.each(porLicao)('%s está completa', (_nome, licao) => {
    expect(licao.titulo.trim()).not.toBe('');
    expect(licao.resumo.trim()).not.toBe('');
    expect(licao.conteudo.length).toBeGreaterThan(0);
    expect(licao.exercicios.length, 'uma lição precisa de pelo menos um exercício').toBeGreaterThan(0);
  });

  it.each(porLicao)('%s: os exercícios se distinguem uns dos outros', (_nome, licao) => {
    if (licao.exercicios.length > 1) {
      // O passo a passo mostra o título: sem ele, o aluno não sabe o que vem em cada número.
      const titulos = licao.exercicios.map((e) => e.titulo?.trim() ?? '');
      expect(titulos.every(Boolean), 'com mais de um exercício, todos precisam de título').toBe(true);
      expect(new Set(titulos).size, 'títulos de exercício repetidos').toBe(titulos.length);
    }
    // Dois exercícios com o mesmo ponto de partida ou a mesma solução são um copia-e-cola esquecido.
    const iniciais = licao.exercicios.map((e) => e.codigoInicial);
    const solucoes = licao.exercicios.map((e) => e.solucao);
    expect(new Set(iniciais).size, 'código inicial repetido entre exercícios').toBe(iniciais.length);
    expect(new Set(solucoes).size, 'solução repetida entre exercícios').toBe(solucoes.length);
  });

  it.each(porExercicio)('%s está completo', (_nome, exercicio) => {
    expect(exercicio.enunciado.length).toBeGreaterThan(0);
    expect(exercicio.testes.length).toBeGreaterThan(0);
    expect(exercicio.dicas.length).toBeGreaterThan(0);
    const descricoes = exercicio.testes.map((t) => t.descricao);
    expect(new Set(descricoes).size, 'descrições de teste repetidas').toBe(descricoes.length);
  });

  it('toda crase de código inline no texto está fechada', () => {
    for (const { licao } of licoes) {
      const textos = [
        ...textosDe(licao.conteudo),
        ...licao.exercicios.flatMap((e) => [...textosDe(e.enunciado), ...e.dicas]),
      ];
      for (const texto of textos) {
        const crases = (texto.match(/`/g) ?? []).length;
        expect(crases % 2, `crase aberta em: ${texto}`).toBe(0);
      }
    }
  });

  it('o código inline não começa nem termina com espaço', () => {
    // Um trecho como `return `Olá`` não cabe na marcação: o `Texto` fecha o código na primeira crase
    // de dentro, e o resto da frase sai errado. Escreva `"Olá, "` (com aspas) ou `${nome}` (sem crases).
    const ruins: string[] = [];
    for (const { licao } of licoes) {
      const textos = [
        ...textosDe(licao.conteudo),
        ...licao.exercicios.flatMap((e) => [...textosDe(e.enunciado), ...e.dicas]),
      ];
      for (const texto of textos) {
        for (const trecho of texto.match(/`[^`]+`/g) ?? []) {
          const dentro = trecho.slice(1, -1);
          if (dentro !== dentro.trim()) ruins.push(`${licao.slug}: ${trecho} em “${texto.slice(0, 80)}…”`);
        }
      }
    }
    expect(ruins, 'código inline com espaço na ponta').toEqual([]);
  });
});

describe('os exemplos de cada lição imprimem o que o texto diz', () => {
  it.each(porLicao)('%s', async (_nome, licao) => {
    let acumulado = '';
    let esperado: string[] = [];
    for (const bloco of licao.conteudo) {
      if (bloco.tipo !== 'codigo') continue;
      const linhasEsperadas = bloco.saida ? bloco.saida.split('\n') : [];

      // Primeiro, sozinho. Um exemplo que não depende dos anteriores precisa funcionar assim, e é
      // assim que a saída fica na ordem certa mesmo quando vários exemplos usam temporizadores.
      const sozinho = await rodarLocal(bloco.codigo);
      const textoSozinho = sozinho.saida.map((l) => l.texto);
      const sozinhoCerto = !sozinho.erro && JSON.stringify(textoSozinho) === JSON.stringify(linhasEsperadas);

      if (!sozinhoCerto) {
        // Senão, ele depende dos anteriores: roda junto com eles (que terminam antes, com await).
        const resultado = await rodarLocal(`${acumulado}\n${bloco.codigo}`);
        expect(resultado.erro, `o exemplo deu erro: ${bloco.codigo}`).toBeNull();
        expect(
          resultado.saida.map((l) => l.texto),
          `saída de: ${bloco.codigo}`,
        ).toEqual([...esperado, ...linhasEsperadas]);
      }

      // Guarda o que os próximos exemplos podem usar. Um nome declarado de novo começa do zero.
      if (analisar(`${acumulado}\n${bloco.codigo}`).ok) {
        acumulado = `${acumulado}\n${bloco.codigo}`;
        esperado = [...esperado, ...linhasEsperadas];
      } else {
        acumulado = bloco.codigo;
        esperado = linhasEsperadas;
      }
    }
  });
});

describe('os exercícios', () => {
  it.each(porExercicio)('%s: a solução passa em todos os testes', async (_nome, exercicio) => {
    const resultado = await rodarLocal(exercicio.solucao, exercicio.testes, exercicio.documentoInicial);
    expect(resultado.erro, 'a solução deu erro').toBeNull();
    const falhas = resultado.testes.filter((t) => !t.passou).map((t) => `${t.descricao}: ${t.mensagem}`);
    expect(falhas).toEqual([]);
    expect(resultado.testes).toHaveLength(exercicio.testes.length);
  });

  it.each(porExercicio)('%s: o código inicial roda sem erro e não passa em nenhum teste', async (_nome, exercicio) => {
    expect(analisar(exercicio.codigoInicial).ok, 'o código inicial tem erro de escrita').toBe(true);
    const resultado = await rodarLocal(exercicio.codigoInicial, exercicio.testes, exercicio.documentoInicial);
    expect(resultado.erro, 'o código inicial deu erro ao rodar').toBeNull();
    // Nenhum teste pode passar de graça: um "certo" antes de o aluno fazer qualquer coisa
    // (por exemplo, "a lista original não mudou" quando a função nem devolve nada) engana.
    const deGraca = resultado.testes.filter((t) => t.passou).map((t) => t.descricao);
    expect(deGraca, 'testes que já passam com o código inicial').toEqual([]);
  });
});
