import { StyleSheet, View, StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import App_Screens from './App_Screens';
import Auth_Screens from './Auth_screens';
import { getAccessToken } from '../hooks/useAuthStorage';
import SplashScreenImg from '../assets/svgs/SplashScreenImgNew.svg';

const Main = () => {
  const [storedAccessToken, setStoredAccessToken] = useState<string | null>(null);
  const [boot, setBoot] = useState(true);

  const refreshTokenFromStorage = React.useCallback(async () => {
    const t = await getAccessToken();
    setStoredAccessToken(t);
  }, []);

  useEffect(() => { refreshTokenFromStorage(); }, [refreshTokenFromStorage]);

  useEffect(() => {
    const id = setTimeout(() => setBoot(false), 2000);
    return () => clearTimeout(id);
  }, []);

  if (boot) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <SplashScreenImg width={309} height={91} />
      </View>
    );
  }

  return (
    <NavigationContainer
      onReady={refreshTokenFromStorage}
      onStateChange={refreshTokenFromStorage}
      key={storedAccessToken ? 'app' : 'auth'}
    >
      {storedAccessToken ? (
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
