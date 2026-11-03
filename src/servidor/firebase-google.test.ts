import { randomBytes } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { betterAuth } from 'better-auth';
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTPayload } from 'jose';
import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { criarProvedorGoogleFirebase, firebaseGoogle, verificarGoogleFirebase } from './firebase-google';
import { configuracaoSessao } from './configuracao-sessao';
import { sessaoAtual } from './sessao';

const leituraServidor = vi.hoisted(() => ({ getSession: vi.fn(), headers: new Headers() }));
vi.mock('./auth', () => ({ auth: { api: { getSession: leituraServidor.getSession } } }));
vi.mock('next/headers', () => ({ headers: async () => leituraServidor.headers }));

const projeto = 'mundojs-teste';
const par = await generateKeyPair('RS256');
const jwk = { ...(await exportJWK(par.publicKey)), kid: 'teste', alg: 'RS256' };
const chaves = createLocalJWKSet({ keys: [jwk] });

async function token(alteracoes: JWTPayload = {}) {
  const agora = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'google-usuario-teste',
    iss: `https://securetoken.google.com/${projeto}`,
    aud: projeto,
    iat: agora,
    exp: agora + 3600,
    auth_time: agora,
    email: 'aluno@example.invalid',
    email_verified: true,
    name: 'Aluno Google',
    firebase: { sign_in_provider: 'google.com' },
    ...alteracoes,
  })
    .setProtectedHeader({ alg: 'RS256', kid: 'teste' })
    .sign(par.privateKey);
}

describe('identidade Google do Firebase', () => {
  it('valida assinatura, emissor e projeto e usa o UID como identificador', async () => {
    const valido = await token();
    expect((await verificarGoogleFirebase(valido, projeto, chaves)).sub).toBe('google-usuario-teste');
    const provedor = criarProvedorGoogleFirebase(projeto, chaves);
    const perfil = await provedor.getUserInfo({ idToken: valido });
    expect(perfil?.user).toMatchObject({ email: 'aluno@example.invalid', emailVerified: true });
    expect(typeof provedor.accountSubject).toBe('function');
  });
  it.each([
    ['outro projeto', { aud: 'outro-projeto' }],
    ['outro emissor', { iss: 'https://outro.example' }],
    ['e-mail não confirmado', { email_verified: false }],
    ['provedor de senha', { firebase: { sign_in_provider: 'password' } }],
    ['sem UID', { sub: '' }],
    ['UID longo', { sub: 'a'.repeat(129) }],
    ['e-mail inválido', { email: 'sem-arroba' }],
    ['expirado', { exp: 1 }],
    ['emitido há muito tempo', { iat: 1 }],
    ['autenticação antiga', { auth_time: 1 }],
    ['autenticação futura', { auth_time: 9999999999 }],
    ['sem autenticação', { auth_time: undefined }],
  ])('recusa %s', async (_nome, alteracoes) => {
    await expect(verificarGoogleFirebase(await token(alteracoes), projeto, chaves)).rejects.toThrow();
  });
  it('recusa assinatura de outra chave e tokens malformados', async () => {
    const outro = await generateKeyPair('RS256');
    const falso = await new SignJWT({ sub: 'falso' })
      .setProtectedHeader({ alg: 'RS256', kid: 'teste' })
      .sign(outro.privateKey);
    await expect(verificarGoogleFirebase(falso, projeto, chaves)).rejects.toThrow();
    expect(await criarProvedorGoogleFirebase(projeto, chaves).getUserInfo({ idToken: 'invalido' })).toBeNull();
  });
});

