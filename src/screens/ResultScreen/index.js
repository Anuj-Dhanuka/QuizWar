import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

// Dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

const ResultScreen = () => {
  const username = 'Anuj Dhanuka';
  const score = 7;
  const totalQuestions = 10;

  const percentage = (score / totalQuestions) * 100;

  const onRestartQuiz = () => console.log('Restart quiz clicked');

  const onShare = () => {
    console.log("On share clicked")
  }

  const onViewDashboard = () => {
    console.log("Dashboard clicked")
  }

  return (
    <SafeAreaView style={styles.flexContainer}>
      <StatusBar backgroundColor={'#6a11cb'} barStyle={'light-content'} />
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
        {/* Upper Content - Username, Icon, Text */}
        <View style={styles.upperContainer}>
          <Text style={styles.usernameText}>Hello, {username}!</Text>

          <Animatable.View
            animation="bounceIn"
            delay={200}
            style={styles.iconContainer}>
            {percentage >= 80 ? (
              <Animatable.View
                animation="pulse"
                easing="ease-in-out"
                iterationCount="infinite">
                <Icon
                  name="trophy-award"
                  size={normalize(80)}
                  color="#FFD700"
                />
              </Animatable.View>
            ) : percentage >= 50 ? (
              <Animatable.View
                animation="pulse"
                easing="ease-in-out"
                iterationCount="infinite">
                <Icon
                  name="emoticon-happy-outline"
                  size={normalize(80)}
                  color="#32CD32"
                />
              </Animatable.View>
            ) : (
              <Animatable.View
                animation="pulse"
                easing="ease-in-out"
                iterationCount="infinite">
                <Icon
                  name="emoticon-sad-outline"
                  size={normalize(80)}
                  color="#FF6347"
                />
              </Animatable.View>
            )}
          </Animatable.View>

          <Animatable.Text
            animation="fadeInUp"
            delay={400}
            style={styles.resultText}>
            {percentage >= 80
              ? 'Excellent!'
              : percentage >= 50
              ? 'Good Job!'
              : 'Try Again!'}
          </Animatable.Text>

          <Animatable.Text
            animation="fadeInUp"
            delay={500}
            style={styles.scoreText}>
            You scored {score} out of {totalQuestions}
          </Animatable.Text>
        </View>

        {/* Bottom Content - Circular Progress Bar, Buttons */}
        <View style={styles.lowerContainer}>
          <View style={styles.circularProgressContainer}>
            <Animatable.View animation="pulse" iterationCount="infinite">
              <AnimatedCircularProgress
                size={normalize(140)}
                width={normalize(12)}
                fill={percentage}
                tintColor={percentage >= 50 ? '#32CD32' : '#FF6347'}
                backgroundColor="#e0e0e0"
                rotation={0}
                duration={800}
                lineCap="round"
                style={styles.circularProgress}>
                {() => (
                  <Animatable.Text
                    animation="fadeIn"
                    style={styles.percentageText(percentage)}>
                    {percentage.toFixed(1)}%
                  </Animatable.Text>
                )}
              </AnimatedCircularProgress>
            </Animatable.View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onRestartQuiz}
              style={styles.playAgainButton}>
              <Icon
                name="play-circle-outline"
                size={normalize(22)}
                color="#fff"
              />
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              <Icon name="share-variant" size={normalize(22)} color="#fff" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onViewDashboard}
            style={styles.dashboardLinkContainer}>
            <View style={styles.dashboardLinkWrapper}>
              <Icon
                name="view-dashboard-outline"
                size={normalize(18)}
                color="#2575fc"
              />
              <Text style={styles.dashboardLink}>View Dashboard</Text>
            </View>
          </TouchableOpacity>
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
    overflow: 'hidden',
  },
  upperContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  usernameText: {
    fontSize: normalize(24),
    color: '#fff',
    marginBottom: scaleVertical(20),
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    ...getInterFont('Bold'),
  },
  iconContainer: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: normalize(10),
    shadowOffset: {width: 0, height: scaleVertical(5)},
  },
  resultText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: scaleVertical(20),
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    ...getInterFont('Bold'),
  },
  scoreText: {
    fontSize: normalize(20),
    color: '#fff',
    marginTop: scaleVertical(10),
    ...getInterFont('Medium'),
  },
  lowerContainer: {
    flex: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    paddingVertical: normalize(30),
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: normalize(10),
    shadowOffset: {width: 0, height: scaleVertical(5)},
    elevation: 5,
    width: '100%',
  },
  circularProgressContainer: {
    marginBottom: scaleVertical(20),
    alignItems: 'center',
  },
  circularProgress: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
    shadowOffset: {width: 0, height: scaleVertical(4)},
  },
  percentageText: percentage => ({
    fontSize: normalize(24),
    color: percentage >= 50 ? '#32CD32' : '#FF6347',
    ...getInterFont('Bold'),
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  }),
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  playAgainButton: {
    height: scaleVertical(80),
    width: normalize(170),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
    borderRadius: normalize(25),
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: normalize(10),
    shadowOffset: {width: 0, height: scaleVertical(5)},
    elevation: 7,
    marginRight: normalize(24),
    transform: [{scale: 1}],
  },
  playAgainButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    marginLeft: normalize(10),
    ...getInterFont('Bold'),
  },
  shareButton: {
    height: scaleVertical(80),
    width: normalize(170),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#32CD32',
    borderRadius: normalize(25),
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: normalize(10),
    shadowOffset: {width: 0, height: scaleVertical(5)},
    elevation: 7,
    transform: [{scale: 1}],
  },
  shareButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    marginLeft: normalize(10),
    ...getInterFont('Bold'),
  },
  dashboardLinkContainer: {
    alignItems: 'center',
  },
  dashboardLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dashboardLink: {
    fontSize: normalize(16),
    color: '#2575fc',
    textDecorationLine: 'underline',
    ...getInterFont('Bold'),
  },
});

export default ResultScreen;
