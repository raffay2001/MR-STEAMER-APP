import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type GetSlotsByDayParams = {
  day: string;          // "monday"
  packageId: string; 
  page?: number;
  limit?: number;
};

export type SlotItem = {
  id: string;
  day: string;          // "monday"
  time: string;         // "09:00"
  duration: number;     // 60
  maxBookings: number;
  currentBookings: number;
};

export type SlotsByDayResponse = {
  results: SlotItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export const getSlotsByDay = async (
  params: GetSlotsByDayParams
): Promise<SlotsByDayResponse> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/slots', {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data as SlotsByDayResponse;
};