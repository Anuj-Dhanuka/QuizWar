import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

//store
import {store, persistor} from './src/store/store';

//context
import {ThemeProvider} from './src/context/ThemeContext';

//navigations
import Navigations from './src/Navigations';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
            <GestureHandlerRootView style={{flex: 1}}>
              <Navigations />
            </GestureHandlerRootView>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
