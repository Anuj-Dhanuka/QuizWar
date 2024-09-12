import React from 'react';
import {Text, View} from 'react-native';

import {ThemeProvider} from './src/context/ThemeContext';

import TestScreen from './src/screens/TestScreen';
import Input from './src/screens/SigninScreen/components/Input';
import OtpInput from './src/screens/SigninScreen/components/OtpInput';
import SigninScreen from './src/screens/SigninScreen';

function App() {
  return (
    <ThemeProvider>
            <SigninScreen />

    </ThemeProvider>
  );
}

export default App;
