// src/hooks/useCarStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CAR_PROFILE, VEHICLE_SETUP_DONE } from '../constants/index';

export const setCarProfile = async (car: any) => {
  await AsyncStorage.setItem(CAR_PROFILE, JSON.stringify(car));
  await AsyncStorage.setItem(VEHICLE_SETUP_DONE, 'true');
};

export const getCarProfile = async () => {
  const v = await AsyncStorage.getItem(CAR_PROFILE);
  return v ? JSON.parse(v) : null;
};

export const clearCarProfile = async () => {
  await AsyncStorage.multiRemove([CAR_PROFILE, VEHICLE_SETUP_DONE]);
};
