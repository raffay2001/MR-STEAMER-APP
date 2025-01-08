import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthNavStackParamList} from './navigation.types';

import {Login, SignUpOnBoarding, SplashScreen, Welcome} from '../screens';

const Auth_Screens: React.FC = () => {
  const Stack = createNativeStackNavigator<AuthNavStackParamList>();

  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignUpOnBoarding" component={SignUpOnBoarding} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default Auth_Screens;

const styles = StyleSheet.create({});
