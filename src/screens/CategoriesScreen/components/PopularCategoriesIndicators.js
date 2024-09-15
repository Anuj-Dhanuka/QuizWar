import React from 'react';
import {StyleSheet, View} from 'react-native';

//font utils
import {scaleVertical, normalize} from '../../../utils/DimensionUtils';

const PopularCategoriesIndicators = ({items, paginationIndex}) => {
  const baseItemsLength = items.length;

  return (
    <View style={styles.container}>
      {Array(baseItemsLength).fill(null).map((_, index) => {
        return (
          <View
            key={index}
            style={[styles.dot(paginationIndex, index)]}
          />
        );
      })}
    </View>
  );
};

export default React.memo(PopularCategoriesIndicators);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleVertical(16)
  },
  dot: (paginationIndex, index) => ({
    width: paginationIndex === index ? normalize(8) :  normalize(6),
    height: paginationIndex === index ? normalize(8) :  normalize(6),
    borderRadius: normalize(10),
    marginHorizontal: normalize(3),
    backgroundColor: paginationIndex === index ? '#FFFFFF' : '#aaa',
  }),
});
