import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<
  RootStackParamList,
  'SplashScreen'
>;

type TComponentProps = {};

export type TSplashScreenProps = TNavigationalProps & TComponentProps;
