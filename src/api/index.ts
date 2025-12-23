import axios from 'axios';

import i18n from '../i18n';

export const BACKEND_URL = 'https://api.mistersteamer.com';
// export const BACKEND_URL = 'https://f7cf3c24c703.ngrok-free.app';
// export const BACKEND_URL = 'http://mrsteamer-backend-env.eba-2gwmyuuc.me-central-1.elasticbeanstalk.com';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
  (config.headers as any)?.set?.('Accept-Language', lang) ?? ((config.headers as any) = { ...(config.headers as any), 'Accept-Language': lang });
  return config;
});

export default apiClient;