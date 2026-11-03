CREATE TABLE cobranca_contas (
  usuario_id text PRIMARY KEY REFERENCES auth_usuario(id) ON DELETE CASCADE,
  cliente_id text UNIQUE,
  cliente_chave text NOT NULL,
  checkout_chave text,
  checkout_expira bigint,
  assinatura_id text,
  status text NOT NULL DEFAULT 'gratuito',
  inicio timestamptz,
  fim timestamptz,
  cancelar_no_fim boolean NOT NULL DEFAULT false,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE cobranca_eventos (
  id text PRIMARY KEY,
  processado_em timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE tutor_franquias (
  identidade text NOT NULL,
  periodo text NOT NULL,
  quantidade integer NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
  PRIMARY KEY (identidade, periodo)
);
