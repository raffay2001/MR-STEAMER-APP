import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const getEnums = async (params?: {
  enumType?: string;
  name?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  const token = await getAccessToken();
  return apiClient.get('/enum', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getEnumsByType = async (
  enumType: string,
  extra?: { name?: string; sortBy?: string; page?: number; limit?: number }
) => getEnums({ enumType, ...extra });

export const getEnumById = async (id: string) => {
  const token = await getAccessToken();
  return apiClient.get(`/enum/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};