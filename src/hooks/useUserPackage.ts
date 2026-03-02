import { useState, useCallback } from 'react';
import { purchaseUserPackage } from '../api/userPackage/userPackage.api';

export const useUserPackage = () => {
  const [loading, setLoading] = useState(false);

  const purchase = useCallback(
    async (packageId: string, vehicleTypeId: string, promoCode?: string) => {
      setLoading(true);
      try {
        return await purchaseUserPackage({ packageId, vehicleTypeId, promoCode });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, purchase };
};
