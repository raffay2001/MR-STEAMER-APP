import React, {useState} from 'react';
import {TLoginProps} from './types';
import {View, Text, ScrollView, SafeAreaView, Pressable} from 'react-native';
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
import {
  getUserInfo,
  setAuthState,
  getAccessToken,
} from '../../redux/reducers/auth.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO} from '../../constants';
// import Objects from '../../assets/images/Objects.png';
import {getRefreshToken} from '../../redux/reducers/auth.reducer';
import {useAppSelector} from '../../redux/store';
import Toast from 'react-native-toast-message';
export const Login: React.FC<TLoginProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const zajjaj = useAppSelector(getAccessToken);
  const [formErrors, setFormErrors] = useState({
    emailError: false,
    passwordError: false,
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateFormFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    if (!emailRegex.test(email)) {
      setFormErrors(prevFormErrors => ({...prevFormErrors, emailError: true}));
    }
    if (!passwordRegex.test(password)) {
      setFormErrors(prevFormErrors => ({
        ...prevFormErrors,
        passwordError: true,
      }));
    }
    return emailRegex.test(email) && passwordRegex.test(password);
  };

  const LoginHandler = async () => {
    if (validateFormFields()) {
      try {
        // Validating; the input using LoginSchema
        // Calling the login API if validation passes
        const loginPayload = await POST<LoginSignInPayload & ErrorResponse>(
          ROUTES.LOGIN,
          {
            email,
            password,
          },
        );

        dispatch(setAuthState(loginPayload.data));
        await AsyncStorage.setItem(
          ACCESS_TOKEN,
          JSON.stringify(loginPayload.data?.tokens?.access?.token),
        );
        await AsyncStorage.setItem(
          REFRESH_TOKEN,
          JSON.stringify(loginPayload.data?.tokens.refresh?.token),
        );
        await AsyncStorage.setItem(
          USER_INFO,
          JSON.stringify(loginPayload.data.user),
        );
        navigation.navigate('Vehicle');
        //making input feilds empty
        setEmail('');
        setPassword('');
      } catch (error: any) {
        // logging the error
        console.log(JSON.stringify(error));
        // setIsLoading(false);
        // if (error.name === 'ValidationError') {
        //   Alert.alert('Validation Error', error.message, [
        //     {text: 'OK', onPress: () => console.log('OK Pressed')},
        //   ]);
        // } else {
        //   Alert.alert(
        //     'Invalid Email Or Password',
        //     'Please enter a valid email address and password',
        //     [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        //   );
        Toast.show({
          type: 'success', // or 'error' or 'delete'
          text1: 'Item Saved!',
          text2: 'Your item has been successfully saved.',
        });
      }
      return;
      // } finally {
      //   setIsLoading(false);
      // }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        <View className="relative pt-12 px-2">
          {/* <Image source={Objects} className="absolute top-0 -right-0.5" /> */}

          <Text className="text-white pt-6 ml-2 text-4xl font-[Poppins-SemiBold] mb-6">
            Hi, Welcome Back!
          </Text>

          <View className="px-2 pb-12 flex-1 gap-y-6">
            <View className="gap-y-2">
              <Button className="mb-2" variant="outlined" onPress={() => {}}>
                <SvgWrapper
                  className="mr-2"
                  xml={GoogleSvg}
                  width={24}
                  height={24}
                />
                <Text className="text-white text-[16px] font-[Poppins-Medium]">
                  Login with Google
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
                    Login with Facebook
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
              <View className="mb-4">
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

              <View>
                <Text className="text-white text-[16px] mb-2">Password</Text>
                <View className="">
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
              </View>
            </View>

            <View className="gap-y-3">
              <Button
                className="mb-4"
                variant="primary"
                style={{backgroundColor: 'white'}}
                onPress={LoginHandler}>
                <Text className="text-black text-[16px] font-[Poppins-Medium]">
                  Login
                </Text>
              </Button>
              <Pressable
                onPress={() => {
                  // handle the forgot password flow.
                }}>
                <Text className="text-[#A4A4A4] text-center text-[16px] mt-1 font-[Poppins-Regular]">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            <View className="h-[0.6px] bg-[#414141]" />

            <View className="flex-row gap-x-2 justify-center">
              <Text className="text-[#A4A4A4] text-[16px] font-[Poppins-Regular]">
                Don't have an account?
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUpOnBoarding');
                }}>
                <Text className="text-white text-[16px] font-[Poppins-Regular] underline">
                  Signup
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
