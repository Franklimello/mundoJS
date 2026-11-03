'use client';

import { Folha } from './Folha';

/** As folhas fora das lições: a livre e a da vitrine. A da lição está em `LicaoInterativa.tsx`. */

const CODIGO_DO_RASCUNHO = [
  '// Aqui você escreve e roda o que quiser.',
  '// Aperte Ctrl + Enter para ver o resultado.',
  '',
  'console.log("Olá, MundoJS!");',
  '',
].join('\n');

export function FolhaDoRascunho() {
  return (
    <Folha
      titulo="Rascunho"
      rotuloDoEditor="Editor de código livre"
      codigoInicial={CODIGO_DO_RASCUNHO}
      chaveRascunho="rascunho-livre"
      contextoTutor={{ livre: true }}
      pautasMinimas={18}
    />
  );
}

const CODIGO_DA_VITRINE = [
  'const nome = "Ana";',
  '',
  'for (let i = 1; i <= 3; i++) {',
  '  console.log(`Olá, ${nome}! (volta ${i})`);',
  '}',
  '',
].join('\n');

/** A folha da página inicial: já abre rodando, e roda de novo enquanto a pessoa digita. */
export function FolhaDaVitrine() {
  return (
    <Folha
      titulo="Experimente"
      rotuloDoEditor="Editor de código de exemplo"
      codigoInicial={CODIGO_DA_VITRINE}
      rodarAoDigitar
      pautasMinimas={7}
    />
  );
}
