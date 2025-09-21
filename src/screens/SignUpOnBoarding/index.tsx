import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity,
} from 'react-native';
import { TSignUpOnBoardingProps } from './types';
import { SvgWrapper } from '../../common/SvgWrapper';
import { GoogleSvg, KeySvg, PersonSvg } from '../../assets/svgs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { ErrorSuccessToast } from '../../utils/helper';
import FacebookLogo from '../../assets/svgs/FacebookLogo.svg';
import AppleLogo from '../../assets/svgs/AppleIcon.svg';
import { useAuth } from '../../hooks/useAuth';
import { persistAuthResponse } from '../../hooks/useAuthStorage';

export const SignUpOnBoarding: React.FC<TSignUpOnBoardingProps> = ({ navigation }) => {
  const { loading, handleRegister } = useAuth();

  const [formErrors, setFormErrors] = useState({
    emailError: false, passwordError: false, nameError: false, confirmPasswordError: false,
  });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateFormFields = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
    const next = { ...formErrors };
    next.emailError = !emailRegex.test(email);
    next.passwordError = !passwordRegex.test(password);
    next.nameError = !name?.trim();
    next.confirmPasswordError = password !== confirmPassword;
    setFormErrors(next);
    return !(next.emailError || next.passwordError || next.nameError || next.confirmPasswordError);
  }, [email, password, name, confirmPassword, formErrors]);

  const signUpHandler = useCallback(async () => {
    if (!validateFormFields()) return;
    try {
      const data = await handleRegister({ email, password, role: 'user', name });

      await persistAuthResponse(data);

      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });

      setEmail(''); setPassword(''); setConfirmPassword(''); setName('');
    } catch (error: any) {
      ErrorSuccessToast?.({
        type: 'error',
        message1: error?.response?.data?.message || 'Signup failed. Please try again.',
        message2: '',
      });
      console.log('🔴 Signup error:', JSON.stringify(error?.response?.data || error, null, 2));
    }
  }, [email, password, name, validateFormFields, handleRegister, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="relative pt-12 px-2">
          <Text className="text-white ml-2 pt-6 text-4xl font-[Poppins-SemiBold] mb-6">Sign up</Text>

          <View className="px-2 pb-12 flex-1 gap-y-6">
            {/* Social */}
            <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={() => { }}>
                <SvgWrapper className="mr-4" xml={GoogleSvg} width={24} height={24} />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">Continue with Google</Text>
              </Button>

              <TouchableOpacity className="flex justify-center items-center flex-row h-[56px] bg-white rounded-[10px]" onPress={() => { }}>
                <FacebookLogo width={24} height={24} style={{ marginRight: 16 }} />
                <Text className="text-black text-[16px] font-[Poppins-Medium]">Continue with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex justify-center items-center flex-row h-[56px] bg-white rounded-[10px]" onPress={() => { }}>
                <AppleLogo width={24} height={24} style={{ marginRight: 16 }} />
                <Text className="text-black text-[16px] font-[Poppins-Medium]">Continue with Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center">
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
              <Text className="text-[#A4A4A4] ml-3 flex-[0.1] text-xl font-[Poppins-Regular]">or</Text>
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
            </View>

            {/* Form */}
            <View>
              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">Email Address</Text>
                <Input
                  onFocus={() => setFormErrors(p => ({ ...p, emailError: false }))}
                  error={formErrors.emailError}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email Address"
                  keyboardType="email-address"
                  preIcon={<SvgWrapper xml={PersonSvg} width={20} height={20} />}
                />
                {formErrors.emailError && <Text className="text-red-600 text-[16px] mt-2">Please enter a valid email address.</Text>}
              </View>

              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">Name</Text>
                <Input
                  onFocus={() => setFormErrors(p => ({ ...p, nameError: false }))}
                  error={formErrors.nameError}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                  preIcon={<SvgWrapper xml={PersonSvg} width={20} height={20} />}
                />
                {formErrors.nameError && <Text className="text-red-600 text-[16px] mt-2">Name is required.</Text>}
              </View>

              <View>
                <Text className="text-white text-[16px] mb-2">Password</Text>
                <Input
                  onFocus={() => setFormErrors(p => ({ ...p, passwordError: false }))}
                  error={formErrors.passwordError}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  passwordInput
                  preIcon={<SvgWrapper xml={KeySvg} width={20} height={20} />}
                />
                {formErrors.passwordError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    Password should contain at least one uppercase letter, one digit, and one special character.
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-white text-[16px] mb-2 mt-4">Confirm Password</Text>
                <Input
                  onFocus={() => setFormErrors(p => ({ ...p, confirmPasswordError: false }))}
                  error={formErrors.confirmPasswordError}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  passwordInput
                  preIcon={<SvgWrapper xml={KeySvg} width={20} height={20} />}
                />
                {formErrors.confirmPasswordError && <Text className="text-red-600 text-[16px] mt-2">Passwords do not match.</Text>}
              </View>
            </View>

            {/* CTA */}
            <View className="gap-y-3">
              <Button
                variant="primary"
                style={{ backgroundColor: 'white', opacity: loading ? 0.7 : 1 }}
                onPress={signUpHandler}
                disabled={loading}
              >
                <Text className="text-black text-[16px] font-[Poppins-Medium]">
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </Button>

              <View className="flex-row gap-x-2 justify-center">
                <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">Already have an account?</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text className="text-white text-[16px] font-[Poppins-Regular] underline">Login</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
