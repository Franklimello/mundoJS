'use client';

const pendentes = new Map<string, Promise<{ arquivados: number; incorporados: boolean }>>();

export function incorporarProgresso(usuarioId: string) {
  let pendente = pendentes.get(usuarioId);
  pendente ??= (async () => {
    const resposta = await fetch('/api/conta/vincular', { method: 'POST', headers: { 'X-MundoJS-Conta': usuarioId } });
    const dados = (await resposta.json()) as { erro?: string; arquivados: number; incorporados: boolean };
    if (!resposta.ok) throw new Error(dados.erro || 'Não foi possível salvar o progresso na conta.');
    return dados;
  })();
  pendentes.set(usuarioId, pendente);
  const atual = pendente;
  void atual
    .finally(() => {
      if (pendentes.get(usuarioId) === atual) pendentes.delete(usuarioId);
    })
    .catch(() => {});
  return atual;
}
