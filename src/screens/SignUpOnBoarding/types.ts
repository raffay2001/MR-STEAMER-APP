import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';

type TNavigationalProps = NativeStackScreenProps<
  RootStackParamList,
  'SignUpOnBoarding'
>;
type TComponentProps = {};

export type TSignUpOnBoardingProps = TNavigationalProps & TComponentProps;
