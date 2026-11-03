import type { Progresso } from './tipos';
import { importarLegado } from './legado';
import type { PosicaoEstudo } from '@/estudo/tipos';

export interface DadosSalvos {
  identidade: string;
  progresso: Progresso;
  rascunhos: Record<string, string>;
  ultimaAtividade?: PosicaoEstudo | null;
}

let inicializacao: Promise<void> | undefined;
let identidadeConhecida: string | undefined;

export function identidadeAtual(): string | undefined {
  return identidadeConhecida;
}

async function ler(): Promise<DadosSalvos> {
  const resposta = await fetch('/api/dados', { cache: 'no-store' });
  if (!resposta.ok) throw new Error('Não foi possível carregar seus dados. Tente novamente.');
  const dados = (await resposta.json()) as DadosSalvos;
  identidadeConhecida = dados.identidade;
  return dados;
}

/** Uma primeira requisição por aba evita criar cookies concorrentes. */
export async function prepararSessao() {
  inicializacao ??= ler()
    .then(() => importarLegado(enviar))
    .catch((erro: unknown) => {
      inicializacao = undefined;
      throw erro;
    });
  await inicializacao;
}

export async function carregarDados(): Promise<DadosSalvos> {
  await prepararSessao();
  return ler();
}

export async function salvarDados(dados: unknown, identidadeEsperada = identidadeConhecida): Promise<void> {
  await prepararSessao();
  await enviar(dados, identidadeEsperada ?? identidadeConhecida);
}

async function enviar(dados: unknown, identidadeEsperada = identidadeConhecida): Promise<boolean> {
  const corpo = { ...(dados as Record<string, unknown>), identidadeEsperada };
  const resposta = await fetch('/api/dados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
    keepalive: JSON.stringify(corpo).length < 50000,
  });
  if (!resposta.ok) throw new Error('Não foi possível salvar seus dados. Tente novamente.');
  const resultado = (await resposta.json()) as { importado?: boolean };
  return resultado.importado !== false;
}
