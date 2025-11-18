// ⬆️ keep existing imports
import { useState, useEffect, useCallback } from 'react';
import { fetchActiveBanner, type Banner } from '../api/banner/banner.api';

export const useBanner = () => {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBanner = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await fetchActiveBanner();
      setBanner(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load banner');
      setBanner(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanner();
  }, [loadBanner]);

  return { loading, banner, error, reloadBanner: loadBanner };
};
