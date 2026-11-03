'use client';

import type { TesteDefinicao } from '@/engine/tipos';
import { Folha } from './Folha';
import { CompartilharProjeto } from './CompartilharProjeto';

export function ProjetoInterativo({
  trilha,
  codigoInicial,
  testes,
}: {
  trilha: string;
  codigoInicial: string;
  testes: TesteDefinicao[];
}) {
  return (
    <div id="editor-do-projeto" className="projeto-editor" tabIndex={-1}>
      <Folha
        titulo="Meu projeto"
        rotuloDoEditor="Editor do projeto"
        codigoInicial={codigoInicial}
        testes={testes}
        chaveRascunho={`projeto/${trilha}`}
        pautasMinimas={18}
        contextoTutor={{ projeto: trilha }}
        aoAcertar={
          <p className="depois">
            Todos os testes do projeto passaram. Experimente outros dados e, se quiser, compartilhe sua versão abaixo.
          </p>
        }
        rodape={({ codigo, identidade }) => (
          <CompartilharProjeto trilha={trilha} codigo={codigo} identidade={identidade} />
        )}
      />
    </div>
  );
}
