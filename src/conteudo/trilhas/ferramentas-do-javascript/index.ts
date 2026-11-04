import type { Trilha } from '../../tipos';
import { date } from './date';
import { desafioCompras } from './desafio-final';
import { json } from './json';
import { mathArredondamentos } from './math-arredondamentos';
import { mathSorteios } from './math-sorteios';
import { mathValores } from './math-valores';

export const ferramentasDoJavascript: Trilha = {
  slug: 'ferramentas-do-javascript',
  titulo: 'Math, JSON e Date',
  descricao:
    'Use ferramentas que já vêm no JavaScript: matemática, sorteios, conversão de dados e datas. Para quem já conhece funções, arrays e objetos.',
  modulos: [
    { titulo: 'Matemática com Math', licoes: [mathArredondamentos, mathValores, mathSorteios] },
    { titulo: 'Dados e datas', licoes: [json, date] },
    { titulo: 'Desafio final', licoes: [desafioCompras] },
  ],
};
