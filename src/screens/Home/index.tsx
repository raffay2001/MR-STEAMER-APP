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
import {TNavProps} from '../../services/types/drawerscreens.types';
import SearchInput from '../../components/SearchInput';
import BlackCar from '../../assets/images/black-car.png';

import Rectangle from '../../assets/images/rectangle.png';
import {CarService} from '../../common/GencCards';
import {TimePicker} from '../../components/TimePicker';
import {SERVICES} from '../../constants';
import ArrivalTime from '../../common/ArrivalTime';

const showModal = () => {
  return <TimePicker />;
};

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
            {SERVICES?.map(service => (
              <ServiceCard service={service} key={service.label} />
            ))}
          </ScrollView>
        </View>
        <View className="px-5 my-6 flex-row justify-between items-center">
          <HomeButtons />
        </View>
        <CarService item="Cars Detailing" />
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
      <ArrivalTime />
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
