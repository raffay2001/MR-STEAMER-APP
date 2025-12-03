import { useCallback, useState } from 'react';
import {
  changePassword,
  type ChangePasswordPayload,
  getUserById,
  updateUserById,
  type UpdateUserPayload,
} from '../api/user/user.api';

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

  /* 🔹 NEW: fetch user by id */
  const fetchUserById = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const res = await getUserById(userId);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  /* 🔹 NEW: update user by id */
  const handleUpdateUser = useCallback(
    async (userId: string, data: UpdateUserPayload) => {
      setLoading(true);
      try {
        const res = await updateUserById(userId, data);
        return res.data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, handleChangePassword, fetchUserById, handleUpdateUser };
};
