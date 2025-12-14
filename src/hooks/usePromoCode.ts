import { useState, useCallback, useEffect } from 'react';
import { validatePromoCode, fetchPromoCodes, type PromoCode } from '../api/promocode/promocode.api';

export const usePromoCode = () => {
  const [loading, setLoading] = useState(false);
    const [promos, setPromos] = useState<PromoCode[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (code: string, packageId?: string) => {
    setLoading(true);
    try {
      return await validatePromoCode(code, packageId);
    } finally {
      setLoading(false);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await fetchPromoCodes();
      setPromos(Array.isArray(data?.results) ? data.results : []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load promo codes');
      setPromos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, validate, promos, error, reloadPromos: load };
};
