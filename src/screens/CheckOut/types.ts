import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../services/types';

type TNavigationalProps = NativeStackScreenProps<
  RootStackParamList,
  'CheckOut'
>;
type TComponentProps = {};

export type TCheckOutProps = TNavigationalProps & TComponentProps;
