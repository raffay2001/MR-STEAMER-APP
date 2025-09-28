import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../services/types';
import {AuthNavStackParamList} from '../../navigation/navigation.types';

// type TNavigationalProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
type TNavigationalProps = NativeStackScreenProps<AuthNavStackParamList, 'Login'>;

type TComponentProps = {};

export type TLoginProps = TNavigationalProps & TComponentProps;
