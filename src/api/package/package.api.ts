import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const getAllPackages = async (params?: { page?: number; limit?: number }) => {
  const token = await getAccessToken();
  return apiClient.get('/package', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getPackageById = async (id: string) => {
  const token = await getAccessToken();
  return apiClient.get(`/package/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};