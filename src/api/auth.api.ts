import {apiSlice} from './apiSlice';

const authSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTest: builder.query({
      query: ({limit}) => `/posts?limit=${limit}`,
    }),
  }),
});
export const {useGetTestQuery} = authSlice;
