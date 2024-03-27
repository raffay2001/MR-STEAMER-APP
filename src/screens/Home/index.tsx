import React from 'react';
import {Text, View} from 'react-native';
import {TNavProps} from '../../types/drawerscreens.types';
import {useGetTestQuery} from '../../api/auth.api';

export const Home: React.FC<TNavProps> = () => {
  const {data} = useGetTestQuery({limit: 3});
  console.log('🚀 ~ data:', data);
  return (
    <View>
      <Text>Homies</Text>
    </View>
  );
};
