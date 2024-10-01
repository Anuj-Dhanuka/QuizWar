import React, {useCallback, useEffect} from 'react';
import {
  View,
  ActivityIndicator,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {TransitionSpecs, CardStyleInterpolators} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

//context
import {useAuth} from '../context/AuthContext';

//route constants
import Routes from './RoutesConstants';

// Screens
import CategoriesScreen from '../screens/CategoriesScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TabNavigator from './TabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import SigninScreen from '../screens/SigninScreen';
import {
  fetchFromAsyncStorage,
  resetAuth,
  resetPerformance,
  resetGame,
} from '../store';

const Stack = createStackNavigator();

const Navigations = () => {
  const dispatch = useDispatch();
  const {user, loading} = useAuth();

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  useEffect(() => {
    // clearAll()
    // dispatch(resetAuth());
    // dispatch(resetPerformance());
    // dispatch(resetGame());
    dispatch(fetchFromAsyncStorage());
  });

  if (loading) {
    // Show loading screen while checking authentication status
    return (
      <>
      <StatusBar backgroundColor={"#6a11cb"} barStyle={"light-content"} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </>
    );
  }

  if (user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
        initialRouteName={Routes.TABS}>
        <Stack.Screen name={Routes.TABS} component={TabNavigator} />
        <Stack.Screen name={Routes.CATEGORIES} component={CategoriesScreen} />
        <Stack.Screen name={Routes.GAME} component={GameScreen} />
        <Stack.Screen name={Routes.RESULT} component={ResultScreen} />
        <Stack.Screen name={Routes.SETTINGS} component={SettingsScreen} />
        <Stack.Screen
          name={Routes.EDIT_PROFILE_SCREEN}
          component={EditProfileScreen}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
      initialRouteName={Routes.TABS}>
      <Stack.Screen name={Routes.SIGN_IN} component={SigninScreen} />
      <Stack.Screen name={Routes.REGISTRATION} component={RegistrationScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Navigations;
