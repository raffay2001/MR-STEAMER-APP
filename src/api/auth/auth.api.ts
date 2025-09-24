import apiClient from '../index';

export const loginUser = (data: { email: string; password: string }) =>
  apiClient.post('/auth/login', data);

export const registerUser = (data: {
  email: string;
  password: string;
  role: string;
  name: string;
}) => apiClient.post('/auth/register', data);

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