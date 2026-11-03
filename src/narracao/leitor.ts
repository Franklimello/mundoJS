import { dividirNarracao } from './texto';

export type EstadoNarracao = 'parado' | 'preparando' | 'falando' | 'pausado' | 'concluido' | 'erro';
type Motor = Pick<SpeechSynthesis, 'speak' | 'cancel' | 'pause' | 'resume' | 'getVoices'>;

/** Uma única fila, invalidada ao parar/trocar de exercício, inclusive callbacks tardios. */
export class LeitorNarracao {
  private estado: EstadoNarracao = 'parado';
  private geracao = 0;
  private partes: string[] = [];
  private indice = 0;
  private fala: SpeechSynthesisUtterance | null = null;
  private espera: ReturnType<typeof setTimeout> | undefined;
  private velocidade = 1;
  private voz: SpeechSynthesisVoice | undefined;
  private iniciouFala = false;

  constructor(
    private motor: Motor,
    private criarFala: (texto: string) => SpeechSynthesisUtterance,
    private avisar: (estado: EstadoNarracao, erro?: string) => void,
  ) {}

  private mudar(estado: EstadoNarracao, erro?: string) {
    this.estado = estado;
    this.avisar(estado, erro);
  }

  private limpar() {
    this.geracao++;
    clearTimeout(this.espera);
    this.fala = null;
    this.motor.cancel();
  }

  parar() {
    this.limpar();
    this.mudar('parado');
  }
  encerrar() {
    this.limpar();
  }

  iniciar(texto: string, velocidade = 1) {
    this.limpar();
    this.partes = dividirNarracao(texto);
    this.indice = 0;
    this.velocidade = velocidade;
    const vozes = this.motor.getVoices();
    const portugues = vozes.filter((voz) => /^pt(?:-|_)/i.test(voz.lang) || voz.lang.toLowerCase() === 'pt');
    this.voz =
      portugues.find((voz) => /^pt[-_]br$/i.test(voz.lang) && voz.localService) ??
      portugues.find((voz) => /^pt[-_]br$/i.test(voz.lang)) ??
      portugues[0];
    if (vozes.length && !this.voz) {
      this.mudar(
        'erro',
        'Não encontramos uma voz em português. Adicione uma nas configurações de voz do seu dispositivo e tente novamente.',
      );
      return;
    }
    if (!this.partes.length) {
      this.mudar('concluido');
      return;
    }
    this.mudar('preparando');
    this.proxima();
  }

  private proxima() {
    const texto = this.partes[this.indice];
    if (texto === undefined) {
      this.mudar('concluido');
      return;
    }
    const geracao = this.geracao;
    const fala = this.criarFala(texto);
    this.iniciouFala = false;
    this.fala = fala;
    fala.lang = this.voz?.lang || 'pt-BR';
    if (this.voz) fala.voice = this.voz;
    fala.rate = this.velocidade;
    fala.onstart = () => {
      if (geracao !== this.geracao) return;
      clearTimeout(this.espera);
      this.iniciouFala = true;
      if (this.estado !== 'pausado') this.mudar('falando');
    };
    fala.onend = () => {
      if (geracao !== this.geracao) return;
      clearTimeout(this.espera);
      this.fala = null;
      this.indice++;
      if (this.estado !== 'pausado') this.proxima();
    };
    fala.onerror = () => {
      if (geracao !== this.geracao) return;
      this.limpar();
      this.mudar(
        'erro',
        'Não foi possível reproduzir a narração. Confira o som e as vozes do dispositivo e tente novamente.',
      );
    };
    this.espera = setTimeout(() => {
      if (geracao !== this.geracao) return;
      this.limpar();
      this.mudar('erro', 'A voz não respondeu. Tente novamente ou use outro navegador com uma voz em português.');
    }, 10000);
    try {
      this.motor.speak(fala);
    } catch {
      fala.onerror?.({} as SpeechSynthesisErrorEvent);
    }
  }

  pausar() {
    if (this.estado !== 'falando') return;
    clearTimeout(this.espera);
    this.motor.pause();
    this.mudar('pausado');
  }

  continuar() {
    if (this.estado !== 'pausado') return;
    this.mudar('falando');
    if (this.fala && this.iniciouFala) this.motor.resume();
    else if (this.fala) {
      // Alguns motores terminam o trecho anterior antes de começar o próximo.
      // Reinicia somente o trecho pendente para retomar com um novo gesto do usuário.
      this.limpar();
      this.proxima();
    } else this.proxima();
  }
}
