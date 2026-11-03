# MundoJS — checklist para produção

Revisão em **03/11/2026**. Ordem proposta para um lançamento com assinaturas.

Esta lista se baseia no código, na configuração local e nas validações já realizadas. A proteção da `main` foi configurada e confirmada no GitHub. Configurações de hospedagem, Firebase, Stripe ou Google Cloud ainda precisam de validação nos respectivos ambientes de produção.

## O que já existe

- [x] Postgres local e 7 migrações de banco.
- [x] Login por senha e Google/Firebase, confirmação de e-mail e recuperação de senha implementados.
- [x] Progresso e rascunhos vinculados à identidade, com incorporação dos dados do visitante.
- [x] Plano gratuito: primeira trilha, rascunho livre e 3 perguntas mensais com conta; 1 pergunta sem conta.
- [x] Pro: R$ 9,99/mês, todas as trilhas, 205 exercícios, 4 projetos e 100 perguntas por ciclo pago.
- [x] Autorização de conteúdo no servidor, franquias atômicas, limites do tutor, Checkout, portal e webhook implementados.
- [x] Última validação funcional: 940 testes passaram, incluindo Postgres isolado. Tipagem, lint e build passaram com Next.js 16.4.4, sem o aviso anterior de vulnerabilidade. A auditoria de dependências de produção não encontrou alertas conhecidos.

Essas verificações locais não substituem testes no endereço publicado. Os testes automatizados de cobrança usam Stripe simulado, não uma assinatura criada na conta Stripe.

## Bloqueios antes de abrir ao público

### P01 — Guardar uma versão recuperável do projeto

