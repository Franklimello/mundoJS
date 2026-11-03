import type { MetadataRoute } from 'next';
import { todasAsLicoes, trilhas } from '@/conteudo';
import { trilhaGratuita } from '@/conta/planos';
import { URL_DO_SITE } from '@/seo/site';

/** Somente páginas públicas: atividades Pro, contas e links compartilhados ficam fora. */
export default function sitemap(): MetadataRoute.Sitemap {
  const caminhos = [
    '',
    '/trilhas',
    '/projetos',
    '/planos',
    '/rascunho',
    ...trilhas.map((trilha) => `/trilhas/${trilha.slug}`),
    ...trilhas
      .filter((trilha) => trilhaGratuita(trilha.slug))
      .flatMap((trilha) => todasAsLicoes(trilha).map((licao) => `/trilhas/${trilha.slug}/${licao.slug}`)),
  ];
  return caminhos.map((caminho) => ({ url: `${URL_DO_SITE}${caminho}` }));
}
