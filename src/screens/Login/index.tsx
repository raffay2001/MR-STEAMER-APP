import React, { useState, useCallback } from 'react';
import { TLoginProps } from './types';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { SvgWrapper } from '../../common/SvgWrapper';
import { FacebookSvg, GoogleSvg, KeySvg, PersonSvg } from '../../assets/svgs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';
import toastConfig from '../../utils/toastConfig';
import { ErrorSuccessToast } from '../../utils/helper';
import { useAuth } from '../../hooks/useAuth';
import { persistAuthResponse } from '../../hooks/useAuthStorage';

export const Login: React.FC<TLoginProps> = ({ navigation }) => {
  const { loading, handleLogin } = useAuth();

  const [formErrors, setFormErrors] = useState({ emailError: false, passwordError: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateFormFields = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
    const next = { ...formErrors };
    next.emailError = !emailRegex.test(email);
    next.passwordError = !passwordRegex.test(password);
    setFormErrors(next);
    return !next.emailError && !next.passwordError;
  }, [email, password, formErrors]);

  const LoginHandler = useCallback(async () => {
    if (!validateFormFields()) return;
    try {
      const data = await handleLogin({ email, password });
      await persistAuthResponse(data);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      setEmail(''); setPassword('');
    } catch (error: any) {
      ErrorSuccessToast?.({
        type: 'error',
        message1: error?.response?.data?.message || 'Login failed. Please try again.',
        message2: '',
      });
      console.log('🔴 Login error:', JSON.stringify(error?.response?.data || error, null, 2));
    }
  }, [email, password, handleLogin, navigation, validateFormFields]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="relative pt-12 px-2">
          <Text className="text-white text-center pt-6 text-4xl font-[Poppins-SemiBold] mb-1">Welcome Back!</Text>
          <Text className="text-[#A4A4A4] text-center text-[14px] font-[Poppins-Medium] mb-6">welcome back we missed you</Text>

          <Toast config={toastConfig} />

          <View className="px-2 pb-12 flex-1 gap-y-6">
            {/* Social */}
            <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={() => { }}>
                <SvgWrapper className="mr-2" xml={GoogleSvg} width={24} height={24} />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">Login with Google</Text>
              </Button>
              <Button variant="outlined" onPress={() => { }}>
                <SvgWrapper className="mr-4" xml={FacebookSvg} width={24} height={24} />
                <View><Text className="text-white text-[16px] font-[Poppins-Medium]">Login with Facebook</Text></View>
              </Button>
            </View>

            {/* Divider */}
            <View className="flex-row items-center">
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
              <Text className="text-[#A4A4A4] ml-3 flex-[0.1] text-xl font-[Poppins-Regular]">or</Text>
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
            </View>

            {/* Form */}
            <View>
              <View className="mb-4">
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

              <View>
                <Text className="text-white text-[16px] mb-2">Password</Text>
                <View>
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
                      Password should contain atleast one uppercase letter, one digit and one special character.
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* CTA */}
            <View className="gap-y-3">
              <Button
                className="mb-4"
                variant="primary"
                style={{ backgroundColor: 'white', opacity: loading ? 0.7 : 1 }}
                onPress={LoginHandler}
                disabled={loading}
              >
                <Text className="text-black text-[16px] font-[Poppins-Medium]">
                  {loading ? 'Logging in...' : 'Login'}
                </Text>
              </Button>

              <Pressable onPress={() => { /* forgot password flow */ }}>
                <Text className="text-[#A4A4A4] text-center text-[16px] mt-1 font-[Poppins-Regular]">Forgot Password?</Text>
              </Pressable>
            </View>

            <View className="h-[0.6px] bg-[#414141]" />

            <View className="flex-row gap-x-2 justify-center">
              <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">Don't have an account?</Text>
              <Pressable onPress={() => navigation.navigate('SignUpOnBoarding')}>
                <Text className="text-white text-[16px] font-[Poppins-Regular] underline">Signup</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
