// src/hooks/useServices.ts
import { useCallback, useState } from 'react';
import { getAllServices, ServiceItem, ServicesListParams, ServicesListResponse } from '../api/service/service.api';

export const useServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [meta, setMeta] = useState<Omit<ServicesListResponse, 'results'> | null>(null);

  const fetchServices = useCallback(async (params?: ServicesListParams) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAllServices(params);
      setServices(res?.results || []);
      setMeta({
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
        totalResults: res.totalResults,
      });
      return res;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to load services';
      setError(msg);
      setServices([]);
      setMeta(null);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchServices, services, meta, loading, error, setError };
};
