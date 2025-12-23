import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppNavStackParamList } from './navigation.types';
import {
  Vehicle,
  CheckOut,
  Filters,
  Package,
  YourBooking,
  Success,
  BookingDetailsPage,
  PrePackage,
} from '../screens';
import MyDrawer from './Drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VEHICLE_SETUP_DONE } from '../constants';
import i18n from '../i18n';
import PackageDetails from '../screens/PackageDetails';
import BuyNow from '../screens/BuyNow';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator<AppNavStackParamList>();

const App_Screens: React.FC = () => {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [firstRoute, setFirstRoute] = useState<'Vehicle' | 'Drawer'>('Vehicle');

  useEffect(() => {
    (async () => {
      const done = await AsyncStorage.getItem(VEHICLE_SETUP_DONE);
      setFirstRoute(done ? 'Drawer' : 'Vehicle');
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator initialRouteName={firstRoute}>
      <Stack.Screen
        name="Drawer"
        component={MyDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Filters"
        component={Filters}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'الفلاتر' : 'Filters',
          title: t('headers.filters'),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="PackageDetails"
        component={PackageDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BuyPackage"
        component={BuyNow}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrePackage"
        component={PrePackage}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'خدمة السيارة' : 'Car Service',
          title: t('headers.carService'),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Package"
        component={Package}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'الباقات' : 'Packages',
          title: t('headers.packages'),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="YourBooking"
        component={YourBooking}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'حجزك' : 'Your Booking',
          title: t('headers.yourBooking'),
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'حجز ناجح' : 'Successful Booking',
          title: t('headers.successBooking'),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="BookingDetailsPage"
        component={BookingDetailsPage}
        options={{
          // title: i18n.language?.startsWith('ar') ? 'تفاصيل الحجز' : 'Booking Details',
          title: t('headers.bookingDetails'),
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Vehicle"
        component={Vehicle}
        options={{
          headerTitleAlign: 'center',
          // title: i18n.language?.startsWith('ar') ? 'المركبة' : 'Vehicle',
          title: t('headers.vehicle'),
        }}
      />
      <Stack.Screen
        name="CheckOut"
        component={CheckOut}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default App_Screens;
