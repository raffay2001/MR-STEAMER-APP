// src/hooks/useSlots.ts
import { useState, useCallback } from 'react';
import {
  getAvailableSlots,
  type GetAvailableSlotsParams,
} from '../api/slot/slot.api';

export type SlotItem = {
  startTime: string;     // "10:00"
  endTime: string;       // "11:00"
  displayTime: string;   // "10:00 AM - 11:00 AM"
  dateTime: string;      // ISO
  duration: number;      // minutes
  day: string;           // "Wednesday"
  isAvailable: boolean;
};

export type AvailableSlotsResponse = {
  date: string;
  packageId: string | null;
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  slotDuration: number;
  slots: SlotItem[];
  bookedSlotDetails?: any[];
};

export const useSlots = () => {
  const [loading, setLoading] = useState(false);

  const fetchAvailableSlots = useCallback(
    async (params: GetAvailableSlotsParams): Promise<AvailableSlotsResponse> => {
      setLoading(true);
      try {
        const res = await getAvailableSlots(params);
        return res.data as AvailableSlotsResponse;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, fetchAvailableSlots };
};
