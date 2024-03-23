/* eslint-disable prettier/prettier */
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import SilverCar from '../../assets/images/silver-car.png';
import RedCar from '../../assets/images/red-car.png';
import WhiteCar from '../../assets/images/white-car.png';
import {TcarCardProps} from './types';

const vehiclesData = [
  {
    color: '#E1DFA4',
    text: 'Sedan, coupe, sport, mini or similar',
    img: SilverCar,
  },
  {
    color: '#E3ECF1',
    text: 'SUV 5 seater, short pickups or similar',
    img: WhiteCar,
  },
  {
    color: '#F4E3E5',
    text: 'SUV 7 seater, long pickups or similar',
    img: RedCar,
  },
];

const Vehicle = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="px-6 py-4 mb-7 bg-[#F5F7FA]">
          <Text className="text-black text-sm">Select Vehicle Type</Text>
        </View>
        {vehiclesData?.map((car, i) => (
          <CarCard key={i} img={car.img} text={car.text} color={car.color} />
        ))}
      </ScrollView>
    </View>
  );
};

const CarCard = ({img, text, color}: TcarCardProps) => {
  return (
    <TouchableOpacity
      style={{backgroundColor: color}}
      className={'mb-7 rounded-xl px-9 py-4 items-center mx-6'}>
      <Image source={img} />
      <Text className="text-black text-xl">{text}</Text>
    </TouchableOpacity>
  );
};

export default Vehicle;
