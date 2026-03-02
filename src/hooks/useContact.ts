// src/hooks/useContact.ts
import { useCallback, useState } from 'react';
import { contactUs, ContactUsPayload } from '../api/contact/contact.api';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = useCallback(async (payload: ContactUsPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactUs(payload); // returns res.data already
      return data;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Failed to submit. Please try again.';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submitContact, loading, error, setError };
};
