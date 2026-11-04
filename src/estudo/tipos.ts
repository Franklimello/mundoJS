export interface PosicaoEstudo {
  trilha: string;
  licao: string;
  indice: number;
}

export type TipoEventoEstudo =
  'visita' | 'exercicio_aberto' | 'codigo_rodado' | 'exercicio_conferido' | 'ajuda_pedida' | 'ajuda_recebida';

export interface EventoEstudo {
  id: string;
  tipo: TipoEventoEstudo;
  posicao?: PosicaoEstudo;
  passou?: boolean;
  pagina?: import('./origem').PaginaEntrada;
  canal?: import('./origem').CanalEntrada;
}

export interface LicaoParaRetomar {
  trilha: string;
  licao: string;
  titulo: string;
  tituloTrilha: string;
  total: number;
}
