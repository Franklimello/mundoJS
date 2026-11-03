CREATE TABLE IF NOT EXISTS estudo_eventos (
  id uuid PRIMARY KEY,
  visitante text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('visita', 'exercicio_aberto', 'codigo_rodado', 'exercicio_conferido', 'ajuda_pedida', 'ajuda_recebida')),
  trilha text,
  licao text,
  indice integer CHECK (indice >= 0),
  passou boolean,
  criado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS estudo_eventos_periodo ON estudo_eventos (criado_em);
CREATE INDEX IF NOT EXISTS estudo_eventos_visitante ON estudo_eventos (visitante, criado_em DESC);
