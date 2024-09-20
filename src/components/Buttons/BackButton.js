import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';

//dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//common utils/ common functions
import {
  triggerButtonCLickSound,
  triggerHapticFeedback,
} from '../../utils/CommonUtils.js/commonFunctions';

const BackButton = ({screenName, color = '#FFFFFF', onPress}) => {
  const navigation = useNavigation();

  const authData = useSelector(state => state.auth);

  const {isHapticEnabled, isSoundEnabled} = authData;

  const handlePress = () => {
    if (isHapticEnabled) {
      triggerHapticFeedback();
    }
    if (isSoundEnabled) {
      triggerButtonCLickSound();
    }
    if (onPress) {
      onPress();
    } else {
      if (screenName) {
        navigation.navigate(screenName);
      } else {
        navigation.goBack();
      }
    }
  };
  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Icon name="arrow-left-thin" size={normalize(30)} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: normalize(100),
    marginTop: scaleVertical(16),
  },
  icon: {
    marginRight: normalize(5),
  },
});

export default BackButton;
