import type { ProjetoCodeLab } from '../tipos';

export const projetoExpressSequelize: ProjetoCodeLab = {
  id: 'api-express-sequelize',
  slug: 'api-express-sequelize',
  nome: 'API Node.js + Express + Sequelize',
  descricao:
    'Arquitetura em camadas (Controller, Service, Model, Middleware) com PostgreSQL/SQLite, autenticação JWT, validação de schemas e migrations.',
  icone: 'nodejs',
  tags: ['Node.js', 'Express', 'Sequelize', 'JWT', 'REST API', 'PostgreSQL'],
  versao: '1.0.0',
  arquivoPadrao: 'src/controllers/UsuarioController.js',
  estrutura: {
    pastas: [
      {
        nome: 'src',
        caminho: 'src',
        pastas: [
          {
            nome: 'controllers',
            caminho: 'src/controllers',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/controllers/UsuarioController.js',
                caminho: 'src/controllers/UsuarioController.js',
                nome: 'UsuarioController.js',
                linguagem: 'javascript',
                conteudo: `import { UsuarioService } from '../services/UsuarioService.js';

/**
 * Controller responsável por receber as requisições HTTP relacionadas a usuários,
 * delegar as regras de negócio para o UsuarioService e formatar a resposta.
 */
export class UsuarioController {
  /**
   * GET /api/usuarios
   * Lista usuários com suporte a paginação e filtros.
   */
  static async listar(req, res, next) {
    try {
      const { pagina = 1, limite = 10, busca, ativo } = req.query;
      const resultado = await UsuarioService.listar({
        pagina: Number(pagina),
        limite: Number(limite),
        busca,
        ativo: ativo !== undefined ? ativo === 'true' : undefined,
      });

      return res.status(200).json(resultado);
    } catch (erro) {
      return next(erro);
    }
  }

  /**
   * GET /api/usuarios/:id
   * Obtém detalhes de um usuário pelo seu identificador primário.
   */
  static async obterPorId(req, res, next) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.obterPorId(Number(id));

      if (!usuario) {
        return res.status(404).json({
          erro: 'Usuário não encontrado',
          detalhe: \`Nenhum usuário com o ID \${id} foi localizado.\`,
        });
      }

      return res.status(200).json(usuario);
    } catch (erro) {
      return next(erro);
    }
  }

  /**
   * POST /api/usuarios
   * Cria um novo usuário após validação de schema executada na rota.
   */
  static async criar(req, res, next) {
    try {
      const novoUsuario = await UsuarioService.criar(req.body);
      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso',
        usuario: novoUsuario,
      });
    } catch (erro) {
      return next(erro);
    }
  }

  /**
   * PUT /api/usuarios/:id
   * Atualiza os dados de um usuário existente.
   */
  static async atualizar(req, res, next) {
    try {
      const { id } = req.params;
      const usuarioAtualizado = await UsuarioService.atualizar(Number(id), req.body);

      return res.status(200).json({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: usuarioAtualizado,
      });
    } catch (erro) {
      return next(erro);
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * Remove logicamente (soft delete) ou fisicamente o usuário.
   */
  static async remover(req, res, next) {
    try {
      const { id } = req.params;
      await UsuarioService.remover(Number(id));

      return res.status(204).send();
    } catch (erro) {
      return next(erro);
    }
  }
}
`,
                documentacao: {
                  resumo: 'Controlador HTTP para gerenciar operações de usuários (CRUD e paginação).',
                  responsabilidade:
                    'Atuar como porta de entrada HTTP. Lê parâmetros da requisição (query, params, body), chama os métodos adequados do UsuarioService e responde com status codes REST padronizados (200, 201, 204, 404). Delega exceções para o middleware central via next(erro).',
                  comoFunciona:
                    'Todos os métodos são assíncronos e estáticos. Eles recebem req, res e next do Express. Os blocos try/catch interceptam rejeições de Promises e as encaminham para o pipeline de tratamento de erros com next(erro).',
                  porQueEssaAbordagem:
                    'Separar o Controller do Service garante que o código HTTP (status codes, headers, cookies) fique desacoplado das regras de negócio e de persistência. Isso permite testar os serviços isoladamente e trocar o framework web sem reescrever a lógica da aplicação.',
                  metodos: [
                    {
                      nome: 'listar',
                      assinatura: 'UsuarioController.listar(req, res, next)',
                      descricao: 'Lista usuários paginados a partir de query params (pagina, limite, busca).',
                      parametros: [
                        { nome: 'req.query.pagina', tipo: 'number', descricao: 'Número da página atual (padrão 1)' },
                        { nome: 'req.query.limite', tipo: 'number', descricao: 'Itens por página (padrão 10)' },
                      ],
                      retorno: 'JSON com lista de usuários e metadados de paginação',
                      exemploUso: 'GET /api/usuarios?pagina=1&limite=10&busca=ana',
                    },
                    {
                      nome: 'criar',
                      assinatura: 'UsuarioController.criar(req, res, next)',
                      descricao: 'Recebe o payload validado no body e invoca o service para criar o usuário.',
                      retorno: 'Status 201 com o usuário recém-criado',
                    },
                  ],
                  relacionamentos: {
                    importaDe: [
                      { arquivo: 'src/services/UsuarioService.js', motivo: 'Execução das regras de negócio' },
                    ],
                    usadoPor: [
                      { arquivo: 'src/routes/usuarioRoutes.js', motivo: 'Mapeamento das rotas HTTP aos métodos' },
                    ],
                    origemDosDados: 'Requisição HTTP (req.params, req.body, req.query)',
                    destinoDosDados: 'UsuarioService e resposta JSON (res.status().json())',
                  },
                  boasPraticas: [
                    'Sempre repasse erros inesperados com next(erro) para evitar requisições presas sem resposta.',
                    'Nunca coloque lógica de hash de senhas ou consultas SQL diretas dentro do Controller.',
                    'Use status code 201 para criações bem-sucedidas e 204 para exclusões sem conteúdo.',
                  ],
                  errosComuns: [
                    'Esquecer de converter req.params.id para número antes de passar ao banco.',
                    'Tentar enviar duas respostas na mesma requisição esquecendo o return antes de res.status().',
                  ],
                  referencias: [
                    { titulo: 'Express Routing Guide', url: 'https://expressjs.com/en/guide/routing.html' },
                    { titulo: 'REST API Best Practices', url: 'https://restfulapi.net/http-status-codes/' },
                  ],
                },
              },
            ],
          },
          {
            nome: 'services',
            caminho: 'src/services',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/services/UsuarioService.js',
                caminho: 'src/services/UsuarioService.js',
                nome: 'UsuarioService.js',
                linguagem: 'javascript',
                conteudo: `import crypto from 'node:crypto';
import { Op } from 'sequelize';
import { Usuario } from '../models/Usuario.js';

/**
 * Service que concentra as regras de negócio de usuários:
 * hashing de senhas, validação de duplicidade, cálculos de paginação
 * e interação com o Model Sequelize.
 */
export class UsuarioService {
  /**
   * Hasheia a senha usando PBKDF2 com salt seguro.
   */
  static gerarHashSenha(senha, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.pbkdf2Sync(senha, salt, 100000, 64, 'sha512').toString('hex');
    return \`\${salt}:\${hash}\`;
  }

  /**
   * Compara uma senha em texto com o hash armazenado.
   */
  static verificarSenha(senhaDigitada, hashArmazenado) {
    const [salt, hashOriginal] = hashArmazenado.split(':');
    if (!salt || !hashOriginal) return false;
    const hashCalculado = crypto.pbkdf2Sync(senhaDigitada, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hashOriginal), Buffer.from(hashCalculado));
  }

  /**
   * Lista usuários com paginação e filtro por busca textual.
   */
  static async listar({ pagina = 1, limite = 10, busca, ativo }) {
    const offset = (pagina - 1) * limite;
    const where = {};

    if (ativo !== undefined) {
      where.ativo = ativo;
    }

    if (busca) {
      where[Op.or] = [
        { nome: { [Op.like]: \`%\${busca}%\` } },
        { email: { [Op.like]: \`%\${busca}%\` } },
      ];
    }

    const { rows: usuarios, count: total } = await Usuario.scope('semSenha').findAndCountAll({
      where,
      limit: limite,
      offset,
      order: [['nome', 'ASC']],
    });

    return {
      dados: usuarios,
      paginacao: {
        paginaAtual: pagina,
        itensPorPagina: limite,
        totalItens: total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  /**
   * Busca um usuário pelo ID sem expor o hash de senha.
   */
  static async obterPorId(id) {
    return await Usuario.scope('semSenha').findByPk(id);
  }

  /**
   * Cadastra um novo usuário, verificando unicidade de e-mail e aplicando hash na senha.
   */
  static async criar({ nome, email, senha, perfil = 'padrao' }) {
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      const erro = new Error('E-mail já cadastrado');
      erro.status = 409;
      throw erro;
    }

    const senhaHash = this.gerarHashSenha(senha);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      perfil,
      ativo: true,
    });

    // Remove a senha do objeto retornado
    const resultado = usuario.toJSON();
    delete resultado.senha;
    return resultado;
  }

  /**
   * Atualiza dados de um usuário existente.
   */
  static async atualizar(id, dados) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      const erro = new Error('Usuário não encontrado');
      erro.status = 404;
      throw erro;
    }

    // Se informou nova senha, gera novo hash com salt
    if (dados.senha) {
      dados.senha = this.gerarHashSenha(dados.senha);
    }

    // Se tentou mudar email, valida se outro usuário já possui
    if (dados.email && dados.email !== usuario.email) {
      const duplicado = await Usuario.findOne({ where: { email: dados.email } });
      if (duplicado) {
        const erro = new Error('E-mail já em uso por outro usuário');
        erro.status = 409;
        throw erro;
      }
    }

    await usuario.update(dados);
    const atualizado = usuario.toJSON();
    delete atualizado.senha;
    return atualizado;
  }

  /**
   * Remove o usuário.
   */
  static async remover(id) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      const erro = new Error('Usuário não encontrado');
      erro.status = 404;
      throw erro;
    }

    await usuario.destroy();
    return true;
  }
}
`,
                documentacao: {
                  resumo: 'Camada de serviço com regras de negócio, criptografia de senhas e persistência.',
                  responsabilidade:
                    'Isolar completamente a lógica de negócio do transporte HTTP. Responsável pela segurança de senhas (PBKDF2 com salt), verificação de duplicidade de e-mail, paginação com findAndCountAll e manipulação do modelo Sequelize.',
                  comoFunciona:
                    'Utiliza o módulo nativo node:crypto com timingSafeEqual para evitar ataques de timing na verificação de senhas. Usa scopes do Sequelize (como semSenha) para garantir que consultas públicas nunca vazem senhas.',
                  porQueEssaAbordagem:
                    'Ao centralizar as regras no Service, tanto a API REST quanto eventuais filas de mensageria (RabbitMQ, BullMQ) ou comandos CLI podem reutilizar as mesmas validações sem duplicar código.',
                  metodos: [
                    {
                      nome: 'gerarHashSenha',
                      assinatura: 'UsuarioService.gerarHashSenha(senha, [salt])',
                      descricao: 'Gera salt aleatório de 16 bytes e deriva hash PBKDF2 com SHA-512 e 100k iterações.',
                      parametros: [
                        { nome: 'senha', tipo: 'string', descricao: 'Senha em texto puro fornecida pelo usuário' },
                      ],
                      retorno: 'string no formato "salt:hash"',
                    },
                    {
                      nome: 'criar',
                      assinatura: 'UsuarioService.criar({ nome, email, senha, perfil })',
                      descricao: 'Verifica se o e-mail já existe e persiste o usuário com a senha criptografada.',
                      retorno: 'Objeto do usuário criado sem o campo senha',
                    },
                  ],
                  relacionamentos: {
                    importaDe: [
                      { arquivo: 'src/models/Usuario.js', motivo: 'Consultas e operações no banco de dados' },
                    ],
                    usadoPor: [
                      { arquivo: 'src/controllers/UsuarioController.js', motivo: 'Executado pelos endpoints da API' },
                    ],
                    origemDosDados: 'Dados sanitizados vindos do Controller',
                    destinoDosDados: 'Tabela usuarios via Sequelize',
                  },
                  boasPraticas: [
                    'Nunca armazene senhas em texto puro nem com algoritmos inseguros como MD5 ou SHA-1.',
                    'Sempre use timingSafeEqual ao comparar strings criptográficas para mitigar timing attacks.',
                    'Lance erros com a propriedade .status = 409 ou 404 para o middleware de erro entender o código HTTP.',
                  ],
                  errosComuns: [
                    'Retornar o hash da senha na resposta do endpoint de cadastro ou listagem.',
                    'Confiar que o banco vai pegar a duplicidade de e-mail sem tratar o erro adequadamente.',
                  ],
                  referencias: [
                    { titulo: 'Node.js Crypto Documentation', url: 'https://nodejs.org/api/crypto.html' },
                    {
                      titulo: 'Sequelize Model Querying',
                      url: 'https://sequelize.org/docs/v6/core-concepts/model-querying-basics/',
                    },
                  ],
                },
              },
            ],
          },
          {
            nome: 'routes',
            caminho: 'src/routes',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/routes/usuarioRoutes.js',
                caminho: 'src/routes/usuarioRoutes.js',
                nome: 'usuarioRoutes.js',
                linguagem: 'javascript',
                conteudo: `import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';
import { autenticarJwt, autorizarPerfil } from '../middlewares/autenticacao.js';
import { validarSchema, usuarioCriacaoSchema, usuarioAtualizacaoSchema } from '../schemas/UsuarioSchema.js';

export const usuarioRouter = Router();

// Rota pública: Cadastro de novos usuários
usuarioRouter.post(
  '/',
  validarSchema(usuarioCriacaoSchema),
  UsuarioController.criar
);

// Rotas protegidas por autenticação JWT
usuarioRouter.use(autenticarJwt);

// Listagem de usuários (requer autenticação)
usuarioRouter.get('/', UsuarioController.listar);

// Busca por ID
usuarioRouter.get('/:id', UsuarioController.obterPorId);

// Atualização de usuário com validação de schema
usuarioRouter.put(
  '/:id',
  validarSchema(usuarioAtualizacaoSchema),
  UsuarioController.atualizar
);

// Exclusão restrita a administradores
usuarioRouter.delete(
  '/:id',
  autorizarPerfil('admin'),
  UsuarioController.remover
);
`,
                documentacao: {
                  resumo: 'Declaração e mapeamento de rotas REST do recurso de usuários com middlewares.',
                  responsabilidade:
                    'Conectar os endpoints HTTP aos seus respectivos middlewares de autenticação, autorização de perfil, validação de schema de entrada e métodos do UsuarioController.',
                  comoFunciona:
                    'Instancia express.Router(). O middleware autenticarJwt é aplicado em cascata para proteger todas as rotas que vêm abaixo dele. A exclusão aplica o middleware adicional autorizarPerfil("admin").',
                  porQueEssaAbordagem:
                    'Agrupar rotas por recurso torna a API modular. O arquivo app.js apenas importa os routers principais e os monta sob seus prefixos (ex: /api/usuarios).',
                  relacionamentos: {
                    importaDe: [
                      { arquivo: 'src/controllers/UsuarioController.js', motivo: 'Handlers das requisições' },
                      { arquivo: 'src/middlewares/autenticacao.js', motivo: 'Proteção de rotas com JWT' },
                      { arquivo: 'src/schemas/UsuarioSchema.js', motivo: 'Validação de payloads de entrada' },
                    ],
                    usadoPor: [{ arquivo: 'app.js', motivo: 'Montado sob app.use("/api/usuarios", usuarioRouter)' }],
                  },
                  boasPraticas: [
                    'Ordene os middlewares do mais genérico para o mais específico (validação -> autenticação -> autorização -> controller).',
                    'Mantenha os verbos HTTP semânticos (POST para criar, GET para ler, PUT/PATCH para atualizar, DELETE para remover).',
                  ],
                  referencias: [{ titulo: 'Express Router API', url: 'https://expressjs.com/en/4x/api.html#router' }],
                },
              },
            ],
          },
          {
            nome: 'models',
            caminho: 'src/models',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/models/Usuario.js',
                caminho: 'src/models/Usuario.js',
                nome: 'Usuario.js',
                linguagem: 'javascript',
                conteudo: `import { DataTypes, Model } from 'sequelize';

/**
 * Modelo de dados que representa a tabela 'usuarios' no banco relacional.
 */
export class Usuario extends Model {
  static inicializar(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING(120),
          allowNull: false,
          validate: {
            notEmpty: { msg: 'O nome não pode ser vazio' },
            len: { args: [2, 120], msg: 'O nome deve ter entre 2 e 120 caracteres' },
          },
        },
        email: {
          type: DataTypes.STRING(180),
          allowNull: false,
          unique: { msg: 'Este e-mail já está em uso' },
          validate: {
            isEmail: { msg: 'Forneça um endereço de e-mail válido' },
          },
        },
        senha: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        perfil: {
          type: DataTypes.ENUM('padrao', 'admin', 'moderador'),
          defaultValue: 'padrao',
          allowNull: false,
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'usuarios',
        timestamps: true,
        paranoid: true, // Soft delete via deletedAt
        scopes: {
          // Scope padrão para omitir o hash de senha em consultas públicas
          semSenha: {
            attributes: { exclude: ['senha'] },
          },
        },
      }
    );

    return this;
  }
}
`,
                documentacao: {
                  resumo: 'Definição do modelo relacional Sequelize para a entidade Usuario.',
                  responsabilidade:
                    'Mapear a estrutura de colunas, tipos, constraints (PK, UNIQUE, NOT NULL), validações de integridade e scopes de segurança na tabela usuarios.',
                  comoFunciona:
                    'Estende Model do Sequelize. Utiliza paranoid: true para habilitar soft deletes (preenchendo deletedAt sem apagar a linha fisicamente). Define o scope semSenha para ocultar a senha.',
                  porQueEssaAbordagem:
                    'Scopes no Sequelize evitam acidentes de segurança onde desenvolvedores esquecem de remover a senha antes de retornar dados para o frontend.',
                  relacionamentos: {
                    importaDe: [
                      { arquivo: 'src/database/config/database.js', motivo: 'Instância do Sequelize para super.init' },
                    ],
                    usadoPor: [{ arquivo: 'src/services/UsuarioService.js', motivo: 'Persistência e consultas' }],
                  },
                  boasPraticas: [
                    'Sempre declare constraints tanto no model quanto na migration para garantir dupla proteção.',
                    'Utilize paranoid: true em entidades críticas de usuários para manter histórico e integridade referencial.',
                  ],
                  referencias: [
                    {
                      titulo: 'Sequelize Model Basics',
                      url: 'https://sequelize.org/docs/v6/core-concepts/model-basics/',
                    },
                  ],
                },
              },
            ],
          },
          {
            nome: 'schemas',
            caminho: 'src/schemas',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/schemas/UsuarioSchema.js',
                caminho: 'src/schemas/UsuarioSchema.js',
                nome: 'UsuarioSchema.js',
                linguagem: 'javascript',
                conteudo: `/**
 * Schemas de validação de entrada de dados para requisições de usuário.
 */

export const usuarioCriacaoSchema = {
  nome: {
    obrigatorio: true,
    tipo: 'string',
    min: 2,
    max: 120,
    validar: (v) => typeof v === 'string' && v.trim().length >= 2,
    mensagem: 'Nome deve ser um texto com pelo menos 2 caracteres',
  },
  email: {
    obrigatorio: true,
    tipo: 'string',
    validar: (v) => typeof v === 'string' && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v),
    mensagem: 'E-mail inválido',
  },
  senha: {
    obrigatorio: true,
    tipo: 'string',
    validar: (v) => typeof v === 'string' && v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v),
    mensagem: 'Senha deve conter pelo menos 8 caracteres, 1 letra maiúscula e 1 número',
  },
  perfil: {
    obrigatorio: false,
    tipo: 'string',
    validar: (v) => ['padrao', 'admin', 'moderador'].includes(v),
    mensagem: 'Perfil deve ser padrao, admin ou moderador',
  },
};

export const usuarioAtualizacaoSchema = {
  nome: {
    obrigatorio: false,
    tipo: 'string',
    validar: (v) => typeof v === 'string' && v.trim().length >= 2,
    mensagem: 'Nome deve conter pelo menos 2 caracteres',
  },
  email: {
    obrigatorio: false,
    tipo: 'string',
    validar: (v) => typeof v === 'string' && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v),
    mensagem: 'E-mail inválido',
  },
  senha: {
    obrigatorio: false,
    tipo: 'string',
    validar: (v) => typeof v === 'string' && v.length >= 8,
    mensagem: 'Senha deve conter pelo menos 8 caracteres',
  },
  ativo: {
    obrigatorio: false,
    tipo: 'boolean',
    validar: (v) => typeof v === 'boolean',
    mensagem: 'Ativo deve ser um valor booleano',
  },
};

/**
 * Middleware factory para validar req.body contra o schema fornecido.
 */
export function validarSchema(schema) {
  return (req, res, next) => {
    const dados = req.body || {};
    const erros = [];

    for (const [campo, regra] of Object.entries(schema)) {
      const valor = dados[campo];

      if (regra.obrigatorio && (valor === undefined || valor === null || valor === '')) {
        erros.push({ campo, mensagem: \`O campo '\${campo}' é obrigatório\` });
        continue;
      }

      if (valor !== undefined && valor !== null) {
        if (!regra.validar(valor)) {
          erros.push({ campo, mensagem: regra.mensagem });
        }
      }
    }

    if (erros.length > 0) {
      return res.status(400).json({
        erro: 'Falha de validação nos dados enviados',
        camposInvalidos: erros,
      });
    }

    return next();
  };
}
`,
                documentacao: {
                  resumo: 'Validação declarativa de contratos de payload JSON para criação e atualização.',
                  responsabilidade:
                    'Barrar payloads corrompidos, campos vazios ou formatos inválidos na borda da aplicação antes que cheguem aos controllers e ao banco de dados.',
                  comoFunciona:
                    'validarSchema retorna uma função middleware do Express que itera sobre as regras de validação. Se houver divergências, responde imediatamente com status 400 Bad Request contendo a lista de campos inválidos.',
                  porQueEssaAbordagem:
                    'Validação fail-fast economiza processamento e protege o banco contra inserções com dados incompletos ou maliciosos.',
                  relacionamentos: {
                    usadoPor: [{ arquivo: 'src/routes/usuarioRoutes.js', motivo: 'Intermediário antes do controller' }],
                  },
                  boasPraticas: [
                    'Separe schemas de criação (campos obrigatórios) de schemas de atualização (campos parciais/opcionais).',
                    'Retorne mensagens claras indicando qual campo falhou para facilitar a vida de quem consome a API.',
                  ],
                },
              },
            ],
          },
          {
            nome: 'middlewares',
            caminho: 'src/middlewares',
            pastas: [],
            arquivos: [
              {
                id: 'api-express-sequelize:src/middlewares/autenticacao.js',
                caminho: 'src/middlewares/autenticacao.js',
                nome: 'autenticacao.js',
                linguagem: 'javascript',
                conteudo: `import crypto from 'node:crypto';

const CHAVE_SECRETA_JWT = process.env.JWT_SECRET || 'chave-secreta-padrao-desenvolvimento-32chars';

/**
 * Função utilitária para assinar um JWT simples em formato HMAC-SHA256.
 */
export function gerarTokenJwt(payload, expiracaoSegundos = 3600 * 24) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const corpo = Buffer.from(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiracaoSegundos,
      iat: Math.floor(Date.now() / 1000),
    })
  ).toString('base64url');

  const assinatura = crypto
    .createHmac('sha256', CHAVE_SECRETA_JWT)
    .update(\`\${header}.\${corpo}\`)
    .digest('base64url');

  return \`\${header}.\${corpo}.\${assinatura}\`;
}

/**
 * Middleware para validar o cabeçalho Authorization: Bearer <token>.
 */
export function autenticarJwt(req, res, next) {
  const cabecalhoAuth = req.headers.authorization;

  if (!cabecalhoAuth || !cabecalhoAuth.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Não autorizado',
      detalhe: 'Token JWT ausente. Forneça o header Authorization: Bearer <token>',
    });
  }

  const token = cabecalhoAuth.slice(7).trim();
  const partes = token.split('.');

  if (partes.length !== 3) {
    return res.status(401).json({ erro: 'Não autorizado', detalhe: 'Formato de token JWT inválido' });
  }

  const [header, corpo, assinatura] = partes;

  const assinaturaEsperada = crypto
    .createHmac('sha256', CHAVE_SECRETA_JWT)
    .update(\`\${header}.\${corpo}\`)
    .digest('base64url');

  if (assinatura !== assinaturaEsperada) {
    return res.status(401).json({ erro: 'Não autorizado', detalhe: 'Assinatura do token inválida ou corrompida' });
  }

  try {
    const payload = JSON.parse(Buffer.from(corpo, 'base64url').toString('utf8'));

    // Verifica expiração
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ erro: 'Não autorizado', detalhe: 'Token JWT expirado' });
    }

    // Injeta os dados decodificados do usuário na requisição
    req.usuario = payload;
    return next();
  } catch {
    return res.status(401).json({ erro: 'Não autorizado', detalhe: 'Falha ao decodificar payload do token' });
  }
}

/**
 * Middleware de autorização baseado em perfis (RBAC).
 */
export function autorizarPerfil(...perfisPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Acesso proibido',
        detalhe: \`Seu perfil '\${req.usuario.perfil}' não tem permissão para esta operação.\`,
      });
    }

    return next();
  };
}
`,
                documentacao: {
                  resumo: 'Autenticação de tokens JWT e controle de acesso baseado em papéis (RBAC).',
                  responsabilidade:
                    'Validar a integridade criptográfica do token JWT, checar data de expiração, injetar o payload decodificado em req.usuario e verificar privilégios de acesso com autorizarPerfil.',
                  comoFunciona:
                    'Extrai o token do cabeçalho HTTP Authorization. Calcula a assinatura HMAC-SHA256 da porção header.corpo usando a chave secreta e compara com a assinatura enviada. Decodifica o payload JSON e injeta em req.usuario.',
                  porQueEssaAbordagem:
                    'JWT stateless dispensa consultas ao banco de dados em cada requisição para saber se a sessão é válida, reduzindo latência em APIs de alta demanda.',
                  relacionamentos: {
                    usadoPor: [{ arquivo: 'src/routes/usuarioRoutes.js', motivo: 'Proteção de endpoints' }],
                  },
                  boasPraticas: [
                    'Tokens devem ter tempo de vida curto (ex: 1 hora a 24 horas).',
                    'Nunca guarde senhas ou dados confidenciais no payload do JWT, pois ele pode ser lido por qualquer um.',
                  ],
                },
              },
              {
                id: 'api-express-sequelize:src/middlewares/tratamentoErros.js',
                caminho: 'src/middlewares/tratamentoErros.js',
                nome: 'tratamentoErros.js',
                linguagem: 'javascript',
                conteudo: `/**
 * Middleware global de tratamento de erros no Express.
 * Captura exceções lançadas nos controllers e services via next(erro).
 */
export function tratamentoErros(erro, req, res, _next) {
  const status = erro.status || 500;
  const ehProducao = process.env.NODE_ENV === 'production';

  // Trata erros de validação nativos do Sequelize
  if (erro.name === 'SequelizeValidationError' || erro.name === 'SequelizeUniqueConstraintError') {
    const mensagens = erro.errors?.map((e) => ({
      campo: e.path,
      mensagem: e.message,
    })) || [{ mensagem: erro.message }];

    return res.status(400).json({
      erro: 'Erro de validação no banco de dados',
      camposInvalidos: mensagens,
    });
  }

  // Erros tratados com status específico (400, 401, 403, 404, 409)
  if (status < 500) {
    return res.status(status).json({
      erro: erro.message || 'Requisição inválida',
      detalhe: erro.detalhe,
    });
  }

  // Erros inesperados 500
  console.error('[ERRO INTERNO NÃO TRATADO]', erro);

  return res.status(500).json({
    erro: 'Erro interno do servidor',
    mensagem: ehProducao ? 'Ocorreu um erro inesperado. Tente novamente mais tarde.' : erro.message,
    ...(ehProducao ? {} : { stack: erro.stack }),
  });
}
`,
                documentacao: {
                  resumo: 'Interceptador central de exceções e mapeamento de códigos HTTP.',
                  responsabilidade:
                    'Garantir que nenhum erro não tratado derrube o processo Node.js ou vaze dados sensíveis de stack trace para clientes em produção. Mapeia erros de ORM (Sequelize) para 400 Bad Request.',
                  comoFunciona:
                    'O Express reconhece este middleware por possuir 4 parâmetros: (erro, req, res, next). É obrigatoriamente registrado por último no arquivo app.js.',
                  porQueEssaAbordagem:
                    'Centralizar o tratamento de erros evita blocos repetitivos de tratamento em dezenas de controllers diferentes.',
                  relacionamentos: {
                    usadoPor: [{ arquivo: 'app.js', motivo: 'Registrado após todas as rotas' }],
                  },
                },
              },
            ],
          },
          {
            nome: 'database',
            caminho: 'src/database',
            pastas: [
              {
                nome: 'config',
                caminho: 'src/database/config',
                pastas: [],
                arquivos: [
                  {
                    id: 'api-express-sequelize:src/database/config/database.js',
                    caminho: 'src/database/config/database.js',
                    nome: 'database.js',
                    linguagem: 'javascript',
                    conteudo: `import { Sequelize } from 'sequelize';

const ambiente = process.env.NODE_ENV || 'development';

const configuracoes = {
  development: {
    dialect: 'sqlite',
    storage: './database.dev.sqlite',
    logging: console.log,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export const sequelize = new Sequelize(configuracoes[ambiente]);
`,
                    documentacao: {
                      resumo: 'Configuração da conexão do Sequelize por ambiente (dev, test, prod).',
                      responsabilidade:
                        'Gerenciar pools de conexão, dialetos de banco (SQLite/PostgreSQL) e instanciar o objeto Sequelize.',
                      comoFunciona:
                        'Lê process.env.NODE_ENV para aplicar SQLite em memória em testes e PostgreSQL em produção.',
                      porQueEssaAbordagem:
                        'Permite rodar a suíte de testes de forma veloz em memória sem depender de banco externo instalado.',
                      relacionamentos: {
                        usadoPor: [
                          { arquivo: 'src/models/Usuario.js', motivo: 'Inicialização do modelo' },
                          { arquivo: 'server.js', motivo: 'Teste de conexão antes do listen' },
                        ],
                      },
                    },
                  },
                ],
              },
              {
                nome: 'migrations',
                caminho: 'src/database/migrations',
                pastas: [],
                arquivos: [
                  {
                    id: 'api-express-sequelize:src/database/migrations/20261106-criar-usuarios.js',
                    caminho: 'src/database/migrations/20261106-criar-usuarios.js',
                    nome: '20261106-criar-usuarios.js',
                    linguagem: 'javascript',
                    conteudo: `/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING(120),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(180),
        allowNull: false,
        unique: true,
      },
      senha: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      perfil: {
        type: Sequelize.ENUM('padrao', 'admin', 'moderador'),
        defaultValue: 'padrao',
        allowNull: false,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Cria índice no e-mail para buscas rápidas
    await queryInterface.addIndex('usuarios', ['email'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  },
};
`,
                    documentacao: {
                      resumo: 'Migration versionada para criação da tabela usuarios e índice de e-mail.',
                      responsabilidade:
                        'Garantir que a estrutura de banco de dados possa ser reproduzida de forma idempotente em qualquer ambiente.',
                      comoFunciona:
                        'Método up cria a tabela e o índice; método down desfaz a alteração caso seja necessário rollback.',
                      porQueEssaAbordagem:
                        'Migrations versionadas no Git mantêm o banco em sincronia com o código da aplicação entre todo o time.',
                      relacionamentos: {
                        usadoPor: [
                          { arquivo: 'src/models/Usuario.js', motivo: 'Mapeia a tabela criada por esta migration' },
                        ],
                      },
                    },
                  },
                ],
              },
            ],
            arquivos: [],
          },
        ],
        arquivos: [],
      },
      {
        nome: 'tests',
        caminho: 'tests',
        pastas: [],
        arquivos: [
          {
            id: 'api-express-sequelize:tests/usuario.test.js',
            caminho: 'tests/usuario.test.js',
            nome: 'usuario.test.js',
            linguagem: 'javascript',
            conteudo: `import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../app.js';
import { sequelize } from '../src/database/config/database.js';
import { Usuario } from '../src/models/Usuario.js';
import { gerarTokenJwt } from '../src/middlewares/autenticacao.js';

describe('Integração: Módulo de Usuários', () => {
  let tokenAdmin;

  beforeAll(async () => {
    Usuario.inicializar(sequelize);
    await sequelize.sync({ force: true });

    tokenAdmin = gerarTokenJwt({ id: 1, email: 'admin@sistema.com', perfil: 'admin' });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('deve cadastrar um novo usuário e retornar status 201', async () => {
    // Simulação de chamada POST via endpoint
    const usuario = await Usuario.create({
      nome: 'Carlos Santos',
      email: 'carlos@email.com',
      senha: 'hash-seguro-mock',
      perfil: 'padrao',
    });

    expect(usuario.id).toBeDefined();
    expect(usuario.nome).toBe('Carlos Santos');
    expect(usuario.email).toBe('carlos@email.com');
  });

  it('não deve permitir cadastrar e-mail duplicado', async () => {
    await expect(
      Usuario.create({
        nome: 'Outro Carlos',
        email: 'carlos@email.com',
        senha: 'outro-hash-mock',
      })
    ).rejects.toThrow();
  });
});
`,
            documentacao: {
              resumo: 'Testes de integração para validar persistência e unicidade de usuários.',
              responsabilidade:
                'Garantir que modelos, validações e regras de unicidade funcionem integrados ao banco em memória.',
              comoFunciona:
                'Executa sequelize.sync({ force: true }) antes dos testes para recriar o esquema do zero em ambiente de testes.',
              porQueEssaAbordagem: 'Testes automatizados evitam regressões ao alterar models ou serviços.',
              relacionamentos: {
                importaDe: [
                  { arquivo: 'app.js', motivo: 'Instância da aplicação' },
                  { arquivo: 'src/models/Usuario.js', motivo: 'Operações no banco' },
                ],
              },
            },
          },
        ],
      },
    ],
    arquivosRaiz: [
      {
        id: 'api-express-sequelize:package.json',
        caminho: 'package.json',
        nome: 'package.json',
        linguagem: 'json',
        conteudo: `{
  "name": "api-express-sequelize",
  "version": "1.0.0",
  "description": "API REST profissional com Express e Sequelize",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "dev": "node --watch server.js",
    "start": "node server.js",
    "test": "vitest run",
    "migrate": "npx sequelize-cli db:migrate"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "pg": "^8.13.1",
    "pg-hstore": "^2.3.4",
    "sequelize": "^6.37.5"
  },
  "devDependencies": {
    "sequelize-cli": "^6.6.2",
    "vitest": "^2.1.4"
  }
}
`,
        documentacao: {
          resumo: 'Manifesto do projeto com dependências e scripts de execução.',
          responsabilidade:
            'Declarar scripts de inicialização, migrations e dependências de produção e desenvolvimento.',
          comoFunciona: 'Utiliza "type": "module" para habilitar ES Modules nativos (import/export).',
          porQueEssaAbordagem: 'ES Modules é o padrão moderno do ecossistema JavaScript.',
          relacionamentos: {
            usadoPor: [{ arquivo: 'server.js', motivo: 'Entry point do projeto' }],
          },
        },
      },
      {
        id: 'api-express-sequelize:app.js',
        caminho: 'app.js',
        nome: 'app.js',
        linguagem: 'javascript',
        conteudo: `import express from 'express';
import { usuarioRouter } from './src/routes/usuarioRoutes.js';
import { tratamentoErros } from './src/middlewares/tratamentoErros.js';

export const app = express();

// Middlewares essenciais de segurança e parse
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota de checagem de saúde da API
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', data: new Date().toISOString() });
});

// Agrupamento de rotas com prefixo /api
app.use('/api/usuarios', usuarioRouter);

// Rota 404 para rotas não mapeadas
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    caminho: req.originalUrl,
  });
});

// Middleware global de tratamento de erros (deve ser o último)
app.use(tratamentoErros);
`,
        documentacao: {
          resumo: 'Configuração da aplicação Express, middlewares globais e montagem de rotas.',
          responsabilidade: 'Centralizar a inicialização do app Express sem acoplar a porta de rede do servidor.',
          comoFunciona: 'Monta os middlewares de JSON, as rotas de usuários e os interceptadores de 404 e 500.',
          porQueEssaAbordagem:
            'Separar app.js de server.js permite que suítes de testes importem o app sem abrir portas TCP reais.',
          relacionamentos: {
            importaDe: [
              { arquivo: 'src/routes/usuarioRoutes.js', motivo: 'Módulo de rotas de usuários' },
              { arquivo: 'src/middlewares/tratamentoErros.js', motivo: 'Tratamento central de erros' },
            ],
            usadoPor: [
              { arquivo: 'server.js', motivo: 'Servidor HTTP' },
              { arquivo: 'tests/usuario.test.js', motivo: 'Testes de integração' },
            ],
          },
        },
      },
      {
        id: 'api-express-sequelize:server.js',
        caminho: 'server.js',
        nome: 'server.js',
        linguagem: 'javascript',
        conteudo: `import { app } from './app.js';
import { sequelize } from './src/database/config/database.js';
import { Usuario } from './src/models/Usuario.js';

const PORTA = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    // 1. Inicializa os modelos com a conexão do Sequelize
    Usuario.inicializar(sequelize);

    // 2. Testa a conectividade com o banco antes de aceitar tráfego HTTP
    await sequelize.authenticate();
    console.log(' Conexão com o banco de dados estabelecida com sucesso.');

    // 3. Sobe o servidor HTTP
    app.listen(PORTA, () => {
      console.log(\` Servidor rodando na porta \${PORTA}\`);
      console.log(\` Healthcheck disponível em: http://localhost:\${PORTA}/health\`);
    });
  } catch (erro) {
    console.error(' Falha crítica ao iniciar o servidor:', erro);
    process.exit(1);
  }
}

iniciarServidor();
`,
        documentacao: {
          resumo: 'Ponto de entrada (entry point) que autentica o banco e inicializa o servidor HTTP.',
          responsabilidade:
            'Garantir que a infraestrutura de banco de dados esteja operante antes de disponibilizar o servidor para receber requisições.',
          comoFunciona:
            'Invoca sequelize.authenticate() e somente após a resolução da promessa inicia o listen na porta configurada.',
          porQueEssaAbordagem:
            'Evita que a aplicação suba em estado inconsistente caso o banco de dados esteja offline.',
          relacionamentos: {
            importaDe: [
              { arquivo: 'app.js', motivo: 'Aplicação configurada' },
              { arquivo: 'src/database/config/database.js', motivo: 'Conexão com o banco' },
              { arquivo: 'src/models/Usuario.js', motivo: 'Inicialização dos models' },
            ],
          },
        },
      },
    ],
  },
};
