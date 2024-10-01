import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Animated,
  KeyboardAvoidingView, // Add Animated for basic animations
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker'; // Import the image crop picker
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this library if not already
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//route constants
import Routes from '../../Navigations/RoutesConstants';

// context
import {useTheme} from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

// dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

// font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//common utils //common functions
import { storeTokenAndUserId } from '../../utils/CommonUtils.js/commonFunctions';

import { Apiutils } from '../../utils/ApiUtils';

// global components
import Button from '../../components/Buttons/Button';
import { useDispatch } from 'react-redux';
import { loginUserPerformance, storeUserIdAndTokenInRedux } from '../../store';

function RegistrationScreen({navigation, route}) {
  const dispatch = useDispatch()
  const {idToken,
    userId,
    phonenumber,} = route.params;
    const { storeUserIdandTokenInContext } = useAuth();

  const {currentTheme} = useTheme();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: phonenumber,
    dateOfBirth: new Date(),
    gender: '',
    country: '',
    city: '',
    profilePicture: null,
    termsAccepted: false,
    privacyAccepted: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const emailInputRef = useRef();
  const countryInputRef = useRef();
  const cityInputRef = useRef();

  const styles = getStyles(currentTheme);

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const statusBarBackgroundColor = '#F5F5F5';
      const statusBarStyle = 'dark-content';
      
      if (Platform.OS === 'android' && statusBarBackgroundColor) {
        StatusBar.setBackgroundColor(statusBarBackgroundColor);
      }

      StatusBar.setBarStyle(statusBarStyle);

      return () => {
        StatusBar.setBarStyle('default');
      };
    }, [currentTheme])
  );


  const handleInputChange = (key, value) => {
    setForm({...form, [key]: value});
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.dateOfBirth;
    setShowDatePicker(false);
    handleInputChange('dateOfBirth', currentDate);
  };

  const handleImagePick = async() => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        const imageUrl = await Apiutils.uploadImageToFirebase(image.path, userId);
        handleInputChange('profilePicture', imageUrl);
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      })
      .catch(err => {
        if (err.message !== 'User cancelled image selection') {
          Toast.show('Image selection error, please try again.', Toast.LONG);
        }
      });
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'gender', 'country', 'city'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let field of requiredFields) {
      if (!form[field]) {
        Toast.show(
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          Toast.LONG,
        );
        return false;
      }
    }

    if (!emailRegex.test(form.email)) {
      Toast.show('Please enter a valid email address.', Toast.LONG);
      return false;
    }

    if (!form.termsAccepted) {
      Toast.show('Please accept the Terms and Conditions.', Toast.LONG);
      return false;
    }
    if (!form.privacyAccepted) {
      Toast.show('Please accept the Privacy Policy.', Toast.LONG);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      const userId = auth().currentUser?.uid;
      if (!userId) {
        Toast.show('User authentication failed. Please log in again.', Toast.LONG);
        return;
      }
  
      // Store user data in Firestore
      const userDocRef = firestore().collection('Users').doc(userId);
  
      await userDocRef.set({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        dateOfBirth: form.dateOfBirth.toISOString(),
        gender: form.gender,
        country: form.country,
        city: form.city,
        profilePicture: form.profilePicture,
        termsAccepted: form.termsAccepted,
        privacyAccepted: form.privacyAccepted,
        isHapticEnabled: false,
        isSoundEnabled: false,
      });

      const performanceDocRef = firestore().collection('Userperformance').doc(userId);

      await performanceDocRef.set({
        userId: userId,
        streak: 0,
        quizzesCompleted: 0,
        totalPoints: 0,
        monthlyPoints: 0,
        highestScore: 0,
        leastTimeTakenByUser: null,
        lastLoginDate: null,
        level: 1,
      });

      dispatch(loginUserPerformance({
        userId: userId,
        streak: 0,
        quizzesCompleted: 0,
        totalPoints: 0,
        monthlyPoints: 0,
        highestScore: 0,
        leastTimeTakenByUser: null,
        lastLoginDate: null,
        level: 1,
      }))

      await storeUserIdandTokenInContext(userId, idToken)
      dispatch(storeUserIdAndTokenInRedux({token: idToken , userId: userId}))
      await storeTokenAndUserId(idToken, userId)
  
      Toast.show('Registration successful!', Toast.LONG);
      } catch (error) {
      console.error('Error registering user:', error);
      Toast.show(`Registration failed. Please try again. ${error.message}`, Toast.LONG);
    }
  };
  

  return (
    <KeyboardAvoidingView style={styles.keyBoard}>
      <Animated.ScrollView
        style={[styles.container, {opacity}]}
        contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Complete Your Registration</Text>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleImagePick}
          activeOpacity={0.8}>
          {form.profilePicture ? (
            <View>
              <Animated.Image
                source={{uri: form.profilePicture}}
                style={[
                  styles.image,
                  {transform: [{scale}], ...styles.imageWithShadow},
                ]}
              />
              <View style={styles.imageOverlay}>
                <Icon name="photo-camera" size={normalize(24)} color="#fff" />
              </View>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Icon name="photo-camera" size={normalize(40)} color="#6a5acd" />
              <Text style={styles.placeholderText}>Add Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={form.fullName}
          onChangeText={text => handleInputChange('fullName', text)}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
        />

        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Email"
          value={form.email}
          keyboardType="email-address"
          onChangeText={text => handleInputChange('email', text)}
          returnKeyType="next"
          onSubmitEditing={() => countryInputRef.current.focus()}
          caretHidden={false}
        />

        <TextInput
          style={styles.disabledInput}
          placeholder={phonenumber}
          value={form.phoneNumber}
          editable={false}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>
            {form.dateOfBirth
              ? form.dateOfBirth.toDateString()
              : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={form.dateOfBirth}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={itemValue => handleInputChange('gender', itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <TextInput
          ref={countryInputRef}
          style={styles.input}
          placeholder="Country"
          value={form.country}
          onChangeText={text => handleInputChange('country', text)}
          returnKeyType="next"
          onSubmitEditing={() => cityInputRef.current.focus()}
        />

        <TextInput
          ref={cityInputRef}
          style={styles.input}
          placeholder="City"
          value={form.city}
          onChangeText={text => handleInputChange('city', text)}
          returnKeyType="done"
        />

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={form.termsAccepted}
            onValueChange={newValue =>
              handleInputChange('termsAccepted', newValue)
            }
          />
          <Text style={styles.checkboxLabel}>
            I accept the Terms and Conditions
          </Text>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={form.privacyAccepted}
            onValueChange={newValue =>
              handleInputChange('privacyAccepted', newValue)
            }
          />
          <Text style={styles.checkboxLabel}>I accept the Privacy Policy</Text>
        </View>

        {/* Press animation for submit button */}
        <TouchableOpacity
          onPressIn={() =>
            Animated.timing(scale, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.timing(scale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }).start()
          }
          onPress={handleSubmit}
          style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Register</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = currentTheme =>
  StyleSheet.create({
    keyBoard: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    innerContainer: {
      padding: normalize(24),
    },
    title: {
      fontSize: normalize(24),
      fontWeight: 'bold',
      color: '#6a5acd',
      marginBottom: scaleVertical(20),
      textAlign: 'center',
      ...getInterFont('Bold'),
    },
    label: {
      fontSize: normalize(14),
      color: '#6a5acd',
      marginBottom: scaleVertical(5),
    },
    input: {
      borderColor: '#6a5acd',
      borderWidth: 1,
      borderRadius: 8,
      padding: normalize(12),
      marginVertical: scaleVertical(10),
      fontSize: normalize(16),
    },
    disabledInput: {
      color: '#888',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      padding: normalize(12),
      marginVertical: scaleVertical(10),
      fontSize: normalize(16),
    },
    datePickerButton: {
      padding: normalize(12),
      backgroundColor: '#6a5acd',
      borderRadius: 8,
      marginBottom: scaleVertical(10),
    },
    datePickerText: {
      color: '#fff',
      fontSize: normalize(16),
      textAlign: 'center',
    },
    pickerContainer: {
      borderColor: '#6a5acd',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: scaleVertical(10),
    },
    imageContainer: {
      alignSelf: 'center',
      position: 'relative', // Required for the overlay positioning
      marginBottom: scaleVertical(20),
    },
    image: {
      width: normalize(120), // Slightly larger image size
      height: normalize(120),
      borderRadius: 60, // Circular shape
      resizeMode: 'cover', // Ensure image fits nicely
    },
    imageWithShadow: {
      borderWidth: 2, // Add border around the image
      borderColor: '#6a5acd',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5, // For Android shadow
    },
    imageOverlay: {
      // Overlay that appears when image is hovered/clicked
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0, // Initially invisible
    },
    imageContainer: {
      alignSelf: 'center',
      marginBottom: scaleVertical(20),
    },
    placeholder: {
      width: normalize(120),
      height: normalize(120),
      borderRadius: 60,
      backgroundColor: '#ddd',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#6a5acd', // Matching primary color
    },
    placeholderText: {
      color: '#6a5acd',
      textAlign: 'center',
      fontSize: normalize(14),
      marginTop: scaleVertical(5),
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: scaleVertical(10),
    },
    checkboxLabel: {
      marginLeft: scaleVertical(8),
      fontSize: normalize(14),
      color: '#6a5acd',
    },
    submitButton: {
      backgroundColor: '#6a5acd',
      paddingVertical: scaleVertical(12),
      borderRadius: 8,
      marginTop: scaleVertical(20),
    },
    submitButtonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: normalize(16),
    },
  });

export default RegistrationScreen;
