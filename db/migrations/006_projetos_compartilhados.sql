CREATE TABLE projetos_compartilhados (
  id text PRIMARY KEY CHECK (id ~ '^[a-f0-9]{48}$'),
  usuario_id text NOT NULL REFERENCES auth_usuario(id) ON DELETE CASCADE,
  trilha text NOT NULL,
  codigo text NOT NULL CHECK (octet_length(codigo) <= 200000),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (usuario_id, trilha)
);
