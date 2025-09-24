import axios from 'axios';

export const BACKEND_URL = 'https://b656c91c1a1d.ngrok-free.app';
// export const BACKEND_URL = 'http://localhost:3001';
// export const BACKEND_URL = 'http://10.0.2.2:3000/v1';

const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
});

export default apiClient;