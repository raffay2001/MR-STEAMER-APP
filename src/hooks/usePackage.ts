import { useCallback, useState } from 'react';
import { getAllPackages as apiGetAllPackages, getPackageById as apiGetPackageById } from '../api/package/package.api';

export const usePackage = () => {
  const [loading, setLoading] = useState(false);

  const fetchPackageById = useCallback(async (id: string): Promise<any> => {
    setLoading(true);
    try {
      const res = await apiGetPackageById(id);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackages = useCallback(async (params?: { page?: number; limit?: number }) => {
    setLoading(true);
    try { const res = await apiGetAllPackages(params); return res.data; }
    finally { setLoading(false); }
  }, []);

  return { loading, fetchPackageById, fetchPackages };
};
