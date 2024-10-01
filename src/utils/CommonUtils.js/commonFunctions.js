import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {BackHandler} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-sound';
import Toast from 'react-native-simple-toast';

export const storeTokenAndUserId = async (token, userId) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userId', userId);
  } catch (e) {
    Toast.show(
      `Failed to save token and userId in AsyncStorage ${e}`,
      Toast.LONG,
    );
    console.log('Failed to save token and userId in AsyncStorage', e);
  }
};

export const getTokenAndUserId = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');

    if (token !== null && userId !== null) {
      return { token, userId };
    } else {
      Toast.show('No token or userId found in AsyncStorage', Toast.LONG);
      return null;
    }
  } catch (e) {
    Toast.show(
      `Failed to fetch token and userId from AsyncStorage ${e}`,
      Toast.LONG,
    );
    console.log('Failed to fetch token and userId from AsyncStorage', e);
    return null;
  }
};


export const triggerButtonCLickSound = (sound = "buttonclick.mp3") => {
  var sound = new Sound(sound, Sound.MAIN_BUNDLE, error => {
    if (error) {
      Toast.show(`failed to load the sound. ${error}`, Toast.LONG);
      return;
    }
    // loaded successfully
    //Toast.show('Loaded successfully', Toast.LONG);
    sound.play(success => {
      if (success) {
        //Toast.show('successfully finished playing.', Toast.LONG);
      } else {
        Toast.show('playback failed due to audio decoding errors.', Toast.LONG);
      }
    });
  });
};

export const triggerHapticFeedback = (type = 'impactLight', options = {}) => {
  const defaultOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const mergedOptions = {...defaultOptions, ...options};

  ReactNativeHapticFeedback.trigger(type, mergedOptions);
};

export const useBackButton = (routeName, params) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (params) {
            navigation.navigate(routeName, params);
          } else {
            navigation.navigate(routeName);
          }
          return true;
        },
      );

      return () => backHandler.remove();
    }, [navigation, routeName, params]),
  );
};

export const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};


export const useGameBackButton = (handleBackButton) => {
  const navigation = useNavigation()
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBackButton()
          return true;
        },
      );

      return () => backHandler.remove();
    }, [navigation]),
  );
};