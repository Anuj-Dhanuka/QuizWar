import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

//dimension utils
import { normalize, scaleVertical } from '../../utils/DimensionUtils';

// font utils
import { getInterFont } from '../../utils/FontUtils/interFontHelper';

//common utils/common functions
import { triggerButtonCLickSound, triggerHapticFeedback } from '../../utils/CommonUtils.js/commonFunctions';

//route constants
import Routes from '../../Navigations/RoutesConstants';

const ProfileScreen = ({ navigation }) => {
  const [animation] = useState(new Animated.Value(0));

  const userData = useSelector(state => state.auth);

  const {isHapticEnabled, isSoundEnabled} = userData;
  
  useFocusEffect(() => {
    StatusBar.setBackgroundColor("#141E30");
    StatusBar.setBarStyle("light-content");  
  });

  Animated.timing(animation, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start();

  const handleEditProfile = () => {
    if(isHapticEnabled) {
      triggerHapticFeedback()
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    navigation.navigate(Routes.EDIT_PROFILE_SCREEN);
  };

  const handleOpenSettings = () => {
    if(isHapticEnabled){
      triggerHapticFeedback()
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    navigation.navigate(Routes.SETTINGS);
  };

  return (
    <SafeAreaView style={styles.flexContainer}>
      <LinearGradient colors={['#141E30', '#243B55']} style={styles.container}>
        <ScrollView>
          <Animated.View style={[styles.headerContainer, { opacity: animation }]}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userData.name}</Text>
            <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
              <Icon name="account-edit-outline" size={normalize(24)} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.infoSection}>
            <ProfileInfoCard label="Email" value={userData.email} icon="email-outline" />
            <ProfileInfoCard label="Phone" value={userData.phoneNumber} icon="phone-outline" />
            <ProfileInfoCard label="Date of Birth" value={userData.dateOfBirth} icon="calendar-outline" />
            <ProfileInfoCard label="Location" value="India" icon="map-marker-outline" />
            <ProfileInfoCard label="Language" value="English" icon="earth" />
          </View>

          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={handleOpenSettings}
            >
              <Icon name="cog-outline" size={normalize(24)} color="#fff" />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const ProfileInfoCard = ({ label, value, icon }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardContent}>
      <View style={styles.infoLabelContainer}>
        <Icon name={icon} size={normalize(22)} color="#9ACDFF" />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingVertical: scaleVertical(20),
  },
  headerContainer: {
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: '#1F3A93',
    borderBottomLeftRadius: normalize(50),
    borderBottomRightRadius: normalize(50),
    marginBottom: scaleVertical(30),
  },
  profileImage: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: normalize(60),
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: normalize(26),
    color: '#fff',
    marginTop: scaleVertical(10),
    ...getInterFont('Bold'),
  },
  editButton: {
    position: 'absolute',
    top: scaleVertical(10),
    right: normalize(20),
    backgroundColor: '#00BFFF',
    padding: normalize(8),
    borderRadius: normalize(20),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  infoSection: {
    marginHorizontal: normalize(20),
    backgroundColor: '#243B55',
    borderRadius: normalize(15),
    padding: normalize(20),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cardContainer: {
    marginVertical: scaleVertical(10),
    borderRadius: normalize(15),
    backgroundColor: '#FFFFFF20',
    paddingVertical: scaleVertical(15),
    paddingHorizontal: normalize(15),
    borderWidth: 1,
    borderColor: '#9ACDFF50',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    marginLeft: normalize(12),
    color: '#9ACDFF',
    fontSize: normalize(16),
    ...getInterFont('Medium'),
  },
  infoValue: {
    color: '#fff',
    fontSize: normalize(16),
    ...getInterFont('Regular'),
  },
  settingsContainer: {
    marginTop: scaleVertical(30),
    alignItems: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleVertical(12),
    paddingHorizontal: normalize(25),
    backgroundColor: '#00BFFF',
    borderRadius: normalize(30),
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    marginLeft: normalize(10),
    ...getInterFont('Bold'),
  },
});

export default ProfileScreen;
