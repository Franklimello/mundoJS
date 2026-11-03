import type { DocumentoWeb } from '@/engine/documento';

export function guardarDocumento(javascript: string, documento: DocumentoWeb) {
  return JSON.stringify({ mundojsWeb: 1, javascript, ...documento });
}

export function lerDocumento(valor: string): { javascript: string; documento: DocumentoWeb } | null {
  try {
    const dados = JSON.parse(valor);
    if (
      dados?.mundojsWeb !== 1 ||
      typeof dados.javascript !== 'string' ||
      typeof dados.html !== 'string' ||
      typeof dados.css !== 'string'
    )
      return null;
    return { javascript: dados.javascript, documento: { html: dados.html, css: dados.css } };
  } catch {
    return null;
  }
}
