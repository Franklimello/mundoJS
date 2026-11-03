CREATE TABLE IF NOT EXISTS progresso (
  visitante text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('licao', 'exercicio')),
  chave text NOT NULL,
  concluido_em timestamptz NOT NULL,
  PRIMARY KEY (visitante, tipo, chave)
);

CREATE TABLE IF NOT EXISTS rascunhos (
  visitante text NOT NULL,
  chave text NOT NULL,
  codigo text NOT NULL CHECK (octet_length(codigo) <= 200000),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (visitante, chave)
);
