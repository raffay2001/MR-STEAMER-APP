import { useCallback, useState } from 'react';
import {
  getAllPackages as apiGetAllPackages,
  getPackageById as apiGetPackageById,
  type PackageListResponse,
  type PackageItem,
  checkIfUserOwnsPackage as apiCheckIfUserOwnsPackage
} from '../api/package/package.api';

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
  }, []);

  const fetchPackages = useCallback(
    async (): Promise<PackageListResponse> => {
      setLoading(true);
      try {
        const res = await apiGetAllPackages();
        return res;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const checkIfUserOwnsPackage = useCallback(
    async (userId: string, packageId: string) => {
      return apiCheckIfUserOwnsPackage(userId, packageId);
    },
    []
  );

  return { loading, fetchPackageById, fetchPackages, checkIfUserOwnsPackage };
};
