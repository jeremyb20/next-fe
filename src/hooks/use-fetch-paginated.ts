import axiosInstance, { endpoints } from '@/src/utils/axios';
import {
  useQuery,
  UseQueryOptions,
  keepPreviousData,
} from '@tanstack/react-query';
import {
  ISeo,
  IUser,
  IQrCode,
  ApiResponse,
  QueryParams,
  IPetProfile,
  UsePaginatedOptions,
} from '@/src/types/api';

interface UsePaginatedQueryProps<T> {
  queryKey: string | string[];
  endpoint: string;
  params?: Partial<QueryParams>;
  options?: UsePaginatedOptions;
  transformResponse?: (data: any) => T;
}

export const useFetchPaginated = <T>({
  queryKey,
  endpoint,
  params = {},
  options = {},
  transformResponse,
}: UsePaginatedQueryProps<T>) => {
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

    // Agregar todos los parámetros como query params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) =>
            url.searchParams.append(key, item.toString())
          );
        } else if (value instanceof Date) {
          url.searchParams.append(key, value.toISOString());
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });

    return url.toString();
  };

  const queryFn = async (): Promise<ApiResponse<T>> => {
    const url = buildUrl();

    const response = await axiosInstance({
      method: 'GET',
      url: url.replace(window.location.origin, ''),
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error fetching data');
    }

    const responseData = response.data;

    // Aplicar transformación si se proporciona
    if (transformResponse) {
      responseData.payload = transformResponse(responseData.payload);
    }

    return responseData;
  };

  const queryOptions: UseQueryOptions<ApiResponse<T>, Error> = {
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, params]
      : [queryKey, params],
    queryFn,
    placeholderData,
    refetchOnMount,
    refetchOnWindowFocus,
    staleTime,
    retry,
    enabled: enabled && params.page !== undefined,
  };

  return useQuery<ApiResponse<T>, Error>(queryOptions);
};

export interface UserFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  userState?: string;
  petStatus?: string;
}

export type UserQueryParams = QueryParams & UserFilters;

export const useGetAllRegisteredUsers = (
  params: Partial<UserQueryParams> = {}
) =>
  useFetchPaginated<IUser[]>({
    queryKey: ['users'],
    endpoint: endpoints.admin.users.getAllRegisteredUsers,
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });

export const useGetAllPetsByUser = (params: Partial<UserQueryParams> = {}) =>
  useFetchPaginated<IPetProfile[]>({
    queryKey: ['getAllPetsByUser'],
    endpoint: endpoints.user.getAllPetsByUser,
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });

export const useGetAllQrCodeList = (params: Partial<UserQueryParams> = {}) =>
  useFetchPaginated<IQrCode[]>({
    queryKey: ['qrcode'],
    endpoint: endpoints.admin.qrcode.list,
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });

export const useGetAllSeo = (params: Partial<UserQueryParams> = {}) =>
  useFetchPaginated<ISeo[]>({
    queryKey: ['seo'],
    endpoint: endpoints.admin.seo.list,
    params: {
      page: 1,
      limit: 10,
      ...params,
    },
  });
