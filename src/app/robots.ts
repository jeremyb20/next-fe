// app/robots.ts
import { MetadataRoute } from 'next';

import { DOMAIN } from '@/config-global';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = DOMAIN || 'https://plaquitascr.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // APIs internas
          '/_next/', // Archivos internos de Next.js
          // '/sign-in', // Páginas de autenticación
          // '/sign-up', // Páginas de registro
          '/reset-password', // Recuperación de contraseña (si existe)
          '/verify-email', // Verificación de email (si existe)
          '/dashboard', // Panel de usuario (privado)
          '/profile', // Perfil de usuario (privado)
          '/settings', // Configuraciones (privado)
        ],
      },
      // Opcional: Reglas específicas para Googlebot
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
      // Opcional: Bloquear bots maliciosos conocidos
      {
        userAgent: 'GPTBot', // OpenAI
        disallow: '/',
      },
      {
        userAgent: 'CCBot', // Common Crawl
        disallow: '/',
      },
      {
        userAgent: 'ImagesiftBot', // AI training
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // Opcional: Múltiples sitemaps si tienes muchos contenidos
    // sitemap: [
    //   `${baseUrl}/sitemap.xml`,
    //   `${baseUrl}/sitemap-pets.xml`,
    //   `${baseUrl}/sitemap-static.xml`,
    // ],
    host: baseUrl, // Sugerencia opcional para algunos buscadores
  };
}
