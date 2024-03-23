import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SplashScreen, Welcome, Home, Vehicle} from './src/screens';
import {RootStackParamList} from './src/types';
import {SvgWrapper} from './src/common/SvgWrapper';
import Icons from './src/assets/svgs/icons';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={Home} />
        </Stack.Group>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
