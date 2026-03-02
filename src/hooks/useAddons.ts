import { useState, useCallback } from 'react';
import { getAddons, type AddonItem } from '../api/addon/addon.api';
import i18n from '../i18n'; 

export const useAddons = () => {
  const [loading, setLoading] = useState(false);
  const [addons, setAddons] = useState<AddonItem[]>([]);

  const fetchAddons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAddons({ limit: 50 });
      setAddons(res.data?.results ?? []);
    } catch (e) {
      setAddons([]);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  return { loading, addons, fetchAddons };
};
