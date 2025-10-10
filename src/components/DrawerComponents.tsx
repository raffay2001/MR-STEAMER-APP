import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SvgWrapper } from '../common/SvgWrapper';
import Icons from '../assets/svgs/icons';
import ProfileImage from '../assets/images/profile.png';
import { TNavProps } from '../services/types/drawerscreens.types';
import { clearAuth, getUserData } from '../hooks/useAuthStorage';
import { DrawerActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DrawerItems = (t: any) => ([
  { text: t('drawer.becomeStreamer'), route: 'BecomeStreamer' },
  { text: t('drawer.choosePackages'), route: 'ChoosePackages' },
  { text: t('drawer.hireUs'), route: 'HireUs' },
  { text: t('drawer.ourFeatures'), route: 'OurFeatures' },
  { text: t('drawer.aboutUs'), route: 'AboutUs' },
  { text: t('drawer.bookingDetail'), route: 'BookingDetails' },
]);

export const CustomDrawerComponent = (props: any) => {
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');
  const toggleLanguage = async () => {
    const next = isAr ? 'en' : 'ar';
    await i18n.changeLanguage(next);
  };

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
          {DrawerItems(t).map((item, index) => (
            <DrawerButton
              key={index}
              text={item.text}
              navigation={props.navigation}
              route={item.route}
            />
          ))}
        </ScrollView>
      </View>

      {/* Language switcher (above Logout) */}
      <TouchableOpacity
        className="w-[90%] h-[48px] self-center mb-3 border border-[#1f3a8a] rounded-[10px] flex justify-center items-center"
        onPress={toggleLanguage}
      >
        <Text className="text-[#1f3a8a] text-base">
          {t('common.changeLanguage')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-[90%] bg-blue-800 h-[56px] self-center flex justify-center items-center rounded-[10px]"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg tracking-[0.5px]">{t('drawer.logout')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerHeader: React.FC<TNavProps> = ({ navigation /*, route*/ }) => {
  const [user, setUser] = React.useState<any>(null);
  const isAr = i18n.language?.startsWith('ar');

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
    <View
      className="h-[100px] bg-blue-800 justify-center"
      style={{ paddingRight: isAr ? 8 : 28, paddingLeft: isAr ? 28 : 8 }}
    >
      <View className="justify-between items-center" style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}>
        <TouchableOpacity
          className="gap-x-0.5 items-center"
          style={{ flexDirection: isAr ? 'row-reverse' : 'row' }}
          onPress={() => {
            navigation.dispatch(DrawerActions.closeDrawer());
            navigation.navigate('Profile');
          }}
        >
          <Image source={ProfileImage} height={20} width={20} />
          <View className="gap-y-0" style={{ marginLeft: isAr ? 0 : 8, marginRight: isAr ? 8 : 0 }}>
            <Text className="text-white text-xl font-semibold" style={{ textAlign: isAr ? 'right' : 'left' }}>
              {user?.name || 'Guest'}
            </Text>
            {!!user?.email && (
              <Text className="text-white text-xs" style={{ textAlign: isAr ? 'right' : 'left' }}>
                {user.email}
              </Text>
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
  const isAr = i18n.language?.startsWith('ar');
  const handlePress = () => navigation.navigate(route);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-between rounded-md px-4 py-2"
      onPress={handlePress}
    >
      {isAr ? (
        <>
          <Ionicons name="chevron-back-outline" size={18} color="#111" style={{ marginLeft: 8 }} />
          <Text className="text-black text-sm">{text}</Text>
        </>
      ) : (
        <>
          <Text className="text-black text-sm">{text}</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#111" style={{ marginLeft: 8 }} />
        </>
      )}
    </TouchableOpacity>
  );
};
