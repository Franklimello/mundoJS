ALTER TABLE estudo_eventos
  ADD COLUMN IF NOT EXISTS pagina text CHECK (pagina IN ('inicio', 'comecar')),
  ADD COLUMN IF NOT EXISTS canal text CHECK (canal IN ('direto', 'youtube', 'instagram', 'tiktok', 'whatsapp', 'google', 'outro'));

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'estudo_eventos'::regclass AND conname = 'estudo_eventos_entrada_valida'
  ) THEN
    ALTER TABLE estudo_eventos ADD CONSTRAINT estudo_eventos_entrada_valida CHECK (
      (pagina IS NULL AND canal IS NULL) OR
      (tipo = 'visita' AND pagina IS NOT NULL AND canal IS NOT NULL)
    );
  END IF;
END $$;
