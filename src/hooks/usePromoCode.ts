import { useState, useCallback } from 'react';
import { validatePromoCode } from '../api/promocode/promocode.api';

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false);

  const validate = useCallback(async (code: string, packageId?: string) => {
    setLoading(true);
    try {
      return await validatePromoCode(code, packageId);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, validate };
};
