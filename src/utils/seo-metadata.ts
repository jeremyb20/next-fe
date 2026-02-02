/* eslint-disable object-shorthand */
// lib/seo-metadata.ts
import { Metadata } from 'next';

import { DOMAIN, HOST_API } from '../config-global';

interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export async function getSeoMetadata(
  pageId: string,
  language: string = 'ES'
): Promise<Metadata> {
  try {
    const response = await fetch(
      `${HOST_API}/api/seo/getSeoByPageId/${pageId}?language=${language}`,
      {
        next: { revalidate: 3600 }, // Cache de 1 hora
      }
    );
    if (!response.ok) {
      throw new Error('SEO data not found');
    }

    const { payload: seoData } = await response.json();

    // Encontrar el contenido en el idioma específico
    const content =
      seoData.multiLanguageContent.find(
        (item: any) => item.language === language
      ) || seoData.multiLanguageContent[0]; // Fallback al primer idioma

    if (!content) {
      return generateDefaultMetadata();
    }

    return generateMetadataFromSeo(content, seoData.route);
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return generateDefaultMetadata();
  }
}

function generateMetadataFromSeo(
  content: SeoMetadata,
  route: string
): Metadata {
  const baseUrl = DOMAIN || 'https://plaquitascr.com';
  const canonical = content.canonicalUrl || `${baseUrl}${route}`;

  // Asegurar que keywords sea un string
  const keywordsString = Array.isArray(content.keywords)
    ? content.keywords.join(', ')
    : content.keywords ||
      'plataforma, mascotas, veterinaria, grooming, eventos, productos para mascotas plaquitas plaquitascr resina aluminio subimable identificacion digital';

  return {
    title: content.title,
    description: content.description,
    keywords: keywordsString,

    // Open Graph
    openGraph: {
      title: content.ogTitle || content.title,
      description: content.ogDescription || content.description,
      url: canonical,
      siteName: 'PlaquitasCR',
      images: [
        {
          url: content.ogImage || `${baseUrl}/assets/images/plaquitascr.png`,
          width: 1200,
          height: 630,
          alt: content.ogTitle || content.title,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: content.ogTitle || content.title,
      description: content.ogDescription || content.description,
      images: [content.ogImage || `${baseUrl}/assets/images/plaquitascr.png`],
      creator: '@PlaquitasCR', // Agrega tu handle de Twitter si tienes
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false, // Cambia a true si no quieres cache
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Alternates (para multiidioma)
    alternates: {
      canonical: canonical,
      // Agrega aquí otros idiomas si los tienes
      // languages: {
      //   'es-ES': canonical,
      //   'en-US': `${baseUrl}/en${route}`,
      // }
    },

    // Icons (importante para SEO)
    icons: {
      icon: [
        { url: '/favicon/favicon.ico' },
        {
          url: '/favicon/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
      ],
      apple: [
        {
          url: '/favicon/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },

    // Manifest
    manifest: '/manifest.json',

    // Verification (si necesitas)
    verification: {
      // google: 'tu-codigo-verificacion-google',
    },

    // Otros metadatos útiles
    applicationName: 'PlaquitasCR',
    referrer: 'origin-when-cross-origin',
    category: 'pets',
    classification: 'pet care platform',
  };
}

function generateDefaultMetadata(): Metadata {
  return {
    title: 'PlaquitasCR - Plataforma para el Cuidado de tus Mascotas',
    description:
      'Gestiona perfiles de mascotas, plaquitas plaquitascr resina aluminio subimable identificacion digital compra productos, agenda servicios veterinarios, grooming y descubre eventos.',
    openGraph: {
      title: 'PlaquitasCR - Todo para tu Mascota 🐾',
      description: 'Plataforma integral para el cuidado de tus mascotas',
      images: ['/assets/images/plaquitascr.png'],
    },
  };
}
