# MundoJS Pro no Stripe

Configuração realizada em 03/11/2026, na conta separada **MundoJS**.

## Ambientes

- Conta de produção: `acct_1UXlzeLV72qO6IRG`. O titular concluiu a ativação Payments. A API confirmou `charges_enabled=true`, `payouts_enabled=true`, `details_submitted=true` e nenhuma pendência de verificação.
- Área restrita: `acct_1UXlzoPvZSqQH4hp`, sem movimentação financeira real.
- Produto de teste: `mundojs_pro_mensal`, **MundoJS Pro**.
- Preço de teste: `price_1UXm2CPvZSqQH4hp3hDcnMGe`, BRL 999 centavos, mensal, quantidade fixa 1.
- Portal de teste padrão: `bpc_1UXm2WPvZSqQH4hpNytot2P5`, com faturas, atualização de cartão e cancelamento ao fim do ciclo. Troca de preço/quantidade, pausa e login público do portal desabilitados.

As credenciais de teste ficam no arquivo ignorado `.vercel/stripe-teste.env`. Não foram adicionadas ao ambiente de produção da Vercel. O arquivo `.env.local` foi preservado. Não publique segredos nem compartilhe sessões do portal/Checkout.

## Configuração de produção preparada

- Produto: `prod_VYuGQmJi0Bjacm`, **MundoJS Pro**.
- Preço: `price_1UXmReLV72qO6IRGymxMA72N`, **BRL 9,99 por mês**.
- Portal padrão: `bpc_1UXmWWLV72qO6IRGethwwxmR`, com faturas, atualização de cartão e cancelamento ao fim do ciclo. Troca de plano/quantidade e alterações cadastrais desabilitadas.
- Webhook ativo: `we_1UXmfULV72qO6IRG4pZEzNk8`, em `https://mundojavascript.com.br/api/stripe/webhook`, com os sete eventos da integração, payload snapshot e API `2026-10-28.endive`, conferida no SDK instalado.
- `STRIPE_PRICE_PRO_MENSAL`, `STRIPE_WEBHOOK_SECRET` e `STRIPE_SECRET_KEY` foram salvas em produção na Vercel; os segredos estão marcados como sensíveis. A cópia local fica no arquivo ignorado `.vercel/stripe-producao.env`.
- O titular concluiu a verificação e emitiu a chave restrita exclusiva do servidor (`rk_live_`): escrita em Customers, Checkout Sessions e Customer Portal; leitura em Products, Prices, Invoices e Subscriptions. A consulta do preço real confirmou BRL 999/mês e o portal ativo com cancelamento ao fim. A chave foi guardada em arquivo ignorado, sem alterar `.env.local`.
- O webhook reconhece tanto chaves padrão quanto restritas (`sk_` e `rk_`), exige que teste/produção coincidam com o evento assinado e rejeita prefixos desconhecidos. Os testes cobrem os quatro prefixos e a rejeição do ambiente oposto.
- Os registros A do domínio e de `www` foram salvos no Registro.br apontando para `76.76.21.21`, conforme instrução da Vercel. A resolução pública e o HTTPS ainda estavam pendentes na última conferência.

Não houve cobrança real nem criação de cliente de produção. Antes de divulgar assinaturas, confirmar as três variáveis na publicação, validar domínio, Google e entrega do webhook em produção.

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

1. Guardar a chave restrita somente no servidor e na variável protegida de produção da Vercel, preservando a separação da área restrita.
2. Confirmar propagação DNS/HTTPS e login Google no domínio definitivo.
3. Fazer novo deploy com as três variáveis Stripe de produção e conferir a resposta da API e do webhook. Não usar IDs da área restrita em produção.
4. Conferir sincronização, cancelamento e acesso no ambiente publicado. O retorno do Checkout não concede Pro; a concessão depende da confirmação do webhook.

Referências: [testar Billing](https://docs.stripe.com/billing/testing), [portal do cliente](https://docs.stripe.com/customer-management/configure-portal) e [webhooks](https://docs.stripe.com/webhooks).
