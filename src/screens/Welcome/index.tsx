import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {TWelcomeProps} from './types';
import backgroundImage from '../../assets/images/young-man-washing-his-car.png';
import {SvgWrapper} from '../../common/SvgWrapper';
import {BlackArrowSvg, WhiteArrowSvg} from '../../assets/svgs';
import Button from '../../components/Button';

export const Welcome: React.FC<TWelcomeProps> = ({navigation}) => {
  return (
    <View className="flex-1">
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        className="flex-1">
        {/* Content container with padding to match the design */}
        <View className="w-full h-full pt-20">
          {/* Text container */}
          <Text className="text-white text-[54px] font-[Poppins-SemiBold] text-left mb-8 px-4">
            Premium Car Steam Service At Your Doorstep.
          </Text>
          {/* Buttons container */}
          <View className="w-full absolute bottom-8 items-center justify-center gap-y-2 px-4">
            <Button
              style={{borderColor: 'white'}}
              variant="primary"
              onPress={() => navigation.navigate('SignUpOnBoarding')}>
              <Text className="text-white text-center font-[Poppins-Medium] text-[18px] mr-4">
                Sign up
              </Text>
              <SvgWrapper xml={WhiteArrowSvg} width={24} height={24} />
            </Button>
            <Button
              style={{backgroundColor: 'white', borderColor: 'white'}}
              variant="primary"
              onPress={() => navigation.navigate('Login')}>
              <Text className="text-black text-center font-[Poppins-Medium] text-[18px] mr-6">
                Login
              </Text>
              <SvgWrapper xml={BlackArrowSvg} width={15} height={15} />
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
