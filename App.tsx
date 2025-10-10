/* eslint-disable react/no-unstable-nested-components */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';

import { store, persistor } from './src/redux/store';
import Main from './src/navigation/Main';
import toastConfig from './src/utils/toastConfig';

import './src/i18n';
import { applyRtlIfNeeded } from './src/utils/i18nRtl';

function App(): React.JSX.Element {

  useEffect(() => {
    applyRtlIfNeeded();

    // Google
    GoogleSignin.configure({
      webClientId: '613815714497-neapamv21sgtnp1hk6ou67uhtgga9aom.apps.googleusercontent.com',
    });
  }, []);

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
