import React, {useEffect, useState} from 'react';
import { useColorScheme } from 'react-native';
import {persistStore} from 'redux-persist';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ToastProvider} from 'react-native-toast-notifications';
import Navigation from './src/components/Navigation';
import store from './src/redux/store';

const persistor = persistStore(store);

const App = () => {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider>
          <Navigation />
        </ToastProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
