import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {parsePhoneNumberFromString} from 'libphonenumber-js';
import Toast from 'react-native-simple-toast';

//context
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

//dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//common utils //common functions
import {storeTokenAndUserId} from '../../utils/CommonUtils.js/commonFunctions';

//local components
import Input from './components/Input';
import OtpInput from './components/OtpInput';
import Routes from '../../Navigations/RoutesConstants';
import {useDispatch} from 'react-redux';
import {storeUserIdAndTokenInRedux} from '../../store';

function SigninScreen({navigation}) {
  const dispatch = useDispatch();
  const {currentTheme} = useTheme();
  const {storeUserIdandTokenInContext} = useAuth();
  const confirmRef = useRef(null);

  const [phonenumber, setPhonenumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isOtpScreenEnable, setIsOtpScreenEnabled] = useState(false);

  const styles = getStyles(currentTheme);

  useFocusEffect(
    useCallback(() => {
      const statusBarBackgroundColor = '#FFFFFF';
      const statusBarStyle = 'dark-content';

      if (Platform.OS === 'android' && statusBarBackgroundColor) {
        StatusBar.setBackgroundColor(statusBarBackgroundColor);
      }

      StatusBar.setBarStyle(statusBarStyle);

      return () => {
        StatusBar.setBarStyle('default');
      };
    }, [currentTheme]),
  );

  useEffect(() => {
    if (isResendDisabled) {
      const countdown = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(countdown);
            setIsResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [isResendDisabled]);

  const validatePhoneNumber = (number, country) => {
    const phoneNumber = parsePhoneNumberFromString(number, country);
    return phoneNumber && phoneNumber.isValid();
  };

  const signinWithPhonenumber = async phonenumber => {
    if (!validatePhoneNumber(phonenumber)) {
      Toast.show('Please enter a valid phone number.', Toast.LONG);
      return;
    }
    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phonenumber);
      confirmRef.current = confirmation;
      setIsOtpScreenEnabled(true);
      setPhonenumber(phonenumber);
      setIsResendDisabled(true);
      setTimer(60);
    } catch (error) {
      Toast.show(`Please retry, ${error}`, Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCode = async code => {
    setIsLoading(true);
    setIsResendDisabled(true);
    try {
      const userCredential = await confirmRef.current.confirm(code);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      const userId = user.uid;
      Toast.show(`Otp verified`, Toast.LONG);

      const userDocument = await firestore()
        .collection('Users')
        .doc(user.uid)
        .get();

      if (userDocument.exists) {
        await storeTokenAndUserId(idToken, userId);
        await storeUserIdandTokenInContext(userId, idToken);
        dispatch(storeUserIdAndTokenInRedux({token: idToken, userId: userId}));
      } else {
        navigation.navigate(Routes.REGISTRATION, {
          idToken,
          userId,
          phonenumber,
        });
      }
    } catch (error) {
      Toast.show(`Please retry, ${error}`, Toast.LONG);
    } finally {
      setIsLoading(false);
      setIsResendDisabled(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phonenumber);
      confirmRef.current = confirmation;
      setIsOtpScreenEnabled(true);
      setPhonenumber(phonenumber);
      setIsResendDisabled(true);
      setTimer(60);
    } catch (error) {
      Toast.show(`Please retry, ${error}`, Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNumber = () => {
    setIsOtpScreenEnabled(false);
    setIsResendDisabled(false);
    confirmRef.current = null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Sign in to Continue</Text>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.image}
        />
        <View>
          <Text style={styles.subtitle}>
            {isOtpScreenEnable
              ? `Enter the One Time Password (OTP) sent on Your Mobile Number - ${phonenumber}
                    ${'\u00A0'}`
              : 'We will send you One Time Password (OTP) on this Mobile Number'}
          </Text>

          {isOtpScreenEnable ? (
            <View>
              <OtpInput
                isResendDisabled={isResendDisabled}
                timer={timer}
                isLoading={isLoading}
                confirmCode={confirmCode}
                handleResendCode={handleResendCode}
              />

              <Pressable
                onPress={handleResendCode}
                disabled={isResendDisabled}
                style={styles.resendButton}>
                <Text style={styles.resendButtonText}>
                  {isResendDisabled
                    ? `Resend OTP in (${timer}s)`
                    : 'Resend OTP'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.editNumberButton}
                onPress={handleEditNumber}>
                <View style={styles.editNumberContainer}>
                  <Text style={styles.editNumberText}>Edit Phone Number</Text>
                  <Icon name="edit" size={20} color="#007bff" />
                </View>
              </Pressable>
            </View>
          ) : (
            <Input
              isLoading={isLoading}
              signinWithPhonenumber={signinWithPhonenumber}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SigninScreen;

const getStyles = currentTheme =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    innerContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      paddingVertical: scaleVertical(126),
      paddingHorizontal: normalize(24),
    },
    title: {
      ...getInterFont('Bold'),
      fontSize: normalize(24),
      fontWeight: 'bold',
      color: '#6a5acd',
      marginBottom: scaleVertical(20),
    },
    image: {
      alignSelf: 'center',
      height: normalize(150),
      width: normalize(150),
    },
    subtitle: {
      fontSize: normalize(16),
      color: '#0a1e18',
      marginBottom: scaleVertical(40),
      ...getInterFont('Medium'),
    },

    resendButton: {
      alignSelf: 'center',
    },
    resendButtonText: {
      ...getInterFont('Medium'),
      textDecorationLine: 'underline',
    },
    editNumberButton: {
      marginTop: scaleVertical(20),
      alignItems: 'center',
    },
    editNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editNumberText: {
      fontSize: normalize(16),
      color: '#007bff',
      textDecorationLine: 'underline',
      marginRight: normalize(5),
      marginLeft: normalize(32),
    },
  });
