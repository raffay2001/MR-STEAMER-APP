import { useCallback, useState } from 'react';
import {
  createBooking as apiCreateBooking,
  getBookingsByUserId as apiGetBookingsByUserId,
  getBookingById as apiGetBookingById,
  type CreateBookingPayload,
} from '../api/booking/booking.api';

export const useBooking = () => {
    const [loading, setLoading] = useState(false);

    const createBooking = useCallback(async (payload: CreateBookingPayload) => {
        setLoading(true);
        try {
        const res = await apiCreateBooking(payload);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBookingsByUserId = useCallback(
        async (userId: string, params?: { page?: number; limit?: number; sortBy?: string }) => {
        setLoading(true);
        try {
            const res = await apiGetBookingsByUserId(userId, params);
            return res.data; 
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBookingById = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const res = await apiGetBookingById(id);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, createBooking, fetchBookingsByUserId, fetchBookingById };
};