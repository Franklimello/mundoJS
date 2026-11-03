CREATE TABLE IF NOT EXISTS tutor_uso (
  escopo text NOT NULL,
  periodo timestamptz NOT NULL,
  quantidade integer NOT NULL CHECK (quantidade > 0),
  PRIMARY KEY (escopo, periodo)
);
