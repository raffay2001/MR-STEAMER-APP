import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState: {
    name: '',
    description: '',
    displayName: '',
  },
  reducers: {
    setVehicleState(state, action) {
      const {name, description, displayName} = action.payload;
      state.name = name;
      state.description = description;
      state.displayName = displayName;
      console.log('After state update:', state);
    },
  },
});

export const getUserInfo = (state: RootState) => state.auth.user;
export const getAccessToken = (state: RootState) => state.auth.token;
export const getRefreshToken = (state: RootState) => state.auth.refreshToken;

export const {setVehicleState} = vehicleSlice.actions;
export default vehicleSlice.reducer;
