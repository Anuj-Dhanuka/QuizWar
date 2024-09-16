import React, { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

//context
import { useTheme } from "../../../context/ThemeContext";

//dimension utils
import { normalize, scaleVertical } from "../../../utils/DimensionUtils";


const OptionButton = ({
  text,
  buttonId,
  answerClickHandler,
  checkAns,
  correctOption,
  isDisable
}) => {
  
  const { currentTheme } = useTheme();

  let hasGreenBorder = false;

  if (buttonId === correctOption) {
    hasGreenBorder = true;
  }

  const styles = getStyles(currentTheme, hasGreenBorder);

  let btnBackgroundColor = "transparent";
  let btnBorderWidth = hasGreenBorder ? scaleVertical(4) : scaleVertical(2);
  
  if (checkAns.id === buttonId) {
    btnBorderWidth = 0;
    if (checkAns.ans) {
      btnBackgroundColor = "#1CAE4A";
    } else {
      btnBackgroundColor = "#EA596E";
    }
  }
  const [isPressed, setIsPressed] = useState(false);


  const handlePress = () => {
    setIsPressed(!isPressed);
    answerClickHandler(buttonId);
  };

  return (
    <Pressable
      style={[
        styles.optionButton,
        { backgroundColor: btnBackgroundColor, borderWidth: btnBorderWidth },
      ]}
      onPress={handlePress}
      id={buttonId}
      disabled={isDisable}
    >
      <Text style={styles.optionText}>{text}</Text>
    </Pressable>
  );
};

const getStyles = (theme, hasGreenBorder) =>
  StyleSheet.create({
    optionButton: {
      height: scaleVertical(94),
      borderWidth: normalize(2),
      borderColor: hasGreenBorder ? "#1CAE4A" : "#ADADAD",
      backgroundColor: "transparent",
      marginVertical: scaleVertical(5),
      borderRadius: normalize(14),
      alignItems: "center",
      justifyContent: "center",
      width: scaleVertical(340 / 2),
      padding: normalize(4),
    },
    optionText: {
      fontSize: normalize(20),
      color: "#FFFFFF",
      fontWeight: "700",
      textAlign: "center",
    },
  });

export default OptionButton;
