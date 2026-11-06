import { trilhas, todasAsLicoes } from '@/conteudo';
import type { Progresso } from '@/progresso/tipos';
import { chaveDoDesafio, DESAFIOS_RASCUNHO } from '@/conteudo/desafios-rascunho';
import { chaveDoTreino, topicos } from '@/documentacao';

const licoes = new Set<string>();
const exercicios = new Set<string>();
const rascunhos = new Set(['rascunho-livre', 'rascunho-web']);
for (const desafio of DESAFIOS_RASCUNHO) rascunhos.add(chaveDoDesafio(desafio));
for (const topico of topicos) {
  for (const secao of topico.secoes) {
    for (const metodo of secao.metodos) {
      rascunhos.add(chaveDoTreino(topico.slug, metodo.id));
    }
  }
}
for (const trilha of trilhas) {
  rascunhos.add(`projeto/${trilha.slug}`);
  for (const licao of todasAsLicoes(trilha)) {
    const chave = `${trilha.slug}/${licao.slug}`;
    licoes.add(chave);
    licao.exercicios.forEach((_, indice) => {
      exercicios.add(`${chave}#${indice}`);
      rascunhos.add(indice === 0 ? chave : `${chave}#${indice}`);
    });
  }
}

function objeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function mapaValido(valor: unknown, permitidas: Set<string>): boolean {
  return (
    objeto(valor) &&
    Object.entries(valor).every(
      ([chave, data]) =>
        permitidas.has(chave) &&
        typeof data === 'string' &&
        /^\d{4}-\d{2}-\d{2}T/.test(data) &&
        Number.isFinite(Date.parse(data)),
    )
  );
}

export function progressoValido(valor: unknown): valor is Progresso {
  return (
    objeto(valor) &&
    valor.versao === 1 &&
    mapaValido(valor.concluidas, licoes) &&
    mapaValido(valor.exerciciosConcluidos, exercicios)
  );
}

/** Dados de versões antigas podem referenciar conteúdo que já saiu do curso. */
export function filtrarProgressoLegado(valor: unknown): Progresso {
  const dados = objeto(valor) ? valor : {};
  function filtrar(mapa: unknown, permitidas: Set<string>): Record<string, string> {
    if (!objeto(mapa)) return {};
    return Object.fromEntries(
      Object.entries(mapa).filter(([chave, data]) => mapaValido({ [chave]: data }, permitidas)),
    ) as Record<string, string>;
  }
  return {
    versao: 1,
    concluidas: filtrar(dados.concluidas, licoes),
    exerciciosConcluidos: filtrar(dados.exerciciosConcluidos, exercicios),
  };
}

export function rascunhoValido(chave: unknown, codigo: unknown): chave is string {
  return (
    typeof chave === 'string' &&
    rascunhos.has(chave) &&
    (codigo === null || (typeof codigo === 'string' && Buffer.byteLength(codigo, 'utf8') <= 200000))
  );
}
