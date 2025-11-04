/* eslint-disable object-shorthand */
import { Metadata } from 'next';
import { endpoints } from '@/src/utils/axios';
import { IPetProfile } from '@/src/types/api';
import NotFoundPage from '@/src/app/error/404/page';
import { DOMAIN, HOST_API } from '@/src/config-global';
import PetProfileView from '@/src/app/pet/_components/view/pet-profile-view';

type Props = {
  params: {
    id: string;
  };
};

interface PetApiResponse {
  success: boolean;
  payload?: IPetProfile | null;
  qrCode?: any;
  type: 'pet_profile' | 'qr_code_unregistered' | 'not_found';
  msg?: string;
}

async function getPetData(identifier: string): Promise<PetApiResponse> {
  try {
    const response = await fetch(
      `${HOST_API}${endpoints.pet.getProfileById}/${identifier}`,
      {
        cache: 'no-store', // ← Esto es clave
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching pet data:', error);
    return {
      success: false,
      type: 'not_found',
      msg: 'Error al conectar con el servidor',
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;

  try {
    const data = await getPetData(id);

    const pet = data.payload;
    if (data.type === 'not_found') {
      return {
        title: 'No Encontrado | Plaquitas CR',
        description: 'El código o mascota que buscas no existe.',
        metadataBase: new URL(DOMAIN),
      };
    }

    if (data.type === 'pet_profile' && data.payload) {
      const baseTitle = `¡Hola! Me llamo ${pet?.petName} | Plaquitas CR`;
      const description = `Para conocer todos los detalles de ${pet?.petName} visita mi perfil en este link. 👆`;

      return {
        title: baseTitle,
        description: description,
        metadataBase: new URL(DOMAIN),
        alternates: {
          canonical: `/pets/${id}`,
        },
        openGraph: {
          title: baseTitle,
          description: description,
          images: pet?.photo ? [{ url: pet.photo }] : [],
          type: 'profile',
          url: `${DOMAIN}/pets/${id}`,
        },
        twitter: {
          card: 'summary_large_image',
          title: baseTitle,
          description: description,
          images: pet?.photo ? [pet.photo] : [],
        },
      };
    }

    // Metadata para QR no registrado
    if (data.type === 'qr_code_unregistered') {
      return {
        title: 'Registra tu Mascota | Plaquitas CR',
        description:
          'Activa tu código QR y registra a tu mascota en nuestra plataforma.',
        metadataBase: new URL(DOMAIN),
      };
    }

    return {
      title: 'Plataforma de Mascotas | Plaquitas CR',
      description: 'Gestiona y protege la información de tu mascota.',
      metadataBase: new URL(DOMAIN),
    };
  } catch (error) {
    return {
      title: 'Error | Plaquitas CR',
      description: 'Ocurrió un error al cargar la información.',
      metadataBase: new URL(DOMAIN),
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = params;
  const data = await getPetData(id);

  // Si es perfil de mascota (QR ya convertido)
  if (data.type === 'pet_profile' && data.payload) {
    return <PetProfileView petProfile={data.payload} canEdit />;
  }

  // // Si es código QR no registrado
  // if (data.type === 'qr_code_unregistered' && data.qrCode) {
  //   // return <RegistrationPetView qrCode={data.qrCode} identifier={id} />;
  //   return <RegistrationPetView />;
  // }

  // Si no se encuentra nada
  return <NotFoundPage />;
}
