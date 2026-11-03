import { Pool } from 'pg';
import { attachDatabasePool } from '@vercel/functions';

const globalBanco = globalThis as typeof globalThis & { bancoMundoJS?: Pool; bancoCobrancaMundoJS?: Pool };

function criarPool(connectionString: string, max: number) {
  const pool = new Pool({ connectionString, max, connectionTimeoutMillis: 10000, idleTimeoutMillis: 5000 });
  pool.on('error', (erro) => console.error('Conexão Postgres interrompida:', erro));
  if (process.env.VERCEL === '1') attachDatabasePool(pool);
  return pool;
}

export function banco(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada.');
  if (globalBanco.bancoMundoJS) return globalBanco.bancoMundoJS;
  const pool = criarPool(process.env.DATABASE_URL, 5);
  globalBanco.bancoMundoJS = pool;
  return pool;
}

export function urlBancoCobranca() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) throw new Error('Conexão direta do banco não configurada.');
  if (/-pooler(?:[.-]|$)/.test(new URL(url).hostname))
    throw new Error('Configure DATABASE_URL_UNPOOLED para os bloqueios de sessão da cobrança.');
  return url;
}

/** PgBouncer em modo transaction não preserva pg_advisory_lock entre consultas. */
export function bancoCobranca(): Pool {
  const url = urlBancoCobranca();
  if (globalBanco.bancoCobrancaMundoJS) return globalBanco.bancoCobrancaMundoJS;
  const pool = criarPool(url, 2);
  globalBanco.bancoCobrancaMundoJS = pool;
  return pool;
}
