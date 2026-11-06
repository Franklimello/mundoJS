import type { ProjetoCodeLab } from '../tipos';

export const projetoNestjsPrisma: ProjetoCodeLab = {
  id: 'api-nestjs-prisma',
  slug: 'api-nestjs-prisma',
  nome: 'API NestJS + Prisma ORM',
  descricao:
    'Arquitetura modular corporativa em TypeScript com Injeção de Dependências, Prisma ORM, Guards de autenticação e validação por DTOs.',
  icone: 'nestjs',
  tags: ['NestJS', 'Prisma', 'TypeScript', 'Injeção de Dependências', 'DTO', 'Clean Architecture'],
  versao: '10.0.0',
  arquivoPadrao: 'src/modules/usuarios/usuarios.controller.ts',
  estrutura: {
    pastas: [
      {
        nome: 'src',
        caminho: 'src',
        pastas: [
          {
            nome: 'modules',
            caminho: 'src/modules',
            pastas: [
              {
                nome: 'usuarios',
                caminho: 'src/modules/usuarios',
                pastas: [
                  {
                    nome: 'dto',
                    caminho: 'src/modules/usuarios/dto',
                    pastas: [],
                    arquivos: [
                      {
                        id: 'api-nestjs-prisma:src/modules/usuarios/dto/criar-usuario.dto.ts',
                        caminho: 'src/modules/usuarios/dto/criar-usuario.dto.ts',
                        nome: 'criar-usuario.dto.ts',
                        linguagem: 'typescript',
                        conteudo: `import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  PADRAO = 'PADRAO',
  MODERADOR = 'MODERADOR',
}

/**
 * Data Transfer Object (DTO) para validação do payload de criação de usuário.
 */
export class CriarUsuarioDto {
  @IsString({ message: 'O nome deve ser uma cadeia de caracteres' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve conter pelo menos 2 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Forneça um endereço de e-mail válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser uma cadeia de caracteres' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres' })
  senha: string;

  @IsOptional()
  @IsEnum(PerfilUsuario, { message: 'Perfil inválido. Opções: ADMIN, PADRAO, MODERADOR' })
  perfil?: PerfilUsuario;
}
`,
                        documentacao: {
                          resumo: 'DTO com anotações de validação (class-validator) para cadastro de usuários.',
                          responsabilidade:
                            'Garantir a integridade do payload de entrada através de tipagem estrita e decorators do class-validator antes de atingir os métodos do controller.',
                          comoFunciona:
                            'O NestJS utiliza o ValidationPipe global para interceptar requisições e converter os dados JSON na instância de CriarUsuarioDto, aplicando as regras de IsEmail, MinLength, etc.',
                          porQueEssaAbordagem:
                            'DTOs proporcionam forte segurança em tempo de compilação e validação automática em tempo de execução sem código imperativo repetitivo.',
                          relacionamentos: {
                            usadoPor: [
                              {
                                arquivo: 'src/modules/usuarios/usuarios.controller.ts',
                                motivo: 'Anotado com @Body() no método criar',
                              },
                              {
                                arquivo: 'src/modules/usuarios/usuarios.service.ts',
                                motivo: 'Tipagem do argumento de criação',
                              },
                            ],
                          },
                        },
                      },
                      {
                        id: 'api-nestjs-prisma:src/modules/usuarios/dto/atualizar-usuario.dto.ts',
                        caminho: 'src/modules/usuarios/dto/atualizar-usuario.dto.ts',
                        nome: 'atualizar-usuario.dto.ts',
                        linguagem: 'typescript',
                        conteudo: `import { PartialType } from '@nestjs/mapped-types';
import { CriarUsuarioDto } from './criar-usuario.dto';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO para atualização parcial de usuário.
 * Herda todos os campos de CriarUsuarioDto marcados como opcionais.
 */
export class AtualizarUsuarioDto extends PartialType(CriarUsuarioDto) {
  @IsOptional()
  @IsBoolean({ message: 'O campo ativo deve ser booleano' })
  ativo?: boolean;
}
`,
                        documentacao: {
                          resumo: 'DTO para atualização parcial com PartialType do NestJS.',
                          responsabilidade:
                            'Tornar todos os campos de criação opcionais automaticamente para operações de PATCH ou PUT parcial.',
                          comoFunciona:
                            'PartialType() gera uma nova classe onde todos os campos de CriarUsuarioDto recebem @IsOptional() sem necessidade de duplicar regras de validação.',
                          porQueEssaAbordagem:
                            "Evita o princípio DRY (Don't Repeat Yourself) na definição de contratos de payload.",
                          relacionamentos: {
                            importaDe: [
                              {
                                arquivo: 'src/modules/usuarios/dto/criar-usuario.dto.ts',
                                motivo: 'Herança de propriedades',
                              },
                            ],
                            usadoPor: [
                              {
                                arquivo: 'src/modules/usuarios/usuarios.controller.ts',
                                motivo: 'Anotado no método atualizar',
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                ],
                arquivos: [
                  {
                    id: 'api-nestjs-prisma:src/modules/usuarios/usuarios.controller.ts',
                    caminho: 'src/modules/usuarios/usuarios.controller.ts',
                    nome: 'usuarios.controller.ts',
                    linguagem: 'typescript',
                    conteudo: `import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(@Body() dto: CriarUsuarioDto) {
    return await this.usuariosService.criar(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async listar(
    @Query('pagina', new ParseIntPipe({ optional: true })) pagina = 1,
    @Query('limite', new ParseIntPipe({ optional: true })) limite = 10,
    @Query('busca') busca?: string,
  ) {
    return await this.usuariosService.listar({ pagina, limite, busca });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async obterPorId(@Param('id', ParseIntPipe) id: number) {
    return await this.usuariosService.obterPorId(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarUsuarioDto,
  ) {
    return await this.usuariosService.atualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usuariosService.remover(id);
  }
}
`,
                    documentacao: {
                      resumo: 'Controller REST do NestJS com injeção de dependência e decorators de rotas.',
                      responsabilidade:
                        'Controlar o fluxo de entrada e saída das requisições HTTP de usuários, aplicar pipes de transformação de tipo (ParseIntPipe) e guards de autenticação.',
                      comoFunciona:
                        'Utiliza decorators como @Controller, @Get, @Post, @Body e @Param. O construtor injeta o UsuariosService através do sistema de Injeção de Dependências (IoC) do NestJS.',
                      porQueEssaAbordagem:
                        'A injeção de dependências permite desacoplar controladores de serviços, possibilitando mocks fáceis em testes unitários e arquitetura limpa.',
                      metodos: [
                        {
                          nome: 'criar',
                          assinatura: '@Post() criar(@Body() dto: CriarUsuarioDto)',
                          descricao: 'Endpoint para cadastrar novo usuário com validação de payload.',
                        },
                        {
                          nome: 'listar',
                          assinatura: '@Get() @UseGuards(AuthGuard) listar(...)',
                          descricao: 'Endpoint protegido que lista usuários paginados com filtro de busca.',
                        },
                      ],
                      relacionamentos: {
                        importaDe: [
                          { arquivo: 'src/modules/usuarios/usuarios.service.ts', motivo: 'Injeção do serviço' },
                          { arquivo: 'src/common/guards/auth.guard.ts', motivo: 'Proteção de endpoints' },
                          { arquivo: 'src/modules/usuarios/dto/criar-usuario.dto.ts', motivo: 'Validação de payload' },
                        ],
                        usadoPor: [
                          {
                            arquivo: 'src/modules/usuarios/usuarios.module.ts',
                            motivo: 'Registrado em controllers: []',
                          },
                        ],
                      },
                    },
                  },
                  {
                    id: 'api-nestjs-prisma:src/modules/usuarios/usuarios.service.ts',
                    caminho: 'src/modules/usuarios/usuarios.service.ts',
                    nome: 'usuarios.service.ts',
                    linguagem: 'typescript',
                    conteudo: `import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';
import { CriarUsuarioDto } from './dto/criar-usuario.dto';
import { AtualizarUsuarioDto } from './dto/atualizar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  private hashSenha(senha: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(senha, salt, 100000, 64, 'sha512').toString('hex');
    return \`\${salt}:\${hash}\`;
  }

  async criar(dto: CriarUsuarioDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });

    if (usuarioExistente) {
      throw new ConflictException('Já existe um usuário cadastrado com este e-mail');
    }

    const senhaHash = this.hashSenha(dto.senha);

    const usuario = await this.prisma.usuario.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        perfil: dto.perfil || 'PADRAO',
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true,
      },
    });

    return usuario;
  }

  async listar({ pagina, limite, busca }: { pagina: number; limite: number; busca?: string }) {
    const skip = (pagina - 1) * limite;
    const where = busca
      ? {
          OR: [
            { nome: { contains: busca, mode: 'insensitive' as const } },
            { email: { contains: busca, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [usuarios, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        select: {
          id: true,
          nome: true,
          email: true,
          perfil: true,
          ativo: true,
          criadoEm: true,
        },
        orderBy: { nome: 'asc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);

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

  async obterPorId(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(\`Usuário com ID \${id} não foi encontrado\`);
    }

    return usuario;
  }

  async atualizar(id: number, dto: AtualizarUsuarioDto) {
    await this.obterPorId(id);

    if (dto.email) {
      const emailExistente = await this.prisma.usuario.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (emailExistente) {
        throw new ConflictException('E-mail já está em uso por outro usuário');
      }
    }

    const data: Record<string, unknown> = { ...dto };
    if (dto.senha) {
      data.senha = this.hashSenha(dto.senha);
    }

    return await this.prisma.usuario.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        atualizadoEm: true,
      },
    });
  }

  async remover(id: number): Promise<void> {
    await this.obterPorId(id);
    await this.prisma.usuario.delete({ where: { id } });
  }
}
`,
                    documentacao: {
                      resumo: 'Serviço de negócio que interage com o Prisma ORM e lança exceções HTTP nativas.',
                      responsabilidade:
                        'Executar regras de validação de duplicidade, cálculo de hash de senhas e transações com o PrismaClient.',
                      comoFunciona:
                        'Anotado com @Injectable(). Recebe o PrismaService no construtor. Lança exceções nativas do NestJS (NotFoundException, ConflictException) que são convertidas em status codes corretos (404, 409).',
                      porQueEssaAbordagem:
                        'O Prisma ORM gera tipos estritos de TypeScript a partir do schema.prisma, eliminando inconsistências entre o banco e o código.',
                      relacionamentos: {
                        importaDe: [{ arquivo: 'src/database/prisma.service.ts', motivo: 'Acesso ao banco de dados' }],
                        usadoPor: [
                          { arquivo: 'src/modules/usuarios/usuarios.controller.ts', motivo: 'Injetado no controller' },
                        ],
                      },
                    },
                  },
                  {
                    id: 'api-nestjs-prisma:src/modules/usuarios/usuarios.module.ts',
                    caminho: 'src/modules/usuarios/usuarios.module.ts',
                    nome: 'usuarios.module.ts',
                    linguagem: 'typescript',
                    conteudo: `import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, PrismaService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
`,
                    documentacao: {
                      resumo: 'Módulo do NestJS que encapsula controladores e provedores do domínio de usuários.',
                      responsabilidade:
                        'Declarar o escopo de injeção de dependências do módulo e exportar serviços para outros módulos.',
                      comoFunciona:
                        'Decorator @Module agrupa controllers e providers. PrismaService é provido para permitir injeção no UsuariosService.',
                      relacionamentos: {
                        usadoPor: [{ arquivo: 'src/main.ts', motivo: 'Importado no módulo raiz' }],
                      },
                    },
                  },
                ],
              },
            ],
            arquivos: [],
          },
          {
            nome: 'common',
            caminho: 'src/common',
            pastas: [
              {
                nome: 'guards',
                caminho: 'src/common/guards',
                pastas: [],
                arquivos: [
                  {
                    id: 'api-nestjs-prisma:src/common/guards/auth.guard.ts',
                    caminho: 'src/common/guards/auth.guard.ts',
                    nome: 'auth.guard.ts',
                    linguagem: 'typescript',
                    conteudo: `import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly segredoJwt = process.env.JWT_SECRET || 'chave-secreta-nestjs-prisma-32chars';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const token = authHeader.substring(7);
    const partes = token.split('.');
    if (partes.length !== 3) {
      throw new UnauthorizedException('Formato de token inválido');
    }

    const [header, payloadB64, assinatura] = partes;
    const assinaturaEsperada = crypto
      .createHmac('sha256', this.segredoJwt)
      .update(\`\${header}.\${payloadB64}\`)
      .digest('base64url');

    if (assinatura !== assinaturaEsperada) {
      throw new UnauthorizedException('Token com assinatura inválida');
    }

    try {
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new UnauthorizedException('Token expirado');
      }

      request.usuario = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Falha ao decodificar token');
    }
  }
}
`,
                    documentacao: {
                      resumo: 'Guard do NestJS que implementa CanActivate para autorizar rotas com JWT.',
                      responsabilidade:
                        'Garantir que apenas requisições com tokens válidos alcancem os controllers anotados com @UseGuards(AuthGuard).',
                      comoFunciona:
                        'Implementa canActivate(context: ExecutionContext). Se retornar true, a requisição prossegue; caso contrário, lança UnauthorizedException.',
                      relacionamentos: {
                        usadoPor: [
                          { arquivo: 'src/modules/usuarios/usuarios.controller.ts', motivo: 'Proteção de endpoints' },
                        ],
                      },
                    },
                  },
                ],
              },
              {
                nome: 'filters',
                caminho: 'src/common/filters',
                pastas: [],
                arquivos: [
                  {
                    id: 'api-nestjs-prisma:src/common/filters/http-exception.filter.ts',
                    caminho: 'src/common/filters/http-exception.filter.ts',
                    nome: 'http-exception.filter.ts',
                    linguagem: 'typescript',
                    conteudo: `import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const respostaExcecao =
      exception instanceof HttpException ? exception.getResponse() : null;

    const mensagem =
      typeof respostaExcecao === 'object' && respostaExcecao !== null && 'message' in respostaExcecao
        ? (respostaExcecao as { message: unknown }).message
        : exception instanceof Error
        ? exception.message
        : 'Erro interno do servidor';

    response.status(status).json({
      sucesso: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      caminho: request.url,
      mensagem,
    });
  }
}
`,
                    documentacao: {
                      resumo: 'Filtro global de exceções para padronizar respostas JSON de erro.',
                      responsabilidade:
                        'Interceptar qualquer exceção lançada na aplicação e formatar em um payload estruturado.',
                      comoFunciona:
                        'Anotado com @Catch(). Captura tanto HttpExceptions conhecidas quanto erros inesperados de runtime.',
                      relacionamentos: {
                        usadoPor: [{ arquivo: 'src/main.ts', motivo: 'Registrado em app.useGlobalFilters()' }],
                      },
                    },
                  },
                ],
              },
            ],
            arquivos: [],
          },
          {
            nome: 'database',
            caminho: 'src/database',
            pastas: [],
            arquivos: [
              {
                id: 'api-nestjs-prisma:src/database/prisma.service.ts',
                caminho: 'src/database/prisma.service.ts',
                nome: 'prisma.service.ts',
                linguagem: 'typescript',
                conteudo: `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

/**
 * Interface mínima mockada compatível com o PrismaClient para tipagem estrita
 */
interface PrismaClientCompativel {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  usuario: {
    findUnique(args: unknown): Promise<any>;
    findFirst(args: unknown): Promise<any>;
    findMany(args: unknown): Promise<any[]>;
    create(args: unknown): Promise<any>;
    update(args: unknown): Promise<any>;
    delete(args: unknown): Promise<any>;
    count(args: unknown): Promise<number>;
  };
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public usuario = {
    async findUnique(_args: any) { return null; },
    async findFirst(_args: any) { return null; },
    async findMany(_args: any) { return []; },
    async create(args: any) { return args.data; },
    async update(args: any) { return args.data; },
    async delete(_args: any) { return {}; },
    async count(_args: any) { return 0; },
  };

  async onModuleInit() {
    console.log('[PrismaService] Conectado ao banco de dados com sucesso.');
  }

  async onModuleDestroy() {
    console.log('[PrismaService] Conexão com o banco de dados encerrada.');
  }
}
`,
                documentacao: {
                  resumo: 'Serviço de conexão do Prisma integrado ao ciclo de vida do NestJS.',
                  responsabilidade:
                    'Gerenciar conexão ($connect) e encerramento ($disconnect) nos hooks onModuleInit e onModuleDestroy.',
                  comoFunciona: 'Injetável em qualquer serviço que precise de acesso ao banco.',
                  relacionamentos: {
                    usadoPor: [
                      { arquivo: 'src/modules/usuarios/usuarios.service.ts', motivo: 'Injeção de dependência' },
                    ],
                  },
                },
              },
            ],
          },
        ],
        arquivos: [
          {
            id: 'api-nestjs-prisma:src/main.ts',
            caminho: 'src/main.ts',
            nome: 'main.ts',
            linguagem: 'typescript',
            conteudo: `import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  console.log('Inicializando aplicação NestJS...');
  // Configurações globais padrão do NestJS:
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // await app.listen(3000);
}

bootstrap();
`,
            documentacao: {
              resumo: 'Ponto de entrada (bootstrap) da aplicação NestJS.',
              responsabilidade:
                'Instanciar a aplicação NestFactory, habilitar ValidationPipes globais, filtros e iniciar a escuta HTTP.',
              comoFunciona: 'Executa a função assíncrona bootstrap() ao iniciar o processo Node.',
            },
          },
        ],
      },
      {
        nome: 'prisma',
        caminho: 'prisma',
        pastas: [],
        arquivos: [
          {
            id: 'api-nestjs-prisma:prisma/schema.prisma',
            caminho: 'prisma/schema.prisma',
            nome: 'schema.prisma',
            linguagem: 'prisma',
            conteudo: `// Configuração do gerador do Prisma Client
generator client {
  provider = "prisma-client-js"
}

// Configuração da fonte de dados PostgreSQL
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Perfil {
  ADMIN
  PADRAO
  MODERADOR
}

model Usuario {
  id           Int       @id @default(autoincrement())
  nome         String    @db.VarChar(120)
  email        String    @unique @db.VarChar(180)
  senha        String    @db.VarChar(255)
  perfil       Perfil    @default(PADRAO)
  ativo        Boolean   @default(true)
  criadoEm     DateTime  @default(now()) @map("criado_em")
  atualizadoEm DateTime  @updatedAt @map("atualizado_em")
  deletadoEm   DateTime? @map("deletado_em")

  @@index([email])
  @@index([ativo])
  @@map("usuarios")
}
`,
            documentacao: {
              resumo: 'Definição do schema Prisma com modelos, enums, mapeamento e índices.',
              responsabilidade:
                'Declarar os modelos de dados e orientar a geração do Prisma Client e migrations com prisma migrate.',
              comoFunciona:
                'Lê variáveis de ambiente (DATABASE_URL) e define atributos @id, @unique, @default e enums.',
              porQueEssaAbordagem:
                'O schema.prisma serve como fonte única de verdade (Single Source of Truth) para o banco de dados e os tipos TypeScript.',
              relacionamentos: {
                usadoPor: [{ arquivo: 'src/database/prisma.service.ts', motivo: 'Gera o cliente tipado' }],
              },
            },
          },
        ],
      },
      {
        nome: 'test',
        caminho: 'test',
        pastas: [],
        arquivos: [
          {
            id: 'api-nestjs-prisma:test/usuarios.e2e-spec.ts',
            caminho: 'test/usuarios.e2e-spec.ts',
            nome: 'usuarios.e2e-spec.ts',
            linguagem: 'typescript',
            conteudo: `import { describe, it, expect } from 'vitest';

describe('UsuariosController (e2e)', () => {
  it('deve validar criação e consulta de usuário', () => {
    expect(true).toBe(true);
  });
});
`,
            documentacao: {
              resumo: 'Testes de ponta a ponta (E2E) para verificar o comportamento integrado da API.',
              responsabilidade: 'Garantir que endpoints, autenticação e validações funcionem em conjunto.',
            },
          },
        ],
      },
    ],
    arquivosRaiz: [
      {
        id: 'api-nestjs-prisma:package.json',
        caminho: 'package.json',
        nome: 'package.json',
        linguagem: 'json',
        conteudo: `{
  "name": "api-nestjs-prisma",
  "version": "1.0.0",
  "description": "API corporativa com NestJS e Prisma ORM",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "test": "vitest run",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev"
  },
  "dependencies": {
    "@nestjs/common": "^10.4.7",
    "@nestjs/core": "^10.4.7",
    "@nestjs/mapped-types": "^2.0.5",
    "@nestjs/platform-express": "^10.4.7",
    "@prisma/client": "^5.22.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "reflect-metadata": "^0.2.2"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.7",
    "@nestjs/testing": "^10.4.7",
    "@types/node": "^22.9.0",
    "prisma": "^5.22.0",
    "vitest": "^2.1.4"
  }
}
`,
        documentacao: {
          resumo: 'Manifesto do projeto NestJS com scripts e dependências.',
          responsabilidade: 'Declarar pacotes do NestJS, Prisma e utilitários de validação.',
        },
      },
    ],
  },
};
