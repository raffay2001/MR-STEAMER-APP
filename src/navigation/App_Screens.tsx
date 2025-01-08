import React, {Fragment, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppNavStackParamList} from './navigation.types';
import {
  SplashScreen,
  Welcome,
  Vehicle,
  SignUpOnBoarding,
  Login,
  Register,
  CheckOut,
} from '../screens';
import MyDrawer from './Drawer';
import {SvgWrapper} from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';
const Stack = createNativeStackNavigator<AppNavStackParamList>();

const App_Screens: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Vehicle">
      <Stack.Screen
        name="Drawer"
        component={MyDrawer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        options={({navigation}) => ({
          headerTitleAlign: 'center',
          headerLeft: () => (
            <SvgWrapper
              xml={Icons.backIcon}
              width={15}
              height={15}
              icon={true}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
        name="Vehicle"
        component={Vehicle}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default App_Screens;
