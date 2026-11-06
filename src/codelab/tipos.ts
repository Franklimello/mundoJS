export type LinguagemArquivo = 'javascript' | 'typescript' | 'json' | 'prisma' | 'sql' | 'markdown';

export interface ParametroFuncao {
  nome: string;
  tipo: string;
  descricao: string;
  obrigatorio?: boolean;
}

export interface MetodoExplicacao {
  nome: string;
  assinatura: string;
  descricao: string;
  parametros?: ParametroFuncao[];
  retorno?: string;
  exemploUso?: string;
}

export interface ExemploUsoArquivo {
  titulo: string;
  descricao: string;
  codigo: string;
  saida?: string;
}

export interface RelacionamentosArquivo {
  importaDe?: { arquivo: string; motivo: string }[];
  usadoPor?: { arquivo: string; motivo: string }[];
  origemDosDados?: string;
  destinoDosDados?: string;
}

export interface ReferenciaOficial {
  titulo: string;
  url: string;
  descricao?: string;
}

export interface DocumentacaoArquivo {
  /** Resumo em uma linha da responsabilidade do arquivo */
  resumo: string;
  /** Papel arquitetural no projeto */
  responsabilidade: string;
  /** Explicação detalhada de como o código opera */
  comoFunciona?: string;
  /** Justificativa técnica da abordagem / design pattern */
  porQueEssaAbordagem?: string;
  /** Métodos e funções exportados ou relevantes */
  metodos?: MetodoExplicacao[];
  /** Exemplos práticos de uso e entrada/saída */
  exemplos?: ExemploUsoArquivo[];
  /** Dependências e fluxo de dados com outros arquivos */
  relacionamentos?: RelacionamentosArquivo;
  /** Boas práticas arquiteturais adotadas */
  boasPraticas?: string[];
  /** Erros e armadilhas comuns ao lidar com essa estrutura */
  errosComuns?: string[];
  /** Links para a documentação oficial da tecnologia */
  referencias?: ReferenciaOficial[];
}

export interface ArquivoCodeLab {
  id: string; // Ex: 'api-express-sequelize:src/controllers/UsuarioController.js'
  caminho: string; // Ex: 'src/controllers/UsuarioController.js'
  nome: string; // Ex: 'UsuarioController.js'
  linguagem: LinguagemArquivo;
  conteudo: string;
  documentacao: DocumentacaoArquivo;
}

export interface PastaCodeLab {
  nome: string; // Ex: 'controllers'
  caminho: string; // Ex: 'src/controllers'
  pastas: PastaCodeLab[];
  arquivos: ArquivoCodeLab[];
}

export interface ProjetoCodeLab {
  id: string; // Ex: 'api-express-sequelize'
  nome: string; // Ex: 'API Node.js + Express + Sequelize'
  slug: string;
  descricao: string;
  icone: string;
  tags: string[];
  versao?: string;
  arquivoPadrao: string; // Caminho do arquivo exibido ao abrir o projeto
  estrutura: {
    pastas: PastaCodeLab[];
    arquivosRaiz: ArquivoCodeLab[];
  };
}

export interface ResultadoBusca {
  arquivo: ArquivoCodeLab;
  tipo: 'nome' | 'metodo' | 'conteudo' | 'responsabilidade';
  correspondencia: string;
  linha?: number;
  trecho?: string;
}
