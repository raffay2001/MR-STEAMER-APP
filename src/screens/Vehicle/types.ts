import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<RootStackParamList, 'Vehicle'>;
type TComponentProps = {};

export type TVehicleProps = TNavigationalProps & TComponentProps;

export type TcarCardProps = {
  img: any;
  color: string;
  text: string;
};