const url = process.env.TEST_DATABASE_URL;
describe.skipIf(!url)('sessão Google no Postgres real', () => {
  const esquema = `google_teste_${randomBytes(8).toString('hex')}`;
  const admin = new Pool({ connectionString: url });
  const db = new Pool({ connectionString: url, options: `-c search_path=${esquema}`, max: 3 });
  const segredo = randomBytes(32).toString('hex');
  function criarAuth() {
    return betterAuth({
      baseURL: 'http://localhost:3001',
      secret: segredo,
      database: db,
      user: { modelName: 'auth_usuario' },
      account: { modelName: 'auth_credencial', accountLinking: { enabled: true, requireLocalEmailVerified: true } },
      session: configuracaoSessao,
      verification: { modelName: 'auth_verificacao' },
      plugins: [firebaseGoogle(projeto, chaves)],
      logger: { disabled: true },
    });
  }
  let auth: ReturnType<typeof criarAuth>;
  async function entrar(idToken: string, origem = 'http://localhost:3001') {
    return auth.handler(
      new Request('http://localhost:3001/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: origem },
        body: JSON.stringify({ provider: 'firebase-google', idToken: { token: idToken } }),
      }),
    );
  }
  beforeAll(async () => {
    await admin.query(`CREATE SCHEMA ${esquema}`);
    for (const arquivo of (await readdir('db/migrations')).filter((nome) => nome.endsWith('.sql')).sort()) {
      await db.query(await readFile(`db/migrations/${arquivo}`, 'utf8'));
    }
    auth = criarAuth();
  });
  afterAll(async () => {
    await db.end();
    await admin.query(`DROP SCHEMA ${esquema} CASCADE`);
    await admin.end();
  });
  it('cria usuário confirmado e sessão HttpOnly e reencontra a mesma conta', async () => {
    const resposta = await entrar(await token());
    expect(resposta.status).toBe(200);
    expect(resposta.headers.get('set-cookie')).toContain('HttpOnly');
    const usuario = (await resposta.json()).user;
    expect(usuario.emailVerified).toBe(true);
    const conta = await db.query('SELECT "accountId", "providerId" FROM auth_credencial WHERE "userId" = $1', [
      usuario.id,
    ]);
    expect(conta.rows).toEqual([{ accountId: 'google-usuario-teste', providerId: 'firebase-google' }]);
    const segunda = await entrar(await token());
    expect(segunda.status).toBe(200);
    expect((await segunda.json()).user.id).toBe(usuario.id);
    const sessao = await auth.handler(
      new Request('http://localhost:3001/api/auth/get-session', {
        headers: { cookie: resposta.headers.get('set-cookie')!.split(';')[0]! },
      }),
    );
    expect((await sessao.json()).user.id).toBe(usuario.id);
  });
  it('mantém o login após nova visita e renova banco e cookie juntos depois de um dia', async () => {
    const resposta = await entrar(await token({ sub: 'google-persistencia', email: 'persistencia@example.invalid' }));
    expect(resposta.status).toBe(200);
    const cookie = resposta.headers.getSetCookie().find((linha) => linha.includes('.session_token='))!;
    expect(cookie).toMatch(/Max-Age=2592000/i);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    const cabecalhos = new Headers({ cookie: cookie.split(';')[0]!, origin: 'http://localhost:3001' });
    const usuario = (await resposta.json()).user;

    // Uma nova instância não depende de memória do Firebase ou do servidor anterior.
    const novaVisita = criarAuth();
    const consulta = () =>
      novaVisita.handler(
        new Request('http://localhost:3001/api/auth/get-session', {
          headers: cabecalhos,
        }),
      );
    expect((await (await consulta()).json()).user.id).toBe(usuario.id);

    const vencimentoAnterior = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);
    await db.query('UPDATE auth_sessao SET "expiresAt" = $1 WHERE "userId" = $2', [vencimentoAnterior, usuario.id]);
    leituraServidor.headers = cabecalhos;
    leituraServidor.getSession.mockImplementation((opcoes) => novaVisita.api.getSession(opcoes));
    expect((await sessaoAtual())?.user.id).toBe(usuario.id);
    const antes = await db.query('SELECT "expiresAt" FROM auth_sessao WHERE "userId" = $1', [usuario.id]);
    expect(antes.rows[0].expiresAt.getTime()).toBe(vencimentoAnterior.getTime());

    const renovacao = await consulta();
    expect((await renovacao.json()).user.id).toBe(usuario.id);
    expect(renovacao.headers.getSetCookie().find((linha) => linha.includes('.session_token='))).toMatch(
      /Max-Age=2592000/i,
    );
    const depois = await db.query('SELECT "expiresAt" FROM auth_sessao WHERE "userId" = $1', [usuario.id]);
    expect(depois.rows[0].expiresAt.getTime()).toBeGreaterThan(vencimentoAnterior.getTime());

    const saida = await novaVisita.handler(
      new Request('http://localhost:3001/api/auth/sign-out', {
        method: 'POST',
        headers: cabecalhos,
      }),
    );
    expect(saida.status).toBe(200);
    expect(saida.headers.get('set-cookie')).toMatch(/Max-Age=0/i);
    expect(await (await consulta()).json()).toBeNull();
  });
  it('exige novo login quando os 30 dias de sessão expiraram', async () => {
    const resposta = await entrar(await token({ sub: 'google-expiracao', email: 'expiracao@example.invalid' }));
    const usuario = (await resposta.json()).user;
    await db.query('UPDATE auth_sessao SET "expiresAt" = $1 WHERE "userId" = $2', [new Date(0), usuario.id]);
    const sessao = await auth.handler(
      new Request('http://localhost:3001/api/auth/get-session', {
        headers: {
          cookie: resposta.headers
            .getSetCookie()
            .find((linha) => linha.includes('.session_token='))!
            .split(';')[0]!,
        },
      }),
    );
    expect(await sessao.json()).toBeNull();
  });
  it('reutiliza uma conta local com o mesmo e-mail já confirmado', async () => {
    await db.query('INSERT INTO auth_usuario (id, name, email, "emailVerified") VALUES ($1,$1,$2,true)', [
      'existente',
      'existente@example.invalid',
    ]);
    const resposta = await entrar(await token({ sub: 'google-existente', email: 'existente@example.invalid' }));
    expect(resposta.status).toBe(200);
    expect((await resposta.json()).user.id).toBe('existente');
  });
  it('não vincula automaticamente uma conta local com e-mail não confirmado', async () => {
    await db.query('INSERT INTO auth_usuario (id, name, email, "emailVerified") VALUES ($1,$1,$2,false)', [
      'pendente',
      'pendente@example.invalid',
    ]);
    const resposta = await entrar(await token({ sub: 'google-pendente', email: 'pendente@example.invalid' }));
    expect(resposta.ok).toBe(false);
    expect((await resposta.json()).code).toBe('OAUTH_LINK_ERROR');
    expect(resposta.headers.get('set-cookie')).toBeNull();
    expect((await db.query('SELECT 1 FROM auth_credencial WHERE "userId" = $1', ['pendente'])).rowCount).toBe(0);
  });
  it('recusa tokens inválidos e origem externa sem criar sessão', async () => {
    expect((await entrar('invalido')).status).toBe(401);
    expect((await entrar(await token(), 'https://externo.example')).status).toBe(403);
  });
});
