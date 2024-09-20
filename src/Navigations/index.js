import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';

//route constants
import Routes from './RoutesConstants';

// Screens
import CategoriesScreen from '../screens/CategoriesScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();

const Navigations = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // Horizontal slide transition
      }}
      initialRouteName={Routes.TABS}
    >
      <Stack.Screen name={Routes.TABS} component={TabNavigator} />
      <Stack.Screen name={Routes.CATEGORIES} component={CategoriesScreen} />
      <Stack.Screen name={Routes.GAME} component={GameScreen} />
      <Stack.Screen name={Routes.RESULT} component={ResultScreen} />
      <Stack.Screen name={Routes.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={Routes.EDIT_PROFILE_SCREEN} component={EditProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigations;
