import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type DrawerStackParamList = {
  Home: undefined;
  BecomeStreamer: undefined;
  HireUs: undefined;
  BookingDetails: undefined;
  ChoosePackages: undefined;
  OurFeatures: undefined;
  AboutUs: undefined;
  Profile: undefined;
};

type ScreenProps<T extends keyof DrawerStackParamList> = NativeStackScreenProps<
  DrawerStackParamList,
  T
>;

export type TNavProps = ScreenProps<'Home'>;
export type BecomeStreamerScreenProps = ScreenProps<'BecomeStreamer'>;
export type THireUsScreenProps = ScreenProps<'HireUs'>;
export type TDetailsScreenProps = ScreenProps<'BookingDetails'>;
