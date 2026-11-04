export const CANAIS_DE_ENTRADA = ['direto', 'youtube', 'instagram', 'tiktok', 'whatsapp', 'google', 'outro'] as const;
export type CanalEntrada = (typeof CANAIS_DE_ENTRADA)[number];
export type PaginaEntrada = 'inicio' | 'comecar';

/** Só devolve categorias fixas. URLs e parâmetros livres nunca fazem parte do evento. */
export function identificarCanal(busca: string, referencia: string, hostnameAtual: string): CanalEntrada {
  const origem = new URLSearchParams(busca).get('utm_source')?.trim().toLowerCase();
  if (origem) {
    const conhecidas: Record<string, CanalEntrada> = {
      youtube: 'youtube',
      yt: 'youtube',
      instagram: 'instagram',
      ig: 'instagram',
      tiktok: 'tiktok',
      whatsapp: 'whatsapp',
      wa: 'whatsapp',
      google: 'google',
      direto: 'direto',
    };
    return Object.hasOwn(conhecidas, origem) ? conhecidas[origem]! : 'outro';
  }
  if (!referencia) return 'direto';
  let host: string;
  try {
    const url = new URL(referencia);
    if (!['http:', 'https:'].includes(url.protocol)) return 'outro';
    host = url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return 'outro';
  }
  if (host === hostnameAtual.toLowerCase().replace(/^www\./, '')) return 'direto';
  const pertence = (dominio: string) => host === dominio || host.endsWith(`.${dominio}`);
  if (pertence('youtube.com') || pertence('youtu.be')) return 'youtube';
  if (pertence('instagram.com')) return 'instagram';
  if (pertence('tiktok.com')) return 'tiktok';
  if (pertence('whatsapp.com') || pertence('wa.me')) return 'whatsapp';
  if (pertence('google.com') || pertence('google.com.br')) return 'google';
  return 'outro';
}
