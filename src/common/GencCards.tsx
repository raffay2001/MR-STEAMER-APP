import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import CardVendor from '../assets/images/car-vendor.png';
import StarRating from 'react-native-star-rating-widget';
interface CarServiceProps {
  item: string;
}

interface BookingDetailCardProps {
  item: string;
}

interface BookingCheckoutCardProps {
  BookingId: string;
  Package: string;
  Details: string;
}

export const CarService: React.FC<CarServiceProps> = ({item}) => {
  return (
    <View className="px-5  mb-2">
      <View
        style={{borderColor: 'silver', borderWidth: 0.5}}
        className="rounded-2xl p-4">
        <View className="flex-row justify-between">
          <View className="flex-row flex-1 gap-x-3">
            <Image source={CardVendor} className="rounded-sm" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-black">
                Car Service
              </Text>
              <View className="flex-row items-center">
                <StarRating
                  rating={4}
                  starSize={20}
                  maxStars={4}
                  onChange={() => null}
                />
                <Text className="text-sm text-black">{'(500)'}</Text>
              </View>
              <View className="mt-2 p-1 rounded-2xl bg-[#419500] w-[100px] items-center">
                <Text className="text-white">Certified</Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{borderTopWidth: 0.5, borderColor: 'silver'}}
          className="mt-5 pt-2 flex-row justify-between">
          <Text className="text-black text-sm">{item}</Text>
          <Text className="text-black text-sm">20 SAR</Text>
        </View>
      </View>
    </View>
  );
};

export const BookingDetailsCard: React.FC<BookingDetailCardProps> = ({
  item,
}) => {
  return (
    <View className="px-5  mb-2">
      <View
        style={{borderColor: 'silver', borderWidth: 0.5}}
        className="rounded-2xl p-4">
        <View className="flex-row justify-between">
          <View className="flex-row flex-1 gap-x-3 mb-8">
            <Image source={CardVendor} className="rounded-sm" />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-black">
                Car Service
              </Text>
            </View>
          </View>
        </View>
        <View style={{borderTopWidth: 0.5, borderColor: 'silver'}}>
          <Text className="font-bold text-blue-500 text-lg">Services</Text>
        </View>
        <View className="mt-5 pt-2 flex-row justify-between">
          <Text className="text-black text-sm">{item}</Text>
          <Text className="text-black text-sm">20 SAR</Text>
        </View>
        <Text>{item}</Text>
        <Text>20 SAR</Text>
        <View>
          <Text className="self-center text-green-400">Successful</Text>
        </View>
      </View>
    </View>
  );
};

export const BookingCheckOutCard: React.FC<BookingCheckoutCardProps> = ({
  BookingId,
  Package,
  Details,
}) => {
  return (
    <View className="mb-2">
      <View
        style={{
          borderColor: 'silver',
          borderWidth: 0.5,
          backgroundColor: '#7b8ab7',
          opacity: 0.7,
        }}
        className="rounded-2xl p-4">
        <View className="flex-row justify-between">
          <View className="flex-row flex-1 gap-x-3">
            <View className="flex-1">
              <Text className="text-lg text-black py-3">
                Your Booking: {BookingId}
              </Text>
              <Text className="text-lg  text-black py-3">
                Package: {Package}
              </Text>
              <Text className="text-lg  text-black py-3">
                Detail: {Details}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
