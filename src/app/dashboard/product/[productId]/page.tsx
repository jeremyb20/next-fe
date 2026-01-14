/* eslint-disable object-shorthand */
import { Metadata } from 'next';
import { paths } from '@/src/routes/paths';
import { endpoints } from '@/src/utils/axios';
import NotFoundPage from '@/src/app/not-found';
import { IProductItem } from '@/src/types/product';
import { DOMAIN, HOST_API } from '@/src/config-global';
import { ProductShopDetailsView } from '@/src/sections/product/view';

// Tipos necesarios - ajustados según tu API
interface ProductApiResponse {
  success: boolean;
  message?: string;
  payload?: IProductItem; // Esto contiene tu producto
}

type Props = {
  params: {
    productId: string;
  };
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
      // Si el status es 404, devolvemos un not_found
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
  const { productId } = params;

  try {
    const data = await getProductData(productId);

    // Si no se encuentra el producto
    if (!data.success || !data.payload) {
      return {
        title: 'Producto No Encontrado | Tu Tienda',
        description: 'El producto que buscas no está disponible.',
        metadataBase: new URL(DOMAIN),
      };
    }

    // Si es un producto válido
    const product = data.payload;

    // Precios formateados
    const priceFormatted = `$${product.price.toFixed(2)}`;
    const priceSaleFormatted = product.priceSale
      ? `$${product.priceSale.toFixed(2)}`
      : null;

    // Título y descripción
    const baseTitle = `${product.name} | Tu Tienda`;
    const description =
      product.description ||
      product.subDescription ||
      `Compra ${product.name} por solo ${priceFormatted}. ${product.available} disponibles.`;

    // URL canónica - ajusta según tu estructura de rutas
    const canonicalUrl = `${DOMAIN}${paths.dashboard.product.details}/${productId}`;

    // Array de imágenes para Open Graph
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
      // Open Graph para Facebook y WhatsApp
      openGraph: {
        title: baseTitle,
        description: description,
        images: images,
        type: 'website', // Usamos 'website' que es compatible
        url: canonicalUrl,
        siteName: 'Tu Tienda',
      },
      // Twitter Cards
      twitter: {
        card: 'summary_large_image',
        title: baseTitle,
        description: description,
        images: product.coverUrl ? [product.coverUrl] : [],
      },
      // Propiedades adicionales para WhatsApp
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
      description: 'Ocurrió un error al cargar la información del producto.',
      metadataBase: new URL(DOMAIN),
    };
  }
}

export default async function ProductDetailsPage({ params }: Props) {
  const { productId } = params;
  const data = await getProductData(productId);

  // Si es un producto válido
  if (data.success && data.payload) {
    return <ProductShopDetailsView id={productId} product={data.payload} />;
  }

  // Si no se encuentra
  return <NotFoundPage />;
}
