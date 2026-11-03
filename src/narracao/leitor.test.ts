import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LeitorNarracao } from './leitor';

function preparar(vozes = [{ lang: 'pt-BR', localService: true }] as SpeechSynthesisVoice[]) {
  const falas: SpeechSynthesisUtterance[] = [];
  const motor = { speak: vi.fn(), cancel: vi.fn(), pause: vi.fn(), resume: vi.fn(), getVoices: () => vozes };
  const avisar = vi.fn();
  const leitor = new LeitorNarracao(
    motor,
    (texto) => {
      const fala = { text: texto } as SpeechSynthesisUtterance;
      falas.push(fala);
      return fala;
    },
    avisar,
  );
  return { leitor, motor, avisar, falas };
}
function comecar(fala: SpeechSynthesisUtterance) {
  fala.onstart?.({} as SpeechSynthesisEvent);
}
function terminar(fala: SpeechSynthesisUtterance) {
  fala.onend?.({} as SpeechSynthesisEvent);
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('controle da narração', () => {
  it('só fala após início explícito, escolhe português e aplica a velocidade', () => {
    const { leitor, motor, falas, avisar } = preparar();
    expect(motor.speak).not.toHaveBeenCalled();
    leitor.iniciar('Olá. Vamos praticar.', 0.8);
    expect(falas[0]).toMatchObject({ text: 'Olá. Vamos praticar.', lang: 'pt-BR', rate: 0.8 });
    expect(avisar).toHaveBeenLastCalledWith('preparando', undefined);
    comecar(falas[0]!);
    expect(avisar).toHaveBeenLastCalledWith('falando', undefined);
    terminar(falas[0]!);
    expect(avisar).toHaveBeenLastCalledWith('concluido', undefined);
  });
  it('pausa e continua, inclusive quando uma fala acaba durante a pausa', () => {
    const { leitor, motor, falas, avisar } = preparar();
    leitor.iniciar('Uma frase para praticar. '.repeat(20));
    comecar(falas[0]!);
    leitor.pausar();
    expect(motor.pause).toHaveBeenCalledOnce();
    expect(avisar).toHaveBeenLastCalledWith('pausado', undefined);
    leitor.continuar();
    expect(motor.resume).toHaveBeenCalledOnce();
    leitor.pausar();
    terminar(falas[0]!);
    expect(falas).toHaveLength(1);
    leitor.continuar();
    expect(falas).toHaveLength(2);
    leitor.parar();
  });
  it('não continua nem altera o exercício novo com callbacks de uma fala cancelada', () => {
    const { leitor, falas, avisar } = preparar();
    leitor.iniciar('Exercício anterior. '.repeat(20));
    const anterior = falas[0]!;
    leitor.iniciar('Exercício novo.');
    comecar(falas[1]!);
    const quantidade = avisar.mock.calls.length;
    terminar(anterior);
    anterior.onerror?.({} as SpeechSynthesisErrorEvent);
    expect(falas).toHaveLength(2);
    expect(avisar).toHaveBeenCalledTimes(quantidade);
    expect(avisar).toHaveBeenLastCalledWith('falando', undefined);
    leitor.encerrar();
    terminar(falas[1]!);
    vi.advanceTimersByTime(11000);
    expect(avisar).toHaveBeenCalledTimes(quantidade);
  });
  it('não expira enquanto está pausado entre dois trechos', () => {
    const { leitor, falas, avisar } = preparar();
    leitor.iniciar('Uma frase para praticar. '.repeat(20));
    comecar(falas[0]!);
    terminar(falas[0]!);
    leitor.pausar();
    vi.advanceTimersByTime(20000);
    expect(avisar).toHaveBeenLastCalledWith('pausado', undefined);
    leitor.continuar();
    comecar(falas[2]!);
    expect(avisar).toHaveBeenLastCalledWith('falando', undefined);
    leitor.encerrar();
  });
  it('percorre trechos longos até concluir, sem cortar o texto', () => {
    const { leitor, falas, avisar } = preparar();
    const texto = 'Uma frase com instruções. '.repeat(30).trim();
    leitor.iniciar(texto);
    for (let i = 0; i < falas.length; i++) {
      comecar(falas[i]!);
      terminar(falas[i]!);
    }
    expect(falas.map((fala) => fala.text).join(' ')).toBe(texto);
    expect(avisar).toHaveBeenLastCalledWith('concluido', undefined);
  });
  it('sai do carregamento quando o motor não responde e ignora seus eventos tardios', () => {
    const { leitor, falas, avisar } = preparar();
    leitor.iniciar('Teste sem resposta.');
    vi.advanceTimersByTime(10000);
    expect(avisar).toHaveBeenLastCalledWith('erro', expect.stringContaining('não respondeu'));
    const quantidade = avisar.mock.calls.length;
    comecar(falas[0]!);
    terminar(falas[0]!);
    expect(avisar).toHaveBeenCalledTimes(quantidade);
  });
  it('mostra erro de reprodução e permite tentar novamente', () => {
    const { leitor, falas, avisar } = preparar();
    leitor.iniciar('Teste.');
    falas[0]!.onerror?.({} as SpeechSynthesisErrorEvent);
    expect(avisar).toHaveBeenLastCalledWith('erro', expect.stringContaining('Não foi possível'));
    leitor.iniciar('Tente novamente.');
    comecar(falas[1]!);
    expect(avisar).toHaveBeenLastCalledWith('falando', undefined);
  });
  it('recusa voz em outro idioma em vez de ler português com uma voz inglesa', () => {
    const { leitor, motor, avisar } = preparar([{ lang: 'en-US', localService: true }] as SpeechSynthesisVoice[]);
    leitor.iniciar('Olá.');
    expect(motor.speak).not.toHaveBeenCalled();
    expect(avisar).toHaveBeenLastCalledWith('erro', expect.stringContaining('voz em português'));
  });
  it('usa pt-BR quando a lista de vozes ainda não carregou', () => {
    const { leitor, falas } = preparar([]);
    leitor.iniciar('Olá.');
    expect(falas[0]!.lang).toBe('pt-BR');
  });
});
