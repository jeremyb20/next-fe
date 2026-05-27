// src/utils/pet-metadata.ts
import { Metadata } from 'next';

import { APP_NAME, DOMAIN, LOGO } from '@/config-global';

import { BreedOptions } from './constants';

export type PetStatus = 'active' | 'inactive' | 'lost' | 'deceased';

export interface PetData {
  petName: string;
  breed?: string; // Este es el value (ej: 'labrador_retriever')
  photo?: string;
  petStatus: PetStatus;
  ownerName?: string;
  ownerPhone?: string;
  lastSeen?: string;
  microchip?: string;
}

// Helper para obtener el nombre legible de la raza
const getBreedLabel = (breedValue?: string): string => {
  if (!breedValue) return '';

  const breedOption = BreedOptions.todos.find(
    (breed) => breed.value === breedValue
  );

  return breedOption?.label || breedValue;
};

// Helper para obtener la descripción de la mascota con su raza
const getPetDescription = (breedValue?: string): string => {
  const breedLabel = getBreedLabel(breedValue);
  if (!breedLabel) return 'mascota';

  return `mascota de raza ${breedLabel}`;
};

interface PetMetadataConfig {
  title: string;
  description: string;
  robots?: {
    index: boolean;
    follow?: boolean;
  };
  openGraph?: {
    title?: string;
    description?: string;
    images?: any[];
  };
  additionalMeta?: Record<string, any>;
}

// Configuración por tipo de estado
const getMetadataByStatus = (pet: PetData): PetMetadataConfig => {
  const baseName = pet.petName;
  const petDescription = getPetDescription(pet.breed);
  const breedLabel = getBreedLabel(pet.breed);

  const statusConfigs: Record<PetStatus, PetMetadataConfig> = {
    active: {
      title: `¡Hola! Me llamo ${baseName} | ${APP_NAME}`,
      description: `🐾 ${baseName} es un ${petDescription} que está activo en nuestra plataforma. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Conoce más sobre esta adorable mascota y mantén segura su información.`,
      robots: { index: true, follow: true },
    },

    inactive: {
      title: `${baseName} | Perfil Temporalmente Inactivo | ${APP_NAME}`,
      description: `ℹ️ El perfil de ${baseName} (${petDescription}) se encuentra temporalmente inactivo. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Para más información, contacta al propietario.`,
      robots: { index: false, follow: true },
    },

    lost: {
      title: `🚨 ¡AYUDA! ${baseName} está Perdido/a | ${APP_NAME}`,
      description: `⚠️ ${baseName} se encuentra EXTRAVIADO desde ${pet.lastSeen || 'recientemente'}. Es un ${petDescription}. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Si lo has visto, contacta al propietario. ¡COMPARTE PARA AYUDAR! 🆘`,
      robots: { index: true, follow: true },
      openGraph: {
        title: `🚨 ¡URGENTE! ${baseName} (${breedLabel || 'Mascota'}) está Perdido/a - ¡Ayuda a encontrarlo!`,
        description: `🔴 ¡ATENCIÓN! ${baseName}, un ${petDescription}, se encuentra perdido. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Comparte esta información para ayudar a reunirlo con su familia. 📢`,
      },
    },

    deceased: {
      title: `🕊️ En memoria de ${baseName} | ${APP_NAME}`,
      description: `🕊️ En recordación de ${baseName}, un querido ${petDescription} ${breedLabel ? `de raza ${breedLabel} ` : ''}que vivió felizmente y dejó huella en nuestros corazones. Descansa en paz. 🌈`,
      robots: { index: false, follow: false },
      openGraph: {
        title: `🕊️ En memoria de ${baseName} | Un ángel que cruzó el arcoíris`,
        description: `Recordamos con cariño a ${baseName}${breedLabel ? `, un hermoso ${breedLabel}` : ''}, una mascota muy especial que siempre vivirá en nuestros corazones. 🌈🐾`,
      },
    },
  };

  return statusConfigs[pet.petStatus] || statusConfigs.active;
};

// Generar palabras clave basadas en la mascota
const generateKeywords = (pet: PetData): string[] => {
  const breedLabel = getBreedLabel(pet.breed);
  const baseKeywords = {
    active: [
      'mascota activa',
      'perfil de mascota',
      'cuidado animal',
      'protección de mascotas',
      'mascota en Costa Rica',
      'mascota en línea',
      'mascota segura',
    ],
    inactive: ['perfil inactivo', 'mascota', 'información pendiente'],
    lost: [
      'mascota perdida',
      'extraviado',
      'búsqueda',
      'ayuda animal',
      'recompensa',
      'animal desaparecido',
      'mascota buscada',
      'ayuda',
    ],
    deceased: [
      'mascota fallecida',
      'recordatorio',
      'memorial',
      'homenaje',
      'arcoíris',
    ],
  };

  const specificKeywords = [
    pet.petName,
    breedLabel,
    `${breedLabel}`,
    APP_NAME,
    'Costa Rica',
    'mascota',
    'animal',
  ].filter(Boolean);

  return [...new Set([...baseKeywords[pet.petStatus], ...specificKeywords])];
};

