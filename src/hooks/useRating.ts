import { useCallback, useState } from 'react';
import { getRatingsByPackageName, createRating, type CreateRatingPayload } from '../api/rating/rating.api';
import i18n from '../i18n';

export const useRating = () => {
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    const fetchRatingsByPackageName = useCallback(async (name: string, params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
        const res = await getRatingsByPackageName(name, params);
        return res.data;
        } finally {
        setLoading(false);
        }
    }, [i18n.language]);

    const submitRating = useCallback(async (payload: CreateRatingPayload) => {
        setCreating(true);
        try {
            const res = await createRating(payload);
            return res.data;
        } finally {
            setCreating(false);
        }
    }, []);

  return { loading, creating, fetchRatingsByPackageName, submitRating };
};
