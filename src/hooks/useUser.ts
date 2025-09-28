import { useCallback, useState } from 'react';
import { changePassword, type ChangePasswordPayload } from '../api/user/user.api';

export const useUser = () => {
    const [loading, setLoading] = useState(false);

    const handleChangePassword = useCallback(async (data: ChangePasswordPayload) => {
        setLoading(true);
        try {
            const res = await changePassword(data);
            return res.data;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, handleChangePassword };
};
