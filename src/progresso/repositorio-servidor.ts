import { carregarDados, salvarDados } from './api';
import type { RepositorioProgresso } from './tipos';
let identidade: string | undefined;

export const repositorioServidor: RepositorioProgresso = {
  async carregar() {
    const dados = await carregarDados();
    identidade = dados.identidade;
    return dados.progresso;
  },
  async salvar(progresso) {
    await salvarDados({ tipo: 'progresso', progresso }, identidade);
  },
  identidade: () => identidade,
};
