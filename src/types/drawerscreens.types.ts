import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type DrawerStackParamList = {
  Home: undefined;
  BecomeStreamer: undefined;
  Features: undefined;
};

export type TNavProps = NativeStackScreenProps<DrawerStackParamList, 'Home'>;
export type BecomeStreamerScreenProps = NativeStackScreenProps<
  DrawerStackParamList,
  'BecomeStreamer'
>;
export type TFeaturesScreenProps = NativeStackScreenProps<
  DrawerStackParamList,
  'Features'
>;
