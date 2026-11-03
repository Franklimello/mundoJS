import type { MetadataRoute } from 'next';
import { URL_DO_SITE } from '@/seo/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${URL_DO_SITE}/sitemap.xml`,
  };
}
