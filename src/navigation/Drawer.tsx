/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home } from '../screens';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import Icons from '../assets/svgs/icons';
import { SvgWrapper } from '../common/SvgWrapper';
import { CustomDrawerComponent } from '../components/DrawerComponents';
import { DrawerStackParamList } from '../services/types/drawerscreens.types';
import { HireUs } from '../screens/HireUs';
import BookingDetailsPage from '../screens/BookingDetailsPage';
import { getUserData } from '../hooks/useAuthStorage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useBooking } from '../hooks/useBooking';
import ChoosePackages from '../screens/ChoosePackages';
import OurFeatures from '../screens/OurFeatures';
import AboutUs from '../screens/AboutUs';
import Profile from '../screens/Profile';
import BecomeStreamer from '../screens/BecomeStreamer';
import RegisterSteamer from '../screens/RegisterSteamer';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getCarProfile, setCarProfile } from '../hooks/useCarStorage';
import { useCar } from '../hooks/useCar';
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator<DrawerStackParamList>();

const MyDrawer = () => {
  const { t } = useTranslation();
  const isAr = i18n.language?.startsWith('ar');

  const rootNavigation = useNavigation<any>();

  const [userName, setUserName] = React.useState<string>('No Name');
  const [userId, setUserId] = React.useState<string | null>(null);

  const [car, setCar] = React.useState<any | null>(null);
  const [cars, setCars] = React.useState<any[]>([]);

  const { loading: carsLoading, fetchCarsByUserId } = useCar();
  const carSheetRef = React.useRef<any>(null);

  React.useEffect(() => {
    (async () => {
      const u = await getUserData();
      setUserName(u?.name || 'No Name');
      setUserId(u?.id || null);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const c = await getCarProfile();
      setCar(c);
    })();
  }, []);

  React.useEffect(() => {
    if (!userId) return;

    (async () => {
      try {
        const list = await fetchCarsByUserId(userId);
        setCars(list || []);
      } catch (e) {
        setCars([]);
      }
    })();
  }, [userId, fetchCarsByUserId]);

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('CAR_CHANGED', (newCar: any) => {
      setCar(newCar);

      setCars(prev => {
        if (!prev || !Array.isArray(prev)) return [newCar];
        const exists = prev.some(c => c.id === newCar.id);
        if (exists) {
          return prev.map(c => (c.id === newCar.id ? newCar : c));
        }
        return [newCar, ...prev];
      });
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <Drawer.Navigator
        screenOptions={({ navigation }): any => ({
          drawerStyle: {
            backgroundColor: 'white',
            width: '80%',
          },
          drawerPosition: isAr ? 'right' : 'left',
          headerLeft: () =>
            isAr
              ? <HeaderRight navigation={navigation} isAr />
              : <HeaderLeft navigation={navigation} isAr={false} />,
          headerRight: () =>
            isAr
              ? <HeaderLeft navigation={navigation} isAr />
              : <HeaderRight navigation={navigation} isAr={false} />,
          headerTitleAlign: 'center',
        })}
        drawerContent={props => <CustomDrawerComponent {...props} />}>
        <Drawer.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerTitle: '',
            headerLeft: () =>
              isAr ? (
                <HeaderRight navigation={navigation} isAr />
              ) : (
                <HeaderLeft
                  navigation={navigation}
                  isAr={false}
                  label={car?.name || (isAr ? 'اختر السيارة' : 'Select car')}
                  onLabelPress={() => carSheetRef.current?.open()}
                />
              ),
            headerRight: () =>
              isAr ? (
                <HeaderLeft
                  navigation={navigation}
                  isAr
                  label={car?.name || (isAr ? 'اختر السيارة' : 'Select car')}
                  onLabelPress={() => carSheetRef.current?.open()}
                />
              ) : (
                <HeaderRight navigation={navigation} isAr={false} />
              ),
          })}
        />
        <Drawer.Screen
          name="BecomeStreamer"
          component={BecomeStreamer}
          options={({ navigation }) => ({
            headerShown: true,
            headerTransparent: true,
            title: '',
            headerLeft: () => null,
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 16 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Drawer.Screen
          name="RegisterSteamer"
          component={RegisterSteamer}
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
          name="ChoosePackages"
          component={ChoosePackages}
          options={({ navigation }) => ({
            headerShown: true,
            title: isAr ? 'اختر الباقات' : 'My Packages',
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
            title: isAr ? 'من نحن' : 'About Us',
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
            title: isAr ? 'تفاصيل الحجز' : 'Booking Details',
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

      <RBSheet
        ref={carSheetRef}
        height={420}
        openDuration={250}
        {...{ closeOnDragDown: true }}
        customStyles={{
          container: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 8,
          },
          draggableIcon: {
            backgroundColor: '#E5E7EB',
          },
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111' }}>
            {isAr ? 'اختر سيارتك' : 'Select your car'}
          </Text>
          {/* {car?.number && (
            <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
              {car.number}
            </Text>
          )} */}
        </View>

        <View style={{ flex: 1 }}>
          {carsLoading ? (
            <View style={{ paddingVertical: 24, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color="#223671" />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              {cars.map(item => {
                const isSelected = car?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={async () => {
                      setCar(item);
                      await setCarProfile(item);
                      DeviceEventEmitter.emit('CAR_CHANGED', item);
                      carSheetRef.current?.close();
                    }}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 12,
                      marginBottom: 10,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected ? '#223671' : '#E5E7EB',
                      backgroundColor: isSelected ? '#EEF2FF' : '#F9FAFB',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        backgroundColor: item.color || '#E5E7EB',
                        marginRight: 10,
                        borderWidth: 1,
                        borderColor: '#D1D5DB',
                      }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 14, fontWeight: '600', color: '#111' }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}
                      >
                        {item.brand?.displayName} • {item.type?.displayName}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}
                      >
                        {item.number} • {item.city}
                      </Text>
                    </View>

                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                    )}
                  </TouchableOpacity>
                );
              })}

              {cars.length === 0 && !carsLoading && (
                <Text style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 16 }}>
                  {isAr ? 'لا توجد سيارات مضافة بعد.' : 'No cars added yet.'}
                </Text>
              )}
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            carSheetRef.current?.close();
            rootNavigation.navigate('Vehicle', { forceCityModal: true });
          }}
          style={{
            marginTop: 8,
            marginBottom: 12,
            paddingVertical: 12,
            borderRadius: 999,
            backgroundColor: '#223671',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
            {isAr ? 'إضافة سيارة جديدة' : 'Add new car'}
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </SafeAreaView>
  );
};

