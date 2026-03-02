import {AxiosResponse} from 'axios';
import api from './api';

type PostData = Record<string, any>;

export const GET = <T>(
  url: string,
  config?: object,
): Promise<AxiosResponse<T, any>> => {
  return api.get<T>(url, config);
};

export const POST = <T>(
  url: string,
  data?: PostData,
  config?: object,
): Promise<AxiosResponse<T, any>> => {
  return api.post<T>(url, data, config);
};
