import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, SafeAreaView, Pressable, TouchableOpacity, TextInput, Platform
} from 'react-native';
import { TSignUpOnBoardingProps } from './types';
import { SvgWrapper } from '../../common/SvgWrapper';
import { GoogleSvg } from '../../assets/svgs';
import Button from '../../components/Button';
import { ErrorSuccessToast } from '../../utils/helper';
import FacebookLogo from '../../assets/svgs/FacebookLogo.svg';
import AppleLogo from '../../assets/svgs/AppleIcon.svg';
import { useAuth } from '../../hooks/useAuth';
import { persistAuthResponse } from '../../hooks/useAuthStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { LoginManager, AccessToken, Settings } from 'react-native-fbsdk-next';

export const SignUpOnBoarding: React.FC<TSignUpOnBoardingProps> = ({ navigation }) => {

  const { loading, handleRegister, handleGoogleLogin, handleAppleLogin, handleFacebookLogin } = useAuth();

  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const toggleLanguage = async () => {
    const next = isAr ? 'en' : 'ar';
    await i18n.changeLanguage(next);
  };

  const [formErrors, setFormErrors] = useState({
    emailError: false, passwordError: false, nameError: false, confirmPasswordError: false,
  });

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Normal Register
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

  // Google
  const onPressGoogle = useCallback(async () => {
    try {
      const hasPS = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('hasPlayServices:', hasPS);
      await GoogleSignin.signOut();
      const res = await GoogleSignin.signIn();
      console.log('Google signIn result:', JSON.stringify(res, null, 2));
      const idToken = res?.data?.idToken || (res as any)?.idToken;
      if (!idToken) throw new Error('No idToken from Google');
      const apiResp = await handleGoogleLogin(idToken);
      await persistAuthResponse(apiResp);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (e: any) {
      console.log('🔴 Google sign-in error details:', e?.code, e?.message, e);
      ErrorSuccessToast?.({ type: 'error', message1: e?.message || 'Google sign-in failed', message2: '' });
    }
  }, [handleGoogleLogin, navigation]);

  // Apple
  const onPressApple = useCallback(async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const { identityToken } = appleAuthRequestResponse;
      if (!identityToken) throw new Error('No identityToken from Apple');

      const apiResp = await handleAppleLogin(identityToken);
      await persistAuthResponse(apiResp);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (e: any) {
      console.log('🔴 Apple sign-in error:', e);
      ErrorSuccessToast?.({ type: 'error', message1: e?.message || 'Apple sign-in failed', message2: '' });
    }
  }, [handleAppleLogin, navigation]);

  // Facebook
  Settings.initializeSDK();

  const onPressFacebook = useCallback(async () => {
    try {
      // make sure previous session doesn’t hide the scopes prompt
      LoginManager.logOut();

      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log('✅ FB LoginManager result:', JSON.stringify(result, null, 2));
      if (result.isCancelled) throw new Error('Facebook login cancelled');

      const access = await AccessToken.getCurrentAccessToken();
      console.log('✅ FB AccessToken object:', JSON.stringify(access, null, 2));

      const token = access?.accessToken?.toString();
      if (!token) throw new Error('No access token from Facebook');
      console.log('✅ FB accessToken string:', token);

      const apiResp = await handleFacebookLogin(token);
      console.log('✅ Backend /auth/facebook response:', JSON.stringify(apiResp, null, 2));

      await persistAuthResponse(apiResp);
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (e: any) {
      console.log('🔴 Facebook sign-in error (full):', e);
      ErrorSuccessToast?.({ type: 'error', message1: e?.message || 'Facebook sign-in failed', message2: '' });
    }
  }, [handleFacebookLogin, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="relative pt-4 px-2">

          {/* Language Toggle */}
          <View className="flex-row justify-end px-4 pt-4">
            <Pressable
              onPress={toggleLanguage}
              style={{ paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8 }}
            >
              <Text className="text-white text-[14px]">{t('common.changeLanguage')}</Text>
            </Pressable>
          </View>

          {/* Heading */}
          <Text className="text-white ml-2 pt-6 text-4xl font-[Poppins-SemiBold] mb-6">
            {t('signup.title')}
          </Text>

          <View className="px-2 pb-12 flex-1 gap-y-6">
            {/* Social Logins */}
            <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={onPressGoogle}>
                <SvgWrapper className="mr-4" xml={GoogleSvg} width={24} height={24} />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">{t('signup.continueGoogle')}</Text>
              </Button>

              <TouchableOpacity className="flex justify-center items-center flex-row h-[56px] bg-white rounded-[10px]" onPress={onPressFacebook}>
                <FacebookLogo width={24} height={24} style={{ marginRight: 16 }} />
                <Text className="text-black text-[16px] font-[Poppins-Medium]">{t('signup.continueFacebook')}</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  className="flex justify-center items-center flex-row h-[56px] bg-white rounded-[10px]"
                  onPress={onPressApple}
                >
                  <AppleLogo width={24} height={24} style={{ marginRight: 16 }} />
                  <Text className="text-black text-[16px] font-[Poppins-Medium]">
                    {t('signup.continueApple')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View className="flex-row items-center w-full">
              <View className="flex-1 h-[0.6px] bg-[#A4A4A4]" />
              <Text className="text-[#A4A4A4] mx-3 text-xl font-[Poppins-Regular]">
                {t('common.or')}
              </Text>
              <View className="flex-1 h-[0.6px] bg-[#A4A4A4]" />
            </View>

            {/* Form */}
            <View>
              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">{t('signup.emailLabel')}</Text>
                <View
                  className="flex-row items-center rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-3 h-[60px]"
                  style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#A4A4A4"
                    style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFormErrors(p => ({ ...p, emailError: false }))}
                    placeholder={t('signup.emailPlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left' }}
                  />
                </View>
                {formErrors.emailError && (
                  <Text className="text-red-600 text-[16px] mt-2">{t('signup.emailError')}</Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">{t('signup.nameLabel')}</Text>
                <View
                  className="flex-row items-center rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-3 h-[60px]"
                  style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
                >
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#A4A4A4"
                    style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFormErrors(p => ({ ...p, nameError: false }))}
                    placeholder={t('signup.namePlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    autoCapitalize="words"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left' }}
                  />
                </View>
                {formErrors.nameError && (
                  <Text className="text-red-600 text-[16px] mt-2">{t('signup.nameError')}</Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">{t('signup.passwordLabel')}</Text>
                <View
                  className="flex-row items-center rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-3 h-[60px]"
                  style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
                >
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#A4A4A4"
                    style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFormErrors(p => ({ ...p, passwordError: false }))}
                    placeholder={t('signup.passwordPlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left' }}
                  />
                  <Pressable onPress={() => setShowPassword(p => !p)} hitSlop={10}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#A4A4A4"
                      style={{ marginLeft: isAr ? 0 : 8, marginRight: isAr ? 8 : 0 }}
                    />
                  </Pressable>
                </View>
                {formErrors.passwordError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    {t('signup.passwordError')}
                  </Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">{t('signup.confirmPasswordLabel')}</Text>
                <View
                  className="flex-row items-center rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] px-3 h-[60px]"
                  style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
                >
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#A4A4A4"
                    style={{ marginRight: isAr ? 0 : 8, marginLeft: isAr ? 8 : 0 }}
                  />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFormErrors(p => ({ ...p, confirmPasswordError: false }))}
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left' }}
                  />
                  <Pressable onPress={() => setShowConfirm(p => !p)} hitSlop={10}>
                    <Ionicons
                      name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#A4A4A4"
                      style={{ marginLeft: isAr ? 0 : 8, marginRight: isAr ? 8 : 0 }}
                    />
                  </Pressable>
                </View>
                {formErrors.confirmPasswordError && (
                  <Text className="text-red-600 text-[16px] mt-2">{t('signup.confirmPasswordError')}</Text>
                )}
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
                  {loading ? t('signup.signingUp') : t('signup.cta')}
                </Text>
              </Button>

              <View className="flex-row gap-x-2 justify-center" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
                <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">{t('signup.already')}</Text>
                <Pressable onPress={() => navigation.navigate('Login')}>
                  <Text className="text-white text-[16px] font-[Poppins-Regular] underline">{t('signup.login')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
