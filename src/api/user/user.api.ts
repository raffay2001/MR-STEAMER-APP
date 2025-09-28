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
