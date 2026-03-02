import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type DrawerStackParamList = {
  Home: undefined;
  HireUs: undefined;
  BookingDetails: undefined;
  ChoosePackages: undefined;
  OurFeatures: undefined;
  AboutUs: undefined;
  Profile: undefined;
  BecomeStreamer: undefined;
  RegisterSteamer: undefined;

  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  RefundPolicy: undefined;
  ContactUs: undefined;
};

type ScreenProps<T extends keyof DrawerStackParamList> = NativeStackScreenProps<
  DrawerStackParamList,
  T
>;

export type TNavProps = ScreenProps<'Home'>;
export type THireUsScreenProps = ScreenProps<'HireUs'>;
