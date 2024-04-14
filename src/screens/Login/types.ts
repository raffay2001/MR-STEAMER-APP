import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type TComponentProps = {};

export type TLoginProps = TNavigationalProps & TComponentProps;
