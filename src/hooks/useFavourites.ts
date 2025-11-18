import { useCallback, useState } from 'react';
import { toggleFavouritePackage as apiToggleFavouritePackage } from '../api/favourite/favourite.api';

export const useFavourites = () => {
  const [loading, setLoading] = useState(false);

  const togglePackageFavourite = useCallback(async (packageId: string) => {
    setLoading(true);
    try {
      const res = await apiToggleFavouritePackage(packageId);
      return res.data;
    } catch (e: any) {
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, togglePackageFavourite };
};
