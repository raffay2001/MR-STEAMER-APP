import { useState, useCallback  } from 'react';
import { getEnums, getEnumsByType as apiGetEnumsByType, getEnumById as apiGetEnumById, } from '../api/enum/enum.api';
import i18n from '../i18n';

export const useEnums = () => {
  const [loading, setLoading] = useState(false);

  const fetchEnums = useCallback(async (params?: {
    enumType?: string;
    name?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<any> => {
    setLoading(true);
    try {
      const res = await getEnums(params);
      return res.data; 
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  const fetchEnumsByType = useCallback(async (
    enumType: string,
    extra?: { name?: string; sortBy?: string; page?: number; limit?: number }
  ): Promise<any> => fetchEnums({ enumType, ...extra }), [fetchEnums]);

  const fetchEnumById = useCallback(async (id: string): Promise<any> => {
    setLoading(true);
    try {
      const res = await apiGetEnumById(id);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  return {
    loading,
    fetchEnums,
    fetchEnumsByType,
    fetchEnumById,
  };
};
