import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async (data: ChangePasswordPayload) => {
  const token = await getAccessToken();
  return apiClient.post('/users/me/change-password', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/* 🔹 NEW: Get user by id */
export const getUserById = async (userId: string) => {
  const token = await getAccessToken();
  return apiClient.get(`/users/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export type UpdateUserPayload = {
  name?: string;
  email?: string;
  phoneNumber?: string;
  companyName?: string;
  city?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

/* 🔹 NEW: Patch user by id */
export const updateUserById = async (userId: string, data: UpdateUserPayload) => {
  const token = await getAccessToken();
  return apiClient.patch(`/users/${userId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
