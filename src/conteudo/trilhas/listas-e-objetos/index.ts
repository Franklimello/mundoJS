import type { Trilha } from '../../tipos';
import { desafioFinal } from './desafio-final';
import { listaDeObjetos } from './lista-de-objetos';
import { listas } from './listas';
import { mapFilter } from './map-filter';
import { objetos } from './objetos';
import { percorrer } from './percorrer';

export const listasEObjetos: Trilha = {
  slug: 'listas-e-objetos',
  titulo: 'Listas e objetos',
  descricao:
    'Para quem já sabe fazer funções e laços. Como guardar várias coisas juntas: listas, objetos e as ferramentas para trabalhar com eles.',
  modulos: [
    { titulo: 'Listas', licoes: [listas, percorrer, mapFilter] },
    { titulo: 'Objetos', licoes: [objetos, listaDeObjetos] },
    { titulo: 'Desafio final', licoes: [desafioFinal] },
  ],
};
