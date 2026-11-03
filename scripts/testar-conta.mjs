import { randomBytes } from 'node:crypto';
import nextEnv from '@next/env';
import pg from 'pg';

nextEnv.loadEnvConfig(process.cwd());
const origem = process.env.BETTER_AUTH_URL;
if (!origem || !/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origem))
  throw new Error('Este teste é exclusivo do ambiente local.');
if (process.env.AUTH_SMTP_URL !== 'smtp://127.0.0.1:1025') throw new Error('Use o Mailpit local para este teste.');
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(process.env.DATABASE_URL || '').hostname))
  throw new Error('Use somente um banco local para este teste.');
const email = `mundojs-teste-${randomBytes(12).toString('hex')}@example.invalid`;
const senha = randomBytes(24).toString('base64url');
const novaSenha = randomBytes(24).toString('base64url');
const identidades = new Set();
const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
let usuarioId;

function conferir(condicao, etapa) {
  if (!condicao) throw new Error(etapa);
}
function navegador() {
  const cookies = new Map();
  return {
    cookies,
    async pedir(caminho, corpo) {
      const url = new URL(caminho, origem);
      conferir(url.origin === origem, 'URL de teste fora do ambiente local.');
      const resposta = await fetch(url, {
        method: corpo === undefined ? 'GET' : 'POST',
        redirect: 'manual',
        headers: {
          origin: origem,
          'content-type': 'application/json',
          cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; '),
          'user-agent': 'MundoJS-auth-smoke-test',
          'x-forwarded-for': '198.51.100.99',
          ...(['/api/conta/vincular', '/api/projetos/compartilhar'].includes(url.pathname) && usuarioId
            ? { 'x-mundojs-conta': usuarioId }
            : {}),
        },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
        signal: AbortSignal.timeout(15000),
      });
      for (const linha of resposta.headers.getSetCookie()) {
        const item = linha.split(';')[0];
        const posicao = item.indexOf('=');
        const chave = item.slice(0, posicao);
        const valor = item.slice(posicao + 1);
        if (!valor || /max-age=0/i.test(linha)) cookies.delete(chave);
        else cookies.set(chave, valor);
      }
      return resposta;
    },
  };
}

