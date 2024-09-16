import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

const BackButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon name="arrow-left-thin" size={normalize(30)} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: normalize(100),
    marginTop: scaleVertical(16)
  },
  icon: {
    marginRight: normalize(5),
  },
});

export default BackButton;
