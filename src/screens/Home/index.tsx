import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TNavProps} from '../../types/drawerscreens.types';
import SearchInput from '../../components/SearchInput';
import BlackCar from '../../assets/images/black-car.png';
import CarDetail from '../../assets/images/car-detail.png';
import Tyre from '../../assets/images/tyre-rep.png';
import Rectangle from '../../assets/images/rectangle.png';
import CardVendor from '../../assets/images/car-vendor.png';
import StarRating from 'react-native-star-rating-widget';

const Services = [
  {
    label: 'Car Detailing',
    img: CarDetail,
  },
  {
    label: 'Tyre Replacement',
    img: Tyre,
  },
  {
    label: 'Oil Change',
    img: CarDetail,
  },
];

export const Home: React.FC<TNavProps> = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 mt-3">
        <View className="px-5">
          <SearchInput
            placeholder="Search Company"
            onChangeText={(text: string) => console.log(text)}
          />
        </View>
        <View className="px-5 mt-6">
          <DealCard />
        </View>
        <View className="pl-5 mt-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Services?.map(service => (
              <ServiceCard service={service} key={service.label} />
            ))}
          </ScrollView>
        </View>
        <View className="px-5 my-6 flex-row justify-between items-center">
          <HomeButtons />
        </View>
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
              <Text className="text-black text-sm">Tyre Replaced</Text>
              <Text className="text-black text-sm">20 SAR</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ServiceCard = ({service}: {service: {label: string; img: any}}) => {
  return (
    <TouchableOpacity key={service.label} className="pr-3">
      <View className="w-[132px] h-[88px] rounded-3xl">
        <ImageBackground
          source={service.img}
          className="flex-1 justify-end items-center pb-2">
          <Text className="text-white text-lg font-bold text-center">
            {service.label}
          </Text>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const HomeButtons = () => {
  return (
    <>
      <TouchableOpacity
        style={{elevation: 10}}
        className="w-[47%] bg-white h-[70px] justify-center items-center rounded-lg">
        <Text className="text-lg text-black">Vehicle Sedan</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-[47%] h-[70px]">
        <ImageBackground
          source={Rectangle}
          className="flex-1 justify-center items-center p-2">
          <View>
            <Text className="text-sm text-white text-center">Arrival Time</Text>
            <Text className="text-sm text-white text-center">
              Today, 10PM to 11PM
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </>
  );
};

const DealCard = () => {
  return (
    <View className="bg-[#F5F7FA] rounded-3xl py-4 pr-4 items-center justify-center">
      <View className="flex-row items-center ">
        <Image source={BlackCar} />
        <View className="justify-between items-center flex-1">
          <Text className="text-base font-semibold  text-black text-center">
            Enjoy Our Aug Deals
          </Text>
          <View className="rounded-3xl p-2 mt-2 bg-[#223671] items-center justify-center w-[100px]">
            <Text className="text-white text-sm">30% off</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
