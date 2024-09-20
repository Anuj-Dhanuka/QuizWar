import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

// dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

// font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//common utils/common functions
import {
  triggerButtonCLickSound,
  triggerHapticFeedback,
} from '../../utils/CommonUtils.js/commonFunctions';

//redux
import {
  resetAuth,
  resetPerformance,
  resetGame,
  updateLastLoginDate,
  incrementStreak,
  resetStreak,
} from '../../store';

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const userPerformance = useSelector(state => state.userPerformance);
  const authData = useSelector(state => state.auth);

  const {isHapticEnabled, isSoundEnabled} = authData;

  // dispatch(resetAuth())
  // dispatch(resetPerformance())
  // dispatch(resetGame())

  useFocusEffect(() => {
    StatusBar.setBackgroundColor('#6a11cb');
    StatusBar.setBarStyle('light-content');
  });

  useEffect(() => {
    const today = moment().startOf('day');

    if (userPerformance.lastLoginDate) {
      const lastLoginMoment = moment(userPerformance.lastLoginDate).startOf(
        'day',
      );

      if (today.diff(lastLoginMoment, 'days') === 1) {
        dispatch(incrementStreak());
      } else if (today.diff(lastLoginMoment, 'days') > 1) {
        dispatch(resetStreak());
      }
    } else {
      dispatch(incrementStreak());
    }

    dispatch(updateLastLoginDate(today.toISOString()));
  }, [dispatch, userPerformance.lastLoginDate]);

  const handleDefaultPlayNow = () => {
    if (isHapticEnabled) {
      triggerHapticFeedback();
    }
    if (isSoundEnabled) {
      triggerButtonCLickSound();
    }
    navigation.navigate('Categories');
  };

  const handleWeeklyTournamentPlay = () => {
    if (isSoundEnabled) {
      triggerButtonCLickSound();
    }
    if (isHapticEnabled) {
      triggerHapticFeedback();
    }
  };

  const userStats = [
    {
      id: '1',
      value: userPerformance.streak,
      iconName: 'fire',
      label: 'Streak',
      color: 'orange',
    },
    {
      id: '2',
      value: userPerformance.quizzesCompleted,
      iconName: 'check-circle',
      label: 'Quizzes',
      color: '#32cd32',
    },
    {
      id: '4',
      value: userPerformance.monthlyPoints,
      iconName: 'calendar-star',
      label: 'Monthly Points',
      color: '#00bfff',
    },
  ];

  const renderStatItem = item => (
    <View style={styles.statContainer} key={item.id}>
      <Text style={styles.statLabel}>{item.label} - </Text>
      <Text style={styles.statValue}>{item.value.toLocaleString()}</Text>
      <Icon
        name={item.iconName}
        size={normalize(18)}
        color={item.color}
        style={styles.statIcon}
      />
    </View>
  );

  const tournaments = [
    {
      id: '1',
      title: 'Weekly Challenge',
      details: 'Ends in 3 days',
      iconName: 'calendar-clock',
      reward: 'Cash Prize',
    },
    {
      id: '2',
      title: 'Monthly Marathon',
      details: 'Ends in 20 days',
      iconName: 'calendar-month',
      reward: 'Cash Prize',
    },
  ];

  const renderTournamentItem = ({item}) => (
    <Animatable.View
      animation="zoomIn"
      duration={500}
      style={styles.tournamentCard}>
      <Text style={styles.tournamentTitle}>{item.title}</Text>
      <View style={styles.tournamentDetailsContainer}>
        <Icon name={item.iconName} size={normalize(18)} color="#666" />
        <Text style={styles.tournamentDetails}>{item.details}</Text>
      </View>
      <View style={styles.rewardContainer}>
        <Icon name="gift" size={normalize(18)} color="#ff5f6d" />
        <Text style={styles.rewardText}>{item.reward}</Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        activeOpacity={0.8}
        onPress={handleWeeklyTournamentPlay}>
        <Text style={styles.joinButtonText}>Play Now</Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.flexContainer}>
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>

        <View style={[styles.totalPointsContainer]}>
          <Text style={styles.statLabel}>Total points - </Text>
          <Text style={styles.statValue}>
            {userPerformance.totalPoints.toLocaleString()}
          </Text>
          <Icon
            name={'star'}
            size={normalize(18)}
            color={'#ffd700'}
            style={styles.statIcon}
          />
        </View>

        <View style={styles.iqContainer}>
          <Text style={styles.iqText}>Level: {userPerformance.level}</Text>
        </View>

        <View style={styles.statsContainer}>
          {userStats.map(renderStatItem)}
        </View>

        <View style={styles.welcomeContentContainer}>
          <Text style={styles.welcomeText}>Welcome to Quiz War</Text>
          <Text style={styles.subHeroText}>
            Test your knowledge and win rewards!!!
          </Text>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={1000}
            style={styles.floatingPlayButton}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDefaultPlayNow}>
              <Text style={styles.playNowText}>Play Now</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>

        <View style={styles.tournaments}>
          <Text style={styles.sectionTitle}>Featured Tournaments</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tournaments}
            renderItem={renderTournamentItem}
            keyExtractor={item => item.id}
          />
        </View>
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
    justifyContent: 'space-between',
    paddingVertical: scaleVertical(8),
    paddingBottom: scaleVertical(36),
  },
  statsContainer: {
    alignItems: 'flex-end',
    padding: normalize(24),
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scaleVertical(10),
  },

  totalPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: normalize(25),
    left: normalize(20),
  },
  statLabel: {
    color: '#fff',
    fontSize: normalize(14),
    ...getInterFont('Medium'),
  },
  statValue: {
    color: '#fff',
    fontSize: normalize(14),
    ...getInterFont('Medium'),
    marginRight: normalize(2),
  },
  statIcon: {
    marginLeft: normalize(5),
  },
  iqContainer: {
    position: 'absolute',
    top: normalize(55),
    left: normalize(20),
    backgroundColor: '#ffffff80',
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(10),
    zIndex: 10,
  },
  iqText: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#000',
    ...getInterFont('Medium'),
  },
  welcomeContentContainer: {
    marginBottom: scaleVertical(24),
  },
  welcomeText: {
    color: '#FFF',
    alignSelf: 'center',
    ...getInterFont('Bold'),
    fontSize: normalize(24),
    marginTop: scaleVertical(70),
  },
  subHeroText: {
    fontSize: normalize(16),
    color: '#FFF',
    textAlign: 'center',
    marginTop: scaleVertical(8),
    ...getInterFont('Medium'),
  },
  floatingPlayButton: {
    alignSelf: 'center',
    paddingVertical: scaleVertical(10),
    paddingHorizontal: normalize(40),
    marginTop: scaleVertical(24),
    backgroundColor: '#ff5f6d',
    borderRadius: normalize(50),
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: normalize(10),
    shadowOffset: {width: normalize(0), height: scaleVertical(5)},
    elevation: 10,
    zIndex: 10,
  },
  playNowText: {
    color: '#fff',
    fontSize: normalize(24),
    fontWeight: 'bold',
  },
  tournaments: {
    width: '100%',
    paddingLeft: normalize(20),
  },
  sectionTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: scaleVertical(10),
  },
  tournamentCard: {
    marginBottom: scaleVertical(60),
    backgroundColor: '#ffffff90',
    borderRadius: normalize(20),
    padding: normalize(20),
    marginRight: normalize(15),
    minWidth: normalize(200),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: normalize(10),
    shadowOffset: {width: normalize(0), height: scaleVertical(5)},
    elevation: 5,
  },
  tournamentTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  tournamentDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleVertical(5),
  },
  tournamentDetails: {
    fontSize: normalize(14),
    color: '#666',
    marginLeft: normalize(8),
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleVertical(10),
  },
  rewardText: {
    fontSize: normalize(14),
    color: '#ff5f6d',
    marginLeft: normalize(5),
  },
  joinButton: {
    marginTop: scaleVertical(10),
    paddingVertical: scaleVertical(10),
    paddingHorizontal: normalize(20),
    backgroundColor: '#ff5f6d',
    borderRadius: normalize(30),
  },
  joinButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});

export default HomeScreen;
