# MundoJS

Aprenda JavaScript escrevendo e rodando código no navegador. Lições curtas, um editor com visual de caderno pautado e um corretor que confere cada exercício na hora — sem instalar nada.

- **Next.js 16** (App Router) + **TypeScript**, publicável no Vercel.
- **Editor**: CodeMirror 6. **Execução**: iframe isolado, sem rede e sem acesso à página.
- **Conteúdo**: arquivos TypeScript tipados, validados por testes automáticos.
- **Progresso e rascunhos**: Postgres, acessado somente pela API do servidor. Comece como visitante ou entre com uma conta para continuar em outros dispositivos.
- **Contas**: Better Auth, com confirmação de e-mail, sessões no banco e recuperação de senha.

## Rodando

```bash
pnpm install
pnpm conta:setup    # prepara .env.local e gera o segredo sem sobrescrever chaves existentes
pnpm db:up          # Postgres local no Docker (porta 5433)
pnpm db:migrate     # cria/atualiza as tabelas
pnpm dev            # http://localhost:3001
```

| Comando               | O que faz                                                                    |
| --------------------- | ---------------------------------------------------------------------------- |
| `pnpm test`           | Testes do motor de execução, do conteúdo (todas as lições) e dos componentes |
| `pnpm typecheck`      | TypeScript                                                                   |
| `pnpm lint`           | ESLint (`eslint-config-next`)                                                |
| `pnpm build`          | Build de produção                                                            |
| `pnpm format[:check]` | Prettier                                                                     |

Pede Node 22.x e pnpm 11.

A configuração online na Vercel e no Neon está documentada em [DEPLOY.md](DEPLOY.md). A prévia online usa apenas login Google enquanto o SMTP real não estiver configurado.

O desenvolvimento local também usa Docker Desktop. Os dados ficam em um volume persistente: `pnpm db:down` para o banco sem apagar os dados; `pnpm db:up` inicia novamente. A senha em `.env.example` é exclusiva do ambiente local.

Para usar outro Postgres, configure `DATABASE_URL` em `.env.local`. As credenciais nunca são enviadas ao navegador. Para bancos com pooler, configure também `DATABASE_URL_UNPOOLED` para as migrações. Elas são versionadas em `db/migrations`, aplicadas em transação e registradas em `rabisco_migracoes`.

No primeiro acesso, os dados antigos do localStorage são importados; as chaves importadas só são removidas após confirmação do servidor. O localStorage não recebe novas gravações. Rascunhos de versões antigas que não podem ser importados são preservados no navegador. Importar não substitui rascunhos já existentes no banco.

Sem conta, o cookie identifica o visitante neste navegador; limpar esse cookie cria outra identidade. Com uma conta, o progresso e os rascunhos ficam vinculados ao usuário autenticado e podem ser recuperados em outro dispositivo. O progresso é mesclado sem apagar exercícios de outras abas e atualizado ao voltar à janela. Falhas de rede aparecem com uma opção para tentar novamente.

## Conta opcional e recuperação de acesso

Use **Entrar** no cabeçalho ou **Salvar meu progresso** depois de acertar um exercício. O cadastro pede e-mail e senha de pelo menos 12 caracteres. É preciso confirmar o e-mail antes de entrar. O estudo continua disponível sem cadastro.

