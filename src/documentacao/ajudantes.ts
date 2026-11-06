import type { TesteDefinicao } from '@/engine/tipos';
import type { TreinoDoc } from './tipos';

/** Algo que o código do aluno precisa usar, conferido por uma expressão regular. */
export interface Uso {
  padrao: string;
  nome: string;
}

/** Exige `texto.nome(`. */
export function metodo(nome: string): Uso {
  return { padrao: `\\.${nome}\\s*\\(`, nome: `${nome}()` };
}

/** Exige `texto.nome`, sem parênteses. */
export function propriedade(nome: string): Uso {
  return { padrao: `\\.${nome}\\b`, nome };
}

interface ModeloDeTreino {
  enunciado: string[];
  /** Linhas do editor quando o treino abre. */
  inicial: string[];
  /** Nome da variável → valor que ela precisa ter no fim. */
  esperados: Record<string, unknown>;
  usa: Uso[];
  /** O último texto que o `console.log` precisa mostrar. Opcional. */
  mostra?: string;
  dicas: string[];
  /** Linhas que, somadas às iniciais, resolvem o treino. */
  resposta: string[];
}

const texto = (valor: unknown) => JSON.stringify(valor);

/**
 * Monta um treino no formato mais comum da documentação: o aluno cria uma ou
 * mais variáveis usando o método e mostra o resultado.
 */
export function treino({ enunciado, inicial, esperados, usa, mostra, dicas, resposta }: ModeloDeTreino): TreinoDoc {
  const testes: TesteDefinicao[] = [
    ...Object.entries(esperados).map(([nome, valor]) => ({
      descricao: `\`${nome}\` vale ${texto(valor)}`,
      codigo: `verdadeiro(typeof ${nome} !== 'undefined', ${texto(`Crie a variável ${nome}.`)});\nigual(${nome}, ${texto(valor)}, ${texto(nome)});`,
    })),
    ...usa.map((uso) => ({
      descricao: `Usa ${uso.nome}`,
      codigo: `verdadeiro(new RegExp(${texto(uso.padrao)}).test(codigoDoAluno), ${texto(`Resolva usando ${uso.nome}.`)});`,
    })),
  ];
  if (mostra !== undefined) {
    testes.push({
      descricao: 'O resultado foi mostrado',
      codigo: `igual(saida[saida.length - 1], ${texto(mostra)}, 'O último texto mostrado');`,
    });
  }
  const codigoInicial = `${inicial.join('\n')}\n\n`;
  return { enunciado, codigoInicial, testes, dicas, solucao: `${codigoInicial}${resposta.join('\n')}\n` };
}
