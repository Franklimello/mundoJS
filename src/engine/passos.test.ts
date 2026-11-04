import { describe, expect, it, vi } from 'vitest';
import { prepararPassos } from './passos';
import { criarExecutor } from './executor';
import { rodar } from './rodar';

const executor = criarExecutor();
const revisar = (codigo: string) => rodar(codigo, [], executor, { passoAPasso: true, esperaMaximaMs: 50 });
const valores = (r: Awaited<ReturnType<typeof revisar>>) =>
  r.passoAPasso!.passos.map((p) => Object.fromEntries(p.variaveis.map((v) => [v.nome, v.valor])));

describe('registro de execução passo a passo', () => {
  it('limita valores registrados e recusa programas acima dos limites antes de executar', async () => {
    const r = await revisar(`let texto = 'x'; for (let i = 0; i < 12; i++) texto += texto;
const lista = [texto, texto, texto, texto, texto, texto, texto, texto, texto, texto];`);
    expect(r.erro).toBeNull();
    expect(r.passoAPasso!.passos.flatMap((p) => p.variaveis).every((v) => v.valor.length <= 300)).toBe(true);
    const executar = vi.fn();
    for (const codigo of [
      ' '.repeat(20_001),
      Array.from({ length: 17 }, (_, i) => `let n${i} = ${i};`).join(''),
      `const n = [${'1,'.repeat(3000)}];`,
    ]) {
      const recusado = await rodar(codigo, [], executar, { passoAPasso: true });
      expect(recusado.passoAPasso?.indisponivel).toBeDefined();
    }
    expect(executar).not.toHaveBeenCalled();
  });
  it('não lê nomes antes da inicialização quando um bloco oculta uma variável externa', async () => {
    const r = await revisar(`let n = 10;
{ console.log('antes'); let n = 20; console.log(n); }
const frutas = ['laranja'];
for (const fruta of frutas) { console.log('volta'); const fruta = 'mamão'; console.log(fruta); }
console.log(n);`);
    expect(r.erro).toBeNull();
    expect(r.saida.map((linha) => linha.texto)).toEqual(['antes', '20', 'volta', 'mamão', '10']);
    expect(valores(r).at(-1)).toMatchObject({ n: '10' });
  });
  it('registra o exemplo de frutas com valores, voltas e saída incremental', async () => {
    const r = await revisar(`const frutas = ['laranja', 'mamão'];
for (const fruta of frutas) {
  console.log(fruta);
}`);
    expect(r.erro).toBeNull();
    expect(r.saida.map((l) => l.texto)).toEqual(['laranja', 'mamão']);
    const passos = r.passoAPasso!.passos;
    expect(passos[0]?.variaveis).toEqual([]);
    expect(passos.filter((p) => p.descricao === 'Começou uma volta do laço').map((p) => p.lacos[0]?.volta)).toEqual([
      1, 2,
    ]);
    expect(passos.filter((p) => p.linha === 3).map((p) => p.linhasSaida)).toEqual([1, 2]);
    expect(passos.at(-1)?.descricao).toBe('Fim da execução');
    expect(valores(r).at(-1)).toEqual({ frutas: "[ 'laranja', 'mamão' ]" });
  });
  it('acompanha variáveis escalares, cálculos, alterações e início sem observador de índices', async () => {
    const r = await revisar('let total = 1;\ntotal += 2;\nconsole.log(total);');
    expect(r.erro).toBeNull();
    expect(valores(r)).toEqual([{}, { total: '1' }, { total: '3' }, { total: '3' }, { total: '3' }]);
    expect(r.passoAPasso?.passos[2]?.variaveis[0]?.estado).toBe('mudou');
  });
  it('reproduz apenas o ramo escolhido e mantém variáveis locais fora do escopo posterior', async () => {
    const r = await revisar(`let n = 1;
if (n > 0) { const local = 2; n += local; } else console.log('não');
console.log(n);`);
    expect(r.erro).toBeNull();
    expect(r.saida.map((l) => l.texto)).toEqual(['3']);
    expect(r.passoAPasso?.passos.some((p) => p.descricao === 'Condição verdadeira')).toBe(true);
    expect(valores(r).some((v) => v.local === '2')).toBe(true);
    expect(valores(r).at(-1)).toEqual({ n: '3' });
  });
  it('conserva laços sem chaves, atualização no cabeçalho e laços sem voltas', async () => {
    const r = await revisar(`let soma = 0;
for (let i = 0; i < 3; i++) soma += i
for (let j = 0; j < 0; j++) console.log('não')
console.log(soma);`);
    expect(r.erro).toBeNull();
    expect(r.saida[0]?.texto).toBe('3');
    expect(r.passoAPasso?.passos.filter((p) => p.descricao === 'Começou uma volta do laço')).toHaveLength(3);
    expect(valores(r).at(-1)).toEqual({ soma: '3' });
  });
  it('acompanha while, break e continue sem executar comandos pulados', async () => {
    const r = await revisar(`let n = 0;
while (n < 5) {
  n++;
  if (n === 2) continue;
  if (n === 4) break;
  console.log(n);
}`);
    expect(r.erro).toBeNull();
    expect(r.saida.map((l) => l.texto)).toEqual(['1', '3']);
    expect(r.passoAPasso?.passos.some((p) => p.descricao === 'Vai sair do laço')).toBe(true);
    expect(r.passoAPasso?.passos.at(-1)?.lacos).toEqual([]);
  });
  it('restaura escopos sombreados e reinicia contadores de laços internos', async () => {
    const r = await revisar(`let n = 10;
{ let n = 20; console.log(n); }
for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) console.log(n);`);
    expect(r.erro).toBeNull();
    expect(valores(r).at(-1)).toEqual({ n: '10' });
    const voltasInternas = r.passoAPasso!.passos.filter(
      (p) => p.descricao === 'Começou uma volta do laço' && p.lacos.length === 2,
    );
    expect(voltasInternas.map((p) => p.lacos[1]?.volta)).toEqual([1, 2, 1, 2]);
  });
  it('preserva comentários e linhas e conserva o erro real em uma leitura inválida', async () => {
    const codigo = `// início
const aluno = null;
console.log(aluno.nome);`;
    const p = prepararPassos(codigo);
    expect(p.ok && p.codigo.split('\n').length).toBe(codigo.split('\n').length);
    const r = await revisar(codigo);
    expect(r.erro).toMatchObject({ nome: 'TypeError', linha: 3 });
    expect(r.passoAPasso?.passos.at(-1)?.descricao).not.toBe('Fim da execução');
  });
  it('interrompe a execução no limite de 160 estados sem fingir que concluiu ou reprovar testes', async () => {
    const r = await rodar(
      'let n = 0; while (true) n++;',
      [{ descricao: 'Não deve rodar', codigo: 'verdadeiro(false);' }],
      executor,
      { passoAPasso: true },
    );
    expect(r.erro).toBeNull();
    expect(r.testes).toEqual([]);
    expect(r.passoAPasso?.limiteAtingido).toBe(true);
    expect(r.passoAPasso?.passos).toHaveLength(160);
    expect(r.passoAPasso?.passos.at(-1)?.descricao).not.toBe('Fim da execução');
  });
  it.each([
    'function soma(a, b) { return a + b; }',
    'const n = Math.round(1.2);',
    'await Promise.resolve(1);',
    'document.body.textContent = "x";',
    'const lista = []; lista.push(1);',
    'const x = { get nome() { return 1; } };',
    'let [a] = [1];',
    'var n = 1;',
    'const x = {}; x.nome = 1;',
    'const x = null; console.log(x?.nome);',
  ])('recusa um recurso fora do subconjunto antes de executar: %s', async (codigo) => {
    const executar = vi.fn();
    const r = await rodar(codigo, [], executar, { passoAPasso: true });
    expect(executar).not.toHaveBeenCalled();
    expect(r.passoAPasso?.indisponivel?.mensagem).toContain('Rodar');
  });
  it('mantém funções disponíveis na execução normal e os erros de escrita traduzidos', async () => {
    const normal = await rodar('function soma(a, b) { return a + b; } console.log(soma(1, 2));', [], executor);
    expect(normal.saida[0]?.texto).toBe('3');
    expect(normal.passoAPasso).toBeUndefined();
    const errado = await revisar('const n = [');
    expect(errado.erro?.nome).toBe('SyntaxError');
    expect(errado.passoAPasso).toBeUndefined();
  });
  it('registra objetos, templates e nomes especiais sem colidir com observadores nem protótipos', async () => {
    const r = await revisar(
      "const __mundojsPasso = 3; const __proto__ = 4; const undefined = 5; const aluno = { nome: 'Ana' }; console.log(aluno.nome, __proto__, undefined);",
    );
    expect(r.erro).toBeNull();
    expect(r.saida[0]?.texto).toBe('Ana 4 5');
    expect(valores(r).at(-1)).toMatchObject({ __mundojsPasso: '3', ['__proto__']: '4', undefined: '5' });
  });
  it('recria o executor serializado e mantém o registro idêntico sem executar o código nos controles', async () => {
    const serializado = (0, eval)(`(${criarExecutor.toString()})`)() as ReturnType<typeof criarExecutor>;
    const r = await rodar('let n = 1; console.log(n);', [], serializado, { passoAPasso: true });
    expect(r.erro).toBeNull();
    expect(r.passoAPasso?.passos.at(-1)?.linhasSaida).toBe(1);
  });
});
