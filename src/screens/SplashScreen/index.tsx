import React, {useEffect} from 'react';
import {View} from 'react-native';
import {TSplashScreenProps} from './types';
import {SvgWrapper} from '../../common/SvgWrapper';
import {
  MRLogoTextSvg,
  SplashScreenLogoSvg,
  SteamerLogoTextSvg,
  blueGradientSvg,
  voiletGradientSvg,
} from '../../assets/svgs';

export const SplashScreen: React.FC<TSplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 flex-row justify-center bg-[#000000] relative">
      <SvgWrapper
        xml={SplashScreenLogoSvg}
        width={309}
        height={91}
        className="absolute top-48"
      />
      <View className="justify-center items-center absolute bottom-24 gap-y-4 z-10">
        <SvgWrapper xml={MRLogoTextSvg} width={317} height={174} />
        <SvgWrapper xml={SteamerLogoTextSvg} width={368} height={63} />
      </View>
      <SvgWrapper
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
      />
    </View>
  );
};
