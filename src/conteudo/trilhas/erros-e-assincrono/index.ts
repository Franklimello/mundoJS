import type { Trilha } from '../../tipos';
import { asyncAwait } from './async-await';
import { desafioFinal } from './desafio-final';
import { lancarErros } from './lancar-erros';
import { promessas } from './promessas';
import { temporizadores } from './temporizadores';
import { tryCatch } from './try-catch';

export const errosEAssincrono: Trilha = {
  slug: 'erros-e-assincrono',
  titulo: 'Erros e código assíncrono',
  descricao:
    'Para quem já domina listas e funções. Como lidar com o que dá errado (try/catch, throw) e com o que demora (temporizadores, promessas, async/await).',
  modulos: [
    { titulo: 'Lidando com erros', licoes: [tryCatch, lancarErros] },
    { titulo: 'Código que espera', licoes: [temporizadores, promessas, asyncAwait] },
    { titulo: 'Desafio final', licoes: [desafioFinal] },
  ],
};
