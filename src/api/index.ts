import axios from 'axios';

// export const BACKEND_URL = 'https://api.mistersteamer.com';
export const BACKEND_URL = 'https://bf4d7130bb88.ngrok-free.app';
// export const BACKEND_URL = 'http://mrsteamer-backend-env.eba-2gwmyuuc.me-central-1.elasticbeanstalk.com';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;