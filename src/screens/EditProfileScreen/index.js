import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // React Native Vector Icons for the edit icon
import moment from 'moment';

//context
import {useAuth} from '../../context/AuthContext';

//redux
import {editProfile} from '../../store/authSlice';

//font utils
import {getInterFont} from '../../utils/FontUtils/interFontHelper';

//dimension utils
import {normalize, scaleVertical} from '../../utils/DimensionUtils';

//global component
import BackButton from '../../components/Buttons/BackButton';
import {
  triggerButtonCLickSound,
  triggerHapticFeedback,
} from '../../utils/CommonUtils.js/commonFunctions';
import {Apiutils} from '../../utils/ApiUtils';

const EditProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useAuth();

  const userData = useSelector(state => state.auth);

  const {isHapticEnabled, isSoundEnabled} = userData;

  const [updatedData, setUpdatedData] = useState(userData);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);


  useFocusEffect(() => {
    StatusBar.setBackgroundColor('#FFFFFF');
    StatusBar.setBarStyle('dark-content');
  });

  const handleSave = async () => {
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

  const openImagePicker = async() => {
    setLoading(true); // Set loading to true when image fetch starts
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then( async image => {
        const imageUrl = await Apiutils.uploadImageToFirebase(image.path, user.userId);
        setUpdatedData({...updatedData, profilePicture: imageUrl});
        setLoading(false); // Set loading to false after image fetch completes
      })
      .catch(error => {
        setLoading(false); // Set loading to false after image fetch completes
        console.log('Image selection cancelled', error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton color="#000" />
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity
          onPress={openImagePicker}
          style={styles.profilePictureButton}>
          {loading ? ( // Show loader if image is loading
          <View style={styles.imageLoadingView}>
            <ActivityIndicator size="large" color="#00BFFF" />
          </View>
            
          ) : updatedData.profilePicture ? (
            <Image
              source={{uri: updatedData.profilePicture}}
              style={styles.profileImage}
            />
          ) : (
            <Icon
              name="account-circle"
              size={normalize(120)}
              color="#ccc"
              style={styles.profileImagePlaceholder}
            />
          )}
          <View style={styles.editIconContainer}>
            <Icon name="edit" size={normalize(24)} color="#FFF" />
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
          onChangeText={text => setUpdatedData({...updatedData, email: text})}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
          <TextInput
            style={styles.input}
            value={moment(updatedData.dateOfBirth).format('ll')}
            editable={false}
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
        <TextInput
          style={styles.input}
          value={updatedData.country}
          onChangeText={text => setUpdatedData({...updatedData, country: text})}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>City:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.city}
          onChangeText={text => setUpdatedData({...updatedData, city: text})}
        />
      </View>

      <TouchableOpacity style={styles.animatedButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(20),
    backgroundColor: '#FFFFFF',
  },
  backButtonContainer: {
    marginBottom: scaleVertical(16),
  },
  imageLoadingView: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000"
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
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60), // Makes the image circular
  },
  profileImagePlaceholder: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60), // Circular placeholder
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#00BFFF',
    borderRadius: normalize(16),
    padding: normalize(4),
  },
  inputGroup: {
    marginBottom: scaleVertical(15),
  },
  label: {
    fontSize: normalize(16),
    marginBottom: scaleVertical(5),
    ...getInterFont('Medium'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: normalize(10),
    borderRadius: normalize(8),
    fontSize: normalize(16),
    ...getInterFont('Regular'),
  },
  animatedButton: {
    backgroundColor: '#00BFFF',
    paddingVertical: normalize(12),
    borderRadius: normalize(8),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: normalize(18),
    color: '#FFF',
    ...getInterFont('Bold'),
  },
});

export default EditProfileScreen;
