export interface ControlesEditor {
  focar: () => void;
  irParaLinha: (linha: number) => void;
  inserirDados: (texto: string) => void;
}
