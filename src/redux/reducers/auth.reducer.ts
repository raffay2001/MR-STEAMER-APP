import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      balance: 0,
      pts: 0,
      bookings: [],
      ratings: [],
      role: '',
      isEmailVerified: false,
      email: '',
      name: '',
      id: '',
    },
    token: null,
    refreshToken: null,
  },
  reducers: {
    setAuthState(state, action) {
      console.log('Payload:', action.payload);
      console.log('Access Token:', action.payload.tokens.access.token);
      console.log('Before state update:', state); // Log access token

      state.token = action.payload.tokens.access.token;
      state.refreshToken = action.payload.tokens.refresh.token;
      state.user = action.payload.user;
      console.log('After state update:', state);
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = {
        balance: 0,
        pts: 0,
        bookings: [],
        ratings: [],
        role: '',
        isEmailVerified: false,
        email: '',
        name: '',
        id: '',
      };
      // AsyncStorage.removeItem('token');
    },
  },
});

export const getUserInfo = (state: RootState) => state.auth.user;
export const getAccessToken = (state: RootState) => state.auth.token;
export const getRefreshToken = (state: RootState) => state.auth.refreshToken;

export const {setAuthState, logout} = authSlice.actions;
export default authSlice.reducer;
