import { PDFDocument } from 'pdf-lib';
import { describe, expect, it } from 'vitest';
import { gerarPdfCertificado } from './certificado-pdf';

describe('PDF do certificado', () => {
  it.each(['Júlia Melo — Demonstração', 'Maria de São José '.repeat(5).trim()])(
    'gera uma página A4 horizontal com acentos e nomes longos: %s',
    async (nome) => {
      const bytes = await gerarPdfCertificado({
        id: '12345678-1234-1234-1234-123456789012',
        trilha: 'javascript-do-zero',
        titulo: 'JavaScript do zero',
        nome,
        licoes: 10,
        exercicios: 63,
        emitido_em: new Date('2026-11-03T12:00:00Z'),
      });
      const pdf = await PDFDocument.load(bytes);
      expect(pdf.getPageCount()).toBe(1);
      expect(pdf.getPages()[0]!.getSize()).toEqual({ width: 841.89, height: 595.28 });
      expect(pdf.getSubject()).toBe(`Certificado de ${nome}`);
    },
  );
});
