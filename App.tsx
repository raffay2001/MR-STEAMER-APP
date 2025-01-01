/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SplashScreen,
  Welcome,
  Vehicle,
  SignUpOnBoarding,
  Login,
  Register,
  CheckOut,
} from './src/screens';
import {RootStackParamList} from './src/services/types';
import {SvgWrapper} from './src/common/SvgWrapper';
import Icons from './src/assets/svgs/icons';
import MyDrawer from './src/navigation/Drawer';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen
              name="SignUpOnBoarding"
              component={SignUpOnBoarding}
            />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
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
      </NavigationContainer>
    </Provider>
  );
}

export default App;
