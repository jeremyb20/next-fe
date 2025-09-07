import { useMutation } from '@tanstack/react-query';

import axiosInstance from '../utils/axios';
import { BaseApiResponse } from '../types/api';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const useCreateGenericMutation = () => {
  const sendEndpoint = async <T>(params: {
    payload: T;
    pEndpoint: string;
    method?: HttpMethod;
  }): Promise<unknown> => {
    const { payload, pEndpoint, method = 'POST' } = params;

    const response = await axiosInstance({
      method: method.toLowerCase(),
      url: pEndpoint,
      data: payload,
    });

    return response.data;
  };

  const mutation = useMutation({
    mutationFn: sendEndpoint as (params: {
      payload: unknown;
      pEndpoint: string;
      method?: HttpMethod;
    }) => Promise<unknown>,
  });

  const mutateAsync = async <T, R = BaseApiResponse>(params: {
    payload: T;
    pEndpoint: string;
    method?: HttpMethod;
  }): Promise<R> => {
    const data = await mutation.mutateAsync(params);
    return data as R;
  };

  return {
    ...mutation,
    mutateAsync,
  };
};
