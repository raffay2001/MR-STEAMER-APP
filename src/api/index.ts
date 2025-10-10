import axios from 'axios';

// export const BACKEND_URL = 'https://cd1d9764a5aa.ngrok-free.app';
// export const BACKEND_URL = 'http://mrsteamer-backend-env.eba-2gwmyuuc.me-central-1.elasticbeanstalk.com';
export const BACKEND_URL = 'https://api.mistersteamer.com';
// export const BACKEND_URL = 'http://localhost:3001';
// export const BACKEND_URL = 'http://10.0.2.2:3000/v1';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;