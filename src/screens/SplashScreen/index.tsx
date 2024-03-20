import React, {useEffect, useState} from 'react';
import {View, Animated} from 'react-native';
import {TSplashScreenProps} from './types';
import {SvgWrapper} from '../../common/SvgWrapper';
import {
  // MRLogoTextSvg,
  SplashScreenLogoSvg,
  // SteamerLogoTextSvg,
  // blueGradientSvg,
  // voiletGradientSvg,
} from '../../assets/svgs';

export const SplashScreen: React.FC<TSplashScreenProps> = ({navigation}) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 flex-row justify-center items-center bg-[#000000] relative">
      <Animated.View
        style={{
          opacity: fadeAnim,
        }}>
        <SvgWrapper
          xml={SplashScreenLogoSvg}
          width={309}
          height={91}
          className=""
        />
      </Animated.View>
      {/* <View className="justify-center items-center absolute bottom-24 gap-y-4 z-10">
        <SvgWrapper xml={MRLogoTextSvg} width={317} height={174} />
        <SvgWrapper xml={SteamerLogoTextSvg} width={368} height={63} />
      </View> */}
      {/* <SvgWrapper
        xml={voiletGradientSvg}
        width={397}
        height={397}
        className="absolute top-72 -z-10"
      />
      <SvgWrapper
        xml={blueGradientSvg}
        width={280}
        height={280}
        className="absolute -left-24 -bottom-16"
      /> */}
    </View>
  );
};
