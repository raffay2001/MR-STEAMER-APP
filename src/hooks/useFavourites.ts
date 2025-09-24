import { useCallback, useState } from 'react';
import { toggleFavouritePackage as apiToggleFavouritePackage } from '../api/favourite/favourite.api';

export const useFavourites = () => {
  const [loading, setLoading] = useState(false);

  const togglePackageFavourite = useCallback(async (packageId: string) => {
    setLoading(true);
    try {
      const res = await apiToggleFavouritePackage(packageId);
      console.log('[FavouriteAPI] OK:', res.status, res.data);
      return res.data;
    } catch (e: any) {
      console.log('[FavouriteAPI] ERR:', e?.response?.status, e?.response?.data || e?.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, togglePackageFavourite };
};
