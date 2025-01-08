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
import {store, persistor} from './src/redux/store';
import Toast from 'react-native-toast-message';
import toastConfig from './src/utils/toastConfig';
import Main from './src/navigation/Main';
import {PersistGate} from 'redux-persist/integration/react';
const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
      </PersistGate>
      <Toast config={toastConfig} />
    </Provider>
  );
}

export default App;
