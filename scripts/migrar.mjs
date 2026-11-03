import { readFile, readdir } from 'node:fs/promises';
import nextEnv from '@next/env';
import pg from 'pg';

nextEnv.loadEnvConfig(process.cwd());
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) throw new Error('Configure DATABASE_URL no arquivo .env.local.');
const client = new pg.Client({ connectionString });
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(730031)');
  await client.query(
    'CREATE TABLE IF NOT EXISTS rabisco_migracoes (nome text PRIMARY KEY, aplicada_em timestamptz NOT NULL DEFAULT now())',
  );
  const pasta = new URL('../db/migrations/', import.meta.url);
  for (const nome of (await readdir(pasta)).filter((nome) => nome.endsWith('.sql')).sort()) {
    const existente = await client.query('SELECT 1 FROM rabisco_migracoes WHERE nome = $1', [nome]);
    if (existente.rowCount) continue;
    await client.query(await readFile(new URL(nome, pasta), 'utf8'));
    await client.query('INSERT INTO rabisco_migracoes (nome) VALUES ($1)', [nome]);
    console.log(`Migração aplicada: ${nome}`);
  }
  await client.query('COMMIT');
} catch (erro) {
  await client.query('ROLLBACK').catch(() => {});
  throw erro;
} finally {
  await client.end();
}
