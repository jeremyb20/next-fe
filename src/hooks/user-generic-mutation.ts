// import { useMutation } from '@tanstack/react-query';

// import axiosInstance from '../utils/axios';
// import { BaseApiResponse } from '../types/api';

// type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// export const useCreateGenericMutation = () => {
//   const sendEndpoint = async <T>(params: {
//     payload: T;
//     pEndpoint: string;
//     method?: HttpMethod;
//   }): Promise<unknown> => {
//     const { payload, pEndpoint, method = 'POST' } = params;

//     const response = await axiosInstance({
//       method: method.toLowerCase(),
//       url: pEndpoint,
//       data: payload,
//     });

//     return response.data;
//   };

//   const mutation = useMutation({
//     mutationFn: sendEndpoint as (params: {
//       payload: unknown;
//       pEndpoint: string;
//       method?: HttpMethod;
//     }) => Promise<unknown>,
//   });

//   const mutateAsync = async <T, R = BaseApiResponse>(params: {
//     payload: T;
//     pEndpoint: string;
//     method?: HttpMethod;
//   }): Promise<R> => {
//     const data = await mutation.mutateAsync(params);
//     return data as R;
//   };

//   return {
//     ...mutation,
//     mutateAsync,
//   };
// };

import { useMutation } from '@tanstack/react-query';

import axiosInstance from '../utils/axios';
import { BaseApiResponse } from '../types/api';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const useCreateGenericMutation = () => {
  const sendEndpoint = async <T>(params: {
    payload: T;
    pEndpoint: string;
    method?: HttpMethod;
    isFormData?: boolean;
  }): Promise<unknown> => {
    const { payload, pEndpoint, method = 'POST', isFormData = false } = params;

    const config: any = {
      method: method.toLowerCase(),
      url: pEndpoint,
    };

    // Detectar si es FormData automáticamente o por parámetro
    const shouldUseFormData =
      isFormData || payload instanceof FormData || hasFiles(payload);

    if (shouldUseFormData) {
      let formData: FormData;

      if (payload instanceof FormData) {
        formData = payload;
      } else {
        formData = convertToFormData(payload);
      }

      config.data = formData;
      // No establecer Content-Type header, axios lo hace automáticamente para FormData
    } else {
      config.data = payload;
      config.headers = {
        'Content-Type': 'application/json',
      };
    }

    const response = await axiosInstance(config);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: sendEndpoint as (params: {
      payload: unknown;
      pEndpoint: string;
      method?: HttpMethod;
      isFormData?: boolean;
    }) => Promise<unknown>,
  });

  const mutateAsync = async <T, R = BaseApiResponse>(params: {
    payload: T;
    pEndpoint: string;
    method?: HttpMethod;
    isFormData?: boolean;
  }): Promise<R> => {
    const data = await mutation.mutateAsync(params);
    return data as R;
  };

  return {
    ...mutation,
    mutateAsync,
  };
};

// Helper para detectar si el payload contiene archivos
const hasFiles = (payload: any): boolean => {
  if (!payload || typeof payload !== 'object') return false;

  if (payload instanceof File) return true;

  if (Array.isArray(payload)) {
    return payload.some((item) => item instanceof File);
  }

  return Object.values(payload).some((value) => {
    if (value instanceof File) return true;
    if (Array.isArray(value)) {
      return value.some((item) => item instanceof File);
    }
    return false;
  });
};

// Helper para convertir objeto a FormData
const convertToFormData = (payload: any): FormData => {
  const formData = new FormData();

  const appendToFormData = (key: string, value: any) => {
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Para arrays, especialmente de archivos
      if (value.length > 0 && value[0] instanceof File) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        formData.append(key, JSON.stringify(value));
      }
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value.toString());
    }
  };

  Object.entries(payload).forEach(([key, value]) => {
    appendToFormData(key, value);
  });

  return formData;
};
