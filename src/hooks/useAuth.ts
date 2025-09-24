// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { loginUser, registerUser, registerSteamerUser } from '../api/auth/auth.api';

type LoginBody = { email: string; password: string };
type RegisterBody = { email: string; password: string; role: string; name: string };

type RegisterSteamerBody = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  companyName: 'Individual' | 'Company';
};

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (data: LoginBody) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (data: RegisterBody) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegisterSteamer = useCallback(async (data: RegisterSteamerBody) => {
    setLoading(true);
    try {
      const res = await registerSteamerUser(data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, handleLogin, handleRegister, handleRegisterSteamer };
};
