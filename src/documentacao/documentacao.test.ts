import { describe, expect, it } from 'vitest';
import { criarExecutor } from '@/engine/executor';
import { rodar } from '@/engine/rodar';
import { buscarTopico, topicos } from './index';

const executor = criarExecutor();
const metodos = topicos.flatMap((topico) =>
  topico.secoes.flatMap((secao) => secao.metodos.map((metodo) => ({ topico, metodo }))),
);
const exemplos = metodos.flatMap(({ topico, metodo }) =>
  metodo.exemplos.map((exemplo, i) => [`${topico.slug}#${metodo.id} (${i + 1})`, exemplo] as const),
);

describe('estrutura da documentação', () => {
  it('os tópicos têm endereços únicos e válidos', () => {
    const slugs = topicos.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('as âncoras dos métodos são únicas dentro do tópico', () => {
    for (const topico of topicos) {
      const ids = topico.secoes.flatMap((s) => s.metodos.map((m) => m.id));
      expect(new Set(ids).size, `âncoras repetidas em ${topico.slug}`).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('todo método tem pelo menos um exemplo', () => {
    for (const { topico, metodo } of metodos) {
      expect(metodo.exemplos.length, `${topico.slug}#${metodo.id}`).toBeGreaterThan(0);
    }
  });

  it('buscarTopico encontra pelo endereço', () => {
    expect(buscarTopico('strings')?.titulo).toBe('Manipulação de strings');
    expect(buscarTopico('nao-existe')).toBeUndefined();
  });
});

describe('os exemplos mostram o que a documentação diz', () => {
  it.each(exemplos)('%s', async (_, exemplo) => {
    const resultado = await rodar(exemplo.codigo, [], executor, { esperaMaximaMs: 1000, limiteDeVoltas: 200_000 });
    expect(resultado.erro).toBeNull();
    expect(resultado.saida.map((linha) => linha.texto)).toEqual(exemplo.saida.split('\n'));
  });
});

const treinos = metodos.map(({ topico, metodo }) => [`${topico.slug}#${metodo.id}`, metodo.treino] as const);
const rodarTreino = (codigo: string, testes: Parameters<typeof rodar>[1]) =>
  rodar(codigo, testes, executor, { esperaMaximaMs: 1000, limiteDeVoltas: 200_000 });

describe('os treinos', () => {
  it.each(treinos)('%s está completo', (_, treino) => {
    expect(treino.enunciado.length).toBeGreaterThan(0);
    expect(treino.testes.length).toBeGreaterThan(0);
    expect(treino.dicas.length).toBeGreaterThan(0);
    const descricoes = treino.testes.map((t) => t.descricao);
    expect(new Set(descricoes).size).toBe(descricoes.length);
  });

  it.each(treinos)('%s: a solução passa em todos os testes', async (_, treino) => {
    const resultado = await rodarTreino(treino.solucao, treino.testes);
    expect(resultado.erro).toBeNull();
    expect(resultado.testes.filter((t) => !t.passou).map((t) => `${t.descricao}: ${t.mensagem}`)).toEqual([]);
    expect(resultado.testes).toHaveLength(treino.testes.length);
  });

  it.each(treinos)('%s: o código inicial roda sem erro e não passa em nenhum teste', async (_, treino) => {
    const resultado = await rodarTreino(treino.codigoInicial, treino.testes);
    expect(resultado.erro).toBeNull();
    expect(resultado.testes.filter((t) => t.passou).map((t) => t.descricao)).toEqual([]);
  });
});