**Situação:** a primeira versão foi enviada à branch `main` de [Franklimello/mundoJS](https://github.com/Franklimello/mundoJS). O workflow `.github/workflows/verificar.yml` executa auditoria, migrações, tipagem, lint, testes com Postgres e build em pushes e pull requests. A [primeira execução remota](https://github.com/Franklimello/mundoJS/actions/runs/41676338548) passou em todas as etapas.

- [x] Criar a primeira versão no Git e configurar o repositório remoto escolhido.
- [x] Confirmar que os segredos locais e `.env.local` ficam fora do envio; revisar os arquivos antes do primeiro commit.
- [x] Automatizar tipagem, lint, testes e build. Rodar os testes de integração com um Postgres exclusivo de teste.
- [x] Confirmar a primeira execução do workflow no GitHub.
- [x] Exigir pull request, branch atualizada e aprovação do check **Tipagem, testes, seguranca e build**, fornecido pelo GitHub Actions, para integrar alterações na `main`.
- [x] Aplicar a regra também aos administradores, impedir envio forçado e exclusão da `main` e exigir resolução das conversas de revisão. Não há aprovação de outro revisor obrigatória, para permitir o trabalho individual.
- [ ] Vincular a publicação da hospedagem somente a versões aprovadas. A proteção da branch já está ativa; o fluxo de publicação depende de P03.

**Concluído quando:** conseguimos recuperar o código em outro ambiente e uma alteração com falha não passa pela verificação de publicação.

**Depende de:** código local e escolha/acesso ao repositório remoto.

### P02 — Resolver o aviso de segurança

**Situação:** Next.js e pacotes relacionados atualizados para 16.4.4, React/React DOM para 19.3.1, Zod transitivo para 4.6.7 e gRPC do Firestore para 1.14.7 por override documentado. O build concluiu sem o aviso anterior. `pnpm audit --prod` não encontrou alertas; a auditoria completa ainda aponta um alerta moderado de minimatch nas ferramentas de desenvolvimento.

- [x] Atualizar Next.js e dependências relacionadas para versões corrigidas e compatíveis, após conferir os avisos atuais dos fornecedores.
- [x] Auditar dependências e corrigir os alertas críticos/altos encontrados, incluindo dependências indiretas.
- [x] Repetir os 940 testes com Postgres, tipagem, lint e build após a atualização.
- [x] Conferir telas de conta, editor e planos no navegador e repetir o teste HTTP local de cadastro, e-mail, recuperação, revogação e saída. O teste de compartilhamento usa uma fixture Pro somente para a conta descartável, em banco local, sem chamar o Stripe; também verifica bloqueio gratuito e retirada do link após cancelamento.
- [ ] Tratar o alerta moderado de minimatch em uma atualização compatível das ferramentas de lint. A versão antiga é consumida como função pelo ESLint/plugins; substituir diretamente pela major 11 quebra essa API. Não foi aplicado override incompatível nem removido o alerta da auditoria.

Na revisão de compatibilidade, os plugins `eslint-plugin-react` 7.37.5, `eslint-plugin-import` 2.32.0 e `eslint-plugin-jsx-a11y` 6.10.2 continuam dependendo de minimatch 3 e declarando suporte até ESLint 9. A última versão consultada de minimatch 3 é 3.1.5, e a correção indicada pelo [aviso GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) é 11.0.1. Atualizar apenas o ESLint para 10 não elimina essas dependências. A pendência permanece aberta; não é apresentada como correção concluída.

O workflow bloqueia alertas altos/críticos e mostra os demais no log. A pendência moderada está nas dependências de desenvolvimento e não aparece em `pnpm audit --prod`. O ambiente de CI é descartável, sem chaves reais e com limite de tempo. Isso não substitui a manutenção dessa pendência nem uma revisão completa de segurança.

**Concluído quando:** a versão vulnerável deixou de ser utilizada e as verificações passam com as versões corrigidas.

**Depende de:** código. Orientação oficial: [atualização do Next.js](https://nextjs.org/docs/app/getting-started/upgrading).

### P03 — Definir hospedagem, domínio e ambientes

**Situação:** escolhidos Vercel Hobby e Neon Free para a primeira prévia. O projeto Vercel foi criado, o endereço `mundojs-theta.vercel.app` foi reservado e as variáveis online foram configuradas separadamente das locais. Publicação, domínio e login ainda precisam de verificação no deployment. Procedimento em [DEPLOY.md](DEPLOY.md).

- [x] Escolher Vercel e Neon gratuitos e reservar o endereço inicial da prévia.
- [ ] Confirmar HTTPS e endereço funcionando após o deployment; domínio próprio pode ser configurado depois.
- [ ] Criar um ambiente de homologação separado da produção, com bancos e credenciais próprios.
- [ ] Configurar segredos no serviço de hospedagem, sem copiar senhas locais para produção.
- [ ] Ajustar `BETTER_AUTH_URL`, variáveis Firebase e URLs usadas nos retornos de pagamento.
- [ ] Conferir limites de duração das requisições: o tutor declara até 40 segundos e o webhook até 60 segundos.
- [ ] Documentar como publicar uma versão e voltar à versão anterior.

**Concluído quando:** o site abre por HTTPS no domínio escolhido e a homologação não acessa dados nem pagamentos reais.

**Depende de:** escolha e acesso à hospedagem e ao domínio.

### P04 — Preparar banco de produção e recuperação

**Situação:** o Docker local foi preservado. Um novo Postgres 17 foi criado no Neon Free, com branches `main` e `homologacao`, ambas com as sete migrações e conexões verificadas. A aplicação usa pool compartilhado para consultas comuns e pool direto para bloqueios de sessão da cobrança. Backup/restauração continuam pendentes.

- [x] Provisionar Postgres separado com credenciais próprias e conexões TLS verificadas.
- [x] Aplicar as migrações por um procedimento controlado, testado antes em homologação.
- [ ] Ajustar conexões e pool para a hospedagem escolhida; cada instância da aplicação pode abrir seu próprio pool.
- [ ] Habilitar backups, definir retenção e testar uma restauração em outro banco.
- [ ] Definir quais dados locais precisam ser migrados, evitando levar contas de teste para produção.

**Concluído quando:** a aplicação publicada salva e recupera dados e conseguimos restaurar um backup com sucesso.

**Depende de:** serviço de banco e configuração da hospedagem.

### P05 — Fazer autenticação e e-mails funcionarem no domínio real

**Situação:** o local continua com Mailpit. Para a prévia online, foi escolhido login Google com e-mail/senha desativados por `AUTH_EMAIL_ENABLED=false`. SMTP real e a configuração do novo domínio no Firebase ainda precisam ser concluídos.

- [ ] Configurar um serviço real de e-mail em `AUTH_SMTP_URL` e um remetente do domínio em `AUTH_EMAIL_FROM`.
- [ ] Configurar os registros de autenticação do domínio solicitados pelo provedor de e-mail e verificar entrega.
- [ ] Autorizar o domínio público no Firebase e testar o login Google nesse endereço.
- [ ] Conferir cookies seguros e identificação de origem/IP atrás do proxy da hospedagem.
- [ ] Testar cadastro, confirmação de e-mail, recuperação de senha, entrada Google, saída e continuidade em outro dispositivo.

**Concluído quando:** um usuário novo recebe os e-mails numa caixa externa e consegue completar todos os fluxos no site publicado.

**Depende de:** provedor de e-mail, DNS, Firebase e hospedagem.

### P06 — Controlar custo e abuso do tutor

**Situação:** a chave Gemini existe localmente. Já há limites por identidade/hora, teto global diário e franquias por plano. Ainda não há medição de tokens/custo por chamada no código do tutor revisado.

- [ ] Validar o modelo configurado, disponibilidade, capacidade e faturamento da conta usada em produção.
- [ ] Separar credenciais de produção e teste e restringir a chave aos serviços necessários.
- [ ] Medir tokens, latência e custo agregado sem registrar perguntas, código ou conversas nos logs de operação.
- [ ] Estimar o custo do uso completo das 100 perguntas do Pro e a margem do preço de R$ 9,99, incluindo infraestrutura e taxas.
- [ ] Configurar alertas e os controles de gasto disponíveis na conta do provedor. Um orçamento configurado somente para alertas não bloqueia consumo.
- [ ] Reforçar o controle de abuso de visitantes, por exemplo no limite de tráfego da hospedagem e na identificação confiável do IP. A identidade anônima não equivale a uma pessoa verificada.
- [ ] Testar limites atingidos, indisponibilidade do Gemini e mensagens de recuperação para o usuário.

**Concluído quando:** sabemos quanto custa atender os planos, recebemos alerta de consumo anormal e temos um procedimento para conter gastos.

**Depende de:** código, hospedagem e conta Gemini. Referências: [faturamento Gemini](https://aistudio.google.com/docs/billing) e [orçamentos e alertas do Google Cloud](https://docs.cloud.google.com/billing/docs/how-to/budgets).

### P07 — Ter monitoramento e um procedimento de atendimento

**Situação:** há logs básicos de erro e um script de métricas de aprendizagem. Não encontrei no projeto monitoramento de disponibilidade, alertas de falhas ou um procedimento de incidentes.

- [ ] Monitorar site, conexão com banco, falhas do tutor e processamento dos pagamentos.
- [ ] Identificar erros por operação/evento, mantendo credenciais, tokens de sessão e conteúdo pessoal fora dos logs.
- [ ] Testar um alerta de falha e definir quem o recebe.
- [ ] Documentar como tratar banco indisponível, envio de e-mail interrompido e pagamento confirmado sem liberação de acesso.
- [ ] Criar e divulgar um canal de suporte para acesso, cobrança e problemas com exercícios.

**Concluído quando:** uma falha simulada é detectada, gera um alerta e pode ser investigada sem consultar segredos ou conversas dos usuários.

**Depende de:** código, serviço de monitoramento e canal de suporte.

### P08 — Publicar políticas e definir tratamento de dados

**Situação:** não encontrei páginas de termos, privacidade ou um fluxo próprio de encerramento de conta na área revisada.

- [ ] Preparar e publicar termos, política de privacidade e condições da assinatura, com links acessíveis no site.
- [ ] Explicar renovação mensal, cancelamento, reembolso, franquias e os dados enviados ao Gemini.
- [ ] Definir retenção de sessões, eventos, rascunhos e registros de cobrança, conforme a operação do produto.
- [ ] Disponibilizar um caminho de solicitação de exportação/exclusão de dados, inicialmente por atendimento se necessário.
- [ ] Definir o encerramento da conta junto com o tratamento da assinatura: apagar uma conta no Postgres não cancela automaticamente uma cobrança externa no Stripe.

**Concluído quando:** o usuário entende as condições e encontra um canal funcional para seus pedidos; o procedimento de encerramento trata dados e cobrança juntos.

**Depende de:** decisões do responsável pelo produto, textos revisados e implementação dos canais/fluxos.

## Bloqueios adicionais antes de cobrar assinaturas

### P09 — Configurar Stripe e validar uma assinatura completa em teste

**Situação:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` e `STRIPE_PRICE_PRO_MENSAL` estão ausentes do ambiente local. Checkout, portal e sincronização existem no código, mas o fluxo real na conta Stripe ainda não foi validado.

- [ ] Conferir a configuração da conta Stripe e criar o produto Pro com preço recorrente mensal de **R$ 9,99 em BRL**, quantidade 1.
- [ ] Configurar as três variáveis no ambiente de teste e depois as correspondentes de produção.
- [ ] Configurar o portal: faturas, cartão e cancelamento ao fim do ciclo; manter desabilitadas mudanças de preço/quantidade não suportadas pela oferta.
- [ ] Registrar o webhook de produção em HTTPS, com os eventos e a versão compatíveis com o SDK utilizado.
- [ ] Testar com Stripe de teste: pagamento aprovado, recusado, renovação, atualização do cartão, cancelamento e vencimento do acesso.
- [ ] Confirmar que pagamento pendente não libera Pro e que o cancelamento no fim mantém acesso apenas até a data paga.
- [ ] Testar eventos repetidos, fora de ordem e reentrega após falha, usando o serviço Stripe além dos mocks locais.
- [ ] Conferir a separação teste/produção e a configuração do domínio antes de habilitar o botão de assinatura real.

**Concluído quando:** uma assinatura criada no ambiente de teste libera o usuário correto, renova a franquia e volta ao gratuito conforme o cancelamento/expiração, com o portal funcionando.

**Depende de:** conta Stripe, chaves e ambiente publicado. Referências: [testar Billing](https://docs.stripe.com/billing/testing) e [webhooks](https://docs.stripe.com/webhooks). Passo a passo local em [README.md](README.md#planos-e-stripe).

### P10 — Definir suporte financeiro e recuperação de assinaturas

**Situação:** o servidor trata eventos de assinatura/fatura e depende da reentrega dos webhooks em falhas. Não encontrei uma rotina própria de reconciliação nem tratamento automático de reembolsos/contestações nos eventos aceitos.

- [ ] Definir o procedimento de reembolso e a regra de acesso após reembolso ou contestação.
- [ ] Implementar os eventos adicionais necessários à regra escolhida, ou documentar uma operação manual inicial com verificação no Stripe.
- [ ] Criar um procedimento para conferir pagamento versus acesso e recuperar uma assinatura não sincronizada sem inventar um plano pago no navegador.
- [ ] Definir responsáveis por atendimento de cobrança e pelas rotinas financeiras/fiscais do negócio.

**Concluído quando:** sabemos resolver pagamento sem acesso, reembolso e contestação, com um procedimento reproduzível e registro da operação.

**Depende de:** decisões do produto, conta Stripe e código conforme a política escolhida.

## Verificação final para lançamento

### P11 — Testar a experiência completa no ambiente publicado

- [ ] Criar uma conta nova; estudar, salvar, sair e retomar em outro dispositivo.
- [ ] Testar visitante, conta gratuita e conta Pro, inclusive tentativa de abrir links pagos diretamente.
- [ ] Testar troca de conta na mesma máquina, saída da conta e renovação/cancelamento sem reaproveitar conteúdo protegido de outra identidade.
- [ ] Conferir os saldos: 1 pergunta sem conta, 3 no gratuito e 100 por ciclo no Pro.
- [ ] Testar editor, correção, projetos, compartilhamento e retirada de links antigos após cancelamento.
- [ ] Conferir teclado, celular e navegadores principais; validar a mensagem alternativa quando não houver voz de narração disponível.
- [ ] Fazer um teste de concorrência representativo da carga inicial esperada, incluindo banco, tutor e webhook; conferir recuperação depois de timeouts.
- [ ] Repetir verificações automatizadas e testar a reversão da publicação sem executar migrações destrutivas.

**Concluído quando:** os cenários ficam registrados com resultado, ambiente e versão testada, sem bloqueadores de acesso ou cobrança.

**Depende de:** P01–P10 para o lançamento pago. Para uma beta gratuita, mantenha os pagamentos desativados e valide os itens aplicáveis antes da abertura pública.

## Melhorias que podem vir depois da primeira versão

### P12 — Acompanhar conversão e melhorar apresentação

- [ ] Acompanhar primeira lição concluída, retorno, interesse pelo Pro, conversão e cancelamento.
- [ ] Relacionar custo da IA e receita por período sem guardar conversas nas métricas.
- [ ] Revisar dificuldades pedagógicas com usuários reais.
- [ ] Preparar versões da marca e imagem de compartilhamento; revisar metadados, mapa do site e indexação de páginas públicas.
- [ ] Automatizar reconciliação de assinaturas e ampliar ferramentas internas de suporte conforme o volume.

Não é necessário adicionar certificados, ranking ou um painel administrativo completo para publicar a primeira versão.

## Próxima frente proposta

Concluir **P01 e P02**: automatizar as verificações no repositório já criado, corrigir as dependências vulneráveis e repetir a validação. Depois, definir hospedagem/banco/domínio e avançar com e-mail e Stripe em homologação. Isso evita ativar pagamentos enquanto a base de produção ainda está incompleta.
