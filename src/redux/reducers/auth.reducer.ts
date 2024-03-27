import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    token: null,
    refreshToken: null,
  },
  reducers: {
    setToken(state, action) {
      let {_id: id, token, refreshToken} = action.payload;
      state.id = id;
      state.token = token;
      state.refreshToken = refreshToken;
      // AsyncStorage.setItem('token', token);
    },
  },
});

export const {setToken} = authSlice.actions;
export default authSlice.reducer;
