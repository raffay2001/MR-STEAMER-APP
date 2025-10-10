import { useState, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  googleSignInApi,
  registerSteamerUser,
  requestPasswordReset,
  resetPasswordWithCode,
} from '../api/auth/auth.api';

type LoginBody = { email: string; password: string };
type RegisterBody = { email: string; password: string; role: string; name: string };
type RegisterSteamerBody = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  companyName: 'Individual' | 'Company';
};

type ResetCodeBody = { email: string; code: string; password: string };

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

  const handleGoogleLogin = useCallback(async (idToken: string) => {
    setLoading(true);
    try {
      const res = await googleSignInApi(idToken);
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

  const handleRequestPasswordReset = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResetPasswordWithCode = useCallback(async (data: ResetCodeBody) => {
    setLoading(true);
    try {
      const res = await resetPasswordWithCode(data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    handleLogin,
    handleGoogleLogin,  
    handleRegister,
    handleRegisterSteamer,
    handleRequestPasswordReset,
    handleResetPasswordWithCode,
  };
};
