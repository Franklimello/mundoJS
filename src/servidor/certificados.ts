import { randomUUID } from 'node:crypto';
import type { Pool } from 'pg';
import { buscarTrilha, todasAsLicoes, trilhas } from '@/conteudo';

export interface Certificado {
  id: string;
  trilha: string;
  titulo: string;
  nome: string;
  licoes: number;
  exercicios: number;
  emitido_em: Date;
}

export async function situacaoCertificados(db: Pool, usuarioId: string) {
  const [progresso, emitidos] = await Promise.all([
    db.query<{ chave: string }>('SELECT chave FROM progresso WHERE visitante = $1 AND tipo = $2', [
      `conta:${usuarioId}`,
      'exercicio',
    ]),
    db.query<Certificado>(
      'SELECT id, trilha, titulo, nome, licoes, exercicios, emitido_em FROM conta_certificados WHERE usuario_id = $1',
      [usuarioId],
    ),
  ]);
  const feitos = new Set(progresso.rows.map((item) => item.chave));
  return trilhas.map((trilha) => {
    const licoes = todasAsLicoes(trilha);
    const chaves = licoes.flatMap((licao) => licao.exercicios.map((_, i) => `${trilha.slug}/${licao.slug}#${i}`));
    const concluidos = chaves.filter((chave) => feitos.has(chave)).length;
    return {
      trilha: trilha.slug,
      titulo: trilha.titulo,
      licoes: licoes.length,
      exercicios: chaves.length,
      concluidos,
      liberado: chaves.length > 0 && concluidos === chaves.length,
      certificado: emitidos.rows.find((item) => item.trilha === trilha.slug) ?? null,
    };
  });
}

/** A conta vem da sessão. Só usamos exercícios salvos; marcas antigas de lição não bastam. */
export async function emitirCertificado(db: Pool, usuarioId: string, trilha: string, nome: string) {
  if (!buscarTrilha(trilha)) throw new Error('trilha-invalida');
  const normalizado = nome.trim().replace(/\s+/g, ' ');
  if (normalizado.length < 2 || normalizado.length > 100 || /[\p{Cc}\p{Cf}]/u.test(normalizado))
    throw new Error('nome-invalido');
  const situacao = (await situacaoCertificados(db, usuarioId)).find((item) => item.trilha === trilha)!;
  // Um certificado já emitido continua acessível quando a trilha recebe exercícios novos.
  if (situacao.certificado) return situacao.certificado;
  if (!situacao.liberado) throw new Error('trilha-incompleta');
  const resultado = await db.query<Certificado>(
    `INSERT INTO conta_certificados (id, usuario_id, trilha, titulo, nome, licoes, exercicios)
     VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (usuario_id, trilha) DO NOTHING
     RETURNING id, trilha, titulo, nome, licoes, exercicios, emitido_em`,
    [randomUUID(), usuarioId, trilha, situacao.titulo, normalizado, situacao.licoes, situacao.exercicios],
  );
  if (resultado.rows[0]) return resultado.rows[0];
  const existente = await db.query<Certificado>(
    'SELECT id, trilha, titulo, nome, licoes, exercicios, emitido_em FROM conta_certificados WHERE usuario_id = $1 AND trilha = $2',
    [usuarioId, trilha],
  );
  return existente.rows[0]!;
}

export async function lerCertificado(db: Pool, usuarioId: string, id: string) {
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(id)) return null;
  const resultado = await db.query<Certificado>(
    'SELECT id, trilha, titulo, nome, licoes, exercicios, emitido_em FROM conta_certificados WHERE usuario_id = $1 AND id = $2',
    [usuarioId, id],
  );
  return resultado.rows[0] ?? null;
}
