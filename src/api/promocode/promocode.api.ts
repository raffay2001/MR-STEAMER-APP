import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const validatePromoCode = async (code: string, packageId?: string) => {
  const token = await getAccessToken();

  const res = await apiClient.post(
    '/promocode/validate',
    { code, packageId },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }
  );

  return res.data; // will contain promo data
};
