import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export const purchaseUserPackage = async (body: {
  packageId: string;
  vehicleTypeId: string;
  promoCode?: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient.post('/user-package/purchase', body, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};
