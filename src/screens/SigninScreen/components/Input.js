import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

//common utils
import {countryCodes} from '../../../utils/CommonUtils.js/countryCodes';

//font utils
import {getInterFont} from '../../../utils/FontUtils/interFontHelper';
import {normalize, scaleVertical} from '../../../utils/DimensionUtils';

//global component
import Button from '../../../components/Buttons/Button';

const Input = ({isLoading, signinWithPhonenumber}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const pickerRef = useRef();

  const handleLogin = () => {
    signinWithPhonenumber(selectedCountryCode + phoneNumber);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
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

        <TextInput
          style={styles.phoneInput}
          keyboardType="phone-pad"
          placeholder="Enter your number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>
      <Button
        onPress={handleLogin}
        textStyle={styles.buttonText}
        loading={isLoading}
        buttonStyle={[styles.button]}>
        Send OTP
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    paddingHorizontal: scaleVertical(10),
    marginBottom: scaleVertical(20),
  },
  countryCodeContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    height: normalize(50),
  },
  picker: {
    height: scaleVertical(50),
    width: normalize(100),
    ...getInterFont('Medium'),
  },
  phoneInput: {
    flex: 3,
    height: scaleVertical(50),
    paddingLeft: normalize(10),
    ...getInterFont('Medium'),
    color: '#000000',
    fontSize: normalize(16),
  },
  button: {
    paddingVertical: scaleVertical(12),
    borderRadius: normalize(12),
    color: '#FFFFFF',
    backgroundColor: '#6a5acd',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    ...getInterFont('Medium'),
  },
});

export default Input;
