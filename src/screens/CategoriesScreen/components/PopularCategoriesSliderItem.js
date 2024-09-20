import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

// Dimension utils
import {normalize, scaleVertical} from '../../../utils/DimensionUtils';

// Font utils
import {getInterFont} from '../../../utils/FontUtils/interFontHelper';

//common utils/constants
import {ITEM_WIDTH, ITEM_SPACING} from '../../../utils/CommonUtils.js/constants';

const PopularCategoriesSliderItem = ({item, index, scrollX, onPress}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [
              (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
              index * (ITEM_WIDTH + ITEM_SPACING),
              (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
            ],
            [0.8, 1, 0.8],
            Extrapolation.CLAMP
          ),
        },
        {
          translateX: interpolate(
            scrollX.value,
            [
              (index - 1) * (ITEM_WIDTH + ITEM_SPACING),
              index * (ITEM_WIDTH + ITEM_SPACING),
              (index + 1) * (ITEM_WIDTH + ITEM_SPACING),
            ],
            [-ITEM_SPACING, 0, ITEM_SPACING],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const handleItemClick = () => {
    onPress(item)
  }
  
  return (
    <Animated.View style={[styles.sliderItemOuterContainer, animatedStyle]}>
      <TouchableOpacity 
        style={styles.sliderItemContainer(item.color)} 
        onPress={handleItemClick}  // Handle press
        activeOpacity={0.7}  // Optional: Change opacity when pressed
      >
        <Icon name={item.icon} size={normalize(50)} color="#FFF" />
        <Text style={styles.sliderItemText}>{item.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default React.memo(PopularCategoriesSliderItem);

const styles = StyleSheet.create({
  sliderItemOuterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ITEM_WIDTH,
  },
  sliderItemContainer: (color) => ({
    height: scaleVertical(140),
    width: ITEM_WIDTH,
    backgroundColor: color,
    borderRadius: normalize(12),
    justifyContent: 'center',
    alignItems: 'center',
  }),
  sliderItemText: {
    fontSize: normalize(16),
    color: '#FFFFFF',
    marginTop: scaleVertical(10),
    letterSpacing: 1.5,
    ...getInterFont('Medium'),
  },
});
