import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';

// dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

// font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//common utils/common functions
import {triggerButtonCLickSound, triggerHapticFeedback} from '../../utils/CommonUtils.js/commonFunctions';

//routes constants
import Routes from '../../Navigations/RoutesConstants';

//redux
import {startActiveSession} from '../../store/activeSessinSlice';

// local components
import PopularCategories from './components/PopularCategories';
import AllCategoriesItem from './components/AllCategoriesItem';
import BackButton from '../../components/Buttons/BackButton';


const CategoriesScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const authData = useSelector(state => state.auth);
  const {gameCategoriesData} = useSelector(state => state.gameCategories)
  
  const {isHapticEnabled, isSoundEnabled} = authData;

  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(() => {
    StatusBar.setBackgroundColor('#6a11cb');
    StatusBar.setBarStyle('light-content');
  });

  const filteredCategories = useMemo(() => {
    return gameCategoriesData?.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleCategoryCardPress = item => {
    console.log(item)
    if (isHapticEnabled) {
      triggerHapticFeedback();
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    dispatch(
      startActiveSession({
        activeCategoryId: item.id,
        activeCategoryName: item.name,
      }),
    );
    navigation.navigate(Routes.GAME);
  };

  return (
    <SafeAreaView style={styles.flexContainer}>
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
        <View style={styles.backButton}>
          <BackButton />
        </View>

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
              style={styles.iconContainer}>
              <TouchableOpacity onPress={clearSearch}>
                <Icon name="close-circle" size={normalize(20)} color="#666" />
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>

        {searchQuery === '' && (
          <>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <PopularCategories
              handleCategoryCardPress={handleCategoryCardPress}
            />
          </>
        )}

        <Text style={styles.sectionTitle}>All Categories</Text>
        {filteredCategories.length > 0 ? (
          <FlatList
            data={filteredCategories}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <AllCategoriesItem
                item={item}
                handleCategoryCardPress={handleCategoryCardPress}
              />
            )}
            keyExtractor={item => item.id}
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
  backButton: {
    marginLeft: normalize(12),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: normalize(30),
    paddingVertical: scaleVertical(10),
    paddingHorizontal: normalize(15),
    marginTop: scaleVertical(16),
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
