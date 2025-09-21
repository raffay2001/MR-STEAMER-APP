import { useState } from 'react';
import { createCar as apiCreateCar, type CreateCarPayload } from '../api/car/car.api';

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

  return { loading, createCar };
};