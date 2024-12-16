import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type DrawerStackParamList = {
  Home: undefined;
  BecomeStreamer: undefined;
  Features: undefined;
  AboutUs: undefined;
  HireUs: undefined;
  Packages: undefined;
  BookingDetails: undefined;
  BookingCheckout: undefined;
};

type ScreenProps<T extends keyof DrawerStackParamList> = NativeStackScreenProps<
  DrawerStackParamList,
  T
>;

export type TNavProps = ScreenProps<'Home'>;
export type BecomeStreamerScreenProps = ScreenProps<'BecomeStreamer'>;
export type TFeaturesScreenProps = ScreenProps<'Features'>;
export type TAboutScreenProps = ScreenProps<'AboutUs'>;
export type THireUsScreenProps = ScreenProps<'HireUs'>;
export type TPackagesScreenProps = ScreenProps<'Packages'>;
export type TDetailsScreenProps = ScreenProps<'BookingDetails'>;
export type TCheckoutScreenProps = ScreenProps<'BookingCheckout'>;
