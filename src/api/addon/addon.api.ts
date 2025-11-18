import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type AddonItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  mediaPath?: string;
  isActive: boolean;
  userId?: string;
};

export type AddonListResponse = {
  results: AddonItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export const getAddons = async (params?: { page?: number; limit?: number }) => {
  const token = await getAccessToken();

  return apiClient.get('/addon', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