export default MyDrawer;

const HeaderLeft = ({ navigation, isAr, label, onLabelPress }: any) => {
  return (
    <View style={{ flexDirection: isAr ? 'row-reverse' : 'row', alignItems: 'center' }}>
      <SvgWrapper
        xml={Icons.menuIcon}
        width={22}
        height={22}
        style={{ marginLeft: isAr ? 12 : 16, marginRight: isAr ? 16 : 12 }}
        icon
        onPress={() => navigation.toggleDrawer()}
      />

      {label && (
        <TouchableOpacity
          onPress={onLabelPress}
          activeOpacity={0.8}
          style={{
            flexDirection: isAr ? 'row-reverse' : 'row',
            alignItems: 'center',
            marginLeft: isAr ? 0 : 8,
            marginRight: isAr ? 8 : 0,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              maxWidth: 200,
              fontSize: 16,
              letterSpacing: 0.8,
              fontWeight: '400',
              color: '#111',
              textAlign: isAr ? 'right' : 'left',
            }}
          >
            {label}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#111"
            style={{
              marginLeft: isAr ? 0 : 4,
              marginRight: isAr ? 4 : 0,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const HeaderRight = ({ navigation, isAr }: any) => {
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
      style={{ marginRight: isAr ? 0 : 16, marginLeft: isAr ? 16 : 0 }}
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
