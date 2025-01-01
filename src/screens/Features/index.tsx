import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import {TFeaturesScreenProps} from '../../services/types/drawerscreens.types';
import LinearGradient from 'react-native-linear-gradient';
import {goBackWhiteSvg} from '../../assets/svgs';
import {SvgWrapper} from '../../common/SvgWrapper';
import {FeatureGridView} from '../../components/FeatureGrid';
export const Features: React.FC<TFeaturesScreenProps> = ({
  navigation,
  route,
}) => {
  const iconMap: {[key: string]: any} = {
    leaf: require('../../assets/icons/leaf.png'),
    water: require('../../assets/icons/water.png'),
    clock: require('../../assets/icons/clock.png'),
    'check-circle': require('../../assets/icons/check-circle.png'),
    user: require('../../assets/icons/user.png'),
    'clock-circle': require('../../assets/icons/clock-circle.png'),
  };
  const features = [
    {
      title: 'Eco Friendly',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'leaf', // Replace this with an appropriate icon reference if needed
    },
    {
      title: 'Water Conservative',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'water', // Replace this with an appropriate icon reference if needed
    },
    {
      title: 'Time Saving',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'clock', // Replace this with an appropriate icon reference if needed
    },
    {
      title: 'Hassle Free',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'check-circle', // Replace this with an appropriate icon reference if needed
    },
    {
      title: 'User Friendly',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'user', // Replace this with an appropriate icon reference if needed
    },
    {
      title: '24/7 Availability',
      description:
        'We use high-quality cleaning agents and equipment as well as premium materials.',
      icon: 'clock-circle', // Replace this with an appropriate icon reference if needed
    },
  ];

  return (
    <ImageBackground
      source={require('../../assets/images/FeaturesBG.png')}
      style={styles.background}
      resizeMode="cover">
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.5)', 'black']} // Gradient from transparent to black
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
          <View>
            <FeatureGridView
              data={features}
              renderItem={item => {
                return (
                  <View style={styles.container}>
                    <View
                      style={{
                        padding: 12,
                        borderRadius: 100,
                        backgroundColor: '#FFFFFF',
                        marginVertical: 12,
                      }}>
                      <Image
                        source={iconMap[item.icon]}
                        style={{width: 30, height: 30}}
                      />
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                );
              }}
            />
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
    marginVertical: '25%',
  },
  container: {
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
