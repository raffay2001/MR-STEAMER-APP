import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface CarServiceProps {
  item: string;
}
export const CarService: React.FC<CarServiceProps> = ({item}) => {
  return (
    <View className="border-2 border-gray-300 m-4 rounded-md h-48">
      <Text>{item}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
