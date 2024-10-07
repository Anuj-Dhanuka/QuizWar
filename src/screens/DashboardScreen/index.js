import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {normalize, scaleVertical} from '../../utils/DimensionUtils';
import {getInterFont} from '../../utils/FontUtils/interFontHelper';
import * as Animatable from 'react-native-animatable';

import {maxScoreOfGame} from '../../utils/CommonUtils.js/constants';

//utils //api utils
import { Apiutils } from '../../utils/ApiUtils';

// Dummy profile pictures
const profilePictures = {
  1: 'https://randomuser.me/api/portraits/men/1.jpg',
  2: 'https://randomuser.me/api/portraits/women/2.jpg',
  3: 'https://randomuser.me/api/portraits/men/3.jpg',
  4: 'https://randomuser.me/api/portraits/women/4.jpg',
  5: 'https://randomuser.me/api/portraits/men/5.jpg',
  6: 'https://randomuser.me/api/portraits/women/6.jpg',
  7: 'https://randomuser.me/api/portraits/men/7.jpg',
  8: 'https://randomuser.me/api/portraits/women/8.jpg',
  9: 'https://randomuser.me/api/portraits/men/9.jpg',
  10: 'https://randomuser.me/api/portraits/women/10.jpg',
};

// Logged-in user data (this could be dynamic based on authentication)
const loggedInUser = {
  id: '7',
  rank: 7,
  username: 'TriviaChamp',
  score: 45, // Capped value
  monthlyPoints: 8500,
  time: '6m 0s',
};

const DashboardScreen = () => {

  const fetchUserPerformanceData = async() => {
    const userPerformanceData = await Apiutils.fetchAllUsersPerformance()
    console.log(userPerformanceData)
  }

  useEffect(() => {
    fetchUserPerformanceData()
  }, [])
  
  useFocusEffect(() => {
    StatusBar.setBackgroundColor('#e1f5fe');
    StatusBar.setBarStyle('dark-content');
  });

  const userData = [
    {
      id: '1',
      rank: 1,
      username: 'QuizMaster',
      score: 75,
      monthlyPoints: 12000,
      time: '3m 50s',
    },
    {
      id: '2',
      rank: 2,
      username: 'Brainiac',
      score: 70,
      monthlyPoints: 11500,
      time: '4m 10s',
    },
    {
      id: '3',
      rank: 3,
      username: 'SmartyPants',
      score: 65,
      monthlyPoints: 11000,
      time: '4m 20s',
    },
    {
      id: '4',
      rank: 4,
      username: 'QuizNinja',
      score: 60,
      monthlyPoints: 10500,
      time: '5m 0s',
    },
    {
      id: '5',
      rank: 5,
      username: 'KnowledgeKing',
      score: 55,
      monthlyPoints: 10000,
      time: '5m 15s',
    },
    {
      id: '6',
      rank: 6,
      username: 'MasterMind',
      score: 50,
      monthlyPoints: 9500,
      time: '5m 30s',
    },
    {
      id: '7',
      rank: 7,
      username: 'TriviaChamp',
      score: 45,
      monthlyPoints: 8500,
      time: '6m 0s',
    }, // Logged in user
    {
      id: '8',
      rank: 8,
      username: 'BrainWarrior',
      score: 40,
      monthlyPoints: 8000,
      time: '6m 20s',
    },
    {
      id: '9',
      rank: 9,
      username: 'QuizPro',
      score: 35,
      monthlyPoints: 7500,
      time: '6m 40s',
    },
    {
      id: '10',
      rank: 10,
      username: 'GeniusGuru',
      score: 30,
      monthlyPoints: 7000,
      time: '7m 0s',
    },
  ];

  const renderUserItem = ({item}) => {
    const isTop3 = item.rank <= 3;
    const isCurrentUser = item.id === loggedInUser.id;
    const profilePic = profilePictures[item.rank] || profilePictures[1];

    return (
      <Animatable.View
        animation="fadeInUp"
        delay={item.rank * 100}
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
            #{item.rank}
          </Text>
          <Icon
            name="crown"
            size={normalize(24)}
            color={isTop3 ? '#FFD700' : '#bbb'}
            style={styles.crownIcon}
          />
        </View>

        <Image
          source={{uri: profilePic}}
          style={[
            styles.profilePic,
            {borderColor: isCurrentUser ? '#00bfff' : '#ccc'},
          ]}
        />

        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.scoreTimeContainer}>
              <Icon name="star" size={normalize(16)} color="#FFD700" />
              <Text style={styles.scoreText}>
                {item.score}/{maxScoreOfGame}
              </Text>
              <Icon
                name="calendar-month"
                size={normalize(16)}
                color="#ff5722"
              />
              <Text style={styles.monthlyPointsText}>
                {item.monthlyPoints.toLocaleString()} pts
              </Text>
            </View>
            <View style={styles.timeContainer}>
              <Icon name="clock-outline" size={normalize(16)} color="#32cd32" />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>

          <Animatable.View
            animation="fadeIn"
            duration={1000}
            style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${(item.score / 75) * 100}%`},
              ]}
            />
          </Animatable.View>
        </View>
      </Animatable.View>
    );
  };

  const renderLoggedInUserCard = () => (
    <Animatable.View
      animation="fadeInUp"
      style={[
        styles.userCard,
        {backgroundColor: '#cceeff', borderWidth: 2, borderColor: '#00bfff'},
      ]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText]}>#{loggedInUser.rank}</Text>
        <Icon
          name="account"
          size={normalize(24)}
          color="#00bfff"
          style={styles.crownIcon}
        />
      </View>

      <Image
        source={{uri: profilePictures[loggedInUser.rank]}}
        style={[styles.profilePic, {borderColor: '#00bfff'}]}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{loggedInUser.username}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.scoreTimeContainer}>
            <Icon name="star" size={normalize(16)} color="#FFD700" />
            <Text style={styles.scoreText}>
              {loggedInUser.score}/{maxScoreOfGame}
            </Text>
            <Icon name="calendar-month" size={normalize(16)} color="#ff5722" />
            <Text style={styles.monthlyPointsText}>
              {loggedInUser.monthlyPoints.toLocaleString()} pts
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Icon name="clock-outline" size={normalize(16)} color="#32cd32" />
            <Text style={styles.timeText}>{loggedInUser.time}</Text>
          </View>
        </View>

        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {width: `${(loggedInUser.score / 75) * 100}%`},
            ]}
          />
        </Animatable.View>
      </View>
    </Animatable.View>
  );

  const dataWithLoggedInUser = [
    {...loggedInUser, id: 'loggedInUser'},
    ...userData,
  ]; // Include logged-in user at the top

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar backgroundColor="#e1f5fe" barStyle={'dark-content'} />
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={dataWithLoggedInUser}
        renderItem={({item, index}) =>
          index === 0 ? renderLoggedInUserCard() : renderUserItem({item})
        }
        keyExtractor={item => item.id}
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
