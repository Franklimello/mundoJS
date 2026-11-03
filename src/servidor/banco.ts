import { Pool } from 'pg';

const globalBanco = globalThis as typeof globalThis & { bancoMundoJS?: Pool };

export function banco(): Pool {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada.');
  if (globalBanco.bancoMundoJS) return globalBanco.bancoMundoJS;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
  pool.on('error', (erro) => console.error('Conexão Postgres interrompida:', erro));
  globalBanco.bancoMundoJS = pool;
  return pool;
}
