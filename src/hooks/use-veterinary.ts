import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { STORAGE_KEY } from '@/config-global';
import axiosInstance, { endpoints } from '@/utils/axios';
import {
  IClinicalRecord,
  IPetProfile,
  IVeterinary,
  IVeterinaryMember,
  VeterinaryMemberRole,
} from '@/types/api';

type AuthConfig = {
  headers?: {
    Authorization: string;
  };
};

const getAuthConfig = (): AuthConfig => {
  if (typeof window === 'undefined') return {};

  const token = localStorage.getItem(STORAGE_KEY);

  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export interface IPaginatedVeterinariesResponse {
  success: boolean;
  data: IVeterinary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface IMyVeterinariesResponse {
  success: boolean;
  data: IVeterinaryMember[];
}

interface IVeterinaryPetsResponse {
  success: boolean;
  data: IPetProfile[];
}

interface IVeterinaryMembersResponse {
  success: boolean;
  data: IVeterinaryMember[];
}

export interface IVeterinaryMemberPayload {
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  memberRole?: VeterinaryMemberRole;
}

export interface IVeterinaryOwnerPayload {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface IClinicalRecordResponse {
  success: boolean;
  data: {
    pet: IPetProfile;
    record: IClinicalRecord;
  };
}

export interface IVeterinaryPayload {
  name: string;
  legalName?: string;
  licenseNumber?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  website?: string;
  logo?: string;
  isActive?: boolean;
  ownerEmail?: string;
  ownerPassword?: string;
  ownerName?: string;
  ownerPhone?: string;
}

export const useAdminVeterinaries = (params: {
  page: number;
  limit: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ['admin-veterinaries', params],
    queryFn: async () => {
      const response = await axiosInstance.get<IPaginatedVeterinariesResponse>(
        endpoints.admin.veterinaries.list,
        { params, ...getAuthConfig() }
      );

      return response.data;
    },
  });

export const useCreateVeterinary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: IVeterinaryPayload) => {
      const response = await axiosInstance.post(
        endpoints.admin.veterinaries.create,
        payload,
        getAuthConfig()
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-veterinaries'] });
    },
  });
};

export const useUpdateVeterinary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<IVeterinaryPayload>;
    }) => {
      const response = await axiosInstance.put(
        endpoints.admin.veterinaries.update(id),
        payload,
        getAuthConfig()
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-veterinaries'] });
    },
  });
};

export const useDeleteVeterinary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(
        endpoints.admin.veterinaries.delete(id),
        getAuthConfig()
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-veterinaries'] });
    },
  });
};

export const useMyVeterinaries = () =>
  useQuery({
    queryKey: ['my-veterinaries'],
    queryFn: async () => {
      const response = await axiosInstance.get<IMyVeterinariesResponse>(
        endpoints.veterinary.me,
        getAuthConfig()
      );

      return response.data;
    },
  });

export const useVeterinaryMembers = (
  veterinaryId?: string,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['veterinary-members', veterinaryId],
    queryFn: async () => {
      const response = await axiosInstance.get<IVeterinaryMembersResponse>(
        endpoints.veterinary.members(veterinaryId as string),
        getAuthConfig()
      );

      return response.data;
    },
    enabled: Boolean(veterinaryId) && enabled,
  });

export const useAddVeterinaryMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      veterinaryId,
      payload,
    }: {
      veterinaryId: string;
      payload: IVeterinaryMemberPayload;
    }) => {
      const response = await axiosInstance.post(
        endpoints.veterinary.members(veterinaryId),
        payload,
        getAuthConfig()
      );

      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['veterinary-members', variables.veterinaryId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-veterinaries'] });
    },
  });
};

export const useCreateVeterinaryOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      veterinaryId,
      payload,
    }: {
      veterinaryId: string;
      payload: IVeterinaryOwnerPayload;
    }) => {
      const response = await axiosInstance.post(
        endpoints.veterinary.createOwner(veterinaryId),
        payload,
        getAuthConfig()
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['veterinary-pets'] });
    },
  });
};

export const useVeterinaryPets = (
  veterinaryId?: string,
  enabled: boolean = true
) =>
  useQuery({
    queryKey: ['veterinary-pets', veterinaryId],
    queryFn: async () => {
      const response = await axiosInstance.get<IVeterinaryPetsResponse>(
        endpoints.veterinary.pets(veterinaryId as string),
        getAuthConfig()
      );

      return response.data;
    },
    enabled: Boolean(veterinaryId) && enabled,
  });

export const useClinicalRecord = (
  veterinaryId?: string,
  petId?: string
) =>
  useQuery({
    queryKey: ['clinical-record', veterinaryId, petId],
    queryFn: async () => {
      const response = await axiosInstance.get<IClinicalRecordResponse>(
        endpoints.veterinary.clinicalRecord(
          veterinaryId as string,
          petId as string
        ),
        getAuthConfig()
      );

      return response.data;
    },
    enabled: Boolean(veterinaryId && petId),
  });
