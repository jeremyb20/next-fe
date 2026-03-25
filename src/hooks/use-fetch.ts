import axiosInstance, { endpoints } from '@/utils/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  IQRStats,
  IPetStats,
  ApiResponse,
  IPetProfile,
  QueryOptions,
  NotificationData,
  IUserSettingsResponse,
} from '@/types/api';

import { useAuthContext } from '../auth/hooks';

export const useFetch = <T>(
  queryKey: string | string[],
  endpoint: string,
  options?: QueryOptions
) => {
  const {
    refetchOnMount = true,
    refetchOnWindowFocus = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = 2,
    enabled = true,
    placeholderData = keepPreviousData,
  } = options || {};

  return useQuery<T, Error>({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: async (): Promise<T> => {
      const response = await axiosInstance.get<ApiResponse<T>>(endpoint);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error fetching data');
      }

      return response.data.payload;
    },
    placeholderData,
    refetchOnMount,
    refetchOnWindowFocus,
    staleTime,
    retry,
    enabled,
  });
};

export const useFetchGetNotifications = () => {
  const { authenticated } = useAuthContext();
  return useFetch<NotificationData[]>(
    'NotificationData',
    endpoints.notification.notifications,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetQRStats = () => {
  const { authenticated } = useAuthContext();
  return useFetch<IQRStats[]>(
    'useGetQRStats',
    endpoints.admin.qrcode.getStats,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetUserPetStats = () => {
  const { authenticated } = useAuthContext();
  return useFetch<IPetStats>('useGetQRStats', endpoints.pet.getUserPetStats, {
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: authenticated,
  });
};

export const useGetPetProfileById = (identifier: string | undefined) =>
  useFetch<IPetProfile>(
    'useGetPetProfileById',
    `${endpoints.pet.getProfileById}/${identifier}`,
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 0, // Siempre refrescar al volver
      gcTime: 5 * 60 * 1000, // Mantener en caché 5 minutos
    }
  );

export const getValidationCode = async (code: string) => {
  const response = await axiosInstance.get(
    `${endpoints.user.validateQrCode}?code=${code}`
  );
  return response.data;
};

export const useGetUserSettings = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<IUserSettingsResponse>>(
    'useGetUserSettings',
    endpoints.user.getSettings,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetUserStats = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetUserStats',
    endpoints.admin.users.getUserStats,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetUserGrowth = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetUserGrowth',
    endpoints.admin.users.getUserGrowth,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetPetStats = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetPetStats',
    endpoints.admin.users.getPetStats,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetPetGrowth = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetPetGrowth',
    endpoints.admin.users.getPetGrowth,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetAdminProductStats = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetAdminProductStats',
    endpoints.admin.product.getAdminProductStats,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};

export const useGetProductGrowth = () => {
  const { authenticated } = useAuthContext();
  return useFetch<Partial<any>>(
    'useGetProductGrowth',
    endpoints.admin.product.getProductGrowth,
    {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      enabled: authenticated,
    }
  );
};
