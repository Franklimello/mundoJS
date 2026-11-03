import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

let conteudo;
try {
  conteudo = await readFile('.env.local', 'utf8');
} catch (erro) {
  if (erro.code !== 'ENOENT') throw erro;
  conteudo = await readFile('.env.example', 'utf8');
}
const valores = {
  BETTER_AUTH_SECRET: randomBytes(48).toString('base64url'),
  BETTER_AUTH_URL: 'http://localhost:3001',
  AUTH_SMTP_URL: 'smtp://127.0.0.1:1025',
  AUTH_EMAIL_FROM: 'MundoJS <contas@mundojs.local>',
};
for (const [chave, valor] of Object.entries(valores)) {
  const linha = new RegExp(`^${chave}=.*$`, 'm');
  const atual = conteudo.match(linha)?.[0];
  if (atual && atual.slice(chave.length + 1).trim()) continue;
  conteudo = atual ? conteudo.replace(linha, `${chave}=${valor}`) : `${conteudo.trimEnd()}\n${chave}=${valor}\n`;
}
await writeFile('.env.local', conteudo);
console.log('Conta local configurada. Segredos e configurações existentes foram preservados.');
