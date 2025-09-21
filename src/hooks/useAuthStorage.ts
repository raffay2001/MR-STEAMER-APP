import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, CAR_PROFILE, HOME_AD_SEEN, REFRESH_TOKEN, USER_INFO, VEHICLE_SETUP_DONE } from '../constants';

export type StoredUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  isEmailVerified?: boolean;
  balance?: number;
  pts?: number;
  // add more fields if you need them later
} | null;

/** Read */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN);
  } catch (err) {
    console.error('Failed to get access token:', err);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(REFRESH_TOKEN);
  } catch (err) {
    console.error('Failed to get refresh token:', err);
    return null;
  }
};

export const getUserData = async (): Promise<StoredUser> => {
  try {
    const raw = await AsyncStorage.getItem(USER_INFO);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to parse user data:', err);
    return null;
  }
};

export const isLoggedIn = async (): Promise<boolean> => {
  const tok = await getAccessToken();
  return !!tok;
};

/** Write */
export const setAuth = async (opts: {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: any;
}) => {
  try {
    const { accessToken, refreshToken, user } = opts;
    if (accessToken) await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
    if (refreshToken) await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
    if (user) await AsyncStorage.setItem(USER_INFO, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to set auth data:', err);
  }
};

/** Clear */
export const clearAuth = async () => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO, CAR_PROFILE, VEHICLE_SETUP_DONE, HOME_AD_SEEN]);
  } catch (err) {
    console.error('Failed to clear auth data:', err);
  }
};

/** Convenience: save directly from your backend response shape */
export const persistAuthResponse = async (resp: any) => {
  const accessToken = resp?.tokens?.access?.token ?? null;
  const refreshToken = resp?.tokens?.refresh?.token ?? null;
  const user = resp?.user ?? null;
  await setAuth({ accessToken, refreshToken, user });
};
