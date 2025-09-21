import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const getServices = async (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  name?: string;
}) => {
  const token = await getAccessToken();
  return apiClient.get('/service', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getPackagesByService = async (
  serviceId: string,
  params?: { page?: number; limit?: number; sortBy?: string; vehicleType?: string }
) => {
  const token = await getAccessToken();
  return apiClient.get('/package', {
    params: { service: serviceId, ...params },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};