// src/api/service/service.api.ts
import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type ServiceOffering = {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type ServiceItem = {
  id: string;
  name: string;
  description?: string;
  mediaPath?: string;
  isActive?: boolean;
  userId?: string;
  offerings?: ServiceOffering[];
};

export type ServicesListResponse = {
  results: ServiceItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type ServicesListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  name?: string;
};

export const getAllServices = async (
  params?: ServicesListParams
): Promise<ServicesListResponse> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/service', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};

export const getPackagesByServiceId = async (
  serviceId: string,
  params?: { page?: number; limit?: number; sortBy?: string; vehicleType?: string }
): Promise<any> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/package', {
    params: { service: serviceId, ...params },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};
