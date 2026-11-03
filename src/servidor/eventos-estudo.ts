import type { Pool } from 'pg';
import { buscarLicao } from '@/conteudo';
import type { EventoEstudo } from '@/estudo/tipos';

const TIPOS = new Set([
  'visita',
  'exercicio_aberto',
  'codigo_rodado',
  'exercicio_conferido',
  'ajuda_pedida',
  'ajuda_recebida',
]);

export function eventoValido(valor: unknown): valor is EventoEstudo {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return false;
  const e = valor as Record<string, unknown>;
  if (
    typeof e.id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e.id) ||
    typeof e.tipo !== 'string' ||
    !TIPOS.has(e.tipo)
  )
    return false;
  if (e.tipo === 'exercicio_conferido' ? typeof e.passou !== 'boolean' : e.passou !== undefined) return false;
  if (e.tipo === 'visita') return e.posicao === undefined;
  if (!e.posicao) return e.tipo === 'ajuda_pedida' || e.tipo === 'ajuda_recebida' || e.tipo === 'codigo_rodado';
  const p = e.posicao as Record<string, unknown>;
  return (
    typeof p.trilha === 'string' &&
    typeof p.licao === 'string' &&
    Number.isInteger(p.indice) &&
    (p.indice as number) >= 0 &&
    Boolean(buscarLicao(p.trilha, p.licao)?.licao.exercicios[p.indice as number])
  );
}

export async function salvarEvento(db: Pool, visitante: string, evento: EventoEstudo) {
  await db.query("DELETE FROM estudo_eventos WHERE criado_em < now() - interval '90 days'");
  await db.query(
    `INSERT INTO estudo_eventos (id, visitante, tipo, trilha, licao, indice, passou)
     SELECT $1, $2, $3, $4, $5, $6, $7
     WHERE (SELECT count(*) FROM estudo_eventos WHERE visitante = $2 AND criado_em > now() - interval '1 hour') < 500
     ON CONFLICT (id) DO NOTHING`,
    [
      evento.id,
      visitante,
      evento.tipo,
      evento.posicao?.trilha ?? null,
      evento.posicao?.licao ?? null,
      evento.posicao?.indice ?? null,
      evento.passou ?? null,
    ],
  );
}
