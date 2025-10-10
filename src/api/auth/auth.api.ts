import apiClient from '../index';

export const loginUser = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

export const registerUser = (data: {
  email: string;
  password: string;
  role: string;
  name: string;
}) => apiClient.post('/auth/register', data);

export const googleSignInApi = (idToken: string) =>
  apiClient.post('/auth/google', { idToken });

export const registerSteamerUser = (data: {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  companyName: 'Individual' | 'Company';
}) =>
  apiClient.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'rider',
    phoneNumber: data.phoneNumber,
    companyName: data.companyName,
  });

export const requestPasswordReset = (email: string) =>
  apiClient.post('/auth/forgot-password', { email });

export const resetPasswordWithCode = (data: {
  email: string;
  code: string;   
  password: string;
}) => apiClient.post('/auth/reset-password', data);
