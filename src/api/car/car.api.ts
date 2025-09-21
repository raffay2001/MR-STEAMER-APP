import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type CreateCarPayload = {
  type: string;
  color: string;
  brand: string;
  number: string;
  name?: string;
};

export const createCar = async (payload: CreateCarPayload) => {
  const token = await getAccessToken();
  return apiClient.post('/car', payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};