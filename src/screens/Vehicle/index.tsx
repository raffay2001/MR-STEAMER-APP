import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  PressableProps,
} from 'react-native';
import React from 'react';
import {TVehicleProps, TcarCardProps} from './types';
import {VEHICLEDATA} from '../../constants';

const Vehicle: React.FC<TVehicleProps> = ({navigation}) => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="px-6 py-4 mb-7 bg-[#F5F7FA]">
          <Text className="text-black text-sm">Select Vehicle Type</Text>
        </View>
        {VEHICLEDATA?.map((car, i) => (
          <CarCard
            onPress={() => {
              navigation.navigate('Drawer', {screen: 'Home'});
            }}
            key={i}
            img={car.img}
            text={car.text}
            color={car.color}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const CarCard = ({
  img,
  text,
  color,
  ...props
}: TcarCardProps & PressableProps) => {
  return (
    <Pressable
      {...props}
      style={{backgroundColor: color}}
      className={'mb-7 rounded-xl px-9 py-4 items-center mx-6'}>
      <Image source={img} />
      <Text className="text-black text-xl">{text}</Text>
    </Pressable>
  );
};

export default Vehicle;
