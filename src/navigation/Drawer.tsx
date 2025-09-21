/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home } from '../screens';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Icons from '../assets/svgs/icons';
import { SvgWrapper } from '../common/SvgWrapper';
import { CustomDrawerComponent } from '../components/DrawerComponents';
import { DrawerStackParamList } from '../services/types/drawerscreens.types';
import { BecomeStreamer } from '../screens/BecomerStreamer';
import { HireUs } from '../screens/HireUs';
import BookingDetailsPage from '../screens/BookingDetailsPage';
import { getUserData } from '../hooks/useAuthStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBooking } from '../hooks/useBooking';
import ChoosePackages from '../screens/ChoosePackages';
import OurFeatures from '../screens/OurFeatures';
import AboutUs from '../screens/AboutUs';
import Profile from '../screens/Profile';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const MyDrawer = () => {
  const [userName, setUserName] = React.useState<string>('No Name');

  React.useEffect(() => {
    (async () => {
      const u = await getUserData();
      setUserName(u?.name || 'No Name');
    })();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Drawer.Navigator
        screenOptions={({ navigation }): any => ({
          drawerStyle: {
            backgroundColor: 'white',
            width: '80%',
          },
          headerLeft: () => <HeaderLeft navigation={navigation} />,
          headerRight: () => <HeaderRight navigation={navigation} />,
          title: userName,
          headerTitleStyle: { fontSize: 16, letterSpacing: 0.8, fontWeight: 400 },
        })}
        drawerContent={props => <CustomDrawerComponent {...props} />}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen
          name="BecomeStreamer"
          component={BecomeStreamer}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="ChoosePackages"
          component={ChoosePackages}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Choose Packages',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={22} color="#111" />
              </TouchableOpacity>
            ),
            headerRight: () => null,
          })}
        />
        <Drawer.Screen
          name="HireUs"
          component={HireUs}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="OurFeatures"
          component={OurFeatures}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            title: '',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ),
            headerRight: () => null,
          })}
        />
        <Drawer.Screen
          name="AboutUs"
          component={AboutUs}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'About Us',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={22} color="#111" />
              </TouchableOpacity>
            ),
            headerRight: () => null,
          })}
        />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            title: '',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            ),
            headerRight: () => null,
          })}
        />
        <Drawer.Screen
          name="BookingDetails"
          component={BookingDetailsPage}
          options={({ navigation }) => ({
            headerShown: true,
            title: 'Booking Details',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Ionicons name="arrow-back" size={22} color="#111" />
              </TouchableOpacity>
            ),
            headerRight: () => null,
          })}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default MyDrawer;

const HeaderLeft = ({ navigation }: any) => {
  return (
    <SvgWrapper
      xml={Icons.menuIcon}
      width={22}
      height={22}
      style={{ marginLeft: 20 }}
      icon={true}
      onPress={() => navigation.toggleDrawer()}
    />
  );
};

const HeaderRight = ({ navigation }: any) => {
  const { fetchBookingsByUserId } = useBooking();
  const [pendingCount, setPendingCount] = React.useState(0);

  const refresh = React.useCallback(async () => {
    try {
      const u = await getUserData();
      if (!u?.id) return;
      const data = await fetchBookingsByUserId(u.id, { page: 1, limit: 50 });
      const cnt = (data?.results || []).filter(
        (b: any) => String(b?.status || '').toLowerCase() === 'pending'
      ).length;
      setPendingCount(cnt);
    } catch { }
  }, [fetchBookingsByUserId]);

  React.useEffect(() => {
    refresh();
    const unsub = navigation.addListener?.('focus', refresh);
    return () => { unsub && unsub(); };
  }, [navigation, refresh]);

  return (
    <TouchableOpacity
      // ⬇️ navigate to the Booking Details list page instead of toggling drawer
      onPress={() => navigation.getParent()?.navigate('BookingDetailsPage')}
      style={{ marginRight: 16 }}
    >
      <View>
        <Ionicons name="cart-outline" size={22} color="#111" />
        {pendingCount > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -6,
              right: -8,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#EF4444',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 3,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
              {pendingCount > 99 ? '99+' : pendingCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
