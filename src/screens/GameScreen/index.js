import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';

//context
import {useTheme} from '../../context/ThemeContext';

//redux
import {
  updateGameState,
  updateScoreUpdateRequired,
} from '../../store/gameSlice';

//dimension Utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//routes constants
import Routes from '../../Navigations/RoutesConstants';

//common utils
import {questionsData} from '../../utils/CommonUtils.js/questionsData';
import {
  debounce,
  triggerHapticFeedback,
  triggerButtonCLickSound,
  useGameBackButton,
} from '../../utils/CommonUtils.js/commonFunctions';
import {scorePerQuestion} from '../../utils/CommonUtils.js/constants';

//Local Component
import HealthBar from './components/Healthbar';
import QuestionWithOptions from './components/QuestionWithOptions';

//Global Component
import BackButton from '../../components/Buttons/BackButton';
import {
  updateHighestScore,
  updatePerformanceState,
} from '../../store/userPerformanceSlice';

const GameScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {currentTheme} = useTheme();

  const userData = useSelector(state => state.auth);
  const userPerformance = useSelector(state => state.userPerformance);
  const activeSessionSData = useSelector(state => state.activeSession);

  const numberOfQuestion = questionsData.length;
  const {isHapticEnabled, isSoundEnabled} = userData;

  const [summaryCalculated, setSummaryCalculated] = useState(false);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentPoints, setCurrentPoints] = useState({addScore: 0, count: 1});
  const [isDisabled, setIsDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reset, setReset] = useState(false);
  const [checkAns, setCheckAns] = useState({
    id: null,
    ans: false,
    correctAns: null,
  });

  const animatedXValue = useRef(new Animated.Value(-10)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeAnimCircularProgress = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  useFocusEffect(() => {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('light-content');
  });

  useFocusEffect(
    useCallback(() => {
      const startTime = moment();
      setStartTime(startTime);
      setScore(0);
      setQuestionCount(0);
      setStartTime(moment());
      setCurrentPoints({addScore: 0, count: 1});
      setIsDisabled(false);
      setProgress(0);
      setReset(true);
      setCheckAns({id: null, ans: false, correctAns: null});
      progressRef.current?.reAnimate();

      setTimeout(() => setReset(false), 0);
    }, []),
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const gameSummaryCalculations = () => {
    if (!summaryCalculated) {
      setSummaryCalculated(true);
    }
  };

  useEffect(() => {
    if (summaryCalculated) {
      const endTime = moment();
      const duration = moment.duration(endTime.diff(startTime));
      const totalSeconds = duration.asSeconds() - 1;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const formattedTime = `${minutes}.${seconds < 10 ? '0' : ''}${seconds}s`;

      const totalQuestions = questionsData.length;
      const correctAnswers = score / scorePerQuestion;
      const wrongAnswers = totalQuestions - correctAnswers;

      const calculatePoints = () => {
        let basePoints = correctAnswers * scorePerQuestion;
        let speedBonus = Math.max(0, 10 - totalSeconds);
        let streakBonus = userPerformance.streak >= 3 ? 10 : 0;

        let finalScore = parseInt(basePoints + speedBonus + streakBonus);

        return finalScore;
      };

      const pointsEarned = calculatePoints();

      const timeTakenInFloat = parseFloat(formattedTime.replace('s', ''));
      const leastTimeTakenByUser = userPerformance.leastTimeTakenByUser;

      dispatch(
        updateGameState({
          score: score,
          timeTaken: timeTakenInFloat,
          correctAnswers: correctAnswers,
          wrongAnswers: wrongAnswers,
          createdTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          userId: userData.userId,
          username: userData.fullName,
          phoneNumber: userData.phoneNumber,
          userEmail: userData.email,
          categoryId: activeSessionSData.activeCategoryId,
          categoryName: activeSessionSData.activeCategoryName,
          monthlyPoints: userPerformance.monthlyPoints + pointsEarned,
          totalPoints: userPerformance.totalPoints + pointsEarned,
        }),
      );

      dispatch(
        updatePerformanceState({
          ...userPerformance,
          userId: userData.userId,
          userName: userData.fullName,
          quizzesCompleted: userPerformance.quizzesCompleted + 1,
          totalPoints: userPerformance.totalPoints + pointsEarned,
          monthlyPoints: userPerformance.monthlyPoints + pointsEarned,
          level:
            1 + parseInt((userPerformance.totalPoints + pointsEarned) / 200),
        }),
      );

      if (
        score === userPerformance.highestScore &&
        timeTakenInFloat < leastTimeTakenByUser
      ) {
        dispatch(updateScoreUpdateRequired({isUpdateScoreRequired: true}));
        dispatch(
          updateHighestScore({
            highestScore: score,
            leastTimeTakenByUser: timeTakenInFloat,
          }),
        );
      }

      if (score > userPerformance.highestScore) {
        dispatch(updateScoreUpdateRequired({isUpdateScoreRequired: true}));
        dispatch(
          updateHighestScore({
            highestScore: score,
            leastTimeTakenByUser: timeTakenInFloat,
          }),
        );
      }
    }
  }, [summaryCalculated]);

  useEffect(() => {
    animateScore();
  }, [score]);

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      if (questionCount < questionsData.length - 1) {
        fadeTransition();
      } else {
        gameSummaryCalculations();
        navigation.navigate('Result');
      }
    }, 10000);

    return () => BackgroundTimer.stopBackgroundTimer();
  }, [questionCount]);

  const animateScore = () => {
    animatedXValue.setValue(-30);
    Animated.timing(animatedXValue, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const fadeTransition = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimCircularProgress, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setQuestionCount(prev => prev + 1);
      setProgress(0);
      progressRef.current?.reAnimate();

      // Reset answer states
      setCheckAns({id: null, ans: false});
      setIsDisabled(false); // Enable buttons again
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimCircularProgress, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const changingQuestion = () => {
    setIsDisabled(false);
    if (questionCount < questionsData.length - 1) {
      timeoutRef.current = setTimeout(() => {
        fadeTransition();
      }, 1000);
    } else {
      timeoutRef.current = setTimeout(() => {
        gameSummaryCalculations();
        navigation.navigate(Routes.RESULT);
      }, 1000);
    }
  };

  const answerClickHandler = id => {
    // Prevent clicks if already disabled
    if (isDisabled) {
      return;
    }

    // Immediately disable further clicks
    setIsDisabled(true);

    if (isHapticEnabled) {
      triggerHapticFeedback();
    }

    let updatedScore = score;
    const correct_option = (
      questionsData[questionCount]?.correct_option + 1
    ).toString();

    if (correct_option === id) {
      if (isSoundEnabled) {
        triggerButtonCLickSound('correctoption.mp3');
      }

      // Correct answer
      setCheckAns({id: id, ans: true, correctAns: correct_option});
      setScore(prevScore => prevScore + scorePerQuestion);
      updatedScore = updatedScore + scorePerQuestion;
      setCurrentPoints(prevCount => ({
        count: prevCount.count + 1,
        addScore: 95 / numberOfQuestion,
      }));
      // Handle question change
      changingQuestion();
    } else {
      if (isSoundEnabled) {
        triggerButtonCLickSound('wrongoption.mp3');
      }

      // Wrong answer
      setCheckAns({id: id, ans: false, correctAns: correct_option});

      // Handle question change
      changingQuestion();
    }
  };

  const debouncedHandleAnswerClick = debounce(answerClickHandler, 100);

  const progressRef = useRef(null);
  const styles = getStyles(currentTheme);

  const handleBackButtonClick = () => {
    Alert.alert(
      'Exit Game',
      'Are you sure you want to exit the game? Your progress will be saved.',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            gameSummaryCalculations();
            navigation.navigate(Routes.RESULT);
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  useGameBackButton(handleBackButtonClick);

  return (
    <ImageBackground
      source={require('../../assets/images/general_knowledge_bg_image.png')}
      style={styles.backgroundImage}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View>
              <BackButton onPress={handleBackButtonClick} />
              <View style={styles.healthBarContainer}>
                <HealthBar currentPoints={currentPoints} reset={reset} />
              </View>
              <View style={styles.scoreRankContainer}>
                <Animated.Text
                  style={[
                    styles.score,
                    {transform: [{translateX: animatedXValue}]},
                  ]}>
                  {score.toString()}
                </Animated.Text>
                <Text style={styles.rankText}>
                  question:{' '}
                  <Text style={styles.rankNumber}>
                    {questionCount + 1}/{questionsData.length}
                  </Text>
                </Text>
              </View>
            </View>

            <View style={[styles.loaderWatchContainer]}>
              <Animated.View style={{opacity: fadeAnimCircularProgress}}>
                <CircularProgress
                  ref={progressRef}
                  value={progress}
                  radius={normalize(60)}
                  maxValue={10}
                  initialValue={10}
                  progressValueColor={'#FFFFFF'}
                  activeStrokeWidth={normalize(15)}
                  inActiveStrokeWidth={normalize(15)}
                  duration={10000}
                  activeStrokeColor={'#1CAE4A'}
                />
              </Animated.View>
            </View>
          </View>

          <View style={styles.questionContainer}>
            {Array.isArray(questionsData) && (
              <Animated.View style={{opacity: fadeAnim}}>
                <QuestionWithOptions
                  questionData={questionsData[questionCount]}
                  checkAns={checkAns}
                  answerClickHandler={debouncedHandleAnswerClick}
                  isDisable={isDisabled}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default GameScreen;

const getStyles = theme =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'space-between',
      paddingTop: StatusBar.currentHeight,
      paddingVertical: scaleVertical(24),
      padding: normalize(16),
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: normalize(12),
    },
    LoaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    healthBarContainer: {
      marginTop: scaleVertical(16),
    },
    loaderWatchContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: scaleVertical(230),
      left: normalize(130),
    },
    scoreRankContainer: {
      marginTop: scaleVertical(24),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    score: {
      color: '#FFFFFF',
      fontSize: normalize(40),
      lineHeight: scaleVertical(42),
      ...getInterFont('Bold'),
    },
    rankText: {
      color: '#FFFFFF',
      fontSize: normalize(16),
      marginRight: normalize(10),
      ...getInterFont('Medium'),
    },
    rankNumber: {
      color: '#FFFFFF',
      fontSize: normalize(22),
      ...getInterFont('Bold'),
    },
    questionContainer: {
      paddingHorizontal: normalize(5),
    },
  });
