import { useCallback, useState } from 'react';
import {
  getSlotsByDay,
  type GetSlotsByDayParams,
  type SlotItem,
  type SlotsByDayResponse,
} from '../api/slot/slot.api';
import i18n from '../i18n';

export const useSlots = () => {
  const [loading, setLoading] = useState(false);

  const fetchSlotsByDay = useCallback(
    async (params: GetSlotsByDayParams): Promise<SlotsByDayResponse> => {
      setLoading(true);
      try {
        const res = await getSlotsByDay(params);
        return res;
      } finally {
        setLoading(false);
      }
    }, [i18n.language]);

  return { loading, fetchSlotsByDay };
};