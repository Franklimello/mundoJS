import { PROGRESSO_VAZIO, type Progresso } from './tipos';

/** Só fica o que é "nome → data em texto". Tudo o mais é descartado. */
function somenteTextos(valor: unknown): Record<string, string> | null {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) return null;
  const limpos: Record<string, string> = {};
  for (const [chave, quando] of Object.entries(valor)) {
    if (typeof quando === 'string') limpos[chave] = quando;
  }
  return limpos;
}

/** Só aceita o que tem a forma esperada: o que está no navegador pode ter sido editado. */
export function lerProgressoSalvo(bruto: string | null): Progresso {
  if (!bruto) return PROGRESSO_VAZIO;
  try {
    const dados: unknown = JSON.parse(bruto);
    if (typeof dados !== 'object' || dados === null) return PROGRESSO_VAZIO;
    const concluidas = somenteTextos((dados as { concluidas?: unknown }).concluidas);
    if (!concluidas) return PROGRESSO_VAZIO;
    // Quem estudou antes dos exercícios múltiplos não tem este campo: começa vazio.
    const exerciciosConcluidos =
      somenteTextos((dados as { exerciciosConcluidos?: unknown }).exerciciosConcluidos) ?? {};
    return { versao: 1, concluidas, exerciciosConcluidos };
  } catch {
    return PROGRESSO_VAZIO;
  }
}

/** Somente importa a versão antiga. Nenhum dado novo é escrito no navegador. */
export async function importarLegado(enviar: (dados: unknown) => Promise<boolean>): Promise<void> {
  let armazenamento: Storage;
  let chaves: string[];
  try {
    armazenamento = window.localStorage;
    chaves = Object.keys(armazenamento).filter(
      (chave) => chave === 'rabisco:progresso:v1' || chave.startsWith('rabisco:rascunho:'),
    );
  } catch {
    return;
  }
  for (const chave of chaves) {
    const valor = armazenamento.getItem(chave);
    if (valor === null) continue;
    const importado =
      chave === 'rabisco:progresso:v1'
        ? await enviar({ tipo: 'importar-progresso', progresso: lerProgressoSalvo(valor) })
        : await enviar({ tipo: 'importar-rascunho', chave: chave.slice('rabisco:rascunho:'.length), codigo: valor });
    // Só remove depois de o servidor confirmar a importação.
    if (importado) armazenamento.removeItem(chave);
  }
}
