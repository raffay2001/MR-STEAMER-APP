import { useCallback, useState } from 'react';
import { getServices as apiGetServices, getPackagesByService as apiGetPackagesByService, } from '../api/service/service.api';

export const useServices = () => {
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    name?: string;
  }): Promise<any> => {
    setLoading(true);
    try {
      const res = await apiGetServices(params);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackagesByService = useCallback(
    async (
      serviceId: string,
      params?: { page?: number; limit?: number; sortBy?: string; vehicleType?: string }
    ): Promise<any> => {
      setLoading(true);
      try {
        const res = await apiGetPackagesByService(serviceId, params);
        return res.data;
      } finally {
        setLoading(false);
      }
    },
  [],);

  return { loading, fetchServices, fetchPackagesByService };
};