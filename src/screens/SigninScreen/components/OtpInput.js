import React, {useState} from 'react';
import {View, Alert, StyleSheet, Text, Pressable} from 'react-native';
import OtpTextInput from 'react-native-otp-textinput';

//font utils
import {getInterFont} from '../../../utils/FontUtils/interFontHelper';

//dimension utils
import {normalize, scaleVertical} from '../../../utils/DimensionUtils';

//components
import Button from '../../../components/Buttons/Button';

const OtpInput = ({isLoading, confirmCode}) => {
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    confirmCode(otp)
  };

  const handleRetry = () => {

  };

  return (
    <View>
      <OtpTextInput
        handleTextChange={otp => setOtp(otp)}
        inputCount={6} // Number of OTP digits
        tintColor="#6a5acd" // Focused color
        offTintColor="#bbb" // Unfocused color
        containerStyle={styles.otpContainer} // Container style
        textInputStyle={styles.otpInputBox} // Box style for inputs
      />
      <Button
        onPress={handleVerifyOtp}
        textStyle={styles.buttonText}
        loading={isLoading}
        buttonStyle={styles.button}>
        CONFIRM CODE
      </Button>
      <Pressable style={styles.resendButton}>
        <Text style={styles.resendButtonText}>Resend Otp</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: scaleVertical(20),
  },
  otpInputBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    width: 50,
    height: 50,
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    ...getInterFont('Medium'),
  },
  button: {
    paddingVertical: scaleVertical(12),
    borderRadius: normalize(12),
    color: '#FFFFFF',
    backgroundColor: '#6a5acd',
    marginBottom: normalize(10),
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    ...getInterFont('Medium'),
  },
  resendButton: {
    alignSelf: 'center',
  },
  resendButtonText: {
    ...getInterFont('Medium'),
    textDecorationLine: 'underline',
  },
});

export default OtpInput;
