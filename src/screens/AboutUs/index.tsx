import {Pressable, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {TAboutScreenProps} from '../../services/types/drawerscreens.types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
export const About: React.FC<TAboutScreenProps> = ({navigation, route}) => {
  return (
    <View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Pressable style={{marginLeft: 12}} onPress={() => navigation.goBack()}>
          <SvgWrapper
            xml={Icons.backIcon}
            width={15}
            height={15}
            icon={true}
            onPress={() => navigation.goBack()}
          />
        </Pressable>
        <View style={{flex: 3}}>
          <Text className="m-8 text-xl text-center font-bold text-black">
            About Us
          </Text>
        </View>
      </View>
      <View>
        <Text style={styles.text}>
          We value your time and therefore washing your car at our car wash will
          take no more than 15 minutes. Our company employs only highly
          qualified specialists, we use high-quality cleaning products and
          equipment, as well as premium materials. We value your time and
          therefore washing your car at our car wash will take no more than 15
          minutes. Our company employs only highly qualified specialists, we use
          high-quality cleaning products and equipment, as well as premium
          materials.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
    margin: 12,
    lineHeight: 30,
    fontSize: 20,
  },
});
