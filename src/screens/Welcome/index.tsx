import React from 'react';
import { ImageBackground, Text, View, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { TWelcomeProps } from './types';
import backgroundImage from '../../assets/images/young-man-washing-his-car.png';
import { SvgWrapper } from '../../common/SvgWrapper';
import { BlackArrowSvg, WhiteArrowSvg } from '../../assets/svgs';
import Button from '../../components/Button';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Welcome: React.FC<TWelcomeProps> = ({ navigation }) => {

  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      <ImageBackground source={backgroundImage} resizeMode="cover" className="flex-1">
        {/* overlay: light top → dark bottom */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.25)', 'rgba(0,0,0,0.85)']}
          locations={[0, 0.55, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        {/* content */}
        <View className="w-full h-full pt-20">
          <Text
            className="text-white text-[54px] font-[Poppins-SemiBold] mb-8 px-4"
            style={{ textAlign: isAr ? 'right' : 'left' }}
          >
            {t('welcome.title')}
          </Text>

          {/* buttons */}
          <View className="w-full absolute bottom-8 items-center justify-center gap-y-2 px-4">
            <Button style={{ borderColor: 'white' }} variant="primary" onPress={() => navigation.navigate('SignUpOnBoarding')}>
              {isAr ? (
                <>
                  <Ionicons name="chevron-back-outline" size={22} color="#FFFFFF" />
                  <Text className="text-white text-center font-[Poppins-Medium] text-[18px]" style={{ marginLeft: 12 }}>
                    {t('welcome.signup')}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-white text-center font-[Poppins-Medium] text-[18px]" style={{ marginRight: 12 }}>
                    {t('welcome.signup')}
                  </Text>
                  <Ionicons name="chevron-forward-outline" size={22} color="#FFFFFF" />
                </>
              )}
            </Button>

            <Button style={{ backgroundColor: 'white', borderColor: 'white' }} variant="primary" onPress={() => navigation.navigate('Login')}>
              {isAr ? (
                <>
                  <Ionicons name="chevron-back-outline" size={18} color="#000000" />
                  <Text className="text-black text-center font-[Poppins-Medium] text-[18px]" style={{ marginLeft: 12 }}>
                    {t('welcome.login')}
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-black text-center font-[Poppins-Medium] text-[18px]" style={{ marginRight: 12 }}>
                    {t('welcome.login')}
                  </Text>
                  <Ionicons name="chevron-forward-outline" size={18} color="#000000" />
                </>
              )}
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
