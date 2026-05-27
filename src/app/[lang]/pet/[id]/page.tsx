// src/app/[lang]/pets/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { endpoints } from '@/utils/axios';
import { DOMAIN, HOST_API, APP_NAME } from '@/config-global';
import { generatePetMetadata, PetData } from '@/utils/pet-metadata';

import RegistrationPetView from '../_components/view/registration-pet-view';
import PetPublickProfileView from '../_components/view/pet-public-profile-view';

type Props = {
  params: Promise<{ id: string; lang: string }>;
};

async function getPetData(identifier: string) {
  try {
    const response = await fetch(
      `${HOST_API}${endpoints.pet.getPublicProfileById}/${identifier}`,
      {
        next: { revalidate: 3600 },
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        type: 'not_found',
        message: `HTTP ${response.status}`,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return { success: false, type: 'error', message: 'Error de conexión' };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;

  try {
    const data = await getPetData(id);

    // Mascota no encontrada
    if (data.type === 'not_found') {
      return {
        title: 'Mascota no encontrada | Plaquitas CR',
        description:
          'El código o mascota que buscas no existe en nuestra plataforma.',
        robots: { index: false },
        metadataBase: new URL(DOMAIN),
      };
    }

    // QR no registrado
    if (data.type === 'qr_code_unregistered') {
      return {
        title: 'Registra tu Mascota | Plaquitas CR',
        description:
          'Activa este código QR y registra a tu mascota en nuestra plataforma. Protege su información de forma segura.',
        robots: { index: false },
        metadataBase: new URL(DOMAIN),
      };
    }

    // Perfil de mascota encontrado
    if (data.type === 'pet_profile' && data.payload) {
      const pet = data.payload as PetData;

      // Generar metadata dinámica
      const metadata = generatePetMetadata(pet);

      // Ajustes específicos por idioma
      return {
        ...metadata,
        alternates: {
          canonical: `/${lang}/pets/${id}`,
          languages: {
            es: `/${lang}/pets/${id}`,
            en: `/en/pets/${id}`,
          },
        },
      };
    }

    // Fallback genérico
    return {
      title: `Perfil de Mascota | ${APP_NAME}`,
      description: `Información y detalles de la mascota en ${APP_NAME}. Protege a tu mascota con nuestra plataforma.`,
      metadataBase: new URL(DOMAIN),
      robots: { index: true, follow: true },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: `Error | ${APP_NAME}`,
      description: 'Ocurrió un error al cargar el perfil de la mascota.',
      robots: { index: false },
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const data = await getPetData(id);

  if (data.type === 'pet_profile' && data.payload) {
    return <PetPublickProfileView petProfile={data.payload} />;
  }

  if (data.type === 'qr_code_unregistered' && data.qrCode) {
    return <RegistrationPetView registerPet={data} />;
  }

  notFound();
}
