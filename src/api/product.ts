import useSWR from 'swr';
import { useMemo } from 'react';
import { IProductItem } from '@/types/product';
import { fetcher, endpoints } from '@/utils/axios';
import { UserQueryParams } from '@/hooks/use-fetch-paginated';

// ----------------------------------------------------------------------

export function useGetProducts(params: Partial<UserQueryParams> = {}) {
  // Construir URL con parámetros
  const buildUrl = () => {
    const queryParams = new URLSearchParams();

    // Agregar todos los parámetros como query params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item.toString()));
        } else if (value instanceof Date) {
          queryParams.append(key, value.toISOString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const queryString = queryParams.toString();
    return queryString
      ? `${endpoints.admin.product.list}?${queryString}`
      : endpoints.admin.product.list;
  };

  const URL: string = buildUrl();

  const { data, isLoading, error, isValidating, mutate } = useSWR(
    URL,
    fetcher,
    {
      // Opciones de SWR para mejor manejo de caché
      revalidateOnFocus: true, // Revalidar cuando la ventana recupera foco
      revalidateOnReconnect: true, // Revalidar al reconectar
      keepPreviousData: true, // Mantener datos anteriores mientras carga nuevos
    }
  );

  const memoizedValue = useMemo(
    () => ({
      products: (data?.payload as IProductItem[]) || [],
      productsPagination: data?.pagination || null,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.payload?.length,
      mutate, // Exponer mutate para invalidación manual
    }),
    [data?.pagination, data?.payload, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
export function useGetProductsPublished() {
  const URL = endpoints.petsmarket.listPublished;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.payload as IProductItem[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.payload.length,
    }),
    [data?.payload, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId: string) {
  const URL = productId
    ? [
        endpoints.petsmarket.getProductPublishedById,
        { params: { id: productId } },
      ]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.payload as IProductItem,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.payload, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query: string) {
  const URL = query
    ? [endpoints.user.searchProducts, { params: { query } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: (data?.payload as IProductItem[]) || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.payload.length,
    }),
    [data?.payload, error, isLoading, isValidating]
  );

  return memoizedValue;
}
