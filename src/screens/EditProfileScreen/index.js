import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

//redux
import { editProfile } from '../../store/authSlice';

//font utils
import { getInterFont } from '../../utils/FontUtils/interFontHelper';

//dimension utils
import { normalize, scaleVertical } from '../../utils/DimensionUtils';

//global component
import BackButton from '../../components/Buttons/BackButton';
import { triggerButtonCLickSound, triggerHapticFeedback } from '../../utils/CommonUtils.js/commonFunctions';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.auth);
  
  const {isHapticEnabled, isSoundEnabled} = userData;

  const [updatedData, setUpdatedData] = useState(userData);

  useFocusEffect(() => {
    StatusBar.setBackgroundColor("#FFFFFF");
    StatusBar.setBarStyle("dark-content");
  });

  const handleSave = () => {
    if(isHapticEnabled){
      triggerHapticFeedback()
    }
    if(isSoundEnabled) {
      triggerButtonCLickSound()
    }
    dispatch(editProfile(updatedData));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <BackButton color='#000' />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.name}
          onChangeText={(text) => setUpdatedData({ ...updatedData, name: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.email}
          onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.nonEditableInput}>{updatedData.phoneNumber}</Text>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date of Birth:</Text>
        <TextInput
          style={styles.input}
          value={updatedData.dateOfBirth}
          onChangeText={(text) => setUpdatedData({ ...updatedData, dateOfBirth: text })}
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
    backgroundColor: "#FFFFFF",
  },
  backButtonContainer: {
    marginBottom: scaleVertical(16),
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
  nonEditableInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: normalize(10),
    borderRadius: normalize(8),
    fontSize: normalize(16),
    backgroundColor: '#f0f0f0',
    color: '#999',
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
