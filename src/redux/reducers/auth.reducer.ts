import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    token: null,
    refreshToken: null,
    email: null,
    user: null,
  },
  reducers: {
    setToken(state, action) {
      let {_id: id, token, refreshToken} = action.payload;
      state.id = id;
      state.token = token;
      state.refreshToken = refreshToken;
      state.email = action.payload.email;
      // AsyncStorage.setItem('token', token);
    },
    logout(state) {
      state.id = null;
      state.token = null;
      state.refreshToken = null;
      state.email = null;
      state.user = null;
      // AsyncStorage.removeItem('token');
    },
  },
});

export const {setToken, logout} = authSlice.actions;
export default authSlice.reducer;
