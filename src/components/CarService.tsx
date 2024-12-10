import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface CarServiceProps {
  item: string;
}
export const CarService: React.FC<CarServiceProps> = ({item}) => {
  return (
    <View>
      <Text>{item}</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
