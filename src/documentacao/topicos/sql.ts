import { treino } from '../ajudantes';
import type { TopicoDoc } from '../tipos';

export const sql: TopicoDoc = {
  slug: 'sql',
  titulo: 'Linguagem SQL e Banco de Dados',
  pro: true,
  resumo:
    'Guia completo de SQL: consultas com SELECT e WHERE, ordenação, paginação, agrupamento com GROUP BY, relacionamentos com JOINs e comandos de manipulação INSERT, UPDATE e DELETE.',
  introducao: [
    'O **SQL (Structured Query Language)** é a linguagem universal padrão para interagir com bancos de dados relacionais (como PostgreSQL, MySQL, SQLite e MariaDB). Com ele, você realiza consultas, insere registros, atualiza informações e modela estruturas de tabelas.',
    'No desenvolvimento web moderno em JavaScript, TypeScript e Node.js, compreender os fundamentos de SQL é indispensável para construir APIs eficientes, realizar buscas performáticas e manipular dados de forma segura sem depender cegamente de ORMs ou abstrações.',
  ],
  secoes: [
    {
      titulo: 'Consultas básicas (DQL)',
      descricao:
        'A base da recuperação de dados: selecionando colunas, filtrando linhas, ordenando e paginando resultados.',
      metodos: [
        {
          id: 'select',
          nome: 'SELECT e FROM',
          resumo: 'Comando fundamental para buscar e recuperar dados de colunas específicas de uma tabela.',
          sintaxe: 'SELECT coluna1, coluna2 FROM tabela;',
          retorno: 'Conjunto de linhas e colunas contendo os dados solicitados.',
          exemplos: [
            {
              codigo: "const sql = 'SELECT id, nome, email FROM usuarios;';\nconsole.log(sql);",
              saida: 'SELECT id, nome, email FROM usuarios;',
            },
          ],
          cuidado:
            'Evite usar `SELECT *` em código de produção. Listar explicitamente apenas as colunas necessárias reduz o consumo de banda, melhora a performance de índices no banco e evita quebras inesperadas quando a tabela recebe novas colunas.',
          treino: treino({
            enunciado: [
              'Guarde na constante `consulta` a instrução SQL para selecionar as colunas `nome` e `email` da tabela `clientes` terminando com ponto e vírgula, e mostre `consulta`.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT nome, email FROM clientes;' },
            usa: [
              { padrao: '\\bSELECT\\b', nome: 'cláusula SELECT' },
              { padrao: '\\bFROM\\b', nome: 'cláusula FROM' },
            ],
            mostra: 'SELECT nome, email FROM clientes;',
            dicas: [
              'Escreva `SELECT nome, email FROM clientes;`.',
              'Guarde na variável: `const consulta = "SELECT nome, email FROM clientes;";`.',
            ],
            resposta: ["const consulta = 'SELECT nome, email FROM clientes;';", 'console.log(consulta);'],
          }),
        },
        {
          id: 'where',
          nome: 'WHERE',
          resumo:
            'Filtra os registros retornados, selecionando apenas as linhas que satisfazem as condições lógicas estipuladas.',
          sintaxe: 'SELECT colunas FROM tabela WHERE condicao;',
          retorno: 'Linhas cuja expressão lógica resulta em verdadeiro.',
          exemplos: [
            {
              codigo:
                'const sql = "SELECT nome, cargo FROM funcionarios WHERE departamento = \'Engenharia\' AND salario >= 8000;";\nconsole.log(sql);',
              saida: "SELECT nome, cargo FROM funcionarios WHERE departamento = 'Engenharia' AND salario >= 8000;",
            },
          ],
          cuidado:
            "Valores de texto e datas em SQL devem ficar entre aspas simples (ex: `cidade = 'Recife'`). Já números e booleanos são escritos diretamente.",
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para buscar todas as colunas (`*`) da tabela `produtos` onde a coluna `ativo` seja igual a `true` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT * FROM produtos WHERE ativo = true;' },
            usa: [{ padrao: '\\bWHERE\\b', nome: 'cláusula WHERE' }],
            mostra: 'SELECT * FROM produtos WHERE ativo = true;',
            dicas: [
              'Use o asterisco `*` após o `SELECT` e adicione `WHERE ativo = true;`.',
              'Faça `const consulta = "SELECT * FROM produtos WHERE ativo = true;";`.',
            ],
            resposta: ["const consulta = 'SELECT * FROM produtos WHERE ativo = true;';", 'console.log(consulta);'],
          }),
        },
        {
          id: 'order-by',
          nome: 'ORDER BY',
          resumo:
            'Classifica as linhas do resultado em ordem crescente (`ASC`) ou decrescente (`DESC`) com base em uma ou mais colunas.',
          sintaxe: 'SELECT colunas FROM tabela ORDER BY coluna ASC | DESC;',
          retorno: 'Linhas ordenadas conforme a sequência configurada.',
          exemplos: [
            {
              codigo: "const sql = 'SELECT nome, preco FROM produtos ORDER BY preco DESC;';\nconsole.log(sql);",
              saida: 'SELECT nome, preco FROM produtos ORDER BY preco DESC;',
            },
          ],
          cuidado:
            'Sem a cláusula `ORDER BY`, os bancos relacionais NÃO garantem qualquer ordem previsível no retorno dos dados, podendo variar entre diferentes execuções da mesma consulta.',
          treino: treino({
            enunciado: [
              'Guarde na constante `consulta` a instrução SQL para selecionar `nome` e `pontuacao` da tabela `jogadores` ordenando por `pontuacao` de forma decrescente (`DESC`) e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT nome, pontuacao FROM jogadores ORDER BY pontuacao DESC;' },
            usa: [
              { padrao: '\\bORDER\\s+BY\\b', nome: 'cláusula ORDER BY' },
              { padrao: '\\bDESC\\b', nome: 'direção DESC' },
            ],
            mostra: 'SELECT nome, pontuacao FROM jogadores ORDER BY pontuacao DESC;',
            dicas: [
              'Adicione `ORDER BY pontuacao DESC;` ao final da consulta.',
              'Armazene em `const consulta = "SELECT nome, pontuacao FROM jogadores ORDER BY pontuacao DESC;";`.',
            ],
            resposta: [
              "const consulta = 'SELECT nome, pontuacao FROM jogadores ORDER BY pontuacao DESC;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'limit',
          nome: 'LIMIT e OFFSET',
          resumo:
            'Limita o total de linhas retornadas (`LIMIT`) e opcionalmente pula um número de linhas iniciais (`OFFSET`), servindo de alicerce para paginação.',
          sintaxe: 'SELECT colunas FROM tabela LIMIT quantidade OFFSET deslocamento;',
          retorno: 'Um subconjunto limitado de registros.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT titulo, data_publicacao FROM posts ORDER BY data_publicacao DESC LIMIT 10 OFFSET 20;';\nconsole.log(sql);",
              saida: 'SELECT titulo, data_publicacao FROM posts ORDER BY data_publicacao DESC LIMIT 10 OFFSET 20;',
            },
          ],
          cuidado:
            'Sempre combine `LIMIT` com uma cláusula `ORDER BY` determinística. Sem `ORDER BY`, registros podem saltar de uma página para outra ou se repetir entre páginas subsequentes.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para selecionar `id` e `titulo` da tabela `artigos` trazendo apenas os primeiros 5 registros com `LIMIT 5` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT id, titulo FROM artigos LIMIT 5;' },
            usa: [{ padrao: '\\bLIMIT\\b', nome: 'cláusula LIMIT' }],
            mostra: 'SELECT id, titulo FROM artigos LIMIT 5;',
            dicas: [
              'Escreva `SELECT id, titulo FROM artigos LIMIT 5;`.',
              'Atribua à constante: `const consulta = "SELECT id, titulo FROM artigos LIMIT 5;";`.',
            ],
            resposta: ["const consulta = 'SELECT id, titulo FROM artigos LIMIT 5;';", 'console.log(consulta);'],
          }),
        },
        {
          id: 'distinct',
          nome: 'SELECT DISTINCT',
          resumo:
            'Elimina registros duplicados do resultado, devolvendo apenas ocorrências únicas para as colunas selecionadas.',
          sintaxe: 'SELECT DISTINCT coluna FROM tabela;',
          retorno: 'Linhas sem repetição de valores.',
          exemplos: [
            {
              codigo: "const sql = 'SELECT DISTINCT cidade FROM clientes;';\nconsole.log(sql);",
              saida: 'SELECT DISTINCT cidade FROM clientes;',
            },
          ],
          cuidado:
            'O modificador `DISTINCT` incide sobre a combinação de TODAS as colunas declaradas no `SELECT`, e não exclusivamente sobre a primeira.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o SQL para selecionar as categorias distintas da tabela `produtos` usando `DISTINCT` na coluna `categoria` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT DISTINCT categoria FROM produtos;' },
            usa: [{ padrao: '\\bDISTINCT\\b', nome: 'palavra-chave DISTINCT' }],
            mostra: 'SELECT DISTINCT categoria FROM produtos;',
            dicas: [
              'Insira a palavra `DISTINCT` logo após `SELECT`: `SELECT DISTINCT categoria FROM produtos;`.',
              'Guarde na variável: `const consulta = "SELECT DISTINCT categoria FROM produtos;";`.',
            ],
            resposta: ["const consulta = 'SELECT DISTINCT categoria FROM produtos;';", 'console.log(consulta);'],
          }),
        },
      ],
    },
    {
      titulo: 'Filtros avançados e operadores de busca',
      descricao: 'Refine suas buscas com padrões de texto, listas de opções, intervalos e tratamento de valores nulos.',
      metodos: [
        {
          id: 'like',
          nome: 'LIKE e ILIKE',
          resumo:
            'Busca por padrões de texto usando os caracteres curinga `%` (zero ou mais caracteres) e `_` (exatamente um caractere).',
          sintaxe: "SELECT colunas FROM tabela WHERE coluna LIKE 'padrao%';",
          retorno: 'Linhas que combinam com o padrão de busca especificado.',
          exemplos: [
            {
              codigo:
                'const sql = "SELECT nome, email FROM usuarios WHERE email LIKE \'%@gmail.com\';";\nconsole.log(sql);',
              saida: "SELECT nome, email FROM usuarios WHERE email LIKE '%@gmail.com';",
            },
          ],
          cuidado:
            'No PostgreSQL, `LIKE` diferencia maiúsculas de minúsculas (*case-sensitive*), enquanto `ILIKE` ignora essa diferença (*case-insensitive*). Buscas iniciadas por `%` não conseguem aproveitar índices convencionais.',
          treino: treino({
            enunciado: [
              "Escreva na constante `consulta` o comando SQL para buscar `nome` e `email` da tabela `usuarios` onde o `nome` comece com 'Maria' usando `LIKE 'Maria%'` e mostre.",
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: "SELECT nome, email FROM usuarios WHERE nome LIKE 'Maria%';" },
            usa: [{ padrao: '\\bLIKE\\b', nome: 'operador LIKE' }],
            mostra: "SELECT nome, email FROM usuarios WHERE nome LIKE 'Maria%';",
            dicas: [
              "Use a condição `WHERE nome LIKE 'Maria%';`.",
              'Guarde com aspas duplas por fora: `const consulta = "SELECT nome, email FROM usuarios WHERE nome LIKE \'Maria%\';";`.',
            ],
            resposta: [
              'const consulta = "SELECT nome, email FROM usuarios WHERE nome LIKE \'Maria%\';";',
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'in-e-between',
          nome: 'IN e BETWEEN',
          resumo:
            'O operador `IN` compara o valor com uma lista de valores permitidos; o operador `BETWEEN` verifica se está dentro de uma faixa inclusiva.',
          sintaxe: "WHERE status IN ('pago', 'enviado') | WHERE preco BETWEEN 10 AND 50;",
          retorno: 'Linhas que combinam com qualquer item da lista ou pertencem ao intervalo.',
          exemplos: [
            {
              codigo:
                "const sql = \"SELECT id, total FROM pedidos WHERE status IN ('pago', 'entregue') AND total BETWEEN 50 AND 200;\";\nconsole.log(sql);",
              saida: "SELECT id, total FROM pedidos WHERE status IN ('pago', 'entregue') AND total BETWEEN 50 AND 200;",
            },
          ],
          cuidado:
            'O operador `BETWEEN` é inclusivo em ambos os extremos (ou seja, `preco BETWEEN 10 AND 50` inclui tanto o 10 quanto o 50).',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para buscar `nome` e `preco` da tabela `produtos` onde o `preco` esteja entre 10 e 50 usando `BETWEEN 10 AND 50` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT nome, preco FROM produtos WHERE preco BETWEEN 10 AND 50;' },
            usa: [{ padrao: '\\bBETWEEN\\b', nome: 'operador BETWEEN' }],
            mostra: 'SELECT nome, preco FROM produtos WHERE preco BETWEEN 10 AND 50;',
            dicas: [
              'Escreva `SELECT nome, preco FROM produtos WHERE preco BETWEEN 10 AND 50;`.',
              'Guarde em `const consulta = "SELECT nome, preco FROM produtos WHERE preco BETWEEN 10 AND 50;";`.',
            ],
            resposta: [
              "const consulta = 'SELECT nome, preco FROM produtos WHERE preco BETWEEN 10 AND 50;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'is-null',
          nome: 'IS NULL e IS NOT NULL',
          resumo:
            'Verifica a ausência (`NULL`) ou presença de dados preenchidos em uma coluna, tratando adequadamente a lógica de três estados do SQL.',
          sintaxe: 'SELECT colunas FROM tabela WHERE coluna IS NULL | IS NOT NULL;',
          retorno: 'Linhas com campos nulos ou definidos.',
          exemplos: [
            {
              codigo: "const sql = 'SELECT id, nome FROM clientes WHERE telefone IS NULL;';\nconsole.log(sql);",
              saida: 'SELECT id, nome FROM clientes WHERE telefone IS NULL;',
            },
          ],
          cuidado:
            'Nunca compare com `= NULL` ou `!= NULL`. Na lógica do SQL, qualquer comparação direta com `NULL` resulta em `UNKNOWN` (desconhecido/falso). Use impreterivelmente `IS NULL` ou `IS NOT NULL`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para buscar `id` e `email` da tabela `usuarios` onde `data_cancelamento IS NULL` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT id, email FROM usuarios WHERE data_cancelamento IS NULL;' },
            usa: [{ padrao: '\\bIS\\s+NULL\\b', nome: 'operador IS NULL' }],
            mostra: 'SELECT id, email FROM usuarios WHERE data_cancelamento IS NULL;',
            dicas: [
              'Escreva `SELECT id, email FROM usuarios WHERE data_cancelamento IS NULL;`.',
              'Atribua à constante: `const consulta = "SELECT id, email FROM usuarios WHERE data_cancelamento IS NULL;";`.',
            ],
            resposta: [
              "const consulta = 'SELECT id, email FROM usuarios WHERE data_cancelamento IS NULL;';",
              'console.log(consulta);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Funções de agregação e agrupamento',
      descricao: 'Calcule resumos estatísticos, totalize métricas e agrupe dados por categorias com GROUP BY e HAVING.',
      metodos: [
        {
          id: 'agregacoes',
          nome: 'Funções de agregação (COUNT, SUM, AVG, MIN, MAX)',
          resumo:
            'Calculam métricas consolidadas sobre um conjunto de registros: contagem (`COUNT`), soma (`SUM`), média (`AVG`), mínimo (`MIN`) e máximo (`MAX`).',
          sintaxe: 'SELECT COUNT(*), AVG(preco), MAX(preco) FROM produtos;',
          retorno: 'Linha única contendo os valores calculados.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT COUNT(*) AS total_itens, AVG(preco) AS preco_medio FROM produtos;';\nconsole.log(sql);",
              saida: 'SELECT COUNT(*) AS total_itens, AVG(preco) AS preco_medio FROM produtos;',
            },
          ],
          cuidado:
            '`COUNT(*)` conta todas as linhas incluindo nulas, enquanto `COUNT(coluna)` computa apenas as linhas em que a coluna indicada não seja `NULL`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o SQL para contar o total de linhas da tabela `usuarios` usando `COUNT(*) AS total` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'SELECT COUNT(*) AS total FROM usuarios;' },
            usa: [{ padrao: '\\bCOUNT\\s*\\(', nome: 'função COUNT()' }],
            mostra: 'SELECT COUNT(*) AS total FROM usuarios;',
            dicas: [
              'Escreva `SELECT COUNT(*) AS total FROM usuarios;`.',
              'Guarde na variável: `const consulta = "SELECT COUNT(*) AS total FROM usuarios;";`.',
            ],
            resposta: ["const consulta = 'SELECT COUNT(*) AS total FROM usuarios;';", 'console.log(consulta);'],
          }),
        },
        {
          id: 'group-by',
          nome: 'GROUP BY',
          resumo:
            'Agrupa linhas que compartilham o mesmo valor em determinadas colunas para realizar cálculos agregados por segmento.',
          sintaxe: 'SELECT categoria, COUNT(*) FROM produtos GROUP BY categoria;',
          retorno: 'Uma linha consolidada por grupo com as agregações solicitadas.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT categoria, COUNT(*) AS quantidade FROM produtos GROUP BY categoria;';\nconsole.log(sql);",
              saida: 'SELECT categoria, COUNT(*) AS quantidade FROM produtos GROUP BY categoria;',
            },
          ],
          cuidado:
            'Toda coluna presente na lista do `SELECT` que não seja envolvida por uma função de agregação DEVE obrigatoriamente figurar na cláusula `GROUP BY`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para selecionar `departamento` e calcular `AVG(salario) AS media_salarial` da tabela `funcionarios` agrupando por `departamento` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: {
              consulta: 'SELECT departamento, AVG(salario) AS media_salarial FROM funcionarios GROUP BY departamento;',
            },
            usa: [{ padrao: '\\bGROUP\\s+BY\\b', nome: 'cláusula GROUP BY' }],
            mostra: 'SELECT departamento, AVG(salario) AS media_salarial FROM funcionarios GROUP BY departamento;',
            dicas: [
              'Escreva `SELECT departamento, AVG(salario) AS media_salarial FROM funcionarios GROUP BY departamento;`.',
              'Guarde na constante `consulta` e mostre com `console.log(consulta);`.',
            ],
            resposta: [
              "const consulta = 'SELECT departamento, AVG(salario) AS media_salarial FROM funcionarios GROUP BY departamento;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'having',
          nome: 'HAVING',
          resumo:
            'Aplica filtros sobre grupos gerados pelo `GROUP BY`, permitindo restringir resultados baseando-se em valores de funções agregadas.',
          sintaxe: 'SELECT categoria, COUNT(*) FROM produtos GROUP BY categoria HAVING COUNT(*) > 5;',
          retorno: 'Apenas os grupos que atendem à condição agregada.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT setor, COUNT(*) AS total FROM equipes GROUP BY setor HAVING COUNT(*) >= 3;';\nconsole.log(sql);",
              saida: 'SELECT setor, COUNT(*) AS total FROM equipes GROUP BY setor HAVING COUNT(*) >= 3;',
            },
          ],
          cuidado:
            'O `WHERE` filtra linhas individuais ANTES do agrupamento; o `HAVING` filtra os grupos formados DEPOIS da agregação. Nunca tente filtrar agregados (como `COUNT`) no `WHERE`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o SQL para agrupar clientes por cidade (`GROUP BY cidade`), selecionando `cidade` e `COUNT(*) AS total`, filtrando apenas grupos com `HAVING COUNT(*) > 10` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: {
              consulta: 'SELECT cidade, COUNT(*) AS total FROM clientes GROUP BY cidade HAVING COUNT(*) > 10;',
            },
            usa: [{ padrao: '\\bHAVING\\b', nome: 'cláusula HAVING' }],
            mostra: 'SELECT cidade, COUNT(*) AS total FROM clientes GROUP BY cidade HAVING COUNT(*) > 10;',
            dicas: [
              'Adicione `HAVING COUNT(*) > 10;` após a cláusula `GROUP BY cidade`.',
              'Guarde em `const consulta = "SELECT cidade, COUNT(*) AS total FROM clientes GROUP BY cidade HAVING COUNT(*) > 10;";`.',
            ],
            resposta: [
              "const consulta = 'SELECT cidade, COUNT(*) AS total FROM clientes GROUP BY cidade HAVING COUNT(*) > 10;';",
              'console.log(consulta);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Relacionamentos e junções (JOINs)',
      descricao:
        'Combine registros de múltiplas tabelas conectando chaves primárias e estrangeiras de forma relacional.',
      metodos: [
        {
          id: 'inner-join',
          nome: 'INNER JOIN',
          resumo: 'Combina linhas de duas tabelas quando há correspondência mútua na condição de junção (`ON`).',
          sintaxe: 'SELECT colunas FROM tabelaA INNER JOIN tabelaB ON tabelaA.id = tabelaB.tabelaA_id;',
          retorno: 'Linhas combinadas com correspondência garantida em ambas as tabelas.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT pedidos.id, clientes.nome FROM pedidos INNER JOIN clientes ON pedidos.cliente_id = clientes.id;';\nconsole.log(sql);",
              saida:
                'SELECT pedidos.id, clientes.nome FROM pedidos INNER JOIN clientes ON pedidos.cliente_id = clientes.id;',
            },
          ],
          cuidado:
            'Registros da tabela principal que não possuam chave correspondente na tabela secundária são omitidos do resultado. Se você precisar mantê-los, utilize o `LEFT JOIN`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o SQL para unir as tabelas `livros` e `autores` com `INNER JOIN`, selecionando `livros.titulo` e `autores.nome` na condição `livros.autor_id = autores.id` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: {
              consulta:
                'SELECT livros.titulo, autores.nome FROM livros INNER JOIN autores ON livros.autor_id = autores.id;',
            },
            usa: [
              { padrao: '\\bINNER\\s+JOIN\\b', nome: 'junção INNER JOIN' },
              { padrao: '\\bON\\b', nome: 'condição ON' },
            ],
            mostra:
              'SELECT livros.titulo, autores.nome FROM livros INNER JOIN autores ON livros.autor_id = autores.id;',
            dicas: [
              'Escreva `SELECT livros.titulo, autores.nome FROM livros INNER JOIN autores ON livros.autor_id = autores.id;`.',
              'Guarde na variável e exiba com `console.log(consulta);`.',
            ],
            resposta: [
              "const consulta = 'SELECT livros.titulo, autores.nome FROM livros INNER JOIN autores ON livros.autor_id = autores.id;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'left-join',
          nome: 'LEFT JOIN',
          resumo:
            'Preserva todas as linhas da tabela à esquerda (primeira tabela), preenchendo com `NULL` os campos da direita onde não houver casamento.',
          sintaxe: 'SELECT colunas FROM tabelaA LEFT JOIN tabelaB ON tabelaA.id = tabelaB.tabelaA_id;',
          retorno: 'Todas as linhas da esquerda combinadas com correspondências da direita ou preenchidas por NULL.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT clientes.nome, pedidos.id AS pedido_id FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;';\nconsole.log(sql);",
              saida:
                'SELECT clientes.nome, pedidos.id AS pedido_id FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id;',
            },
          ],
          cuidado:
            "Se você adicionar um filtro sobre a tabela da direita dentro da cláusula `WHERE` (ex: `WHERE pedidos.status = 'pago'`), o `LEFT JOIN` passa a agir como `INNER JOIN`, eliminando as linhas nulas preservadas.",
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para trazer todos os registros de `usuarios` e seus respectivos `perfis` usando `LEFT JOIN` selecionando `usuarios.nome` e `perfis.bio` conectados por `usuarios.id = perfis.usuario_id` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: {
              consulta:
                'SELECT usuarios.nome, perfis.bio FROM usuarios LEFT JOIN perfis ON usuarios.id = perfis.usuario_id;',
            },
            usa: [{ padrao: '\\bLEFT\\s+JOIN\\b', nome: 'junção LEFT JOIN' }],
            mostra:
              'SELECT usuarios.nome, perfis.bio FROM usuarios LEFT JOIN perfis ON usuarios.id = perfis.usuario_id;',
            dicas: [
              'Use `LEFT JOIN perfis ON usuarios.id = perfis.usuario_id;`.',
              'Guarde em `const consulta = "SELECT usuarios.nome, perfis.bio FROM usuarios LEFT JOIN perfis ON usuarios.id = perfis.usuario_id;";`.',
            ],
            resposta: [
              "const consulta = 'SELECT usuarios.nome, perfis.bio FROM usuarios LEFT JOIN perfis ON usuarios.id = perfis.usuario_id;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'right-join',
          nome: 'RIGHT JOIN',
          resumo:
            'Preserva todas as linhas da tabela à direita (segunda tabela), trazendo os dados da tabela à esquerda ou `NULL` quando não houver relação.',
          sintaxe: 'SELECT colunas FROM tabelaA RIGHT JOIN tabelaB ON tabelaA.id = tabelaB.tabelaA_id;',
          retorno: 'Todas as linhas da direita completadas com dados da esquerda ou NULL.',
          exemplos: [
            {
              codigo:
                "const sql = 'SELECT projetos.nome, departamentos.titulo FROM projetos RIGHT JOIN departamentos ON projetos.depto_id = departamentos.id;';\nconsole.log(sql);",
              saida:
                'SELECT projetos.nome, departamentos.titulo FROM projetos RIGHT JOIN departamentos ON projetos.depto_id = departamentos.id;',
            },
          ],
          cuidado:
            'A maioria dos times padroniza o uso exclusivo de `LEFT JOIN` invertendo a ordem em que as tabelas são listadas, pois a leitura ocidental da esquerda para a direita torna a compreensão mais natural.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o SQL para unir `funcionarios` e `departamentos` usando `RIGHT JOIN` na condição `funcionarios.depto_id = departamentos.id` selecionando `funcionarios.nome` e `departamentos.nome` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: {
              consulta:
                'SELECT funcionarios.nome, departamentos.nome FROM funcionarios RIGHT JOIN departamentos ON funcionarios.depto_id = departamentos.id;',
            },
            usa: [{ padrao: '\\bRIGHT\\s+JOIN\\b', nome: 'junção RIGHT JOIN' }],
            mostra:
              'SELECT funcionarios.nome, departamentos.nome FROM funcionarios RIGHT JOIN departamentos ON funcionarios.depto_id = departamentos.id;',
            dicas: [
              'Escreva `SELECT funcionarios.nome, departamentos.nome FROM funcionarios RIGHT JOIN departamentos ON funcionarios.depto_id = departamentos.id;`.',
              'Guarde na constante `consulta` e exiba com `console.log(consulta);`.',
            ],
            resposta: [
              "const consulta = 'SELECT funcionarios.nome, departamentos.nome FROM funcionarios RIGHT JOIN departamentos ON funcionarios.depto_id = departamentos.id;';",
              'console.log(consulta);',
            ],
          }),
        },
      ],
    },
    {
      titulo: 'Manipulação de dados (DML)',
      descricao: 'Inserção de novos registros, atualizações pontuais e exclusão controlada de dados existentes.',
      metodos: [
        {
          id: 'insert-into',
          nome: 'INSERT INTO',
          resumo: 'Insere uma ou mais novas linhas de registros em uma tabela existente.',
          sintaxe: 'INSERT INTO tabela (coluna1, coluna2) VALUES (valor1, valor2);',
          retorno: 'Confirmação do número de linhas inseridas.',
          exemplos: [
            {
              codigo:
                "const sql = \"INSERT INTO usuarios (nome, email, ativo) VALUES ('Lucas', 'lucas@mundojs.com', true);\";\nconsole.log(sql);",
              saida: "INSERT INTO usuarios (nome, email, ativo) VALUES ('Lucas', 'lucas@mundojs.com', true);",
            },
          ],
          cuidado:
            'Sempre declare os nomes das colunas de destino após o nome da tabela no `INSERT INTO tabela (colunas)`. Omitir a lista de colunas torna a consulta frágil a qualquer reestruturação na tabela.',
          treino: treino({
            enunciado: [
              "Guarde na constante `consulta` o comando SQL para inserir um novo produto na tabela `produtos` nas colunas `(nome, preco)` com os valores `('Teclado', 250)` e mostre.",
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: "INSERT INTO produtos (nome, preco) VALUES ('Teclado', 250);" },
            usa: [
              { padrao: '\\bINSERT\\s+INTO\\b', nome: 'comando INSERT INTO' },
              { padrao: '\\bVALUES\\b', nome: 'cláusula VALUES' },
            ],
            mostra: "INSERT INTO produtos (nome, preco) VALUES ('Teclado', 250);",
            dicas: [
              "Escreva `INSERT INTO produtos (nome, preco) VALUES ('Teclado', 250);`.",
              'Guarde com aspas duplas por fora: `const consulta = "INSERT INTO produtos (nome, preco) VALUES (\'Teclado\', 250);";`.',
            ],
            resposta: [
              'const consulta = "INSERT INTO produtos (nome, preco) VALUES (\'Teclado\', 250);";',
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'update',
          nome: 'UPDATE',
          resumo: 'Atualiza os dados de uma ou mais colunas em registros já existentes.',
          sintaxe: 'UPDATE tabela SET coluna = novoValor WHERE condicao;',
          retorno: 'Quantidade de linhas alteradas.',
          exemplos: [
            {
              codigo: "const sql = 'UPDATE usuarios SET ativo = false WHERE ultimo_acesso < 2025;';\nconsole.log(sql);",
              saida: 'UPDATE usuarios SET ativo = false WHERE ultimo_acesso < 2025;',
            },
          ],
          cuidado:
            'Alerta de segurança: NUNCA rode um comando `UPDATE` sem a cláusula `WHERE` em ambiente de produção, a menos que sua intenção expressa seja alterar cada uma das linhas da tabela!',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para atualizar a tabela `usuarios` definindo `ativo = false` exclusivamente onde `id = 42` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'UPDATE usuarios SET ativo = false WHERE id = 42;' },
            usa: [
              { padrao: '\\bUPDATE\\b', nome: 'comando UPDATE' },
              { padrao: '\\bSET\\b', nome: 'cláusula SET' },
            ],
            mostra: 'UPDATE usuarios SET ativo = false WHERE id = 42;',
            dicas: [
              'Escreva `UPDATE usuarios SET ativo = false WHERE id = 42;`.',
              'Atribua à constante: `const consulta = "UPDATE usuarios SET ativo = false WHERE id = 42;";`.',
            ],
            resposta: [
              "const consulta = 'UPDATE usuarios SET ativo = false WHERE id = 42;';",
              'console.log(consulta);',
            ],
          }),
        },
        {
          id: 'delete',
          nome: 'DELETE FROM',
          resumo: 'Exclui registros de uma tabela que satisfaçam a condição imposta pela cláusula `WHERE`.',
          sintaxe: 'DELETE FROM tabela WHERE condicao;',
          retorno: 'Quantidade de linhas removidas.',
          exemplos: [
            {
              codigo: "const sql = 'DELETE FROM sessoes WHERE expirada = true;';\nconsole.log(sql);",
              saida: 'DELETE FROM sessoes WHERE expirada = true;',
            },
          ],
          cuidado:
            'Sem a cláusula `WHERE`, o comando `DELETE` apagará irreversivelmente todos os dados da tabela. Em aplicações corporativas, frequentemente adota-se a exclusão lógica (*soft delete*) gravando uma data em `deleted_at`.',
          treino: treino({
            enunciado: [
              'Escreva na constante `consulta` o comando SQL para excluir da tabela `tarefas` a linha onde `id = 99` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'DELETE FROM tarefas WHERE id = 99;' },
            usa: [{ padrao: '\\bDELETE\\s+FROM\\b', nome: 'comando DELETE FROM' }],
            mostra: 'DELETE FROM tarefas WHERE id = 99;',
            dicas: [
              'Escreva `DELETE FROM tarefas WHERE id = 99;`.',
              'Guarde na variável: `const consulta = "DELETE FROM tarefas WHERE id = 99;";`.',
            ],
            resposta: ["const consulta = 'DELETE FROM tarefas WHERE id = 99;';", 'console.log(consulta);'],
          }),
        },
      ],
    },
    {
      titulo: 'Estrutura e modelagem de tabelas (DDL)',
      descricao: 'Crie tabelas relacionais especificando tipos de dados, chaves primárias e restrições de integridade.',
      metodos: [
        {
          id: 'create-table',
          nome: 'CREATE TABLE',
          resumo:
            'Cria uma nova tabela definindo o esquema estrutural de colunas, tipos de dados e regras de validação (chaves primárias, unicidade e não-nulos).',
          sintaxe: 'CREATE TABLE nome (\n  id SERIAL PRIMARY KEY,\n  nome VARCHAR(100) NOT NULL\n);',
          retorno: 'Confirmação da criação estrutural da tabela.',
          exemplos: [
            {
              codigo:
                "const sql = 'CREATE TABLE clientes (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL);';\nconsole.log(sql);",
              saida: 'CREATE TABLE clientes (id SERIAL PRIMARY KEY, nome VARCHAR(100) NOT NULL);',
            },
          ],
          cuidado:
            'Sempre configure uma chave primária (`PRIMARY KEY`) em cada tabela e aplique `NOT NULL` nas colunas obrigatórias para evitar estados inconsistentes.',
          treino: treino({
            enunciado: [
              'Guarde na constante `consulta` o comando SQL para criar a tabela `tags` com as colunas `id INT PRIMARY KEY` e `nome VARCHAR(50) NOT NULL` e mostre.',
            ],
            inicial: ['// Defina a instrução na constante consulta'],
            esperados: { consulta: 'CREATE TABLE tags (id INT PRIMARY KEY, nome VARCHAR(50) NOT NULL);' },
            usa: [
              { padrao: '\\bCREATE\\s+TABLE\\b', nome: 'comando CREATE TABLE' },
              { padrao: '\\bPRIMARY\\s+KEY\\b', nome: 'restrição PRIMARY KEY' },
            ],
            mostra: 'CREATE TABLE tags (id INT PRIMARY KEY, nome VARCHAR(50) NOT NULL);',
            dicas: [
              'Escreva `CREATE TABLE tags (id INT PRIMARY KEY, nome VARCHAR(50) NOT NULL);`.',
              'Atribua à variável: `const consulta = "CREATE TABLE tags (id INT PRIMARY KEY, nome VARCHAR(50) NOT NULL);";`.',
            ],
            resposta: [
              "const consulta = 'CREATE TABLE tags (id INT PRIMARY KEY, nome VARCHAR(50) NOT NULL);';",
              'console.log(consulta);',
            ],
          }),
        },
      ],
    },
  ],
};
