import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type PackageVehiclePrice = {
  vehicleTypeId: string;
  price: number;
};

export type PackageServiceIncluded = {
  id: string;
  name: string;
  description?: string;
};

export type PackageItem = {
  id: string;
  name: string;
  description: string;
  pricingType: 'fixed' | 'vehicle_based';
  fixedPrice: number;
  vehicleBasedPricing: PackageVehiclePrice[];
  servicesIncluded: PackageServiceIncluded[];
};

export type PackageListResponse = {
  results: PackageItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type UserPackageItem = {
  id: string;
  status: string;
  remainingUsage: number;
  expiryDate: string | null;
  isExpired: boolean;
  isFullyUsed: boolean;
  purchaseDate: string;
  pricePaid: number;
  packageId: {
    id: string;
    name: string;
    description?: string;
    pricingType?: 'fixed' | 'vehicle_based';
    fixedPrice?: number;
    usageLimit?: number;
    hasExpiry?: boolean;
  };
};

export type UserPackageListResponse = {
  results: UserPackageItem[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export const getAllPackages = async (): Promise<PackageListResponse> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/package', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};

export const getPackageById = async (id: string): Promise<PackageItem> => {
  const token = await getAccessToken();

  const res = await apiClient.get(`/package/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};

export const checkIfUserOwnsPackage = async (userId: string, packageId: string) => {
  const token = await getAccessToken();

  const res = await apiClient.get('/user-package', {
    params: {
      userId,
      packageId,
      status: 'active',
    },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};

export const getMyUserPackages = async (
  status: string = 'active'
): Promise<UserPackageListResponse> => {
  const token = await getAccessToken();

  const res = await apiClient.get('/user-package/my-packages', {
    params: { status },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};
