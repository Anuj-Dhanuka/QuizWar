import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {countryCodes} from '../../utils/CommonUtils.js/countryCodes';

const PhoneInputScreen = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const pickerRef = useRef();

  const handleLogin = () => {
    // Handle OTP send here
    console.log('Phone number:', selectedCountryCode + phoneNumber);
  };

  const close = () => {
    pickerRef.current.blur();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign in to Continue</Text>
      <Text style={styles.subtitle}>
        We will send you One Time Password (OTP) on this WhatsApp Mobile Number
      </Text>

      <View style={styles.inputContainer}>
        {/* Country Code Picker */}
        <View style={styles.countryCodeContainer}>
          <Picker
            ref={pickerRef}
            selectedValue={selectedCountryCode}
            style={styles.picker}
            onValueChange={itemValue => setSelectedCountryCode(itemValue)}>
            {countryCodes.map(country => (
              <Picker.Item
                key={country.id}
                label={country.label}
                value={country.value}
              />
            ))}
          </Picker>
        </View>

        {/* Phone Number Input */}
        <TextInput
          style={styles.phoneInput}
          keyboardType="phone-pad"
          placeholder="Enter your number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Changed to flexGrow for ScrollView
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6a5acd',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  countryCodeContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  picker: {
    height: 50,
    width: 100,
  },
  phoneInput: {
    flex: 3,
    height: 50,
    paddingLeft: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6a5acd',
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

const TestScreen = () => {
  return <PhoneInputScreen />;
};

export default TestScreen;
