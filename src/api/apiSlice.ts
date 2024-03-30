import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {RootState} from '../redux/store';
import {logout, setToken} from '../redux/reducers/auth.reducer';

const baseUrl = 'https://jsonplaceholder.typicode.com';

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: 'include',
  prepareHeaders: async (headers, {getState}) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const store = (api.getState() as RootState).auth;
    // const store = await getItem('@user');
    const refreshResult = await fetch(`${baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: store.email,
        userId: store.id,
        refreshToken: store.refreshToken,
      }),
    });

    let data = await refreshResult.json();

    if (data.success) {
      // await AsyncStorage.setItem('@token', JSON.stringify(data?.token));
      api.dispatch(setToken(data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Test', 'Auth'],
  endpoints: _ => ({}),
});
