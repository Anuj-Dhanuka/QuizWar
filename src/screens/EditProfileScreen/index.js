import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Picker} from '@react-native-picker/picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

//context
import {useAuth} from '../../context/AuthContext';

//redux
import {editProfile} from '../../store/authSlice';

//font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//common utils
import {countryCodes} from '../../utils/CommonUtils.js/countryCodes';

//global component
import BackButton from '../../components/Buttons/BackButton';
import Button from '../../components/Buttons/Button';
import {
  triggerButtonCLickSound,
  triggerHapticFeedback,
} from '../../utils/CommonUtils.js/commonFunctions';
import {Apiutils} from '../../utils/ApiUtils';

// Reusable constants
const INPUT_HEIGHT = normalize(54);
const INPUT_HORIZONTAL_PADDING = normalize(10);
const BORDER_RADIUS = normalize(12);
const PROFILE_IMAGE_SIZE = normalize(120);
const ICON_SIZE = normalize(24);
const BACKGROUND_COLOR = '#F1F3F6';
const BUTTON_COLOR = '#00BFFF';
const LABEL_FONT_SIZE = normalize(16);
const FONT_SIZE = normalize(15);

const EditProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();

  const pickerRef = useRef();

  const userData = useSelector(state => state.auth);

  const {isHapticEnabled, isSoundEnabled} = userData;

  const [updatedData, setUpdatedData] = useState(userData);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    updatedData.country,
  );

  useFocusEffect(() => {
    StatusBar.setBackgroundColor(BACKGROUND_COLOR);
    StatusBar.setBarStyle('dark-content');
  });

  const handleSave = async () => {
    setLoading(true);
    if (isHapticEnabled) {
      triggerHapticFeedback();
    }
    if (isSoundEnabled) {
      triggerButtonCLickSound();
    }
    try {
      await Apiutils.updateUserProfile(user.userId, updatedData);
      dispatch(editProfile(updatedData));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update user profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(updatedData.dateOfBirth);
    setDatePickerVisible(false);
    setUpdatedData({
      ...updatedData,
      dateOfBirth: currentDate.toISOString().split('T')[0],
    });
  };

  const openImagePicker = async () => {
    setLoading(true);
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(async image => {
        const imageUrl = await Apiutils.uploadImageToFirebase(
          image.path,
          user.userId,
        );
        setUpdatedData({...updatedData, profilePicture: imageUrl});
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log('Image selection cancelled', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView>
          <View style={styles.backButtonContainer}>
            <BackButton color="#000" />
          </View>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity
              onPress={openImagePicker}
              style={styles.profilePictureButton}>
              {loading ? (
                <View style={styles.imageLoadingView}>
                  <ActivityIndicator size="large" color={BUTTON_COLOR} />
                </View>
              ) : updatedData.profilePicture ? (
                <Image
                  source={{uri: updatedData.profilePicture}}
                  style={styles.profileImage}
                />
              ) : (
                <Icon
                  name="account-circle"
                  size={PROFILE_IMAGE_SIZE}
                  color="#ccc"
                  style={styles.profileImagePlaceholder}
                />
              )}
              <View style={styles.editIconContainer}>
                <Icon name="edit" size={ICON_SIZE} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={updatedData.fullName}
              onChangeText={text =>
                setUpdatedData({...updatedData, fullName: text})
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={updatedData.email}
              onChangeText={text =>
                setUpdatedData({...updatedData, email: text})
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setDatePickerVisible(true)}>
              <Text style={styles.datePickerText}>
                {moment(updatedData.dateOfBirth).format('ll')}
              </Text>
              <FontAwesome5
                name="calendar-alt"
                size={normalize(16)}
                color="#6a5acd"
              />
            </TouchableOpacity>
            {datePickerVisible && (
              <DateTimePicker
                value={new Date(updatedData.dateOfBirth)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country:</Text>
            <View style={styles.countryCodeContainer}>
              <Picker
                ref={pickerRef}
                selectedValue={selectedCountryCode}
                style={styles.picker}
                onValueChange={text => {
                  setSelectedCountryCode(text);
                  setUpdatedData({...updatedData, country: text});
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City:</Text>
            <TextInput
              style={styles.input}
              value={updatedData.city}
              onChangeText={text =>
                setUpdatedData({...updatedData, city: text})
              }
            />
          </View>

          <Button
            onPress={handleSave}
            textStyle={styles.buttonText}
            loading={loading}
            buttonStyle={styles.animatedButton}>
            Update
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(20),
    backgroundColor: BACKGROUND_COLOR,
  },
  backButtonContainer: {
    marginBottom: scaleVertical(16),
  },
  imageLoadingView: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: scaleVertical(30),
    marginTop: scaleVertical(20),
  },
  profilePictureButton: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  profileImagePlaceholder: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: BUTTON_COLOR,
    borderRadius: BORDER_RADIUS / 2,
    padding: normalize(4),
  },
  inputGroup: {
    marginBottom: scaleVertical(15),
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
    marginBottom: scaleVertical(5),
    ...getInterFont('Medium'),
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: INPUT_HORIZONTAL_PADDING,
    height: INPUT_HEIGHT,
    borderRadius: BORDER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: FONT_SIZE,
    color: '#333',
  },
  countryCodeContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: BORDER_RADIUS,
    backgroundColor: '#FFFFFF',
    height: INPUT_HEIGHT,
    justifyContent: 'center',
  },
  picker: {
    height: INPUT_HEIGHT,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: INPUT_HORIZONTAL_PADDING,
    height: INPUT_HEIGHT,
    fontSize: FONT_SIZE,
  },
  buttonText: {
    fontSize: LABEL_FONT_SIZE,
    color: '#FFF',
    ...getInterFont('Bold'),
  },
  animatedButton: {
    backgroundColor: BUTTON_COLOR,
    paddingVertical: scaleVertical(8),
    borderRadius: BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
