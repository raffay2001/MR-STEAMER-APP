// send {} (not null) + explicit content-type + token log
import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const toggleFavouritePackage = async (id: string) => {
  const token = await getAccessToken();

  return apiClient.post(
    `/package/${id}/favourite`,
    {}, // 👈 IMPORTANT: empty JSON object, not null
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
};
