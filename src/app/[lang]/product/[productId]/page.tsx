import { Metadata } from 'next';

import { paths } from '@/routes/paths';
import { endpoints } from '@/utils/axios';
import NotFoundPage from '@/app/not-found';
import { IProductItem } from '@/types/product';
import { DOMAIN, HOST_API } from '@/config-global';
import { ProductShopDetailsView } from '@/sections/product/view';

// Tipos necesarios - ajustados según tu API
interface ProductApiResponse {
  success: boolean;
  message?: string;
  payload?: IProductItem;
}

type Props = {
  params: Promise<{
    productId: string;
  }>;
};

async function getProductData(productId: string): Promise<ProductApiResponse> {
  try {
    const response = await fetch(
      `${HOST_API}${endpoints.petsmarket.getProductPublishedById}?id=${productId}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          message: 'Producto no encontrado',
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product data:', error);
    return {
      success: false,
      message: 'Error al conectar con el servidor',
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params; // ← AWAIT aquí

  try {
    const data = await getProductData(productId);

    if (!data.success || !data.payload) {
      return {
        title: 'Producto No Encontrado | Tu Tienda',
        description: 'El producto que buscas no está disponible.',
        metadataBase: new URL(DOMAIN),
      };
    }

    const product = data.payload;
    const priceFormatted = `$${product.price.toFixed(2)}`;
    const baseTitle = `${product.name} | Tu Tienda`;
    const description =
      product.description ||
      product.subDescription ||
      `Compra ${product.name} por solo ${priceFormatted}. ${product.available} disponibles.`;

    const canonicalUrl = `${DOMAIN}${paths.dashboard.product.details}/${productId}`;
    const images = product.coverUrl
      ? [
          {
            url: product.coverUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ]
      : [];

    return {
      title: baseTitle,
      description: description,
      metadataBase: new URL(DOMAIN),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: baseTitle,
        description: description,
        images: images,
        type: 'website',
        url: canonicalUrl,
        siteName: 'Tu Tienda',
      },
      twitter: {
        card: 'summary_large_image',
        title: baseTitle,
        description: description,
        images: product.coverUrl ? [product.coverUrl] : [],
      },
      other: {
        'og:price:amount': product.price.toString(),
        'og:price:currency': 'USD',
        'product:availability':
          product.available > 0 ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        'product:brand': 'Tu Tienda',
      },
    };
  } catch (error) {
    return {
      title: 'Error | Tu Tienda',
      description: `Ocurrió un error al cargar la información del producto. ${
        error instanceof Error ? error.message : 'Error desconocido.'
      }`,
      metadataBase: new URL(DOMAIN),
    };
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { productId } = await params; // ← AWAIT aquí también
  const data = await getProductData(productId);

  if (data.success && data.payload) {
    return <ProductShopDetailsView id={productId} product={data.payload} />;
  }

  return <NotFoundPage />;
}
