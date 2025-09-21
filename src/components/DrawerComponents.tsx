import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgWrapper } from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';
import ProfileImage from '../assets/images/profile.png';
import { TNavProps } from '../services/types/drawerscreens.types';
import { clearAuth, getUserData } from '../hooks/useAuthStorage';
import { DrawerActions } from '@react-navigation/native';

const DrawerItems = [
  { text: 'Become Mr.Streamer', route: 'BecomeStreamer' },
  { text: 'Choose Packages', route: 'ChoosePackages' },
  { text: 'Hire us', route: 'HireUs' },
  { text: 'Our Features', route: 'OurFeatures' },
  { text: 'About Us', route: 'AboutUs' },
  { text: 'Booking Detail', route: 'BookingDetails' },
];

export const CustomDrawerComponent = (props: any) => {
  const handleLogout = async () => {
    await clearAuth();
    props.navigation.dispatch(DrawerActions.closeDrawer());
    props.navigation.navigate?.('Home');
  };

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

      <TouchableOpacity
        className="w-[90%] bg-blue-800 h-[56px] self-center flex justify-center items-center rounded-[10px]"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg tracking-[0.5px]">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerHeader: React.FC<TNavProps> = ({ navigation /*, route*/ }) => {
  const [user, setUser] = React.useState<any>(null);

  const onHeaderLogout = async () => {
    await clearAuth();
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.navigate('Home');
  };

  React.useEffect(() => {
    (async () => {
      const u = await getUserData();
      setUser(u);
    })();
  }, []);

  return (
    <View className="h-[100px] bg-blue-800 justify-center pr-7 pl-2">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="flex-row gap-x-0.5 items-center"
          onPress={() => {
            navigation.dispatch(DrawerActions.closeDrawer());
            navigation.navigate('Profile');
          }}
        >
          <Image source={ProfileImage} height={20} width={20} />
          <View className="gap-y-0 ml-2">
            <Text className="text-white text-xl font-semibold">
              {user?.name || 'Guest'}
            </Text>
            {!!user?.email && (
              <Text className="text-white text-xs">{user.email}</Text>
            )}
          </View>
        </TouchableOpacity>
        <SvgWrapper
          xml={Icons.logoutIcon}
          icon={true}
          onPress={onHeaderLogout}
          width={18}
          height={18}
        />
      </View>
    </View >
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
  const handlePress = () => navigation.navigate(route);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between rounded-md px-4 py-2"
      onPress={handlePress}
    >
      <Text className="text-black text-sm">{text}</Text>
      <SvgXml xml={Icons.arrowRightIcon} width={15} height={15} />
    </TouchableOpacity>
  );
};
