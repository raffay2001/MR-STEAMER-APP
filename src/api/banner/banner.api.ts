import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type Banner = {
    isActive: boolean;
    mediaPath: string;
    userId: {
        name: string;
        email: string;
        id: string;
    };
    id: string;
};

export const fetchActiveBanner = async (): Promise<Banner> => {
    const token = await getAccessToken();
    const res = await apiClient.get('/banners/active', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return res.data;
};