import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN} from '../constants';
import Config from '../../config';

const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// Request Interceptor
const requestSuccessInterceptor = async (config: any) => {
  try {
    const authToken = await AsyncStorage.getItem(ACCESS_TOKEN);
    console.log('Auth Token:', authToken);

    // Debug log
    if (authToken) {
      config.headers.Authorization = 'Bearer ' + authToken;
    } else {
      console.warn('No token found. Redirect to login if needed.');
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
  return config;
};

// Response Interceptor
const responseErrorInterceptor = (error: any) => {
  if (error.response && error.response.status === 401) {
    console.error('Unauthorized! Redirecting to login...');
    // Handle 401 error (e.g., clear token and redirect to login)
  } else {
    console.error('API Error:', error.response || error.message);
  }
  return Promise.reject(error);
};

api.interceptors.request.use(requestSuccessInterceptor);
api.interceptors.response.use(response => response, responseErrorInterceptor);

export default api;
