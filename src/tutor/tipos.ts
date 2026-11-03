export type ContextoTutor = { trilha: string; licao: string; indice: number } | { livre: true } | { projeto: string };
export type NivelAjuda = 'pista' | 'explicacao' | 'exemplo';

export interface HistoricoTutor {
  tentativas: number;
  semAcerto: number;
  ajudas: number;
  topicosParaRetomar: string[];
}

export interface ApoioTutor {
  nivel: NivelAjuda;
  historico: HistoricoTutor | null;
}

export interface MensagemTutor {
  papel: 'usuario' | 'tutor';
  texto: string;
}

export interface PedidoTutor {
  nivelAjuda?: NivelAjuda;
  contexto: ContextoTutor;
  codigo: string;
  diagnostico: string;
  mensagens: MensagemTutor[];
}
