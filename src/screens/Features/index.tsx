import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {TFeaturesScreenProps} from '../../types/drawerscreens.types';
import LinearGradient from 'react-native-linear-gradient';
import {goBackWhiteSvg} from '../../assets/svgs';
import {SvgWrapper} from '../../common/SvgWrapper';
export const Features: React.FC<TFeaturesScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/FeaturesBG.png')}
      style={styles.background}
      resizeMode="cover">
      <LinearGradient
        colors={['transparent', 'transparent', 'black']} // Gradient from transparent to black
        style={styles.gradient}
        start={{x: 0.7, y: 0}}
        end={{x: 1, y: 1}}>
        <View style={{margin: 20}}>
          <Pressable
            style={{marginLeft: 10}}
            onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/GoBack.png')} />
          </Pressable>
          <View style={styles.contentContainer}>
            <Text style={styles.headingText}>Our Features</Text>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  headingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    marginVertical: '30%',
  },
});
