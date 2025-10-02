import axiosInstance, { endpoints } from '@/src/utils/axios';
import { IUser, ApiResponse, QueryOptions } from '@/src/types/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

export const useFetchPaginated = <T>(
  queryKey: string | string[],
  endpoint: string,
  page?: number,
  limit?: number,
  options?: QueryOptions
) => {
  const {
    refetchOnMount = false,
    refetchOnWindowFocus = false,
    staleTime = 5 * 60 * 1000,
    retry = 2,
    enabled = true,
    placeholderData = keepPreviousData,
  } = options || {};

  // Construir URL con parámetros de paginación como query params
  const buildUrl = () => {
    const url = new URL(endpoint, window.location.origin);
    if (page !== undefined) url.searchParams.append('page', page.toString());
    if (limit !== undefined) url.searchParams.append('limit', limit.toString());
    return url.toString();
  };

  return useQuery<ApiResponse<T>, Error>({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, page, limit]
      : [queryKey, page, limit],
    queryFn: async (): Promise<ApiResponse<T>> => {
      const url = buildUrl();

      // Usar axiosInstance en lugar de axiosInstance.get directamente
      const response = await axiosInstance({
        method: 'GET',
        url: url.replace(window.location.origin, ''), // Remover el origin base ya que axiosInstance ya tiene baseURL
      });

      // O alternativamente, si prefieres el approach directo:
      // const response = await axiosInstance.get(url.replace(window.location.origin, ''));

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error fetching data');
      }

      return {
        payload: response.data.payload,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        total: response.data.total || 0,
        success: response.data.success,
        message: response.data.message,
      };
    },
    placeholderData,
    refetchOnMount,
    refetchOnWindowFocus,
    staleTime,
    retry,
    enabled: enabled && page !== undefined,
  });
};
export const useGetAllRegisteredUsers = (page?: number, limit?: number) =>
  useFetchPaginated<IUser[]>(
    ['getAllRegisteredUsers'],
    endpoints.admin.getAllRegisteredUsers,
    page,
    limit
  );
