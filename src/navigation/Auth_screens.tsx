import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavStackParamList } from './navigation.types';

import { Login, SignUpOnBoarding, SplashScreen, Welcome } from '../screens';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';

import i18n from '../i18n';

const Auth_Screens: React.FC = () => {
  const Stack = createNativeStackNavigator<AuthNavStackParamList>();

  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignUpOnBoarding" component={SignUpOnBoarding} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}>
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={() => ({ title: i18n.t('forgot.title') })}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={() => ({ title: i18n.t('reset.title') })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default Auth_Screens;

const styles = StyleSheet.create({});