async function linkDoEmail(assunto) {
  for (let i = 0; i < 40; i++) {
    const lista = await (
      await fetch('http://localhost:8025/api/v1/messages', { signal: AbortSignal.timeout(5000) })
    ).json();
    const mensagem = lista.messages?.find((m) => m.Subject.includes(assunto) && m.To?.some((p) => p.Address === email));
    if (mensagem) {
      const detalhe = await (await fetch(`http://localhost:8025/api/v1/message/${mensagem.ID}`)).json();
      const link = detalhe.Text?.match(/https?:\/\/[^\s]+/)?.[0];
      conferir(link, 'O e-mail de teste não trouxe o link esperado.');
      return link;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error('O e-mail de teste não chegou ao Mailpit.');
}

try {
  await db.connect();
  const primeiro = navegador();
  let resposta = await primeiro.pedir('/api/dados');
  conferir(resposta.ok, 'Dados de visitante indisponíveis.');
  const visitante = await resposta.json();
  identidades.add(visitante.identidade);
  const progresso = {
    versao: 1,
    concluidas: {},
    exerciciosConcluidos: { 'javascript-do-zero/ola-mundo#0': '2026-01-01T00:00:00.000Z' },
  };
  resposta = await primeiro.pedir('/api/dados', {
    tipo: 'progresso',
    progresso,
    identidadeEsperada: visitante.identidade,
  });
  conferir(resposta.ok, 'Não salvou o progresso de visitante.');
  resposta = await primeiro.pedir('/api/dados', {
    tipo: 'rascunho',
    chave: 'rascunho-livre',
    codigo: '// rascunho do teste local',
    identidadeEsperada: visitante.identidade,
  });
  conferir(resposta.ok, 'Não salvou o rascunho de visitante.');
  resposta = await primeiro.pedir('/api/dados', {
    tipo: 'rascunho',
    chave: 'projeto/listas-e-objetos',
    codigo: '// projeto privado do teste local',
    identidadeEsperada: visitante.identidade,
  });
  conferir(resposta.ok, 'Não salvou o projeto de visitante.');

  resposta = await primeiro.pedir('/api/auth/sign-up/email', {
    name: 'Conta de teste local',
    email,
    password: senha,
    callbackURL: '/conta',
  });
  conferir(resposta.ok, 'O cadastro de teste falhou.');
  const usuario = await db.query('SELECT id FROM auth_usuario WHERE email = $1', [email]);
  usuarioId = usuario.rows[0]?.id;
  conferir(usuarioId, 'Não criou o usuário de teste.');
  identidades.add(`conta:${usuarioId}`);
  resposta = await primeiro.pedir(await linkDoEmail('Confirme'));
  conferir(resposta.status === 302, 'Não confirmou o e-mail de teste.');
  resposta = await primeiro.pedir('/api/conta/vincular', {});
  conferir(resposta.ok, 'Não incorporou o progresso à conta.');
  const conta = await (await primeiro.pedir('/api/dados')).json();
  conferir(
    conta.progresso.exerciciosConcluidos['javascript-do-zero/ola-mundo#0'] &&
      conta.rascunhos['rascunho-livre'] === '// rascunho do teste local',
    'Não preservou progresso e rascunho.',
  );
  conferir(
    conta.rascunhos['projeto/listas-e-objetos'] === '// projeto privado do teste local',
    'Não incorporou o projeto à conta.',
  );
  resposta = await primeiro.pedir('/api/dados', {
    tipo: 'rascunho',
    chave: 'rascunho-livre',
    codigo: 'gravação antiga',
    identidadeEsperada: visitante.identidade,
  });
  conferir(resposta.status === 409, 'Aceitou uma gravação de sessão anterior.');

  const segundo = navegador();
  resposta = await segundo.pedir('/api/auth/sign-in/email', { email, password: senha });
  conferir(resposta.ok, 'Não entrou no segundo dispositivo.');
  const retomado = await (await segundo.pedir('/api/dados')).json();
  conferir(
    retomado.progresso.exerciciosConcluidos['javascript-do-zero/ola-mundo#0'] &&
      retomado.rascunhos['rascunho-livre'] === '// rascunho do teste local',
    'Não recuperou os dados em outro dispositivo.',
  );

  const recuperacao = navegador();
  conferir(
    retomado.rascunhos['projeto/listas-e-objetos'] === '// projeto privado do teste local',
    'Não recuperou o projeto no segundo dispositivo.',
  );
  const versaoDoProjeto = {
    acao: 'publicar',
    trilha: 'listas-e-objetos',
    codigo: '// MUNDOJS_COMPARTILHAMENTO_TESTE\nconsole.log("Projeto de teste");',
    identidadeEsperada: `conta:${usuarioId}`,
  };
  resposta = await segundo.pedir('/api/projetos/compartilhar', versaoDoProjeto);
  conferir(resposta.status === 403, 'Uma conta gratuita conseguiu publicar um projeto Pro.');
  // Fixture exclusiva da conta descartável neste banco local. Não cria pagamento
  // nem chama o Stripe; a integração financeira é validada separadamente.
  await db.query(
    `INSERT INTO cobranca_contas(usuario_id,cliente_chave,status,inicio,fim)
     VALUES ($1,$2,'active',now()-interval '1 minute',now()+interval '1 hour')`,
    [usuarioId, `smoke-local-${randomBytes(12).toString('hex')}`],
  );
  resposta = await segundo.pedir('/api/projetos/compartilhar', versaoDoProjeto);
  conferir(resposta.ok, 'Não criou o link de leitura do projeto.');
  const publicado = (await resposta.json()).publicacao;
  const leitor = navegador();
  resposta = await leitor.pedir(`/compartilhado/${publicado.id}`);
  const pagina = await resposta.text();
  conferir(
    resposta.ok && pagina.includes('somente leitura') && pagina.includes('MUNDOJS_COMPARTILHAMENTO_TESTE'),
    'Não exibiu a versão compartilhada para outro visitante.',
  );
  conferir(!pagina.includes('projeto privado do teste local'), 'Exibiu o rascunho privado no link público.');
  resposta = await leitor.pedir('/api/projetos/compartilhar', {
    acao: 'retirar',
    trilha: 'listas-e-objetos',
    identidadeEsperada: `conta:${usuarioId}`,
  });
  conferir(resposta.status === 401, 'Um visitante conseguiu retirar um link de outra conta.');
  await db.query("UPDATE cobranca_contas SET status='gratuito', fim=now() WHERE usuario_id=$1", [usuarioId]);
  resposta = await segundo.pedir('/api/projetos/compartilhar', {
    acao: 'retirar',
    trilha: 'listas-e-objetos',
    identidadeEsperada: `conta:${usuarioId}`,
  });
  conferir(
    resposta.ok && (await leitor.pedir(`/compartilhado/${publicado.id}`)).status === 404,
    'Não retirou o link de leitura do ar.',
  );
  resposta = await recuperacao.pedir('/api/auth/request-password-reset', {
    email,
    redirectTo: `${origem}/conta/nova-senha`,
  });
  conferir(resposta.ok, 'Não solicitou recuperação de senha.');
  const link = await linkDoEmail('Redefina');
  resposta = await recuperacao.pedir(link);
  const redirecionamento = resposta.headers.get('location');
  conferir(redirecionamento, 'A recuperação não trouxe a tela de nova senha.');
  const token = new URL(redirecionamento, origem).searchParams.get('token');
  conferir(token, 'A recuperação não trouxe o token esperado.');
  resposta = await recuperacao.pedir('/api/auth/reset-password', { token, newPassword: novaSenha });
  conferir(resposta.ok, 'Não redefiniu a senha de teste.');
  conferir(
    (await (await segundo.pedir('/api/auth/get-session')).json()) === null,
    'Não revogou as sessões antigas após redefinição.',
  );
  resposta = await segundo.pedir('/api/auth/sign-in/email', { email, password: novaSenha });
  conferir(resposta.ok, 'Não aceitou a nova senha.');
  resposta = await segundo.pedir('/api/auth/sign-out', {});
  conferir(resposta.ok, 'Não encerrou a sessão.');
  const anonimo = await (await segundo.pedir('/api/dados')).json();
  identidades.add(anonimo.identidade);
  conferir(
    !Object.keys(anonimo.progresso.exerciciosConcluidos).length && !Object.keys(anonimo.rascunhos).length,
    'Mostrou dados da conta após sair.',
  );
  console.log(
    'Conta verificada: cadastro, confirmação, vínculo de progresso e projetos, segundo dispositivo, bloqueio gratuito, compartilhamento com fixture Pro local, retirada após cancelamento, recuperação de senha, revogação e saída. Nenhuma cobrança Stripe foi criada.',
  );
} catch (erro) {
  console.error(erro.message || 'O teste local de contas falhou.');
  process.exitCode = 1;
} finally {
  if (!usuarioId)
    usuarioId = (await db.query('SELECT id FROM auth_usuario WHERE email = $1', [email]).catch(() => ({ rows: [] })))
      .rows[0]?.id;
  for (const identidade of identidades) {
    for (const tabela of ['progresso', 'rascunhos', 'estudo_eventos'])
      await db.query(`DELETE FROM ${tabela} WHERE visitante = $1`, [identidade]);
    await db.query('DELETE FROM tutor_uso WHERE escopo = $1', [`visitante:${identidade}`]);
  }
  if (usuarioId) {
    await db.query('DELETE FROM auth_verificacao WHERE value = $1', [usuarioId]);
    await db.query('DELETE FROM auth_usuario WHERE id = $1 AND email = $2', [usuarioId, email]);
  }
  await db.end();
}
