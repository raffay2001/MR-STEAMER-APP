import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {SvgWrapper} from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';
import ProfileImage from '../assets/images/profile.png';
import {SvgXml} from 'react-native-svg';
import {TNavProps} from '../types/drawerscreens.types';

const DrawerItems = [
  {
    text: 'Become Mr.Streamer',
    route: 'BecomeStreamer',
  },
  {
    text: 'Choose Packages',
    route: 'Packages',
  },
  {
    text: 'Hire us',
    route: 'HireUs',
  },
  {
    text: 'Our Feature',
    route: 'Features',
  },
  {
    text: 'About Us',
    route: 'AboutUs',
  },
  {
    text: 'Booking Detail',
    route: 'BookingDetails',
  },
];

export const CustomDrawerComponent = (props: any) => {
  console.log(props.navigation);
  return (
    <View {...props} className="flex-1 pb-12">
      <DrawerHeader navigation={props.navigation} route={props.route} />
      <View className="flex-1 bg-blue-800">
        <ScrollView className="flex-1 bg-white border-t rounded-t-3xl pt-6 px-4">
          {DrawerItems.map((item, index) => (
            <DrawerButton
              key={index}
              text={item.text}
              navigation={props.navigation}
              route={item.route}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity className="w-[90%] bg-blue-800 h-[56px] self-center flex justify-center items-center rounded-[10px]">
        <Text className="text-white text-lg tracking-[0.5px]">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerHeader: React.FC<TNavProps> = ({navigation}) => {
  return (
    <View className="h-[100px] bg-blue-800 justify-center pr-7 pl-2">
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-x-0.5 items-center">
          <Image source={ProfileImage} height={20} width={20} />
          <View className="gap-y-0">
            <Text className="text-white text-xl font-semibold">John Doe</Text>
            <Text className="text-white text-xs">
              Last Sign in today at 1:44pm
            </Text>
          </View>
        </View>
        <SvgWrapper
          xml={Icons.logoutIcon}
          icon={true}
          onPress={() => null}
          width={18}
          height={18}
        />
      </View>
    </View>
  );
};

const DrawerButton = ({
  text,
  navigation,
  route,
}: {
  text: string;
  navigation: any;
  route: any;
}) => {
  const handlePress = () => {
    navigation.navigate(route);
  };
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between rounded-md px-4 py-2"
      onPress={handlePress}>
      <Text className="text-black text-sm">{text}</Text>
      <SvgXml xml={Icons.arrowRightIcon} width={15} height={15} />
    </TouchableOpacity>
  );
};
