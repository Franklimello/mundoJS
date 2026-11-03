import type { Bloco, Exercicio } from '@/conteudo/tipos';

function textoFalado(texto: string): string {
  return texto.replace(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g, (trecho) => {
    if (trecho.startsWith('`')) {
      const codigo = trecho.slice(1, -1);
      if (/^\*+$/.test(codigo)) return `${codigo.length} ${codigo.length === 1 ? 'asterisco' : 'asteriscos'}`;
      return codigo.replaceAll('console.log', 'console ponto log');
    }
    return trecho.startsWith('**') ? trecho.slice(2, -2) : trecho.slice(1, -1);
  });
}

function narrarBloco(bloco: Bloco): string {
  switch (bloco.tipo) {
    case 'p':
    case 'nota':
      return textoFalado(bloco.texto);
    case 'lista':
      return bloco.itens.map((item, i) => `Item ${i + 1}. ${textoFalado(item)}`).join('\n');
    case 'codigo':
      return `Exemplo de código. ${bloco.codigo.replaceAll('console.log', 'console ponto log')}${bloco.saida === undefined ? '' : `\nEsse exemplo mostra: ${bloco.saida}`}`;
  }
}

/** Só usa conteúdo didático público; dicas e solução não entram na narração. */
export function narracaoDoExercicio(
  exercicio: Pick<Exercicio, 'titulo' | 'enunciado' | 'explicacaoAudio'>,
  indice: number,
  total: number,
): string {
  return [
    `Exercício ${indice + 1} de ${total}.${exercicio.titulo ? ` ${textoFalado(exercicio.titulo)}.` : ''}`,
    'O que você vai fazer:',
    ...exercicio.enunciado.map(narrarBloco),
    ...(exercicio.explicacaoAudio ? [textoFalado(exercicio.explicacaoAudio)] : []),
    'Escreva sua tentativa no editor. Use Rodar para ver a saída e Conferir para verificar o exercício. Você pode pausar esta narração e ouvir novamente quando quiser.',
  ].join('\n\n');
}

/** Falas curtas evitam o corte de trechos longos por alguns motores de voz. */
export function dividirNarracao(texto: string, limite = 180): string[] {
  const partes: string[] = [];
  let restante = texto.replace(/\s+/g, ' ').trim();
  while (restante.length > limite) {
    const trecho = restante.slice(0, limite + 1);
    const fimFrase = [...trecho.matchAll(/[.!?](?=\s)/g)].at(-1)?.index;
    const espaco = trecho.lastIndexOf(' ');
    const corte = fimFrase !== undefined && fimFrase > limite / 3 ? fimFrase + 1 : espaco > 0 ? espaco : limite;
    partes.push(restante.slice(0, corte));
    restante = restante.slice(corte).trim();
  }
  if (restante) partes.push(restante);
  return partes;
}
