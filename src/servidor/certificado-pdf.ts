import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument, rgb, type PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { Certificado } from './certificados';

const azul = rgb(0.067, 0.165, 0.47);
const cinza = rgb(0.25, 0.29, 0.35);
const suave = rgb(0.77, 0.83, 0.9);

export async function gerarPdfCertificado(certificado: Certificado) {
  const documento = await PDFDocument.create();
  documento.registerFontkit(fontkit);
  const [regular, negrito] = await Promise.all([
    readFile(join(process.cwd(), 'public/fontes-certificado/noto-sans-latin-400.woff')),
    readFile(join(process.cwd(), 'public/fontes-certificado/noto-sans-latin-700.woff')),
  ]);
  const normal = await documento.embedFont(regular, { subset: true });
  const forte = await documento.embedFont(negrito, { subset: true });
  documento.setTitle(`Certificado de conclusão — ${certificado.titulo}`);
  documento.setAuthor('MundoJS');
  documento.setSubject(`Certificado de ${certificado.nome}`);
  documento.setCreationDate(certificado.emitido_em);
  const pagina = documento.addPage([841.89, 595.28]);
  const largura = pagina.getWidth();
  function centro(texto: string, y: number, tamanho: number, fonte: PDFFont = normal, cor = cinza) {
    const medida = fonte.widthOfTextAtSize(texto, tamanho);
    const ajustado = medida > 700 ? (tamanho * 700) / medida : tamanho;
    pagina.drawText(texto, {
      x: (largura - fonte.widthOfTextAtSize(texto, ajustado)) / 2,
      y,
      size: ajustado,
      font: fonte,
      color: cor,
    });
  }
  pagina.drawRectangle({ x: 28, y: 28, width: largura - 56, height: 539.28, borderColor: azul, borderWidth: 1.5 });
  pagina.drawRectangle({ x: 36, y: 36, width: largura - 72, height: 523.28, borderColor: suave, borderWidth: 0.6 });
  pagina.drawText('Mundo', { x: 64, y: 516, font: forte, size: 23, color: azul });
  pagina.drawRectangle({ x: 145, y: 511, width: 36, height: 31, color: rgb(1, 0.945, 0.66) });
  pagina.drawText('JS', { x: 151, y: 516, font: forte, size: 23, color: azul });
  pagina.drawText('APRENDER · PRATICAR · CONSTRUIR', { x: 570, y: 521, font: normal, size: 8, color: cinza });
  pagina.drawCircle({ x: largura / 2, y: 465, size: 18, borderColor: azul, borderWidth: 2 });
  pagina.drawLine({
    start: { x: largura / 2 - 10, y: 450 },
    end: { x: largura / 2 - 14, y: 432 },
    thickness: 2,
    color: azul,
  });
  pagina.drawLine({
    start: { x: largura / 2 + 10, y: 450 },
    end: { x: largura / 2 + 14, y: 432 },
    thickness: 2,
    color: azul,
  });
  centro('JS', 460, 13, forte, azul);
  centro('UMA NOVA ETAPA CONCLUÍDA', 408, 9, forte, azul);
  centro('Certificado de conclusão', 365, 32, forte, azul);
  centro('O MundoJS certifica que', 332, 12);
  centro(certificado.nome, 283, 31, forte, azul);
  centro('concluiu as atividades da trilha', 250, 12);
  centro(certificado.titulo, 215, 23, forte, azul);
  centro(`${certificado.licoes} lições · ${certificado.exercicios} exercícios de programação`, 185, 12);
  pagina.drawLine({ start: { x: 64, y: 139 }, end: { x: largura - 64, y: 139 }, thickness: 0.6, color: suave });
  pagina.drawText('MundoJS', { x: 64, y: 117, size: 11, font: forte, color: azul });
  pagina.drawText('O seu universo JavaScript', { x: 64, y: 99, size: 9, font: normal, color: cinza });
  const data = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(certificado.emitido_em);
  pagina.drawText(`Emitido em ${data}`, { x: 620, y: 117, size: 10, font: forte, color: azul });
  pagina.drawText('mundojavascript.com.br', { x: 620, y: 99, size: 9, font: normal, color: cinza });
  centro(`Registro ${certificado.id}`, 61, 8);
  return documento.save();
}
