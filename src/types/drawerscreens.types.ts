import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type DrawerStackParamList = {
  Home: undefined;
};

export type TNavProps = NativeStackScreenProps<DrawerStackParamList, 'Home'>;