// Generar metadata completa
export function generatePetMetadata(pet: PetData): Metadata {
  const config = getMetadataByStatus(pet);
  const breedLabel = getBreedLabel(pet.breed);
  const keywords = generateKeywords(pet);

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    metadataBase: new URL(DOMAIN),
    robots: config.robots,
    keywords: keywords.join(', '),
    authors: pet.ownerName ? [{ name: pet.ownerName }] : undefined,
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      type: 'profile',
      images: pet.photo
        ? [
            {
              url: pet.photo,
              alt: `${pet.petName} - ${breedLabel || 'Mascota'} - ${pet.petStatus === 'active' ? 'Mascota Activa' : pet.petStatus === 'lost' ? 'Mascota Perdida' : 'Mascota'}`,
              width: 1200,
              height: 630,
            },
          ]
        : [{ url: LOGO, alt: APP_NAME }],
      ...(pet.petStatus === 'lost' && {
        determiner: 'auto',
        locale: 'es_CR',
        siteName: APP_NAME,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: pet.photo ? [pet.photo] : [LOGO],
    },
    alternates: {
      canonical: `/pets/${pet.microchip || pet.petName}`,
    },
  };

  // Añadir meta tags adicionales para casos especiales
  if (pet.petStatus === 'lost') {
    metadata.other = {
      'og:availability': 'lost',
      'og:contact:phone': pet.ownerPhone || '',
      'og:pet:breed': breedLabel || 'Mascota',
      'og:pet:name': pet.petName,
      'last-modified': new Date().toISOString(),
      priority: 'high',
    };
  }

  if (pet.petStatus === 'deceased') {
    metadata.other = {
      'og:type': 'memorial',
      'og:availability': 'deceased',
      'og:pet:name': pet.petName,
      'og:pet:breed': breedLabel || 'Mascota',
    };
  }

  // Añadir schema.org structured data para mejor SEO
  if (pet.petStatus === 'active' || pet.petStatus === 'lost') {
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': pet.petStatus === 'lost' ? 'LostPet' : 'Pet',
      name: pet.petName,
      ...(breedLabel && { breed: breedLabel }),
      status: pet.petStatus,
      ...(pet.photo && { image: pet.photo }),
      ...(pet.ownerName && {
        owner: { '@type': 'Person', name: pet.ownerName },
      }),
    };

    metadata.other = {
      ...metadata.other,
      'application/ld+json': JSON.stringify(schemaData),
    };
  }

  return metadata;
}

// Generar título SEO-friendly
export function generateSeoTitle(pet: PetData): string {
  const emoji = {
    active: '🐾',
    inactive: '💤',
    lost: '🚨',
    deceased: '🕊️',
  };

  const prefix = {
    active: '',
    inactive: '💤 Perfil Inactivo | ',
    lost: '🚨 ¡URGENTE! ',
    deceased: '🕊️ En memoria de ',
  };

  const breedLabel = getBreedLabel(pet.breed);
  const breedInfo = breedLabel ? ` (${breedLabel})` : '';

  return `${emoji[pet.petStatus]} ${prefix[pet.petStatus]}${pet.petName}${breedInfo} | ${APP_NAME}`;
}

// Generar description SEO-friendly
export function generateSeoDescription(pet: PetData): string {
  const breedLabel = getBreedLabel(pet.breed);
  const petDescription = getPetDescription(pet.breed);

  const descriptions = {
    active: `Conoce a ${pet.petName}, un adorable ${petDescription}. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Perfil verificado en ${APP_NAME}. ¡Protege a tu mascota con nosotros!`,
    inactive: `${pet.petName} es un ${petDescription} cuyo perfil está temporalmente inactivo. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Contacta al propietario para más información.`,
    lost: `🚨 ${pet.petName} está PERDIDO. ${breedLabel ? `Raza: ${breedLabel}. ` : ''}Es un ${petDescription}. Si tienes información, contacta al propietario. ¡Ayuda a reunir esta familia! 🆘`,
    deceased: `🕊️ ${pet.petName} fue un querido ${petDescription} ${breedLabel ? `de raza ${breedLabel} ` : ''}que vivió felizmente. Su recuerdo permanece en nuestros corazones. 🌈🐾`,
  };

  return descriptions[pet.petStatus];
}

// Helper para obtener breed label (exportado para usar en otros componentes)
export const getPetBreedLabel = (breedValue?: string): string => {
  if (!breedValue) return '';
  const breedOption = BreedOptions.todos.find(
    (breed) => breed.value === breedValue
  );
  return breedOption?.label || breedValue;
};

// Helper para obtener la descripción completa de la mascota
export const getPetFullDescription = (pet: PetData): string => {
  const breedLabel = getBreedLabel(pet.breed);
  if (breedLabel) {
    return `${pet.petName} es un ${breedLabel}`;
  }
  return `${pet.petName} es una mascota`;
};
