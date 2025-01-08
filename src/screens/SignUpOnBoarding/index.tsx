import React, {useEffect, useState} from 'react';
import {TSignUpOnBoardingProps} from './types';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {SvgWrapper} from '../../common/SvgWrapper';
import {FacebookSvg, GoogleSvg, KeySvg, PersonSvg} from '../../assets/svgs';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {POST} from '../../services';
import {
  ErrorResponse,
  LoginSignInPayload,
} from '../../services/types/auth.types';
import {ROUTES} from '../../routes';
import {useDispatch} from 'react-redux';
import {setAuthState} from '../../redux/reducers/auth.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO} from '../../constants';
import {ErrorSuccessToast} from '../../utils/helper';
// import Objects from '../../assets/images/Objects.png';

export const SignUpOnBoarding: React.FC<TSignUpOnBoardingProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({
    emailError: false,
    passwordError: false,
    nameError: false,
    confirmPasswordError: false,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const validateFormFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
    let isValid = true;
    if (!emailRegex.test(email)) {
      setFormErrors(prevFormErrors => ({...prevFormErrors, emailError: true}));
    }
    if (!passwordRegex.test(password)) {
      setFormErrors(prevFormErrors => ({
        ...prevFormErrors,
        passwordError: true,
      }));
    }
    if (password !== confirmPassword) {
      setFormErrors(prevFormErrors => ({
        ...prevFormErrors,
        confirmPasswordError: true,
      }));
      isValid = false;
    }
    return emailRegex.test(email) && passwordRegex.test(password) && isValid;
  };

  const signUpHandler = async () => {
    if (validateFormFields()) {
      try {
        // Validating; the input using LoginSchema
        // Calling the login API if validation passes
        const signUpPayload = await POST<LoginSignInPayload & ErrorResponse>(
          ROUTES.SIGNUP,
          {
            email,
            password,
            name,
          },
        );

        dispatch(setAuthState(signUpPayload.data));
        await AsyncStorage.setItem(
          ACCESS_TOKEN,
          signUpPayload.data?.tokens?.access?.token,
        );
        await AsyncStorage.setItem(
          REFRESH_TOKEN,
          signUpPayload.data?.tokens.refresh?.token,
        );
        await AsyncStorage.setItem(
          USER_INFO,
          JSON.stringify(signUpPayload.data.user),
        );
        navigation.navigate('Vehicle');
        //making input feilds empty
        setEmail('');
        setPassword('');
      } catch (error: any) {
        // logging the error
        console.log(JSON.stringify(error.response.data));
        ErrorSuccessToast({
          type: 'error',
          message1: `${error.response.data.message}`,
          message2: '',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="relative pt-12 px-2">
          {/* <Image source={Objects} className="absolute top-0 -right-0.5" /> */}

          <Text className="text-white ml-2 pt-6 text-4xl font-[Poppins-SemiBold] mb-6">
            Sign up
          </Text>

          <View className="px-2 pb-12 flex-1 gap-y-6">
            <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={() => {}}>
                <SvgWrapper
                  className="mr-4"
                  xml={GoogleSvg}
                  width={24}
                  height={24}
                />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">
                  Sign Up with Google
                </Text>
              </Button>
              <Button variant="outlined" onPress={() => {}}>
                <SvgWrapper
                  className="mr-4"
                  xml={FacebookSvg}
                  width={24}
                  height={24}
                />
                <View>
                  <Text className="text-white text-[16px] font-[Poppins-Medium]">
                    Sign Up with Facebook
                  </Text>
                </View>
              </Button>
            </View>

            <View className="flex-row items-center">
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
              <Text className="text-[#A4A4A4] ml-3 flex-[0.1] text-xl font-[Poppins-Regular]">
                or
              </Text>
              <View className="flex-[0.45] h-[0.6px] bg-[#A4A4A4]" />
            </View>

            <View>
              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">
                  Email Address
                </Text>
                <Input
                  onFocus={() => {
                    setFormErrors(prevFormErrors => ({
                      ...prevFormErrors,
                      emailError: false,
                    }));
                  }}
                  error={formErrors.emailError}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter Email Address"
                  keyboardType="email-address"
                  preIcon={
                    <SvgWrapper xml={PersonSvg} width={20} height={20} />
                  }
                />
                {formErrors.emailError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    Please enter a valid email address.
                  </Text>
                )}
              </View>
              <View className="mb-2">
                <Text className="text-white text-[16px] mb-2">Name</Text>
                <Input
                  onFocus={() => {
                    setFormErrors(prevFormErrors => ({
                      ...prevFormErrors,
                      nameError: false,
                    }));
                  }}
                  error={formErrors.nameError}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter Name"
                  preIcon={
                    <SvgWrapper xml={PersonSvg} width={20} height={20} />
                  }
                />
                {formErrors.nameError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    Name is required.
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-white text-[16px] mb-2">Password</Text>
                <Input
                  onFocus={() => {
                    setFormErrors(prevFormErrors => ({
                      ...prevFormErrors,
                      passwordError: false,
                    }));
                  }}
                  error={formErrors.passwordError}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter Password"
                  passwordInput
                  preIcon={<SvgWrapper xml={KeySvg} width={20} height={20} />}
                />
                {formErrors.passwordError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    Password should contain atleast one uppercase letter. one
                    digit and one special character.
                  </Text>
                )}
              </View>
              <View>
                <Text className="text-white text-[16px] mb-2 mt-4">
                  Confirm Password
                </Text>
                <Input
                  onFocus={() => {
                    setFormErrors(prevFormErrors => ({
                      ...prevFormErrors,
                      confirmPasswordError: false,
                    }));
                  }}
                  error={formErrors.confirmPasswordError}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  passwordInput
                  preIcon={<SvgWrapper xml={KeySvg} width={20} height={20} />}
                />
                {formErrors.confirmPasswordError && (
                  <Text className="text-red-600 text-[16px] mt-2">
                    Passwords do not match.
                  </Text>
                )}
              </View>
            </View>

            <View className="gap-y-3">
              <Button
                variant="primary"
                style={{backgroundColor: 'white'}}
                onPress={signUpHandler}>
                <Text className="text-black text-[16px] font-[Poppins-Medium]">
                  Sign Up
                </Text>
              </Button>
              <View className="flex-row gap-x-2 justify-center">
                <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">
                  Already have an account?
                </Text>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Login');
                  }}>
                  <Text className="text-white text-[16px] font-[Poppins-Regular] underline">
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
