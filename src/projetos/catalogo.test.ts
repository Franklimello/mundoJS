import { describe, expect, it } from 'vitest';
import { analisar } from '@/engine/analisar';
import { criarExecutor } from '@/engine/executor';
import { rodar } from '@/engine/rodar';
import { rascunhoValido } from '@/servidor/validacao';
import { buscarProjeto, catalogoProjetos } from './catalogo';

const executor = criarExecutor();
describe('projetos integrados', () => {
  it.each(catalogoProjetos.map((meta) => [meta.trilha]))(
    '%s tem código inicial válido e todas as soluções funcionam juntas',
    async (slug) => {
      const projeto = buscarProjeto(slug)!;
      expect(analisar(projeto.codigoInicial).ok).toBe(true);
      expect(rascunhoValido(`projeto/${slug}`, projeto.codigoInicial)).toBe(true);
      const inicial = await rodar(projeto.codigoInicial, projeto.testes, executor);
      expect(inicial.erro).toBeNull();
      expect(inicial.testes.every((teste) => !teste.passou)).toBe(true);
      // A segunda etapa do ranking já inclui o helper resolvido na lição isolada.
      const solucao = projeto.etapas
        .filter((_, i) => !(slug === 'listas-e-textos-de-verdade' && i === 0))
        .map((etapa) => etapa.solucao)
        .join('\n');
      const resultado = await rodar(solucao, projeto.testes, executor);
      expect(resultado.erro).toBeNull();
      expect(resultado.testes.filter((teste) => !teste.passou)).toEqual([]);
      expect(resultado.testes.length).toBe(projeto.testes.length);
      const comDados = await rodar(
        `${projeto.dadosIniciais}\n${solucao}\n${projeto.demonstracao}`,
        projeto.testes,
        executor,
      );
      expect(comDados.erro, 'os dados do projeto não podem quebrar as funções corretas').toBeNull();
      expect(comDados.testes.filter((teste) => !teste.passou)).toEqual([]);
    },
  );
  it('não aceita projetos desconhecidos como rascunhos', () => {
    expect(buscarProjeto('fora-do-curso')).toBeUndefined();
    expect(rascunhoValido('projeto/fora-do-curso', 'codigo')).toBe(false);
  });
});
