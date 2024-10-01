import React from 'react';
import { View, Text, StyleSheet, Linking, Pressable, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import * as Animatable from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux'; // Added useDispatch, useSelector

// Icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Context
import { useTheme } from '../../context/ThemeContext';

// Dimension utils
import { normalize, scaleVertical } from '../../utils/DimensionUtils';

// Font utils
import { getInterFont } from '../../utils/FontUtils/interFontHelper';

//common utils/common functions
import { triggerButtonCLickSound, triggerHapticFeedback } from '../../utils/CommonUtils.js/commonFunctions';

// Global component
import BackButton from '../../components/Buttons/BackButton';

// Redux actions
import { editProfile } from '../../store/authSlice';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();

  const userData = useSelector(state => state.auth);
  
  const styles = getStyles(currentTheme);
  const { isSoundEnabled, isHapticEnabled, email, fullName } = userData;

  const truncateText = (text, limit) => {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  };
  const truncateEmail = (email, limit) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length > limit) {
      return localPart.slice(0, limit) + '...' + '@' + domain;
    }
    return email;
  };

  const toggleSound = () => {
    if(isHapticEnabled) {
      triggerHapticFeedback()
    }
    if(!isSoundEnabled) {
      triggerButtonCLickSound()
    }
    dispatch(editProfile({
      ...userData,
      isSoundEnabled: !isSoundEnabled
    }));
  };

  const toggleHaptic = () => {
    if(!isHapticEnabled) {
      triggerHapticFeedback()
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    dispatch(editProfile({
      ...userData,
      isHapticEnabled: !isHapticEnabled
    }));
  };

  useFocusEffect(() => {
    StatusBar.setBackgroundColor("#f8f9fa");
    StatusBar.setBarStyle("dark-content");  
  });

  const handleFeedbackBtn = async () => {
    if(isHapticEnabled) {
      triggerHapticFeedback()
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    const url = 'https://forms.gle/xKt445h4J6tVJ3DJ6';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Unable to open URL: ${url}`, Toast.LONG);
    }
  };

  const renderRow = (IconComponent, iconName, label, value, onPress) => (
    <Animatable.View 
      animation="fadeInUp" 
      duration={500} 
      style={styles.row}
    >
      <View style={styles.rowContent}>
        <IconComponent 
          name={iconName} 
          size={28} 
          style={styles.iconShadow} 
          color={styles.iconColor.color} 
        />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      {onPress ? (
        <Pressable onPress={onPress} accessible={true} accessibilityLabel={`Toggle ${label}`}>
          <Animatable.View 
            animation="pulse" 
            easing="ease-in-out" 
            iterationCount="infinite" 
            style={[styles.toggleSwitch, value ? styles.toggleOn : styles.toggleOff]}
          >
            <View style={styles.toggleKnob} />
          </Animatable.View>
        </Pressable>
      ) : (
        <Text style={[styles.rowText, styles.activeText]}>{value}</Text>
      )}
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton color="#696969" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Account Section */}
        <Animatable.View animation="fadeInDown" duration={600} style={styles.card}>
          <Text style={styles.sectionTitle}>Account</Text>
          {renderRow(MaterialCommunityIcons, "email-outline", "Email", truncateEmail(email, 20))}
          <View style={styles.separator} />
          {renderRow(FontAwesome, "user", "Username", truncateText(fullName, 30))}
          <View style={styles.separator} />
          {renderRow(AntDesign, "setting", "Game Pass", "Active")}
        </Animatable.View>

        {/* App Settings Section */}
        <Animatable.View animation="fadeInDown" delay={100} duration={600} style={styles.card}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          {renderRow(Ionicons, "musical-notes", "Sound", isSoundEnabled, toggleSound)}
          <View style={styles.separator} />
          {renderRow(MaterialIcons, "vibration", "Haptic Feedback", isHapticEnabled, toggleHaptic)}
        </Animatable.View>

        {/* Feedback Section */}
        <Animatable.View animation="fadeInDown" delay={200} duration={600} style={styles.card}>
          <Text style={styles.sectionTitle}>Help Us Improve</Text>
          <Pressable onPress={handleFeedbackBtn} accessible={true} accessibilityLabel="Give Feedback">
            <View style={styles.rowContent}>
              <MaterialIcons name="feedback" size={28} style={styles.iconShadow} color={styles.iconColor.color} />
              <Text style={styles.rowText}>Give Feedback</Text>
            </View>
          </Pressable>
        </Animatable.View>

        {/* About Section */}
        <Animatable.View animation="fadeInDown" delay={300} duration={600} style={styles.card}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderRow(AntDesign, "questioncircle", "How to Play")}
          <View style={styles.separator} />
          {renderRow(MaterialIcons, "my-library-books", "Terms of Use")}
          <View style={styles.separator} />
          {renderRow(Ionicons, "lock-closed-outline", "Privacy Policy")}
          <View style={styles.separator} />
          {renderRow(Feather, "x", "Follow us on X")}
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};


const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'linear-gradient(180deg, #f8f9fa, #e0e7ea)',
    },
    backButtonContainer: {
      paddingHorizontal: normalize(16),
    },
    scrollView: {
      paddingHorizontal: normalize(16),
      paddingVertical: scaleVertical(12),
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: normalize(12),
      padding: normalize(20),
      marginBottom: scaleVertical(20),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    sectionTitle: {
      fontSize: normalize(18),
      color: '#333',
      marginBottom: scaleVertical(12),
      ...getInterFont('Bold'),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: scaleVertical(12),
    },
    rowContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowText: {
      fontSize: normalize(16),
      marginLeft: normalize(12),
      color: '#333',
      ...getInterFont('Medium'),
    },
    activeText: {
      color: '#007BFF',
      fontSize: normalize(14),
      ...getInterFont('SemiBold'),
    },
    separator: {
      height: 1,
      backgroundColor: '#E0E0E0',
      marginVertical: scaleVertical(12),
    },
    toggleSwitch: {
      width: normalize(42),
      height: normalize(24),
      borderRadius: normalize(20),
      justifyContent: 'center',
      padding: normalize(2),
      backgroundColor: '#ddd',
    },
    toggleOn: {
      backgroundColor: '#1CAE4A',
      alignItems: 'flex-end',
    },
    toggleOff: {
      backgroundColor: '#ddd',
      alignItems: 'flex-start',
    },
    toggleKnob: {
      width: normalize(22),
      height: normalize(22),
      borderRadius: normalize(20),
      backgroundColor: '#fff',
      elevation: 1,
    },
    iconColor: {
      color: '#555',
      colorGradient: ['#6a11cb', '#2575fc'],
    },
    iconShadow: {
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 1, height: 2 },
      textShadowRadius: 3,
    },
  });

export default SettingsScreen;
