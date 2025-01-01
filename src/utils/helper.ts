import {useDispatch, UseDispatch} from 'react-redux';
import {logout} from '../redux/reducers/auth.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO} from '../constants';

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
