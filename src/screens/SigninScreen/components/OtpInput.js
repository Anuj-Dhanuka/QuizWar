import React, {useState, useEffect} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import OtpTextInput from 'react-native-otp-textinput';

//dimension utils
import {normalize, scaleVertical} from '../../../utils/DimensionUtils';

//font utils
import {getInterFont} from '../../../utils/FontUtils/interFontHelper';

//components
import Button from '../../../components/Buttons/Button';

const OtpInput = ({isLoading, confirmCode, handleResendCode}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    let interval = null;
    
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOtp = () => {
    confirmCode(otp);
  };

  const handleRetry = () => {
    handleResendCode()
  };

  return (
    <View>
      <OtpTextInput
        handleTextChange={otp => setOtp(otp)}
        inputCount={6} 
        tintColor="#6a5acd"
        offTintColor="#bbb"
        containerStyle={styles.otpContainer}
        textInputStyle={styles.otpInputBox} 
      />
      <Button
        onPress={handleVerifyOtp}
        textStyle={styles.buttonText}
        loading={isLoading}
        buttonStyle={styles.button}>
        CONFIRM CODE
      </Button>

      
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
});

export default OtpInput;
