# MundoJS — checklist para produção

Revisão em **03/11/2026**. Ordem proposta para um lançamento com assinaturas.

Esta lista se baseia no código, na configuração local e nas validações já realizadas. Não confirma configurações em painéis de hospedagem, Firebase, Stripe ou Google Cloud. Nenhuma conta externa foi alterada nesta revisão.

## O que já existe

- [x] Postgres local e 7 migrações de banco.
- [x] Login por senha e Google/Firebase, confirmação de e-mail e recuperação de senha implementados.
- [x] Progresso e rascunhos vinculados à identidade, com incorporação dos dados do visitante.
- [x] Plano gratuito: primeira trilha, rascunho livre e 3 perguntas mensais com conta; 1 pergunta sem conta.
- [x] Pro: R$ 9,99/mês, todas as trilhas, 205 exercícios, 4 projetos e 100 perguntas por ciclo pago.
- [x] Autorização de conteúdo no servidor, franquias atômicas, limites do tutor, Checkout, portal e webhook implementados.
- [x] Última validação funcional: 940 testes passaram, incluindo Postgres isolado. Tipagem, lint e build passaram; permanece o aviso de segurança do Next.js.

Essas verificações locais não substituem testes no endereço publicado. Os testes automatizados de cobrança usam Stripe simulado, não uma assinatura criada na conta Stripe.

## Bloqueios antes de abrir ao público

### P01 — Guardar uma versão recuperável do projeto

**Situação:** o Git local ainda não tem commits; nenhum remoto foi listado. Não encontrei configuração de integração contínua no projeto.

- [ ] Criar a primeira versão no Git e configurar o repositório remoto escolhido.
- [ ] Confirmar que segredos e `.env.local` ficam fora do histórico; `.gitignore` já tem essa proteção.
- [ ] Automatizar tipagem, lint, testes e build. Rodar os testes de integração com um Postgres exclusivo de teste.

**Concluído quando:** conseguimos recuperar o código em outro ambiente e uma alteração com falha não passa pela verificação de publicação.

**Depende de:** código local e escolha/acesso ao repositório remoto.

### P02 — Resolver o aviso de segurança

**Situação:** a versão instalada é Next.js 16.4.0 e o build anterior reportou vulnerabilidade conhecida. A conclusão do build após repetir o comando não corrige a vulnerabilidade.

- [ ] Atualizar Next.js e dependências relacionadas para versões corrigidas e compatíveis, após conferir os avisos atuais dos fornecedores.
- [ ] Auditar as demais dependências e resolver os problemas que afetem o lançamento.
- [ ] Repetir testes, tipagem, lint, build e uma navegação de login, editor e cobrança.

**Concluído quando:** a versão vulnerável deixou de ser utilizada e as verificações passam com as versões corrigidas.

**Depende de:** código. Orientação oficial: [atualização do Next.js](https://nextjs.org/docs/app/getting-started/upgrading).

### P03 — Definir hospedagem, domínio e ambientes

**Situação:** a URL de autenticação local ainda aponta para localhost; o destino de produção não foi validado nesta revisão.

- [ ] Escolher a hospedagem e o domínio, configurar HTTPS e o endereço público definitivo.
- [ ] Criar um ambiente de homologação separado da produção, com bancos e credenciais próprios.
- [ ] Configurar segredos no serviço de hospedagem, sem copiar senhas locais para produção.
- [ ] Ajustar `BETTER_AUTH_URL`, variáveis Firebase e URLs usadas nos retornos de pagamento.
- [ ] Conferir limites de duração das requisições: o tutor declara até 40 segundos e o webhook até 60 segundos.
- [ ] Documentar como publicar uma versão e voltar à versão anterior.

**Concluído quando:** o site abre por HTTPS no domínio escolhido e a homologação não acessa dados nem pagamentos reais.

**Depende de:** escolha e acesso à hospedagem e ao domínio.

### P04 — Preparar banco de produção e recuperação

**Situação:** a conexão configurada é com o Postgres Docker local. O volume local persistente não representa uma estratégia de backup validada.

- [ ] Provisionar Postgres de produção com credenciais próprias, conexão protegida e acesso restrito.
- [ ] Aplicar as migrações por um procedimento controlado, testado antes em homologação.
- [ ] Ajustar conexões e pool para a hospedagem escolhida; cada instância da aplicação pode abrir seu próprio pool.
- [ ] Habilitar backups, definir retenção e testar uma restauração em outro banco.
- [ ] Definir quais dados locais precisam ser migrados, evitando levar contas de teste para produção.

**Concluído quando:** a aplicação publicada salva e recupera dados e conseguimos restaurar um backup com sucesso.

**Depende de:** serviço de banco e configuração da hospedagem.

### P05 — Fazer autenticação e e-mails funcionarem no domínio real

**Situação:** o envio atual usa Mailpit local. A configuração do domínio público no Firebase ainda precisa ser conferida.

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

Começar por **P01 e P02**: guardar uma versão recuperável do trabalho, corrigir as dependências vulneráveis e repetir a validação. Depois, definir hospedagem/banco/domínio e avançar com e-mail e Stripe em homologação. Isso evita ativar pagamentos enquanto a base de produção ainda está incompleta.
