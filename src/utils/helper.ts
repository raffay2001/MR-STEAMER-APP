import {useDispatch, UseDispatch} from 'react-redux';
import {logout} from '../redux/reducers/auth.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO} from '../constants';
import Toast from 'react-native-toast-message';

export const LogOut = async () => {
  const dispatch = useDispatch();
  dispatch(logout());
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO]);
    console.log('Multiple keys removed from AsyncStorage!');
  } catch (e) {
    console.error('Failed to remove multiple keys:', e);
  }
};

type ToastProps = {
  type: string; // Could be 'success', 'error', 'delete', etc.
  message1: string;
  message2: string;
};

export const ErrorSuccessToast = ({type, message1, message2}: ToastProps) => {
  return Toast.show({
    type: type, // or 'error' or 'delete'
    text1: message1,
    text2: message2,
  });
};
