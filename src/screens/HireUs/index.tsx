import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {THireUsScreenProps} from '../../services/types/drawerscreens.types';
import {SvgWrapper} from '../../common/SvgWrapper';
import Icons from '../../assets/svgs/icons';
import {ServiceSelector} from '../../components/ServiceSelector';

export const HireUs: React.FC<THireUsScreenProps> = ({navigation, route}) => {
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
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
            Hire Us
          </Text>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        <Image
          source={require('../../assets/images/HireUs.png')}
          style={{width: '130%', height: 230}}
        />
        <View>
          <ServiceSelector
            name={'Service for individual Customer'}
            placeHolder="Steam Wash Internal"
            subHeading="Wet SteamhhWash"
          />
          <ServiceSelector
            name={'Service for Corporate Sector'}
            placeHolder="Steam Wash Extermnal"
            subHeading="Dry Steam Wash"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});
