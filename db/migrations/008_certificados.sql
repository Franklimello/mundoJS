CREATE TABLE IF NOT EXISTS conta_certificados (
  id uuid PRIMARY KEY,
  usuario_id text NOT NULL REFERENCES auth_usuario(id) ON DELETE CASCADE,
  trilha text NOT NULL,
  titulo text NOT NULL,
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 2 AND 100),
  licoes integer NOT NULL CHECK (licoes > 0),
  exercicios integer NOT NULL CHECK (exercicios > 0),
  emitido_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, trilha)
);
