import React, { useState, useCallback } from 'react';
import { TLoginProps } from './types';
import { View, Text, ScrollView, SafeAreaView, Pressable, TextInput } from 'react-native';
import { SvgWrapper } from '../../common/SvgWrapper';
import { FacebookSvg, GoogleSvg, KeySvg, PersonSvg } from '../../assets/svgs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Toast from 'react-native-toast-message';
import toastConfig from '../../utils/toastConfig';
import { ErrorSuccessToast } from '../../utils/helper';
import { useAuth } from '../../hooks/useAuth';
import { persistAuthResponse } from '../../hooks/useAuthStorage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Login: React.FC<TLoginProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { loading, handleLogin } = useAuth();

  const [formErrors, setFormErrors] = useState({ emailError: false, passwordError: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
        message1: error?.response?.data?.message || t('login.toastLoginFail'),
        message2: '',
      });
      console.log('🔴 Login error:', JSON.stringify(error?.response?.data || error, null, 2));
    }
  }, [email, password, handleLogin, navigation, validateFormFields, t]);

  const toggleLanguage = async () => {
    const next = i18n.language?.startsWith('ar') ? 'en' : 'ar';
    await i18n.changeLanguage(next);
  };
  const isAr = i18n.language?.startsWith('ar');

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>

        {/* Top bar: language toggle */}
        <View className="flex-row justify-end px-4 pt-6">
          <Pressable
            onPress={toggleLanguage}
            style={{ paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 8 }}
          >
            <Text className="text-white text-[14px]">
              {t('common.changeLanguage')}
            </Text>
          </Pressable>
        </View>

        <View className="relative pt-3 px-2">
          <Text className="text-white text-center pt-6 text-4xl font-[Poppins-SemiBold] mb-1">
            {t('login.title')}
          </Text>
          <Text className="text-[#A4A4A4] text-center text-[14px] font-[Poppins-Medium] mb-6">
            {t('login.subtitle')}
          </Text>

          <Toast config={toastConfig} />

          <View className="px-2 pb-12 flex-1 gap-y-6">
            {/* Social */}
            {/* <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={() => { }}>
                <SvgWrapper className="mr-2" xml={GoogleSvg} width={24} height={24} />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">
                  {t('login.google')}
                </Text>
              </Button>
              <Button variant="outlined" onPress={() => { }}>
                <SvgWrapper className="mr-4" xml={FacebookSvg} width={24} height={24} />
                <View>
                  <Text className="text-white text-[16px] font-[Poppins-Medium]">
                    {t('login.facebook')}
                  </Text>
                </View>
              </Button>
            </View> */}

            {/* Divider */}
            {/* <View className="flex-row items-center w-full">
              <View className="flex-1 h-[0.6px] bg-[#A4A4A4]" />
              <Text className="text-[#A4A4A4] mx-3 text-xl font-[Poppins-Regular]">
                {t('login.or')}
              </Text>
              <View className="flex-1 h-[0.6px] bg-[#A4A4A4]" />
            </View> */}

            {/* Form */}
            <View>
              <View className="mb-4">
                <Text className="text-white text-[16px] mb-2">
                  {t('login.emailLabel')}
                </Text>

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
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFormErrors(p => ({ ...p, emailError: false }))}
                    placeholder={t('login.emailPlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left' }}
                  />
                </View>

                {formErrors.emailError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    {t('login.emailError')}
                  </Text>
                )}
              </View>

              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">
                  {t('login.passwordLabel')}
                </Text>

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
                    placeholder={t('login.passwordPlaceholder')}
                    placeholderTextColor="#8A8A8A"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={{ flex: 1, color: '#FFFFFF', textAlign: isAr ? 'right' : 'left', minHeight: 48, textAlignVertical: 'center' }}
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
                    {t('login.passwordError')}
                  </Text>
                )}
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
                  {loading ? t('login.loggingIn') : t('login.cta')}
                </Text>
              </Button>

              <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                <Text className="text-[#A4A4A4] text-center text-[16px] mt-1 font-[Poppins-Regular]">
                  {t('login.forgot')}
                </Text>
              </Pressable>
            </View>

            <View className="h-[0.6px] bg-[#414141]" />

            <View
              className="flex-row gap-x-2 justify-center"
              style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
            >
              <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">
                {t('login.noAccount')}
              </Text>
              <Pressable onPress={() => navigation.navigate('SignUpOnBoarding')}>
                <Text className="text-white text-[16px] font-[Poppins-Regular] underline">
                  {t('login.signup')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
