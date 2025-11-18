import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type CreateBookingPayload = {
  carId: string;
  userPackageId: string;
  packageId: string;
  slotId: string;

  additionalAddOns?: Array<{
    addOnId: string;
    quantity: number;
    price: number; // unit price only
  }>;

  mobileNumber: string;
  email?: string;
  address: string;

  location: {
    latitude: number;
    longitude: number;
  };

  specialInstructions?: string;
};

export const createBooking = async (data: CreateBookingPayload) => {
  const token = await getAccessToken();
  return apiClient.post('/bookings', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getBookingsByUserId = async (
  userId: string,
  params?: { page?: number; limit?: number; sortBy?: string }
) => {
  const token = await getAccessToken();
  return apiClient.get('/bookings', {
    params: { userId, ...(params || {}) },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

export const getBookingById = async (id: string) => {
  const token = await getAccessToken();
  return apiClient.get(`/bookings/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};