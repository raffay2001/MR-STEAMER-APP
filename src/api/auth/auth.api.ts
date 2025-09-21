import apiClient from '../index';

export const loginUser = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

export const registerUser = (data: {
  email: string;
  password: string;
  role: string;
  name: string;
}) => apiClient.post('/auth/register', data);
