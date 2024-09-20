import React from "react";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";

// Context
import { useTheme } from "../../context/ThemeContext";

//dimension utils
import { normalize } from "../../utils/DimensionUtils";

//font utils
import { getInterFont } from "../../utils/FontUtils/interFontHelper";

/*
 * Usage:
 *   <Button [action, usage: {filled, reversed, disabled}, custom style (button and text)]>
 *     [Write your text here]
 *   </Button>
 *
 * Props:
 *   onPress: Handler to be called when the user taps the button
 *   reversed: Reversed style to regular button, so that even though button is clickable, user doesn't feel like clicking it (set to false by default)
 *   disabled: Unclickable button (set to false by default)
 *   buttonStyle: Custom style passed to the button
 *   textStyle: Custom style passed to the text of the button
 */

const Button = ({
  children = null,
  onPress = () => {},
  loading = false,
  reversed = false,
  disabled = false,
  buttonStyle = {},
  textStyle = {},
  loadingStyle = {},
  hasCustomChild = false,
}) => {
  const { currentTheme } = useTheme();

  const content = loading ? (
    <View style={[styles.loadingDefaultStyle, loadingStyle]}>
      <ActivityIndicator
        size="small"
        color={disabled || reversed ? "#000000" : "#FFFFFF"}
      />
    </View>
  ) : hasCustomChild ? (
    children
  ) : (
    <Text
      style={[
        styles.defaultTextStyle,
        { color: "#000000" },
        reversed ? { color: currentTheme.black } : {},
        disabled ? { color: currentTheme.black } : {},
        textStyle,
      ]}
    >
      {children}
    </Text>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!!(disabled || loading)}
      style={[
        styles.defaultButtonStyle,
        { backgroundColor: currentTheme.green },
        reversed
          ? [styles.reversedButtonStyle, { borderColor: currentTheme.white }]
          : {},
        disabled ? { backgroundColor: currentTheme.gray } : {},
        buttonStyle,
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultButtonStyle: {
    borderRadius: normalize(15),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  reversedButtonStyle: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  defaultTextStyle: {
    fontSize: normalize(13),
    textAlign: "center",
    textTransform: "uppercase",
    padding: normalize(8),
    ...getInterFont("Medium")
  },
  loadingDefaultStyle: {
    padding: normalize(5),
  },
});

export default Button;
