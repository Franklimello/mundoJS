# MundoJS na Vercel e no Neon

## Preparação realizada

- Projeto Vercel: `mundojs`, na conta `franklim-joaquim-de-melo-netos-projects`, plano Hobby.
- Domínio escolhido: <https://mundojavascript.com.br>, comprado no Registro.br; `www` será redirecionado ao domínio principal.
- Endereço técnico reservado na Vercel: <https://mundojs-theta.vercel.app>.
- Postgres 17 no projeto Neon `mundojs`, organização Franklim, plano Free, região AWS US East 1.
- Branches `main` e `homologacao`, cada uma com as sete migrações aplicadas e conexão validada. Os dados Docker locais não foram copiados.
- Os bloqueios de sessão da cobrança foram testados na conexão direta do Neon.
- A primeira versão online foi configurada para login Google, sem cadastro/recuperação por e-mail enquanto não houver SMTP real.
- Pagamentos permanecem indisponíveis até configurar o Stripe.

O endereço reservado não comprova um deploy aprovado. Antes de liberar o uso, confira o status do deployment e os testes abaixo.

## Configuração da aplicação

`vercel.json` define Next.js, instalação pelo lockfile, build com pnpm e região `iad1`, próxima do banco. A versão de Node.js é fixada em `22.x` no `package.json`.

Somente `main` gera deploy automático pela integração Git. Ela está protegida por pull request e CI obrigatório. Branches podem receber deploy manual de teste, mas não compartilham automaticamente o banco principal. A integração Git da Vercel precisa estar conectada para usar o deploy automático.

A regra de bloqueio usa `**` para incluir branches com `/`, como `codex/stripe-cancelamento-portal`. A exceção `main: true` mantém a publicação da branch principal. As variáveis de produção não são copiadas para prévias.

`.vercelignore` exclui arquivos de ambiente, metadados locais e arquivos gerados do envio pela CLI. As conexões online e o segredo exclusivo do ambiente ficam em arquivos ignorados dentro de `.vercel`, usados na configuração. O `.env.local` continua apontando para o Docker local e o Mailpit.

## Variáveis na Vercel

| Variável                 | Finalidade                                                     |
| ------------------------ | -------------------------------------------------------------- |
| `DATABASE_URL`           | URL Neon com `-pooler` para consultas e transações comuns      |
| `DATABASE_URL_UNPOOLED`  | URL direta para migrações e os bloqueios de sessão da cobrança |
| `BETTER_AUTH_SECRET`     | Segredo exclusivo do ambiente online                           |
| `BETTER_AUTH_URL`        | `https://mundojavascript.com.br`                               |
| `AUTH_EMAIL_ENABLED`     | `false` na prévia Google-only                                  |
| `NEXT_PUBLIC_FIREBASE_*` | Configuração pública do projeto Firebase existente             |
| `GEMINI_API_KEY`         | Chave apenas no servidor                                       |
| `GEMINI_MODEL`           | Modelo do tutor                                                |
| `TUTOR_LIMITE_HORA`      | Proteção por identidade/hora: 20                               |
| `TUTOR_LIMITE_DIARIO`    | Proteção global inicial da prévia: 100                         |

O limite global da prévia não muda as franquias por plano: 1 pergunta sem conta, 3 com conta gratuita e 100 por ciclo pago no Pro. O teto global protege o consumo agregado e pode impedir novas chamadas quando atingido.

`DATABASE_URL_UNPOOLED` também é necessária em runtime: Checkout e webhook usam `pg_advisory_lock` entre consultas, que não é preservado pelo PgBouncer em modo transaction. O código usa um pool direto separado para essas operações e falha se receber um endpoint `-pooler` no lugar. Os pools são registrados com o helper oficial `attachDatabasePool` na Vercel.

## Antes de compartilhar a prévia

- [ ] Confirmar deployment concluído e domínio apontando para a versão esperada.
- [x] Adicionar `mundojavascript.com.br` aos domínios autorizados do Firebase Authentication.
- [ ] Configurar os registros A do domínio e de `www` para `76.76.21.21`, conforme orientação da Vercel, e validar DNS/HTTPS. Em 03/11/2026, o Registro.br ainda bloqueava a edição durante a transição inicial do domínio; nenhum registro foi salvo.
- [ ] Conferir páginas, persistência de visitante, Google, troca de dispositivo e conteúdo Pro bloqueado.
- [ ] Confirmar que cadastro/recuperação por e-mail não são oferecidos nesta prévia.
- [ ] Confirmar que o pagamento segue indisponível sem as três variáveis Stripe.

## Migrações e ambientes

Aplique migrações com conexão **direta**. Primeiro valide na branch `homologacao`; depois aplique na `main`, com o mesmo código revisado. O script `scripts/migrar.mjs` prefere `DATABASE_URL_UNPOOLED` e usa uma transação com bloqueio para evitar aplicação simultânea.

Não use `.env.local` para trocar temporariamente o banco local pelo remoto. Carregue explicitamente o arquivo ignorado correspondente ou use as variáveis do ambiente de publicação. Não exporte a conexão principal para pull requests não confiáveis.

A retenção de restauração e as cotas do plano Free devem ser conferidas no painel. Defina e teste um procedimento de backup antes de tratar a prévia como produção comercial.

## Quando configurar SMTP real

Configure `AUTH_SMTP_URL` e `AUTH_EMAIL_FROM`, valide o remetente/domínio, altere `AUTH_EMAIL_ENABLED` para `true` e faça um novo deploy. Teste cadastro, confirmação e recuperação antes de divulgar o acesso por e-mail. O Mailpit não é um servidor de e-mails online.

## Ao mudar o domínio

Atualize `BETTER_AUTH_URL`, domínios autorizados do Firebase, URLs de webhook/retorno Stripe quando ativados e faça um novo deploy. A alteração do domínio não migra cookies do navegador; pode ser necessário entrar novamente.
