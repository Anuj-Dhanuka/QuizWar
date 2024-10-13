import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-simple-toast';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

//Context
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';

//Dimension Utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//Font Utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//Common Utils
import {storeTokenAndUserId} from '../../utils/CommonUtils.js/commonFunctions';
import {countryCodes} from '../../utils/CommonUtils.js/countryCodes';

//Api Utils
import {Apiutils} from '../../utils/ApiUtils';

//Global Components
import Button from '../../components/Buttons/Button';

//Store
import {loginUserPerformance, storeUserIdAndTokenInRedux} from '../../store';

function RegistrationScreen({route}) {
  const dispatch = useDispatch();

  const {idToken, userId, phonenumber} = route.params;

  const {storeUserIdandTokenInContext} = useAuth();

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
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('India');

  const emailInputRef = useRef();
  const countryInputRef = useRef();
  const cityInputRef = useRef();

  const inputHeight = 54;
  const styles = getStyles(currentTheme, inputHeight);

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
    }, [currentTheme]),
  );

  const handleInputChange = (key, value) => {
    setForm({...form, [key]: value});
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || form.dateOfBirth;
    setShowDatePicker(false);
    handleInputChange('dateOfBirth', currentDate);
  };

  const handleCountryChange = (country) => {
    handleInputChange('country', country)
  }

  const handleImagePick = async () => {
    setLoading(true);
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        const imageUrl = await Apiutils.uploadImageToFirebase(
          image.path,
          userId,
        );
        handleInputChange('profilePicture', imageUrl);
        setLoading(false);
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
        setLoading(false);
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
        Toast.show(
          'User authentication failed. Please log in again.',
          Toast.LONG,
        );
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

      const performanceDocRef = firestore()
        .collection('Userperformance')
        .doc(userId);

      await performanceDocRef.set({
        userId: userId,
        userName: form.fullName,
        profilePicture: form.profilePicture,
        streak: 0,
        quizzesCompleted: 0,
        totalPoints: 0,
        monthlyPoints: 0,
        highestScore: 0,
        leastTimeTakenByUser: null,
        lastLoginDate: null,
        level: 1,
      });

      dispatch(
        loginUserPerformance({
          userId: userId,
          userName: form.fullName,
          streak: 0,
          quizzesCompleted: 0,
          totalPoints: 0,
          monthlyPoints: 0,
          highestScore: 0,
          leastTimeTakenByUser: null,
          lastLoginDate: null,
          level: 1,
        }),
      );

      await storeUserIdandTokenInContext(userId, idToken);
      dispatch(storeUserIdAndTokenInRedux({token: idToken, userId: userId}));
      await storeTokenAndUserId(idToken, userId);

      Toast.show('Registration successful!', Toast.LONG);
    } catch (error) {
      console.error('Error registering user:', error);
      Toast.show(
        `Registration failed. Please try again. ${error.message}`,
        Toast.LONG,
      );
    }
  };

  const handleDisabledPress = () => {
    Toast.show(
      "Phone number is linked to your account and can't be changed here.",
    );
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
          {loading ? ( // Show loader if image is loading
            <View style={styles.imageLoadingView}>
              <ActivityIndicator size="large" color="#00BFFF" />
            </View>
          ) : form.profilePicture ? (
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

        <Text style={styles.label}>Full Name: </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter full name..."
          value={form.fullName}
          onChangeText={text => handleInputChange('fullName', text)}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          selectionColor="#6a5acd"
        />

        <Text style={styles.label}>Email: </Text>
        <TextInput
          ref={emailInputRef}
          style={styles.input}
          placeholder="Enter email..."
          value={form.email}
          keyboardType="email-address"
          onChangeText={text => handleInputChange('email', text)}
          returnKeyType="next"
          onSubmitEditing={() => countryInputRef.current.focus()}
          selectionColor="#6a5acd"
        />

        <Text style={styles.label}>Phone Number:</Text>
        <TouchableOpacity onPress={handleDisabledPress} activeOpacity={1}>
          <TextInput
            style={styles.disabledInput}
            placeholder={phonenumber}
            value={form.phoneNumber}
            editable={false}
            selectionColor="#6a5acd"
          />
        </TouchableOpacity>

        <Text style={styles.label}>Date of Birth: </Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerText}>
            {form.dateOfBirth
              ? form.dateOfBirth.toDateString()
              : 'Select Date of Birth'}
          </Text>
          <FontAwesome5
            name="calendar-alt"
            size={normalize(16)}
            color="#6a5acd"
          />
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

        <Text style={styles.label}>Gender: </Text>
        <View style={styles.genderPickerContainer}>
          <Picker
            selectedValue={form.gender}
            onValueChange={itemValue => handleInputChange('gender', itemValue)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <Text style={styles.label}>Country: </Text>
        <View style={styles.countryContainer}>
          <Picker
            selectedValue={selectedCountryCode}
            style={styles.countryPicker}
            onValueChange={text => {
              setSelectedCountryCode(text);
              handleCountryChange(text)
            }}>
            {countryCodes.map(country => (
              <Picker.Item
                key={country.id}
                label={country.country}
                value={country.country}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>City: </Text>
        <TextInput
          ref={cityInputRef}
          style={styles.input}
          placeholder="Enter city name..."
          value={form.city}
          onChangeText={text => handleInputChange('city', text)}
          returnKeyType="done"
          selectionColor="#6a5acd"
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

        <Button
          onPress={handleSubmit}
          textStyle={styles.buttonText}
          loading={loading}
          buttonStyle={[styles.button]}>
          Register
        </Button>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (currentTheme, inputHeight) =>
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
    imageContainer: {
      alignSelf: 'center',
      marginBottom: scaleVertical(20),
    },
    imageLoadingView: {
      width: normalize(120),
      height: normalize(120),
      borderRadius: normalize(60),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#000000',
    },
    image: {
      width: normalize(120),
      height: normalize(120),
      borderRadius: 60,
      resizeMode: 'cover',
    },
    imageWithShadow: {
      borderWidth: 2,
      borderColor: '#6a5acd',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
    },
    placeholder: {
      width: normalize(120),
      height: normalize(120),
      borderRadius: 60,
      backgroundColor: '#ddd',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#6a5acd',
    },
    placeholderText: {
      color: '#6a5acd',
      textAlign: 'center',
      fontSize: normalize(13),
      marginTop: scaleVertical(5),
      ...getInterFont('Medium'),
    },
    input: {
      borderColor: '#B0C4DE',
      color: '#333',
      borderWidth: 1,
      borderRadius: 12,
      padding: normalize(14),
      marginBottom: scaleVertical(16),
      fontSize: normalize(14),
      height: normalize(inputHeight),
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
      ...getInterFont('Medium'),
    },

    disabledInput: {
      borderColor: '#E0E0E0',
      color: '#A9A9A9',
      borderWidth: 1,
      borderRadius: 12,
      padding: normalize(14),
      marginBottom: scaleVertical(16),
      fontSize: normalize(14),
      height: normalize(inputHeight),
      backgroundColor: '#F5F5F5',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
      ...getInterFont('Medium'),
    },

    label: {
      fontSize: normalize(14),
      color: '#6a5acd',
      marginBottom: scaleVertical(5),
      ...getInterFont('Medium'),
    },
    datePickerButton: {
      padding: normalize(12),
      borderColor: '#B0C4DE',
      borderWidth: 1,
      borderRadius: normalize(12),
      marginBottom: scaleVertical(12),
      justifyContent: 'center',
      height: normalize(inputHeight),
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    datePickerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    calendarIcon: {
      marginRight: normalize(8),
    },
    datePickerText: {
      color: '#333',
      fontSize: normalize(14),
      ...getInterFont('Medium'),
    },
    genderPickerContainer: {
      borderColor: '#B0C4DE',
      borderWidth: 1,
      ...getInterFont('Medium'),
      borderRadius: normalize(12),
      marginBottom: scaleVertical(12),
      justifyContent: 'center',
      height: normalize(inputHeight),
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    countryContainer: {
      borderWidth: 1,
      borderColor: '#B0C4DE',
      borderRadius: normalize(12),
      justifyContent: 'center',
      height: normalize(inputHeight),
      marginBottom: scaleVertical(12),
      backgroundColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    countryPicker: {
      width: '100%',
      color: '#333',
      fontSize: normalize(14),
      ...getInterFont('Medium'),
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },

    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: scaleVertical(8),
    },
    checkboxLabel: {
      marginLeft: scaleVertical(8),
      fontSize: normalize(14),
      color: '#6a5acd',
      ...getInterFont('Medium'),
    },
    button: {
      paddingVertical: scaleVertical(6),
      borderRadius: normalize(12),
      color: '#FFFFFF',
      backgroundColor: '#6a5acd',
      marginBottom: normalize(10),
      marginTop: scaleVertical(24),
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      ...getInterFont('Medium'),
    },
  });

export default RegistrationScreen;
