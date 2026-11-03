import type { Pool } from 'pg';
import { ErroTutor } from './tutor';

function limite(valor: string | undefined, padrao: number) {
  const numero = Number(valor);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : padrao;
}

/** Limites compartilhados entre processos; reserva antes de chamar o provedor. */
export async function reservarPergunta(db: Pool, visitante: string): Promise<void> {
  const cliente = await db.connect();
  try {
    await cliente.query('BEGIN');
    await cliente.query("DELETE FROM tutor_uso WHERE periodo < now() - interval '2 days'");
    const escopos = [
      { chave: 'global', janela: 'day', maximo: limite(process.env.TUTOR_LIMITE_DIARIO, 1000) },
      { chave: `visitante:${visitante}`, janela: 'hour', maximo: limite(process.env.TUTOR_LIMITE_HORA, 20) },
    ];
    for (const escopo of escopos) {
      const resultado = await cliente.query(
        `INSERT INTO tutor_uso (escopo, periodo, quantidade)
         VALUES ($1, date_trunc($2, now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC', 1)
         ON CONFLICT (escopo, periodo) DO UPDATE SET quantidade = tutor_uso.quantidade + 1
         WHERE tutor_uso.quantidade < $3 RETURNING quantidade`,
        [escopo.chave, escopo.janela, escopo.maximo],
      );
      if (!resultado.rowCount)
        throw new ErroTutor(429, 'O limite de perguntas foi atingido. Tente novamente mais tarde.');
    }
    await cliente.query('COMMIT');
  } catch (erro) {
    await cliente.query('ROLLBACK');
    throw erro;
  } finally {
    cliente.release();
  }
}
