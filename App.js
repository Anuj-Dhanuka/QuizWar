import React from 'react';
import { StatusBar } from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import BootSplash from "react-native-bootsplash";

//store
import {store, persistor} from './src/store/store';

//context
import {ThemeProvider} from './src/context/ThemeContext';

//navigations
import Navigations from './src/Navigations';
import {AuthProvider} from './src/context/AuthContext';
import {NavigationContainer} from '@react-navigation/native';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <GestureHandlerRootView style={{flex: 1}}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
              <NavigationContainer
                onReady={() => {
                  BootSplash.hide();
                }}>
                <Navigations />
              </NavigationContainer>
            </GestureHandlerRootView>
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
