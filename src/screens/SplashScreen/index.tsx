import React, { useEffect, useState } from 'react';
import { View, Animated, Dimensions, StatusBar } from 'react-native';
import { TSplashScreenProps } from './types';
import SplashScreenImg from '../../assets/svgs/SplashScreenImgNew.svg';
import { getAccessToken } from '../../hooks/useAuthStorage';

const W = 303, H = 141, ASPECT = W / H;

export const SplashScreen: React.FC<TSplashScreenProps> = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    (async () => {
      const tok = await getAccessToken();
      if (!tok) {
        timer = setTimeout(() => navigation.navigate('Welcome'), 1200);
      }
    })();
    return () => { if (timer) clearTimeout(timer); };
  }, [navigation]);

  const { width } = Dimensions.get('window');
  const imgW = Math.min(width * 0.7, 420);
  const imgH = Math.round(imgW / ASPECT);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animated.View style={{ opacity: fadeAnim }}>
        <SplashScreenImg width={imgW} height={imgH} />
      </Animated.View>
    </View>
  );
};
