import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { BackHandler } from "react-native";

export const useBackButton = (routeName, params) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Navigate to home screen when back button is pressed
          if (params) {
            navigation.navigate(routeName, params);
          } else {
            navigation.navigate(routeName);
          }
          return true; // Prevent default behavior (e.g., exit app)
        }
      );

      return () => backHandler.remove();
    }, [navigation, routeName, params])
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
