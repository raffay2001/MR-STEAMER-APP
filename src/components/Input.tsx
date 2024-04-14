import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Pressable,
  Image,
} from 'react-native';
import EyeOff from '../assets/images/eyeOff.png';
import EyeOn from '../assets/images/eyeOn.png';

interface InputProps extends TextInputProps {
  style?: ViewStyle;
  passwordInput?: boolean;
  preIcon?: React.ReactNode;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
  style,
  passwordInput,
  preIcon,
  error,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View
      style={[styles.container, style]}
      className={`${!error ? 'border-white' : 'border-red-600'}`}>
      {preIcon ? preIcon : ''}
      <TextInput
        style={styles.input}
        placeholderTextColor="#A4A4A4"
        secureTextEntry={passwordInput && !isPasswordVisible}
        autoCapitalize="none"
        {...props}
      />
      {passwordInput && (
        <Pressable onPress={togglePasswordVisibility}>
          <Image
            source={isPasswordVisible ? EyeOn : EyeOff}
            className="w-[20px] h-[20px]"
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    height: 62,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    paddingTop: 4,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});

export default Input;
