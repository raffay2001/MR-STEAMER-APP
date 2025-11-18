import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type CreateCarPayload = {
  type: string;
  color: string;
  brand: string;
  number: string;
  name?: string;
  city: string;
};

export type CarItem = {
  id: string;
  name: string;
  mediaPath?: string;
  type: {
    id: string;
    name: string;
    displayName: string;
    mediaPath?: string;
  };
  color: string;
  brand: {
    id: string;
    name: string;
    displayName: string;
  };
  number: string;
  city: string;
  userId: string;
};

export const createCar = async (payload: CreateCarPayload) => {
  const token = await getAccessToken();
  return apiClient.post('/car', payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getCarsByUserId = async (userId: string): Promise<CarItem[]> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/car', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    params: { userId },
  });

  return res.data;
};
