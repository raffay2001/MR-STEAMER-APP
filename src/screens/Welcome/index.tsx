import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {TWelcomeProps} from './types';
import backgroundImage from '../../assets/images/young-man-washing-his-car.png';
import {SvgWrapper} from '../../common/SvgWrapper';
import {BlackArrowSvg, WhiteArrowSvg} from '../../assets/svgs';

export const Welcome: React.FC<TWelcomeProps> = ({}) => {
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
            Now, steam car wash at your door step is just one tap away
          </Text>
          {/* Buttons container */}
          <View className="w-full absolute bottom-8 items-center justify-center gap-y-2">
            <TouchableOpacity
              onPress={() => null}
              className="rounded-xl bg-[#2D4795] border-white border-[1px] w-[350] h-[56] flex-row justify-center items-center gap-x-4">
              <Text className="text-white text-center font-[Poppins-Medium] text-[18px]">
                Sign up
              </Text>
              <SvgWrapper xml={WhiteArrowSvg} width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => null}
              className="rounded-xl bg-white w-[350] h-[56] flex-row justify-center items-center gap-x-6">
              <Text className="text-black text-center font-[Poppins-Medium] text-[18px]">
                Login
              </Text>
              <SvgWrapper xml={BlackArrowSvg} width={15} height={15} />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
