import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useAppSelector} from '../redux/store';
import {getAccessToken} from '../redux/reducers/auth.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN} from '../constants';
import App_Screens from './App_Screens';
import Auth_Screens from './Auth_screens';

const Main = () => {
  const authState = useAppSelector(getAccessToken);
  const [storedAccessToken, setStoredAccessToken] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndSetAccessToken = async () => {
      const storedToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      console.log('This is called', storedToken);
      setStoredAccessToken(storedToken);
    };
    fetchAndSetAccessToken();

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [authState]);

  return (
    <NavigationContainer>
      {(authState && authState !== '') || storedAccessToken ? (
        <>
          <App_Screens />
        </>
      ) : (
        <Auth_Screens />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default Main;
