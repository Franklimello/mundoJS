# Melhorias do MundoJS

Lista retomada da avaliação do produto e atualizada conforme as entregas.

## Aprender a raciocinar — próxima sequência

- [x] Testar funções com diferentes entradas e apresentar o resultado de cada teste.
- [x] Dar ajuda contextual com Gemini em níveis de pista, conceito e exemplo parecido.
- [x] Oferecer projetos com etapas e correção automática, incluindo a calculadora de compras.
- [x] Investigar acessos fora dos limites de arrays: fotografia dos índices, explicação, pergunta de reflexão e pista opcional, preservando a tentativa do aluno.
- [x] Ampliar o investigador para propriedades ausentes de objetos, por ponto ou colchetes, diferenciando ausência de valores `undefined` existentes e oferecendo fotografia, reflexão e pista.
- [ ] Prototipar execução passo a passo para um subconjunto explícito de JavaScript, com variáveis, iterações e saída. Validar a compreensão com alunos antes de ampliar a linguagem suportada.
- [ ] Construir um mapa de aprendizagem com evidências de tentativas e revisão posterior. Separar conclusão de aula de domínio, evitando percentuais de competência sem critério validado.
- [ ] Criar desafio diário e sequência de prática; avaliar retorno e conclusão antes de acrescentar competição.
- [ ] Oferecer revisão de código após o acerto, com sugestões justificadas e opcionais.
- [ ] Avaliar ranking, arena e entrevistas após ter validação de resultados adequada à comparação entre alunos.

## Entregas e operação

- [x] Preparar dados de entrada e chamadas de exemplo nos exercícios e projetos que recebem listas, objetos, textos, valores, promessas ou callbacks, preservando os desafios e rascunhos existentes.

- [x] Emitir certificados privados por trilha concluída, com nome confirmado, registro único e download direto em PDF.
- [x] Reunir próximo exercício, progresso por trilha, prática dos últimos sete dias e certificados no painel Meu aprendizado, respeitando o plano da conta.

Para preparar o lançamento, acompanhar a lista priorizada com critérios de conclusão em [PRODUCAO.md](PRODUCAO.md).

- [x] Retomar a última lição e selecionar o primeiro exercício pendente.
- [x] Tornar a correção inicial mais clara e medir o percurso no Postgres.
- [x] Oferecer conta opcional, confirmação de e-mail e recuperação de acesso.
- [x] Incorporar progresso e preservar rascunhos ao entrar na conta.
- [x] Permitir entrada com Google via Firebase.
- [x] Narrar os exercícios em português, com controles de reprodução.
- [x] Adaptar o tutor ao resumo das tentativas recentes da identidade atual.
- [x] Oferecer ajuda progressiva: pista, explicação, exemplo parecido e retorno à tentativa.
- [x] Facilitar o celular com atalhos Ler, Praticar e Ajuda, enunciado perto do editor e ações de execução acessíveis.
- [x] Destacar o que o aluno consegue construir ao terminar cada trilha.
- [x] Evoluir desafios para pequenos projetos que possam ser salvos e compartilhados.
- [x] Ampliar o curso de 153 para 205 exercícios, preservando os índices e os acertos anteriores.
- [x] Implementar plano gratuito e Pro de R$ 9,99/mês, franquia do tutor, Checkout e portal Stripe com confirmação no servidor.
- [x] Reduzir o gratuito à primeira trilha, rascunho livre e 3 perguntas por mês com conta (1 sem conta); reservar demais trilhas e projetos ao Pro, com autorização no servidor e preservação dos dados anteriores.
- [ ] Configurar as chaves, o preço e o portal Stripe e validar o fluxo completo no ambiente de teste da conta.
- [ ] Avaliar as melhorias com dados reais de aprendizagem, retorno e custo de IA.
- [ ] Preparar versões da marca para cabeçalho e símbolo pequeno.
- [x] Atualizar Next.js para 16.4.4, remover o aviso anterior de vulnerabilidade e validar testes/build; auditoria de produção sem alertas conhecidos.
- [x] Preparar verificações automáticas no GitHub com auditoria, migrações, tipagem, lint, testes com Postgres e build.
- [x] Confirmar execução remota do workflow no GitHub, com todas as etapas aprovadas.
- [x] Proteger a main com pull request, check aprovado, branch atualizada e bloqueio de envio forçado/exclusão, inclusive para administradores.
- [ ] Vincular a publicação da hospedagem a versões aprovadas, após definir a infraestrutura.
- [ ] Atualizar as ferramentas de lint para eliminar o alerta moderado transitivo de minimatch.
- [ ] Antes da publicação, configurar SMTP real.

O histórico adaptativo usa sinais dos últimos 30 dias, sem armazenar código ou conversas nas métricas. Esses sinais não comprovam domínio de um conceito. A qualidade pedagógica precisa ser acompanhada com usuários reais; os testes automatizados verificam os contratos, a privacidade entre identidades e as orientações enviadas ao modelo.
