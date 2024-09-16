import 'react-native-gesture-handler';
import React from 'react';
import {Text, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from './src/context/ThemeContext';

import {store, persistor} from './src/store/store';

import TestScreen from './src/screens/TestScreen';
import SigninScreen from './src/screens/SigninScreen';
import HomeScreen from './src/screens/HomeScreen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import CategoriesScreen from './src/screens/CategoriesScreen';
import GameScreen from './src/screens/GameScreen';
import {NavigationContainer} from '@react-navigation/native';
import ResultScreen from './src/screens/ResultScreen';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <NavigationContainer>
            <GestureHandlerRootView style={{flex: 1}}>
              <ResultScreen />
            </GestureHandlerRootView>
          </NavigationContainer>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
