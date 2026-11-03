import type { Trilha } from '../../tipos';
import { contas } from './contas';
import { desafioFinal } from './desafio-final';
import { eOu } from './e-ou';
import { enquanto } from './enquanto';
import { funcoes } from './funcoes';
import { lacos } from './lacos';
import { olaMundo } from './ola-mundo';
import { seSenao } from './se-senao';
import { textos } from './textos';
import { variaveis } from './variaveis';

export const javascriptDoZero: Trilha = {
  slug: 'javascript-do-zero',
  titulo: 'JavaScript do zero',
  descricao:
    'Para quem nunca programou. Do primeiro console.log até funções, decisões e laços, sempre escrevendo e rodando código.',
  modulos: [
    { titulo: 'Primeiros passos', licoes: [olaMundo, variaveis, contas, textos] },
    { titulo: 'Funções', licoes: [funcoes] },
    { titulo: 'Decisões', licoes: [seSenao, eOu] },
    { titulo: 'Repetição', licoes: [lacos, enquanto] },
    { titulo: 'Desafio final', licoes: [desafioFinal] },
  ],
};
