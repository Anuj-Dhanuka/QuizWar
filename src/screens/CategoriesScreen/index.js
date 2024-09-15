import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';

// dimension utils
import { normalize, scaleVertical } from '../../utils/DimensionUtils';

// font utils
import { getInterFont } from '../../utils/FontUtils/interFontHelper';

// local components
import PopularCategories from './components/PopularCategories';
import AllCategoriesItem from './components/AllCategoriesItem';

const allCategories = [
  { id: '1', name: 'History', color: '#1E90FF', icon: 'book' },
  { id: '2', name: 'Mythology', color: '#00CED1', icon: 'globe' },
  { id: '3', name: 'Nature', color: '#32CD32', icon: 'leaf' },
  { id: '4', name: 'Travel', color: '#4682B4', icon: 'plane' },
  { id: '5', name: 'Health', color: '#FF4500', icon: 'heartbeat' },
  { id: '6', name: 'Mathematics', color: '#6A5ACD', icon: 'calculator' },
  { id: '7', name: 'Music', color: '#FF69B4', icon: 'music' },
  { id: '8', name: 'Programming', color: '#9370DB', icon: 'code' },
];

const CategoriesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar backgroundColor={"#6a11cb"} barStyle={"light-content"}  />
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={normalize(20)} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Animatable.View
              animation="fadeInRight" 
              duration={300}
              style={styles.iconContainer}
            >
              <TouchableOpacity onPress={clearSearch}>
                <Icon name="close-circle" size={normalize(20)} color="#666" />
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>

        {searchQuery === '' && (
          <>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <PopularCategories />
          </>
        )}

        <Text style={styles.sectionTitle}>All Categories</Text>
        {filteredCategories.length > 0 ? (
          <FlatList
            data={filteredCategories}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <AllCategoriesItem item={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.allCategoriesList}
          />
        ) : (
          <Text style={styles.noCategoriesText}>No categories found</Text>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: normalize(20),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(30),
    paddingVertical: scaleVertical(10),
    paddingHorizontal: normalize(15),
    marginTop: scaleVertical(30),
  },
  searchInput: {
    flex: 1,
    marginLeft: normalize(10),
    fontSize: normalize(16),
    ...getInterFont('Medium'),
    color: '#333',
  },
  iconContainer: {
    marginLeft: normalize(10),
  },
  sectionTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: scaleVertical(20),
    marginBottom: scaleVertical(24),
  },
  allCategoriesList: {
    paddingBottom: scaleVertical(24),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  noCategoriesText: {
    color: '#fff',
    fontSize: normalize(18),
    textAlign: 'center',
    marginTop: scaleVertical(20),
  },
});

export default CategoriesScreen;
