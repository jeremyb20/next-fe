import axiosInstance, { endpoints } from '@/src/utils/axios';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ApiResponse, QueryOptions, NotificationData } from '@/src/types/api';

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
