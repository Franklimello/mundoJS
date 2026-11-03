import { carregarDados, salvarDados, identidadeAtual } from './api';

// Ordena gravações por folha para uma resposta lenta não restaurar código antigo.
const filas = new Map<string, Promise<void>>();

export async function lerRascunho(chave: string): Promise<{ codigo: string | null; identidade: string }> {
  await filas.get(chave);
  const dados = await carregarDados();
  return { codigo: dados.rascunhos[chave] ?? null, identidade: dados.identidade };
}

function gravar(chave: string, codigo: string | null, identidade = identidadeAtual()): Promise<void> {
  const tarefa = (filas.get(chave) ?? Promise.resolve())
    .catch(() => {})
    .then(() => salvarDados({ tipo: 'rascunho', chave, codigo }, identidade));
  filas.set(chave, tarefa);
  void tarefa
    .finally(() => {
      if (filas.get(chave) === tarefa) filas.delete(chave);
    })
    .catch(() => {});
  return tarefa;
}

export function salvarRascunho(chave: string, codigo: string, identidade?: string): Promise<void> {
  return gravar(chave, codigo, identidade);
}

export function apagarRascunho(chave: string, identidade?: string): Promise<void> {
  return gravar(chave, null, identidade);
}
