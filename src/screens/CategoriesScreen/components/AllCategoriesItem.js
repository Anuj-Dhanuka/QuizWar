import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

//dimension utils
import { normalize, scaleVertical } from '../../../utils/DimensionUtils';
//font utils
import { getInterFont } from '../../../utils/FontUtils/interFontHelper';

const AllCategoriesItem = ({ item }) => {
  // Shared values for animations
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  // Fade in and scale animation on mount
  useEffect(() => {
    scale.value = withTiming(1, { duration: 500 });
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  // Handle press interaction
  const handlePressIn = () => {
    scale.value = withSpring(0.95, { stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { stiffness: 200 });
  };

  const handleOnCategoryPress = () => {
    console.log(item)
  }

  return (
    <Animated.View style={[styles.categoryCard, { backgroundColor: item.color }, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={handleOnCategoryPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon name={item.icon} size={normalize(30)} color="#FFF" />
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AllCategoriesItem;

const styles = StyleSheet.create({
  categoryCard: {
    borderRadius: normalize(20),
    padding: normalize(15),
    margin: normalize(10),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(120),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: normalize(10),
    shadowOffset: { width: 0, height: scaleVertical(5) },
    elevation: 5,
  },
  touchableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  categoryText: {
    fontSize: normalize(16),
    color: '#FFF',
    marginTop: scaleVertical(10),
    ...getInterFont('Medium'),
  },
});
