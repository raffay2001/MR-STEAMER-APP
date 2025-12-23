import { useCallback, useState } from 'react';
import {
  getAllPackages as apiGetAllPackages,
  getPackageById as apiGetPackageById,
  type PackageListResponse,
  type PackageItem,
  checkIfUserOwnsPackage as apiCheckIfUserOwnsPackage,
  getMyUserPackages as apiGetMyUserPackages,
  type UserPackageListResponse,
} from '../api/package/package.api';
import i18n from '../i18n';

export const usePackage = () => {
  const [loading, setLoading] = useState(false);

  const fetchPackageById = useCallback(async (id: string): Promise<PackageItem> => {
    setLoading(true);
    try {
      const res = await apiGetPackageById(id);
      return res;
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  const fetchPackages = useCallback(
    async (): Promise<PackageListResponse> => {
      setLoading(true);
      try {
        const res = await apiGetAllPackages();
        return res;
      } finally {
        setLoading(false);
      }
    }, [i18n.language]);

  const checkIfUserOwnsPackage = useCallback(
    async (userId: string, packageId: string) => {
      return apiCheckIfUserOwnsPackage(userId, packageId);
    },
    []
  );

  const fetchMyUserPackages = useCallback(
    async (status: string = 'active'): Promise<UserPackageListResponse> => {
      setLoading(true);
      try {
        const res = await apiGetMyUserPackages(status);
        return res;
      } finally {
        setLoading(false);
      }
    }, [i18n.language]);

  return {
    loading,
    fetchPackageById,
    fetchPackages,
    checkIfUserOwnsPackage,
    fetchMyUserPackages,
  };
};
