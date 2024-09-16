import React, {useRef, useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

// Local components
import PopularCategoriesSliderItem from './PopularCategoriesSliderItem';
import PopularCategoriesIndicators from './PopularCategoriesIndicators';

// Constants
import {
  ITEM_WIDTH,
  SPACER_WIDTH,
  ITEM_SPACING,
} from '../../../utils/CommonUtils.js/constants';

// Sample Data
const popularCategories = [
  {id: '1', name: 'History', color: '#1E90FF', icon: 'book-open-page-variant'},
  {id: '2', name: 'Mythology', color: '#00CED1', icon: 'account-group'}, // (Represents groups of gods or mythical beings)
  {id: '3', name: 'Nature', color: '#32CD32', icon: 'tree'},
  {id: '4', name: 'Travel', color: '#4682B4', icon: 'airplane'},
  {id: '5', name: 'Health', color: '#FF4500', icon: 'heart-pulse'},
  {id: '6', name: 'Mathematics', color: '#6A5ACD', icon: 'math-compass'},
  {id: '7', name: 'Music', color: '#FF69B4', icon: 'music-note'},
  {id: '8', name: 'Programming', color: '#9370DB', icon: 'code-tags'},
];

const PopularCategories = () => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [data, setData] = useState(popularCategories);

  const scrollX = useSharedValue(0);
  const offset = useSharedValue(0)
  const flatlistRef = useAnimatedRef()
  const interval = useRef()

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== undefined) {
      setPaginationIndex(viewableItems[0].index % popularCategories.length);
    }
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig: viewabilityConfig.current, onViewableItemsChanged},
  ]);

  useEffect(() => {
    if (isAutoPlay === true) {
      interval.current = setInterval(() => {
        offset.value = offset.value + (ITEM_WIDTH + ITEM_SPACING);
  
        if (offset.value >= (data.length - 1) * (ITEM_WIDTH + ITEM_SPACING)) {
          offset.value = 0;
        }
      }, 3000);
    } else {
      clearInterval(interval.current);
    }
  
    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset, data.length]);
  

  useDerivedValue(() => {
    scrollTo(flatlistRef, offset.value, 0, true)
  })

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd :(e) => {
      offset.value = e.contentOffset.x
    }
  });

  const handlePress = (item) => {
    console.log('Category Pressed:', item.name);
    // Add your navigation or action logic here
  };

  const onEndReachedHandler = useCallback(() => {
    const newItems = popularCategories.map((item, index) => ({
      ...item,
      id: `${item.id}-${data.length + index}`,
    }));
    setData((prevData) => [...prevData, ...newItems]);
  }, [data]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatlistRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => (
          <PopularCategoriesSliderItem item={item} index={index} scrollX={scrollX} onPress={handlePress} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="normal"
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={() => <View style={styles.itemSeperator} />}
        initialNumToRender={3} 
        maxToRenderPerBatch={3} 
        onEndReached={onEndReachedHandler}
        onEndReachedThreshold={0.5}
        getItemLayout={(data, index) => ({
          length: ITEM_WIDTH + ITEM_SPACING,
          offset: (ITEM_WIDTH + ITEM_SPACING) * index,
          index,
        })}
        onScrollBeginDrag={() => {setIsAutoPlay(false)}}
        onScrollEndDrag={() => setIsAutoPlay(true)}
      />
      <PopularCategoriesIndicators
        items={popularCategories}
        paginationIndex={paginationIndex}
      />
    </View>
  );
};

export default React.memo(PopularCategories);  // Memoize the entire component

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    paddingHorizontal: SPACER_WIDTH,
  },
  itemSeperator: {
    width: ITEM_SPACING
  }
});
