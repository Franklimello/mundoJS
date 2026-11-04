import { describe, expect, it } from 'vitest';
import { analisar } from './analisar';
import { criarExecutor } from './executor';
import { traduzirErroDeExecucao } from './mensagens';
import { rodar } from './rodar';

const executar = criarExecutor();

describe('orientações de escrita', () => {
  it.each(['“', '”', '‘', '’'])('explica a aspa curva %s sem trocar o código do aluno', (aspa) => {
    const analise = analisar(`console.log(${aspa}Oi!${aspa});`);
    expect(analise.ok).toBe(false);
    if (analise.ok) return;
    expect(analise.erro.mensagem).toContain('aspas curvas');
    expect(analise.erro.dica).toContain('aspas retas');
    expect(analise.erro.exemplo?.codigo).toBe('console.log("Oi!");');
    expect(analise.erro.linha).toBe(1);
  });

  it.each([
    ['console.log("Oi!"', ')', '1'],
    ['const lista = [1, 2', ']', '1'],
    ['function exemplo() {\n const texto = "[(}";\n /* } ] */\n', '}', '1'],
    ['const a = 1;\nfunction exemplo() {\n  const lista = [1, 2', ']', '3'],
  ])('identifica o símbolo pendente em %s', (codigo, fecha, linha) => {
    const analise = analisar(codigo);
    expect(analise.ok).toBe(false);
    if (analise.ok) return;
    expect(analise.erro.mensagem).toContain(`falta fechar “${fecha}”`);
    expect(analise.erro.dica).toContain(`aberto na linha ${linha}`);
  });

  it('explica fechamento incompatível e não confunde vírgula ausente com fechamento', () => {
    const trocado = analisar('const lista = [1, 2);');
    expect(trocado.ok || trocado.erro.mensagem).toContain('não combina');
    expect(trocado.ok || trocado.erro.dica).toContain('fechado com “]”');
    const virgula = analisar('const lista = [1 2];');
    expect(virgula.ok || virgula.erro.mensagem).toContain('símbolo fora do lugar');
  });

  it.each([
    ['console.log("Oi!";', ')'],
    ['const lista = [1, 2, 3;', ']'],
  ])('orienta o fechamento antes de um ponto e vírgula em %s', (codigo, fecha) => {
    const analise = analisar(codigo);
    expect(analise.ok || analise.erro.mensagem).toContain(`Pode faltar fechar “${fecha}”`);
  });

  it('não sugere fechamento quando falta o valor após um operador', () => {
    const analise = analisar('console.log(1 + ;');
    expect(analise.ok || analise.erro.mensagem).toBe('Tem um símbolo fora do lugar aqui.');
  });

  it.each([
    'console.log("Aspas “curvas” e símbolos [ { (");',
    '// “Aspas”, [ e { em comentário\nconsole.log("Oi!");',
    'const nome = "Ana"; console.log(`Oi, ${nome}!`);',
    'const nome = "Ana"; console.log(`${[nome].join(", ")}`);',
  ])('preserva código válido com comentários, textos e templates: %s', (codigo) => {
    expect(analisar(codigo).ok).toBe(true);
  });

  it('mantém a mensagem específica de aspas sem fechar mesmo com parêntese pendente', () => {
    const analise = analisar('console.log("Oi!);');
    expect(analise.ok || analise.erro.mensagem).toBe('Faltou fechar as aspas deste texto.');
  });
});

describe('orientações de execução', () => {
  it.each([
    ['Console.log("Oi!");', 'letras minúsculas'],
    ['console.lgo("Oi!");', 'ordem das letras'],
    ['console.log(preço);', 'maiúsculas e minúsculas'],
    ['const pontos = 1; pontos = 2;', 'Use let'],
    ['console.log(pontos); const pontos = 1;', 'linha acima'],
    ['const pessoa = undefined; console.log(pessoa.nome);', 'variável foi preenchida'],
    ['const pessoa = null; console.log(pessoa.nome);', 'variável foi preenchida'],
    ['function buscar() {} buscar().then(console.log);', 'devolver uma promessa'],
  ])('oferece próximo passo e exemplo válido para %s', async (codigo, dica) => {
    const resultado = await rodar(codigo, [], executar);
    expect(resultado.erro?.dica).toContain(dica);
    const exemplo = resultado.erro?.exemplo;
    expect(exemplo).toBeDefined();
    const corrigido = await rodar(exemplo!.codigo, [], executar);
    expect(corrigido.erro).toBeNull();
  });

  it('preserva erros personalizados e a posição, sem inventar uma explicação', () => {
    expect(
      traduzirErroDeExecucao({ nome: 'Error', mensagem: 'Faltou preencher o nome.', linha: 3, coluna: 8 }),
    ).toEqual({
      nome: 'Error',
      mensagem: 'Faltou preencher o nome.',
      linha: 3,
      coluna: 8,
    });
  });
});
