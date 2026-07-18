// lib/seo-metadata.ts
import { Metadata } from 'next';

import { APP_NAME, DOMAIN, HOST_API } from '../config-global';

interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

interface SeoData {
  payload: {
    route: string;
    multiLanguageContent: Array<SeoMetadata & { language: string }>;
  };
}

// Mapeo de idiomas para Open Graph locale
const localeMap: Record<string, string> = {
  ES: 'es_ES',
  EN: 'en_US',
  AR: 'ar_AR',
  VI: 'vi_VN',
  ZH: 'zh_CN',
  FR: 'fr_FR',
};

// Mapeo de idiomas para URLs alternas y rutas
const languagePathMap: Record<string, string> = {
  ES: '',
  EN: 'en',
  AR: 'ar',
  VI: 'vi',
  ZH: 'zh',
  FR: 'fr',
};

// Dirección del texto por idioma (para RTL)
const textDirectionMap: Record<string, 'ltr' | 'rtl'> = {
  ES: 'ltr',
  EN: 'ltr',
  AR: 'rtl', // Árabe es RTL
  VI: 'ltr',
  ZH: 'ltr',
  FR: 'ltr',
};

// ✅ Nuevo: Mapeo de idiomas para hreflang (formato ISO)
const hreflangMap: Record<string, string> = {
  ES: 'es',
  EN: 'en',
  AR: 'ar',
  VI: 'vi',
  ZH: 'zh',
  FR: 'fr',
};

export async function getSeoMetadata(
  pageId: string,
  language: string = 'ES'
): Promise<Metadata> {
  try {
    // Normalizar el idioma a mayúsculas para la API
    const normalizedLanguage = language.toUpperCase();

    // Validar que el idioma esté soportado
    if (!Object.keys(languagePathMap).includes(normalizedLanguage)) {
      console.warn(
        `Language ${normalizedLanguage} not supported, falling back to ES`
      );
      return generateDefaultMetadata('ES');
    }

    const response = await fetch(
      `${HOST_API}/api/seo/getSeoByPageId/${pageId}?language=${normalizedLanguage}`,
      {
        next: { revalidate: 3600 }, // Cache de 1 hora
      }
    );

    if (!response.ok) {
      console.warn(
        `SEO data not found for pageId: ${pageId}, language: ${normalizedLanguage}`
      );
      return generateDefaultMetadata(normalizedLanguage);
    }

    const seoData: SeoData = await response.json();

    // Encontrar el contenido en el idioma específico
    const content =
      seoData.payload.multiLanguageContent.find(
        (item) => item.language === normalizedLanguage
      ) || seoData.payload.multiLanguageContent[0];

    if (!content) {
      console.warn(`No content found for language: ${normalizedLanguage}`);
      return generateDefaultMetadata(normalizedLanguage);
    }

    return generateMetadataFromSeo(
      content,
      seoData.payload.route,
      normalizedLanguage
    );
  } catch (error) {
    console.error('Error fetching SEO metadata:', error);
    return generateDefaultMetadata(language);
  }
}

function generateMetadataFromSeo(
  content: SeoMetadata,
  route: string,
  currentLanguage: string
): Metadata {
  const baseUrl = DOMAIN || 'https://plaquitascr.com';

  // ✅ Asegurar que baseUrl no tenga trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

  // Construir la URL canónica con el idioma correspondiente
  const languagePath = languagePathMap[currentLanguage] || '';

  // ✅ Si content.canonicalUrl existe, usarlo; sino construirla
  let canonicalUrl = content.canonicalUrl;

  if (!canonicalUrl) {
    // Construir la URL canónica
    const pathWithLang = languagePath ? `/${languagePath}` : '';
    canonicalUrl = `${cleanBaseUrl}${pathWithLang}${route}`;
  }

  // ✅ Asegurar que canonicalUrl sea absoluta y sin trailing slash
  canonicalUrl = canonicalUrl.replace(/\/+$/, '');

  // Asegurar que keywords sea un string
  const keywordsString = Array.isArray(content.keywords)
    ? content.keywords.join(', ')
    : content.keywords || getDefaultKeywords(currentLanguage);

  // ✅ Generar URLs alternas para todos los idiomas (hreflang)
  const languages: Record<string, string> = {};

  // Agregar todas las variantes de idioma
  Object.entries(languagePathMap).forEach(([lang, path]) => {
    const langKey = hreflangMap[lang] || lang.toLowerCase();
    const pathWithLang = path ? `/${path}` : '';
    languages[langKey] = `${cleanBaseUrl}${pathWithLang}${route}`.replace(
      /\/+$/,
      ''
    );
  });

  // ✅ Eliminar la URL actual de languages (no es necesario incluirla)
  const currentLangKey =
    hreflangMap[currentLanguage] || currentLanguage.toLowerCase();
  delete languages[currentLangKey];

  // Metadatos específicos para RTL
  const isRTL = textDirectionMap[currentLanguage] === 'rtl';

  // ✅ Asegurar que la imagen OG sea absoluta
  const ogImageUrl = content.ogImage?.startsWith('http')
    ? content.ogImage
    : `${cleanBaseUrl}${content.ogImage || '/assets/images/plaquitascr.png'}`;

  return {
    // ✅ Configurar metadataBase para resolver URLs relativas
    metadataBase: new URL(cleanBaseUrl),

    title: content.title,
    description: content.description,
    keywords: keywordsString,

    // ✅ Alternates (para multiidioma) - FORMA CORRECTA
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },

    // Open Graph con locale específico
    openGraph: {
      title: content.ogTitle || content.title,
      description: content.ogDescription || content.description,
      url: canonicalUrl,
      siteName: APP_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: content.ogTitle || content.title,
        },
      ],
      locale: localeMap[currentLanguage] || 'es_ES',
      type: 'website',
      // ✅ Agregar URLs alternas para Open Graph
      ...(Object.keys(languages).length > 0 && {
        alternateLocale: Object.keys(languages).map((key) => {
          // Convertir hreflang a locale (ej: 'es' -> 'es_ES')
          const langCode = key.split('-')[0].toUpperCase();
          return localeMap[langCode] || key;
        }),
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: content.ogTitle || content.title,
      description: content.ogDescription || content.description,
      images: [ogImageUrl],
      creator: '@PlaquitasCR',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Icons
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

    // Otros metadatos útiles
    applicationName: 'PlaquitasCR',
    referrer: 'origin-when-cross-origin',
    category: 'pets',
    classification: 'pet care platform',

    // Metadatos adicionales para SEO internacional
    other: {
      'og:locale:alternate': Object.values(localeMap).join(', '),
      ...(isRTL && { 'html-direction': 'rtl' }),
    },
  };
}

