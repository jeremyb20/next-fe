// app/sitemap.ts
import { MetadataRoute } from 'next';

import { DOMAIN } from '@/config-global';

const baseUrl = DOMAIN;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['es', 'en', 'fr', 'ar', 'vi', 'zh'];

  // Rutas estáticas (todas las que quieres indexar)
  const staticRoutes = [
    { path: '', priority: 1.0, changefreq: 'daily' as const },
    { path: 'about-us', priority: 0.8, changefreq: 'weekly' as const },
    { path: 'contact-us', priority: 0.8, changefreq: 'weekly' as const },
    { path: 'faqs', priority: 0.7, changefreq: 'weekly' as const },
    { path: 'sign-in', priority: 0.6, changefreq: 'monthly' as const },
    { path: 'sign-up', priority: 0.6, changefreq: 'monthly' as const },
  ];

  // Generar URLs para cada idioma y ruta
  const urls = [];
  for (const lang of languages) {
    for (const route of staticRoutes) {
      const urlPath = route.path ? `/${lang}/${route.path}` : `/${lang}`;
      urls.push({
        url: `${baseUrl}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: route.changefreq,
        priority: route.priority,
      });
    }
  }

  // Log opcional (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Sitemap generado: ${urls.length} URLs estáticas`);
  }

  return urls;
}
