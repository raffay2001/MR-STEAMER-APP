import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

type TComponentProps = {};

export type TWelcomeProps = TNavigationalProps & TComponentProps;
