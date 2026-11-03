CREATE TABLE conta_importacoes (
  visitante text PRIMARY KEY,
  usuario_id text NOT NULL REFERENCES auth_usuario(id) ON DELETE CASCADE,
  importado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE conta_rascunhos_arquivados (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  usuario_id text NOT NULL REFERENCES auth_usuario(id) ON DELETE CASCADE,
  chave text NOT NULL,
  codigo text NOT NULL,
  original_em timestamptz NOT NULL,
  arquivado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX conta_rascunhos_usuario ON conta_rascunhos_arquivados(usuario_id);
