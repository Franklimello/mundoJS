import type { Trilha } from '../../tipos';
import { desafioFinal } from './desafio-final';
import { desmontarECopiar } from './desmontar-e-copiar';
import { escopo } from './escopo';
import { metodosDeTexto } from './metodos-de-texto';
import { ordenar } from './ordenar';
import { procurando } from './procurando';
import { reduce } from './reduce';
import { splitEJoin } from './split-e-join';

export const listasETextosDeVerdade: Trilha = {
  slug: 'listas-e-textos-de-verdade',
  titulo: 'Listas e textos de verdade',
  descricao:
    'Para quem já passou pelos fundamentos. As ferramentas que quem programa usa todo dia: métodos de texto, find, reduce, sort, desestruturação e escopo.',
  modulos: [
    { titulo: 'Textos', licoes: [metodosDeTexto, splitEJoin] },
    { titulo: 'Listas de verdade', licoes: [procurando, reduce, desmontarECopiar, ordenar] },
    { titulo: 'Funções por dentro', licoes: [escopo] },
    { titulo: 'Desafio final', licoes: [desafioFinal] },
  ],
};
