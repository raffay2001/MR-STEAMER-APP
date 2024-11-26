import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
type TComponentProps = {};

export type TRegisterProps = TNavigationalProps & TComponentProps;
