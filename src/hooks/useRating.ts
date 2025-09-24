import { useCallback, useState } from 'react';
import { getRatingsByPackageName, createRating, type CreateRatingPayload } from '../api/rating/rating.api';

export const useRating = () => {
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    const fetchRatingsByPackageName = useCallback(async (name: string, params?: { page?: number; limit?: number }) => {
        setLoading(true);
        try {
        const res = await getRatingsByPackageName(name, params);
        // console.log('[RatingAPI] OK:', res.status, `name=${name}`, res.data);
        return res.data;
        } finally {
        setLoading(false);
        }
    }, []);

    const submitRating = useCallback(async (payload: CreateRatingPayload) => {
        setCreating(true);
        try {
            const res = await createRating(payload);
            // console.log('[RatingAPI] CREATE OK:', res.status, res.data);
            return res.data;
        } finally {
            setCreating(false);
        }
    }, []);

  return { loading, creating, fetchRatingsByPackageName, submitRating };
};