// ✅ Función auxiliar para obtener el código hreflang
function getHreflangKey(lang: string): string {
  const map: Record<string, string> = {
    ES: 'es',
    EN: 'en',
    AR: 'ar',
    VI: 'vi',
    ZH: 'zh',
    FR: 'fr',
  };
  return map[lang] || lang.toLowerCase();
}

// ✅ Función auxiliar para obtener el código de idioma para alternates (formato ISO)
function getLanguageCodeForAlternate(lang: string): string {
  const map: Record<string, string> = {
    ES: 'es-ES',
    EN: 'en-US',
    AR: 'ar-AR',
    VI: 'vi-VN',
    ZH: 'zh-CN',
    FR: 'fr-FR',
  };
  return map[lang] || `${lang.toLowerCase()}-${lang}`;
}

function getDefaultKeywords(language: string): string {
  const keywordsMap: Record<string, string> = {
    ES: 'plataforma, mascotas, veterinaria, grooming, eventos, productos para mascotas, plaquitas, plaquitascr, resina, aluminio, subimable, identificacion digital',
    EN: 'platform, pets, veterinary, grooming, events, pet products, plaquitas, plaquitascr, resin, aluminum, subimable, digital identification',
    AR: 'منصة, حيوانات أليفة, عيادة بيطرية, تنظيف, أحداث, منتجات للحيوانات الأليفة, بلاكيتاس, راتنج, ألومنيوم, تعريف رقمي',
    VI: 'nền tảng, thú cưng, thú y, chải lông, sự kiện, sản phẩm cho thú cưng, plaquitas, nhựa, nhôm, nhận dạng kỹ thuật số',
    ZH: '平台, 宠物, 兽医, 美容, 活动, 宠物产品, plaquitas, 树脂, 铝, 数字识别',
    FR: 'plateforme, animaux de compagnie, vétérinaire, toilettage, événements, produits pour animaux, plaquitas, résine, aluminium, identification numérique',
  };
  return keywordsMap[language] || keywordsMap.ES;
}

function generateDefaultMetadata(language: string = 'ES'): Metadata {
  const baseUrl = DOMAIN || 'https://plaquitascr.com';
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

  const titles: Record<string, string> = {
    ES: 'PlaquitasCR - Plataforma para el cuidado de tus mascotas',
    EN: 'PlaquitasCR - Platform for Your Pet Care',
    AR: 'PlaquitasCR - منصة لرعاية حيواناتك الأليفة',
    VI: 'PlaquitasCR - Nền tảng Chăm sóc Thú cưng của Bạn',
    ZH: 'PlaquitasCR - 您的宠物护理平台',
    FR: 'PlaquitasCR - Plateforme pour le Soin de vos Animaux',
  };

  const descriptions: Record<string, string> = {
    ES: 'Gestiona perfiles de mascotas, plaquitas personalizadas, compra productos, agenda servicios veterinarios, grooming y descubre eventos.',
    EN: 'Manage pet profiles, custom tags, buy products, schedule veterinary services, grooming and discover events.',
    AR: 'إدارة ملفات الحيوانات الأليفة، العلامات المخصصة، شراء المنتجات، جدولة الخدمات البيطرية، تنظيف واكتشاف الأحداث.',
    VI: 'Quản lý hồ sơ thú cưng, thẻ tùy chỉnh, mua sản phẩm, lên lịch dịch vụ thú y, chải lông và khám phá sự kiện.',
    ZH: '管理宠物档案，定制标签，购买产品，安排兽医服务，美容和发现活动。',
    FR: "Gérez les profils d'animaux, étiquettes personnalisées, achetez des produits, planifiez des services vétérinaires, toilettage et découvrez des événements.",
  };

  const title = titles[language] || titles.ES;
  const description = descriptions[language] || descriptions.ES;

  return {
    metadataBase: new URL(cleanBaseUrl),
    title,
    description,
    alternates: {
      canonical: `${cleanBaseUrl}/${language.toLowerCase()}`,
    },
    openGraph: {
      title,
      description,
      url: `${cleanBaseUrl}/${language.toLowerCase()}`,
      images: [`${cleanBaseUrl}/assets/images/plaquitascr.png`],
    },
  };
}

// ✅ Exportar utilidades para usar en páginas específicas
export { getHreflangKey, getLanguageCodeForAlternate, languagePathMap };
