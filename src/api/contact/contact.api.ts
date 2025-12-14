// src/api/contact.api.ts
import apiClient from '../index';
import { getAccessToken } from '../../hooks/useAuthStorage';

export type ContactUsPayload = {
  name: string;
  phone: string;
  email: string;
  query: string;
};

export type ContactUsResponse = any;

export const contactUs = async (payload: ContactUsPayload): Promise<ContactUsResponse> => {
  const token = await getAccessToken();

  const res = await apiClient.post('/contact-us', payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data;
};
