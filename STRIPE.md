# MundoJS Pro no Stripe

Configuração realizada em 03/11/2026, na conta separada **MundoJS**.

## Ambientes

- Conta de produção: `acct_1UXlzeLV72qO6IRG`. A ativação Payments ainda exige os dados do responsável, tipo de empresa/CPF ou CNPJ, conta bancária e envio pelo titular.
- Área restrita: `acct_1UXlzoPvZSqQH4hp`, sem movimentação financeira real.
- Produto de teste: `mundojs_pro_mensal`, **MundoJS Pro**.
- Preço de teste: `price_1UXm2CPvZSqQH4hp3hDcnMGe`, BRL 999 centavos, mensal, quantidade fixa 1.
- Portal de teste padrão: `bpc_1UXm2WPvZSqQH4hpNytot2P5`, com faturas, atualização de cartão e cancelamento ao fim do ciclo. Troca de preço/quantidade, pausa e login público do portal desabilitados.

As credenciais de teste ficam no arquivo ignorado `.vercel/stripe-teste.env`. Não foram adicionadas ao ambiente de produção da Vercel. O arquivo `.env.local` foi preservado. Não publique segredos nem compartilhe sessões do portal/Checkout.

## Validação com o serviço Stripe

- Pagamento simulado aprovado e recusado.
- Renovação mensal com relógio de teste, incluindo finalização da nova fatura.
- Cancelamento agendado e encerramento ao fim do ciclo.
- Checkout criado pela API do MundoJS para uma conta local descartável com e-mail confirmado no Mailpit.
- Pagamento no Checkout hospedado, usando somente cartão fictício `4242`.
- Eventos reais da área restrita encaminhados pelo Stripe CLI ao servidor local de teste em `localhost:3002`.
- Webhook liberou Pro para a conta correta, com franquia de 100 perguntas; portal foi aberto pela própria aplicação.
- Cancelamento pelo portal sincronizado, mantendo acesso até o fim do ciclo. A remoção do cliente fictício revogou o Pro e restaurou a franquia gratuita de 3 perguntas.
- Dados descartáveis criados na simulação e a conta local foram removidos; produto, preço e configuração do portal de teste foram preservados.
- Suíte local: **947 testes passaram** com Postgres isolado, além de tipagem, lint e build.

O portal retornou `cancel_at` igual ao fim do ciclo com `cancel_at_period_end=false`. A sincronização foi ajustada para reconhecer essa representação do cancelamento ao fim, além da flag anterior, e ganhou cobertura de regressão em Postgres isolado. Após recompilar o servidor, um novo evento real da mesma assinatura confirmou `cancelarNoFim=true`, preservando Pro e o período pago no MundoJS.

Esses testes locais com a área restrita não comprovam funcionamento das chaves e do webhook de produção, nem da autenticação no domínio definitivo.

## Antes de habilitar pagamentos reais

1. O titular conclui **Ativar Payments** na conta MundoJS. Tipo de empresa e dados fiscais precisam ser escolhidos pelo responsável; o painel avisa que não poderão ser alterados após verificação.
2. Criar/copiar o produto e preço na conta de produção. IDs da área restrita não funcionam em produção.
3. Repetir a configuração do portal na conta de produção.
4. Com DNS/HTTPS e login Google funcionando no domínio definitivo, registrar `https://mundojavascript.com.br/api/stripe/webhook` com os sete eventos listados no README e a versão compatível do SDK.
5. Configurar na Vercel as três variáveis de produção: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_PRO_MENSAL` e `STRIPE_WEBHOOK_SECRET`. Fazer novo deploy revisado.
6. Conferir sincronização, cancelamento e acesso no ambiente publicado. O retorno do Checkout não concede Pro; a concessão depende da confirmação do webhook.

Referências: [testar Billing](https://docs.stripe.com/billing/testing), [portal do cliente](https://docs.stripe.com/customer-management/configure-portal) e [webhooks](https://docs.stripe.com/webhooks).
