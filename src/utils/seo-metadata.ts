// lib/seo-metadata.ts
import { Metadata } from 'next';

import { HOST_API } from '../config-global';

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://plaquitascr.com';
  const canonical = content.canonicalUrl || `${baseUrl}${route}`;

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords?.join(', '),

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
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Alternates (para multiidioma)
    alternates: {
      // eslint-disable-next-line object-shorthand
      canonical: canonical,
    },

    // Verification (si necesitas)
    verification: {
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },

    // Otros metadatos
    category: 'pets',
    classification: 'pet care platform',
  };
}

function generateDefaultMetadata(): Metadata {
  return {
    title: 'PlaquitasCR - Plataforma para el Cuidado de tus Mascotas',
    description:
      'Gestiona perfiles de mascotas, compra productos, agenda servicios veterinarios, grooming y descubre eventos.',
    openGraph: {
      title: 'PlaquitasCR - Todo para tu Mascota 🐾',
      description: 'Plataforma integral para el cuidado de tus mascotas',
      images: ['/assets/images/plaquitascr.png'],
    },
  };
}
