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

const requestSuccessInterceptor = async (config: any) => {
  const authToken = await AsyncStorage.getItem(ACCESS_TOKEN);
  if (authToken) {
    config.headers.Authorization = 'Bearer ' + authToken;
  }
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
};

api.interceptors.request.use(requestSuccessInterceptor);

export default api;
