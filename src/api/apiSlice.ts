import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RootState} from '../redux/store';

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

// const handleAuthFailed = async (args, api, extraOptions) => {
//   const result = await baseQuery(args, api, extraOptions);

//   if (result.error?.status === 401) {
//     // const store = api.getState();
//     const store = await getItem('@user');
//     console.log('refreshing token');
//     const refreshResult = await fetch(`${baseUrl}/refresh`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: store.email,
//         userId: store.uid,
//         refreshToken: store.refreshToken,
//       }),
//     });

//     let data = await refreshResult.json();

//     if (data.success) {
//       try {
//         // await AsyncStorage.setItem('@token', JSON.stringify(data?.token));
//       } catch (error) {
//         console.log(error, 'error in setting token');
//       }
//       // api.dispatch(setToken(data));
//       // return baseQuery(args, api, extraOptions);
//     } else {
//       // api.dispatch(logout());
//     }
//   }

//   return result;
// };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Test', 'Auth'],
  endpoints: _ => ({}),
});
