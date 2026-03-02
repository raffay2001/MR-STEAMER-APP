import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type PromoCode = {
  id: string;
  description: string;
  applicablePackages: string[];
  status: 'active' | 'inactive';
  expiryDate: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  userId: string;
};

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

export const fetchPromoCodes = async () => {
  const token = await getAccessToken();

  const res = await apiClient.get('/promocode', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data; // { results, page, limit, ... }
};
