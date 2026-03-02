import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { RECTANGLE } from '../assets';
const ArrivalTime = () => {
  return (
    <TouchableOpacity className="h-[70px] w-full">
      <ImageBackground
        source={RECTANGLE}
        className="justify-center items-center p-2">
        <View>
          <Text className="text-sm text-white text-center">Arrival Time</Text>
          <Text className="text-sm text-white text-center">
            Today, 10PM to 11PM
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ArrivalTime;

const styles = StyleSheet.create({});
