import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type RatingUser = {
  id: string;
  name?: string;
  email?: string;
};

export type RatingPackage = {
  id: string;
  name: string;
  type?: string;
  pricing?: number;
};

export type RatingItem = {
  id: string;
  packageId: RatingPackage;
  userId: RatingUser;
  description?: string;
  star: number;              // 1..5
  date: string;              // ISO string
};

export type RatingListResponse = {
  results: RatingItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type CreateRatingPayload = {
  packageId: string;
  description?: string;
  star: number;
};

export const getRatingsByPackageName = async (
  packageName: string,
  params?: { page?: number; limit?: number }
) => {
  const token = await getAccessToken();
  const url = `/rating/package/${encodeURIComponent(packageName)}`;
  return apiClient.get<RatingListResponse>(url, {
    params,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      : { Accept: 'application/json' },
  });
};

export const createRating = async (payload: CreateRatingPayload) => {
  const token = await getAccessToken();
  return apiClient.post('/rating', payload, {
    headers: token
      ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      : { Accept: 'application/json' },
  });
};