/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen, Welcome, Vehicle} from './src/screens';
import {RootStackParamList} from './src/types';
import {SvgWrapper} from './src/common/SvgWrapper';
import Icons from './src/assets/svgs/icons';
import MyDrawer from './src/navigation/Drawer';

const Stack = createNativeStackNavigator<RootStackParamList>();
// const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
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
        {/* <Stack.Screen name="Home" component={Home} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
