import React from 'react';
import {Text, StyleSheet, Pressable} from 'react-native';
import * as Animatable from 'react-native-animatable'; // Import Animatable

//context
import {useTheme} from '../../../context/ThemeContext';

//dimension utils
import {normalize, scaleVertical} from '../../../utils/DimensionUtils';

//font utils
import {getInterFont} from '../../../utils/FontUtils/interFontHelper';

const OptionButton = ({
  text,
  buttonId,
  answerClickHandler,
  checkAns,
  correctOption,
  isDisable,
}) => {
  const {currentTheme} = useTheme();

  let hasGreenBorder = false;

  if (buttonId === correctOption) {
    hasGreenBorder = true;
  }

  const styles = getStyles(currentTheme, hasGreenBorder);

  let btnBackgroundColor = 'transparent';
  let btnBorderWidth = hasGreenBorder ? scaleVertical(4) : scaleVertical(2);

  if (checkAns.id === buttonId) {
    btnBorderWidth = 0;
    if (checkAns.ans) {
      btnBackgroundColor = '#1CAE4A';
    } else {
      btnBackgroundColor = '#EA596E';
    }
  }

  let animationType = null;
  if (checkAns.id === buttonId) {
    animationType = checkAns.ans ? 'pulse' : 'shake';
  } else if (buttonId === correctOption) {
    animationType = 'rubberBand';
  }

  return (
    <Animatable.View
      animation={animationType}
      duration={800}
      easing="ease-in-out">
      <Pressable
        style={[
          styles.optionButton,
          {backgroundColor: btnBackgroundColor, borderWidth: btnBorderWidth},
        ]}
        onPress={() => answerClickHandler(buttonId)} // Pass button ID to handler
        disabled={isDisable} // Disable button after first click
      >
        <Text style={styles.optionText}>{text}</Text>
      </Pressable>
    </Animatable.View>
  );
};

const getStyles = (theme, hasGreenBorder) =>
  StyleSheet.create({
    optionButton: {
      height: scaleVertical(94),
      borderWidth: normalize(2),
      borderColor: hasGreenBorder ? '#1CAE4A' : '#ADADAD',
      backgroundColor: 'transparent',
      marginVertical: scaleVertical(5),
      borderRadius: normalize(14),
      alignItems: 'center',
      justifyContent: 'center',
      width: scaleVertical(340 / 2),
      padding: normalize(4),
    },
    optionText: {
      fontSize: normalize(20),
      color: '#FFFFFF',
      textAlign: 'center',
      ...getInterFont('Bold'),
    },
  });

export default OptionButton;
