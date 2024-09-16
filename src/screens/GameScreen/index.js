import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';

//Utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';
import {questionsData} from '../../utils/CommonUtils.js/questionsData';
import {
  useBackButton,
  debounce,
} from '../../utils/CommonUtils.js/commonFunctions';

//Local Component
import HealthBar from './components/Healthbar';
import QuestionWithOptions from './components/QuestionWithOptions';

//Global Component
import BackButton from '../../components/Buttons/BackButton';

//context
import {useTheme} from '../../context/ThemeContext';

//Store
//import { updateScore, updateTimeTaken } from "../../store/actions";

const GameScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {currentTheme} = useTheme();

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

  const numberOfQuestion = questionsData.length;
  const animatedXValue = useRef(new Animated.Value(-10)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeAnimCircularProgress = useRef(new Animated.Value(1)).current;

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
    animateScore();
  }, [score]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (questionCount < questionsData.length - 1) {
        fadeTransition();
      } else {
        const endTime = moment();

        const duration = moment.duration(endTime.diff(startTime));
        const totalSeconds = duration.asSeconds() - 1;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const formattedTime = `${minutes}.${
          seconds < 10 ? '0' : ''
        }${seconds}s`;
        //dispatch(updateTimeTaken(formattedTime));

        clearInterval(timer);
        navigation.navigate('Result');
      }
    }, 10000);

    return () => clearInterval(timer);
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
      // Update question count after fade out completes
      setQuestionCount(prev => prev + 1);
      setProgress(0);
      progressRef.current?.reAnimate();
      setCheckAns({id: null, ans: false});
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
      fadeTransition();
    } else {
      const timer = setInterval(() => {
        const endTime = moment();

        const duration = moment.duration(endTime.diff(startTime));
        const totalSeconds = duration.asSeconds() - 1;

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const formattedTime = `${minutes}.${
          seconds < 10 ? '0' : ''
        }${seconds}s`;

        //dispatch(updateTimeTaken(formattedTime));
        clearInterval(timer);
        navigation.navigate('Result');
      }, 1000);
    }
  };

  const answerClickHandler = id => {
    if (isDisabled === false) {
      let updatedScore = score;
      setIsDisabled(true);

      const correct_option = (
        questionsData[questionCount]?.correct_option + 1
      ).toString();

      if (correct_option === id) {
        setCheckAns({id: id, ans: true, correctAns: correct_option});
        setScore(prevScore => {
          return prevScore + 5;
        });
        updatedScore = updatedScore + 5;
        setCurrentPoints(prevCount => ({
          count: prevCount.count + 1,
          addScore: 95 / numberOfQuestion,
        }));
        //dispatch(updateScore(updatedScore));
        changingQuestion();
      } else {
        changingQuestion();
        setCheckAns({id: id, ans: false, correctAns: correct_option});
      }
    }
  };

  const debouncedHandleAnswerClick = debounce(answerClickHandler, 300);

  const handleBackButton = () => {
    navigation.navigate('Categories');
  };

  const progressRef = useRef(null);
  const styles = getStyles(currentTheme);
  useBackButton('Categories');

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
              <BackButton onPress={handleBackButton} />
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
                  disabled={isDisabled}
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
      fontWeight: '700',
      lineHeight: scaleVertical(42),
    },
    rankText: {
      color: '#FFFFFF',
      fontSize: normalize(16),
      marginRight: normalize(10),
    },
    rankNumber: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: normalize(22),
    },
    questionContainer: {
      paddingHorizontal: normalize(5),
    },
  });
