import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type GetAvailableSlotsParams = {
  date: string;        
  packageId?: string | null;
};

export const getAvailableSlots = async (params: GetAvailableSlotsParams) => {
  const token = await getAccessToken();
  return apiClient.get('/slots/available', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};