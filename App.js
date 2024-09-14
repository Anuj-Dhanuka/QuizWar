import React from 'react';
import {Text, View} from 'react-native';

import {ThemeProvider} from './src/context/ThemeContext';

import {store, persistor} from './src/store/store';

import TestScreen from './src/screens/TestScreen';
import SigninScreen from './src/screens/SigninScreen';
import HomeScreen from './src/screens/HomeScreen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <HomeScreen />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