No desenvolvimento, o Docker também inicia o Mailpit: os e-mails de confirmação e recuperação ficam em [localhost:8025](http://localhost:8025) e não são enviados à caixa de entrada real. Abra a mensagem e siga o link. **Esqueci minha senha** envia um link temporário; a redefinição revoga as sessões anteriores.

Ao entrar, a aplicação incorpora as conclusões do navegador à conta em uma transação. A primeira data de conclusão é preservada. Rascunhos diferentes são comparados pela última atualização: a versão mais recente fica no editor e a anterior pode ser baixada na página da conta. Eventos de estudo e uso do tutor também são incorporados; entrar não reinicia a cota do tutor.

A API sempre obtém o usuário pela sessão validada no servidor. A saída recarrega a página e limpa o estado em memória. Gravações carregam a identidade esperada; se a conta mudar antes de salvar, o servidor recusa a gravação em vez de copiá-la para outra pessoa. O cookie de visitante é renovado após a incorporação.

Configure `BETTER_AUTH_URL` com o endereço exato do app e `BETTER_AUTH_SECRET` com um valor aleatório de pelo menos 32 caracteres. `pnpm conta:setup` gera esse segredo localmente e preserva as configurações já preenchidas. O servidor de desenvolvimento usa a porta 3001; ao trocar de porta ou domínio, atualize também `BETTER_AUTH_URL` e reinicie o servidor.

Para produção, configure um domínio HTTPS, um segredo próprio e um SMTP real em `AUTH_SMTP_URL` e `AUTH_EMAIL_FROM`. O Mailpit é exclusivamente de desenvolvimento. As senhas são tratadas pela biblioteca de autenticação; não são armazenadas em texto puro. Sessões e limites de tentativas ficam no Postgres. A biblioteca pode registrar IP e agente do navegador nas sessões; configure os cabeçalhos confiáveis conforme o proxy da hospedagem.

Com o app e o Docker rodando, `pnpm test:conta` verifica cadastro, e-mail local, migração de progresso, acesso em outro dispositivo, gravações de sessão antiga, redefinição, revogação e saída. Esse teste aceita apenas um endereço local e o SMTP local, cria uma conta fictícia e remove seus próprios dados ao terminar. Os e-mails fictícios permanecem no Mailpit para inspeção. `pnpm test` também inclui testes de isolamento, mesclagem, preservação de versões e rollback em um esquema temporário quando `TEST_DATABASE_URL` está configurada.

Os testes de integração usam um Postgres real quando `TEST_DATABASE_URL` está definida (por exemplo, o mesmo endereço local de `.env.example`). Eles criam identificadores próprios e removem apenas seus dados de teste. Sem essa variável, esses dois testes são ignorados.

## Continuidade e métricas de aprendizado

A página inicial mostra **Continuar estudando** após uma atividade e sugere a última lição visitada com exercícios pendentes. Lições concluídas levam ao próximo passo disponível; quando tudo foi concluído, a ação passa a ser **Revisar as trilhas**. Ao abrir uma lição, o primeiro exercício pendente é selecionado automaticamente. Lições já concluídas abrem no primeiro exercício para revisão. O conteúdo do curso continua sendo gerado estaticamente.

Os eventos de visita, abertura de exercício, execução, conferência e uso do tutor são registrados no Postgres. Cada evento tem identificador único para deduplicar reenvios. Só são gravados tipo, identificador interno de visitante ou conta, trilha, lição, posição, resultado da conferência e data do servidor. Código, perguntas, respostas e mensagens de erro não são gravados nas métricas.

Execute `pnpm metricas` para o relatório dos últimos 30 dias, ou `pnpm metricas 7` para sete dias. Ele mostra visitantes, retorno em dias distintos, alunos que iniciaram/acertaram exercícios, pedidos/respostas do tutor e exercícios abertos sem acerto registrado no período. A falta de acerto é um sinal para investigar, não uma confirmação de abandono. Como os eventos vêm do navegador e a identidade depende do cookie, os dados não são certificados nem uma contagem exata de pessoas.

A medição funciona sem um serviço externo, é enviada em segundo plano e não bloqueia o estudo quando falha. Eventos podem ser perdidos em falhas de conexão. Há um limite básico de 500 eventos por visitante/hora e retenção de 90 dias, com limpeza ao receber novos eventos. Depois desse período, a retomada usa as conclusões salvas caso a última visita não esteja mais disponível. O progresso e os rascunhos não são removidos por essa limpeza. O relatório roda somente pelo terminal, sem uma página pública que exponha métricas.

## Narração dos exercícios

Cada exercício oferece **Ouvir exercício**, com pausa, retomada, repetição, parada e velocidade ajustável. A narração só começa após um clique e termina ao trocar de exercício ou sair da página. O texto falado pode ser consultado em **Texto da narração**.

A primeira versão usa a [síntese de voz do navegador](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), sem chamadas a uma API de áudio do MundoJS. Prefere uma voz brasileira; disponibilidade, qualidade e uso de serviço local ou remoto dependem do navegador e do dispositivo. Quando não há voz em português ou o motor não responde, a interface explica o problema e o enunciado permanece disponível.

O roteiro inclui título, enunciado e orientações para tentar, rodar e conferir; dicas ocultas, solução e código do aluno não são narrados. Autores podem acrescentar `explicacaoAudio` a um exercício para explicar sua abordagem sem entregar a solução. A primeira atividade de `ola-mundo.ts` já tem um exemplo. Os testes verificam segmentação de falas, pausa entre trechos, cancelamento e eventos tardios do motor de voz.

## Projetos práticos e resultados das trilhas

As páginas das trilhas destacam o que o aluno vai praticar e construir. Em `/projetos`, os desafios finais viram quatro programas integrados: ferramentas de lógica, estoque de loja, ranking de jogo e carregador de dados simulado. Cada projeto reúne as etapas no mesmo editor e confere todos os testes do desafio. A conclusão de uma lição final oferece o acesso ao projeto correspondente.

Rascunhos de projetos usam chaves `projeto/<trilha>` no mesmo armazenamento Postgres. Ficam separados das lições e são incorporados à conta pelo fluxo existente, inclusive com preservação de versões conflitantes. É possível construir, salvar e baixar um arquivo `.js` sem cadastro. O tutor recebe o enunciado de todas as etapas do projeto, sem soluções de referência.

Para compartilhar, entre na conta e abra **Compartilhar uma versão do projeto**. A ação **Criar link de leitura** publica somente o código atual, após o aviso de revisão. Mudanças posteriores no rascunho permanecem privadas até clicar em **Atualizar link com este código**. Cada conta controla um link por projeto; **Retirar link do ar** torna o endereço indisponível para novas consultas. Uma nova publicação após a retirada ganha outro endereço. Cópias já feitas por quem leu não podem ser recolhidas.

O identificador do link tem 192 bits aleatórios. Qualquer pessoa com o link pode ler o código; não é uma área privada. A página não divulga nome nem e-mail do autor, pede para não ser indexada e exibe código escapado, sem editor ou executor. Somente a sessão do dono pode consultar o gerenciamento, publicar, atualizar ou retirar seu link; ações de abas com identidade antiga são recusadas. A migração `006_projetos_compartilhados.sql` cria essa persistência. No ambiente local, o link só abre na máquina onde o projeto está rodando; para acesso externo, publique o aplicativo em um domínio acessível.

Os testes verificam os quatro programas integrados, o isolamento entre contas, a separação entre rascunho e publicação, a revogação dos links e o escape de código potencialmente malicioso. `pnpm test:conta` também verifica rascunhos de projeto em outro dispositivo, bloqueio de publicação gratuita e retirada após cancelamento. Para testar a publicação, usa uma fixture Pro somente na conta fictícia descartável e exige banco, aplicação e SMTP locais; não cria pagamento nem chama o Stripe.

## Tutor adaptativo e atalhos da lição

Os atalhos **Ler**, **Praticar** e **Ajuda** permitem alternar entre explicação, editor e tutor. No celular, o enunciado também fica junto ao editor e os botões Rodar/Conferir acompanham a área de prática. A navegação mantém o foco visível e respeita a preferência por menos movimento.

O tutor oferece três níveis escolhidos pelo aluno: **Uma pista**, **Explicar o conceito** e **Exemplo parecido**. Após uma resposta, incentiva uma nova tentativa no editor e permite preparar o próximo nível de ajuda sem enviá-lo automaticamente.

O servidor consulta somente eventos da identidade autenticada ou do visitante atual nos últimos 30 dias. Envia ao Gemini contagens de conferências, resultados e ajudas do exercício, além de até três tópicos com falhas repetidas ainda sem acerto posterior. Os tópicos são títulos das lições, sem identificador da conta, código anterior ou conversas salvas. O resumo acompanha o progresso quando o visitante entra na conta. O editor livre não consulta histórico de lições. Falha na consulta mantém a ajuda contextual disponível.

As métricas são sinais de uso, não diagnóstico de capacidade. A adaptação orienta o modelo a mudar a abordagem diante de tentativas repetidas e a usar exemplos diferentes do exercício. Os testes verificam isolamento por identidade, limites do histórico, validação dos níveis e instruções enviadas ao Gemini. A lista de entregas e pendências está em [MELHORIAS.md](MELHORIAS.md).

## Tutor com Gemini

O tutor aparece nas lições e no rascunho livre. Abra **Pedir ajuda**, escolha uma sugestão ou escreva sua pergunta e envie. Ele recebe o código atual, o diagnóstico da última execução (apenas se o código não mudou), o enunciado e as explicações da lição. O servidor busca esse conteúdo diretamente no curso; a solução de referência e o código interno dos testes não são enviados ao modelo.

Configure `GEMINI_API_KEY` em `.env.local` com uma chave criada no [Google AI Studio](https://aistudio.google.com/apikey) e execute `pnpm db:migrate`. Reinicie o servidor após mudar as variáveis. Em produção, configure a chave nas variáveis privadas da hospedagem, nunca em uma variável com prefixo `NEXT_PUBLIC_`.

O modelo padrão é `gemini-3.5-flash-lite`, substituível por `GEMINI_MODEL`. A integração usa a [API REST generateContent do Gemini](https://ai.google.dev/api/generate-content), com a chave no cabeçalho e chamadas somente pelo servidor. Não há ferramentas de execução, edição automática do código ou alterações no progresso pelo tutor.

Por padrão, o Postgres limita a 20 tentativas por visitante/hora e 1.000 tentativas totais/dia (UTC). Ajuste `TUTOR_LIMITE_HORA` e `TUTOR_LIMITE_DIARIO` conforme sua quota e orçamento. Tentativas que chegam ao provedor contam mesmo se falharem ou forem canceladas; os contadores antigos são removidos após dois dias. O limite global também vale se alguém apagar o cookie para criar outra identidade. Esses limites controlam chamadas, não representam um teto monetário; configure também as proteções da conta do Google.

Perguntas só são enviadas quando a pessoa escolhe **Enviar pergunta**. A interface informa que pergunta, código e contexto serão compartilhados com o Gemini. A conversa fica apenas na memória da página, limitada aos quatro pares anteriores, e começa novamente ao trocar de exercício ou abrir **Nova conversa**. O servidor não guarda nem registra o conteúdo das conversas. As políticas de tratamento do provedor se aplicam ao que é enviado.

Sem chave, quota disponível ou conexão, o tutor apresenta uma mensagem com opção de tentar novamente; o editor e o corretor continuam funcionando. Os testes do provedor usam respostas simuladas, sem consumir a API. Os limites também têm teste de concorrência com Postgres quando `TEST_DATABASE_URL` está configurada.

## Como o código do aluno roda

O código do aluno **nunca roda na página do MundoJS**. Cada execução cria um `iframe` novo (`src/engine/sandbox.ts`):

- `sandbox="allow-scripts"` e mais nada. Sem `allow-same-origin`, o iframe tem origem opaca: não vê cookies, `localStorage` nem a página de fora. Verificado no navegador: `fetch`, `localStorage`, `parent.document`, `document.cookie` e `top.location` são todos barrados.
- Uma política de conteúdo dentro do documento (`default-src 'none'`) corta toda a rede.
- Um iframe **por execução**, descartado no fim: cada "Rodar" começa limpo, e temporizadores esquecidos morrem junto.

**Laço infinito.** `src/engine/analisar.ts` lê o código com o `acorn` e põe um contador no começo de cada `for`/`while`/`do`, na mesma linha, sem mudar a numeração. Passou de 5 milhões de voltas, vira a mensagem "Parece um laço infinito" (a aba não trava). Um vigia no `sandbox.ts` descarta o iframe se ele deixar de responder.

**Código que espera.** `setTimeout`, `setInterval` e `await` (inclusive no nível de cima) funcionam. O programa espera os temporizadores por até 3 segundos e encerra os que sobrarem, com um aviso. Nos testes, cada um espera a resposta por até 2 segundos, e todos juntos por até 6: uma promessa que nunca termina vira "Sua função não terminou em 2 segundos…" em vez de prender a conferência. Temporizadores que o código do aluno arma durante os testes são limpos no fim. Escreva testes que dependem de tempo com esperas curtas (10 a 250 ms) e deixe a margem para a máquina do aluno.

**Erros em português.** Erros de escrita são achados antes de rodar, com a linha exata. Erros de execução passam por `src/engine/mensagens.ts`, que troca a mensagem do navegador por uma explicação e um próximo passo. Dois casos que quem começa com `async` mais vê têm mensagem própria: `await` dentro de uma função que não é `async`, e `.then` em algo que não devolveu promessa (quase sempre falta um `return`).

> **O executor é injetado no iframe como texto** (`criarExecutor.toString()`). Por isso `criarExecutor` em `src/engine/executor.ts` precisa ser **autocontida**: nada de importar valores nem usar variáveis de fora dela. Há um teste que a recria só a partir do texto; se ele falhar, é isso.

## Estrutura

```
src/
  app/            páginas (início, trilhas, lição, rascunho)
  components/     Folha (editor + saída + conferência), Sumario, marcas de caneta
  conteudo/       as lições
    tipos.ts      o formato de uma lição
    trilhas/      uma pasta por trilha: um arquivo por lição e um index.ts que as organiza em módulos
    index.ts      a lista de trilhas e as buscas
  engine/         análise, executor, sandbox, tradução de erros
  progresso/      estado do cliente, API e importação dos dados antigos
  servidor/       conexão, persistência e validação no Postgres
```

## Quantidade de exercícios

O curso reúne **213 exercícios**: 63 em JavaScript do zero, 42 em Listas e objetos, 57 em Listas e textos de verdade, 43 em Erros e código assíncrono e 8 em DOM e eventos. A trilha DOM tem oito lições, com seleção de elementos, textos, estilos, classes, criação de elementos, cliques, formulários e uma lista de tarefas como desafio final. Ela segue o acesso Pro das trilhas avançadas.

As atividades DOM têm abas HTML, CSS e JavaScript e uma prévia interativa. Rodar recria a página; Conferir também simula as interações descritas nos testes. HTML, CSS e JavaScript são salvos juntos no mesmo rascunho Postgres, sem mudar as chaves dos exercícios antigos. O rascunho livre oferece um modo de página web separado (`rascunho-web`), preservando o rascunho JavaScript existente.

A prévia mantém iframe de origem opaca com `allow-scripts allow-forms`, rede e envio de formulários bloqueados por CSP (`form-action 'none'`) e remoção de scripts, atributos de eventos e elementos ativos do HTML. A permissão de formulários permite disparar o evento nativo `submit`; o código do aluno trata esse evento com `preventDefault`. O executor JavaScript sem prévia continua com apenas `allow-scripts`. O JavaScript deve ser escrito na sua própria aba e passa pela análise e proteção de laços existentes. Os testes usam Happy DOM somente para executar as soluções de referência e os códigos iniciais confiáveis do repositório; código de usuários continua sendo executado exclusivamente no iframe do navegador. React ainda não está implementado.

As atividades misturam implementação, depuração e casos de limite. Cada uma tem enunciado, dicas, código inicial, solução de referência e testes executáveis. A validação automática confere as soluções, a ausência de acertos gratuitos e a distinção entre os exercícios.

Os 153 exercícios anteriores mantiveram sua ordem e seu conteúdo. Os acertos já salvos continuam valendo. Para o progresso com registros individuais, uma lição ampliada só aparece completa depois dos novos exercícios; a retomada abre o primeiro pendente. Registros legados que guardavam apenas a conclusão da lição, sem detalhes por exercício, mantêm a compatibilidade anterior.

## Escrevendo uma lição

Cada trilha é uma pasta em `src/conteudo/trilhas/`, com um arquivo por lição (`export const minhaLicao: Licao = { ... }`) e um `index.ts` que lista as lições em módulos. Para uma lição nova, crie o arquivo e acrescente-a a um módulo do `index.ts`. Para uma trilha nova, crie a pasta e registre-a em `src/conteudo/index.ts`.

```ts
{
  slug: 'dobro-de-um-numero',            // vira o endereço; só a-z, 0-9 e hífen
  titulo: 'Dobrando um número',
  resumo: 'Uma frase para o índice.',
  conteudo: [
    { tipo: 'p', texto: 'Texto com `código`, **negrito** e *itálico*.' },
    { tipo: 'codigo', codigo: 'console.log(2 * 4);', saida: '8' },
    { tipo: 'nota', texto: 'Um aviso à margem.', tom: 'cuidado' },
  ],
  exercicios: [                           // um ou mais; a lição conclui quando todos estão certos
    {
      titulo: 'Dobro simples',            // obrigatório quando há mais de um exercício
      enunciado: [{ tipo: 'p', texto: 'Escreva `dobro(n)`, que devolve o dobro de `n`.' }],
      codigoInicial: 'function dobro(n) {\n  // ...\n}\n',
      dicas: ['Use `return`.'],
      testes: [
        { descricao: 'dobro(4) devolve 8', codigo: js`igual(dobro(4), 8, 'dobro(4)')` },
      ],
      solucao: 'function dobro(n) {\n  return n * 2;\n}',
    },
  ],
}
```

**Os testes** rodam dentro do iframe, junto do código do aluno, e enxergam:

| Nome                                 | O que é                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| funções do aluno etc.                | Tudo que ele declarou no nível de cima (`dobro`, `total`, ...)                               |
| `igual(recebido, esperado, rótulo?)` | Compara listas e objetos pelo conteúdo. O rótulo vira "`dobro(4)` deveria ser 8, mas foi 7." |
| `verdadeiro(condição, mensagem)`     | Falha com a mensagem                                                                         |
| `saida`                              | Lista das linhas que o código imprimiu (`console.log`)                                       |
| `codigoDoAluno`                      | O texto do código, para conferir se usou um `for`, por exemplo                               |

Use a etiqueta `js` (de `ajudantes.ts`) para escrever o código de um teste sem dobrar as barras de expressões regulares.

**Vários exercícios por lição.** Cada exercício é corrigido sozinho, e o progresso guarda quais já estão certos (`trilha/licao#indice`); o índice mostra "2 de 4 exercícios feitos" enquanto a lição não termina. Com mais de um exercício, cada um precisa de `titulo`, e o código inicial, a solução e o título não podem se repetir dentro da lição. Os exercícios devem ficar em ordem de dificuldade e variar o **tipo** de pedido: escrever uma função, mostrar na tela, mudar um valor, corrigir um trecho.

**Cada trilha termina num desafio final**, uma lição sem ferramenta nova, que junta o que a trilha ensinou em exercícios maiores. Fica num módulo próprio, "Desafio final".

**Escrevendo os textos.** O código inline (entre crases) não pode começar nem terminar com espaço, e não pode conter crases: um trecho como `` return `Olá` `` quebra a marcação. Escreva `"Olá, "` (com aspas) ou `${nome}` (sem as crases de fora). Para testes com tempo (`setTimeout`, promessas), use esperas curtas, de 10 a 60 ms, e limites folgados: o corretor dá 2 s a cada teste e 6 s ao todo. Se o teste cria uma promessa rejeitada, faça `promessa.catch(() => {})` nela, para o teste não gerar um erro "não tratado" quando o código do aluno ainda não existe. Para conferir **paralelismo**, receba funções que criam as promessas (`tarefas`), e não promessas já criadas: promessas prontas já estão rodando, e esperar uma a uma custa o mesmo tempo.

**A validação é automática.** `pnpm test` roda, para toda lição: a **solução passa em todos os testes**; o **código inicial roda sem erro e não passa em nenhum teste** (um "certo" de graça engana quem está começando); cada **exemplo imprime exatamente o que o texto diz** (`saida`); e os endereços são únicos. Cada exercício tem título, código inicial e solução próprios. Escrever uma lição com teste errado é difícil de passar despercebido.

## Entrar com Google (Firebase)

O botão **Continuar com Google** está disponível em `/conta` e `/conta/criar`. A configuração pública do projeto `mundojs-8787c` está em `.env.example` e `.env.local`. Google já está habilitado no projeto e `localhost` está autorizado. Não é necessária chave administrativa para este fluxo.

O SDK Firebase abre a seleção de conta e mantém a identidade somente em memória. O servidor verifica assinatura RS256 pelas chaves públicas oficiais, emissor, projeto, validade, autenticação recente, e-mail confirmado e provedor Google. A troca exige a mesma origem do site e cria a sessão do MundoJS no Postgres. O SDK descarta sua sessão temporária após a troca. Analytics não é inicializado.

Uma conta MundoJS com o mesmo e-mail **já confirmado** é reutilizada. Se o cadastro anterior ainda não confirmou o e-mail, confirme-o antes de usar Google. O progresso e os rascunhos seguem o mesmo processo de incorporação das contas por senha.

Ao publicar, configure as variáveis `NEXT_PUBLIC_FIREBASE_*` **antes do build**, defina `BETTER_AUTH_URL` com o endereço público e adicione o domínio em **Firebase Console / Authentication / Settings / Authorized domains**. A configuração Firebase é pública por definição; `BETTER_AUTH_SECRET` e `GEMINI_API_KEY` continuam exclusivamente no servidor.

Os testes de assinatura usam chaves locais descartáveis. Com `TEST_DATABASE_URL`, também verificam a criação e leitura da sessão, reutilização de conta confirmada, bloqueio de vínculo com e-mail pendente e rejeição de origem externa em um esquema isolado. A seleção de uma conta Google real deve ser feita pelo próprio usuário no navegador.

## Planos e Stripe

Em `/planos`, o lançamento tem duas opções:

| Plano              | Preço       | Tutor                                | Conteúdo                                      |
| ------------------ | ----------- | ------------------------------------ | --------------------------------------------- |
| Gratuito com conta | R$ 0        | 3 perguntas por mês calendário (UTC) | JavaScript do zero completa e rascunho livre  |
| MundoJS Pro        | R$ 9,99/mês | 100 perguntas por ciclo mensal pago  | Todas as trilhas, 213 exercícios e 4 projetos |

Visitantes sem conta experimentam 1 pergunta por mês neste navegador. Cada envio ao tutor conta, inclusive explicações e exemplos. Falhas conhecidas do serviço devolvem a pergunta à franquia. A reserva é atômica no Postgres; uma interrupção abrupta do processo depois da reserva pode consumir a tentativa. Perguntas não acumulam. Os limites por hora e o teto diário global continuam como proteção de custo; não há promessa de uso ilimitado. A franquia da conta é a mesma em todos os dispositivos. A redução do gratuito preserva o uso já registrado, sem reiniciar a franquia.

O catálogo mostra títulos e resumos de todas as trilhas e projetos. A trilha `javascript-do-zero` é gratuita; as outras trilhas e todos os projetos exigem assinatura Pro ativa. As páginas consultam a sessão no servidor antes de enviar enunciados, exemplos, testes ou soluções do conteúdo pago; as rotas protegidas são dinâmicas. O tutor também verifica o acesso ao contexto antes de consumir cota ou chamar o Gemini, e publicar ou atualizar projetos exige Pro. A consulta e a retirada dos próprios links já publicados continuam disponíveis após o cancelamento, assim como a leitura pública de versões anteriormente compartilhadas. Não há exclusão de progresso nem de código pessoal salvo. O gratuito mantém editor, correção e narração na primeira trilha, sincronização da conta e rascunho livre.

`/conta/plano` mostra saldo, renovação e cancelamento agendado e abre o portal do cliente. O produto funciona gratuitamente sem chaves Stripe; os botões de pagamento ficam indisponíveis até a configuração. Não há plano anual nem cobrança avulsa.

### Configurar primeiro em teste

1. Aplique `pnpm db:migrate` (inclui `007_assinaturas.sql`). No Stripe, crie **MundoJS Pro** e um preço **recorrente mensal, BRL 9,99, quantidade fixa 1**, sem consumo medido, transformação de quantidade, teste grátis ou descontos. Mantenha cartão habilitado. A integração usa Checkout hospedado; não precisa de chave pública no navegador.
2. Em `.env.local`, configure `STRIPE_SECRET_KEY=sk_test_...`, `STRIPE_PRICE_PRO_MENSAL=price_...` e `STRIPE_WEBHOOK_SECRET=whsec_...`. Use `BETTER_AUTH_URL=http://localhost:3001` localmente. Reinicie o servidor após alterar variáveis. Nunca use prefixo `NEXT_PUBLIC_` nesses segredos.
3. Configure o [portal do cliente](https://docs.stripe.com/customer-management/integrate-customer-portal): histórico de faturas, atualização do cartão e cancelamento **ao fim do período pago**. Não habilite troca de plano, quantidade, cupons ou teste grátis neste lançamento. Salve a configuração no mesmo ambiente das chaves.
4. Para encaminhar os [webhooks locais](https://docs.stripe.com/webhooks), use o Stripe CLI autenticado: `stripe listen --forward-to localhost:3001/api/stripe/webhook`. Copie o segredo exibido pelo listener para `STRIPE_WEBHOOK_SECRET`. Em produção, registre o endereço HTTPS público dessa rota, com eventos snapshot compatíveis com a API `2026-10-28.endive` do SDK Stripe 23 instalado.
5. Eventos necessários: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed` e `customer.deleted`.
6. Entre numa conta de teste com e-mail verificado, abra `/planos` e conclua o Checkout **no ambiente de teste**. Confira ativação, nova cobrança mensal, falha de pagamento, cancelamento no fim do período, reentrega de evento e portal antes de colocar chaves de produção. Em produção, use outro segredo de webhook e o preço criado no ambiente real.

O servidor escolhe o preço, o cliente e os endereços de retorno. O preço é conferido como 999 centavos BRL/mês antes de abrir Checkout. Ações exigem sessão verificada, mesma origem e identidade da aba. Um bloqueio por conta, chaves persistidas de idempotência, busca de checkout aberto e verificação de assinaturas existentes evitam duplicações. O portal usa somente o cliente vinculado à conta autenticada.

**O retorno do Checkout não ativa o Pro.** O webhook verifica assinatura sobre o corpo original, separa teste/produção, deduplica eventos e consulta o estado atual no Stripe, pois a entrega pode ocorrer fora de ordem. Só uma assinatura ativa, do preço esperado e com fatura paga concede acesso até o fim do ciclo. Cancelamento imediato, ausência de período pago ou pagamento pendente mantêm o gratuito; cancelamento ao fim mantém acesso até a data paga. A data de validade também é conferida ao usar o tutor, mesmo se um webhook atrasar. Falha de sincronização retorna erro para que o Stripe reentregue o evento.

Os testes usam Stripe simulado e assinaturas de webhook geradas localmente; com `TEST_DATABASE_URL`, validam concorrência, idempotência, isolamento de contas e franquias num esquema descartável. **Ainda é necessário validar Checkout e portal no ambiente de teste da sua conta Stripe** antes de habilitar pagamentos reais. Não foram criados produtos, assinaturas nem cobranças em conta externa durante a implementação.

## Crescendo

**Contas e progresso.** As telas falam com `src/progresso/armazem.ts`, que usa `repositorio-servidor.ts`. A API identifica visitantes por um token aleatório HttpOnly e usuários por uma sessão do Better Auth. `src/servidor/vincular-progresso.ts` incorpora os dados de visitante à conta. A conferência dos exercícios continua no navegador; este progresso não serve como prova para certificados.

**Correção no servidor.** Os testes das lições estão no código que o navegador recebe, então um aluno curioso pode lê-los. Para ensinar isso não faz diferença. Para **certificado ou ranking**, a conferência tem de rodar no servidor — o formato das lições (só dados) já permite levá-las para um banco.

**Executor em outra origem.** O iframe já é isolado. Quando existir login, vale servi-lo de um subdomínio próprio (por exemplo `executor.seudominio.com`), para código de terceiros nunca dividir origem com sessões.

**Mais trilhas.** Crie a pasta da trilha e registre em `src/conteudo/index.ts`: o índice, as páginas e a validação se atualizam sozinhos.

### Dados no código inicial dos exercícios

Exercícios que recebem dados devem trazer exemplos utilizáveis em `codigoInicial`: listas, objetos, textos, números ou funções simuladas, conforme o desafio. Mantenha a implementação que o aluno precisa escrever incompleta e inclua chamadas de exemplo. Chamadas que dependem de uma função ainda não implementada devolver outra função ficam comentadas, com orientação para experimentar depois.

Os testes conferem que o ponto de partida não entrega acertos e que os dados e chamadas funcionam junto da solução correta. Atividades cujo objetivo é criar variáveis ou estruturas mantêm essa parte como tarefa do aluno. Rascunhos salvos têm prioridade sobre o modelo inicial; **Recomeçar** carrega o modelo atual após a confirmação, substituindo o código daquela folha.

Os quatro projetos integrados têm seus próprios dados compartilhados. Ao reunir as etapas, o catálogo reaproveita as declarações de função e evita concatenar variáveis de exemplo repetidas entre exercícios.

## Publicando no Vercel

### Verificações automáticas

O workflow [verificar.yml](.github/workflows/verificar.yml) roda em pushes e pull requests: instala o lockfile sem alterar versões, audita dependências, aplica migrações em um Postgres 17 descartável, gera os tipos do Next.js e executa tipagem, lint, todos os testes e build. Ele usa Node.js 22 atualizado e pnpm na versão de `packageManager`. As ações estão fixadas por commit, têm permissão de leitura e não mantêm credenciais no checkout. Não utiliza segredos reais de autenticação, Stripe, Gemini ou banco de produção.

A `main` está protegida no GitHub: alterações entram por pull request com branch atualizada e o check **Tipagem, testes, seguranca e build** aprovado pelo GitHub Actions. A regra também se aplica aos administradores, bloqueia envio forçado e exclusão e exige resolução das conversas de revisão. Não exige aprovação de outro revisor. Trabalhe em uma branch, envie ao GitHub, abra o pull request e aguarde as verificações para integrar.

O workflow não publica a aplicação; a hospedagem ainda precisa ser configurada para publicar somente versões aprovadas. A auditoria completa bloqueia alertas altos/críticos; atualmente resta um alerta moderado de minimatch nas ferramentas de lint, registrado em [PRODUCAO.md](PRODUCAO.md#p02--resolver-o-aviso-de-segurança). A auditoria de dependências de produção não aponta alertas conhecidos após esta atualização.

### Publicação

1. Suba o repositório para o GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. Configure `DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `AUTH_SMTP_URL` e `AUTH_EMAIL_FROM`. Para o tutor, configure também `GEMINI_API_KEY`. Aplique `pnpm db:migrate` usando a conexão direta antes da publicação. Cada ambiente deve usar seu próprio banco e segredos.
3. Cada push na `main` publica; cada branch ganha uma prévia.

As fontes (Bricolage Grotesque e Atkinson Hyperlegible) vêm do Google Fonts **em tempo de build**: o build precisa de internet.

## Decisões

- **Sem biblioteca de ícones nem de componentes.** As marcas de caneta (visto, xis, rabisco) são SVG escritos à mão; menos dependência, menos o que quebrar a cada atualização.
- **TypeScript 5 e ESLint 9.** As versões mais novas (TypeScript 7, ESLint 10) ainda não funcionam com o `typescript-eslint`.
- **Sem tema escuro.** O visual é papel e caneta; a folha clara é parte da ideia.
- **O corretor é por função.** Quase todo exercício pede uma função, que o corretor chama com vários valores. É o que permite conferir sem depender do que o aluno imprime.
