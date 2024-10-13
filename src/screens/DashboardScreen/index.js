import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {normalize, scaleVertical} from '../../utils/DimensionUtils';
import {getInterFont} from '../../utils/FontUtils/interFontHelper';
import * as Animatable from 'react-native-animatable';

//Utils //Common Utils
import {maxScoreOfGame} from '../../utils/CommonUtils.js/constants';

//Utils //Api Utils
import {Apiutils} from '../../utils/ApiUtils';

//Context
import {useAuth} from '../../context/AuthContext';

const DashboardScreen = () => {
  const {user} = useAuth();

  const [allUserPerformance, setAllUserPerformance] = useState([]);
  const [loggedInUserPerformance, setLoggedInUserPerformance] = useState(null);
  const [loggedInUserRank, setLoggedInUserRank] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserPerformanceData = async () => {
    try {
      const allUsers = await Apiutils.fetchAllUsersPerformance();
      const loggedInUser = allUsers.find(u => u.userId === user.userId);

      const sortedUsers = allUsers.sort((a, b) => {
        if (a.highestScore !== b.highestScore)
          return b.highestScore - a.highestScore;
        if (a.leastTimeTakenByUser !== b.leastTimeTakenByUser)
          return a.leastTimeTakenByUser - b.leastTimeTakenByUser;
        if (a.monthlyPoints !== b.monthlyPoints)
          return b.monthlyPoints - a.monthlyPoints;
        return b.totalPoints - a.totalPoints;
      });

      const userRank = sortedUsers.findIndex(u => u.userId === user.userId) + 1;

      console.log(sortedUsers);

      setAllUserPerformance(sortedUsers);
      setLoggedInUserPerformance(loggedInUser);
      setLoggedInUserRank(userRank);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true); // Show refreshing spinner
    await fetchUserPerformanceData();
    setIsRefreshing(false); // Hide refreshing spinner
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserPerformanceData();

      StatusBar.setBackgroundColor('#e1f5fe');
      StatusBar.setBarStyle('dark-content');
    }, []),
  );

  const renderLoggedInUserCard = () => (
    <Animatable.View
      animation="fadeInUp"
      style={[
        styles.userCard,
        {backgroundColor: '#cceeff', borderWidth: 2, borderColor: '#00bfff'},
      ]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText]}>#{loggedInUserRank}</Text>
        <Icon
          name="account"
          size={normalize(24)}
          color="#00bfff"
          style={styles.crownIcon}
        />
      </View>

      <Image
        source={
          loggedInUserPerformance?.profilePicture
            ? {uri: loggedInUserPerformance?.profilePicture}
            : require('../../assets/images/default_profile.png')
        }
        style={[styles.profilePic, {borderColor: '#00bfff'}]}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>
          {loggedInUserPerformance?.userName || 'Guest'}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.scoreTimeContainer}>
            <Icon name="star" size={normalize(16)} color="#FFD700" />
            <Text style={styles.scoreText}>
              {loggedInUserPerformance?.highestScore}/{maxScoreOfGame}
            </Text>
            <Icon name="calendar-month" size={normalize(16)} color="#ff5722" />
            <Text style={styles.monthlyPointsText}>
              {loggedInUserPerformance?.monthlyPoints.toLocaleString()} pts
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Icon name="clock-outline" size={normalize(16)} color="#32cd32" />
            <Text style={styles.timeText}>
              {loggedInUserPerformance?.leastTimeTakenByUser || 0}
            </Text>
          </View>
        </View>

        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {width: `${(loggedInUserPerformance?.highestScore / 75) * 100}%`},
            ]}
          />
        </Animatable.View>
      </View>
    </Animatable.View>
  );

  const renderUserItem = ({item, index}) => {
    const isTop3 = index <= 3;
    const isCurrentUser = item?.userId === user?.userId;

    return (
      <>
        <Animatable.View
          animation="fadeInUp"
          delay={index * 100}
          style={[
            styles.userCard,
            isTop3 && {
              borderColor: '#FFD700',
              backgroundColor: '#fff8e1',
              borderWidth: 2,
            },
            isCurrentUser && {
              backgroundColor: '#cceeff',
              borderWidth: 2,
              borderColor: '#00bfff',
            },
          ]}>
          <View style={styles.rankContainer}>
            <Text style={[styles.rankText, isTop3 && styles.topRankText]}>
              #{index}
            </Text>
            <Icon
              name="crown"
              size={normalize(24)}
              color={isTop3 ? '#FFD700' : '#bbb'}
              style={styles.crownIcon}
            />
          </View>

          <Image
            source={
              loggedInUserPerformance?.profilePicture
                ? {uri: item?.profilePicture}
                : require('../../assets/images/default_profile.png')
            }
            style={[styles.profilePic, {borderColor: '#00bfff'}]}
          />

          <View style={styles.userInfo}>
            <Text style={styles.username}>{item?.userName || 'Guest'}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.scoreTimeContainer}>
                <Icon name="star" size={normalize(16)} color="#FFD700" />
                <Text style={styles?.scoreText}>
                  {item.highestScore}/{maxScoreOfGame}
                </Text>
                <Icon
                  name="calendar-month"
                  size={normalize(16)}
                  color="#ff5722"
                />
                <Text style={styles.monthlyPointsText}>
                  {item?.monthlyPoints.toLocaleString()} pts
                </Text>
              </View>
              <View style={styles.timeContainer}>
                <Icon
                  name="clock-outline"
                  size={normalize(16)}
                  color="#32cd32"
                />
                <Text style={styles.timeText}>
                  {item.leastTimeTakenByUser || 0}
                </Text>
              </View>
            </View>

            <Animatable.View
              animation="fadeIn"
              duration={1000}
              style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${(item?.highestScore / 75) * 100}%`},
                ]}
              />
            </Animatable.View>
          </View>
        </Animatable.View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar backgroundColor="#e1f5fe" barStyle={'dark-content'} />
      <Text style={styles.title}>Leaderboard</Text>
      {renderLoggedInUserCard()}
      <FlatList
        data={allUserPerformance}
        renderItem={({item, index}) => renderUserItem({item, index})}
        keyExtractor={item => item.userId}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    backgroundColor: '#e1f5fe',
    paddingBottom: scaleVertical(80),
  },
  title: {
    fontSize: normalize(28),
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: scaleVertical(24),
    ...getInterFont('Bold'),
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleVertical(15),
    paddingHorizontal: normalize(15),
    marginHorizontal: normalize(20),
    backgroundColor: '#fff',
    borderRadius: normalize(15),
    marginBottom: scaleVertical(15),
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: normalize(15),
    shadowOffset: {width: 0, height: normalize(10)},
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
    marginRight: normalize(8),
    ...getInterFont('Bold'),
  },
  topRankText: {
    color: '#FFD700',
  },
  crownIcon: {
    marginLeft: normalize(5),
  },
  profilePic: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(30),
    marginRight: normalize(15),
    borderWidth: 2,
    borderColor: '#ccc',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: normalize(18),
    color: '#333',
    fontWeight: 'bold',
    marginBottom: scaleVertical(5),
    ...getInterFont('Bold'),
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  scoreTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleVertical(10),
    flex: 1,
  },
  scoreText: {
    fontSize: normalize(12),
    color: '#333',
    marginLeft: normalize(5),
    marginRight: normalize(5),
    ...getInterFont('Medium'),
  },
  monthlyPointsText: {
    fontSize: normalize(12),
    color: '#ff5722',
    marginLeft: normalize(5),
    marginRight: normalize(20),
    ...getInterFont('Medium'),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  timeText: {
    fontSize: normalize(12),
    color: '#32cd32',
    marginLeft: normalize(5),
    ...getInterFont('Medium'),
  },
  progressBar: {
    height: normalize(8),
    backgroundColor: '#e0e0e0',
    borderRadius: normalize(4),
    marginTop: scaleVertical(10),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
    borderRadius: normalize(4),
  },
});

export default DashboardScreen;
