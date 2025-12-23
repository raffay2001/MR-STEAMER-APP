import { useState, useCallback } from 'react';
import {
  createCar as apiCreateCar,
  getCarsByUserId as apiGetCarsByUserId,
  type CreateCarPayload,
  type CarItem,
} from '../api/car/car.api';
import i18n from '../i18n';

export const useCar = () => {
  const [loading, setLoading] = useState(false);

  const createCar = async (payload: CreateCarPayload) => {
    setLoading(true);
    try {
      const res = await apiCreateCar(payload);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const fetchCarsByUserId = useCallback(
    async (userId: string): Promise<CarItem[]> => {
      setLoading(true);
      try {
        const res = await apiGetCarsByUserId(userId);
        return res;
      } finally {
        setLoading(false);
      }
    }, [i18n.language]);

  return { loading, createCar, fetchCarsByUserId };
};
