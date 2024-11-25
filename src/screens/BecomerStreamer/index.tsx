import {
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {TNavProps} from '../../types/drawerscreens.types';

export const BecomeStreamer: React.FC<TNavProps> = ({navigation, route}) => {
  return (
    <ImageBackground
      source={require('../../assets/images/Become_streamer.png')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.container}>
        {/* View for Arc bg image  */}
        <View style={{flex: 3}}>
          <ImageBackground
            source={require('../../assets/images/become_stremer_arc.png')}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View style={styles.bottomRight}>
          <Text style={styles.headingText}>Become Mr Steamer </Text>
          <Text style={styles.text}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unc
          </Text>
        </View>
      </View>
      <StatusBar hidden />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomRight: {
    position: 'absolute',
    bottom: '10%',
    left: 20,
  },

  headingText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  text:{
    color:'white',
    fontSize:18,
    paddingRight:'10%',
    textAlign: 'justify',
    lineHeight: 24,
  }
});
